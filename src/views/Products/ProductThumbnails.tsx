'use client';
import React, { useEffect, useCallback } from "react";
import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { useRouter } from "next/navigation";

export function ProductThumbnails({ grid = false, linkHeader = false, limit }: { grid?: boolean, linkHeader?: boolean, limit?: number }) {
  const { fetchProducts } = useData();
  const { products } = useStore((s) => s);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const openProductPage = useCallback((productID) => {
    router.push(`/product/${productID}`);
  }, [router]);

  const publishedProducts = products.filter((p) => p.readyToPublish);
  const visibleProducts = limit ? publishedProducts.slice(0, limit) : publishedProducts;
  const hasMore = limit && publishedProducts.length > limit;

  return (
    <>
      <div className={`sticker${linkHeader ? ' sticker--link' : ''}`} onClick={linkHeader ? () => router.push('/products') : undefined}>Merch</div>
      <div className={grid ? 'productsGrid' : undefined}>
        {visibleProducts.map((product, index) => (
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
        ))}
      </div>
      {hasMore && (
        <div className='moreProductsWrap'>
          <button className='moreProductsBtn' onClick={() => router.push('/products')}>More Products</button>
        </div>
      )}
    </>
  )
}
