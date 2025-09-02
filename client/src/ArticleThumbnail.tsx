import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type Article = {
  id: number;
  title: string;
  body: string;
};

export type ArticleProps = {
  article: Article;
};

export function ArticleThumbnail({ article }: ArticleProps) {
  const navigate = useNavigate();

  const readArticle = useCallback(() => {
    navigate(`/article/${article.id}`);
  }, [navigate, article.id]);

  return (
    <div
      className="articleThumb"
      onClick={readArticle}
    >
      {article.title}
    </div>
  );
}
