'use client';
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../state/useStore";
import { splitIntoLines } from "../utils/articleUtils";
import parse from "html-react-parser";

export type ArticleProps = {
  article: Article;
};

export function ArticleThumbnail({ article }: ArticleProps) {
  const router = useRouter();
  const [imgFailed, setImgFailed] = useState(false);
  const paragraphs = splitIntoLines(article.body);

  const readArticle = useCallback(() => {
    router.push(`/article/${article._id}`);
  }, [router, article._id]);

  const showImage = !imgFailed && article?.headlineImage && article.headlineImage !== '';

  const briefArticleStart = useMemo(() => {
    const combined = `${paragraphs?.[0] ?? ''}${paragraphs?.[1] ?? ''}${paragraphs?.[2] ?? ''}`;
    return combined.substring(0, 190) + ' ... ';
  }, [article, paragraphs])

  return (
    <div className="articleThumb" onClick={readArticle}>
      <div className='headlineImageThumbnail'>
        {showImage && (
          <img
            src={article.headlineImage}
            alt="article image"
            onError={() => setImgFailed(true)}
          />
        )}
        {!showImage && (
          <div className='noHeadlineImageContainer' style={{
            backgroundColor: article?.randomColor ? `#${article.randomColor}` : undefined,
          }}>
          </div>
        )}
      </div>
      <div className='articleThumbText'>
        {article.title}
        <div className='briefArticleStart'>{parse(briefArticleStart)}</div>
      </div>
    </div>
  );
}
