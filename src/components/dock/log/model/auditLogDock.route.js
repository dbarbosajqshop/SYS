import mongoose from "mongoose";

const AuditLogDockSchema = new mongoose.Schema(
  {
    action: { 
      type: String, 
      required: true, 
      enum: ["CREATE", "UPDATE", "INACTIVATE", "REACTIVATE"] 
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
    targetType: { type: String, required: true, default: "Dock" },
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

const AuditLogDock = mongoose.model("AuditLogDock", AuditLogDockSchema);
export default AuditLogDock;