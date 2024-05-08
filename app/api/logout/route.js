import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {

    // Delete the cookie if it exists
    const hasCookies = cookies().get("access-token");

    if (hasCookies) {
      cookies().delete("access-token");
    }

    return NextResponse.json(
      {
        message: "Logout successful.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);
    // Handle other errors if needed
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
