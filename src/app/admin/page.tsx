'use client';

import { useState, useEffect } from 'react';

interface AppointmentType {
  _id: string;
  patient: {
    firstName: string;
    lastName: string;
    phoneNo: string;
  };
  doctorId: {
    title?: string;
    firstName: string;
    lastName: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  appointmentType: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/appointments');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return;

    try {
      const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev => prev.filter(app => app._id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Error occurred while deleting');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Appointments</h1>
      </div>

      <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-950">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Practitioner</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No upcoming appointments found.</td></tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{appt.date}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appt.startTime} - {appt.endTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{appt.patient.firstName} {appt.patient.lastName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{appt.patient.phoneNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {appt.doctorId?.title} {appt.doctorId?.firstName} {appt.doctorId?.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                        {appt.appointmentType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleDelete(appt._id)} className="text-red-600 dark:text-red-500 hover:text-red-900 dark:hover:text-red-400 transition">
                        Delete
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
