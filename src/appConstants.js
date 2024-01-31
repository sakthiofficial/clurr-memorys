export const RESPONSE_STATUS = {
  OK: 200,
  ERROR: 400,
  UNAUTHORIZED: 401,
  NOTFOUND: 404,
};

export const RESPONSE_MESSAGE = {
  OK: "OK",
  ERROR: "ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  LOGGED_IN: "LOGGED_IN",
  INVALID: "INVALID",
  USEREXIST: "USEREXIST",
  NOTFOUND: "NOTFOUND",
};

export const API_ERRORCODE = {
  SERVER_ERROR: 101,
  BLOCKCHAIN_ERROR: 201,
  EXTERNAL_RESOURCE_ERROR: 301,
};
export const RESPONSE_MESSAGE_DETAILS = {
  AUTHENTICATION_FAILED: "INVALID USER DETAILS",
  USEREXIST: "USER ALREADY EXIST",
  AUTHENTICATION_SUCSESS: "USER SUCCESSFULLY LOGED IN",
  INVALID_PERMISSION: "INVALID PERMESSIONS TO THE USER",
  USERADDED: "USER CREATED SUCCESSFULLY",
  PROJECTADDED: "PROJECT CREATED SUCCESSFULLY",
  ERROR: "ERROR OCCURS",
};
export const TOKEN_VARIABLES = {
  TOKEN_NAME: "SESSIONID",
};
export const ApiResponse = function Response(statusCode, message, result) {
  this.status = statusCode;
  this.message = message;
  this.result = result;
};
export const SERVICE_RESPONSE = (success, message, result) => {
  return {
    success,
    message,
    result,
  };
};

export const genrateUnixTimestamp = (date) => {
  const resDate = Math.floor(date || Date.now() / 1000);
  return resDate;
};

export const projectNames = {
  woj: "The World of joy - miyapur",
  oncloud: "OnCloud33 - Bachupally",
  balanagar: "Galleria Gardens - Balanagar",
};
export const projectActions = {
  leadViewOnly: "leadViewOnly",
  leadViewAndAdd: "leadAddAndView",
};
export function convertTimestampToDateTime(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}
export function convertDateToTimeStamp(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return Math.floor(date.getTime() / 1000);
}
export const userValidationErrors = {
  IvalidPermission: "Permission Denied",
  HighLevelAccess: "Insufficient Access Level",
  InvalidParentProject: "Parent Project Not Valid",
  InvalidProject: "Project Not Located",
  ParentRoleLimitation: "Parent Role Invalid",
};
export const activityList = {};
export const activityType = {};
