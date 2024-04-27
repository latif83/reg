// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

// POST API to clock in an employee
export async function POST(req) {
  try {
    // Check if the user is authenticated
    const hasCookies = cookies().has("access-token");

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "You're unauthorized to clock in, please login to continue.",
        },
        { status: 401 }
      );
    }

    // Verify the access token
    const cookie = cookies().get("access-token");

    if (!cookie?.value) {
      return NextResponse.json(
        { error: "Missing access token" },
        { status: 401 }
      );
    }

    const verificationResult = await verifyToken(cookie?.value);

    if (!verificationResult.status) {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 401 }
      );
    }

    // Parse the request body
    const { attendanceCode } = await req.json();

    // Get the current date
    const currentDate = new Date();

    // Find the attendance code for the current day
    const existingAttendanceCode = await prisma.attendanceCode.findFirst({
      where: {
        AND: [
          { code: attendanceCode },
          {
            createdAt: {
              gte: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
              ),
              lt: new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + 1
              ),
            },
          },
        ],
      },
    });

    // Check if the attendance code exists for the current day
    if (!existingAttendanceCode) {
      return NextResponse.json(
        { error: "Invalid or expired attendance code" },
        { status: 400 }
      );
    }

    // Get the user ID from the decoded token
    const { userId: employeeId } = verificationResult.decodedToken;

    // Clock in the employee
    await prisma.attendance.create({
      data: {
        employeeId,
        clockIn: new Date(),
        AttendanceCodeId: existingAttendanceCode.id,
      },
    });

    return NextResponse.json(
      { message: "Employee clocked in successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error clocking in employee:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
