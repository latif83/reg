// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export async function GET(req, params) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    const empId = params.params.empId;

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "Please login to continue.",
          redirect: true,
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
            { error: "Your session is expired, please login",redirect: true, },
            { status: 400 }
          );
        }
      }
    }

    const employee = await prisma.employees.findFirst({
      where: {
        id: user.userId,
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        address: true,
        staffid: true,
        contact: true,
        email: true,
        department: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Employee data retrieved successfully!",
        employee,
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

export async function PUT(req, params) {
  try {
    // Check if the user has a valid access token
    const hasCookies = cookies().has("access-token");

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "Please login to continue.",
        },
        { status: 400 }
      );
    }

    // Get the user details from the access token
    const cookie = cookies().get("access-token");
    const verificationResult = await verifyToken(cookie?.value || "");

    if (!verificationResult.status) {
      return NextResponse.json(
        { error: "Your session is expired, please login" },
        { status: 400 }
      );
    }

    const user = verificationResult.decodedToken;
    const { empId } = params.params;
    console.log({ empId });
    const { fname, lname, staffid, address, contact, dept, email } =
      await req.json(); // Assuming the request body has a field called newPositionTitle

    // Check if the position exists for the given election and user
    const existingEmployee = await prisma.employees.findFirst({
      where: {
        id: empId,
      },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        {
          error: "Employee not found",
        },
        { status: 404 }
      );
    }

    // Update the position title
    const updatedEmployee = await prisma.employees.update({
      where: {
        id: empId,
      },
      data: {
        fname,
        lname,
        address,
        contact,
        email,
      },
    });

    return NextResponse.json(
      { message: "Employee updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    // Handle other errors if needed
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
