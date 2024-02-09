import initDb from "../lib/db";
import { Session } from "../../models/session";
import { TOKEN_VARIABLES } from "../appConstants";
import { CpAppUser } from "../../models/AppUser";
import { userDataObj } from "../../shared/roleManagement";

export default async function getUserByToken(request) {
  await initDb();
  const cookie = request.cookies.get(TOKEN_VARIABLES?.TOKEN_NAME);
  if (!cookie) {
    return null;
  }
  const { value: token } = cookie;
  const providedUserSessionData = await Session.findOne({
    token,
  });

  if (!providedUserSessionData) {
    return null;
  }
  const user = await CpAppUser.findOne({
    _id: providedUserSessionData?.userId,
  })
    .populate({
      path: "role",
      populate: [
        { path: "permissions", model: "CpAppPermission" },
        { path: "subordinateRoles", model: "CpAppRole" },
      ],
    })
    .populate({
      path: "projects",
      model: "CpAppProject",
    })
    .lean();
  const userPermissions = [
    ...new Set(
      user.role.flatMap((role) =>
        role.permissions.map((permission) => permission.name),
      ),
    ),
  ];
  const userSubordinateRoles = [
    ...new Set(
      user.role.flatMap((role) =>
        role.subordinateRoles.map((subordinate) => subordinate.name),
      ),
    ),
  ];
  user[userDataObj?.projects] = user[userDataObj?.projects].map(
    (project) => project.name,
  );
  user[userDataObj?.permissions] = userPermissions;
  user[userDataObj?.subordinateRoles] = userSubordinateRoles;
  user[userDataObj?.role] = (user?.role || []).map((role) => role?.name);

  if (!providedUserSessionData) {
    return null;
  }
  return user;
}
