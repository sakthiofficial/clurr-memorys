import config from "../lib/config";
import { lsqFieldValues, lsqLeadFieldNames } from "../../shared/lsqConstants";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  convertTimestampToDateTime,
} from "../appConstants";
import { userDataObj } from "../../shared/roleManagement";
import { permissionKeyNames, roleNames } from "../../shared/cpNamings";
import { CpAppCompany } from "../../models/AppCompany";

const { default: axios } = require("axios");

class LSQLeadSrv {
  constructor() {
    this.lsqApiUrlToCaptureLead =
      "https://api-in21.leadsquared.com/v2/LeadManagement.svc/Lead.Capture";
    this.leadFromLsqByPhone = async (phone, project) => {
      const { lsqConfig } = config;
      if (!lsqConfig[project]) {
        return null;
      }
      const { accessKey, secretKey } = lsqConfig[project];

      const lsqData = await axios.get(
        `${lsqConfig?.apiUrl}LeadManagement.svc/RetrieveLeadByPhoneNumber?accessKey=${accessKey}&secretKey=${secretKey}&phone=${phone}`,
      );
      return lsqData.data;
    };
  }

  retriveLead = async (
    providedUser,
    { leadStartDate, leadEndDate, project },
  ) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithNumber ||
          permissionKeyNames?.leadViewWithoutNumber,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
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
    const endDate = convertISTtoUTC(convertTimestampToDateTime(leadEndDate));
    const { lsqConfig } = config;
    const { accessKey, secretKey } = lsqConfig[project];
    let apiPageIndex = 1;

    const data = [];
    async function fetchLeadData(pageIndex) {
      try {
        const apiData = await axios.post(
          `${lsqConfig?.apiUrl}LeadManagement.svc/Leads.Get?accessKey=${accessKey}&secretKey=${secretKey}`,
          {
            Parameter: {
              LookupName: "CreatedOn",
              LookupValue: startDate,
              SqlOperator: ">=",
            },
            Columns: {
              Include_CSV:
                "mx_Origin_Project,ProspectAutoId,Source,SourceCampaign,ProspectStage,CreatedOn,Origin,mx_Agency_Name,Phone,OwnerIdName,ProspectNumber,mx_Sub_Source",
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
        console.log("comming here", data.length);
        return data;
      }
      apiData.data[i][lsqLeadFieldNames?.createdOn] = dateIst;
      const source = apiData.data[i][lsqLeadFieldNames?.source];

      const structuredApiData = apiData.data[i];
      if (source === lsqFieldValues?.source) {
        let push = true;
        if (
          providedUser[userDataObj?.permissions].includes(
            permissionKeyNames?.leadViewWithoutNumber,
          )
        ) {
          structuredApiData[lsqLeadFieldNames?.phone] = null;
        }
        if (
          providedUser[userDataObj?.role] === roleNames?.cpExecute ||
          providedUser[userDataObj?.role] === roleNames?.cpBranchHead
        ) {
          const lsqCpCode =
            apiData.data[i][lsqLeadFieldNames?.subSource].split(" ")[0];
          const cpCode = providedUser[userDataObj?.cpCode];
          push = cpCode === lsqCpCode;
        }

        if (push) {
          data.push(structuredApiData);
        }
      }
      if (i + 1 === apiData.data.length && apiData.data.length > 0) {
        apiPageIndex += 1;

        apiData = await fetchLeadData(apiPageIndex);
        i = 0;
      }
    }
    return new ApiResponse(
      RESPONSE_STATUS?.OK,
      RESPONSE_MESSAGE?.OK,
      data.length,
    );
  };

  createLead = async (
    providedUser,
    { id, project, userName, email, phone, notes },
  ) => {
    // add project validation
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.cpManagement,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    try {
      const cpCompany = await CpAppCompany.findOne({ _id: id });
      if (!cpCompany) {
        return new ApiResponse(
          RESPONSE_STATUS?.NOTFOUND,
          RESPONSE_MESSAGE?.INVALID,
          null,
        );
      }
      const { name, cpCode } = cpCompany;
      const { lsqConfig } = config;
      const { accessKey, secretKey } = lsqConfig[project];
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
          Value: `${cpCode} - ${name} `,
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
      return new ApiResponse(
        promise?.status,
        promise?.statusText,
        promise?.data,
      );
    } catch (error) {
      console.log("While adding user error", error);
    }
  };

  retriveLeadByPhone = async (providedUser, { phone, project }) => {
    if (
      !providedUser[userDataObj?.permissions].includes(
        permissionKeyNames?.leadViewWithNumber ||
          permissionKeyNames?.leadViewWithoutNumber,
      )
    ) {
      return new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.INVALID,
        null,
      );
    }
    const leadData = await this.leadFromLsqByPhone(phone, project);
    return new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, leadData);
  };
}
export default LSQLeadSrv;
