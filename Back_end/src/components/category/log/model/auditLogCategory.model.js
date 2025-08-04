import mongoose from "mongoose";

const AuditLogCategorySchema = new mongoose.Schema(
  {
    action: { type: String, required: true, enum: ["CREATE", "UPDATE", "INACTIVATE", "REACTIVATE"] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, required: true, default: "Category" },
    targetName: { type: String },
    changes: [
      {
        field: { type: String, required: true },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed }
      }
    ],
    timestamp: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const AuditLogCategory = mongoose.model("AuditLogCategory", AuditLogCategorySchema);
export default AuditLogCategory;