import {
  RESPONSE_MESSAGE,
  RESPONSE_MESSAGE_DETAILS,
  SERVICE_RESPONSE,
} from "../appConstants";
import { Session } from "../../models/session";
import { permissionKeyNames } from "../../shared/cpNamings";

const { CpProject } = require("../../models/cpProject");

class ProjectSrv {
  createProject = async (token, project) => {
    try {
      const providedUserSessionData = await Session.findOne({
        token,
      }).populate("userId");
      if (!providedUserSessionData) {
        return SERVICE_RESPONSE(
          RESPONSE_MESSAGE?.INVALID,
          RESPONSE_MESSAGE_DETAILS?.INVALID_PERMISSION,
          null,
        );
      }
      const { userId: providedUser } = providedUserSessionData;
      if (
        !(providedUser?.permissions || []).includes(
          permissionKeyNames?.projectManagement,
        )
      ) {
        return SERVICE_RESPONSE(
          RESPONSE_MESSAGE?.INVALID,
          RESPONSE_MESSAGE_DETAILS?.INVALID_PERMISSION,
          null,
        );
      }
      const projectObj = new CpProject(project);
      projectObj.save();
      return SERVICE_RESPONSE(
        RESPONSE_MESSAGE?.OK,
        RESPONSE_MESSAGE_DETAILS?.PROJECTADDED,
        null,
      );
    } catch (error) {
      console.log("While Saving Project Data Error", error);
      return SERVICE_RESPONSE(
        RESPONSE_MESSAGE?.ERROR,
        RESPONSE_MESSAGE_DETAILS?.ERROR,
        error,
      );
    }
  };
}
export default ProjectSrv;
