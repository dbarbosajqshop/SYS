import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
  Items: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    boxQuantity: { type: Number, required: true },
    boxValue: { type: Number, required: true },
    finalPrice: { type: Number, required: true }
  }],
  totalItems: { type: Number, required: true },
  totalValue: {type: Number, required: true },
  store: { type: String, required: true },
  purchaseDate: { type: Date },
  state: { type: String, enum: ['pendente', 'entregue'], default: 'pendente' },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
})

const Purchase = mongoose.model('Purchase', purchaseSchema);

export default Purchase;