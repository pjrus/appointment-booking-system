// Practitioner profile page. Displays the read-only details of the Doctor record
// linked to the currently logged-in practitioner (title, specialisation, name,
// email, phone). If no doctor record is linked, shows a message advising the
// user to contact an administrator for account linking.
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function PractitionerProfilePage() {
  const { data: session } = useSession();
  const user = session?.user as Record<string, unknown> | undefined;
  const doctorId = user?.doctorId as string | undefined;

  const [doctor, setDoctor] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorProfile();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      const res = await fetch(`/api/doctors/${doctorId}`);
      const data = await res.json();
      if (data.success) {
        setDoctor(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Loading profile...</div>;

  if (!doctorId || !doctor) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Your account has not been linked to a practitioner record yet. Please contact an administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Title</p>
            <p className="text-gray-900 dark:text-white font-medium">{doctor.title || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Specialisation</p>
            <p className="text-gray-900 dark:text-white font-medium">{doctor.specialisation || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">First Name</p>
            <p className="text-gray-900 dark:text-white font-medium">{doctor.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Last Name</p>
            <p className="text-gray-900 dark:text-white font-medium">{doctor.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</p>
            <p className="text-gray-900 dark:text-white font-medium">{doctor.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</p>
            <p className="text-gray-900 dark:text-white font-medium">{doctor.phoneNo}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
