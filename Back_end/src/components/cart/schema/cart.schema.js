import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
  Items: [
    {
      ItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      quantity: { type: Number },
      type: { type: String, enum: ["box", "unit"], required: true },
    },
  ],
  ClientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  SellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  itemsQuantity: { type: Number },
  totalQuantity: { type: Number },
  //totalPrice: { type: Number, default: 0 },
  //subtotalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  observation: { type: String },
  local: { type: String, enum: ["online", "presencial"] },
  payments: [
    {
      type: { type: String, required: true },
      installment: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  typeOfDelivery: {
    type: String,
    enum: ["retirada", "sedex", "pac", "jadlog", "onibus"],
  },
  status: {
    type: String,
    enum: ["aberto", "fechado", "cancelado"],
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
