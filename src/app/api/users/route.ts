import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Users } from '@/src/models/Users';
import bcrypt from 'bcrypt';

export async function GET() {
  await connectDB();
  try {
    const all = await Users.find();
    return NextResponse.json({ data: all });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const newUser = await request.json();
    const newHash = await bcrypt.hash("mypassword", 10);
    newUser.phash = newHash;
    const doc = new Users(newUser);
    await doc.save();
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
