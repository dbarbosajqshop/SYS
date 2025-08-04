import mongoose from "mongoose";

const auditLogClientSchema = new mongoose.Schema(
  {
    action: { 
      type: String, 
      required: true, 
      enum: ["CREATE", "UPDATE", "DELETE", "INACTIVATE", "REACTIVATE", "ADD_VOUCHER"] 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    targetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Client", 
      required: true 
    },
    clientName: { 
      type: String,
      required: true
    },
    changes: [
      {
        field: { type: String, required: true },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed }
      }
    ]
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

const AuditLogClient = mongoose.model("AuditLogClient", auditLogClientSchema);
export default AuditLogClient;