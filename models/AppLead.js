import mongoose from "mongoose";
import { addCreatedHook } from "./hooks/addCreated";

const { Schema } = mongoose;

const CpAppLeadSchema = new Schema({
  // change -> camalcase
  name: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  project: { type: String },
  createdDate: { type: Number },
  createdBy: { type: Schema.Types.ObjectId, ref: "CpAppUser", required: true },
});
// have a refrence old project to add created hook
addCreatedHook(CpAppLeadSchema);

export const CpAppLead =
  mongoose.models.CpAppLead || mongoose.model("CpAppLead", CpAppLeadSchema);
