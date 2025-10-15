import { NextResponse } from "next/server";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "./routes/WebsiteRoute";
import { ADMIN_DASHBOARD } from "./routes/AdminPanelRoute";
import { jwtVerify } from "jose";

export async function middleware(request) {
  try {
    const pathname = request.nextUrl.pathname;
    const accessToken = request.cookies.get("access_token")?.value;

    // ✅ If no token found
    if (!accessToken) {
      // Allow /auth routes without token
      if (pathname.startsWith("/auth")) {
        return NextResponse.next();
      }
      // Redirect to login for all other protected routes
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    // ✅ Verify Token
    let payload;
    try {
      const verified = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.SECRET_KEY)
      );
      payload = verified.payload;
    } catch {
      // Invalid token - redirect to login
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    const role = payload.role;

    // ✅ Prevent logged-in users from accessing /auth
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(
          role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD,
          request.nextUrl
        )
      );
    }

    // ✅ Protect /admin for admins only
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    // ✅ Protect /my-account for normal users only
    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};
