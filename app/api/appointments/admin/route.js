// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// GET API to fetch all appointments for a particular employee
export async function GET(req, params) {
    try {
      const hasCookies = cookies().has("access-token");
      let user = {};
  
      if (!hasCookies) {
        return NextResponse.json(
          {
            error:
              "You're unauthorized to edit an employee, please login to continue.",
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
            //   console.log("User details:", user);
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
  
      // Parse query parameters
      const { searchParams } = new URL(req.url);
      const filterDate = searchParams.get("filterDate");
      const filterBy = searchParams.get("filterBy");
  
      let whereConditions = {}; // Define an empty object to hold the WHERE conditions
  
      if (filterDate && filterBy) {
        // Both filterDate and filterBy are provided
        if (filterBy === "appointmentDate") {
          // Filter appointments by the specified appointmentDate
          const filterDateWithoutTime = new Date(filterDate)
            .toISOString()
            .split("T")[0]; // Get only the date part
          whereConditions.appointmentDate = {
            gte: new Date(filterDateWithoutTime + "T00:00:00.000Z"), // Start of the specified date
            lt: new Date(
              new Date(filterDateWithoutTime + "T23:59:59.999Z").getTime() + 1
            ), // End of the specified date
          };
        } else if (filterBy === "createdAt") {
          // Filter appointments by the date they were created
          // Here you can adjust the conditions as needed based on your database schema
          // For example, filtering by appointments created on a specific date
          const filterDateWithoutTime = new Date(filterDate)
            .toISOString()
            .split("T")[0]; // Get only the date part
          whereConditions.createdAt = {
            gte: new Date(filterDateWithoutTime + "T00:00:00.000Z"), // Start of the specified date
            lt: new Date(
              new Date(filterDateWithoutTime + "T23:59:59.999Z").getTime() + 1
            ), // End of the specified date
          };
        }
      } else if (filterDate) {
        // Only filterDate is provided
        // If only filterDate is provided, assume filtering by appointmentDate
        whereConditions.appointmentDate = new Date(filterDate);
      }
  
      // Fetch appointments for the specified employee from the database
      const appointments = await prisma.appointments.findMany({
        where: {
          ...whereConditions, // Merge the whereConditions object with the existing WHERE clause
        },
        orderBy: {
          createdAt: "desc", // You can adjust the sorting as per your requirement
        },
      });
  
      // console.log({appointments,count:appointments.length})
  
      return NextResponse.json({ appointments: appointments }, { status: 200 });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }