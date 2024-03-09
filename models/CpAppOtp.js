const mongoose = require("mongoose");
const { addCreatedHook } = require("./hooks/addCreated");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CpAppUser",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  created: { type: Number },
  verified: { type: Boolean, default: false },
});

addCreatedHook(otpSchema);

module.exports.CpAppOtp =
  mongoose.models.CpAppOtp || mongoose.model("CpAppOtp", otpSchema);
