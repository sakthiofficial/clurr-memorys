// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const AppRoleSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  permissions: [
    {
      type: String,
      ref: "AppPermission",
    },
  ],
  subordinateRoles: [
    {
      type: String,
      ref: "role",
    },
  ],
});

module.exports.AppRole =
  mongoose.models.AppRole || mongoose.model("AppRole", AppRoleSchema);
