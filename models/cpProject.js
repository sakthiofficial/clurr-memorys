const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpProjectSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    index: true,
  },
  accessLevel: {
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
});

module.exports.CpProject =
  mongoose.models.CpProject || mongoose.model("CpProject", CpProjectSchema);
