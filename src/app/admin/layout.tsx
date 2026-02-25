// Admin section layout. Renders a dark sidebar with navigation links to the
// Upcoming Appointments dashboard, Manage Practitioners, Manage Users, and
// System Settings pages. Only accessible to users with the 'admin' role
// (enforced by the middleware route protection). Includes a "Back to Main Site" link.
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-900/10 dark:border-zinc-800 flex-shrink-0 text-white shadow-xl flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-tight">Admin System</h2>
          <p className="text-xs text-gray-400 mt-1">Administrator Panel</p>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          <Link href="/admin" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-white transition">
            Upcoming Appointments
          </Link>
          <Link href="/admin/doctors" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-white transition">
            Manage Practitioners
          </Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-white transition">
            Manage Users
          </Link>
          <Link href="/admin/settings" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800 hover:text-white transition mt-8 text-gray-400">
            System Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-800 text-sm p-4 w-full">
            <Link href="/" className="block text-center w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition text-xs font-semibold">
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
