// Patient appointments dashboard. Fetches and displays the authenticated patient's
// own booked appointments (filtered by their email address). Provides the ability
// to cancel upcoming appointments via a DELETE call to /api/appointments/[id].
// This page is protected by middleware and only accessible to authenticated users.
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AppointmentType {
  _id: string;
  doctorId: {
    title?: string;
    firstName: string;
    lastName: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
  patient: {
    firstName: string;
    lastName: string;
  };
}

export default function MyAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as Record<string, unknown> | undefined;
  const userEmail = user?.email as string | undefined;

  useEffect(() => {
    if (userEmail) {
      fetchAppointments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?patientEmail=${userEmail}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.filter(app => app._id !== id));
      } else {
        alert(data.error || 'Failed to cancel appointment.');
      }
    } catch {
      alert('Error occurred while cancelling.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Practitioner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No appointments found. Book one from the homepage!</td></tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{appt.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appt.startTime} - {appt.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {appt.doctorId?.title} {appt.doctorId?.firstName} {appt.doctorId?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                        {appt.appointmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCancel(appt._id)}
                        className="text-red-600 dark:text-red-500 hover:text-red-900 dark:hover:text-red-400 transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
