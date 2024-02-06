import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  TOKEN_VARIABLES,
} from "./appConstants";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const apiUrlPath = request.nextUrl.pathname.startsWith("/api");
  try {
    console.log(apiUrlPath);
    const cookie = request.cookies.get(TOKEN_VARIABLES?.TOKEN_NAME);
    if (apiUrlPath) {
      if (!cookie) {
        return NextResponse.json(
          new ApiResponse(
            RESPONSE_STATUS?.UNAUTHORIZED,
            RESPONSE_MESSAGE?.UNAUTHORIZED,
          ),
        );
      }
      return NextResponse.next();
    }

    if (!apiUrlPath) {
      if (!cookie) {
        console.log("Redirecting This frontend");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    // return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/api/user", "/api/lead", "/", "/leads"],
};
