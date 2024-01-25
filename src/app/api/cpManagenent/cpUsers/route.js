import { NextResponse } from "next/server";
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
