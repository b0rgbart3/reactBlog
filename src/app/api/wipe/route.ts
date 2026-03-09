import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    await mongoose.connection.dropDatabase();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
