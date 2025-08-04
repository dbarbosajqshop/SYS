import mongoose, { Schema } from "mongoose";

const MoneyAccountSchema = new Schema({
  type: { type: String, enum: ['user', 'company']},
  UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  balance: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
});

const MoneyAccount = mongoose.model('MoneyAccount', MoneyAccountSchema);
export default MoneyAccount;