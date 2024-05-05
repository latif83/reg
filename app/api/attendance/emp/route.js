// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

// GET API to get all employees clocked in for a particular attendance using the attendance code
export async function GET(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to access employee attendance, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get("access-token");

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
          // Now you have the user details, you can use them as needed
          // console.log("User details:", user);
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: "Your session is expired, please login" },
            { status: 400 }
          );
        }
      }
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const attendanceCode = searchParams.get("attendanceCode");

    // Fetch all attendance records with the matching attendance code
    const employeeAttendance = await prisma.attendance.findMany({
      where: {
        AttendanceCodeId: attendanceCode,
      },
      include: {
        employee: {
          include: {
            department: true,
          },
        },
      },
    });

    // Extract employee details along with department information from the fetched attendance records
    const employees = employeeAttendance.map((attendance) => ({
      id: attendance.employee.id,
      fname: attendance.employee.fname,
      lname: attendance.employee.lname,
      clockIn: attendance.clockIn,
      clockOut: attendance.clockOut,
      employee : `${attendance.employee.fname} ${attendance.employee.lname}`,
      department: attendance.employee.department.name, // Include department name
    }));

    // console.log(employees);

    return NextResponse.json({ employees }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
