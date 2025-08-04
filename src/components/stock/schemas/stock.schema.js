import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  code: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[A-Za-z0-9]{3}$/.test(value);
      },
      message: (props) =>
        `${props.value} não é um código válido! O código deve ter exatamente 3 caracteres.`,
    },
  },
  Streets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Street" }],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedAt: { type: Date },
  updatedBy: { type: String },
  active: { type: Boolean, default: true },
});

const Stock = mongoose.model("Stock", stockSchema);

export default Stock;
