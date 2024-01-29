import mongoose from "mongoose";
import { genrateUnixTimestamp } from "../src/appConstants";

const { Schema } = mongoose;
const CpAppActivitySchema = new Schema({
  entity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppPermission",
  }, // e.g., 'role', 'project', 'cpItem', 'user', 'lead'
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CpAppUser",
  }, // Reference to the entity
  actionType: { type: String, required: true }, // e.g., 'add', 'delete', 'edit'
  timestamp: { type: Number, default: () => genrateUnixTimestamp() },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppUser",
  }, // Username or user ID who performed the action
  performedRole: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppRole",
  }, // Username or user ID who performed the action
});

export const CpAppActivity =
  mongoose.model.CpAppActivity ||
  mongoose.model("CpAppActivity", CpAppActivitySchema);
