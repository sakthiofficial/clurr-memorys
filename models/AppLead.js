import mongoose from "mongoose";
import { genrateUnixTimestamp } from "../src/appConstants";

const { Schema } = mongoose;

const CpAppLeadSchema = new Schema({
  // change -> camalcase
  firstName: { type: String, trim: true },
  EmailAddress: { type: String, trim: true },
  Phone: { type: String, trim: true },
  Source: { type: String, trim: true },
  subSource: { type: String, trim: true },
  Project: { type: String },
  createdDate: { type: Number, default: genrateUnixTimestamp() },
  createdBy: { type: Schema.Types.ObjectId, ref: "CpAppUser", required: true },
});
// have a refrence old project to add created hook

export const CpAppLead =
  mongoose.models.CpAppLead || mongoose.model("CpAppLead", CpAppLeadSchema);
