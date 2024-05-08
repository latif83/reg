// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// Define the login route
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "You're unauthorized to clock in, please login to continue.",
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
    const checkUser = await prisma.employees.findUnique({
      where: {
        email: lowercaseEmail,
      },
    });

    // Check if the user exists and if the password matches
    //   if (user && (await bcrypt.compare(password, user.password))) {
    if (checkUser && checkUser.password == password) {
      // Successful login
      return NextResponse.json(
        { message: "Authentication Successful!" },
        { status: 200 }
      );
    } else {
      // Invalid email or password
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }
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
