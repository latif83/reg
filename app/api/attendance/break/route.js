// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

// POST API to start or end a break for an employee
export async function POST(req) {
    try {
      // Check if the user is authenticated
      const hasCookies = cookies().has("access-token");
  
      if (!hasCookies) {
        return NextResponse.json(
          {
            error: "You're unauthorized to start or end a break, please login to continue.",
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
      const { action } = await req.json(); // 'start' or 'end'
  
      // Get the user ID from the decoded token
      const { userId: employeeId } = verificationResult.decodedToken;
  
      // Get the current date and time
      const currentDateTime = new Date();
  
      if (action === 'start') {
        // Start the break for the employee
        await prisma.attendance.updateMany({
          where: {
            employeeId: employeeId,
            breakStart: null, // Filter for entries where breakStart is null
          },
          data: {
            breakStart: currentDateTime,
          },
        });
      } else if (action === 'end') {
        // End the break for the employee
        await prisma.attendance.updateMany({
          where: {
            employeeId: employeeId,
            breakStart: { not: null }, // Filter for entries where breakStart is not null
            breakEnd: null,            // Filter for entries where breakEnd is null
          },
          data: {
            breakEnd: currentDateTime,
          },
        });
      } else {
        return NextResponse.json(
          { error: "Invalid action. Must be 'start' or 'end'." },
          { status: 400 }
        );
      }
  
      return NextResponse.json(
        { message: `Employee break ${action === 'start' ? 'started' : 'ended'} successfully` },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error starting or ending break for employee:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
  