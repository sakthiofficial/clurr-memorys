import Joi from "joi";
import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
} from "../../../../appConstants";
import ApplicationSrv from "../../../../services/applicationSrv";

export async function POST(request) {
  try {
    //   const providedUser = await getUserByToken(request);
    //   if (!providedUser) {
    //     return new Response(
    //       JSON.stringify(
    //         new ApiResponse(
    //           RESPONSE_STATUS?.UNAUTHORIZED,
    //           RESPONSE_MESSAGE?.UNAUTHORIZED,
    //           null,
    //         ),
    //       ),
    //     );
    //   }
    const bodyData = await request.json();

    const validateQuery = Joi.object({
      name: Joi.string().required(),
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
    const applicationSrv = new ApplicationSrv();
    const serviceRes = await applicationSrv?.createPermission(null, value);
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
