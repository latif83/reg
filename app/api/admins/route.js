// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export const dynamic = 'force-dynamic';

// POST API to create a new admin
export async function POST(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "You're unauthorized, please login to continue.",
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
    let { name, email } = await req.json();

    name = name.trim();
    email = email.trim();

    // Check if email is unique
    const existingEmail = await prisma.admins.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive", // Case-insensitive comparison
        },
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    const newAdmin = await prisma.admins.create({
      data: {
        name,
        email,
        password: "password@123",
      },
    });

    return NextResponse.json(
      { message: "Admin added successfully" },
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

// PUT API to edit an existing admin
export async function PUT(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to edit an admin, please login to continue.",
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
    let { id, name , email } =
      await req.json();

    name = name.trim();
    email = email.trim();

    // Check if the admin exists
    const existingAdmin = await prisma.admins.findUnique({
      where: { id: id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { error: "Admin not found." },
        { status: 404 }
      );
    }

    // Check if email is unique
    if (email !== existingAdmin.email) {
      const existingEmail = await prisma.admins.findFirst({
        where: {
          email: {
            equals: email,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists." },
          { status: 400 }
        );
      }
    }

    // Update the admin
    const updatedAdmin = await prisma.admins.update({
      where: { id: id },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(
      { message: "Admin updated successfully" },
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

export async function GET(req) {
  try {
    const hasCookies = cookies().has("access-token");
    let user = {};

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
            { error: "Your session is expired, please login", redirect: true },
            { status: 400 }
          );
        }
      }
    }

    const admins = await prisma.admins.findMany({
      orderBy: {
        createdAt: "desc", // You can adjust the sorting as per your requirement
      },
    });

    // console.log(admins)

    return NextResponse.json(
      {
        message: "Admin data retrieved successfully!",
        admins,
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


// DELETE API to delete an existing admin
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

    // Get admin id from request parameters
    const { id } = await req.json();

    // Check if the admin exists
    const existingAdmin = await prisma.admins.findUnique({
      where: { id: id },
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { error: "Admin not found." },
        { status: 404 }
      );
    }

    // Delete the admin
    await prisma.admins.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Admin deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting admin:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
