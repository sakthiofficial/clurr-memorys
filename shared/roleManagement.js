const { roleNames, permissionKeyNames } = require("./cpNamings");

function basicRolePermission(role) {
  switch (role) {
    case roleNames?.superAdmin:
      return [
        permissionKeyNames?.activityHistory,
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
        permissionKeyNames?.leadManagement,
      ];
    case roleNames?.cpBusinessHead:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
        permissionKeyNames?.leadManagement,
        permissionKeyNames?.activityHistory,
      ];
    case roleNames?.admin:
      return [
        permissionKeyNames?.userManagement,
        permissionKeyNames?.leadManagement,
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
      ];
    case roleNames?.mis:
      return [
        permissionKeyNames?.userManagement,
        permissionKeyNames?.leadManagement,

        permissionKeyNames?.leadViewWithoutNumber,
        permissionKeyNames?.cpManagement,
      ];

    case roleNames?.cpTl:
      return [
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.leadManagement,
      ];

    case roleNames?.cpRm:
      return [
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.leadManagement,
      ];
    case roleNames?.cpBranchHead:
      return [
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.leadManagement,
      ];
    case roleNames?.cpExecute:
      return [permissionKeyNames?.leadManagement];

    default:
      return null;
  }
}
function roleSubordinates(userRole) {
  const topRoleHierarchy = [
    {
      role: roleNames?.superAdmin,
      subordinates: [
        roleNames?.superAdmin,
        roleNames?.admin,
        roleNames?.mis,
        roleNames?.cpBusinessHead,

        roleNames?.cpTl,
        roleNames?.cpRm,
      ],
    },
    {
      role: roleNames?.cpBusinessHead,
      subordinates: [
        roleNames?.admin,
        roleNames?.mis,
        roleNames?.cpTl,
        roleNames?.cpRm,
      ],
    },
    {
      role: roleNames?.admin,
      subordinates: [
        roleNames?.cpTl,
        roleNames?.cpRm,
        roleNames?.cpBranchHead,
        roleNames?.cpExecute,
      ],
    },
    {
      role: roleNames?.mis,
      subordinates: [
        roleNames?.cpTl,
        roleNames?.cpRm,
        roleNames?.cpBranchHead,
        roleNames?.cpExecute,
      ],
    },
  ];
  const cpRoleHierarchy = [
    roleNames?.cpTl,
    roleNames?.cpRm,
    roleNames?.cpBranchHead,
    roleNames?.cpExecute,
  ];
  let roleHierarchyArr = [];

  if (
    userRole !== roleNames?.superAdmin &&
    userRole !== roleNames?.cpBusinessHead &&
    userRole !== roleNames?.admin &&
    userRole !== roleNames?.mis
  ) {
    let reachedRoleInArr = false;
    for (let i = 0; i < cpRoleHierarchy.length; i += 1) {
      if (reachedRoleInArr) {
        roleHierarchyArr.push(cpRoleHierarchy[i]);
      } else {
        reachedRoleInArr = cpRoleHierarchy[i] === userRole;
      }
    }
  } else {
    for (let i = 0; i < topRoleHierarchy.length; i += 1) {
      if (topRoleHierarchy[i]?.role === userRole) {
        roleHierarchyArr = topRoleHierarchy[i]?.subordinates;
        return roleHierarchyArr;
      }
    }
  }
  return roleHierarchyArr;
}
function parentRole(userRole) {
  if (userRole === roleNames?.admin || userRole === roleNames?.mis) {
    return roleNames?.superAdmin;
  }
  if (userRole === roleNames?.superAdmin) {
    return roleNames?.superAdmin;
  }
  const roleHierarchyArr = [
    roleNames?.superAdmin,
    roleNames?.cpBusinessHead,
    roleNames?.cpTl,
    roleNames?.cpRm,
    roleNames?.cpExecute,
  ];
  for (let i = 0; i < roleHierarchyArr.length; i += 1) {
    if (roleHierarchyArr[i] === userRole) {
      return roleHierarchyArr[i - 1] || null;
    }
  }
  return null;
}
function isPriorityUser(userRole) {
  let roleArr = userRole;
  if (typeof userRole === "string") {
    roleArr = [userRole];
  }
  const isPriorityRole =
    roleArr.includes(roleNames?.superAdmin) ||
    roleArr.includes(roleNames?.admin) ||
    roleArr.includes(roleNames?.mis) ||
    roleArr.includes(roleNames?.cpBusinessHead);

  return isPriorityRole;
}
function isNonPriorityUser(userRole) {
  let roleArr = userRole;
  if (typeof userRole === "string") {
    roleArr = [userRole];
  }
  const isPriorityRole =
    roleArr.includes(roleNames?.superAdmin) ||
    roleArr.includes(roleNames?.admin) ||
    roleArr.includes(roleNames?.mis) ||
    roleArr.includes(roleNames?.cpBusinessHead);

  return !isPriorityRole;
}
function checkProjectValidation(role) {
  if (
    role === roleNames?.superAdmin ||
    role === roleNames?.cpBusinessHead ||
    role === roleNames?.mis ||
    role === roleNames?.admin
  ) {
    return false;
  }
  return true;
}
function checkValidParent(userRole, parentDataRole) {
  if (
    userRole !== roleNames?.mis &&
    userRole !== roleNames?.admin &&
    userRole !== roleNames?.cpBusinessHead
  ) {
    if (parentRole(userRole) !== parentDataRole) {
      return false;
    }
  }
  return true;
}
const userDataObj = {
  subordinateRoles: "subordinateRoles",
  role: "role",
  projects: "projects",
  permissions: "permissions",
  parentId: "parentId",
  password: "password",
  cpCode: "cpCode",
  name: "name",
  email: "email",
  phone: "phone",
};
export {
  basicRolePermission,
  roleSubordinates,
  parentRole,
  checkProjectValidation,
  checkValidParent,
  isPriorityUser,
  isNonPriorityUser,
  userDataObj,
};
