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
    const { email, code } = await req.json();

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

    const sendEmailData = {
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      subject: `Reset your password`,
      to: lowercaseEmail,
      code,
    };

    // Send email to sender
    const response = await fetch(`${process.env.MAIL_SERVER_URL}/send-reset-password-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendEmailData),
    });

    console.log(await response.json())

    return NextResponse.json(
      { message: "Code sent successful!" },
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
