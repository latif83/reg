// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

// POST API to create a new appointment
export async function POST(req, params) {
  try {
    const employeeId = params.params.empId;

    const checkEmployee = await prisma.employees.findFirst({
      where: {
        id: employeeId,
      },
    });

    if (!checkEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 400 }
      );
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
      {
        message:
          "Appointment received successfully. We will provide updates on the booking status via email.",
      },
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
