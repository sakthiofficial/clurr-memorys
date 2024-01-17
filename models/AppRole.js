// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpAppRoleSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  permissions: [
    {
      type: String,
      ref: "CpAppPermission",
    },
  ],
  subordinateRoles: [
    {
      type: String,
      ref: "role",
    },
  ],
});

module.exports.CpAppRole =
  mongoose.models.CpAppRole || mongoose.model("CpAppRole", CpAppRoleSchema);
