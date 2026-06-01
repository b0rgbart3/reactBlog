import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Settings } from '@/src/models/Settings';

export async function GET() {
  await connectDB();
  try {
    const settings = await Settings.find();
    const showMerch = settings.find((s) => s.name === 'showMerch');
    return NextResponse.json({ data: showMerch });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
