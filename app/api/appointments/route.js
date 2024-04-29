// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

// POST API to create a new appointment
export async function POST(req) {
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

    // Extract appointment data from the request body
    let {
      visitorName,
      visitorEmail,
      visitorPhone,
      visitorFrom,
      appointmentDate,
      purpose,
    } = await req.json();

    const employeeId = user.userId;

    appointmentDate = new Date().toISOString(); // This will generate a date string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"

    // Create the appointment in the database
    const newAppointment = await prisma.appointments.create({
      data: {
        visitorName,
        visitorEmail,
        visitorPhone,
        visitorFrom,
        appointmentDate,
        purpose,
        employeeId,
      },
    });

    return NextResponse.json(
      { message: "Appointment booked successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


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

    // Fetch appointments for the specified employee from the database
    const appointments = await prisma.appointments.findMany({
      where: {
        employeeId: employeeId,
      },
      orderBy: {
        createdAt: 'desc', // You can adjust the sorting as per your requirement
      },
    });

    // console.log({appointments,count:appointments.length})

    return NextResponse.json(
      { appointments: appointments },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT API to change the status of an appointment
export async function PUT(req, params) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to change the appointment status, please login to continue.",
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

    const { appointmentId, status } = await req.json();

    // Check if the user has permission to change the appointment status (you can add more validation logic if needed)
    // For example, you might want to check if the user is the owner of the appointment
    // or has certain roles/permissions to modify appointment status.

    // Update the appointment status in the database
    const updatedAppointment = await prisma.appointments.update({
      where: { id: appointmentId },
      data: {
        status: status,
      },
    });

    return NextResponse.json(
      { message: "Appointment status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating appointment status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
