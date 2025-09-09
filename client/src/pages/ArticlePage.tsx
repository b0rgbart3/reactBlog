import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../state/useStore";
import "./articleStyle.css";
import { useData } from "../data/useData";


export function ArticlePage() {

  useData();
  const { id } = useParams<{ id: string }>();
  const articles = useStore((s) => s.articles);
  console.log('BD: looking for: ', id);
  console.log('bD: articles: ', articles);
  const article = articles.find((article) => article._id === id);
  const navigate = useNavigate();

  const routeHome= useCallback(() => {
    navigate(`/`);
  },[]);
  
  return (
    <div className={'article'}>
      <div className="articlePageCategory" onClick={routeHome}>{`<- `}b0rgBlog :: {article?.category}</div>
      <div className='articlePageTitle'>{article?.title }</div>
      <p>{article?.body}</p>
    </div>
  );
}
