import mongoose from "mongoose";

const AuditLogUserSchema = new mongoose.Schema(
  {
    action: { type: String, required: true, enum: ["CREATE", "UPDATE", "DELETE"] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    targetType: { type: String, required: true, enum: ["User", "Role", "Permission"] },
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

const AuditLogUser = mongoose.model("AuditLogUser", AuditLogUserSchema);
export default AuditLogUser;