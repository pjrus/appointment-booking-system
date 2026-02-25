// Practitioner appointments dashboard. Fetches and displays only the appointments
// assigned to the currently logged-in practitioner (filtered by their doctorId
// from the session). If the user's account has not been linked to a Doctor record,
// a message is shown asking them to contact an administrator.
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface AppointmentType {
  _id: string;
  patient: {
    firstName: string;
    lastName: string;
    phoneNo: string;
    email: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
}

export default function PractitionerDashboard() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  const user = session?.user as Record<string, unknown> | undefined;
  const doctorId = user?.doctorId as string | undefined;

  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments?doctorId=${doctorId}`);
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

  if (!doctorId) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome, Practitioner</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your account has not yet been linked to a practitioner record. Please contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Appointments</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No upcoming appointments found.</td></tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{appt.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appt.startTime} - {appt.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{appt.patient.firstName} {appt.patient.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appt.patient.phoneNo}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appt.patient.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300">
                        {appt.appointmentType}
                      </span>
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
