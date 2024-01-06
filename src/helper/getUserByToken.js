import { NextResponse } from "next/server";
import initDb from "../lib/db";
import { Session } from "../../models/session";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  TOKEN_VARIABLES,
} from "../appConstants";

export default async function getUserByToken(request) {
  try {
    await initDb();
    const { value: token } = request.cookies.get(TOKEN_VARIABLES?.TOKEN_NAME);
    const providedUserSessionData = await Session.findOne({
      token,
    })
      .populate("userId")
      .lean();
    if (!providedUserSessionData) {
      return NextResponse.json(
        new ApiResponse(RESPONSE_STATUS?.NOTFOUND, RESPONSE_MESSAGE?.INVALID),
      );
    }
    return providedUserSessionData.userId;
  } catch (error) {
    console.log("Error while fetching data by token", error);
    return NextResponse.json(
      new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, error),
    );
  }
}
