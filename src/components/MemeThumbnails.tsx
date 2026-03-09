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

  return (
    <>
      <img src={orangePill.src ?? orangePill as any} onClick={goToMemesPage} />
      <img src={rigged.src ?? rigged as any} onClick={goToMemesPage} />
      <img src={elementzero.src ?? elementzero as any} onClick={goToMemesPage} />
      <img src={buymore.src ?? buymore as any} onClick={goToMemesPage} />
      <img src={keepcalm.src ?? keepcalm as any} onClick={goToMemesPage} />
      <img src={fortune.src ?? fortune as any} onClick={goToMemesPage} />
      <img src={unstoppable.src ?? unstoppable as any} onClick={goToMemesPage} />
    </>
  );
}
