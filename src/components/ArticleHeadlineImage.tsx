'use client';
import React, { useState } from 'react';

type Props = {
  src: string;
  randomColor?: string;
};

export function ArticleHeadlineImage({ src, randomColor }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <div className="headlineImageContainer">
        <img
          src={src}
          alt="headline"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="noHeadlineImageContainer"
      style={randomColor ? ({ '--article-color': `#${randomColor}` } as React.CSSProperties) : undefined}
    ></div>
  );
}
