import { activityActionTypes } from "@/helper/serviceConstants";
import CPUserSrv from "./cpUserSrv";
import { CpAppRole } from "../../models/AppRole";
import { roleSubordinates, userDataObj } from "../../shared/roleManagement";
import { CpAppPermission } from "../../models/Permission";
import { CpAppActivity } from "../../models/AppActivity";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";

const {
  permissionKeyNames,
  activityOperationTypes,
  roleNames,
} = require("../../shared/cpNamings");

class ActivitySrv {
  constructor(providedUser, actionType) {
    this.actionType = actionType;
    this.providedUser = providedUser;
    this.getActivityEntitys = (action) => {
      switch (action) {
        case activityActionTypes?.leadAdd:
          return {
            category: permissionKeyNames?.leadManagement,
            actionType: activityOperationTypes?.add,
          };
        case activityActionTypes?.userAdd:
          return {
            category: permissionKeyNames?.userManagement,
            actionType: activityOperationTypes?.add,
          };
        case activityActionTypes?.cpAdded:
          return {
            category: permissionKeyNames?.cpManagement,
            actionType: activityOperationTypes?.add,
          };
        case activityActionTypes?.userDelete:
          return {
            category: permissionKeyNames?.userManagement,
            actionType: activityOperationTypes?.delete,
          };
        case activityActionTypes?.userEdit:
          return {
            category: permissionKeyNames?.userManagement,
            actionType: activityOperationTypes?.edit,
          };
        case activityActionTypes?.cpDelete:
          return {
            category: permissionKeyNames?.cpManagement,
            actionType: activityOperationTypes?.delete,
          };
        case activityActionTypes?.cpEdit:
          return {
            category: permissionKeyNames?.cpManagement,
            actionType: activityOperationTypes?.edit,
          };

        default:
          return {
            category: permissionKeyNames?.userManagement,
            actionType: activityOperationTypes?.other,
          };
      }
    };
  }

  createActivity = async (
    activityType,
    performedBy,
    performedById,
    performedTo,
    performedToId,
  ) => {
    // add //edit //delete //permission
    try {
      const userSrv = new CPUserSrv();
      const activityEntity = this.getActivityEntitys(activityType);

      const userData = await userSrv.getUserById([
        performedById,
        performedToId,
      ]);
      const roleData = await CpAppRole.find({
        name: userData[1][userDataObj?.role],
      });
      const permissionData = await CpAppPermission.findOne({
        name: activityEntity?.category,
      });
      const roleId = roleData[0]?._id;
      const permissionId = permissionData?._id;
      const activity = {
        actionCategory: permissionId,
        performedToId,
        performedTo,
        actionType: activityEntity?.actionType,
        performedBy,
        performedById,
        performedRole: roleId,
      };
      const actitySchema = new CpAppActivity(activity);
      const actityResult = await actitySchema.save();

      return new ApiResponse(
        RESPONSE_STATUS?.OK,
        RESPONSE_MESSAGE?.OK,
        actityResult,
      );
    } catch (error) {
      console.log("Error while adding Activity", error);
    }
  };

  retriveActivitys = async (providedUser) => {
    const activitys = await CpAppActivity.find()
      .populate("actionCategory")
      .populate("performedTo")
      .populate("performedBy")
      .populate("performedRole");
    return activitys;
  };

  retriveActivitysByRole = async (providedUser, { role, from, to }) => {
    if (!providedUser[userDataObj?.role].includes(roleNames?.superAdmin)) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
    }
    const roleData =
      role === "All"
        ? roleSubordinates(providedUser[userDataObj?.role][0])
        : role;
    const roleDbData = await CpAppRole.find({ name: roleData });
    const roleIds = roleDbData.map((roleDb) => roleDb._id);

    const query = {
      created: {
        $gte: +from,
        $lte: +to,
      },
      performedRole: { $in: roleIds },
    };
    console.log("", query);

    // Fetch activities based on the query
    const activities = await CpAppActivity.find(query);
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      activities,
    );
  };
}
export default ActivitySrv;
