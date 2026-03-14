import { NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/mongodb';
import { PlacedOrders } from '@/src/models/PlacedOrders';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectDB();
  try {
    const orders = await PlacedOrders.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: orders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await connectDB();
  try {
    const { id, sentToPrinter, sentToCustomer } = await request.json();
    const update: Record<string, boolean> = {};
    if (sentToPrinter !== undefined) update.sentToPrinter = sentToPrinter;
    if (sentToCustomer !== undefined) update.sentToCustomer = sentToCustomer;
    const order = await PlacedOrders.findByIdAndUpdate(id, update, { new: true }).lean();
    return NextResponse.json({ data: order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await connectDB();
  try {
    const { id } = await request.json();
    await PlacedOrders.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
