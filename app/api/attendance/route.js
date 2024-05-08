// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

// GET API to fetch attendance history for an employee
// GET API to fetch attendance history within a date range
export async function GET(req, params) {
    try {
      const hasCookies = cookies().has("access-token");
      let user = {};
  
      if (!hasCookies) {
        return NextResponse.json(
          {
            error:
              "You're unauthorized to fetch attendance history, please login to continue.",
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
          } else {
            // Handle invalid token
            return NextResponse.json(
              { error: "Your session is expired, please login" },
              { status: 400 }
            );
          }
        }
      }
  
      const employeeId = user.userId;
  
      // Parse query parameters for start and end dates
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    console.log(start)
    console.log(end)
  
      // Define filters based on query parameters
      let filters = { employeeId: employeeId };
      if (start && end) {
        // Convert start and end dates to Date objects
        const startDate = new Date(start);
        const endDate = new Date(end);
      
        // Adjust the end date to include entries up to the end of the day
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
      
        // Add filters for date range
        filters.AND = [
          { clockIn: { gte: startDate } }, // Clock in date is greater than or equal to start date
          { clockIn: { lt: endDate } },    // Clock in date is less than end date
        ];
      } else if (start) {
        // Convert start date to Date object
        const startDate = new Date(start);
      
        // Add filter for start date
        filters.clockIn = { gte: startDate }; // Clock in date is greater than or equal to start date
      } else if (end) {
        // Convert end date to Date object
        const endDate = new Date(end);
      
        // Adjust the end date to include entries up to the end of the day
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
      
        // Add filter for end date
        filters.clockIn = { lt: endDate }; // Clock in date is less than end date
      }
      
  
      // Fetch attendance history based on the defined filters or without any filters
      const attendanceHistory = await prisma.attendance.findMany({
        where: filters, // Apply filters if any
        orderBy: {
          clockIn: 'desc',
        },
      });
  
      // Calculate the time difference for each attendance record
      const formattedAttendanceHistory = attendanceHistory.map(attendance => {
        const clockInTime = new Date(attendance.clockIn);
        let clockOutTime;
  
        // If clockOut is null, use the current time
        if (!attendance.clockOut) {
          clockOutTime = new Date(); // Current time
        } else {
          clockOutTime = new Date(attendance.clockOut);
        }
  
        // Calculate time difference in milliseconds
        const timeDifferenceMs = clockOutTime - clockInTime;
  
        // Convert milliseconds to hours
        const timeDifferenceHours = timeDifferenceMs / (1000 * 60 * 60); // milliseconds to hours conversion
  
        // Add timeDifferenceHours to the attendance object
        return {
          ...attendance,
          timeDifference: timeDifferenceHours.toFixed(2) + " hrs",
        };
      });
  
      return NextResponse.json(
        { attendanceHistory: formattedAttendanceHistory },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  
  
  