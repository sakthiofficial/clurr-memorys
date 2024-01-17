import Joi from "joi";
import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../appConstants";
import getUserByToken from "../../../helper/getUserByToken";
import CpManagementSrv from "../../../services/cpManagementSrv";

export async function POST(request) {
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
    const bodyData = await request.json();

    const validateQuery = Joi.object({
      parentId: Joi.string().required(),

      cpCompany: Joi.object({
        name: Joi.string().required(),
        projects: Joi.array().items(Joi.string()).required(),
      }),
      cpBranchHead: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        projects: Joi.array().items(Joi.string()).required(),
        isPrimary: Joi.boolean().required(),
        phone: Joi.string().required(),
        parentId: Joi.string(),
      }).required(),
      cpExecute: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
        projects: Joi.array().items(Joi.string()).required(),
        isPrimary: Joi.boolean().required(),
        phone: Joi.string().required(),
        parentId: Joi.string(),
      }),
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
    const cpManagementSrv = new CpManagementSrv();
    const serviceRes = await cpManagementSrv.createCpAccount(
      providedUser,
      value,
    );
    return NextResponse.json(serviceRes, { status: serviceRes?.status });
  } catch (error) {
    const response = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.INVALID,
      error,
    );
    return NextResponse.json(response, { status: response?.status });
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

    const cpManagementSrv = new CpManagementSrv();
    const serviceRes = await cpManagementSrv.retriveCpCompanys(providedUser);

    return NextResponse.json(serviceRes, { status: serviceRes?.status });
  } catch (error) {
    const response = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.INVALID,
      error,
    );
    return NextResponse.json(response, { status: response?.status });
  }
}
