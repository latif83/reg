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
            { error: "Your session is expired, please login" },
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
        address : true,
        staffid : true,
        contact : true,
        email :true,
        department: {
          select: {
            name: true,
            id: true
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
