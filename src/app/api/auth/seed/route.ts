import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models/Schemas";

// POST /api/auth/seed
// One-time admin account creation, protected by SEED_SECRET env var.
// Should be disabled or removed after the first admin is created.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { secret, email, password, firstName, lastName } = body;

    // Verify seed secret
    const seedSecret = process.env.SEED_SECRET;
    if (!seedSecret || secret !== seedSecret) {
      return NextResponse.json(
        { error: "Invalid seed secret." },
        { status: 403 }
      );
    }

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Email, password, first name, and last name are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin account already exists. Seed can only be used once." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      firstName,
      lastName,
      isApproved: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin account created successfully.",
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
