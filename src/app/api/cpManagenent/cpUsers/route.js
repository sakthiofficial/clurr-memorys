import { NextResponse } from "next/server";
import Joi from "joi";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../../appConstants";
import getUserByToken from "../../../../helper/getUserByToken";
import CpManagementSrv from "../../../../services/cpManagementSrv";

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

    const cpManagementSrv = new CpManagementSrv();
    const serviceRes = await cpManagementSrv.retriveCpUser(providedUser);

    return NextResponse.json(serviceRes, { status: serviceRes?.status });
  } catch (error) {
    console.log(error);
    const response = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error,
    );
    return NextResponse.json(response, { status: response?.status });
  }
}
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
      companyId: Joi.string().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      phone: Joi.string().required().min(10),

      email: Joi.string().required(),
      projects: Joi.array().min(1),
      parentId: Joi.string().required(),
    });
    const { error, value } = validateQuery.validate(bodyData);

    if (error) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.ERROR,
            RESPONSE_MESSAGE?.ERROR,
            error,
          ),
        ),
      );
    }

    const cpManagement = new CpManagementSrv();
    const srvResponse = await cpManagement.createCpExecute(providedUser, value);

    return new Response(JSON.stringify(srvResponse));
  } catch (error) {
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, error),
      ),
    );
  }
}
