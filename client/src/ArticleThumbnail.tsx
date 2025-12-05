import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Article } from "./state/useStore";
import { splitIntoLines } from "./pages/Articles/ArticlePage";
import parse from "html-react-parser";


export type ArticleProps = {
  article: Article;
};

export function ArticleThumbnail({ article }: ArticleProps) {
  const navigate = useNavigate();
    const paragraphs = splitIntoLines(article.body);

  const readArticle = useCallback(() => {
    navigate(`/article/${article._id}`);
  }, [navigate, article._id]);

  const hasHeadlineImage = useMemo(() => {
    return article?.headlineImage && article.headlineImage !== '';
  }, []);

  const briefArticleStart = useMemo(() => {
    return `${paragraphs?.[0]}${paragraphs?.[1]}`.substring(0,190) + ' ... ';
  }, [article, paragraphs])



  return (
    <div
      className="articleThumb"
      onClick={readArticle}
    >
      <div className='headlineImageThumbnail'>
        {article?.headlineImage && article?.headlineImage !== '' && (
          <img src={`${article?.headlineImage}`} alt="article image" />
        )}

        {
  !hasHeadlineImage && (
    <div className='noHeadlineImageContainer'       style={{

            backgroundColor: article?.randomColor ? `#${article.randomColor}` : undefined,
      
        }}>
 
      </div>
  )
}

      </div>
      {article.title}
      <div className='briefArticleStart'>      {parse(briefArticleStart)}</div>

    </div>
  );
}
