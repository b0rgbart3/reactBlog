import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/src/lib/mongodb';
import { PlacedOrders } from '@/src/models/PlacedOrders';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing stripe signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Stripe webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await connectDB();
    const cd = session.customer_details;
    const shippingDetails = (session as any).shipping_details;
    const addressSource = shippingDetails?.address?.line1 ? shippingDetails.address : null;
    const address = addressSource ?? (cd?.address?.line1 ? cd.address : null);
    const updateFields: any = {
      status: 'paid',
      customerEmail: cd?.email ?? '',
      customerName: cd?.name ?? '',
      amountTotal: session.amount_total ?? 0,
    };
    if (address) {
      updateFields.shippingAddress = {
        name: shippingDetails?.name ?? cd?.name ?? '',
        line1: address.line1 ?? '',
        line2: address.line2 ?? '',
        city: address.city ?? '',
        state: address.state ?? '',
        postalCode: address.postal_code ?? '',
        country: address.country ?? '',
      };
    }
    await PlacedOrders.findOneAndUpdate(
      { stripeSessionId: session.id },
      { $set: updateFields }
    );
  }

  return NextResponse.json({ received: true });
}
