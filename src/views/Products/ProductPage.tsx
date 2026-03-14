"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useData } from "../../data/useData";
import { Order, useStore } from "../../state/useStore";
import { BannerNav } from "../../components/banner-nav";
import { useClickOutside } from "../../hooks/useClickOutside";

export function ProductPage() {
  const { fetchProducts } = useData();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const { products, orders, setOrders, cartFlashCount, setCartFlashCount } =
    useStore((s) => s);
  const [chosenSize, setChosenSize] = useState("");
  const [count, setCount] = useState<number>(1);
  const [chooseSizeWarning, setChooseSizeWarning] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

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
  useClickOutside(warningRef, () => {
    setChooseSizeWarning(false);
  });

  const addToCart = useCallback(() => {
    if (chosenSize === "") {
      setChooseSizeWarning(true);
    } else {
      const newOrder = {
        _id: Date.now(),
        productID: product._id,
        quantity: count,
        chosenSize,
      } as Order;
      const newOrders = [...orders, newOrder];
      setOrders(newOrders);
      setCartFlashCount(cartFlashCount + 1);
      setAddedToCart(true);
    }
  }, [chosenSize, count, orders, cartFlashCount]);

  const productDetails = (
    <>
      Style #: G67000-3G3-S
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
    </>
  );

  const product = products.find((p) => p._id === id);
  const currentIndex = products.findIndex((p) => p._id === id);
  const prevProduct = currentIndex > 0 ? products[currentIndex - 1] : null;
  const nextProduct =
    currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <BannerNav page="product" />
      <div className="productPageLayout">
        <div className="pplChild pplChild-left">
          <div className="productBeauty">
            <div className="productBeautyImageWrap">
              <img src={`${product?.beauty}`} alt="headline" />
              <div className="productBeautyNav">
                <button
                  className={`productNavArrow productNavArrow--left${!prevProduct ? " productNavArrow--hidden" : ""}`}
                  onClick={() =>
                    prevProduct && router.push(`/product/${prevProduct._id}`)
                  }
                  aria-label="Previous product"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="21"
                    height="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="11 6 5 12 11 18" />
                  </svg>
                </button>
                <button
                  className={`productNavArrow productNavArrow--right${!nextProduct ? " productNavArrow--hidden" : ""}`}
                  onClick={() =>
                    nextProduct && router.push(`/product/${nextProduct._id}`)
                  }
                  aria-label="Next product"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="21"
                    height="21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="13 6 19 12 13 18" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="prodcutTitle">{product.productName}</div>
            <div className="productDescriptionBlock">
              {product.productDescription}
            </div>
          </div>
        </div>
        <div className="pplChild pplChild-right">
          <div
            className={`addToCartSection${addedToCart ? " addToCartSection--ghosted" : ""}`}
          >
            <div className="productPrice">
              ${(product.price / 100).toFixed(2)}
            </div>
            Choose your size:
            <div className="sizeBoxes">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
                <div
                  key={size}
                  className={`sizeBox ${chosenSize === size ? "active" : ""}`}
                  onClick={() => selectSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
            {chooseSizeWarning && (
              <div className="sizeWarning" ref={warningRef}>
                Please select a size option.
              </div>
            )}
            <div className="countSelection">
              <div className="counter" id="counter">
                Quantity:
                <div className="counterBoxContainer">
                  <div className="counterBox">{count}</div>
                  <button className="quantityButton" onClick={reduceQuantity}>
                    -
                  </button>
                  <button className="quantityButton" onClick={addQuantity}>
                    +
                  </button>
                </div>
                <button className="cartButton" onClick={addToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="counter">
            {addedToCart && (
              <button
                className="cartButton cartButton--nav"
                onClick={() => {
                  setChosenSize("");
                  setCount(1);
                  setAddedToCart(false);
                }}
              >
                Add a different size
              </button>
            )}
            <button
              className={`cartButton cartButton--nav${addedToCart ? " cartButton--pulse" : ""}`}
              onClick={() => router.push("/cart")}
            >
              Go to my Cart
            </button>
            <button
              className="cartButton cartButton--nav"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </button>
          </div>
          <div className="productDetails">
            <p>
              Please note: If you want to order multiple sizes, please just add
              a quantity of each size to your cart.
            </p>
            <p className="standout">
              Orders will take 1 - 3 weeks from purchase date to delivery.
            </p>
            {productDetails}
          </div>
        </div>
      </div>
    </>
  );
}
