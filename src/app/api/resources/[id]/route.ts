import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { Resources } from '@/src/models/Resources';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await Resources.findByIdAndUpdate(id, body, { new: true });
    if (!updated)
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const deleted = await Resources.findByIdAndDelete(id);
    if (!deleted)
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    return NextResponse.json({ success: true, deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
