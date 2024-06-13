// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = "force-dynamic";

// Reset Employee password
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to reset password, please login to continue.",
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
    const { password } = await req.json();

    // Convert email to lowercase
    const lowercaseEmail = user.email.toLowerCase();

    // Find the user by email
    const checkUser = await prisma.admins.findUnique({
      where: {
        email: lowercaseEmail,
      },
    });

    if (!checkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's password in the database
    await prisma.admins.update({
      where: {
        email: lowercaseEmail,
      },
      data: {
        password,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    // Close the PrismaClient instance
    // await prisma.$disconnect();
  }
}
