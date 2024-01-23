import { NextResponse } from "next/server";
import {
  ApiResponse,
  RESPONSE_MESSAGE,
  RESPONSE_STATUS,
  TOKEN_VARIABLES,
} from "./appConstants";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const cookie = request.cookies.get(TOKEN_VARIABLES?.TOKEN_NAME);
  if (request.nextUrl.pathname.startsWith("/api")) {
    if (!cookie) {
      return NextResponse.json(
        new ApiResponse(
          RESPONSE_STATUS?.UNAUTHORIZED,
          RESPONSE_MESSAGE?.INVALID,
        ),
      );
    }
    return NextResponse.next();
  }
  if (!cookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/api/user", "/api/lead", "/"],
};
