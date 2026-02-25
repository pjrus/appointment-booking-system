// Client-side wrapper around NextAuth's SessionProvider. Required because
// Next.js server components cannot use React context providers directly.
// This component is mounted in the root layout to make the auth session
// available to all client components via the useSession() hook.
'use client';


import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
