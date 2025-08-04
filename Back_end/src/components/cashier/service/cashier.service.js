import ErrorBase from "../../../errors/base.error.js";
import Cashier from "../schemas/cashier.schema.js";
import bwipjs from "bwip-js";
import fs from 'fs'
import PDFDocument from 'pdfkit';

export default class CashierService {
  static async addCreditCartAtCashier(UserId, value){
    const cashier = await Cashier.findOne({ cashierUserLogin: UserId , active: true});
    if(!cashier) throw new ErrorBase('Caixa de usuário não encontrado!', 409);
    const cashierUpdated = await Cashier.findByIdAndUpdate(cashier._id, {$set: { creditCartValue: value, updatedAt: new Date(), updatedBy: UserId }}, { new: true});
    return cashierUpdated;
  }

  static async addDebitCartAtCashier(UserId, value){
    const cashier = await Cashier.findOne({ cashierUserLogin: UserId , active: true});
    if(!cashier) throw new ErrorBase('Caixa de usuário não encontrado!', 409);
    const cashierUpdated = await Cashier.findByIdAndUpdate(cashier._id, {$set: { debitCartValue: value, updatedAt: new Date(), updatedBy: UserId }}, { new: true});
    return cashierUpdated;
  }

  static async addPixAtCashier(UserId, value){
    const cashier = await Cashier.findOne({ cashierUserLogin: UserId , active: true});
    if(!cashier) throw new ErrorBase('Caixa de usuário não encontrado!', 409);
    const cashierUpdated = await Cashier.findByIdAndUpdate(cashier._id, {$set: { pixValue: value, updatedAt: new Date(), updatedBy: UserId }}, { new: true});
    return cashierUpdated;
  }

  static async addCashAtCashier(UserId, value){
    const cashier = await Cashier.findOne({ cashierUserLogin: UserId , active: true});
    if(!cashier) throw new ErrorBase('Caixa de usuário não encontrado!', 409);
    const cashierUpdated = await Cashier.findByIdAndUpdate(cashier._id, {$set: { cashValue: value, updatedAt: new Date(), updatedBy: UserId }}, { new: true});
    return cashierUpdated;
  }

  static async addVoucherPaymentAtCashier(UserId, value){
    const cashier = await Cashier.findOne({ cashierUserLogin: UserId , active: true});
    if(!cashier) throw new ErrorBase('Caixa de usuário não encontrado!', 409);
    const cashierUpdated = await Cashier.findByIdAndUpdate(cashier._id, {$set: { voucherClientValue: value }}, { new: true});
    return cashierUpdated;
  }

  static async getCashier(userId) {
    const cashier = await Cashier.findOne({ cashierUserLogin: userId, active: true });
    if (!cashier) {
      throw new Error('Caixa não encontrado para o usuário!');
    }
    return cashier;
  }

  static async updateCashierAmount(userId, newAmount) {
    const cashier = await Cashier.findOneAndUpdate(
      { cashierUserLogin: userId, active: true },
      { $set: { cashInCashier: newAmount , updatedAt: new Date(), updatedBy: userId} }, 
      { new: true } 
    );
    if (!cashier) {
      throw new Error('Não foi possível atualizar o caixa!');
    }
    return cashier;
  }
  
  static async exportCashierInPdf(cashier) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: [80, 297], // 80mm de largura x 297mm de altura
          margins: { top: 10, bottom: 10, left: 10, right: 10 },
        });
  
        const filePath = `./temp/cashier_${cashier._id}_${Date.now()}.pdf`;
        const fileStream = fs.createWriteStream(filePath);
  
        fileStream.on('finish', () => resolve(filePath));
        fileStream.on('error', (err) => reject(err));
  
        doc.pipe(fileStream);
  
        this.addHeader(doc);
        await this.addSummary(doc, cashier);
  
        const qrCodeBuffer = await this.createQrCodeBuffer(cashier._id);
        
        doc.image(qrCodeBuffer, (doc.page.width - 20) / 2, doc.y, { width: 20 });
  
        this.addFooter(doc);
  
        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }  

  static async createQrCodeBuffer(text) {
    const qrCodeBuffer = await new Promise((resolve, reject) => {
      bwipjs.toBuffer(
        {
          bcid: 'qrcode',
          text: text.toString(),
          scale: 1,
          width: 10,
          height: 10,
          includetext: false,
          textxalign: 'center'
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

  static addHeader(doc) {
    doc
      .fontSize(6)
      .text('JQ Shop', { align: 'center' })
      .moveDown(0.5)
      .fontSize(3)
      .text('Rua Talmud Thora, 156 - Bom Retiro\nSão Paulo 01126-020 - SP', { align: 'center' })
      .moveDown(1);
    const startX = doc.page.margins.left;
    let y = doc.y;
    const colWidths = [8, 32, 8, 12]; 
    doc.lineWidth(0.5).moveTo(startX, y).lineTo(startX + colWidths.reduce((a, b) => a + b), y).stroke();
    doc.moveDown(0.5)
  }
  
  
  static async addSummary(doc, cashier) {
    const totalSales = cashier.cashValue + cashier.creditCartValue + cashier.debitCartValue + cashier.pixValue;
    const summary = [
      ['Fundo de caixa:', `R$ ${cashier.cashInCashier.toFixed(2)}`],
      ['Vendas em dinheiro:', `R$ ${cashier.cashValue.toFixed(2)}`],
      ['Vendas no crédito:', `R$ ${cashier.creditCartValue.toFixed(2)}`],
      ['Vendas no débito:', `R$ ${cashier.debitCartValue.toFixed(2)}`],
      ['Vendas no pix:', `R$ ${cashier.pixValue.toFixed(2)}`],
      ['Total em vendas:', `R$ ${totalSales.toFixed(2)}`],
    ];
  
    const pageWidthWithoutMargin = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const columnWidth = pageWidthWithoutMargin / 2;
  
    summary.forEach(([label, value]) => {
      const y = doc.y;
      const leftX = doc.page.margins.left;
      const rightX = leftX + columnWidth;
  
      doc.fontSize(3).text(label, leftX, y, { width: columnWidth, align: 'left' });
      doc.text(value, rightX, y, { width: columnWidth, align: 'right' });
      doc.moveDown(0.3); // Reduzido o espaçamento
    });
    const startX = doc.page.margins.left;
    let y = doc.y;
    const colWidths = [8, 32, 8, 12]; 
    doc.lineWidth(0.5).moveTo(startX, y).lineTo(startX + colWidths.reduce((a, b) => a + b), y).stroke();
    doc.moveDown(5); 
  }
  
  static addFooter(doc) {
    doc.moveDown(7);
    if (doc.y + 10 > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
    const y = doc.y;
    const leftX = doc.page.margins.left;
    doc.fontSize(3).text('Obrigado pela preferência!', leftX, y, { align: 'center' }).moveDown(0.5);
  }

}