import { NextResponse } from "next/server";
import ActivitySrv from "../../../services/activitySrv";

export async function GET() {
  return NextResponse.json([]);

  const activitySrv = new ActivitySrv();
  const result = await activitySrv.retriveActivitys();
  return NextResponse.json(result);
}
