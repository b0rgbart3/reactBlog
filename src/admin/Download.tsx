'use client';
import React from "react";
import { Article, User } from "../state/useStore";

interface Props {
  articles: Article[];
  users: User[];
}

export function DownloadJsonButton({ articles, users }: Props) {
  const handleDownloadArticles = () => {
    const json = JSON.stringify(articles, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "articles.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadUsers = () => {
    const json = JSON.stringify(users, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button onClick={handleDownloadArticles}>Download Articles JSON</button>
      <button onClick={handleDownloadUsers}>Download Users JSON</button>
    </>
  );
}
