import React, { useEffect, useState, useCallback } from "react";

import { all } from "axios";
import { ArticleThumbnail } from "../../ArticleThumbnail";
import { useStore } from "../../state/useStore";

export function Articles() {
  const articles = useStore((s) => s.articles);
  return (
    <>
      <div className="articleBlock">
        {articles
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
