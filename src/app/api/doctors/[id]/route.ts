import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Doctor } from '@/models/Schemas';

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    // IDEAL BEHAVIOUR: We should ideally verify if the practitioner has any upcoming 
    // or unfinalised appointments before authorising the deletion.
    // 
    // CURRENT BEHAVIOUR: Mimicking the standard legacy system's behaviour here by performing
    // a straightforward direct deletion of the record.
    const deleted = await Doctor.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Practitioner not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: deleted });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
