'use client';
import React, { useEffect, useCallback } from "react";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { useRouter } from "next/navigation";

export function ProductThumbnails({ grid = false, linkHeader = false }: { grid?: boolean, linkHeader?: boolean }) {
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
      <div className={`sticker${linkHeader ? ' sticker--link' : ''}`} onClick={linkHeader ? () => router.push('/products') : undefined}>Merch</div>
      <div className={grid ? 'productsGrid' : undefined}>
        {products.map((product, index) => (
          product.readyToPublish && (
            <div key={`product-thumb-${index}`} className='productBox' onClick={() => openProductPage(product._id)}>
              <div className='productBoxImage'>
                {product.thumbnail && (
                  <img src={`${product.thumbnail}`} alt={`${product.productName}`} />
                )}
              </div>
              <div className='productThumbnailDescriptionBox'>
                <div className="productThumbnailTitle">{product.productName}</div>
                <div className='productThumbnailDescriptionBoxText'>
                  {product.productDescription?.split(/\s+/).slice(0, 30).join(' ')}{product.productDescription?.split(/\s+/).length > 30 ? '…' : ''}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </>
  )
}
