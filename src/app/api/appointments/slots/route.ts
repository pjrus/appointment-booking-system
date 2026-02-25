import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Appointment, Settings } from '@/models/Schemas';

export async function POST(request: Request) {
  try {
    const { doctorId, date, durationMinutes } = await request.json();

    if (!doctorId || !date) {
      return NextResponse.json({ success: false, error: 'Doctor ID and Date are required.' }, { status: 400 });
    }

    const duration = durationMinutes ? parseInt(durationMinutes) : 30;

    await dbConnect();

    // Retrieve global clinic configuration to determine the minimum gap 
    // between bookable slots. We default to 30 minutes if uninitialised.
    const settings = await Settings.findOne({});
    const apptSlotInterval = settings?.apptSlotInterval || 30; // default 30 mins

    // Hardcoded operational hours based on the legacy PHP system requirements.
    // In a future update, we should parametrise this within the global settings to maximise flexibility.
    const dayStartHour = 9; // 09:00
    const dayEndHour = 20; // 20:00

    // Fetch booked appointments for this doctor on this date
    const bookedAppointments = await Appointment.find({ doctorId, date });

    const timeSlots = [];
    const baseDate = new Date(`2000-01-01T00:00:00Z`); // use arbitrary date to count time
    
    let currentSlot = new Date(baseDate);
    currentSlot.setUTCHours(dayStartHour, 0, 0, 0);

    const endOfDay = new Date(baseDate);
    endOfDay.setUTCHours(dayEndHour, 0, 0, 0);

    while (currentSlot < endOfDay) {
      const slotStartTime = new Date(currentSlot);
      const slotEndTime = new Date(slotStartTime.getTime() + duration * 60000);

      // Check if slotEndTime exceeds end of day (optional restrict, PHP didn't limit strictly but makes sense)
      // if (slotEndTime > endOfDay) break; 

      // Format current time HH:mm
      const hours = slotStartTime.getUTCHours().toString().padStart(2, '0');
      const mins = slotStartTime.getUTCMinutes().toString().padStart(2, '0');
      const startTimeStr = `${hours}:${mins}`;

      // Check for slot availability against all pre-existing booked appointments.
      // We iterate through the MongoDB records and perform an intersection check.
      let isAvailable = true;

      for (const booked of bookedAppointments) {
        // We parse booked times purely for comparison
        const [bStartH, bStartM] = booked.startTime.split(':').map(Number);
        const [bEndH, bEndM] = booked.endTime.split(':').map(Number);
        
        const bStart = new Date(baseDate);
        bStart.setUTCHours(bStartH, bStartM, 0, 0);
        
        const bEnd = new Date(baseDate);
        bEnd.setUTCHours(bEndH, bEndM, 0, 0);

        // Overlap logic check:
        // We reject the slot if (Slot Start < Booking End) AND (Slot End > Booking Start).
        // This guarantees no conflicting schedules occur within the clinic's timetable.
        if (slotStartTime < bEnd && slotEndTime > bStart) {
          isAvailable = false;
          break;
        }
      }

      timeSlots.push({
        time: startTimeStr,
        available: isAvailable
      });

      // Increment by apptSlotInterval
      currentSlot = new Date(currentSlot.getTime() + apptSlotInterval * 60000);
    }

    return NextResponse.json({ success: true, data: timeSlots });

  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
