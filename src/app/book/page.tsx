'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  title?: string;
  specialisation?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookAppointment() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [appointmentType, setAppointmentType] = useState('General Consultation');
  
  // Patient State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [gender, setGender] = useState('Other');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);

  // -------------------------
  // Lifecycle & Data Fetching
  // -------------------------

  // On component mount, we fetch the roster of available practitioners from the database
  // to populate the initial selection dropdown.
  useEffect(() => {
    fetch('/api/doctors')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDoctors(data.data);
        } else {
          setError('Failed to load doctors.');
        }
      })
      .catch(() => setError('Network error.'))
      .finally(() => setLoading(false));
  }, []);

  // This effect listens for modifications to the selected practitioner or date.
  // When both are present, it dynamically queries the backend to generate and validate
  // the available time slots tailored to the specific consultation constraints.
  useEffect(() => {
    if (doctorId && date) {
      fetch('/api/appointments/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId, date, durationMinutes })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTimeSlots(data.data);
        } else {
          setTimeSlots([]);
        }
      })
      .catch(console.error);
    }
  }, [doctorId, date, durationMinutes]);

  // -------------------------
  // Form Submission Handler
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure the client has finalised all mandatory scheduling parameters
    if (!doctorId || !date || !selectedTime) {
      setError('Please select a doctor, date, and time slot.');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    // Construct the payload mapping to the MongoDB Appointment schema
    const payload = {
      doctorId,
      date,
      startTime: selectedTime,
      durationMinutes,
      appointmentType,
      message,
      patient: {
        firstName,
        lastName,
        email,
        phoneNo,
        gender
      }
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        // Navigate to success page
        router.push(`/book/success?id=${data.data._id}`);
      } else {
        setError(data.error || 'Failed to book appointment.');
        setSubmitting(false);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl shadow border border-gray-100 dark:border-zinc-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Book an Appointment</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Please fill in the details below to schedule your consultation.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Scheduling Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-zinc-800 pb-2">1. When & Who</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Practitioner *</label>
                <select 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                  value={doctorId}
                  onChange={(e) => { setDoctorId(e.target.value); setSelectedTime(''); }}
                  required
                >
                  <option value="">Select a practitioner...</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>
                      {doc.title ? `${doc.title} ` : ''}{doc.firstName} {doc.lastName} {doc.specialisation ? `— ${doc.specialisation}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                  value={date}
                  onChange={(e) => { setDate(e.target.value); setSelectedTime(''); }}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Consultation Type</label>
                <select 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500 focus:ring-blue-500"
                  value={appointmentType}
                  onChange={(e) => {
                    setAppointmentType(e.target.value);
                    if (e.target.value.includes('Long')) setDurationMinutes(45);
                    else if (e.target.value.includes('Brief')) setDurationMinutes(15);
                    else setDurationMinutes(30);
                  }}
                >
                  <option value="General Consultation">General Consultation (30 min)</option>
                  <option value="Long Consultation">Long Consultation (45 min)</option>
                  <option value="Brief Follow-up">Brief Follow-up (15 min)</option>
                </select>
              </div>
            </div>

            {doctorId && date && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Times *</label>
                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                    {timeSlots.map((slot, idx) => (
                      <button
                        type="button"
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 text-sm rounded border text-center transition ${
                          !slot.available 
                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border-gray-200 dark:border-zinc-700 line-through' 
                            : selectedTime === slot.time
                              ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                              : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 dark:border-zinc-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">No time slots found. Please try another date.</p>
                )}
                {selectedTime && (
                  <p className="mt-2 text-sm text-blue-600 font-medium">
                    Selected time: {selectedTime}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Step 2: Patient Details */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 border-b dark:border-zinc-800 pb-2">2. Your Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name *</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={firstName} onChange={e => setFirstName(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name *</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={lastName} onChange={e => setLastName(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={email} onChange={e => setEmail(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={phoneNo} onChange={e => setPhoneNo(e.target.value)} required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <select 
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={gender} onChange={e => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Message / Reasoning</label>
                <textarea 
                  rows={3}
                  className="w-full bg-white dark:bg-zinc-800 text-gray-900 dark:text-white border-gray-300 dark:border-zinc-700 rounded-md shadow-sm p-2 border focus:border-blue-500"
                  value={message} onChange={e => setMessage(e.target.value)} 
                ></textarea>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t dark:border-zinc-800">
            <button 
              type="submit" 
              disabled={submitting || !doctorId || !date || !selectedTime}
              className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
