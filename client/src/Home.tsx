import React from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";

export   const articles = [
    { id: '0', title: "Issuance Equation", body: "The bitcoin issuance equation is more mysterious than you might have realized." },
    { id: '1', title: "The Rule of 72", body: "The rule of 72" },
  ];
  
export function Home() {


  return (
    <div className='home'>
        <div className='mainMenu'>
      <div className='title'>b0rgBlog</div>
      {articles.map((a, i) => (
        <ArticleThumbnail key={i} article={{ ...a, id: i }} />
      ))}
    </div>
    </div>
  );
}