'use client';
import React, { useEffect, useCallback } from "react";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { useRouter } from "next/navigation";

export function ProductThumbnails() {
  const { fetchProducts } = useData();
  const { products } = useStore((s) => s);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const openProductPage = useCallback((productID) => {
    router.push(`/product/${productID}`);
  }, [router]);

  return (
    <>
      <div className='sticker'>Merch</div>
      {products.map((product, index) => (
        <div key={`product-thumb-${index}`}>
          {product.readyToPublish && (
            <div className='productBox' onClick={() => openProductPage(product._id)}>
              <div className='productBoxImage'>
                {product.thumbnail && (
                  <img src={`${product.thumbnail}`} alt={`${product.productName}`} />
                )}
              </div>
              <div className='productThumbnailDescriptionBox'>
                <div className="productThumbnailTitle">{product.productName}</div>
                <div className='productThumbnailDescriptionBoxText'>{product.productDescription}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  )
}
