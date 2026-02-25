import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ThemeProvider } from '../components/ThemeProvider';
import { ThemeToggle } from '../components/ThemeToggle';
export const metadata: Metadata = {
  title: 'Appointment Booking System',
  description: 'A modern JS port of the Appointment Booking System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Modern Top Navigation Bar */}
          <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between max-w-7xl">
              <div className="flex items-center gap-6 md:gap-10">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight hidden sm:inline-block">Clinic<span className="text-blue-600 dark:text-blue-400">Appointments</span></span>
                  <span className="font-bold text-xl tracking-tight sm:hidden">CA</span>
                </Link>
                <nav className="flex gap-1 md:gap-2">
                  <Link href="/" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors">Home</Link>
                  <Link href="/about" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors">About</Link>
                  <Link href="/admin" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors">Admin Dashboard</Link>
                </nav>
              </div>
              <div className="flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col flex-grow max-w-7xl">
            <main className="flex-grow">{children}</main>
          </div>
          <footer className="w-full border-t dark:border-zinc-800 py-6 text-sm text-gray-500 dark:text-gray-400 text-center bg-gray-50 dark:bg-zinc-900 mt-auto">
            &copy; {new Date().getFullYear()} Clinic Appointments. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
