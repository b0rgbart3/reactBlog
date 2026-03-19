'use client';
import React from "react";
import { BannerNav } from "../../components/banner-nav";
import { Articles } from "./Articles";
import { Footer } from "../../components/footer";

export function ArticlesPage() {
  return (
    <div className="starfield">
      <div className="siteWrapper">
        <BannerNav page="articles" />
        <div className="basicContainer">
          <Articles />
        </div>
        <Footer />
      </div>
    </div>
  );
}
