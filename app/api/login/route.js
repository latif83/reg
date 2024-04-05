// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Define the login route
export async function POST(req) {
  try {
    // Parse the request body
    const { email, password, role } = await req.json();

    // Convert email to lowercase
    const lowercaseEmail = email.toLowerCase();

    // Initialize the table name based on the role
    let tableName = "";

    let roleIs = "";

    // Determine the table name based on the role
    if (role === "admins") {
      tableName = "admins";
      roleIs = "admin";
    } else if (role === "employees") {
      tableName = "employees";
      roleIs = "employee";
    } else {
      // Invalid role
      return NextResponse.json({ error: "Invalid role" }, { status: 401 });
    }

    // Find the user by email
    const user = await prisma[tableName].findUnique({
      where: {
        email: lowercaseEmail,
      },
    });

    // Check if the user exists and if the password matches
    //   if (user && (await bcrypt.compare(password, user.password))) {
    if (user && user.password == password) {
      // Create a JWT with the user's information
      const token = jwt.sign(
        { userId: user.id, email: user.email, fullName: user.name },
        "your-secret-key", // Replace with a secure secret key (keep it secret)
        { expiresIn: "2h" } // Token expiration time (e.g., 1 hour)
      );

      cookies().set("access-token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Enable for HTTPS in production
      });

      // Successful login
      return NextResponse.json(
        { token, message: "Login successful",roleIs },
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
