import { CpAppPermission } from "../../models/Permission";
import initDb from "../lib/db";

const {
  ApiResponse,
  RESPONSE_STATUS,
  RESPONSE_MESSAGE,
} = require("../appConstants");
const { CpAppRole } = require("../../models/AppRole");
const {
  userDataObj,
  basicRolePermission,
  roleSubordinates,
} = require("../../shared/roleManagement");

class ApplicationSrv {
  createRole = async (providedUser, role) => {
    try {
      await initDb();
      const roleData = await CpAppRole.findOne({ name: role.name });
      if (roleData) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }
      const newRole = {};
      newRole[userDataObj?.name] = role.name;
      const permissions = await CpAppPermission.find({
        name: { $in: basicRolePermission(role.name) },
      }).select("_id");

      newRole[userDataObj?.permissions] = permissions.map(
        (permission) => permission?._id,
      );
      const subordinateRoles = await CpAppRole.find({
        name: { $in: roleSubordinates(role.name) },
      }).select("_id name");
      newRole[userDataObj?.subordinateRoles] = subordinateRoles.map(
        (subordinateRole) => subordinateRole?._id,
      );

      const roleSch = new CpAppRole(newRole);
      const result = await roleSch.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, result);
    } catch (error) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  createPermission = async (providedUser, permission) => {
    try {
      await initDb();
      const permissionData = await CpAppPermission.findOne({
        name: permission.name,
      });
      if (permissionData) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }

      const permissionSch = new CpAppPermission(permission);
      const result = await permissionSch.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, result);
    } catch (error) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };
}
export default ApplicationSrv;
