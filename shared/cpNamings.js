const roleNames = {
  superAdmin: "Super Administrator",
  admin: "Administrator",
  mis: "MIS",
  cpHead: "CP Head",
  cpBusinessHead: "CP Business Head",
  cpTl: "CP Team Lead",
  cpRm: "CP Relationship Manager",
  cpBranchHead: "CP Branch Head",
  cpExecute: "CP Executive",
};
const permissionKeyNames = {
  userManagement: "User Management",
  projectManagement: "Project Management",
  leadViewWithNumber: "Lead View with Number",
  leadViewWithoutNumber: "Lead View without Number",
  cpManagement: "CP Management",
  activityHistory: "Activity History",
  leadManagement: "Lead Management",
};
const activityOperationTypes = {
  add: "add",
  edit: "edit",
  delete: "delete",
  other: "other",
};
export { roleNames, permissionKeyNames, activityOperationTypes };
