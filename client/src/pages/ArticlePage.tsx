import React from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../state/useStore";
import "./articleStyle.css";


// import { articles } from "./Home";


export function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  console.log('BD: looking for: ', id);
      const articles = useStore((s) => s.articles);
  const article = articles.find((article) => article.id === id);
  console.log('BD: aritcle: ', article);




  return (
    <div className={'article'}>
      <h1>{article?.title }</h1>
      <p>{article?.body}</p>
    </div>
  );
}
