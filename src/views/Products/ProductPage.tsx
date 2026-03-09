'use client';
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { useData } from "../../data/useData";
import { Order, useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import { useClickOutside } from "../../hooks/useClickOutside";

export function ProductPage() {
  useData();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { products, orders, setOrders } = useStore((s) => s);
  const [chosenSize, setChosenSize] = useState('');
  const [count, setCount] = useState<number>(1);
  const [chooseSizeWarning, setChooseSizeWarning] = useState(false);

  const addQuantity = useCallback(() => {
    if (count <= 19) setCount(count + 1);
  }, [count]);

  const reduceQuantity = useCallback(() => {
    if (count >= 1) setCount(count - 1);
  }, [count]);

  const selectSize = useCallback((size: string) => {
    setChosenSize(size);
  }, []);

  const warningRef = useRef<HTMLDivElement>(null);
  useClickOutside(warningRef, () => { setChooseSizeWarning(false); });

  const addToCart = useCallback(() => {
    if (chosenSize === '') {
      setChooseSizeWarning(true);
    } else {
      const newOrder = { _id: orders.length + 1, productID: product._id, quantity: count, chosenSize } as Order;
      const newOrders = [...orders, newOrder];
      setOrders(newOrders);
    }
  }, [chosenSize, count, orders]);

  const productDetails = (<>Style #: G67000-3G3-S
    <p>Material</p>
    <ul>
      <li>60% ring spun cotton | 40% polyester</li>
      <li>5.5 Oz/SqYd, 50% U.S. cotton/50% polyester</li>
      <li>Classic fit for loose comfort</li>
      <li>Cotton-soft moisture wicking fabric for active lifestyles</li>
      <li>Stay-dry comfort and coolness</li>
      <li>Taped neck and shoulders for comfort and durability</li>
      <li>Non-topstitched, classic width, rib collar</li>
      <li>Tear away label for customizable comfort</li>
    </ul>
  </>);

  const product = products.find((p) => p._id === id);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <BannerNav page='product' />
      <div className='productPageLayout'>
        <div className='pplChild pplChild-left'>
          <div className='productBeauty'>
            <img src={`${product?.beauty}`} alt="headline" />
            <div className='prodcutTitle'>{product.productName}</div>
            <div className='productDescriptionBlock'>{product.productDescription}</div>
          </div>
        </div>
        <div className='pplChild pplChild-right'>
          Choose your size:
          <div className='sizeBoxes'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <div key={size} className={`sizeBox ${chosenSize === size ? 'active' : ''}`} onClick={() => selectSize(size)}>{size}</div>
            ))}
          </div>
          {chooseSizeWarning && (
            <div className='sizeWarning' ref={warningRef}>Please select a size option.</div>
          )}
          <div className='countSelection'>
            <div className='counter' id='counter'>
              Quantity:
              <div className='counterBoxContainer'>
                <div className='counterBox'>{count}</div>
                <button className='quantityButton' onClick={reduceQuantity}>-</button>
                <button className='quantityButton' onClick={addQuantity}>+</button>
              </div>
              <button className='cartButton' onClick={addToCart}>Add to Cart</button>
            </div>
          </div>
          <div className='productDetails'>
            <p>Please note: If you want to order multiple sizes, please just add a quantity of each size to your cart.</p>
            {productDetails}
          </div>
        </div>
      </div>
    </>
  )
}
