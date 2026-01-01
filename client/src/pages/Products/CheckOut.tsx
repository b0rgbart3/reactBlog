import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../data/useData";
import { Order, useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import { formToJSON } from "axios";
import { useClickOutside } from "../../hooks/useClickOutside";

export function CheckOut() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, products, users, setUser, orders, setOrders } = useStore((s) => s);

  const removeOrder = useCallback((itemToRemove) => {
    console.log('Remove: ', itemToRemove);
    const newOrderSet = orders.filter((order) => order._id !== itemToRemove );
    setOrders(newOrderSet);
  }, orders);

      const completePurchase = useCallback(() => {
        navigate('/check-out');
      }, []);

  return (
    <>

      <BannerNav page='product' />
      <div className='basicBox'>

        <div>Complete your Purchase:</div>
        Orders: {orders.length}


        <div className='ordersContainer'>
          {orders.map((order) => {
            const associatedProduct = products.find((product) => product._id === order.productID);

            return (
              <div className='orderBox'>

                Order:
                <div className='orderProductImg'><img src={associatedProduct.beauty}/></div>
                <div>Product: {associatedProduct.productName}</div>
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