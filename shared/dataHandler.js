import { convertTimestampToDateTime } from "@/appConstants";
import { activityDataFields } from "./entity";
import { customLsqField, lsqLeadFieldNames } from "./lsqConstants";

export function structureDataInDateWise(data) {
  if (!data) {
    return null;
  }
  const dateWise = {};
  for (let i = 0; i < data?.length; i += 1) {
    const date = convertTimestampToDateTime(
      data[i][activityDataFields?.created]
    ).split(" ");
    const key = date[0];

    if (dateWise[key]) {
      dateWise[key].push(data[i]);
    } else {
      dateWise[key] = [data[i]];
    }
  }
  return [dateWise];
}

export function removeRolesFromArray(array) {
  const rolesToRemove = ["CP Branch Head", "CP Executive"];
  return array?.filter((role) => !rolesToRemove?.includes(role));
}
export function dashboardBoardData(leads) {
  const dashboard = {
    funnel: {
      totalLeads: (leads?.length || 0) - 1,
      registratedLeads: 0,
    },
    dayWise: {},
    recentLeads: leads,
  };
  for (let i = 0; i < leads?.length; i += 1) {
    const leadStage = leads[i][lsqLeadFieldNames?.stage];
    const date = leads[i][lsqLeadFieldNames?.createdOn];
    if (dashboard.funnel[leadStage]) {
      dashboard.funnel[leadStage] += 1;
    } else {
      dashboard.funnel[leadStage] = 1;
    }
    if (dashboard.dayWise[date]) {
      dashboard.dayWise[date] = [...dashboard.dayWise[date], leads[i]];
    } else {
      dashboard.dayWise[date] = [leads[i]];
    }
    dashboard.funnel.registratedLeads = leads[customLsqField?.isCreatedInLsq]
      ? (dashboard.funnel.registratedLeads += 1)
      : dashboard.funnel.registratedLeads;
  }
  return dashboard;
}
