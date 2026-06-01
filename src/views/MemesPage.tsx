'use client';
import React, { useEffect, useState, useCallback } from "react";
import { BannerNav } from "../components/banner-nav";
import { ImageModal } from "../components/image-modal";
import { useData } from "../data/useData";
import { useStore } from "../state/useStore";

export function MemesPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { fetchMemes } = useData();
  const { memes } = useStore((s) => s);

  useEffect(() => {
    fetchMemes();
  }, []);

  const published = memes.filter((m) => m.readyToPublish && m.image);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (activeIndex === null) return;
    if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % published.length);
    if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + published.length) % published.length);
    if (e.key === "Escape") setActiveIndex(null);
  }, [activeIndex, published.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <>
      <div className="siteWrapper">
        <BannerNav page="memes" />
        <div className="basicContainer">
          <h1>Bitcoin related Memes</h1>
          <p>This are some of the memes that I've posted to X over the years.</p>
          <div className="memes">
            {published.map((m, i) => (
              <img
                key={m._id}
                src={m.image}
                alt={m.title || "meme"}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
          {activeIndex !== null && (
            <ImageModal
              src={published[activeIndex].image}
              onClose={() => setActiveIndex(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
