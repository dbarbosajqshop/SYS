import mongoose, { Schema } from "mongoose";

const PermissionSchema = new Schema({
  name: { type: String, require: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true }
},
{
  versionKey: false
})

const Permission = mongoose.model('Permission', PermissionSchema);
export default Permission;