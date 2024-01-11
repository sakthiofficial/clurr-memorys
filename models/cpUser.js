// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { genrateUnixTimestamp } = require("@/appConstants");

const { Schema } = mongoose;
const CpUserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
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
  phone: {
    type: String,
    default: null,
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
  cpCode: {
    type: String,
    default: null,
  },
  isPrimary: {
    type: Boolean,
  },
  createdBy: { type: Date, default: genrateUnixTimestamp() },
});

module.exports.CpUser =
  mongoose.models.CpUser || mongoose.model("CpUser", CpUserSchema);
