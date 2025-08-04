import mongoose, { Schema } from "mongoose";

const taxSchema = new Schema({
  name: { type: String, required: true },
  retailTaxPercentage: { type: Number, required: true },
  wholesaleTaxPercentage: { type: Number, required: true },
  minWholesaleQuantity: { type: Number, required: true },
  selected: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Tax = mongoose.model('Tax', taxSchema);
export default Tax;