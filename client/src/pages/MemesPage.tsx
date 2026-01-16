import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  return (
    <>
      <BannerNav page="memes" />
      <div className="basicContainer">
        <h1>Bitcoin related Memes</h1>
        <p>This are some of the memes that I've posted to X over the years.</p>

        <div className="memes">
          <img src={orangePill} onClick={() => setActiveImage(orangePill)} />
          <img src={rigged} onClick={() => setActiveImage(rigged)} />
          <img src={elementzero} onClick={() => setActiveImage(elementzero)} />
          <img src={buymore} onClick={() => setActiveImage(buymore)} />
          <img src={keepcalm} onClick={() => setActiveImage(keepcalm)} />
          <img src={fortune} onClick={() => setActiveImage(fortune)} />
          <img src={unstoppable} onClick={() => setActiveImage(unstoppable)} />
        </div>

        {activeImage && (
          <ImageModal src={activeImage} onClose={() => setActiveImage(null)} />
        )}
      </div>
    </>
  );
}
