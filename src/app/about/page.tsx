// About page. Provides background information on the Clinic Appointments project,
// including its history as a VCE Software Development Project rewritten from PHP
// to a modern Next.js stack, and highlights the application's key features.
import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          About Clinic Appointments
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          A modern rewrite of a classic project.
        </p>
      </div>

      <div className="mt-12 prose prose-lg text-gray-500 dark:text-gray-400 mx-auto">
        <p>
          Welcome to the Clinic Appointment System. This application is designed to streamline the booking
          process for both patients and healthcare practitioners, ensuring a seamless experience from scheduling
          to consultation.
        </p>
        <p className="mt-4">
          <strong>Project History:</strong> This modern Next.js application is a complete rewrite of an original
          PHP appointment booking system created in high school as part of a VCE Software Development Project. 
          By transitioning from PHP to a modern stack (Next.js, React, and Tailwind CSS), this application now 
          boasts improved performance, a responsive sleek UI, robust dark mode support, and a scalable architecture.
        </p>
        <div className="mt-8 bg-blue-50 dark:bg-zinc-900/50 p-6 rounded-lg border border-blue-100 dark:border-zinc-800">
            <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-blue-800 dark:text-blue-200/80">
                <li>Simple and intuitive patient booking flow</li>
                <li>Comprehensive practitioner dashboard</li>
                <li>Real-time appointment management</li>
                <li>Dynamic system settings and business rules</li>
                <li>Seamless dark and light mode adaptation</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
