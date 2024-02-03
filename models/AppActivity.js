const mongoose = require("mongoose");
const { genrateUnixTimestamp } = require("../src/appConstants");

const { Schema } = mongoose;
const CpAppActivitySchema = new Schema({
  actionCategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppPermission",
  }, // e.g., 'role', 'project', 'cpItem', 'user', 'lead'
  performedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CpAppUser",
  }, // Reference to the entity
  actionType: { type: String, required: true }, // e.g., 'add', 'delete', 'edit'
  createdDate: { type: Number, default: () => genrateUnixTimestamp() },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppUser",
  }, // Username or user ID who performed the action
  performedRole: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CpAppRole",
  }, // Username or user ID who performed the action
});

module.exports.CpAppActivity =
  mongoose.models.CpAppActivity ||
  mongoose.model("CpAppActivity", CpAppActivitySchema);
