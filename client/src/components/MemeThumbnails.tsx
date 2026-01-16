import React, { useEffect, useState, useCallback, useMemo } from "react";
import { BannerNav } from "./banner-nav";
import orangePill from "../assets/memes/orange_pill.jpeg";
import fortune from "../assets/memes/fortune_favors.jpg";
import elementzero from "../assets/memes/element_zero.jpg";
import buymore from "../assets/memes/buy_more.jpg";
import keepcalm from "../assets/memes/keep_calm.jpg";
import unstoppable from "../assets/memes/unstoppable.jpg";
import rigged from "../assets/memes/rigged.jpg";
import { useNavigate } from "react-router-dom";

export function MemeThumbnails() {
  const navigate = useNavigate();

  const goToMemesPage = useCallback(() => {
    navigate("/memes");
  });

  return (
    <>
      <img src={orangePill} onClick={goToMemesPage} />
      <img src={rigged} onClick={goToMemesPage} />
      <img src={elementzero} onClick={goToMemesPage} />
      <img src={buymore} onClick={goToMemesPage} />
      <img src={keepcalm} onClick={goToMemesPage} />
      <img src={fortune} onClick={goToMemesPage} />
      <img src={unstoppable} onClick={goToMemesPage} />
    </>
  );
}
