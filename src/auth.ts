// NextAuth v5 configuration for the Clinic Appointment System.
// Uses the Credentials Provider with bcrypt password verification against MongoDB.
// Employs the JWT session strategy, storing role, userId, doctorId, and approval
// status in the token so they are accessible both server-side and client-side.
// The custom signIn page is set to /login.
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/Schemas";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isPasswordValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          doctorId: user.doctorId?.toString() || null,
          isApproved: user.isApproved,
          needsPasswordReset: user.needsPasswordReset || false,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On initial sign-in, copy user fields into the JWT
      if (user) {
        token.role = (user as Record<string, unknown>).role;
        token.userId = (user as Record<string, unknown>).id;
        token.doctorId = (user as Record<string, unknown>).doctorId;
        token.isApproved = (user as Record<string, unknown>).isApproved;
        token.needsPasswordReset = (user as Record<string, unknown>).needsPasswordReset;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose role and IDs in the client session
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = session.user as any;
        user.role = token.role;
        user.userId = token.userId;
        user.doctorId = token.doctorId;
        user.isApproved = token.isApproved;
        user.needsPasswordReset = token.needsPasswordReset;
      }
      return session;
    },
  },
});
