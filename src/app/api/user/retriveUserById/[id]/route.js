import { headers } from "next/headers";
import Joi from "joi";
import { NextResponse } from "next/server";
import getUserByToken from "../../../../../helper/getUserByToken";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../../../appConstants";
import CPUserSrv from "../../../../../services/cpUserSrv";

export async function GET(request, { params }) {
  try {
    const providedUser = await getUserByToken(request);

    const { id } = params;

    if (!providedUser || !id) {
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
    const validateQuery = Joi.object({
      id: Joi.string().required(),
    });
    const { error, value } = validateQuery.validate(params);

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

    const userSrv = new CPUserSrv();
    const srvResponse = await userSrv.retriveUserById(providedUser, value.id);
    return NextResponse.json(srvResponse, { status: srvResponse?.status });
  } catch (error) {
    const errorResponce = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error,
    );
    return NextResponse.json(errorResponce, { status: errorResponce?.status });
  }
}
