import { NextResponse } from "next/server";
import initDb from "@/lib/db";
import Visit from "../../../../models/Visit";
import { ApiResponse, RESPONSE_MESSAGE, RESPONSE_STATUS } from "@/appConstants";

export async function POST(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Connect to the database
  await initDb();

  try {
    // Extract data from the request body
    const { ipAddress, userAgent, referrer, page } = await req.json();
    console.log(ipAddress, userAgent, referrer, page);

    // Create a new Visit document
    const visit = new Visit({ ipAddress, userAgent, referrer, page });

    // Save to the database
    await visit.save();
    return NextResponse.json(
      new ApiResponse(RESPONSE_STATUS?.OK, RESPONSE_MESSAGE?.OK, {
        success: true,
        message: "Visit recorded",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving visit:", error);
    return NextResponse.json(
      new ApiResponse(RESPONSE_STATUS?.ERROR, RESPONSE_MESSAGE?.ERROR, {
        error: "Internal Service Errror",
      }),
      { status: 400 }
    );
  }
}
