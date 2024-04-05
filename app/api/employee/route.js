// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

// POST API to create a new department
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unathorized to create a department, please login to continue.",
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

    // if (!deptName) {
    //   return NextResponse.json(
    //     { error: "Please provide the department name." },
    //     { status: 400 }
    //   );
    // }

    // Check if the election is already created by this user with the same staff id
    const existingEmployee = await prisma.employees.findFirst({
      where: {
        staffid: {
          equals: staffid,
          mode: "insensitive", // Case-sensitive comparison
        },
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { error: "You already have an employee with same staff Id." },
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

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
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
