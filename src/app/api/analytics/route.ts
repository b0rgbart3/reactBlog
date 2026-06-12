import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { AnalyticsEvent } from '@/src/models/AnalyticsEvent';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENV === 'local') {
    return NextResponse.json({ ok: true });
  }

  const body = await request.json();
  const { event, productId, productName } = body;

  if (!event) {
    return NextResponse.json({ error: 'Missing event' }, { status: 400 });
  }

  try {
    await connectDB();
    await AnalyticsEvent.create({ event, productId, productName });
  } catch {
    // Silently swallow — analytics must never break the shop
  }

  return NextResponse.json({ ok: true });
}
