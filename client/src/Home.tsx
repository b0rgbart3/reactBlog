import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { DownloadJsonButton } from "./admin/Download";

import { AdminPanel } from "./admin/AdminPanel";
import { useNavigate } from "react-router-dom";
import { BannerNav } from "./components/banner-nav";
import "./homeStyle.css";
import { Articles } from "./pages/Articles/Articles";
import { Footer } from "./components/footer";

export interface Merch {
  productImagePath: string;
  productName: string;
}

export function Home() {
  const { refresh } = useData();
  const { user, articles, categories, loading, products, users, setUser } = useStore((s) => s);
  // console.log('BD: cats in home: ', categories);

  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const login = useCallback(() => {
    navigate('/login');
  }, []);



  const [page, setPage] = useState('home');

  const adminCallback = useCallback(() => {
    navigate('/admin');
  })

  const openProductPage = useCallback((productID) => {
    navigate(`/product/${productID}`);
  })


  if (loading) return <div>Loading…</div>;
  return (<div className='starfield'>
    
    <BannerNav
      adminCallback={adminCallback} page='home' />



    <div className="home">
      
      <div className="articleList">
        <Articles />
      </div>
      <div className='merchList'>
        Merch:


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

      </div>
    </div>

<Footer/>
  </div>
  );

}


