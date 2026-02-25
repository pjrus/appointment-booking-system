import Link from 'next/link';

export default function Home() {
  return (
    <div className="v-flex-container max-w-2xl mx-auto">
      <div className="bg-gray-50 dark:bg-zinc-900 p-6 rounded-lg shadow-sm border dark:border-zinc-800">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Book an Appointment</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Welcome to our new online booking system. Please select an option below to get started.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4">
          <Link 
            href="/book" 
            className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <span className="text-lg font-medium">New Booking</span>
            <span className="text-sm opacity-80 mt-1">Schedule a consultation</span>
          </Link>
          
          <Link 
            href="/admin" 
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-zinc-700 transition"
          >
            <span className="text-lg font-medium">Practitioner Login</span>
            <span className="text-sm opacity-80 mt-1 dark:text-blue-200">Manage your schedule</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
