import React from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";

export function Home() {
  const articles = [
    { title: "React Hooks", body: "Learn about hooks in React" },
    { title: "Routing in React", body: "Learn React Router" },
  ];

  return (
    <div>
      <h1>b0rgBlog</h1>
      {articles.map((a, i) => (
        <ArticleThumbnail key={i} article={{ ...a, id: i }} />
      ))}
    </div>
  );
}