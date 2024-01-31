import { NextResponse } from "next/server";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";
import getUserByToken from "@/helper/getUserByToken";
import CpManagementSrv from "@/services/cpManagementSrv";

export async function GET(request, { params }) {
  try {
    const providedUser = await getUserByToken(request);
    if (!providedUser) {
      const response = new ApiResponse(
        RESPONSE_STATUS?.UNAUTHORIZED,
        RESPONSE_MESSAGE?.UNAUTHORIZED,
        null,
      );
      return NextResponse.json(response);
    }
    const { id } = params;
    const cpManagement = new CpManagementSrv();
    const serviceResponse = await cpManagement.retriveCpByCompanyId(
      providedUser,
      id,
    );
    return NextResponse.json(serviceResponse);
  } catch (error) {
    console.log(error);
  }
}
