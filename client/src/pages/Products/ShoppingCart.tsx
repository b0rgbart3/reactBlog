import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../data/useData";
import { Order, useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import { formToJSON } from "axios";
import { useClickOutside } from "../../hooks/useClickOutside";

export function ShoppingCart() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, products, users, setUser, orders, setOrders } = useStore((s) => s);

  return (
    <>

      <BannerNav page='product' />
      <div className='basicBox'>

        <div>Your Shopping Cart:</div>
        {orders.length}


        <div className='ordersContainer'>
          {orders.map((order) => {
            return (
              <div className='orderBox'>

                Order: {order.quantity}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )


}