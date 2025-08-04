import mongoose, { Schema } from "mongoose";

const dockSchema = new Schema({
  code: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedAt: { type: Date },
  updatedBy: { type: String },
  active: { type: Boolean, default: true },
});

const Dock = mongoose.model("Dock", dockSchema);

export default Dock;
