'use client';
import React, { useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "../../state/useStore";
import { useData } from "../../data/useData";
import { BannerNav } from "../../components/banner-nav";
import parse from "html-react-parser";
import { splitIntoLines } from "../../utils/articleUtils";

export function ArticlePage() {
  const { fetchArticles, fetchUsers } = useData();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { articlesById, articlesLoaded, usersById, usersLoaded } = useStore((s) => s);
  const router = useRouter();
  const article = articlesById[id!];
  const authorUser = article ? usersById[article.userID] : undefined;

  const routeHome = useCallback(() => { router.push(`/`); }, [router]);

  useEffect(() => {
    fetchArticles();
    fetchUsers();
  }, [fetchArticles, fetchUsers]);

  if (!articlesLoaded) return <div>Loading article...</div>;
  if (!usersLoaded) return <div>Loading users...</div>;
  if (!article) return <div>Article not found</div>;

  const paragraphs = splitIntoLines(article.body);
  const hasHeadlineImage = article?.headlineImage && article?.headlineImage !== "";

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
            style={article?.randomColor ? ({ "--article-color": `#${article.randomColor}` } as React.CSSProperties) : undefined}
          ></div>
        )}
        <div className="articleContainer">
          <div className="articlePageTitle">{article?.title}</div>
          <div className="authorName">
            Author: {authorUser?.authorName ? authorUser.authorName : authorUser?.userName}
          </div>
          <div className="originDate">
            Originally published: {article?.originDate ? article.originDate : `2025-12-01`}
          </div>
          <div className="modifiedDate">Last modified: {article?.lastModifiedDate}</div>
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
