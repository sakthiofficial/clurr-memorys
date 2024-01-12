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
  woj: "The World oj joy - miyapur",
  oncloud: "OnCloud33 - Bachupally",
  balanagar: "Galleria Gardens - Balanagar",
};
export const projectActions ={
leadViewOnly :"leadViewOnly",
leadViewAndAdd:"leadAddAndView"
}