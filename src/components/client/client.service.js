import NotFound from "../../errors/notFound.error.js";
import Client from "./schema/client.schema.js";
import crypto from 'crypto'

export default class ClientService{
  static async validClient(clientId) {
    const client = await Client.findById(clientId);
      if (!client) {
        throw new NotFound('Cliente não encontrado.');
      }
    return true
  }

  static async generateCode() {
    try {
      let isUnique = false;
      let code;

      while (!isUnique) {
        const uuid = crypto.randomUUID(); 

        code = uuid.replace(/-/g, '').substring(0, 12).toUpperCase();

        const existingCode = await Client.findOne({
          voucher: { $elemMatch: { code } }
        });
        if (!existingCode) {
          isUnique = true; 
        }
      }

      return code;
    } catch (error) {
      throw new Error(`Erro ao gerar código único: ${error.message}`);
    }
  }

  static async validVoucher(voucher) {
    try {
      if (!voucher) {
        throw new Error('O campo "voucher" é obrigatório.');
      }
      if (typeof voucher.value !== 'number') {
        throw new Error(`O campo "value" deve ser um número. Valor recebido: ${voucher.value}`);
      }
      if (typeof voucher.code !== 'string') {
        throw new Error(`O campo "code" deve ser uma string. Valor recebido: ${voucher.code}`);
      }  
      if (!voucher.createdBy || !voucher.createdBy.toString().match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error(`O campo "createdBy" deve ser um ObjectId válido. Valor recebido: ${voucher.createdBy}`);
      }

      return true;
    } catch (error) {
      throw new Error(`Validação do voucher falhou: ${error.message}`);
    }
  }
  
}