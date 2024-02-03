import Joi from "joi";
import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  projectNames,
} from "../../../../appConstants";
import getUserByToken from "../../../../helper/getUserByToken";
import LSQLeadSrv from "../../../../services/lsqLeadSrv";

export async function GET(request) {
  try {
    const providedUser = await getUserByToken(request);
    if (!providedUser) {
      const errorResponse = new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
      return NextResponse.json(errorResponse, {
        status: errorResponse?.status,
      });
    }
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const project = searchParams.get("project");

    const params = {
      phone,
      project,
    };

    const validateQuery = Joi.object({
      phone: Joi.string().required(),
      project: Joi.string().required(),
    });
    const { error, value } = validateQuery.validate(params);
    if (error || !providedUser) {
      const validationErrorResponse = new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.INVALID,
        error,
      );
      return NextResponse.json(validationErrorResponse, {
        status: validationErrorResponse?.status,
      });
    }
    const leadSrv = new LSQLeadSrv();

    const serviceRes = await leadSrv.retriveLeadByPhone(providedUser, value);
    return NextResponse.json(serviceRes, { status: serviceRes?.status });
  } catch (error) {
    const errorResponse = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error,
    );
    return NextResponse.json(errorResponse, { status: errorResponse?.status });
  }
}
