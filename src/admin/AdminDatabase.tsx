"use client";
import React, { useCallback } from "react";
import { useStore } from "../state/useStore";
import { useData } from "../data/useData";
import { DownloadJsonButton } from "./Download";

export function AdminDatabase() {
  const { refresh, backUpDB, wipeAndSeed } = useData();
  const { user, articles, users } = useStore((s) => s);

  const clearOut = useCallback(async () => {
    let wiped;
    try {
      wiped = await wipeAndSeed({ id: user._id, key: user.phash });
    } catch (err) {
    } finally {
      if (wiped?.status === 200) refresh();
    }
  }, []);

  const backUp = useCallback(async () => {
    let result;
    try {
      result = await backUpDB({ id: user._id, key: user.phash });
    } catch (err) {
    } finally {
      if (result?.status === 200) refresh();
    }
  }, []);

  if (!user.sensi) return null;

  return (
    <>
      <div className="caution" onClick={() => backUp()}>
        Backup the current DataBase.
      </div>
      <div className="JsonData">
        Download data to your local download folder:<br></br>
        <DownloadJsonButton articles={articles} users={users} />
      </div>
      <div className="dangerous" onClick={() => clearOut()}>
        Wipe out the DataBase, and start over with original seed data.
      </div>
    </>
  );
}
