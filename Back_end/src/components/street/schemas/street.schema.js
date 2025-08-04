import mongoose, { Schema } from "mongoose";

const streetSchema = new Schema({
  StockId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Stock' },
  name: { type: String, required: true },
  description: { type: String },
  code: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        return /^[A-Za-z0-9]{3}$/.test(value);
      },
      message: props => `${props.value} não é um código válido! O código deve ter exatamente 3 caracteres.`
    }
  },
  Builds: [{type: mongoose.Schema.Types.ObjectId, ref: 'Build'}],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedAt: { type: Date },
  updatedBy: { type: String },
  active: { type: Boolean, default: true }
})

const Street = mongoose.model('Street', streetSchema);

export default Street;