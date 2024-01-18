const mongoose = require("mongoose");

const { Schema } = mongoose;
const CpAppProjectSchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    index: true,
  },
  // name -> permmision
  accessLevel: {
    // type -> object
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

module.exports.CpAppProject =
  mongoose.models.CpAppProject ||
  mongoose.model("CpAppProject", CpAppProjectSchema);
