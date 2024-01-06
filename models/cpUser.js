// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpUserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    trim: true,
    required: true,
  },
  projects: {
    type: Array,
  },
  parentId: {
    type: Schema.Types.Mixed,
    ref: "CpUser",
  },
  permissions: {
    type: Array,
    required: true,
  },

  subordinateRoles: {
    type: Array,
    required: true,
  },
  createdBy: { type: Date, default: () => Math.floor(Date.now() / 1000) },
});

module.exports.CpUser =
  mongoose.models.CpUser || mongoose.model("CpUser", CpUserSchema);
