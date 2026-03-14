'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useStore } from '../../state/useStore';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const { setOrders } = useStore((s) => s);
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setOrders([]);
    if (session_id) {
      fetch('/api/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session_id }),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log('Order sync:', data);
          if (data.order) setOrder(data.order);
        })
        .catch((err) => console.error('Order sync failed:', err));
    }
  }, []);

  return (
    <div className='basicBox'>
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase. Your order has been received and is being processed.</p>

      {order && (
        <div className='orderDetails'>
          {order.items?.length > 0 && (
            <div className='orderItems'>
              <h3>Items</h3>
              {order.items.map((item, i) => (
                <div key={i} className='orderItem'>
                  <span>{item.productName}</span>
                  {item.chosenSize && <span> — {item.chosenSize}</span>}
                  <span> × {item.quantity}</span>
                  <span style={{ float: 'right' }}>
                    ${((item.unitAmount * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className='orderTotal'>
            <strong>Total: ${(order.amountTotal / 100).toFixed(2)}</strong>
          </div>

          {order.shippingAddress?.line1 && (
            <div className='orderShipping'>
              <h3>Shipping to</h3>
              <p>
                {order.shippingAddress.name}<br />
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          {order.customerEmail && (
            <p style={{ fontSize: '0.85em', opacity: 0.7 }}>
              A confirmation will be sent to {order.customerEmail}
            </p>
          )}
        </div>
      )}

      <Link href='/'>Back to Home</Link>
    </div>
  );
}
