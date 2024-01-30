import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  TOKEN_VARIABLES,
} from "./appConstants";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  try {
    const cookie = request.cookies.get(TOKEN_VARIABLES?.TOKEN_NAME);
    if (request.nextUrl.pathname.startsWith("/api")) {
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
    if (!cookie) {
      const storedData = localStorage.getItem("user");

      console.log("came here", storedData);
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/api/user", "/api/lead", "/", "/leads"],
};
