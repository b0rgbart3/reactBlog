'use client';
import React, { useCallback, useState } from "react";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";

export function ShoppingCart() {
  useData();
  const { products, orders, setOrders } = useStore((s) => s);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const removeOrder = useCallback((itemToRemove) => {
    const newOrderSet = orders.filter((order) => order._id !== itemToRemove);
    setOrders(newOrderSet);
  }, [orders]);

  const proceedToCheckout = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, [orders]);

  return (
    <>
      <BannerNav page='product' />
      <div className='basicBox'>
        <div><h1>Your Shopping Cart:</h1></div>
        Orders: {orders.length}
        <div className='ordersContainer'>
          {orders.map((order) => {
            const associatedProduct = products.find((p) => p._id === order.productID);
            return (
              <div className='orderBox' key={order._id}>
                Order:
                <div className='orderProductImg'><img src={associatedProduct?.beauty} /></div>
                <div>Product: {associatedProduct?.productName}</div>
                <div>Quantity: {order.quantity}</div>
                <div>Size: {order.chosenSize}</div>
                <div className='removeOrder' onClick={() => removeOrder(order._id)}>Remove this order</div>
              </div>
            )
          })}
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button onClick={proceedToCheckout} disabled={loading}>
          {loading ? 'Redirecting...' : 'Proceed To Checkout'}
        </button>
      </div>
    </>
  )
}
