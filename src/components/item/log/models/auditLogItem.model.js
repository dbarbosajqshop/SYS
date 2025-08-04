import mongoose from "mongoose";

const AuditLogItemSchema = new mongoose.Schema(
  {
    action: { 
      type: String, 
      required: true, 
      enum: ["CREATE", "UPDATE", "DELETE", "INACTIVATE", "REACTIVATE", "UPDATE_PHOTO"] 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    targetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Item", 
      required: true 
    },
    targetType: { 
      type: String, 
      required: true, 
      enum: ["Item", "ItemCategory", "ItemPhoto"] 
    },
    targetName: { 
      type: String 
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
    versionKey: false 
  }
);

const AuditLogItem = mongoose.model("AuditLogItem", AuditLogItemSchema);
export default AuditLogItem;