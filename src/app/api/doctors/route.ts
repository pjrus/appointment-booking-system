// Practitioners API route. Handles GET (retrieve all doctor profiles for the admin
// roster and booking forms) and POST (create a new practitioner record with details
// such as title, name, phone, and specialisation).
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Doctor } from '@/models/Schemas';

export async function GET() {
  try {
    // Initialise the MongoDB connection
    await dbConnect();
    
    // Retrieve all practitioner records from the database
    // This is primarily utilised by the admin dashboard for the roster view
    const doctors = await Doctor.find({});
    return NextResponse.json({ success: true, data: doctors });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Parse the incoming JSON payload containing the new practitioner's details
    const body = await request.json();
    await dbConnect();
    
    // Create and persist the new doctor profile within the MongoDB collection
    const doctor = await Doctor.create(body);
    return NextResponse.json({ success: true, data: doctor }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}
