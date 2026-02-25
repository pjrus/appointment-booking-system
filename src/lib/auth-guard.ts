// Reusable API route guard for role-based access control.
// Usage: const session = await requireRole(ROLES.ADMIN);
// Returns the session if authorised, or a NextResponse (401/403) if not.

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { Role } from "@/lib/roles";

export async function requireRole(...roles: Role[]) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const userRole = (session.user as Record<string, unknown>).role as string;

  if (!roles.includes(userRole as Role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return session;
}
