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
      ];
    case roleNames?.cpBusinessHead:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];
    case roleNames?.admin:
      return [
        permissionKeyNames?.activityHistory,
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];
    case roleNames?.mis:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadOnlyView,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];
    case roleNames?.cpHead:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];

    case roleNames?.cpTl:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];

    case roleNames?.cpRm:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];

    case roleNames?.cpComBusinessHead:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];

    case roleNames?.cpExecute:
      return [
        permissionKeyNames?.cpManagement,
        permissionKeyNames?.leadViewWithNumber,
        permissionKeyNames?.projectManagement,
        permissionKeyNames?.userManagement,
      ];

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
        roleNames?.cpHead,

        roleNames?.cpTl,
        roleNames?.cpRm,
        roleNames?.cpComBusinessHead,
        roleNames?.cpExecute,
      ],
    },
    {
      role: roleNames?.cpBusinessHead,
      subordinates: [
        roleNames?.admin,
        roleNames?.mis,
        roleNames?.cpHead,
        roleNames?.cpTl,
        roleNames?.cpRm,
        roleNames?.cpComBusinessHead,
        roleNames?.cpExecute,
      ],
    },
    {
      role: roleNames?.admin,
      subordinates: [
        roleNames?.cpHead,
        roleNames?.cpTl,
        roleNames?.cpRm,
        roleNames?.cpComBusinessHead,
        roleNames?.cpExecute,
      ],
    },
    {
      role: roleNames?.mis,
      subordinates: [
        roleNames?.cpHead,
        roleNames?.cpTl,
        roleNames?.cpRm,
        roleNames?.cpComBusinessHead,
        roleNames?.cpExecute,
      ],
    },
  ];
  const cpRoleHierarchy = [
    roleNames?.cpHead,
    roleNames?.cpTl,
    roleNames?.cpRm,
    roleNames?.cpComBusinessHead,
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
    return null;
  }
  if (userRole === roleNames?.superAdmin) {
    return roleNames?.superAdmin;
  }
  const roleHierarchyArr = [
    roleNames?.superAdmin,
    roleNames?.cpHead,
    roleNames?.cpHead,
    roleNames?.cpTl,
    roleNames?.cpRm,
    roleNames?.cpComBusinessHead,
    roleNames?.cpExecute,
  ];
  for (let i = 0; i < roleHierarchyArr.length; i += 1) {
    if (roleHierarchyArr[i] === userRole) {
      return roleHierarchyArr[i - 1] || null;
    }
  }
  return null;
}
function checkProjectValidation(role) {
  if (
    role === roleNames?.superAdmin ||
    role === roleNames?.cpBusinessHead ||
    role === roleNames?.cpHead
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
};
export {
  basicRolePermission,
  roleSubordinates,
  parentRole,
  checkProjectValidation,
  checkValidParent,
  userDataObj,
};
