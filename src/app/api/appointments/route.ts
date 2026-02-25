// Appointments API route. Handles GET (list all appointments with populated doctor
// details, sorted by date) and POST (create a new booking with double-booking
// overlap protection, automatic end-time calculation, and default cost fallback
// from global settings). The overlap logic rejects slots where the proposed
// appointment's time range intersects with any existing booking for the same practitioner.
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Appointment, Settings } from '@/models/Schemas';

export async function GET() {
  try {
    await dbConnect();
    // For admin dashboard later
    const appointments = await Appointment.find({})
      .populate('doctorId')
      .sort({ date: 1, startTime: 1 });
    return NextResponse.json({ success: true, data: appointments });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    const { date, startTime, durationMinutes, doctorId } = body;
    
    // Calculate the endTime based on the user's selected startTime and consultation duration.
    // We initialise base dates to ensure we're purely comparing time portions without timezone issues.
    const [startH, startM] = startTime.split(':').map(Number);
    const startDate = new Date(`2000-01-01T00:00:00Z`);
    startDate.setUTCHours(startH, startM, 0, 0);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    
    const endH = endDate.getUTCHours().toString().padStart(2, '0');
    const endM = endDate.getUTCMinutes().toString().padStart(2, '0');
    const endTime = `${endH}:${endM}`;
    
    // CRITICAL: Double-booking overlap protection logic.
    // We query MongoDB to ensure we categorise the new slot as conflicting if it 
    // strictly overlaps any already finalised appointment for this practitioner.
    // The logic checks if (New Start < Existing End AND New End > Existing Start).
    const conflictingAppointment = await Appointment.findOne({
      doctorId,
      date,
      $and: [
        { startTime: { $lt: endTime } },
        { endTime: { $gt: startTime } }
      ]
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { success: false, error: `This time slot overlaps with an existing booking.` },
        { status: 409 }
      );
    }

    // Utilise the configured default cost if the client hasn't provided billing details
    let cost = body.billing?.cost || 0;
    if (!cost) {
      const settings = await Settings.findOne({});
      cost = settings?.cost || 100; 
    }

    const newAppointmentData = {
      ...body,
      endTime,
      billing: {
        cost,
        statementIssued: false
      }
    };

    const appointment = await Appointment.create(newAppointmentData);
    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: unknown) {
    console.error("Booking err:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
