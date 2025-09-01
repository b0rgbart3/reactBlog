
import React, { useCallback } from 'react'; 

import './Article.css'

export type Article = {
    title: string;
    body: string;
    category: string;
}

export type ArticleProps  = {
    article: Article
}

export type ArticleCategory = {
  title: string;
  articles: Article[];
}




// export function ArticleThumbnail( props: ArticleProps) {

//     const readArticle = useCallback((article: Article) => {
//     console.log('Article: ', article.title);
// }, []);


//     return (
//         <div className='articleThumb' onClick={()=>readArticle(props.article)}>
//             {props.article.title}
//         </div>
//     )
// }

export function Article( props: ArticleProps) {

    return (
        <div>
            ARTICLE TITLE
        </div>
    )
}