// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

// POST API to create a new memo
export async function POST(req) {
    try {
      // Check if user is authenticated
      const hasCookies = cookies().has('access-token');
      let user = {};
  
      if (!hasCookies) {
        return NextResponse.json(
          {
            error: "You're unauthorized to create a memo, please login to continue.",
          },
          { status: 400 }
        );
      }
  
      if (hasCookies) {
        const cookie = cookies().get('access-token');
  
        if (cookie?.value) {
          const verificationResult = await verifyToken(cookie.value);
  
          if (verificationResult.status) {
            user = verificationResult.decodedToken;
            // Now you have the user details, you can use them as needed
            // console.log("User details:", user);
          } else {
            // Handle invalid token
            return NextResponse.json(
              { error: 'Your session is expired, please login' },
              { status: 400 }
            );
          }
        }
      }
  
      // Parse the request body
      const { title, details, recipientId } = await req.json();

      const senderId = user.userId
  
      // Validate memo data
      if (!title || !details || !senderId || !recipientId) {
        return NextResponse.json(
          { error: 'Please provide all required fields for the memo.' },
          { status: 400 }
        );
      }
  
      // Create new memo in the database
      const newMemo = await prisma.memo.create({
        data: {
          title,
          details,
          senderId,
          recipientId,
          status: 'PENDING',
        },
      });
  
      return NextResponse.json({ message: 'Memo created successfully' }, { status: 201 });
    } catch (error) {
      console.error('Error creating memo:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

// GET API to fetch all memos for the current user
export async function GET(req) {
  try {
    // Check if user is authenticated
    const hasCookies = cookies().has('access-token');
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "You're unauthorized to view memos, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get('access-token');

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
          // Now you have the user details, you can use them as needed
          // console.log("User details:", user);
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: 'Your session is expired, please login' },
            { status: 400 }
          );
        }
      }
    }

    // Fetch memos where the current user is either the sender or the receiver
    const memos = await prisma.memo.findMany({
      where: {
        OR: [
          { senderId: user.userId }, // Current user is the sender
          { recipientId: user.userId }, // Current user is the receiver
        ],
      },
      include: {
        recipient: { include: { department: true } }, // Include recipient details with department
        sender: { include: { department: true } }, // Include sender details with department
      },
      orderBy: {
        createdAt: 'desc', // You can adjust the sorting as per your requirement
      },
    });

    // Add a custom tag to each memo indicating whether it was sent or received by the current user
    const memosWithCustomTag = memos.map((memo) => ({
      ...memo,
      customTag: memo.senderId === user.userId ? 'Sent' : 'Received',
    }));

    console.log(memosWithCustomTag);

    return NextResponse.json({ memos: memosWithCustomTag }, { status: 200 });
  } catch (error) {
    console.error('Error fetching memos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT API to change the status of a memo
export async function PUT(req) {
  try {
    // Check if user is authenticated
    const hasCookies = cookies().has('access-token');
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error: "You're not unauthorized to update memos, please login to continue.",
        },
        { status: 400 }
      );
    }

    if (hasCookies) {
      const cookie = cookies().get('access-token');

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
          // Now you have the user details, you can use them as needed
          // console.log("User details:", user);
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: 'Your session is expired, please login' },
            { status: 400 }
          );
        }
      }
    }

    // Parse the request body
    const { memoId, status } = await req.json();

    // Fetch memo details
    const memo = await prisma.memo.findUnique({
      where: {
        id: memoId,
      },
    });

    // Check if memo exists
    if (!memo) {
      return NextResponse.json(
        { error: 'Memo not found.' },
        { status: 404 }
      );
    }

    // Check if the current user is the recipient of the memo
    if (memo.recipientId !== user.userId) {
      return NextResponse.json(
        { error: 'You are not authorized to change the status of this memo.' },
        { status: 403 }
      );
    }

    // Update memo status
    const updatedMemo = await prisma.memo.update({
      where: {
        id: memoId,
      },
      data: {
        status: status,
      },
    });

    return NextResponse.json(
      { message: 'Memo status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating memo status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


