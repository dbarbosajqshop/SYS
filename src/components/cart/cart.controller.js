import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import CartService from "./cart.service.js";
import Cart from "./schema/cart.schema.js";
import PDFDocument from "pdfkit";
import User from "../auth/schema/user.schema.js";
import Client from "../client/schema/client.schema.js";
import Item from "../item/schema/item.schema.js";

export default class CartController {
  static async showCatalogItems(req, res, next) {
    try {
      // Garante que o limite máximo seja 30
      if (req.query.limit && parseInt(req.query.limit) > 30) req.query.limit = 30;
      else if (!req.query.limit) req.query.limit = 30;

      const aggregatedItems = await CartService.aggregateItems(req.query);
      req.result = aggregatedItems;
      next();
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  static async showCatalogItemById(req, res, next) {
    const { id } = req.params;
    try {
      const aggregatedItem = await CartService.aggregateItemById(id);
      if (!aggregatedItem) return next(new NotFound("Item não encontrado."));
      return res.status(200).send(aggregatedItem);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  static async getCartById(req, res, next) {
    try {
      const cart = await CartService.getCart(req.userId);
      if (!cart) return next(new NotFound("Carrinho não encontrado."));

      return res.status(200).send(cart);
    } catch (err) {
      if (err.message) return next(new NotFound(`${err.message}`));

      return next(err);
    }
  }

  static async createEmptyCart(req, res, next) {
    try {
      const cartFounded = await CartService.getCart(req.userId);
      if (!cartFounded) {
        const cart = { createdBy: req.userId, status: "aberto" };

        const newCart = await CartService.createEmptyCart(cart);
        return res.status(201).send(newCart);
      }
      return res.status(200).send(cartFounded);
    } catch (err) {
      return next(err);
    }
  }

  static async exportCartToPDF(req, res, next) {
    try {
      const {
        Items,
        ClientId,
        SellerId,
        itemsQuantity,
        orderNumber,
        totalPrice,
        subtotalPrice,
        discount,
        local,
        ReceiptPayments,
        typeOfDelivery,
        status,
      } = req.body;

      if (!Items || !SellerId)
        return res.status(400).json({ message: "Campos obrigatórios ausentes." });

      let client;

      if (ClientId) {
        client = await Client.findById(ClientId);
        if (!client) return res.status(404).json({ message: "Cliente não encontrado." });
      }

      const seller = await User.findById(SellerId);
      if (!seller) return res.status(404).json({ message: "Vendedor não encontrado." });

      // Criação do documento PDF com tamanho personalizado
      const doc = new PDFDocument({
        size: "A6", // Tamanho em milímetros convertido para pontos
        margins: { top: 10, bottom: 10, left: 10, right: 10 },
      });

      const buffers = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=cart_${Date.now()}.pdf`
        );
        res.send(pdfBuffer);
      });

      doc.fontSize(20).text("JQ Shop", { align: "center" }).moveDown(0.5);
      doc
        .fontSize(10)
        .text("Rua Talmud Thora, 156 - Bom Retiro \nSão Paulo 01126-020 - SP", {
          align: "center",
        })
        .moveDown(1);

      doc.moveDown(1);
      doc.fontSize(14).text(`Pedido nº: ${orderNumber || "N/A"}`, { align: "center" });
      doc.moveDown(1.5);

      // Função para desenhar o cabeçalho
      const drawHeader = () => {
        doc.fontSize(16).text("Itens:");
        doc.lineWidth(0.5);
        doc.moveTo(10, doc.y).lineTo(280, doc.y).stroke(); // Linha separadora
        doc.moveDown(0.5);
      };

      // Função para verificar o espaço restante na página
      const checkPageSpace = (neededSpace) => {
        if (doc.y + neededSpace > doc.page.height - doc.page.margins.bottom) {
          doc.addPage();
          drawHeader(); // Redesenha o cabeçalho na nova página
        }
      };

      doc.fontSize(12).text(`Cliente: ${client?.name || "N/A"}`);
      doc.text(`E-mail: ${client?.email || "N/A"}`);
      doc.moveDown(0.5);

      doc.text(`Vendedor: ${seller.name || "N/A"}`);
      doc.text(`E-mail do Vendedor: ${seller.email || "N/A"}`);
      doc.moveDown(1);
      doc.text(`Status: ${status}`);
      doc.text(`Local: ${local}`);
      doc.moveDown(1);

      // Desenha o cabeçalho inicial
      drawHeader();

      // Adiciona os itens ao PDF
      for (const item of Items) {
        // checkPageSpace(15); // Verifica o espaço necessário para cada item

        const validItem = await Item.findById(item.ItemId);
        if (validItem) {
          doc
            .fontSize(12)
            .text(
              `${validItem.name || "sem nome"} - Quantidade: ${item.quantity || 0} ${
                item.type === "unit" ? "Unidade(s)" : "Caixa(s)"
              }`
            );
        } else {
          doc.fontSize(12).text(`${item.ItemId}. Item não encontrado.`);
        }
      }
      doc.moveDown(0.5);
      doc.lineWidth(0.5);
      doc.moveTo(10, doc.y).lineTo(280, doc.y).stroke();
      doc.moveDown(1);

      const margin = 10; // Margem lateral
      const pageWidth = doc.page.width; // Largura total da página
      const columnWidth = (pageWidth - margin * 2) / 2; // Largura de cada coluna

      // Dados para exemplo
      const itensLabel = "Total de itens:";
      const typeOfPaymentLabel = "Tipos de Pagamento:";
      const typeOfDeliveryLabel = "Tipo de Entrega:";
      const subtotalPriceLabel = "Subtotal:";
      const discountLabel = "Desconto:";
      const totalPriceLabel = "Total:";
      doc.fontSize(12);
      doc.text(itensLabel, margin, doc.y, {
        width: columnWidth, // Define a largura da coluna
        align: "left", // Alinhamento do texto
      });
      doc.text(itemsQuantity, margin + columnWidth, doc.y - 10, {
        width: columnWidth, // Define a largura da coluna
        align: "right", // Alinhamento do texto
      });
      doc.text(typeOfPaymentLabel, margin, doc.y, {
        width: columnWidth, // Define a largura da coluna
        align: "left", // Alinhamento do texto
      });
      doc.text(
        ReceiptPayments.map((payment) => {
          switch (payment.type) {
            case "credito":
              return "Crédito";
            case "debito":
              return "Débito";
            case "machinepix":
              return "Pix maquininha";
            case "keypix":
              return "Pix QR Code";
            case "dinheiro":
              return "Dinheiro";
            case "ted":
              return "TED";
            default:
              return "";
          }
        }),
        margin + columnWidth,
        doc.y - 10,
        {
          width: columnWidth, // Define a largura da coluna
          align: "right", // Alinhamento do texto
        }
      );

      doc.text(typeOfDeliveryLabel, margin, doc.y, {
        width: columnWidth, // Define a largura da coluna
        align: "left", // Alinhamento do texto
      });
      doc.text(typeOfDelivery, margin + columnWidth, doc.y - 10, {
        width: columnWidth, // Define a largura da coluna
        align: "right", // Alinhamento do texto
      });

      doc.text(subtotalPriceLabel, margin, doc.y, {
        width: columnWidth, // Define a largura da coluna
        align: "left", // Alinhamento do texto
      });
      doc.text(
        `${
          subtotalPrice?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || 0
        }`,
        margin + columnWidth,
        doc.y - 10,
        {
          width: columnWidth, // Define a largura da coluna
          align: "right", // Alinhamento do texto
        }
      );

      doc.text(discountLabel, margin, doc.y, {
        width: columnWidth, // Define a largura da coluna
        align: "left", // Alinhamento do texto
      });
      doc.text(
        `${
          discount?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || 0
        }`,
        margin + columnWidth,
        doc.y - 10,
        {
          width: columnWidth, // Define a largura da coluna
          align: "right", // Alinhamento do texto
        }
      );

      doc.text(totalPriceLabel, margin, doc.y, {
        width: columnWidth, // Define a largura da coluna
        align: "left", // Alinhamento do texto
      });
      doc.text(
        `${
          totalPrice?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }) || 0
        }`,
        margin + columnWidth,
        doc.y - 10,
        {
          width: columnWidth, // Define a largura da coluna
          align: "right", // Alinhamento do texto
        }
      );
      doc.moveDown(1);

      // Finaliza o documento PDF
      doc.end();
    } catch (error) {
      console.error("Erro ao gerar o PDF:", error);
      res.status(500).json({ message: error.message || "Erro ao gerar o PDF." });
    }
  }

  static async sellOrder(req, res, next) {
    const { id } = req.params;
    let { discount } = req.body;
    const {
      Items,
      ClientId,
      SellerId,
      itemsQuantity,
      totalQuantity,
      local,
      observation,
      payments,
      typeOfPayment,
      typeOfDelivery,
    } = req.body;
    try {
      const user = await User.findById(req.userId).populate({
        path: "Roles",
        populate: { path: "permissions" },
      });
      const permissions = user.Roles.flatMap((role) =>
        role.permissions.map((p) => p.name)
      );

      if (!permissions.includes("w_sp_discount")) discount = 0;

      const cartFounded = await Cart.findOne({ _id: id, active: true });
      if (!cartFounded) return next(new NotFound("Carrinho não encontrado!"));

      await CartService.validItems(Items);
      if (ClientId) await CartService.validClient(ClientId);

      await CartService.validSeller(SellerId);

      const { calculatedSubtotal, calculatedTotalPrice } = await CartService.validValue(
        Items,
        discount,
        payments
      );

      const { totalPaid } = await CartService.validPayments(
        payments,
        calculatedTotalPrice
      );

      const cartData = {
        Items,
        ClientId,
        SellerId,
        itemsQuantity,
        totalQuantity,
        discount,
        local,
        observation,
        subtotalPrice: calculatedSubtotal,
        totalPrice: calculatedTotalPrice,
        totalPaid,
        typeOfPayment,
        typeOfDelivery,
        createdBy: req.userId,
      };

      if (
        !permissions.includes("w_seller_online") &&
        !permissions.includes("w_seller_local")
      )
        return res
          .status(403)
          .json({ message: "Acesso negado: Permissão insuficiente." });

      if (permissions.includes("w_seller_online")) {
        const saveOrder = await CartService.sellOrder(cartData, payments);
        await Cart.findByIdAndUpdate(id, { $set: { active: false, status: "fechado" } });
        return res.send(saveOrder);
      }

      const saveOrder = await CartService.sellOrderLocal(cartData, req.userId, payments);
      await Cart.findByIdAndUpdate(id, { $set: { active: false, status: "fechado" } });
      return res.send(saveOrder);
    } catch (err) {
      // console.error(err)
      if (err.message) {
        return next(new ErrorBase(`${err.message}`, 400));
      }
      return next(err.message);
    }
  }

  static async updateCart(req, res, next) {
    const { id } = req.params;
    const { Items, ClientId } = req.body;
    try {
      await CartService.validItems(Items);
      if (ClientId) await CartService.validClient(ClientId);

      const cartData = {
        ...req.body,
        updatedBy: req.userId,
      };

      const updatedCart = await Cart.findByIdAndUpdate(
        id,
        { $set: cartData },
        { new: true }
      );

      if (!updatedCart)
        return next(new NotFound("Carrinho não encontrado para atualizar."));

      return res.status(200).send(updatedCart);
    } catch (err) {
      console.error("Erro ao atualizar carrinho:", err);
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      return next(err);
    }
  }

  static async closeCart(req, res, next) {
    try {
      const cartFounded = await Cart.findOne({
        createdBy: req.userId,
        active: true,
        status: "aberto",
      });
      if (cartFounded) {
        await Cart.findByIdAndUpdate(cartFounded._id, {
          $set: {
            active: false,
            status: "cancelado",
            updatedBy: req.userId,
            updatedAt: new Date(),
          },
        });
        return res.status(200).send("Carrinho desativado");
      } else {
        return next(new NotFound("Carrinho não encontrado para fechar"));
      }
    } catch (err) {
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      return next(err);
    }
  }
}
