import Joi from "joi";
import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../appConstants";
import getUserByToken from "../../../helper/getUserByToken";
import LSQLeadSrv from "../../../services/lsqLeadSrv";

export const dynamic = "force-dynamic";
export async function POST(req) {
  try {
    const providedUser = await getUserByToken(req);
    if (!providedUser) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.UNAUTHORIZED,
            RESPONSE_MESSAGE?.UNAUTHORIZED,
            null,
          ),
        ),
      );
    }
    const bodyData = await req.json();
    const validateQuery = Joi.object({
      id: Joi.string().required(),

      companyCode: Joi.string().required(),
      userName: Joi.string().required(),
      email: Joi.string(),
      phone: Joi.string().required(),
      notes: Joi.string(),
      project: Joi.string().required(),
    });
    const { error, value } = validateQuery.validate(bodyData);

    if (error) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.ERROR,
            RESPONSE_MESSAGE?.INVALID,
            error,
          ),
        ),
      );
    }
    const leadSrv = new LSQLeadSrv();
    const serviceRes = await leadSrv.createLead(providedUser, value);
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
export async function GET(request) {
  try {
    const providedUser = await getUserByToken(request);
    if (!providedUser) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.UNAUTHORIZED,
            RESPONSE_MESSAGE?.UNAUTHORIZED,
            null,
          ),
        ),
      );
    }
    const { searchParams } = new URL(request.url);
    const project = searchParams.get("project");
    const leadStartDate = searchParams.get("leadStartDate");
    const leadEndDate = searchParams.get("leadEndDate");
    const params = {
      project: project || "",
      leadStartDate,
      leadEndDate,
    };

    const validateQuery = Joi.object({
      project: Joi.string().required(),
      leadStartDate: Joi.string().required(),
      leadEndDate: Joi.string().required(),
    });
    const { error, value } = validateQuery.validate(params);
    if (error || !providedUser) {
      const validationErrorResponse = new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error,
      );
      return NextResponse.json(validationErrorResponse, {
        status: validationErrorResponse?.status,
      });
    }
    const leadSrv = new LSQLeadSrv();
    const serviceRes = await leadSrv.retriveLead(providedUser, value);
    return NextResponse.json(serviceRes, { status: serviceRes?.status });
  } catch (error) {
    console.log("Error while retriving lead", error);
    const errorResponse = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error,
    );
    return NextResponse.json(errorResponse, { status: errorResponse?.status });
  }
}
