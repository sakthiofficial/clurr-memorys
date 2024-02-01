import Joi from "joi";

import { NextResponse } from "next/server";
import CPUserSrv from "../../../../services/cpUserSrv";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  TOKEN_VARIABLES,
} from "../../../../appConstants";
import getUserByToken from "@/helper/getUserByToken";

export async function POST(req) {
  const providedUser = await getUserByToken(req);

  const validateQuery = Joi.object({
    newPassword: Joi.string().required(),
    password: Joi.string().required(),
    id: Joi.string(),
  });
  const bodyData = await req.json();
  const { error, value } = validateQuery.validate(bodyData);

  if (error) {
    return NextResponse.json(error, { status: 500 });
  }
  try {
    const user = new CPUserSrv();
    const srvResponse = await user.resetPassword(providedUser, value);

    return NextResponse.json(srvResponse, { status: srvResponse?.status });
  } catch (err) {
    console.log("error while requesting authentication", err);
    return new Response(
      JSON.stringify(
        new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.INVALID, err),
      ),
    );
  }
}
