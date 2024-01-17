// import mongoose from "mongoose";
const mongoose = require("mongoose");
const { genrateUnixTimestamp } = require("@/appConstants");
const { roleNames: ROLENAMES } = require("../shared/cpNamings");

const { Schema } = mongoose;
// Chnage Appuser
const CpUserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  // make this to array
 sakthi:{
},
  role: {
    type: String,
    trim: true,
    required: true,
    enum: [
      ROLENAMES?.superAdmin,
      ROLENAMES?.cpBusinessHead,
      ROLENAMES?.admin,
      ROLENAMES?.mis,
      ROLENAMES?.cpTl,
      ROLENAMES?.cpRm,
      ROLENAMES?.cpBranchHead,
      ROLENAMES?.cpExecute,
    ],
  },
  projects: {
    // give validation to string
    type: Array,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: "CpUser",
  },
  // name -> addtional permissions or extra
  permissions: {
    // validation for string
    type: Array,
    required: true,
  },
  // newschme to permissions //new schema to roles //newsch for projects
  // roles permsiion ref to permission merge  user merge
  subordinateRoles: {
    // change to -> role sch
    type: Array,
    required: true,
  },
  cpCode: {
    type: String,
    default: null,
  },
  isPrimary: {
    // push -> permission
    type: Boolean,
  },
  createdBy: { type: Date, default: genrateUnixTimestamp() },
});
// {
// name:"sakthi",
// ...
// roles:[{}],
// permissions:["UM"],
// }
const rolesch ={
  role:"Cptl"
permissions:["Adduser"],
subordinateRoles
}
const permissionSch = {
  name :"LeadView",


}
module.exports.CpUser =
  mongoose.models.CpUser || mongoose.model("CpUser", CpUserSchema);
