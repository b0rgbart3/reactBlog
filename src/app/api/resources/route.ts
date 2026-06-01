import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Resources } from '@/src/models/Resources';

export async function GET() {
  await connectDB();
  const all = await Resources.find();
  return NextResponse.json({ data: all });
}

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const doc = new Resources(body);
    await doc.save();
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
