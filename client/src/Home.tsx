import React, { useEffect, useState, useCallback } from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";
import { useStore } from "./state/useStore";
import { useData } from "./data/useData";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function Home() {

  const user = useStore((s) => s.user);
  const categories = useStore((s) => s.categories);
  const articles = useStore((s) => s.articles);
  const navigate = useNavigate();
  const [data, setData] = useState([])

  useData();


  const newArticle = useCallback(() => {
    navigate(`/article/new`);
  }, []);

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
                  <React.Fragment key={a.id} >
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
      </div>
    </div>
  );

}


