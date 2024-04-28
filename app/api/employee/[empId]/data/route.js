// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { verifyToken } from "@/actions/action";

export async function GET(req, params) {
  try {
   
    const empId = params.params.empId

    const employee = await prisma.employees.findFirst({
      where: {
        id: empId,
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        department: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    console.log(employee)

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