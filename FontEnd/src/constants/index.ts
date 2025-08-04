export const DEFAULT_SHIPMENT_DATA = {
  deliveryType: "",
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
  },
};

export const DEFAULT_USER_DATA = {
  name: "",
  email: "",
  password: "",
  role: "",
};

export const DEFAULT_CLIENT_DATA = {
  name: "",
  cnpj: "",
  cpf: "",
  email: "",
  telephoneNumber: "",
  address: {
    street: "",
    neighborhood: "",
    state: "",
    zip: "",
    number: "",
    complement: "",
    city: "",
  },
};

export const DEFAULT_TAX_DATA = {
  name: "",
  retailTaxPercentage: 0,
  wholesaleTaxPercentage: 0,
  minWholesaleQuantity: 0,
  selected: false,
};

export const DEFAULT_STOCK_DATA = {
  name: "",
  description: "",
  code: "",
};

export const DEFAULT_ITEM_DATA = {
  name: "",
  price: 0,
  quantityBox: 0,
  sku: "",
  description: "",
  height: 0,
  width: 0,
  depth: 0,
  weight: 0,
  promotionPrice: 0,
  ncm: "",
  upcList: [],
  color: "",
  category: "",
  wholesalePrice: 0,
  retailPrice: 0,
  taxPrices: false,
};

export const DEFAULT_STOCKED_ITEM_DATA = {
  local: "",
  quantity: 0,
  type: "",
};

export const DASHBOARD_FILTER_OPTIONS = [
  { label: "Código", value: "orderNumber" },
  { label: "Vendedor", value: "sellerName" },
  { label: "Tipo", value: "local" },
  { label: "Cliente", value: "clientName" },
];

export const ITEM_SOLD_FILTER_OPTIONS = [
  { label: "Item", value: "name" },
  { label: "SKU", value: "sku" },
];

export const ITEM_COST_OPTIONS = [
  ...ITEM_SOLD_FILTER_OPTIONS,
  { label: "NCM", value: "ncm" },
];

export const ITEM_FILTER_OPTIONS = [
  ...ITEM_COST_OPTIONS,
  { label: "Código de barras", value: "upc" },
];

export const TYPE_UNIT_OPTIONS = [
  { label: "Unidade", value: "unit" },
  { label: "Caixa", value: "box" },
];

export const STOCKED_ITEM_FILTER_OPTIONS = [
  ...ITEM_SOLD_FILTER_OPTIONS,
  { label: "Local", value: "local" },
  { label: "Código de barras", value: "upc" },
  { label: "Tipo de Unidade", value: "type" },
];

export const USER_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Alvo", value: "targetId" },
];

export const ITEM_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Item", value: "targetId" },
];

export const ITEM_MOVEMENT_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Item", value: "itemId" },
  { label: "Origem", value: "fromLocationId" },
  { label: "Destino", value: "toLocationId" },
  { label: "Data Início", value: "startDate" },
  { label: "Data Fim", value: "endDate" },
];

export const CATEGORY_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Categoria", value: "targetId" },
];

export const CLIENT_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Cliente", value: "targetId" },
];

export const DOCK_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Doca", value: "targetId" },
];

export const ORDER_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Pedido", value: "targetId" },
  { label: "Cliente", value: "clientId" },
  { label: "Status", value: "status" },
];

export const STOCK_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Alvo", value: "targetId" },
  { label: "Nível da Hierarquia", value: "hierarchyLevel" },
  { label: "Incluir Logs de Inativação Hierárquica", value: "includeHierarchy" },
];

export const STOCKED_ITEM_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Item Estocado (ID)", value: "stockedItemId" },
  { label: "Item Mestre (ID)", value: "itemId" },
];

export const TAX_LOG_FILTER_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Ação", value: "action" },
  { label: "Usuário", value: "userId" },
  { label: "Taxa", value: "targetId" },
];

export const PAYMENT_TYPES = [
  { key: "credito", label: "Crédito" },
  { key: "debito", label: "Débito" },
  { key: "keypix", label: "Pix QR Code" },
  { key: "machinepix", label: "Pix Maquininha" },
  { key: "dinheiro", label: "Dinheiro" },
  { key: "ted", label: "TED" },
];

export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const MONTHS_LONG = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
