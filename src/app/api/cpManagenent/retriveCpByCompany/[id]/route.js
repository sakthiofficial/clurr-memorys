import { NextResponse } from "next/server";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";
import getUserByToken from "@/helper/getUserByToken";
import CpManagementSrv from "@/services/cpManagementSrv";

export function GET(request, { params }) {
  const providedUser = getUserByToken(request);
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
  const serviceResponse = cpManagement.retriveCpByCompany(providedUser, id);
  return NextResponse.json(serviceResponse);

  console.log("comming here", id);
}
