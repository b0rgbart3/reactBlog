import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../state/useStore";
import "./articleStyle.css";
import { useData } from "../data/useData";
import { BannerNav } from "../components/banner-nav";


export function splitIntoParagraphs(body: string): string[] {
  const text = JSON.stringify(body);
  if (!text) return [];

  // Normalize Windows line breaks to Unix (\r\n → \n)
  const normalized = text.replace(/\r\n/g, '\n');

  console.log('BD: normalized: ', normalized);


  // Split on two or more newlines (blank line)
  const paragraphs = normalized.split(/\n{1,}/);

  console.log('BD: pars: ', paragraphs);

  // Clean up spaces around each paragraph
  return paragraphs.map(p => p.trim()).filter(Boolean);
}

export function splitIntoLines(text: string): string[] {
  if (!text) return [];

  const normalized = text.replace(/\r\n/g, '\n');

  const splitLines = normalized.split('\n');
  console.log('BD: splitLines: ', splitLines);
  return splitLines;
}

export function parseHTML(paragraph: string) {

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


  const routeHome = useCallback(() => {
    navigate(`/`);
  }, []);


  return (
    <>
      <BannerNav page='article' />
      <div className={'article'}>
        <div className="articlePageCategory" >{article?.category}</div>

        {article?.headlineImage !== '' && (
    <div className='headlineImageContainer'><img src={`${article?.headlineImage}`} alt="headline" /></div>
)}
    <div className='articleContainer'>
        <div className='articlePageTitle'>{article?.title}</div>
 <div className='articleBody'>
       
{paragraphs.map((par, index) => (
  <p key={index} dangerouslySetInnerHTML={{ __html: par }} />
))}

        </div>
</div>


      </div>
    </>
  );
}
