// Admin user management page. Lists all registered users with their name, email,
// role (colour-coded badge), and linked doctor record. Administrators can promote
// a patient to practitioner (with doctor linking), demote a practitioner back to
// patient, or delete a user account. All actions call the /api/admin/users endpoint.
'use client';

import { useState, useEffect } from 'react';

interface UserType {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isApproved: boolean;
  doctorId?: {
    title?: string;
    firstName: string;
    lastName: string;
    specialisation?: string;
  };
  createdAt: string;
}

interface DoctorType {
  _id: string;
  title?: string;
  firstName: string;
  lastName: string;
  specialisation?: string;
}

const roleBadgeColors: Record<string, string> = {
  admin: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  practitioner: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  patient: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchUsers();
    fetchDoctors();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (data.success) setDoctors(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string, doctorId?: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole, doctorId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'User role updated successfully.', type: 'success' });
        fetchUsers();
      } else {
        setMessage({ text: data.error || 'Failed to update role.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'An error occurred.', type: 'error' });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u._id !== userId));
        setMessage({ text: 'User deleted.', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to delete user.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'An error occurred.', type: 'error' });
    }
  };

  const handlePromote = (userId: string) => {
    // Show a simple prompt to select a doctor to link
    const doctorOptions = doctors.map(d => `${d._id}: ${d.title || ''} ${d.firstName} ${d.lastName}`).join('\n');
    const selectedDoctor = prompt(
      `Enter the Doctor ID to link this practitioner to:\n\n${doctorOptions}`
    );
    if (selectedDoctor) {
      const doctorId = selectedDoctor.split(':')[0].trim();
      handleRoleChange(userId, 'practitioner', doctorId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-md border text-sm ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-zinc-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
            <thead className="bg-gray-50 dark:bg-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Linked Doctor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadgeColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.doctorId ? (
                        <div className="text-sm text-gray-900 dark:text-white">
                          {user.doctorId.title} {user.doctorId.firstName} {user.doctorId.lastName}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {user.role === 'patient' && (
                        <button
                          onClick={() => handlePromote(user._id)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                        >
                          Promote
                        </button>
                      )}
                      {user.role === 'practitioner' && (
                        <button
                          onClick={() => handleRoleChange(user._id, 'patient')}
                          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300"
                        >
                          Demote
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400"
                        >
                          Delete
                        </button>
                      )}
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
