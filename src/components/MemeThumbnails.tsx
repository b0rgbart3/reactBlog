'use client';
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import orangePill from "../assets/memes/orange_pill.jpeg";
import fortune from "../assets/memes/fortune_favors.jpg";
import elementzero from "../assets/memes/element_zero.jpg";
import buymore from "../assets/memes/buy_more.jpg";
import keepcalm from "../assets/memes/keep_calm.jpg";
import unstoppable from "../assets/memes/unstoppable.jpg";
import rigged from "../assets/memes/rigged.jpg";

export function MemeThumbnails() {
  const router = useRouter();

  const goToMemesPage = useCallback(() => {
    router.push("/memes");
  }, [router]);

  const memes = [orangePill, rigged, elementzero, buymore, keepcalm, fortune, unstoppable];

  return (
    <>
      {memes.map((meme, i) => (
        <div key={i} className="memeThumb">
          <img src={meme.src ?? meme as any} onClick={goToMemesPage} />
        </div>
      ))}
    </>
  );
}
