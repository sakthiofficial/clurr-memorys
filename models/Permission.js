// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const AppPermissionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports.AppPermission =
  mongoose.models.AppPermission ||
  mongoose.model("AppPermission", AppPermissionSchema);
