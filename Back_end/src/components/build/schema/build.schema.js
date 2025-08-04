import mongoose, { Schema } from "mongoose";

const buildSchema = new Schema({
  StreetId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Street'}, 
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
  Floors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor'}], 
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
})

const Build = mongoose.model('Build', buildSchema);

export default Build;