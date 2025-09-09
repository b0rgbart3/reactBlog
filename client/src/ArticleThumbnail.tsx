import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "./state/useStore";



export type ArticleProps = {
  article: Article;
};

export function ArticleThumbnail({ article }: ArticleProps) {
  const navigate = useNavigate();


  const readArticle = useCallback(() => {
    navigate(`/article/${article._id}`);
  }, [navigate, article._id]);

  return (
    <div
      className="articleThumb"
      onClick={readArticle}
    >
      {article.title}
    </div>
  );
}
