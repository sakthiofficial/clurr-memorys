// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { genrateUnixTimestamp } = require("../src/appConstants");

const { Schema } = mongoose;
const CpAppUserSchema = new Schema({
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
    type: [
      {
        type: Schema.Types.ObjectId,
        required: true,

        ref: "CpAppRole",
      },
    ],
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
    ref: "CpAppUser",
  },
  additionalPermissions: {
    type: [
      {
        type: Array,
        required: true,
        ref: "CpAppPermission",
      },
    ],
  },
  cpCode: {
    type: String,
    default: null,
    ref: "CpAppCompany",
  },
  createdBy: { type: Date, default: genrateUnixTimestamp() },
});

module.exports.CpAppUser =
  mongoose.models.CpAppUser || mongoose.model("CpAppUser", CpAppUserSchema);
