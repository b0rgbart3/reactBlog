import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import { DownloadJsonButton } from "./admin/Download";

import { AdminPanel } from "./admin/AdminPanel";
import { useNavigate } from "react-router-dom";
import { BannerNav } from "./components/banner-nav";

import { Articles } from "./pages/Articles/Articles";
import { Footer } from "./components/footer";
import { ProductThumbnails } from "./pages/Products/ProductThumbnails";
import { MemesPage } from "./pages/MemesPage";
import { MemeThumbnails } from "./components/MemeThumbnails";

export interface Merch {
  productImagePath: string;
  productName: string;
}

export function Home() {
  const { fetchArticles, fetchUsers, fetchSettings } = useData();
  const {
    user,
    articles,
    articlesLoaded,
    categories,
    products,
    users,
    setUser,
    usersLoaded,
    settingsLoaded,
    settings,
  } = useStore((s) => s);

  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
    fetchUsers();
    fetchSettings();
  }, [fetchArticles, fetchUsers, fetchSettings]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const login = useCallback(() => {
    navigate("/login");
  }, []);

  const showMerch = useMemo(() => {
    const displayMerchSetting = settings?.find(
      (setting) => setting.name === "showMerch",
    );

    return displayMerchSetting?.booleanValue;
  }, [settings]);

  const [page, setPage] = useState("home");

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const adminCallback = useCallback(() => {
    navigate("/admin");
  });

  if (!articlesLoaded || !usersLoaded || !settingsLoaded)
    return <div>Loading…</div>;
  console.log("HOME articles length:", articles.length);

  return (
    <div className="starfield">
      <div className="siteWrapper">
        <BannerNav page="home" />

        <div className="home">
          <div className="mainColumn">
            {isMobile && showMerch && (
              <>
                <ProductThumbnails />
              </>
            )}
            <div className="sticker">Articles</div>
            <Articles />
            {showMerch && (
              <>
                <div className="sticker">Memes</div>
                <div className="thumbnailMemes">
                  <MemeThumbnails />
                </div>
              </>
            )}
          </div>
          <div className="sideColumn">
            {showMerch && !isMobile && (
              <>
                <ProductThumbnails />
              </>
            )}
            {!showMerch && (
              <>
                <div className="sticker">Memes</div>
                <div className="thumbnailMemes">
                  <MemeThumbnails />
                </div>
              </>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
