'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center max-w-lg mx-auto mt-12">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
      <p className="text-gray-600 mb-6">
        Your appointment has been successfully scheduled. We look forward to seeing you. 
        You will receive a confirmation email shortly.
      </p>

      {id && (
        <div className="bg-gray-50 p-4 rounded-md mb-8 inline-block text-left w-full border">
          <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
          <p className="font-mono text-gray-900 font-medium">{id}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {id && (
           <a 
             href={`/api/appointments/${id}/calendar`}
             download="appointment.ics"
             className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
           >
             Add to Calendar
           </a>
        )}
        <Link 
          href="/"
          className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<div className="text-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
