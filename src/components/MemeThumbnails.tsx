'use client';
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "../data/useData";
import { useStore } from "../state/useStore";

export function MemeThumbnails() {
  const router = useRouter();
  const { fetchMemes } = useData();
  const { memes } = useStore((s) => s);

  useEffect(() => {
    fetchMemes();
  }, []);

  const goToMemesPage = useCallback(() => {
    router.push("/memes");
  }, [router]);

  const published = memes.filter((m) => m.readyToPublish && m.image);

  return (
    <>
      {published.map((m) => (
        <div key={m._id} className="memeThumb">
          <img src={m.image} alt={m.title || "meme"} onClick={goToMemesPage} />
        </div>
      ))}
    </>
  );
}
