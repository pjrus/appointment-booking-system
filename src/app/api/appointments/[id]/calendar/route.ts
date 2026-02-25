// Calendar export API route. Generates and serves a downloadable .ics (iCalendar)
// file for a given appointment. The file includes the consultation summary, patient
// details, and event times set to the Australia/Melbourne timezone for compatibility
// with Apple Calendar and Google Calendar.
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Appointment } from '@/models/Schemas';

// Helper function to normalise our database dates into the strict iCalendar (.ics) format
// required for Apple Calendar and Google Calendar synchronisation.
function formatICSDate(dateStr: string, timeStr: string) {
  // dateStr is YYYY-MM-DD, timeStr is HH:mm
  const [year, month, day] = dateStr.split('-');
  const [hour, min] = timeStr.split(':');
  
  return `${year}${month}${day}T${hour}${min}00`;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();

    const appointment = await Appointment.findById(id).populate('doctorId');
    if (!appointment) {
      return new NextResponse('Appointment not found', { status: 404 });
    }

    const { date, startTime, endTime, patient, doctorId, appointmentType } = appointment;
    const doctor = doctorId as unknown as { title?: string; firstName: string; lastName: string; };

    const dtStart = formatICSDate(date, startTime);
    const dtEnd = formatICSDate(date, endTime);
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const summary = `${appointmentType} with ${doctor.title ? doctor.title + ' ' : ''}${doctor.firstName} ${doctor.lastName}`;
    const description = `Consultation for ${patient.firstName} ${patient.lastName}.\nPatient Email: ${patient.email}\nPhone: ${patient.phoneNo}`;
    // Construct the actual .ics file content as a string payload.
    // We explicitly set the timezone to 'Australia/Melbourne' to ensure 
    // event timings align correctly for local patients.
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Appointment Booking System//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${id}@appointmentbook.local
DTSTAMP:${dtStamp}
DTSTART;TZID=Australia/Melbourne:${dtStart}
DTEND;TZID=Australia/Melbourne:${dtEnd}
SUMMARY:${summary}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="appointment-${id}.ics"`,
      },
    });
  } catch (error: unknown) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
