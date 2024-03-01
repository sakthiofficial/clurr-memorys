import Joi from "joi";
import { NextResponse } from "next/server";
import getUserByToken from "@/helper/getUserByToken";
import ApplicationSrv from "@/services/applicationSrv";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";

export async function GET(request) {
  const providedUser = await getUserByToken(request);
  const { searchParams } = new URL(request.url);
  const params = {
    project: searchParams.get("project"),
  };
  const validateQuery = Joi.object({
    project: Joi.string().required(),
    leadStartDate: Joi.number().required(),
    leadEndDate: Joi.number().required(),

  });
  const { error, value } = validateQuery.validate(params);
  if (error || !providedUser) {
    const validationErrorResponse = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error
    );

    return NextResponse.json(validationErrorResponse, {
      status: validationErrorResponse?.status,
    });
  }
  const applicationSrv = new ApplicationSrv();
  const srvResponse = await applicationSrv.leadsOverallStatus(providedUser,value);
  return NextResponse.json(srvResponse, { status: srvResponse?.status });
}
