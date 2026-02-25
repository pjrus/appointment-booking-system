// Practitioner section layout. Renders a purple-themed sidebar with navigation
// links to "My Appointments" and "My Profile". Only accessible to users with
// the 'practitioner' role (enforced by middleware). Includes a "Back to Main Site" link.
import Link from 'next/link';

export default function PractitionerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-purple-900 dark:bg-purple-950 border-r border-purple-900/10 dark:border-zinc-800 flex-shrink-0 text-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-purple-800">
          <h2 className="text-xl font-bold tracking-tight">Practitioner</h2>
          <p className="text-xs text-purple-300 mt-1">Your Dashboard</p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link href="/practitioner" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-800 hover:text-white transition">
            My Appointments
          </Link>
          <Link href="/practitioner/profile" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-800 hover:text-white transition mt-8 text-purple-300">
            My Profile
          </Link>
        </nav>

        <div className="p-4 border-t border-purple-800 text-sm w-full">
          <Link href="/" className="block text-center w-full px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-md transition text-xs font-semibold">
            ← Back to Main Site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full text-gray-900 dark:text-gray-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
