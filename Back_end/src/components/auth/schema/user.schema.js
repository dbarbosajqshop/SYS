import mongoose, { Schema, Types } from "mongoose";
import softDelete from "../../../middlewares/softDelete.js";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    Roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
    MoneyAccount: { type: mongoose.Schema.Types.ObjectId, ref: "MoneyAccount" },
    nameImage: { type: String },
    dataImage: { type: Buffer },
    contentType: { type: String },
    supervisorPassword: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: null },
    active: { type: Boolean, default: true },
    createdBy: { type: String },
    updatedBy: { type: String, default: null },
  },
  {
    versionKey: false,
  }
);

const User = mongoose.model("User", UserSchema);
export default User;
