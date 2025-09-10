import React from "react";

interface Props {
  articles: any[];
}

export function DownloadJsonButton({ articles }: Props) {
  const handleDownload = () => {
    const json = JSON.stringify(articles, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "articles.json"; // filename
    link.click();

    URL.revokeObjectURL(url); // cleanup
  };

  return (
    <button onClick={handleDownload}>
      Download JSON
    </button>
  );
}
