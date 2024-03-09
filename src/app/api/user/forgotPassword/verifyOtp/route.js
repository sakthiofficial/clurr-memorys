import { NextResponse } from "next/server";
import Joi from "joi";
import { cookies } from "next/headers";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS, TOKEN_VARIABLES } from "@/appConstants";
import CPUserSrv from "@/services/cpUserSrv";

export async function POST(request) {
  try {
    const bodyData = await request.json();
    const validateQuery = Joi.object({
      otp: Joi.string().required(),
    });
    const { error, value } = validateQuery.validate(bodyData);
    if (error) {
      return new Response(
        JSON.stringify(
          new ApiResponse(
            RESPONSE_STATUS?.ERROR,
            RESPONSE_MESSAGE?.INVALID,
            error
          )
        )
      );
    }
    const { otp } = value;
    const userSrv = new CPUserSrv();
    const otpResult = await userSrv.verifyOtp(otp);
    if(!otpResult){
        const unautherizedResponse = new ApiResponse(
            RESPONSE_STATUS?.UNAUTHORIZED,
            RESPONSE_MESSAGE?.UNAUTHORIZED,
            null
          );
          return NextResponse.json(unautherizedResponse, { status: unautherizedResponse?.status });
    }
    const cookieStore = cookies();

    const userSession = cookieStore.get(TOKEN_VARIABLES?.TOKEN_NAME);
    if (userSession) {
      cookieStore.delete(TOKEN_VARIABLES?.TOKEN_NAME);

    }
    const responseToken = otpResult?.sessionToken;
    cookies().set(TOKEN_VARIABLES?.TOKEN_NAME, responseToken);

    return NextResponse.json(new ApiResponse(RESPONSE_STATUS?.OK,RESPONSE_MESSAGE?.OK,{id:otpResult?.id}), { status: RESPONSE_STATUS?.OK});

  } catch (error) {
    console.log("error while performing otp send to email", error);
    const errorResponse = new ApiResponse(
      RESPONSE_STATUS?.ERROR,
      RESPONSE_MESSAGE?.ERROR,
      error
    );
    return NextResponse.json(errorResponse, { status: errorResponse?.status });
  }
}
