// User menu dropdown component displayed in the navigation bar.
// When the user is unauthenticated, it shows "Sign In" and "Register" buttons.
// When authenticated, it renders a clickable avatar with the user's initial,
// name, and a colour-coded role badge. The dropdown contains a link to the
// user's role-specific dashboard and a sign-out button.
'use client';


import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  practitioner: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  patient: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
};

const roleDashboardLinks: Record<string, string> = {
  admin: '/admin',
  practitioner: '/practitioner',
  patient: '/my-appointments',
};

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-3 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Register
        </Link>
      </div>
    );
  }

  const user = session.user as Record<string, unknown>;
  const role = (user.role as string) || 'patient';
  const dashboardLink = roleDashboardLinks[role] || '/';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors"
      >
        {/* User avatar circle */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
          {(session.user.name?.[0] || 'U').toUpperCase()}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {session.user.name}
        </span>
        <span className={`hidden sm:inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColors[role]}`}>
          {role}
        </span>
        {/* Chevron */}
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
            <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${roleBadgeColors[role]}`}>
              {role}
            </span>
          </div>

          <Link
            href={dashboardLink}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            onClick={() => setIsOpen(false)}
          >
            My Dashboard
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
