import React, { useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../state/useStore";
import "./articleStyle.css";
import { useData } from "../data/useData";
import { BannerNav } from "../components/banner-nav";


export function ArticlePage() {

  useData();
  const { id } = useParams<{ id: string }>();

  const { user, articles, loading, users, setUser } = useStore((s) => s);
  const { refresh } = useData();

  const article = articles.find((article) => article._id === id);
  const navigate = useNavigate();

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
    
        <div className='articlePageTitle'>{article?.title}</div>
 <div className='articleBody'>
        <p>{article?.body}</p></div>



      </div>
    </>
  );
}
