import { activityActionTypes } from "@/helper/serviceConstants";
import CPUserSrv from "./cpUserSrv";
import { CpAppRole } from "../../models/AppRole";
import { userDataObj } from "../../shared/roleManagement";
import { CpAppPermission } from "../../models/Permission";
import { CpAppActivity } from "../../models/AppActivity";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";

const {
  permissionKeyNames,
  activityOperationTypes,
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

  createActivity = async (activityType, performedTo, performedBy) => {
    // add //edit //delete //permission

    const userSrv = new CPUserSrv();
    const activityEntity = this.getActivityEntitys(activityType);
    const performedUserData = await userSrv.getUserById(performedBy);
    const roleData = await CpAppRole.find({
      name: performedUserData[userDataObj?.role],
    });
    const permissionData = await CpAppPermission.findOne({
      name: activityEntity?.category,
    });
    const roleId = roleData[0]?._id;
    const permissionId = permissionData?._id;
    const activity = {
      actionCategory: permissionId,
      performedTo,
      actionType: activityEntity?.actionType,
      performedBy,
      performedRole: roleId,
    };
    const actitySchema = new CpAppActivity(activity);
    const actityResult = await actitySchema.save();
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      actityResult,
    );
  };

  retriveActivitys = async (providedUser) => {
    const activitys = await CpAppActivity.find()
      .populate("actionCategory")
      .populate("performedTo")
      .populate("performedBy")
      .populate("performedRole");
  };
}
export default ActivitySrv;
