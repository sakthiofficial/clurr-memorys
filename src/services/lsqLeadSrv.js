import config from "../lib/config";
import {
  customLsqField,
  leadRegistrationMapping,
  leadRegistrationStatus,
  leadStage,
  lsqActivityCode,
  lsqErrorMsg,
  lsqFieldValues,
  lsqLeadFieldNames,
} from "../../shared/lsqConstants";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  convertTimestampToDateTime,
} from "../appConstants";
import {
  checkValidRoleToAddLead,
  isPriorityUser,
  userDataObj,
} from "../../shared/roleManagement";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { CpAppCompany } from "../../models/AppCompany";
import { CpAppRole } from "../../models/AppRole";
import { CpAppProject } from "../../models/AppProject";
import { CpAppPermission } from "../../models/Permission";
import { CpAppUser } from "../../models/AppUser";
import CPUserSrv from "./cpUserSrv";
import { CpAppLead } from "../../models/AppLead";
import ActivitySrv from "./activitySrv";
import { activityActionTypes } from "@/helper/serviceConstants";

const { default: axios } = require("axios");

class LSQLeadSrv {
  constructor() {
    this.lsqHostUrl = "https://api-in21.leadsquared.com";
    this.lsqApiUrlToCaptureLead = `${this.lsqHostUrl}/v2/LeadManagement.svc/Lead.Capture`;
    this.retriveActivityOfLeadId = `${this.lsqHostUrl}/v2/ProspectActivity.svc/Retrieve`;
    this.lsqConfig = config.lsqConfig;
    this.calculateDaysDifference = (startDateStr, endDateStr = new Date()) => {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      const timeDifference = endDate - startDate;

      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      return daysDifference;
    };
    this.leadFromLsqByPhone = async (phone, project) => {
      const { lsqConfig } = config;
      const { projectCredential } = lsqConfig;
      if (!projectCredential[project]) {
        return null;
      }
      console.log(projectCredential);
      const { accessKey, secretKey } = projectCredential[project];

      const lsqData = await axios.get(
        `${lsqConfig?.apiUrl}LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${accessKey}&secretKey=${secretKey}&phone=${phone}`,
      );
      return lsqData.data;
    };
    this.leadFromLsqById = async (id, project) => {
      const { lsqConfig } = config;
      const { projectCredential } = lsqConfig;
      if (!projectCredential[project]) {
        return null;
      }
      const { accessKey, secretKey } = projectCredential[project];

      const lsqData = await axios.get(
        `${lsqConfig?.apiUrl}LeadManagement.svc/Leads.GetById?accessKey=${accessKey}&secretKey=${secretKey}&id=${id}`,
      );
      return lsqData.data;
    };
    this.getRegistrationStatus = async (leadData, project) => {
      if (leadData[lsqLeadFieldNames?.stage] === leadStage?.new) {
        return leadRegistrationStatus?.sucess;
      }

      const { projectCredential } = this.lsqConfig;
      if (!projectCredential[project]) {
        return null;
      }
      const { accessKey, secretKey } = projectCredential[project];

      const leadId = leadData[lsqLeadFieldNames?.leadId];

      const lsqData = await axios.post(
        `${this.retriveActivityOfLeadId}?accessKey=${accessKey}&secretKey=${secretKey}&leadId=${leadId}`,
        {
          Parameter: {
            ActivityEvent: 3002,
          },
          Paging: {
            Offset: "0",
            RowCount: "10",
          },
        },
      );
      let leadActivity = lsqData?.data;
      if (leadActivity) {
        leadActivity = leadActivity?.ProspectActivities;
      }

      const svdActivity = (leadActivity || []).filter((activity) => {
        const isSvdAcitivity = activity?.Data.filter(
          (dt) => dt?.Value === leadStage?.svDone,
        );
        if (isSvdAcitivity.length > 0) {
          return activity;
        }
        return null;
      });
      if (svdActivity[0]) {
        const activityDate = svdActivity[0][lsqLeadFieldNames?.createdOn];
        const activityDateDiffrence =
          this.calculateDaysDifference(activityDate);

        return activityDateDiffrence < 15
          ? leadRegistrationStatus?.exist
          : leadRegistrationStatus?.duplicate;
      }

      return leadRegistrationStatus?.duplicateMax;
    };
    this.handleApiData = async (providedUser, leadData, projectName) => {
      const source = leadData[lsqLeadFieldNames?.source];
      if (source === lsqFieldValues?.source) {
        let push = true;
        if (
          providedUser[userDataObj?.permissions].includes(
            permissionKeyNames?.leadViewWithoutNumber,
          )
        ) {
          leadData[lsqLeadFieldNames?.phone] = null;
        }
        if (
          providedUser[userDataObj?.role] === roleNames?.cpExecute ||
          providedUser[userDataObj?.role] === roleNames?.cpBranchHead
        ) {
          const lsqCpCode =
            leadData[lsqLeadFieldNames?.subSource].split(" ")[0];
          const cpCode = providedUser[userDataObj?.cpCode];
          push = cpCode === lsqCpCode;
        }
        leadData.Project = projectName;

        leadData[customLsqField?.leadRegistration] =
          await this.getRegistrationStatus(leadData, projectName);
        return push ? leadData : null;
      }
      return null;
    };
  }

