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
      type: Schema.Types.ObjectId,
      required: true,

      ref: "CpAppPermission",
    },
  ],
  subordinateRoles: [
    {
      type: Schema.Types.ObjectId,
      required: true,

      ref: "CpAppRole",
    },
  ],
});

module.exports.CpAppRole =
  mongoose.models.CpAppRole || mongoose.model("CpAppRole", CpAppRoleSchema);
