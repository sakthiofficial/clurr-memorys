import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../appConstants";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { isPriorityUser, userDataObj } from "../../shared/roleManagement";

const { CpAppProject: CpProject } = require("../../models/AppProject");

class ProjectSrv {
  createProject = async (providedUser, project) => {
    try {
      const isPriorityProvider = isPriorityUser(
        providedUser[userDataObj?.role],
      );
      console.log(isPriorityProvider, providedUser[userDataObj?.permissions]);
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
      const projectObj = new CpProject(project);
      const result = await projectObj.save();
      console.log(result, projectObj);
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
