import mongoose, { Schema } from "mongoose";


const cashierSchema = new Schema({
  cashInCashier: { type: Number, default: 0, min: 0 },
  cashierUserLogin: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creditCartValue: { type: Number, default: 0, min: 0 },
  debitCartValue: { type: Number, default: 0, min: 0 },
  pixValue: { type: Number, default: 0, min: 0 },
  cashValue: { type: Number, default: 0, min: 0 },
  voucherClientValue: { type: String },
  totalOrders: { type: Number, default: 0, min: 0 },
  reimbursement: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
})

const Cashier = mongoose.model('Cashier', cashierSchema);
export default Cashier;