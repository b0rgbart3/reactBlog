import React, { useEffect, useState, useCallback } from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";
import { Article, useStore } from "./state/useStore";
import { useData } from "./data/useData";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DownloadJsonButton } from "./Download";


export function Home() {

  const user = useStore((s) => s.user);
  const categories = useStore((s) => s.categories);
  // const articles = useStore((s) => s.articles);
  const navigate = useNavigate();
  const [data, setData] = useState([])

  const { articles, loading, refresh, kill } = useData();
  // const DB_Data = toJSON(articles;

  useEffect(() => {
    refresh();
  },[]);

  const newArticle = useCallback(() => {
    navigate(`/article/new`);
  }, []);

  const editArticle = useCallback((article: Article) => {
  navigate(`/article/edit/${article._id}`);
  },[]);

  const killArticle = useCallback((article: Article) => {
     const confirmDelete = 
       window.confirm(`Are you sure you want to delete this article, 
        titled: ${article.title} ?
        \nIt will be complete deleted from the database, and cannot be restored.`);
  if (!confirmDelete) return; // cancel if user clicks "Cancel"

      console.log('About to kill: ', article._id);
      kill(article._id);
          refresh();
  },[]);




  if (loading) return <div>Loading…</div>;

  return (
    <div className="home">
      <div className="mainMenu">
        <div className="title">b0rgBlog</div>
        <div className="welcome">Welcome, {user?.name}</div>

        {categories?.map((category, categoryIndex) => (
          <div key={`category-${category}-${categoryIndex}`}>
            <div>{category}</div>
            <div>
              {articles
                ?.filter((a) => a.category === category)
                .map((a) => (
                  <React.Fragment key={a._id} >
                    <ArticleThumbnail article={a} />
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="newArticleButtonContainer">
        <div onClick={newArticle} className="newArticleButton">
          New Article
        </div>

        <div>
            {categories?.map((category, categoryIndex) => (
          <div key={`category-${category}-${categoryIndex}`}>
            <div className="killCategory">{category}</div>
            <div>
              {articles
                ?.filter((a) => a.category === category)
                .map((a) => (
                  <React.Fragment key={a._id} >
                    <div className="killItem">
                      <div className="killTitle" onClick={()=>editArticle(a)}>{a.title} </div>
           
                      <div className="killButton" onClick={()=>killArticle(a)}>X</div>
                              
                    </div>
        
                  </React.Fragment>
                ))}
            </div>
          </div>
        ))}
        </div>

        <div className="JsonData">
             <DownloadJsonButton articles={articles} />
        </div>
      </div>
    </div>
  );

}


