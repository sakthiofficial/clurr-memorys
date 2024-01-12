// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { genrateUnixTimestamp } = require("@/appConstants");
const { roleNames } = require("../shared/cpNamings");

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
  role: {
    type: String,
    trim: true,
    required: true,
    enum: [roleNames?.superAdmin,roleNames?.cpBusinessHead,roleNames?.admin,roleNames?.mis,roleNames?.cpTl,roleNames?.cpRm,roleNames?.cpBranchHead,roleNames?.cpExecute ],

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
