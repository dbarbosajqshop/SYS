import mongoose from "mongoose";
import Role from "../schema/role.schema.js";
import Permission from "../schema/permission.schema.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const environment = process.env.NODE_ENV || "development";
  const envFile =
    environment === "localhost" ? ".env.local" : `.env.${environment}`;
  dotenv.config({ path: envFile });
}

const dbUri = process.env.MONGODB_URI;

const roles = [
  {
    name: "Estoque 1",
    permissions: ["r_stocked_item", "r_puchase"],
  },
  {
    name: "Estoque 2",
    permissions: ["r_stocked_item", "r_puchase", "u_puchase", "u_stocked_item"],
  },
  {
    name: "Estoque 3",
    permissions: [
      "r_puchase",
      "w_purchase",
      "r_stocked_item",
      "u_stocked_item",
      "u_stocked_items_quantity",
    ],
  },
  {
    name: "Pendente 1",
    permissions: ["r_pending_orders"],
  },
  {
    name: "Pendente 2",
    permissions: ["r_pending_orders", "w_pending_orders", "u_pending_orders"],
  },
  {
    name: "Pendente 3",
    permissions: [
      "r_pending_orders",
      "w_pending_orders",
      "u_pending_orders",
      "d_pending_orders",
    ],
  },
  {
    name: "Separacao 1",
    permissions: ["r_separation_orders"],
  },
  {
    name: "Separacao 2",
    permissions: [
      "r_separation_orders",
      "w_separation_orders",
      "u_separation_orders",
    ],
  },
  {
    name: "Separacao 3",
    permissions: [
      "r_separation_orders",
      "w_separation_orders",
      "u_separation_orders",
      "d_separation_orders",
    ],
  },
  {
    name: "Conferencia 1",
    permissions: ["r_conference_orders"],
  },
  {
    name: "Conferencia 2",
    permissions: [
      "r_conference_orders",
      "w_conference_orders",
      "u_conference_orders",
    ],
  },
  {
    name: "Conferencia 3",
    permissions: [
      "r_conference_orders",
      "w_conference_orders",
      "u_conference_orders",
      "d_conference_orders",
    ],
  },
  {
    name: "Vendas Docas 1",
    permissions: ["r_docks_orders"],
  },
  {
    name: "Vendas Docas 2",
    permissions: ["r_docks_orders", "w_docks_orders", "u_docks_orders"],
  },
  {
    name: "Vendas Docas 3",
    permissions: [
      "r_docks_orders",
      "w_docks_orders",
      "u_docks_orders",
      "d_docks_orders",
    ],
  },
  {
    name: "Entregue 1",
    permissions: ["r_delivered_orders"],
  },
  {
    name: "Entregue 2",
    permissions: ["r_delivered_orders"],
  },
  {
    name: "Entregue 3",
    permissions: ["r_delivered_orders", "d_delivered_orders"],
  },
  {
    name: "admin",
    permissions: [
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

      ////////

      "w_separation_orders",
      "w_conference_orders",

      "u_docks_orders",
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
      "u_stocked_items_quantity",
    ],
  },
];

const seedRoles = async () => {
  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB conectado");

    // Obtendo todas as permissões existentes
    const permissionsMap = await Permission.find({
      name: { $in: roles.flatMap((role) => role.permissions) },
    });
    const permissionsByName = Object.fromEntries(
      permissionsMap.map((p) => [p.name, p._id])
    );

    // Criando objetos das roles com ObjectIds das permissões
    const roleDocs = roles.map((role) => ({
      name: role.name,
      permissions: role.permissions
        .map((name) => permissionsByName[name])
        .filter(Boolean),
    }));

    // Removendo roles antigas
    await Role.deleteMany({ name: { $in: roles.map((r) => r.name) } });
    console.log("Roles antigas removidas");

    // Inserindo novas roles
    await Role.insertMany(roleDocs);
    console.log("Roles criadas com sucesso");
  } catch (error) {
    console.error("Erro ao criar roles:", error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

seedRoles();
