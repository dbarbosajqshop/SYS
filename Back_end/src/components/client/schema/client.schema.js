import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema({
  name: { type: String, required: true },
  voucher: [{
    value: { type: Number },
    code: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    expiresIn: {
      type: Date,
      default: function () {
        const now = new Date();
        now.setDate(now.getDate() + 1);
        return now;
      },
      active: { type: Boolean, default: true }
    },
  }],
  cnpj: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{14}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid CNPJ! Must contain 14 digits.`
    }
  },
  cpf: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{11}$/.test(v.toString());
      },
      message: props => `${props.value} is not a valid CPF! Must contain 11 digits.`
    }
  },
  address: {
    street: { type: String, required: true },
    neighborhood: { type: String, required: true },
    state: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 2,
      uppercase: true,
      validate: {
        validator: function (v) {
          return /^[A-Z]{2}$/.test(v);
        },
        message: props => `${props.value} is not a valid state code!`
      }
    },
    city: { type: String, required: true },
    zip: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{5}-?\d{3}$/.test(v);
        },
        message: props => `${props.value} is not a valid zip code!`
      }
    },
    number: { type: Number, required: true },
    complement: { type: String, required: false }
  },
  email: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  purchases: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase'
    }
  ],
  telephoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10,11}$/.test(v);
      },
      message: props => `${props.value} is not a valid telephone number! Must contain 10-11 digits.`
    }
  },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
});

const Client = mongoose.model('Client', clientSchema);
export default Client;
