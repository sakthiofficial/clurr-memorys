// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { addCreatedHook } = require("./hooks/addCreated");

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

        ref: "CpAppProject",
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
  executeIds: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "CpAppUser",
    },
  ],
  cpCode: {
    type: String,
    unique: true,
    required: true,
  },

  created: { type: Number },
});
addCreatedHook(CpAppCompanySchema);

module.exports.CpAppCompany =
  mongoose.models.CpAppCompany ||
  mongoose.model("CpAppCompany", CpAppCompanySchema);
