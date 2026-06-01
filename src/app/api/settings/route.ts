import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function GET() {
  await connectDB();
  try {
    const settings = await Settings.find();
    return NextResponse.json({ data: settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
