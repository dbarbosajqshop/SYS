import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  Items: [
    {
      ItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number },
      itemUnitPrice: { type: Number },
      itemTotalPrice: { type: Number },
      localToBeRemoved: { type: String },
      type: { type: String, enum: ["box", "unit"], required: true },
      itemStatus: {
        type: String,
        enum: ["default", "correto", "parcial", "incorreto"],
        default: "default",
      },
    },
  ],
  ClientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  SellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderNumber: { type: Number },
  itemsQuantity: { type: Number },
  totalQuantity: { type: Number },
  totalPrice: { type: Number, default: 0 },
  subtotalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  local: { type: String, enum: ["online", "presencial"] },
  balance: { type: Number },
  ReceiptPayments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ReceiptPayment" },
  ],
  totalPaid: { type: Number },
  typeOfDelivery: {
    type: String,
    enum: ["retirada", "sedex", "pac", "jadlog", "onibus"],
  },
  status: {
    type: String,
    enum: [
      "order",
      "em pagamento",
      "pendente",
      "separacao",
      "conferencia",
      "docas",
      "transito",
      "entregue",
    ],
  },
  dateOfOrder: { type: Date },

  nameImageProofOfPayment: { type: String },
  dataImageProofOfPayment: { type: Buffer },
  contentTypeProofOfPayment: { type: String },
  observation: { type: String },
  dock: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true },
});

orderSchema.statics.generateOrderNumber = async function () {
  const lastOrder = await this.findOne().sort({ orderNumber: -1 }).exec();
  const newOrderNumber = lastOrder ? lastOrder.orderNumber + 1 : 21001;
  return newOrderNumber;
};

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = await this.constructor.generateOrderNumber();
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
