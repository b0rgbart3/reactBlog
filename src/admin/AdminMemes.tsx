"use client";
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Meme, useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { TrashIcon } from "./icons";

export function AdminMemes() {
  const router = useRouter();
  const { fetchMemes, killMeme, refresh } = useData();
  const { memes } = useStore((s) => s);

  useEffect(() => {
    fetchMemes();
  }, []);

  const newMeme = useCallback(() => {
    router.push(`/meme/new`);
  }, [router]);

  const editMeme = useCallback(
    (meme: Meme) => {
      router.push(`/meme/edit/${meme._id}`);
    },
    [router],
  );

  const killAMeme = useCallback((memeToKill: Meme) => {
    const confirmDelete =
      window.confirm(`Are you sure you want to delete this meme,
            titled: ${memeToKill.title} ?
            \nIt will be completely deleted from the database and cannot be restored.`);
    if (!confirmDelete) return;
    killMeme(memeToKill._id);
    refresh();
  }, []);

  return (
    <>
      <div onClick={newMeme} className="newArticleButton">
        + Add a Meme
      </div>
      <div className="articlesListLabel">
        Memes
        <span className="articlesListCount">{memes?.length ?? 0}</span>
      </div>
      <div className="articlesContainer">
        {memes?.map((m) => (
          <div className="aaRow" key={m._id}>
            <div className="aaItem" onClick={() => editMeme(m)}>
              {m.title || "(untitled)"}
            </div>
            <div className="killButton" onClick={() => killAMeme(m)}>
              <TrashIcon />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
