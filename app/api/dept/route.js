// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

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

// PUT API to edit an existing department
export async function PUT(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to edit a department, please login to continue.",
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
    let { id, deptName } = await req.json();

    deptName = deptName.trim();

    if (!deptName) {
      return NextResponse.json(
        { error: "Please provide the department name." },
        { status: 400 }
      );
    }

    // Check if the department exists
    const existingDepartment = await prisma.departments.findUnique({
      where: { id: id },
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { error: "Department not found." },
        { status: 404 }
      );
    }

    // Check if the department name is already taken by another department
    if (deptName !== existingDepartment.name) {
      const existingName = await prisma.departments.findFirst({
        where: {
          name: {
            equals: deptName,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      });

      if (existingName) {
        return NextResponse.json(
          { error: "Department name already exists." },
          { status: 400 }
        );
      }
    }

    // Update the department
    const updatedDepartment = await prisma.departments.update({
      where: { id: id },
      data: {
        name: deptName,
      },
    });

    return NextResponse.json(
      { message: "Department updated successfully" },
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

// DELETE API to delete an existing department
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

    // Get department id from request parameters
    const { id } = await req.json();

    // Check if the department exists
    const existingDepartment = await prisma.departments.findUnique({
      where: { id: id },
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { error: "Department not found." },
        { status: 404 }
      );
    }

    // Delete the department
    await prisma.departments.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Department deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}