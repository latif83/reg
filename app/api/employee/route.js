// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = "force-dynamic";

// POST API to create a new employee
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to create a department, please login to continue.",
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

    // Parse the request body
    let { fname, lname, email, contact, staffid, address, deptId } =
      await req.json();

    fname = fname.trim();
    lname = lname.trim();
    email = email.trim();
    contact = contact.trim();
    staffid = staffid.trim();
    address = address.trim();

    // Check if email is unique
    const existingEmail = await prisma.employees.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    // Check if staff ID is unique
    const existingStaffId = await prisma.employees.findFirst({
      where: {
        staffid: {
          equals: staffid,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingStaffId) {
      return NextResponse.json(
        { error: "Staff ID already exists." },
        { status: 400 }
      );
    }

    const newEmployee = await prisma.employees.create({
      data: {
        fname,
        lname,
        email,
        address,
        contact,
        deptId,
        staffid,
        password: "password@123",
      },
    });

    return NextResponse.json(
      { message: "Employee added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT API to edit an existing employee
export async function PUT(req) {
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

    // Parse the request body
    let { id, fname, lname, email, contact, staffid, address, deptId } =
      await req.json();

    fname = fname.trim();
    lname = lname.trim();
    email = email.trim();
    contact = contact.trim();
    staffid = staffid.trim();
    address = address.trim();

    // Check if the employee exists
    const existingEmployee = await prisma.employees.findUnique({
      where: { id: id },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found." },
        { status: 404 }
      );
    }

    // Check if email is unique
    if (email !== existingEmployee.email) {
      const existingEmail = await prisma.employees.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists." },
          { status: 400 }
        );
      }
    }

    // Check if staff ID is unique
    if (staffid !== existingEmployee.staffid) {
      const existingStaffId = await prisma.employees.findFirst({
        where: {
          staffid: {
            equals: staffid,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      });

      if (existingStaffId) {
        return NextResponse.json(
          { error: "Staff ID already exists." },
          { status: 400 }
        );
      }
    }

    // Update the employee
    const updatedEmployee = await prisma.employees.update({
      where: { id: id },
      data: {
        fname,
        lname,
        email,
        address,
        contact,
        deptId,
        staffid,
      },
    });

    return NextResponse.json(
      { message: "Employee updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        department: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Employees retrieved successfully!",
        employees,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      { status: 400 }
    );
  }
}

// DELETE API to delete an existing employee
export async function DELETE(req) {
  try {
    const hasCookies = cookies().has("access-token");

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to delete an admin, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get("access-token");

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (!verificationResult.status) {
          // Handle invalid token
          return NextResponse.json(
            { error: "Your session is expired, please login" },
            { status: 400 }
          );
        }
      }
    }

    // Get employee id from request parameters
    const { id } = await req.json();

    // Check if the employee exists
    const existingEmployee = await prisma.employees.findUnique({
      where: { id: id },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found." },
        { status: 404 }
      );
    }

    // Delete the employee
    await prisma.employees.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
