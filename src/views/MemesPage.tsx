'use client';
import React, { useState } from "react";
import { BannerNav } from "../components/banner-nav";
import orangePill from "../assets/memes/orange_pill.jpeg";
import fortune from "../assets/memes/fortune_favors.jpg";
import elementzero from "../assets/memes/element_zero.jpg";
import buymore from "../assets/memes/buy_more.jpg";
import keepcalm from "../assets/memes/keep_calm.jpg";
import unstoppable from "../assets/memes/unstoppable.jpg";
import rigged from "../assets/memes/rigged.jpg";
import { ImageModal } from "../components/image-modal";

export function MemesPage() {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const src = (img) => img.src ?? img;

  return (
    <>
      <div className="siteWrapper">
        <BannerNav page="memes" />
        <div className="basicContainer">
          <h1>Bitcoin related Memes</h1>
          <p>This are some of the memes that I've posted to X over the years.</p>
          <div className="memes">
            <img src={src(orangePill)} onClick={() => setActiveImage(src(orangePill))} />
            <img src={src(rigged)} onClick={() => setActiveImage(src(rigged))} />
            <img src={src(elementzero)} onClick={() => setActiveImage(src(elementzero))} />
            <img src={src(buymore)} onClick={() => setActiveImage(src(buymore))} />
            <img src={src(keepcalm)} onClick={() => setActiveImage(src(keepcalm))} />
            <img src={src(fortune)} onClick={() => setActiveImage(src(fortune))} />
            <img src={src(unstoppable)} onClick={() => setActiveImage(src(unstoppable))} />
          </div>
          {activeImage && <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />}
        </div>
      </div>
    </>
  );
}
