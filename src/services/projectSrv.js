import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../appConstants";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { isPriorityUser, userDataObj } from "../../shared/roleManagement";
import { CpAppRole } from "../../models/AppRole";
import { CpAppPermission } from "../../models/Permission";

const { CpAppProject } = require("../../models/AppProject");

class ProjectSrv {
  createProject = async (providedUser, project) => {
    try {
      const isPriorityProvider = isPriorityUser(
        providedUser[userDataObj?.role],
      );
      if (
        !isPriorityProvider &&
        !(providedUser[userDataObj?.projects] || []).includes(
          permissionKeyNames?.projectManagement,
        )
      ) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }
      const projectObj = new CpAppProject(project);
      const result = await projectObj.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, result);
    } catch (error) {
      console.log("While Saving Project Data Error", error);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  retriveProject = async (providedUser) => {
    console.log(providedUser);
  };
}
export default ProjectSrv;
