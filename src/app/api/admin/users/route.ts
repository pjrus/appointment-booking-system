import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User, Doctor } from "@/models/Schemas";
import { requireRole } from "@/lib/auth-guard";
import { ROLES } from "@/lib/roles";

// GET /api/admin/users — list all users (admin only)
export async function GET() {
  const session = await requireRole(ROLES.ADMIN);
  if (session instanceof NextResponse) return session;

  await dbConnect();
  const users = await User.find({}, "-password")
    .populate("doctorId", "title firstName lastName specialisation")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, data: users });
}

// PATCH /api/admin/users — update user role (admin only)
export async function PATCH(req: Request) {
  const session = await requireRole(ROLES.ADMIN);
  if (session instanceof NextResponse) return session;

  try {
    const body = await req.json();
    const { userId, role, doctorId } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required." },
        { status: 400 }
      );
    }

    if (!Object.values(ROLES).includes(role)) {
      return NextResponse.json(
        { error: "Invalid role." },
        { status: 400 }
      );
    }

    await dbConnect();

    const updateData: Record<string, unknown> = { role };

    // If promoting to practitioner, link to a doctor record
    if (role === ROLES.PRACTITIONER) {
      if (doctorId) {
        // Verify the doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
          return NextResponse.json(
            { error: "Doctor record not found." },
            { status: 404 }
          );
        }
        updateData.doctorId = doctorId;
      }
      updateData.isApproved = true;
    }

    // If demoting from practitioner, remove doctor link
    if (role === ROLES.PATIENT) {
      updateData.doctorId = null;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      select: "-password",
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users — delete user (admin only)
export async function DELETE(req: Request) {
  const session = await requireRole(ROLES.ADMIN);
  if (session instanceof NextResponse) return session;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required." },
        { status: 400 }
      );
    }

    await dbConnect();
    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "User deleted." });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
