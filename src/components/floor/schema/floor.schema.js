import mongoose, { Schema } from "mongoose";

const floorSchema = new Schema({
  BuildId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Build'}, 
  name: { type: String, required: true },
  description: { type: String },
  localCode: { type: String, required: true },
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
  StockedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StockedItem'}], 
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
})

const Floor = mongoose.model('Floor', floorSchema);

export default Floor;