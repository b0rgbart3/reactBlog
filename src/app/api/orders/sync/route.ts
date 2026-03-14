import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/src/lib/mongodb';
import { PlacedOrders } from '@/src/models/PlacedOrders';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err: any) {
    console.error('Stripe session retrieve failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ status: 'unpaid', payment_status: session.payment_status });
  }

  await connectDB();
  const cd = session.customer_details;
  const shippingDetails = session.shipping_details ?? (session as any).shipping ?? null;
  const addressSource = shippingDetails?.address?.line1 ? shippingDetails : null;
  const fallbackAddress = cd?.address?.line1 ? cd : null;
  const addr = addressSource ?? fallbackAddress;

  const updateFields: any = {
    status: 'paid',
    customerEmail: cd?.email ?? '',
    customerName: cd?.name ?? '',
    amountTotal: session.amount_total ?? 0,
  };

  if (addr) {
    const address = addr === shippingDetails ? shippingDetails.address : cd?.address;
    updateFields.shippingAddress = {
      name: shippingDetails?.name ?? cd?.name ?? '',
      line1: address?.line1 ?? '',
      line2: address?.line2 ?? '',
      city: address?.city ?? '',
      state: address?.state ?? '',
      postalCode: address?.postal_code ?? '',
      country: address?.country ?? '',
    };
  }

  const result = await PlacedOrders.findOneAndUpdate(
    { stripeSessionId: sessionId },
    { $set: updateFields }
  );

  console.log('Order sync result:', result ? 'updated' : 'NOT FOUND', '| sessionId:', sessionId);
  return NextResponse.json({ status: result ? 'synced' : 'order_not_found' });
}
