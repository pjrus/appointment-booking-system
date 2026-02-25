// System Settings page. Provides administrators with a form to configure global
// clinic parameters: business email, default consultation cost, appointment slot
// interval (minutes), online/offline locations, and allowed days of the week.
// Settings are stored as a single document via the /api/settings endpoint (upsert).
'use client';

import { useState, useEffect } from 'react';

export default function SettingsDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    cost: 100,
    email: '',
    onlineLocation: '',
    offlineLocation: '',
    apptSlotInterval: 30,
    daysOfWeekAllowed: '1,2,3,4,5'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && Object.keys(data.data).length > 0) {
        setFormData({
            cost: data.data.cost || 100,
            email: data.data.email || '',
            onlineLocation: data.data.onlineLocation || '',
            offlineLocation: data.data.offlineLocation || '',
            apptSlotInterval: data.data.apptSlotInterval || 30,
            daysOfWeekAllowed: data.data.daysOfWeekAllowed || '1,2,3,4,5'
        });
      }
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
      } else {
        setMessage({ text: data.error || 'Failed to save settings', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Network error occurred', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Loading settings...</div>;

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md border ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50' : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b dark:border-zinc-800 pb-2">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clinic Email *</label>
                <input 
                  type="email" required
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500" 
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Consultation Cost ($)</label>
                <input 
                  type="number" required min="0" step="0.01"
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500" 
                  value={formData.cost} onChange={e => setFormData({...formData, cost: parseFloat(e.target.value)})} 
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b dark:border-zinc-800 pb-2">Locations</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Physical Location Address</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500" 
                  value={formData.offlineLocation} onChange={e => setFormData({...formData, offlineLocation: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telehealth / Online Link</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500" 
                  value={formData.onlineLocation} onChange={e => setFormData({...formData, onlineLocation: e.target.value})} 
                  placeholder="e.g. https://zoom.us/j/123456789"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b dark:border-zinc-800 pb-2">Booking Rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Slot Interval (Minutes)</label>
                <select 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={formData.apptSlotInterval} onChange={e => setFormData({...formData, apptSlotInterval: parseInt(e.target.value)})}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">The gap between bookable slots dynamically generated.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allowed Days (0=Sun, 6=Sat)</label>
                <input 
                  type="text" 
                  placeholder="e.g., 1,2,3,4,5"
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500" 
                  value={formData.daysOfWeekAllowed} onChange={e => setFormData({...formData, daysOfWeekAllowed: e.target.value})} 
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comma-separated days the clinic is open.</p>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t dark:border-zinc-800 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
