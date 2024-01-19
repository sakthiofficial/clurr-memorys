const mongoose = require("mongoose");

const { Schema } = mongoose;

const SessionSchema = new Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppUser",
  },
});

module.exports.Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);
