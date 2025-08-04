import CartService from "../cart/cart.service.js";
import Item from "../item/schema/item.schema.js";
import ReservedItem from "../item/schema/reservedItem.schema.js";
import StockedItem from "../item/schema/stockedItem.schema.js";
import Order from "./schema/order.schema.js";
import bwipjs from "bwip-js";
import fs from "fs";
import PDFDocument from "pdfkit";

export default class OrderService {
  static async updateOrderItemStatus(orderId, itemId, status, type) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Ordem não encontrada.");
    }

    const itemIndex = order.Items.findIndex(
      (item) => item.ItemId.equals(itemId) && item.type === type
    );
    if (itemIndex === -1) {
      throw new Error("Item não encontrado na ordem.");
    }

    order.Items[itemIndex].itemStatus = status;

    await order.save();
  }

  static async updateOrderItemLocal(orderId, itemId, local, type) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Ordem não encontrada.");
    }

    const itemIndex = order.Items.findIndex(
      (item) => item.ItemId.equals(itemId) && item.type === type
    );
    if (itemIndex === -1) {
      throw new Error("Item não encontrado na ordem.");
    }

    order.Items[itemIndex].localToBeRemoved = local;
    await order.save();
  }

  static async updateStockItems(items, updatedBy, orderId) {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error("A lista de itens para atualização está inválida ou vazia.");
      }

      // Etapa 1: Validação
      for (const item of items) {
        const { ItemId, quantity, localToBeRemoved, type } = item;

        // Busca o StockedItem com o mesmo ItemId, local e type
        const stockedItem = await StockedItem.findOne({
          ItemId,
          local: localToBeRemoved,
          type,
        });

        const ItemDetail = await Item.findById(ItemId);

        const reservedItem = await ReservedItem.findOne({
          orderId,
          ItemId,
        });

        if (!ItemDetail) {
          throw new Error(`Item com ID ${ItemId} não encontrado.`);
        }

        if (!reservedItem) {
          throw new Error(`Item ${ItemDetail.name}, e tipo ${type} não possui reserva.`);
        }

        if (!stockedItem) {
          throw new Error(
            `Item ${ItemDetail.name}, local ${localToBeRemoved} e tipo ${type} não encontrado no estoque.`
          );
        }

        if (
          (reservedItem.quantityBox < quantity && type === "box") ||
          (reservedItem.quantityUnit < quantity && type === "unit")
        ) {
          throw new Error(
            `Quantidade insuficiente reservada para o item ${
              ItemDetail.name
            } no local ${localToBeRemoved}. Requisitado: ${quantity}, Disponível: ${
              type === "unit" ? reservedItem.quantityUnit : reservedItem.quantityBox
            }.`
          );
        }

        // Verifica se há quantidade suficiente no estoque
        if (stockedItem.quantity < quantity) {
          throw new Error(
            `Quantidade insuficiente no estoque para o item ${ItemDetail.name} no local ${localToBeRemoved}. Requisitado: ${quantity}, Disponível: ${stockedItem.quantity}.`
          );
        }
      }

      // Etapa 2: Atualização
      const updatedStockItems = await Promise.all(
        items.map(async (item) => {
          const { ItemId, quantity, localToBeRemoved, type } = item;

          const stockedItem = await StockedItem.findOne({
            ItemId,
            local: localToBeRemoved,
            type,
          });

          const reservedItem = await ReservedItem.findOne({
            orderId,
            ItemId,
          });

          // Atualiza a quantidade do item no estoque
          stockedItem.quantity -= quantity;
          stockedItem.updatedAt = new Date();
          stockedItem.updatedBy = updatedBy;

          reservedItem.updatedBy = updatedBy;
          reservedItem.active = false;

          await reservedItem.save();
          await stockedItem.save();

          return {
            ItemId,
            updatedQuantity: quantity,
            local: localToBeRemoved,
            type,
          };
        })
      );

      return updatedStockItems;
    } catch (error) {
      throw new Error(`Erro ao atualizar o estoque: ${error.message}`);
    }
  }

  static async updateOrderStatus(orderId, status, updatedBy) {
    try {
      const validStatuses = [
        "order",
        "pendente",
        "separacao",
        "conferencia",
        "docas",
        "transito",
        "entregue",
      ];
      if (!validStatuses.includes(status))
        throw new Error(
          `Status inválido. Os status permitidos são: ${validStatuses.join(", ")}`
        );

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status, updatedAt: new Date(), updatedBy },
        { new: true }
      );

      if (!updatedOrder) throw new Error("Pedido não encontrado.");

      return updatedOrder;
    } catch (error) {
      throw new Error(`Erro ao atualizar o status do pedido: ${error.message}`);
    }
  }

  static async saveSeparation(orderId, items, updatedBy) {
    const allItemsCorrect = items.every((item) => item.itemStatus === "correto");
    if (!allItemsCorrect) {
      await this.updateOrderStatus(orderId, "pendente");
      return {
        status: "pending",
        message: "Alguns itens não estão corretos. Ordem marcada como pendente.",
      };
    }

    await this.updateStockItems(items, updatedBy, orderId);
    await this.updateOrderStatus(orderId, "conferencia", updatedBy);
    return {
      status: "inProgress",
      message: "Separação salva com sucesso. Ordem atualizada para conferência.",
    };
  }

  static async createQrCodeBuffer(text) {
    const qrCodeBuffer = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: "qrcode",
          text: text.toString(),
          scale: 1,
          width: 10,
          height: 10,
          includetext: false,
          textxalign: "center",
        },
        (err, png) => {
          if (err) {
            return reject(err);
          }
          resolve(png);
        }
      );
    });
    return qrCodeBuffer;
  }

  static async createBarCodeBuffer(text) {
    const barCodeBuffer = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: "channelcode",
          text: text.toString(),
          scale: 1,
          width: 30,
          height: 10,
          includetext: false,
        },
        (err, png) => {
          if (err) {
            return reject(err);
          }
          resolve(png);
        }
      );
    });
    return barCodeBuffer;
  }

  static async exportTaxCouponInPdf(cartData) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: "A4", // Tamanho A4
          margins: { top: 20, bottom: 20, left: 20, right: 20 }, // Margens ajustadas
        });

        const buffers = [];
        doc.on("data", (chunk) => buffers.push(chunk));
        doc.on("end", () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Adicionar cabeçalho
        this.addHeader(doc, cartData);

        // Adicionar tabela de itens
        await this.addItemsTableWithHeader(doc, cartData.Items);

        // Adicionar resumo
        await this.addSummary(doc, cartData);

        // Adicionar QR Code e código de barras
        const qrCodeBuffer = await this.createQrCodeBuffer(cartData.orderNumber);
        const barCodeBuffer = await this.createBarCodeBuffer(cartData.orderNumber);

        doc
          .image(qrCodeBuffer, (doc.page.width - 50) / 2, doc.y, {
            width: 50,
          })
          .moveDown(7);

        doc
          .image(barCodeBuffer, (doc.page.width - 100) / 2, doc.y, {
            width: 100,
          })
          .moveDown(5);

        // Adicionar rodapé
        this.addFooter(doc);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  static addHeader(doc, order) {
    doc
      .fontSize(12)
      .text("JQ Shop", { align: "center" })
      .moveDown(0.5)
      .fontSize(8)
      .text("Rua Talmud Thora, 156 - Bom Retiro\nSão Paulo 01126-020 - SP", {
        align: "center",
      })
      .moveDown(0.5)
      .text(
        new Date(order.dateOfOrder).toLocaleString("pt-BR", {
          timeZone: "UTC",
        }),
        { align: "center" }
      )
      .moveDown(1);
  }

  static async addItemsTableWithHeader(doc, items) {
    const colWidths = [30, 300, 80, 60, 80]; // Larguras ajustadas para A4
    const startX = doc.page.margins.left;
    let y = doc.y;

    // Cabeçalho da tabela
    doc.fontSize(10);
    doc.text("Nº", startX, y, { width: colWidths[0], align: "left" });
    doc.text("Descrição", startX + colWidths[0], y, {
      width: colWidths[1],
      align: "left",
    });
    doc.text("Tipo", startX + colWidths[0] + colWidths[1], y, {
      width: colWidths[2],
      align: "center",
    });
    doc.text("Quantidade", startX + colWidths[0] + colWidths[1] + colWidths[2], y, {
      width: colWidths[3],
      align: "center",
    });
    doc.text(
      "Preço",
      startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
      y,
      {
        width: colWidths[4],
        align: "right",
      }
    );
    y += 15;

    // Linha separadora
    doc
      .lineWidth(0.5)
      .moveTo(startX, y)
      .lineTo(startX + colWidths.reduce((a, b) => a + b), y)
      .stroke();
    y += 10;

    // Processar os itens
    const taxedItems = await CartService.taxItems(items);
    doc.fontSize(8);

    for (let i = 0; i < taxedItems.length; i++) {
      const item = taxedItems[i];
      const validItem = await Item.findById(item.ItemId);
      const description = validItem ? validItem.name : "Item não encontrado";
      const type = item.type === "box" ? "Caixa" : "Unidade";
      const quantity = item.quantity || 0;
      const unitPrice = item?.itemTotalPrice || 0;

      // Verificar se há espaço suficiente na página para o próximo item
      if (y + 20 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        y = doc.y;
      }

      // Renderizar os dados do item
      doc.text(`${i + 1}`, startX, y, { width: colWidths[0], align: "left" });

      // Quebrar o texto da descrição automaticamente
      const descriptionHeight = doc.heightOfString(description, {
        width: colWidths[1],
      });
      doc.text(description, startX + colWidths[0], y, {
        width: colWidths[1],
        align: "left",
        lineBreak: true,
      });

      doc.text(`${type}`, startX + colWidths[0] + colWidths[1], y, {
        width: colWidths[2],
        align: "center",
      });

      doc.text(`${quantity}`, startX + colWidths[0] + colWidths[1] + colWidths[2], y, {
        width: colWidths[3],
        align: "center",
      });

      doc.text(
        unitPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
        y,
        {
          width: colWidths[4],
          align: "right",
        }
      );

      // Ajustar a posição vertical com base na altura do texto da descrição
      y += Math.max(15, descriptionHeight + 5); // Incrementar a altura com base no texto
    }

    // Linha final da tabela
    doc.moveDown(3);
    doc
      .lineWidth(0.5)
      .moveTo(startX, y)
      .lineTo(startX + colWidths.reduce((a, b) => a + b), y)
      .stroke();
  }

  static async addSummary(doc, cartData) {
    const summary = [
      ["Pedido Nº:", cartData.orderNumber],
      ["Entrega:", cartData.typeOfDelivery],
      ["Status:", cartData.status],
      ["Total Itens:", cartData.totalQuantity],
      [
        "Desconto:",
        cartData.discount.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      ],
      [
        "Total:",
        cartData.totalPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
      ],
    ];

    const pageWidthWithoutMargin =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidth = pageWidthWithoutMargin / 2;

    summary.forEach(([label, value]) => {
      const y = doc.y;
      const leftX = doc.page.margins.left;
      const rightX = columnWidth + 10;

      doc.fontSize(8).text(label, leftX, y, { width: columnWidth, align: "left" });
      doc.text(value, rightX, y, { width: columnWidth, align: "right" });
      doc.moveDown(0.5);
    });
  }

  static addFooter(doc) {
    doc.moveDown(2);
    if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    const y = doc.y;
    const leftX = doc.page.margins.left;
    doc
      .fontSize(8)
      .text("Obrigado pela preferência!", leftX, y, { align: "center" })
      .moveDown(1);
  }
}
