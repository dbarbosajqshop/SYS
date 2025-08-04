import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema({
  name: {type: String, require: true},
  permissions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Permission'}],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
},
{
  versionKey: false
});

const Role = mongoose.model('Role', RoleSchema);
export default Role;