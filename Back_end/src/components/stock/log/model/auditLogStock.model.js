import mongoose from "mongoose";

const auditLogStockSchema = new mongoose.Schema(
  {
    action: { 
      type: String, 
      required: true, 
      enum: ["CREATE", "UPDATE", "DELETE", "INACTIVATE", "REACTIVATE", "INACTIVATE_HIERARCHY"] 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    targetId: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      refPath: 'targetModel'
    },
    targetModel: {
      type: String,
      required: true,
      enum: ['Stock', 'Street', 'Build', 'Floor']
    },
    stockName: { 
      type: String,
      required: true
    },
    hierarchy: {
      streetId: { type: mongoose.Schema.Types.ObjectId, ref: "Street" },
      buildId: { type: mongoose.Schema.Types.ObjectId, ref: "Build" },
      floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor" }
    },
    hierarchyDetails: {
      streets: { type: Number, default: 0 },
      builds: { type: Number, default: 0 },
      floors: { type: Number, default: 0 }
    },
    changes: [
      {
        field: { type: String, required: true },
        oldValue: { type: mongoose.Schema.Types.Mixed },
        newValue: { type: mongoose.Schema.Types.Mixed },
        hierarchyLevel: { type: String, enum: ["STOCK", "STREET", "BUILD", "FLOOR"] }
      }
    ]
  },
  { 
    timestamps: true,
    versionKey: false 
  }
);

const AuditLogStock = mongoose.model("AuditLogStock", auditLogStockSchema);
export default AuditLogStock;