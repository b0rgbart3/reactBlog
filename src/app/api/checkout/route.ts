import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectDB } from '@/src/lib/mongodb';
import { Products } from '@/src/models/Products';
import { PlacedOrders } from '@/src/models/PlacedOrders';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { orders } = await request.json();

    if (!orders || orders.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItems: { productID: string; productName: string; quantity: number; chosenSize: string; unitAmount: number }[] = [];

    for (const order of orders) {
      const product = await Products.findById(order.productID);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${order.productID}` }, { status: 404 });
      }

      const imageUrl = product.beauty
        ? `${baseUrl}${product.beauty}`
        : undefined;

      lineItems.push({
        quantity: order.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: product.price ?? 0,
          product_data: {
            name: `${product.productName} — Size: ${order.chosenSize}`,
            ...(imageUrl ? { images: [imageUrl] } : {}),
          },
        },
      });

      orderItems.push({
        productID: order.productID,
        productName: product.productName,
        quantity: order.quantity,
        chosenSize: order.chosenSize,
        unitAmount: product.price ?? 0,
      });
    }

    console.log('Creating Stripe session WITH shipping_address_collection');
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      success_url: `${baseUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
    });

    await PlacedOrders.create({
      stripeSessionId: session.id,
      status: 'pending',
      items: orderItems,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
