// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpAppCompanySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },

  projects: {
    type: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  parentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CpAppUser",
  },
  branchHeadId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "CpAppUser",
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

module.exports.CpAppCompany =
  mongoose.models.CpAppCompany ||
  mongoose.model("CpAppCompany", CpAppCompanySchema);
