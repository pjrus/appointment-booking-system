import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROLES } from "@/lib/roles";

// Route protection rules: maps path prefixes to the roles allowed to access them.
const protectedRoutes: Record<string, string[]> = {
  "/admin": [ROLES.ADMIN],
  "/practitioner": [ROLES.PRACTITIONER],
  "/my-appointments": [ROLES.ADMIN, ROLES.PRACTITIONER, ROLES.PATIENT],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Decode the JWT directly — Edge-compatible, no Node.js crypto needed
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  for (const [routePrefix, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(routePrefix)) {
      // Not authenticated → redirect to login
      if (!token) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Authenticated but wrong role → redirect to home
      const userRole = token.role as string;
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Practitioner must be approved
      if (
        pathname.startsWith("/practitioner") &&
        userRole === ROLES.PRACTITIONER &&
        !token.isApproved
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/practitioner/:path*", "/my-appointments/:path*"],
};
