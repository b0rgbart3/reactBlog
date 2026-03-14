'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useStore } from '../../state/useStore';
import { useSearchParams } from 'next/navigation';

export default function OrderSuccessPage() {
  const { setOrders } = useStore((s) => s);
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');

  useEffect(() => {
    setOrders([]);
    if (session_id) {
      fetch('/api/orders/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session_id }),
      })
        .then((r) => r.json())
        .then((data) => console.log('Order sync:', data))
        .catch((err) => console.error('Order sync failed:', err));
    }
  }, []);

  return (
    <div className='basicBox'>
      <h1>Order Confirmed!</h1>
      <p>Thank you for your purchase. Your order has been received and is being processed.</p>
      {session_id && (
        <p style={{ fontSize: '0.85em', opacity: 0.6 }}>Reference: {session_id}</p>
      )}
      <Link href='/'>Back to Home</Link>
    </div>
  );
}
