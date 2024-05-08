// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req, params) {
  try {
    // Retrieve department ID from request parameters
    const departmentId = params.params.deptId;

    // Query the database for employees belonging to the specified department
    const employees = await prisma.employees.findMany({
      where: {
        deptId: departmentId,
      },
    });

    // Return the list of employees as a JSON response
    return NextResponse.json(
      {
        message: "Employees retrieved successfully!",
        employees,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error retrieving employees:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
