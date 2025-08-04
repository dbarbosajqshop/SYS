import mongoose from "mongoose";
import OrderUpdateService from "./components/order/orderUpdate.service.js";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    const dbUri = process.env.MONGODB_URI;

    if (!dbUri) {
      throw new Error("A URI do banco de dados (MONGODB_URI) não foi encontrada no arquivo .env.");
    }

    console.log(`Conectando ao banco de dados: ${dbUri}`);
    await mongoose.connect(dbUri);

    console.log("Conectado ao banco de dados.");

    await OrderUpdateService.reserveItemsForOldOrders();

    console.log("Processo concluído.");
  } catch (err) {
    console.error("Erro ao executar o script:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("Conexão com o banco de dados encerrada.");
  }
})();