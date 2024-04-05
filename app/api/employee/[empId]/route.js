// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export async function GET() {
  try {
    const empId = "";

    const employees = await prisma.employees.findFirst({
      where: {
        id: empId,
      }
    });

    return NextResponse.json(
      {
        message: "Employee data retrieved successfully!",
        employees,
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
