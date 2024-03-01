import Joi from "joi";
import { NextResponse } from "next/server";
import getUserByToken from "@/helper/getUserByToken";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";
import ApplicationSrv from "@/services/applicationSrv";

export async function GET(request) {
try {
    const providedUser = await getUserByToken(request);
    if ( !providedUser) {
    const validationErrorResponse = new ApiResponse(
    RESPONSE_STATUS?.UNAUTHORIZED,
    RESPONSE_MESSAGE?.UNAUTHORIZED,
    null
    );
    return NextResponse.json(validationErrorResponse, { status: validationErrorResponse?.status });
   
   
    }
    const applicationSrv = new ApplicationSrv();
    const srvResponse = await applicationSrv.internalUserOverallStatus(providedUser);
    return NextResponse.json(srvResponse, { status: srvResponse?.status });
} catch (error) {
    const errorResponse = new ApiResponse(
        RESPONSE_STATUS?.ERROR,
        RESPONSE_MESSAGE?.ERROR,
        error
        );
        return NextResponse.json(errorResponse, { status: errorResponse?.status });
}
}