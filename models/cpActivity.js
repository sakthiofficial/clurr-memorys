import mongoose from "mongoose";

const { Schema } = mongoose;
const CpActivitySchema = new Schema({
  entity: { type: String, required: true }, // e.g., 'role', 'project', 'cpItem', 'user', 'lead'
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpUser",
  }, // Reference to the entity
  actionType: { type: String, required: true }, // e.g., 'add', 'delete', 'edit'
  timestamp: { type: Date, default: () => Math.floor(Date.now() / 1000) },
  performedBy: { type: String, required: true }, // Username or user ID who performed the action
  performedRole: { type: String, required: true }, // Username or user ID who performed the action
});

export const CpActivity =
  mongoose.model.CpActivity || mongoose.model("CpActivity", CpActivitySchema);
