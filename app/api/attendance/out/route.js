// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

// POST API to clock out an employee
export async function POST(req) {
    try {
      // Check if the user is authenticated
      const hasCookies = cookies().has("access-token");
  
      if (!hasCookies) {
        return NextResponse.json(
          {
            error: "You're unauthorized to clock out, please login to continue.",
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
  
      // Get the user ID from the decoded token
      const { userId: employeeId } = verificationResult.decodedToken;
  
      // Get the current date and time
      const currentDateTime = new Date();
  
      // Update the employee's clock out time
      await prisma.attendance.updateMany({
        where: {
          employeeId: employeeId,
          clockOut: null, // Filter for entries where clockOut is null
        },
        data: {
          clockOut: currentDateTime,
        },
      });
  
      return NextResponse.json(
        { message: "Employee clocked out successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error clocking out employee:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  