// import mongoose from "mongoose";
const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpAppPermissionSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports.CpAppPermission =
  mongoose.models.CpAppPermission ||
  mongoose.model("CpAppPermission", CpAppPermissionSchema);
