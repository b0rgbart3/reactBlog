import React, { useEffect } from "react";
import { ArticleThumbnail } from "./ArticleThumbnail";
import { useStore } from "./state/useStore";

export const demoArticles = [
    { id: '0', body: "The bitcoin issuance equation is more mysterious than you might have realized.", category: 'bitcoin', title: "Issuance Equation", user_id: "001"},
    { id: '1', body: "The rule of 72", category: 'bitcoin', title: "The Rule of 72", user_id: "001" },
    { id: '3', body: "Article 3.", category: 'general', title: "Article 3", user_id: "001"},
    { id: '4', body: "Article 4", category: 'general', title: "Article 4", user_id: "001" },
    
  ];
  
export function Home() {

  const user = useStore((s) => s.user);
  const categories = useStore((c) => c.categories);
  const articles = useStore((s) => s.articles);
  const setArticles = useStore((s) => s.setArticles);
  const setCategories = useStore((s) => s.setCategories);
  const cats = demoArticles.map((article) => article.category);
  const uniqueCategories: string[] = [...new Set(cats)];

  useEffect(() => {
      setArticles(demoArticles);
      setCategories(uniqueCategories);
      console.log('BD: articles: ', articles);
  },[]);



  return (
    <div className='home'>
        <div className='mainMenu'>
      <div className='title'>b0rgBlog</div>
      <div className='welcome'>Welcome, {user?.name} </div>
      {categories.map((c, i) => (
        <>
        <div>{c}
        </div>
        <div>
          {articles.filter((a)=>a.category === c).map((a, i) => (
            <ArticleThumbnail key={i} article={a} />
          ))}
      </div>
      </>
      ))}

    </div>
    </div>
  );
}