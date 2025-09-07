import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "./state/useStore";



export type ArticleProps = {
  article: Article;
  key: number;
};

export function ArticleThumbnail({ article, key }: ArticleProps) {
  const navigate = useNavigate();

  const readArticle = useCallback(() => {
    navigate(`/article/${article.id}`);
  }, [navigate, article.id]);

  return (
    <div
      className="articleThumb"
      onClick={readArticle}
      key={key}
    >
      {article.title}
    </div>
  );
}
