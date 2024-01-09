import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../appConstants";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { userDataObj } from "../../shared/roleManagement";

const { CpProject } = require("../../models/cpProject");

class ProjectSrv {
  createProject = async (providedUser, project) => {
    try {
      const isPriorityProvider =
        providedUser[userDataObj?.role] === roleNames?.superAdmin ||
        providedUser[userDataObj?.role] === roleNames?.cpBusinessHead;
      if (
        !isPriorityProvider &&
        !(providedUser?.permissions || []).includes(
          permissionKeyNames?.projectManagement,
        )
      ) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }
      const projectObj = new CpProject(project);
      await projectObj.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, null);
    } catch (error) {
      console.log("While Saving Project Data Error", error);
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  retriveProject = async (providedUser) => {};
}
export default ProjectSrv;