  retriveLead = async (
    providedUser,
    { leadStartDate, leadEndDate, project },
  ) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithNumber,
      ) &&
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithoutNumber,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
    }
    const { projectCredential } = this.lsqConfig;
    const projectArr = isPriorityUser(providedUser[userDataObj?.role])
      ? Object.keys(projectCredential)
      : providedUser[userDataObj?.projects];
    const projectKeys = project !== "All" ? [project] : projectArr;
    let data = [];

    await Promise.all(
      (projectKeys || []).map(async (projectName) => {
        const apiUrl = this.lsqConfig?.apiUrl;

        const { accessKey, secretKey } = projectCredential[projectName];
        const projectDbData = await CpAppProject.findOne({ name: projectName });
        if (projectDbData?.permission === "leadAddAndView") {
          let cpCode = null;
          if (
            providedUser[userDataObj?.role].includes(roleNames?.cpBranchHead)
          ) {
            const branchHeadCompany = await CpAppCompany.findOne({
              branchHeadId: providedUser[userDataObj.id],
            });
            cpCode = branchHeadCompany?.cpCode || null;
          }
          let query = {
            project,
            created: {
              $gte: leadStartDate,
              $lte: leadEndDate,
            },
          };
          const cpBranchHeadQuery = {
            ...query,
            subSource: new RegExp(cpCode),
          };
          const cpExecuteQuery = {
            ...query,
            createdBy: providedUser[userDataObj?.id],
          };
          switch (providedUser[userDataObj?.role][0]) {
            case roleNames?.cpBranchHead:
              query = cpBranchHeadQuery;
              break;
            case roleNames?.cpExecute:
              query = cpExecuteQuery;
              break;
            default:
              break;
          }
          const cpLeads = await CpAppLead.find(query);
          const leads = (cpLeads || [])
            .map((lead) => {
              if (lead?.leadId) {
                return lead;
              }
              return null;
            })
            .filter(Boolean);
          const leadIds = leads.map((lead) => lead?.leadId);
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
              },
            );
            const structuredLeadData = await Promise.all(
              (lsqLeadData?.data?.Leads || []).map(async (lead) => {
                const structuredApiData = await this.handleApiData(
                  providedUser,
                  lead,
                  projectName,
                );

                if (structuredApiData) {
                  return structuredApiData;
                }
              }),
            );
            const leadDataObj = {
              name: "name",
              createdBy: "createdBy",
              subSource: "subSource",
              email:"email"
            };
            const resultArray = leads.map((lead) => {
              const matchingLeadData = structuredLeadData.find((leadData) => {
                return leadData[lsqLeadFieldNames?.leadId] === lead?.leadId;
              });
              matchingLeadData[lsqLeadFieldNames?.firstName] =
                lead[leadDataObj?.name];
              matchingLeadData[lsqLeadFieldNames?.subSource] =
                lead[leadDataObj?.subSource];
                matchingLeadData[lsqLeadFieldNames?.email] =
                lead[leadDataObj?.email];

              return {...matchingLeadData};
            });
            data = [...resultArray];
          } catch (error) {
            console.log("Error while Fetching lead By Id", error);
          }
          return null;
        }
        function convertUTCtoIST(utcTime) {
          const utcDate = new Date(utcTime);

          utcDate.setUTCHours(utcDate.getUTCHours() + 11);

          // Format the date as 'YYYY-MM-DD HH:mm:ss'.
          const formattedDate = utcDate
            .toISOString()
            .replace("T", " ")
            .slice(0, -5);

          return formattedDate;
        }
        function convertISTtoUTC(utcTime) {
          const utcDate = new Date(utcTime);

          // Format the date as 'YYYY-MM-DD HH:mm:ss'.
          const formattedDate = utcDate
            .toISOString()
            .replace("T", " ")
            .slice(0, -5);

          return formattedDate;
        }
        const startDate = convertISTtoUTC(
          convertTimestampToDateTime(leadStartDate),
        );
        const endDate = convertISTtoUTC(
          convertTimestampToDateTime(leadEndDate),
        );

        let apiPageIndex = 1;

        async function fetchLeadData(pageIndex) {
          console.log(`Fetching in${projectName} and in ${pageIndex}`);
          try {
            const apiData = await axios.post(
              `${apiUrl}LeadManagement.svc/Leads.Get?accessKey=${accessKey}&secretKey=${secretKey}`,
              {
                Parameter: {
                  LookupName: "CreatedOn",
                  LookupValue: startDate,
                  SqlOperator: ">=",
                },
                Columns: {
                  Include_CSV:
                    "mx_Origin_Project,mx_Project_Name,FirstName,EmailAddress,ProspectAutoId,Source,SourceCampaign,ProspectStage,CreatedOn,Origin,mx_Agency_Name,Phone,OwnerIdName,ProspectNumber,mx_Sub_Source,RelatedId",
                },
                Sorting: {
                  ColumnName: "CreatedOn",
                  Direction: "0",
                },
                Paging: {
                  PageIndex: pageIndex,
                  PageSize: 500,
                },
              },
            );
            return apiData;
          } catch (error) {
            console.log("Error While Fetch Lead Data ", error);
            return null;
          }
        }
        let apiData = await fetchLeadData(apiPageIndex);

        for (let i = 0; i < apiData?.data.length; i += 1) {
          const dateIst = convertUTCtoIST(
            apiData.data[i][lsqLeadFieldNames?.createdOn],
          );

          const createOnDate =
            apiData.data[i][lsqLeadFieldNames.createdOn].split(" ");
          const endApiDate = endDate.split(" ");
          // if the data is
          if (
            createOnDate[0] === endApiDate[0] &&
            apiData.data[i][lsqLeadFieldNames.createdOn].split(" ")[1] >
              endDate.split(" ")[1]
          ) {
            return data;
          }
          apiData.data[i][lsqLeadFieldNames?.createdOn] = dateIst;
          const structuredApiData = await this.handleApiData(
            providedUser,
            apiData.data[i],
            projectName,
          );
          if (structuredApiData) {
            data.push(structuredApiData);
          }

          if (i === apiData.data.length - 1 && apiData.data.length > 0) {
            apiPageIndex += 1;

            apiData = await fetchLeadData(apiPageIndex);
            i = 0;
          }
        }
      }),
    );

    return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, data);
  };

  createLead = async (
    providedUser,
    { id, companyCode, project, userName, email, phone, notes },
  ) => {
    // add project validation
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadManagement,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    try {
      const cpCompany = await CpAppCompany.findOne({ cpCode: companyCode });
      const userSrv = new CPUserSrv();
      const cpUser = await userSrv.getUserById(id);

      if (!cpCompany || !checkValidRoleToAddLead(cpUser[userDataObj?.role])) {
        return new ApiResponse(
          RESPONSE_STATUS?.NOTFOUND,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }
      const subSource = `${cpUser[userDataObj?.name]} - ${companyCode}`;
      const isPresentInLsq = await this.retriveLeadByPhone(providedUser, {
        phone,
        project,
      });
      const data = isPresentInLsq?.result[0];
      if (data) {
        const cpLeadSchema = new CpAppLead({
          name: userName,
          email,
          phone,

          project,
          leadId: data[lsqLeadFieldNames?.leadId],
          createdBy: id,
          subSource,
        });
        const leadResult = await cpLeadSchema.save();
        const activityService = new ActivitySrv();

        await activityService.createActivity(
          activityActionTypes?.leadAdd,
          providedUser[userDataObj?.name],

          providedUser?._id,
          userName,
          leadResult?._id,
        );
        return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
          leadResult,
          Status: "Success",
          Message: {
            IsCreated: false,
          },
        });
      }
      console.log('comming here');
      const { lsqConfig } = config;
      const { projectCredential } = lsqConfig;
      const { accessKey, secretKey } = projectCredential[project];
      const { source } = lsqFieldValues;
      const postBody = [
        {
          Attribute: lsqLeadFieldNames?.firstName,
          Value: userName,
        },
        {
          Attribute: lsqLeadFieldNames?.email,
          Value: email,
        },
        {
          Attribute: lsqLeadFieldNames?.phone,
          Value: phone,
        },
        {
          Attribute: lsqLeadFieldNames?.source,
          Value: source,
        },
        {
          Attribute: lsqLeadFieldNames?.subSource,
          Value: subSource,
        },
        {
          Attribute: lsqLeadFieldNames?.project,
          Value: project,
        },
        {
          Attribute: lsqLeadFieldNames?.notes,
          Value: notes,
        },
      ];

      const promise = await axios.post(this.lsqApiUrlToCaptureLead, postBody, {
        params: {
          accessKey,
          secretKey,
        },
      });
      const cpLeadSchema = new CpAppLead({
        name: userName,
        email,
        phone,

        project,
        leadId: promise.data?.Message?.RelatedId,
        createdBy: id,
        subSource,
        isCreatedInLsq:promise?.data?.Message?.IsCreated||false
      });
      const leadResult = await cpLeadSchema.save();
      const activityService = new ActivitySrv();
      await activityService.createActivity(
        activityActionTypes?.leadAdd,
        providedUser[userDataObj?.name],

        providedUser?._id,
        userName,
        leadResult?._id,
      );
      return new ApiResponse(
        promise?.status,
        promise?.statusText,
        promise?.data,
      );
    } catch (error) {
      console.log("While adding user error", error);
      if (error.response) {
        if (error.response.data) {
          return new ApiResponse(
            RESPONSE_STATUS?.ERROR,
            RESPONSE_MESSAGE?.USEREXIST,
            {
              email:
                lsqErrorMsg?.emailError ===
                error.response.data?.ExceptionMessage,
            },
          );
        }
      }
      return new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
    }
  };

  retriveLeadByPhone = async (providedUser, { phone, project }) => {
    const phoneNumberSplit = phone.split("-");
    phone = phoneNumberSplit.length > 1 ? phoneNumberSplit[1] : phone;
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithNumber,
      ) &&
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithoutNumber,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    let leadData = await this.leadFromLsqByPhone(phone, project);
    leadData = Promise.all(
      (leadData || []).map(async (lead) => {
        lead[customLsqField?.leadRegistration] =
          await this.getRegistrationStatus(lead, project);
        return lead;
      }),
    );
    const leadResult = await leadData;
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      await leadResult,
    );
  };

  retriveLeadById = async (providedUser, { id, project }) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithNumber,
      ) &&
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithoutNumber,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    let leadData = await this.leadFromLsqById(id, project);
    leadData = Promise.all(
      (leadData || []).map(async (lead) => {
        lead[customLsqField?.leadRegistration] =
          await this.getRegistrationStatus(lead, project);
        return lead;
      }),
    );
    const leadResult = await leadData;

    if (
      providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithoutNumber,
      )
    ) {
      leadResult[0][lsqLeadFieldNames?.phone] = null;
    }
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      await leadResult,
    );
  };
}
export default LSQLeadSrv;
