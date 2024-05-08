// Import PrismaClient and bcrypt
import prisma from "@/config/prisma";
import { NextResponse } from "next/server";
import { verifyToken } from "@/actions/action";
import { cookies } from "next/headers";

// POST API to create a new memo
export async function POST(req) {
  try {
    // Check if user is authenticated
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're unauthorized to create a memo, please login to continue.",
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
          // console.log("User details:", user);
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
    const { title, details, recipientId } = await req.json();

    const senderId = user.userId;

    const sender = await prisma.employees.findUnique({
      where: {
        id: senderId,
      },
    });

    const reciever = await prisma.employees.findUnique({
      where: {
        id: recipientId,
      },
    });

    // console.log(sender)

    // Validate memo data
    if (!title || !details || !senderId || !recipientId) {
      return NextResponse.json(
        { error: "Please provide all required fields for the memo." },
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
        status: "PENDING",
      },
    });

    const memoData = {
      title,
      details,
      createdAt : newMemo.createdAt
    };

    const sendEmailSenderData = {
      senderEmail: sender.email,
      senderName: `${sender.fname} ${sender.lname}`,
      subject: `New Memo - ${memoData.title} ( ${new Date(
        newMemo.createdAt
      ).toDateString()} @ ${new Date(
        newMemo.createdAt
      ).toLocaleTimeString()} )`,
      status: "PENDING",
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      memoData,
    };

    const sendEmailRecieverData = {
      receiverEmail: reciever.email,
      receiverName: `${reciever.fname} ${reciever.lname}`,
      subject: `New Memo - ${memoData.title} ( ${new Date(
        newMemo.createdAt
      ).toDateString()} @ ${new Date(
        newMemo.createdAt
      ).toLocaleTimeString()} )`,
      status: "PENDING",
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      memoData,
    };

    // Send email to sender
    await fetch(`${process.env.MAIL_SERVER_URL}/send-memo-sender-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendEmailSenderData),
    });

    // Send email to reciever
    await fetch(`${process.env.MAIL_SERVER_URL}/send-memo-receiver-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendEmailRecieverData),
    });

    return NextResponse.json(
      { message: "Memo created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating memo:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET API to fetch all memos for the current user
export async function GET(req) {
  try {
    // Check if user is authenticated
    const hasCookies = cookies().has("access-token");
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
      const cookie = cookies().get("access-token");

      if (cookie?.value) {
        const verificationResult = await verifyToken(cookie.value);

        if (verificationResult.status) {
          user = verificationResult.decodedToken;
        } else {
          // Handle invalid token
          return NextResponse.json(
            { error: "Your session is expired, please login" },
            { status: 400 }
          );
        }
      }
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const filterDate = searchParams.get("filterDate");

    // Prepare where condition
    let whereCondition = {
      OR: [
        { senderId: user.userId }, // Current user is the sender
        { recipientId: user.userId }, // Current user is the receiver
      ],
    };

    // Add date filter if provided
    if (filterDate) {
      whereCondition.createdAt = {
        gte: new Date(filterDate),
        lt: new Date(new Date(filterDate).getTime() + 24 * 60 * 60 * 1000), // Add 1 day to filter until the end of the day
      };
    }

    // Fetch memos with optional date filter
    const memos = await prisma.memo.findMany({
      where: whereCondition,
      include: {
        recipient: { include: { department: true } }, // Include recipient details with department
        sender: { include: { department: true } }, // Include sender details with department
      },
      orderBy: {
        createdAt: "desc", // You can adjust the sorting as per your requirement
      },
    });

    // Add a custom tag to each memo indicating whether it was sent or received by the current user
    const memosWithCustomTag = memos.map((memo) => ({
      ...memo,
      customTag: memo.senderId === user.userId ? "Sent" : "Received",
    }));

    return NextResponse.json({ memos: memosWithCustomTag }, { status: 200 });
  } catch (error) {
    console.error("Error fetching memos:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


// PUT API to change the status of a memo
export async function PUT(req) {
  try {
    // Check if user is authenticated
    const hasCookies = cookies().has("access-token");
    let user = {};

    if (!hasCookies) {
      return NextResponse.json(
        {
          error:
            "You're not unauthorized to update memos, please login to continue.",
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
          // console.log("User details:", user);
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
    const { memoId, status, declineReason } = await req.json();

    // Fetch memo details
    const memo = await prisma.memo.findUnique({
      where: {
        id: memoId,
      },
    });

    // Check if memo exists
    if (!memo) {
      return NextResponse.json({ error: "Memo not found." }, { status: 404 });
    }

    // Check if the current user is the recipient of the memo
    if (memo.recipientId !== user.userId) {
      return NextResponse.json(
        { error: "You are not authorized to change the status of this memo." },
        { status: 403 }
      );
    }

    const recipientId = memo.recipientId;
    const senderId = memo.senderId;

    // Update memo status
    const updatedMemo = await prisma.memo.update({
      where: {
        id: memoId,
      },
      data: {
        status: status,
        declineReason
      },
    });

    const sender = await prisma.employees.findUnique({
      where: {
        id: senderId,
      },
    });

    const reciever = await prisma.employees.findUnique({
      where: {
        id: recipientId,
      },
    });

    const memoData = {
      title: updatedMemo.title,
      details: updatedMemo.details,
      createdAt : updatedMemo.createdAt,
      declineReason
    };

    const sendEmailSenderData = {
      senderEmail: sender.email,
      senderName: `${sender.fname} ${sender.lname}`,
      subject: `Memo Updated - ${memoData.title} ( ${new Date(
        memoData.createdAt
      ).toDateString()} @ ${new Date(
        memoData.createdAt
      ).toLocaleTimeString()} )`,
      status,
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      memoData,
    };

    const sendEmailRecieverData = {
      receiverEmail: reciever.email,
      receiverName: `${reciever.fname} ${reciever.lname}`,
      subject: `Memo Updated - ${memoData.title} ( ${new Date(
        memoData.createdAt
      ).toDateString()} @ ${new Date(
        memoData.createdAt
      ).toLocaleTimeString()} )`,
      status,
      user: "latifm8360@gmail.com",
      pass: "ziez xcek uckf uhyw",
      memoData,
    };

    // Send email to sender
    await fetch(`${process.env.MAIL_SERVER_URL}/send-memo-sender-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendEmailSenderData),
    });

    // Send email to reciever
    await fetch(`${process.env.MAIL_SERVER_URL}/send-memo-receiver-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendEmailRecieverData),
    });

    return NextResponse.json(
      { message: "Memo status updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating memo status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
