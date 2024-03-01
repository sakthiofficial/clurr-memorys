import axios from "axios";
import mongoose, { ObjectId } from "mongoose";
import { CpAppLead } from "../../models/AppLead";
import { CpAppPermission } from "../../models/Permission";
import initDb from "../lib/db";
import { leadStage, lsqLeadFieldNames } from "../../shared/lsqConstants";
import config from "@/lib/config";
import { CpAppProject } from "../../models/AppProject";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { CpAppUser } from "../../models/AppUser";

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
  constructor() {
    this.lsqConfig = config.lsqConfig;
  }

  createRole = async (providedUser, role) => {
    try {
      await initDb();
      const roleData = await CpAppRole.findOne({ name: role.name });
      if (roleData) {
        return new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
          null
        );
      }
      const newRole = {};
      newRole[userDataObj?.name] = role.name;
      const permissions = await CpAppPermission.find({
        name: { $in: basicRolePermission(role.name) },
      }).select("_id");

      newRole[userDataObj?.permissions] = permissions.map(
        (permission) => permission?._id
      );
      const subordinateRoles = await CpAppRole.find({
        name: { $in: roleSubordinates(role.name) },
      }).select("_id name");
      newRole[userDataObj?.subordinateRoles] = subordinateRoles.map(
        (subordinateRole) => subordinateRole?._id
      );

      const roleSch = new CpAppRole(newRole);
      const result = await roleSch.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, result);
    } catch (error) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error
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
          null
        );
      }

      const permissionSch = new CpAppPermission(permission);
      const result = await permissionSch.save();
      return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, result);
    } catch (error) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error
      );
    }
  };

  leadsOverallStatus = async (providedUser, { project }) => {
    const projectCheck = await CpAppProject.findOne({ name: project });
    if (!projectCheck) {
      return new ApiResponse(
        RESPONSE_STATUS?.NOTFOUND,
        RESPONSE_MESSAGE?.NOTFOUND,
        null
      );
    }
    const cpLeads = await CpAppLead.find({});
    // sv-> site visit
    const overAllStatus = {
      leadCount: 0,
      svScheduledCout: 0,
      svDoneCount: 0,
      createdLeadsCount: 0,
    };
    const leads = (cpLeads || [])
      .map((lead) => {
        if (lead?.leadId) {
          return lead;
        }
        return null;
      })
      .filter(Boolean);
    const leadIds = leads.map((lead) => lead?.leadId);
    overAllStatus.leadCount += leadIds.length;

    const { projectCredential } = this.lsqConfig;

    const apiUrl = this.lsqConfig?.apiUrl;

    const { accessKey, secretKey } = projectCredential[project];
    try {
      const lsqLeadData = await axios.post(
        `${apiUrl}LeadManagement.svc/Leads/Retrieve/ByIds?accessKey=${accessKey}&secretKey=${secretKey}`,
        {
          SearchParameters: {
            LeadIds: leadIds,
          },
          Columns: {
            Include_CSV:
              "mx_Origin_Project,mx_Project_Name,FirstName,EmailAddress,ProspectAutoId,Source,SourceCampaign,ProspectStage,CreatedOn,Origin,mx_Agency_Name,Phone,OwnerIdName,ProspectNumber,mx_Sub_Source,ProspectID",
          },
          Paging: {
            PageIndex: 1,
            PageSize: leadIds?.length,
          },
        }
      );
      await Promise.all(
        (lsqLeadData?.data?.Leads || []).map(async (lead) => {
          if (lead[lsqLeadFieldNames?.stage] === leadStage?.svDone) {
            overAllStatus.svDoneCount += 1;
          } else if (lead[lsqLeadFieldNames?.stage] === leadStage?.svSchedule) {
            overAllStatus.svScheduledCout += 1;
          }
          overAllStatus.createdLeadsCount += 1;
        })
      );
      return new ApiResponse(
        RESPONSE_STATUS?.OK,
        RESPONSE_MESSAGE?.OK,
        overAllStatus
      );
    } catch (error) {
      console.log("Error while Fetching lead By Id", error);
    }
  };

  internalUserOverallStatus = async (providedUser) => {
    if (
      !providedUser[userDataObj.permissions].includes(
        permissionKeyNames?.userManagement
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.INVALID,
        null
      );
    }
    const userRoleData = await CpAppRole.findOne({
     name: providedUser[userDataObj?.role][0]
    }
    );
    const roleDbData = await CpAppRole.find({ _id: userRoleData?.subordinateRoles});
    const roleIds = roleDbData.map((role) => role?._id);
    const usersByRoleId = await CpAppUser.find({ role: { $in: roleIds } });
    const userDashboardData = {};

    usersByRoleId.map((user) => {
      const roleDetails = (roleDbData || []).find((role) => {
        const roleObjectId = role?._id;
        const userObjectId = user[userDataObj?.role][0];
        return roleObjectId.equals(userObjectId);
      });
      if (userDashboardData[roleDetails?.name]) {
        userDashboardData[roleDetails?.name] += 1;
      } else {
        userDashboardData[roleDetails?.name] = 1;
      }
      return null
    });
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      userDashboardData
    );
  };
}
export default ApplicationSrv;
