// Individual appointment API route. Handles DELETE to remove a specific appointment
// by its MongoDB ObjectId. Currently performs a direct deletion; a future enhancement
// could implement soft-deletes or check appointment status before allowing removal.
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Appointment } from '@/models/Schemas';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    // We execute a direct Document deletion using the given ID.
    // A future enhancement could soft-delete or check if the appointment is already finalised
    // before allowing the deletion to occur.
    const deleted = await Appointment.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: deleted });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
