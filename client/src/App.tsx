import { useState } from 'react'
import { Article, ArticleCategory, ArticleThumbnail } from './Article';
import './App.css'



function App() {

  const categoryTitles = [
    'thoughts on bitcoin', 'life in general'
  ]
  const articles = [
    { title: 'Equation', body: 'This is the first article', category: 'thoughts on bitcoin'},
    { title: 'Equation2', body: 'This is the second article', category: 'thoughts on bitcoin'}
  ];


  const categories : ArticleCategory [] = [{
    title: categoryTitles[0],
    articles: articles
  }
  // , {
  //   title:  categoryTitles[1],
  //   articles: []
  // }
]

  return (
    <>
      <div>
        b0rgBlog
      </div>
  
      <div className="card">
        {categories.map((category) => {
          return (
            <div >
              {category.title }
              {category.articles.map((article) => {
                return (
            <ArticleThumbnail article={article} />)
              })}
            </div>
            )
          })}
      </div>
    </>
  )
}

export default App
