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
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
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

    appointmentDate = new Date(appointmentDate).toISOString(); // This will generate a date string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"

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

     // Send email to employee
   await fetch(
    `${process.env.MAIL_SERVER_URL}/send-employee-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: checkEmployee.email, // Use the employee's email address
        toName: `${checkEmployee.fname} ${checkEmployee.lname}`, // Use the employee's name
        subject: `New Appointment Booked On ${new Date(
          appointmentDate
        ).toDateString()} - ${new Date(
          appointmentDate
        ).toLocaleTimeString()}`,
        status: "Pending",
        user: "latifm8360@gmail.com",
        pass: "ziez xcek uckf uhyw",
        appointmentData: {
          visitorName,
          visitorEmail,
          visitorPhone,
          visitorFrom,
          appointmentDate,
          purpose,
        },
      }),
    }
  );

  // Send email to client
  await fetch(`${process.env.MAIL_SERVER_URL}/send-client-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      toName: visitorName,
      to: visitorEmail, // Use the client's email address provided in the request
      subject: `New Appointment Booked On ${new Date(
        appointmentDate
      ).toDateString()} - ${new Date(appointmentDate).toLocaleTimeString()}`,
      status: "Pending",
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      employeeName: `${checkEmployee.fname} ${checkEmployee.lname}`,
      position: checkEmployee.department.name,
      declineReason : ""
    }),
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
