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
  const { fetchArticles, fetchUsers } = useData();
  const {
    user,
    articles,
    articlesLoading,
    categories,
    products,
    users,
    setUser,
    usersLoading,
    settings,
  } = useStore((s) => s);
  // console.log('BD: cats in home: ', categories);

  const navigate = useNavigate();

  useEffect(() => {
    if (!articles.length && !articlesLoading) {
      console.log("BD: about to fetch articles.");
      fetchArticles();
    }
  }, [articles.length, articlesLoading, fetchArticles]);

  useEffect(() => {
    if (!users.length && !usersLoading) {
      console.log("BD: about to fetch users.");
      fetchUsers();
    }
  }, [fetchUsers, users.length, usersLoading]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const login = useCallback(() => {
    navigate("/login");
  }, []);

  const showMerch = useMemo(() => {
    // console.log('BD: in homepage, settings: ', settings);
    const displayMerchSetting = settings?.find(
      (setting) => setting.name === "showMerch",
    );
    // console.log('BD: displayMerchSetting: ', displayMerchSetting?.booleanValue);

    return displayMerchSetting?.booleanValue;
  }, [settings]);

  const [page, setPage] = useState("home");

  const adminCallback = useCallback(() => {
    navigate("/admin");
  });

  if (articlesLoading || usersLoading) return <div>Loading…</div>;
  return (
    <div className="starfield">
      <BannerNav page="home" />

      <div className="home">
        <div className="articleList">
          <div className="sticker">Articles</div>
          <Articles />
        </div>
        <div className="merchList">
          {showMerch && (
            <>
              {" "}
              <ProductThumbnails />{" "}
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
  );
}
