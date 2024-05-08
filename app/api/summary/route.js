// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

// API endpoint to get employee count, admin count, attendance count for today, and appointments count for today
export async function GET(req) {
  try {
    // Get current date
    const currentDate = new Date();
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    // Get employee count
    const employeeCount = await prisma.employees.count();

    // Get admin count
    const adminCount = await prisma.admins.count();

    // Get attendance count for today
    const attendanceCount = await prisma.attendance.count({
      where: {
        clockIn: {
          gte: today, // Filter for today's attendance records
        },
      },
    });

    // Get appointments count for today
    const appointmentCount = await prisma.appointments.count({
      where: {
        appointmentDate: {
          gte: today, // Filter for today's appointments
        },
      },
    });

    const summary = {
      employeeCount,
      adminCount,
      attendanceCount,
      appointmentCount,
    };

    // console.log(summary);

    // Return the counts as JSON response
    return NextResponse.json({ summary }, { status: 201 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
