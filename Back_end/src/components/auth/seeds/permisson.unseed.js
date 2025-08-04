import mongoose from "mongoose";
import Permission from "../schema/permission.schema.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const environment = process.env.NODE_ENV || "development";
  const envFile =
    environment === "localhost" ? ".env.local" : `.env.${environment}`;
  dotenv.config({ path: envFile });
}

const dbUri = process.env.MONGODB_URI;

const permissions = [
  "sidebar_dashboard",
  "sidebar_report",
  "sidebar_stock",
  "sidebar_register",
  "sidebar_pdv",
  "r_user_all",
  "r_my_user",
  "w_user",
  "p_user",
  "u_user",
  "d_user",
  "r_stock",
  "w_stock",
  "u_stock",
  "d_stock",
  "r_street",
  "w_street",
  "u_street",
  "d_street",
  "r_build",
  "w_build",
  "u_build",
  "d_build",
  "r_floor",
  "w_floor",
  "u_floor",
  "d_floor",
  "r_items",
  "w_items",
  "u_items",
  "d_items",
  "r_role",
  "w_role",
  "u_role",
  "d_role",
  "r_permission",
  "w_permission",
  "u_permission",
  "d_permission",
  "r_stocked_item",
  "w_stocked_item",
  "u_stocked_item",
  "d_stocked_item",
  "r_money_account",
  "w_money_account",
  "u_money_account",
  "d_money_account",
  "r_cart",
  "w_cart",
  "u_cart",
  "d_cart",
  "r_cashier",
  "w_cashier",
  "u_cashier",
  "d_cashier",
  "r_client",
  "w_client",
  "u_client",
  "d_client",
  "r_orders",
  "w_orders",
  "u_orders",
  "d_orders",
  "r_all_orders",
  "r_catalogy",
  "r_pending_orders",
  "r_separation_orders",
  "r_conference_orders",
  "r_docas_orders",
  "r_in_transit_orders",
  "r_delivered_orders",

  //////

  "w_separation_orders",
  "w_conference_orders",
  "w_docks_orders",
  "r_docks_orders",

  "r_register_items",
  "r_register_stocks",
  "r_register_users",
  "r_register_clients",
  "r_register_categories",
  "r_register_docks",
  "r_register_taxes",

  "r_dock",
  "w_dock",
  "u_dock",
  "d_dock",

  "r_tax",
  "w_tax",
  "u_tax",
  "d_tax",

  "r_category",
  "w_category",
  "u_category",
  "d_category",

  "r_purchase",
  "w_purchase",
  "u_purchase",
  "d_purchase",
];

const unseedPermissions = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado");

    await Permission.deleteMany({ name: { $in: permissions } });
    console.log("Permissões removidas com sucesso");
  } catch (error) {
    console.error("Erro ao remover permissões:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

unseedPermissions();
