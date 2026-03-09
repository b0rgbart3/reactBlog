'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";

export function CheckOut() {
  useData();
  const { products, orders, setOrders } = useStore((s) => s);
  const router = useRouter();

  const removeOrder = useCallback((itemToRemove) => {
    const newOrderSet = orders.filter((order) => order._id !== itemToRemove);
    setOrders(newOrderSet);
  }, [orders]);

  const completePurchase = useCallback(() => {
    // TODO: implement actual purchase completion
    router.push('/');
  }, [router]);

  return (
    <>
      <BannerNav page='product' />
      <div className='basicBox'>
        <div>Complete your Purchase:</div>
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
              </div>
            )
          })}
        </div>
        <button onClick={completePurchase}>Complete my Purchase</button>
      </div>
    </>
  )
}
