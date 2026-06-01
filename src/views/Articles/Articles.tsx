'use client';
import React, { useEffect, useMemo } from "react";
import { ArticleThumbnail } from "../../components/ArticleThumbnail";
import { useStore } from "../../state/useStore";
import { useData } from "../../data/useData";

export function Articles() {
  const { articlesById } = useStore((s) => s);
  const { fetchArticles } = useData();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const shuffledArticles = useMemo(() => {
    const published = Object.values(articlesById).filter((a) => a.readyToPublish);
    for (let i = published.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [published[i], published[j]] = [published[j], published[i]];
    }
    return published;
  }, [articlesById]);

  return (
    <>
      <div className="articleBlock">
        {shuffledArticles.map((a, index) => (
          <React.Fragment key={a._id}>
            <ArticleThumbnail article={a} isHero={index === 0} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
