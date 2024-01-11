// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpCompanySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },

  projects: {
    type: Array,
    required: true,
  },
  parentId: {
    type: Schema.Types.Mixed,
    required: true,
    ref: "CpUser",
  },
  branchHeadId: {
    type: Schema.Types.Mixed,
    required: true,
    ref: "CpUser",
  },
  cpCode: {
    type: String,
    unique: true,
    required: true,
  },
  account: {
    type: Number,
    default: 0,
  },
  createdBy: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

module.exports.CpCompany =
  mongoose.models.CpCompany || mongoose.model("CpCompany", CpCompanySchema);
