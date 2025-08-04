import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  sku: { type: String, required: true, unique: true, },
  upc: { type: String },
  upcList: { type: [String] },
  ncm: { type: String, maxlength: 8 },
  name: { type: String, required: true, minlength: 1, maxlength: 100 },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
  price: { type: Number, required: true },
  wholesalePrice: { type: Number },
  retailPrice: { type: Number },
  promotionPrice: { type: Number, default: 0 },
  isPromotion: { type: Boolean, default: false },
  taxPrices: { type: Boolean, default: false },
  height: { type: Number, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  weight: { type: Number, required: true },
  quantityBox: { type: Number, required: true, min: 0 },
  color: { type: String, maxlength: 50 },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  active: { type: Boolean, default: true },
});

const Item = mongoose.model("Item", itemSchema);

export default Item;
