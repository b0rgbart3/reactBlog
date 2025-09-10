import React, { useEffect, useState, useCallback } from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";
import { Article, useStore } from "./state/useStore";
import { useData } from "./data/useData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DownloadJsonButton } from "./Download";
import { Articles } from "./pages/Articles";
import { AdminPanel } from "./AdminPanel";


export function Home() {

  const user = useStore((s) => s.user);
  const categories = useStore((s) => s.categories);
  const navigate = useNavigate();
  const [data, setData] = useState([])

  const { articles, loading, refresh, kill } = useData();

  useEffect(() => {
    refresh();
  }, []);

  const newArticle = useCallback(() => {
    navigate(`/article/new`);
  }, []);


  if (loading) return <div>Loading…</div>;

  return (
    <div className="home">
      <div className="mainMenu">
        <div className="title">b0rgBlog</div>
        <div className="welcome">Welcome, {user?.name}</div>
        <Articles />
      </div>

      <div className="newArticleButtonContainer">
        <div onClick={newArticle} className="newArticleButton">
          New Article
        </div>

        <div>
          <AdminPanel />
        </div>

        <div className="JsonData">
          <DownloadJsonButton articles={articles} />
        </div>
      </div>
    </div>
  );

}


