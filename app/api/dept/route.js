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

    // Parse the request body
    let { deptName } = await req.json();

    deptName = deptName.trim();

    if (!deptName) {
      return NextResponse.json(
        { error: "Please provide the department name." },
        { status: 400 }
      );
    }

    // Check if the election is already created by this user with the same name
    const existingDepartment = await prisma.departments.findFirst({
      where: {
        name: {
          equals: deptName,
          mode: "insensitive", // Case-sensitive comparison
        },
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: "You already have a department with the same name." },
        { status: 400 }
      );
    }

    const newElection = await prisma.departments.create({
      data: {
        name: deptName,
      },
    });

    return NextResponse.json(
      { message: "Department created successfully" },
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
    const departments = await prisma.departments.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        message: "Departments retrieved successfully!",
        departments,
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
