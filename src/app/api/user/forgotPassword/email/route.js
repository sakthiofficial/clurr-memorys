import Joi from "joi";
import { NextResponse } from "next/server";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";
import CPUserSrv from "@/services/cpUserSrv";

export async function POST(req) {
try {
  const bodyData = await req.json();
  const validateQuery = Joi.object({
  email: Joi.string().required(),
  
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
const userService = new CPUserSrv()
const serviceRes = await userService.sendOtpToEmail(value);
return NextResponse.json(serviceRes, { status: serviceRes?.status });
} catch (error) {
  console.log('error while performing otp send to email',error);
const errorResponse = new ApiResponse(
RESPONSE_STATUS?.ERROR,
RESPONSE_MESSAGE?.ERROR,
error,
 );
return NextResponse.json(errorResponse, { status: errorResponse?.status });
}
  }