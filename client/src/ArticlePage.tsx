import React from "react";
import { useParams } from "react-router-dom";

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Article Page</h1>
      <p>Article ID: {id}</p>
    </div>
  );
}
