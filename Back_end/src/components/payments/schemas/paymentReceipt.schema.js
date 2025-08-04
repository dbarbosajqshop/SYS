import mongoose, { Schema } from "mongoose";

const paymentReceiptSchema = new Schema({
  type: {
    type: String,
    enum: ["credito", "debito", "keypix", "machinepix", "dinheiro", "ted"],
    required: true,
  },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pendente", "pago"], default: "pendente" },
  nameImageProofOfPayment: { type: String },
  dataImageProofOfPayment: { type: Buffer },
  contentTypeProofOfPayment: { type: String },
  proofOfPaymentImageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date },
});

const PaymentReceipt = mongoose.model("ReceiptPayment", paymentReceiptSchema);
export default PaymentReceipt;
