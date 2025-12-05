import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../state/useStore";
import "../articleStyle.css";
import { useData } from "../../data/useData";
import { BannerNav } from "../../components/banner-nav";
import parse from "html-react-parser";

export function splitIntoParagraphs(body: string): string[] {
  const text = JSON.stringify(body);



  if (!text) return [];

  // Normalize Windows line breaks to Unix (\r\n → \n)
  const normalized = text.replace(/\r\n/g, '\n');

  // Split on two or more newlines (blank line)
  const paragraphs = normalized.split(/\n{1,}/);

  // Clean up spaces around each paragraph
  return paragraphs.map(p => p.trim()).filter(Boolean);
}

export function splitIntoLines(text: string): string[] {
  if (!text) return [];

  const normalized = text.replace(/\r\n/g, '\n');

  const splitLines = normalized.split('\n');
  return splitLines;
}

export function parseHTML(paragraph: string) {
  let boldText;
  boldText = paragraph.split('<b>');
}

export function ArticlePage() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, users, setUser } = useStore((s) => s);
  const { refresh } = useData();

  const article = articles.find((article) => article._id === id);
  const navigate = useNavigate();
  const paragraphs = splitIntoLines(article.body);
  const hasHeadlineImage = article?.headlineImage && article?.headlineImage !== '';


  const authorUser = users.find((user) => user._id === article.userID);

  const routeHome = useCallback(() => {
    navigate(`/`);
  }, []);


  return (
    <>
      <BannerNav page='article' />
      <div className={'article'}>
        <div className="articlePageCategory" >{article?.category}</div>

        {hasHeadlineImage && (
    <div className='headlineImageContainer'>
      <img src={`${article?.headlineImage}`} alt="headline" />
      </div>
)}
{
  !hasHeadlineImage && (
    <div className='noHeadlineImageContainer'       style={{

            backgroundColor: article?.randomColor ? `#${article.randomColor}` : undefined,
      
        }}>
 
      </div>
  )
}
    <div className='articleContainer'>
        <div className='articlePageTitle'>{article?.title}</div>
        <div className='authorName'>Author: {authorUser?.authorName ? authorUser.authorName : authorUser.userName}</div>
        <div className='originDate'>Originally published: {article?.originDate ? article.originDate : `2025-12-01`}</div>
        <div className='modifiedDate'>Last modified: {article?.lastModifiedDate}</div>

        </div>
 <div className='articleBody'>
       
{paragraphs.map((par, index) => (
    <p key={index}>{parse(par)}</p>
))}

        
</div>


      </div>
    </>
  );
}
