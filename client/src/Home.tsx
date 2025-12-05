import React, { useEffect, useState, useCallback } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { DownloadJsonButton } from "./Download";
import { Articles } from "./pages/Articles";
import { AdminPanel } from "./admin/AdminPanel";
import { useNavigate } from "react-router-dom";
import { BannerNav } from "./components/banner-nav";
import "./homeStyle.css";

export interface Merch {
  productImagePath: string;
  productName: string;
}

export function Home() {
  const { user, articles, loading, products, users, setUser } = useStore((s) => s);
  const { refresh } = useData();
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


  if (loading) return <div>Loading…</div>;
  return (<>
    <BannerNav
      adminCallback={adminCallback} page='home' />

    <div className="home">
      <div className="articleList">
        <Articles />
      </div>
      <div className='merchList'>
        Merch:


        {
          products.map((product) => {
            return (
              <>
                <div className='productBox'>
                  {
                    product.mainImage && (
                      <img src={`${product.mainImage}`} alt={`${product.productName}`} />)}

                  <div>
                    {product.productName}
                  </div>

                  <div>
                    {product.productDescription}
                  </div>
                </div>
              </>

            )
          })}

      </div>
    </div>


  </>
  );

}


