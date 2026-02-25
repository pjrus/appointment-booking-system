// Manage Practitioners page. Allows administrators to add new practitioner
// profiles (title, first name, last name, phone, specialisation) and view the
// current roster. Each practitioner can be deleted from the list. Data is
// persisted via the /api/doctors endpoint.
'use client';

import { useState, useEffect } from 'react';

interface DoctorType {
  _id: string;
  title?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNo: string;
  specialisation?: string;
  address?: string;
}

export default function DoctorsDashboard() {
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State for Add new Doctor
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', firstName: '', lastName: '', email: '', phoneNo: '', specialisation: '', address: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this practitioner?')) return;
    try {
      const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setDoctors(prev => prev.filter(doc => doc._id !== id));
      } else {
        alert(data.error || 'Failed to delete');
      }
    } catch {
      alert('Error occurred while deleting');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setDoctors([...doctors, data.data]);
        setShowAddForm(false);
        setFormData({ title: '', firstName: '', lastName: '', email: '', phoneNo: '', specialisation: '', address: '' });
      } else {
        alert(data.error || 'Failed to add practitioner');
      }
    } catch {
      alert('Network Error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Practitioners</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm"
        >
          {showAddForm ? 'Cancel' : '+ Add Practitioner'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-sm mb-6 border dark:border-zinc-800">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Practitioner</h2>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input type="text" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" placeholder="Dr." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Specialisation</label>
              <input type="text" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" placeholder="General Practice" value={formData.specialisation} onChange={e => setFormData({...formData, specialisation: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
              <input type="text" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
              <input type="text" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input type="email" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
              <input type="text" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" required value={formData.phoneNo} onChange={e => setFormData({...formData, phoneNo: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input type="text" className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-700 p-2 rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">Save Practitioner</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-zinc-800">
        <ul className="divide-y divide-gray-200 dark:divide-zinc-800">
          {loading ? (
             <li className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading practitioners...</li>
          ) : doctors.length === 0 ? (
             <li className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No practitioners found.</li>
          ) : (
            doctors.map((doc) => (
              <li key={doc._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{doc.title} {doc.firstName} {doc.lastName} <span className="text-gray-500 dark:text-gray-400 font-normal ml-2">{doc.specialisation}</span></h3>
                  <div className="mt-1 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                     <p>📞 {doc.phoneNo}</p>
                     {doc.email && <p>✉️ {doc.email}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(doc._id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium px-4">
                  Delete
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
