import { NextResponse } from "next/server";
import Joi from "joi";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";
import ActivitySrv from "@/services/activitySrv";
import getUserByToken from "@/helper/getUserByToken";

export async function POST(request) {
  try {
    const providedUser = await getUserByToken(request);
    if (!providedUser) {
      return NextResponse.json(
        new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.UNAUTHORIZED,
          null,
        ),
      );
    }
    const bodyData = await request.json();

    const validateQuery = Joi.object({
      id: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
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
    const activitySrv = new ActivitySrv();
    const serviceRes = await activitySrv.retriveActivitysById(
      providedUser,
      value,
    );
    return NextResponse.json(serviceRes, { status: serviceRes?.status });
  } catch (error) {
    console.log("Error while performing ativity route", error);
    const response = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error,
    );
    return NextResponse.json(response, { status: response?.status });
  }
}
