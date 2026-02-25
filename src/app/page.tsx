// Homepage component. Displays a session-aware landing card with contextual
// call-to-action buttons. Guests see "New Booking" and "Sign In", whilst
// authenticated users see a role-specific dashboard link (Admin, Practitioner,
// or Patient) alongside the booking button.
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const role = user?.role as string | undefined;

  return (
    <div className="v-flex-container max-w-2xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-lg border dark:border-zinc-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          {session ? `Welcome back, ${session.user?.name?.split(' ')[0]}` : 'Book an Appointment'}
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {session
            ? 'What would you like to do today?'
            : 'Welcome to our online booking system. Please select an option below to get started.'}
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Book — always visible */}
          <Link
            href="/book"
            className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <span className="text-lg font-medium">New Booking</span>
            <span className="text-sm opacity-80 mt-1">Schedule a consultation</span>
          </Link>

          {/* Context-aware second CTA */}
          {!session && (
            <Link
              href="/login"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition"
            >
              <span className="text-lg font-medium">Sign In</span>
              <span className="text-sm opacity-80 mt-1 dark:text-blue-200">Access your account</span>
            </Link>
          )}

          {role === 'admin' && (
            <Link
              href="/admin"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-zinc-700 transition"
            >
              <span className="text-lg font-medium">Admin Dashboard</span>
              <span className="text-sm opacity-80 mt-1">Manage the system</span>
            </Link>
          )}

          {role === 'practitioner' && (
            <Link
              href="/practitioner"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 text-purple-600 dark:text-purple-400 border-2 border-purple-600 dark:border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-zinc-700 transition"
            >
              <span className="text-lg font-medium">My Schedule</span>
              <span className="text-sm opacity-80 mt-1">View your appointments</span>
            </Link>
          )}

          {role === 'patient' && (
            <Link
              href="/my-appointments"
              className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 text-green-600 dark:text-green-400 border-2 border-green-600 dark:border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-zinc-700 transition"
            >
              <span className="text-lg font-medium">My Appointments</span>
              <span className="text-sm opacity-80 mt-1">View & manage bookings</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
