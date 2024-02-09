const mongoose = require("mongoose");
const { addCreatedHook } = require("./hooks/addCreated");

const { Schema } = mongoose;
const CpAppProjectSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    index: true,
  },
  permission: {
    type: String,
    enum: ["leadViewOnly", "leadAddAndView"],
    required: true,
  },
  accessKey: {
    type: String,
    required: true,
  },
  secretKey: {
    type: String,
    required: true,
  },
  created: { type: Number },
});
addCreatedHook(CpAppProjectSchema);

module.exports.CpAppProject =
  mongoose.models.CpAppProject ||
  mongoose.model("CpAppProject", CpAppProjectSchema);
