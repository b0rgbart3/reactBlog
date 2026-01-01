import React, { useEffect, useState, useCallback, useMemo } from "react";

import { useData } from "../../data/useData";
import { useStore } from "../../state/useStore";
import { useNavigate } from "react-router-dom";



export function ProductThumbnails() {
  const { refresh } = useData();
  const { user, articles, categories, loading, products, users, setUser, settings } = useStore((s) => s);
  const navigate = useNavigate();
    const openProductPage = useCallback((productID) => {
    navigate(`/product/${productID}`);
  })


return (
<>
      <div className='sticker'>Merch</div>

          {
            products.map((product, index) => {
              // console.log('BD: about to render product: ', product);
              return (
                <div key={`product-thumb-${index}`}>
                  {product.readyToPublish && (
                    <div className='productBox' onClick={() => openProductPage(product._id)}>
                      <div className='productBoxImage'>
                        {
                          product.thumbnail && (
                            <img src={`${product.thumbnail}`} alt={`${product.productName}`} />)}
                      </div>

                      <div className='productThumbnailDescriptionBox'>
                        <div className="productThumbnailTitle">
                          {product.productName}
                        </div>

                        <div className='productThumbnailDescriptionBoxText'>
                          {product.productDescription}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              )
            })}
</>
)
}
