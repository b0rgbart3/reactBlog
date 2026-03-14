'use client';
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { useRouter } from "next/navigation";
import { BannerNav } from "./components/banner-nav";
import { Articles } from "./views/Articles/Articles";
import { Footer } from "./components/footer";
import { ProductThumbnails } from "./views/Products/ProductThumbnails";
import { MemeThumbnails } from "./components/MemeThumbnails";

export function Home() {
  const { fetchArticles, fetchUsers, fetchSettings } = useData();
  const {
    user, articles, articlesLoaded, categories, products,
    usersLoaded, settingsLoaded, settings,
  } = useStore((s) => s);

  const router = useRouter();

  useEffect(() => {
    fetchArticles();
    fetchUsers();
    fetchSettings();
  }, [fetchArticles, fetchUsers, fetchSettings]);

  const isLocal = process.env.NEXT_PUBLIC_ENV === 'local';
  const showMerch = useMemo(() => {
    const settingName = isLocal ? 'showMerchLocal' : 'showMerch';
    return settings?.find((setting) => setting.name === settingName)?.booleanValue;
  }, [settings, isLocal]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!articlesLoaded || !usersLoaded || !settingsLoaded)
    return <div>Loading…</div>;

  return (
    <div className="starfield">
      <div className="siteWrapper">
        <BannerNav page="home" />
        <div className="home">
          <div className="mainColumn">
            {isMobile && showMerch && <ProductThumbnails linkHeader />}
            <div className="sticker">Articles</div>
            <Articles />
            {showMerch && (
              <>
                <div className="sticker">Memes</div>
                <div className="thumbnailMemes"><MemeThumbnails /></div>
              </>
            )}
          </div>
          <div className="sideColumn">
            {showMerch && !isMobile && <ProductThumbnails linkHeader />}
            {!showMerch && (
              <>
                <div className="sticker">Memes</div>
                <div className="thumbnailMemes"><MemeThumbnails /></div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
