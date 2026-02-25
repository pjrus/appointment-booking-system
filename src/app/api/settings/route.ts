import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Settings } from '@/models/Schemas';

export async function GET() {
  try {
    await dbConnect();
    // Fetch the singular global settings document to configure the application's behaviour.
    // If uninitialised, we gracefully return an empty object to let the frontend handle defaults.
    const settings = await Settings.findOne({});
    return NextResponse.json({ success: true, data: settings || {} });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();

    // Since there is only one global settings configuration across the entire clinic,
    // we find and update the first document, or create one if no settings exist yet (upsert behaviour).
    // This allows administrators to parametrise and alter rules dynamically.
    const settings = await Settings.findOneAndUpdate(
      {}, 
      body, 
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
