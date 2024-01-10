// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpExecuteSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
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
  cpCode: {
    type: String,
    unique: true,
    default: null,
  },
  isPrimary: {
    type: Boolean,
    required: true,
  },
  createdBy: { type: Number, default: () => Math.floor(Date.now() / 1000) },
});

module.exports.CpExecute =
  mongoose.models.CpExecute || mongoose.model("CpExecute", CpExecuteSchema);
