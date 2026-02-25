// NextAuth API route handler. Exports the GET and POST handlers from the
// centralised auth configuration (src/auth.ts). This file is the entry point
// for all NextAuth-related HTTP requests (sign-in, sign-out, session, CSRF, etc.).
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
