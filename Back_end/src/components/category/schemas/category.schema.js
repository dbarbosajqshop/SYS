import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  updatedAt: { type: Date },
  updatedBy: { type: String },
  active: { type: Boolean, default: true },
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
