'use client';
import React from "react";
import { BannerNav } from "../../components/banner-nav";
import { ProductThumbnails } from "./ProductThumbnails";
import { Footer } from "../../components/footer";

export function ProductsPage() {
  return (
    <div className="starfield">
      <div className="siteWrapper">
        <BannerNav page="products" />
        <div className="basicContainer">
          <ProductThumbnails grid />
        </div>
        <Footer />
      </div>
    </div>
  );
}
