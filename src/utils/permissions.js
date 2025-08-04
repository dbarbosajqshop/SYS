export const mapStatusToPermission = (status) => {
  const permissionsByStatus = {
    order: "r_orders",
    pendente: "r_pending_orders",
    separacao: "r_separation_orders",
    conferencia: "r_conference_orders",
    docas: "r_docas_orders",
    transito: "r_in_transit_orders",
    entregue: "r_delivered_orders",
    "em pagamento": "r_payments_order",
  };

  return permissionsByStatus[status] || "r_all_orders";
};
