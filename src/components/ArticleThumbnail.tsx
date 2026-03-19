'use client';
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Article } from "../state/useStore";
import { splitIntoLines } from "../utils/articleUtils";

export type ArticleProps = {
  article: Article;
  isHero?: boolean;
};

export function ArticleThumbnail({ article, isHero = false }: ArticleProps) {
  const router = useRouter();
  const [imgFailed, setImgFailed] = useState(false);
  const paragraphs = splitIntoLines(article.body);

  const readArticle = useCallback(() => {
    router.push(`/article/${article._id}`);
  }, [router, article._id]);

  const showImage = !imgFailed && article?.headlineImage && article.headlineImage !== '';

  const excerpt = useMemo(() => {
    if (article.summary) return article.summary;
    const combined = `${paragraphs?.[0] ?? ''}${paragraphs?.[1] ?? ''}${paragraphs?.[2] ?? ''}`;
    const stripped = combined.replace(/<[^>]+>/g, '');
    return stripped.substring(0, 190) + ' ...';
  }, [article.summary, paragraphs]);

  if (isHero) {
    return (
      <div className="articleThumb articleThumb--hero" onClick={readArticle}>
        <div className="heroImageContainer">
          {showImage && (
            <img
              src={article.headlineImage}
              alt="article image"
              onError={() => setImgFailed(true)}
            />
          )}
          {!showImage && (
            <div className="noHeadlineImageContainer" style={{
              backgroundColor: article?.randomColor ? `#${article.randomColor}` : undefined,
            }} />
          )}
          <div className="heroOverlay">
            {article.category && (
              <div className="articleCategory">{article.category}</div>
            )}
            <div className="heroTitle">{article.title}</div>
            {article.subtitle && (
              <div className="heroSubtitle">{article.subtitle}</div>
            )}
            <div className="heroExcerpt">{excerpt}</div>
            <div className="readMoreCta">Read →</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="articleThumb" onClick={readArticle}>
      <div className="headlineImageThumbnail">
        {showImage && (
          <img
            src={article.headlineImage}
            alt="article image"
            onError={() => setImgFailed(true)}
          />
        )}
        {!showImage && (
          <div className="noHeadlineImageContainer" style={{
            backgroundColor: article?.randomColor ? `#${article.randomColor}` : undefined,
          }} />
        )}
      </div>
      <div className="articleThumbText">
        {article.category && (
          <div className="articleCategory">{article.category}</div>
        )}
        <div className="articleThumbTitle">{article.title}</div>
        {article.subtitle && (
          <div className="articleThumbSubtitle">{article.subtitle}</div>
        )}
        <div className="briefArticleStart">{excerpt}</div>
        <div className="readMoreCta">Read →</div>
      </div>
    </div>
  );
}
