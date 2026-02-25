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
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col flex-grow max-w-7xl">
            <header className="mb-8 border-b dark:border-zinc-800 pb-4 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold">Clinic Appointment System</h1>
                <nav className="mt-4 flex gap-4">
                  <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link>
                  <Link href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline">Admin Dashboard</Link>
                </nav>
              </div>
              <ThemeToggle />
            </header>
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
