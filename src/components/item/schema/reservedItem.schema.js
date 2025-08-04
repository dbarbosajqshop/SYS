import mongoose, { Schema } from "mongoose";

const reservedItemSchema = new Schema({
  ItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  quantityBox: { type: Number, required: false, default: 0 },
  quantityUnit: { type: Number, required: false, default: 0 },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true },
});

const ReservedItem = mongoose.model("ReservedItem", reservedItemSchema);

export default ReservedItem;
