import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import { BannerNav } from "../../components/banner-nav";
import parse from "html-react-parser";

export function splitIntoParagraphs(body: string): string[] {
  const text = JSON.stringify(body);

  if (!text) return [];

  // Normalize Windows line breaks to Unix (\r\n → \n)
  const normalized = text.replace(/\r\n/g, "\n");

  // Split on two or more newlines (blank line)
  const paragraphs = normalized.split(/\n{1,}/);

  // Clean up spaces around each paragraph
  return paragraphs.map((p) => p.trim()).filter(Boolean);
}

export function splitIntoLines(text: string): string[] {
  if (!text) return [];

  const normalized = text.replace(/\r\n/g, "\n");

  const splitLines = normalized.split("\n");
  return splitLines;
}

export function parseHTML(paragraph: string) {
  let boldText;
  boldText = paragraph.split("<b>");
}

export function ArticlePage() {
  const { fetchArticles, fetchUsers } = useData();
  const { id } = useParams<{ id: string }>();

  const { user, articlesById, articlesLoaded, usersById, usersLoaded, users } =
    useStore((s) => s);

  const navigate = useNavigate();
  const article = articlesById[id!]; // 0(1) lookup
  const authorUser = article ? usersById[article.userID] : undefined;

  const routeHome = useCallback(() => {
    navigate(`/`);
  }, []);

  useEffect(() => {
    fetchArticles();
    fetchUsers();
  }, [fetchArticles, fetchUsers]);

  if (!articlesLoaded) {
    return <div>Loading article...</div>;
  }
  if (!usersLoaded) {
    return <div>Loading users...</div>;
  }
  if (!article) return <div>Article not found</div>;

  const paragraphs = splitIntoLines(article.body);
  const hasHeadlineImage =
    article?.headlineImage && article?.headlineImage !== "";

  return (
    <>
      <BannerNav page="article" />
      <div className={"article"}>
        <div className="articlePageCategory">{article?.category}</div>

        {hasHeadlineImage && (
          <div className="headlineImageContainer">
            <img src={`${article?.headlineImage}`} alt="headline" />
          </div>
        )}
        {!hasHeadlineImage && (
          <div
            className="noHeadlineImageContainer"
            style={{
              backgroundColor: article?.randomColor
                ? `#${article.randomColor}`
                : undefined,
            }}
          ></div>
        )}
        <div className="articleContainer">
          <div className="articlePageTitle">{article?.title}</div>
          <div className="authorName">
            Author:{" "}
            {authorUser?.authorName
              ? authorUser.authorName
              : authorUser.userName}
          </div>
          <div className="originDate">
            Originally published:{" "}
            {article?.originDate ? article.originDate : `2025-12-01`}
          </div>
          <div className="modifiedDate">
            Last modified: {article?.lastModifiedDate}
          </div>

          <div className="articleBody">
            {paragraphs.map((par, index) => (
              <p key={index}>{parse(par)}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
