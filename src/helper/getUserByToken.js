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
  await initDb();
  const { value: token } = request.cookies.get(TOKEN_VARIABLES?.TOKEN_NAME);
  const providedUserSessionData = await Session.findOne({
    token,
  })
    .populate("userId")
    .lean();
  if (!providedUserSessionData) {
    return null;
  }
  return providedUserSessionData.userId;
}
