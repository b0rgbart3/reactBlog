'use client';
import React from "react";
import { ArticleThumbnail } from "../../components/ArticleThumbnail";
import { useStore } from "../../state/useStore";

export function Articles() {
  const { articlesById } = useStore((s) => s);
  return (
    <>
      <div className="articleBlock">
        {Object.values(articlesById)
          .filter((a) => a.readyToPublish)
          .map((a) => (
            <React.Fragment key={a._id}>
              <ArticleThumbnail article={a} />
            </React.Fragment>
          ))}
      </div>
    </>
  );
}
