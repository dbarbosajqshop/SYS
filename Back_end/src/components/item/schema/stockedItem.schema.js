import mongoose, { Schema } from "mongoose";

const stockedItemSchema = new Schema({
  ItemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  FloorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor" },
  local: { type: String, default: "Sem local" },
  type: { type: String, enum: ["box", "unit"], required: true },
  costPrice: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true },
});

const StockedItem = mongoose.model("StockedItem", stockedItemSchema);

export default StockedItem;
