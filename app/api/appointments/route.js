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

    // Get employee details
    const employeeDetails = await prisma.employees.findUnique({
      where: {
        id: user.userId,
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


    // Send email to employee
   await fetch(
      `${process.env.MAIL_SERVER_URL}/send-employee-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: employeeDetails.email, // Use the employee's email address
          toName: `${employeeDetails.fname} ${employeeDetails.lname}`, // Use the employee's name
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
        employeeName: `${employeeDetails.fname} ${employeeDetails.lname}`,
        position: employeeDetails.department.name,
      }),
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

   // Get employee details
   const employeeDetails = await prisma.employees.findUnique({
    where: {
      id: user.userId,
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

    // Update the appointment status in the database
    const updatedAppointment = await prisma.appointments.update({
      where: { id: appointmentId },
      data: {
        status: status,
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
        to: employeeDetails.email, // Use the employee's email address
        toName: `${employeeDetails.fname} ${employeeDetails.lname}`, // Use the employee's name
        subject: `Appointment Updated - Booked On ${new Date(
          updatedAppointment.appointmentDate
        ).toDateString()} - ${new Date(
          updatedAppointment.appointmentDate
        ).toLocaleTimeString()}`,
        status,
        user: "latifm8360@gmail.com",
        pass: "ziez xcek uckf uhyw",
        appointmentData: {
          visitorName : updatedAppointment.visitorName,
          visitorEmail : updatedAppointment.visitorEmail,
          visitorPhone : updatedAppointment.visitorPhone,
          visitorFrom : updatedAppointment.visitorFrom,
          appointmentDate : updatedAppointment.appointmentDate,
          purpose : updatedAppointment.purpose,
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
      toName: updatedAppointment.visitorName,
      to: updatedAppointment.visitorEmail, // Use the client's email address provided in the request
      subject: `Appointment Updated - Booked On ${new Date(
        updatedAppointment.appointmentDate
      ).toDateString()} - ${new Date(updatedAppointment.appointmentDate).toLocaleTimeString()}`,
      status,
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      employeeName: `${employeeDetails.fname} ${employeeDetails.lname}`,
      position: employeeDetails.department.name,
    }),
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