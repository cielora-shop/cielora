import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("cielora");
    const user = await db.collection("users").findOne({ email: session.user.email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't return password or sensitive fields
    const { password, ...safeUser } = user;
    
    return NextResponse.json(safeUser, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, phone, dob, gender } = await req.json();

    const client = await clientPromise;
    const db = client.db("cielora");
    
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (dob !== undefined) updateData.dob = dob;
    if (gender !== undefined) updateData.gender = gender;

    // We also update the 'name' field if firstName or lastName are provided, for NextAuth compatibility
    if (firstName !== undefined || lastName !== undefined) {
       const user = await db.collection("users").findOne({ email: session.user.email.toLowerCase() });
       const fName = firstName !== undefined ? firstName : (user?.firstName || "");
       const lName = lastName !== undefined ? lastName : (user?.lastName || "");
       updateData.name = `${fName} ${lName}`.trim();
    }

    const result = await db.collection("users").updateOne(
      { email: session.user.email.toLowerCase() },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
