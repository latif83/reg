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
    // Parse the request body
    const { email, password } = await req.json();

    // Convert email to lowercase
    const lowercaseEmail = email.toLowerCase();

    // Find the user by email
    const checkUser = await prisma.employees.findUnique({
      where: {
        email: lowercaseEmail,
      },
    });

    const checkAdmin = await prisma.admins.findUnique({
      where: {
        email: lowercaseEmail,
      },
    });

    if (!checkUser && !checkAdmin) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the user's password in the database
    checkUser &&
      (await prisma.employees.update({
        where: {
          email: lowercaseEmail,
        },
        data: {
          password,
        },
      }));

    checkAdmin &&
      (await prisma.admins.update({
        where: {
          email: lowercaseEmail,
        },
        data: {
          password,
        },
      }));

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
