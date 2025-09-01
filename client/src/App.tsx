import { useState } from 'react'
import { ArticleThumbnail } from './Article';
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const articles = [
    { title: 'Equation', body: 'This is the first article'},
    { title: 'Equation2', body: 'This is the second article'}
  ]

  return (
    <>
      <div>
        b0rgBlog
      </div>
  
      <div className="card">

{articles.map((article) => {

  return (
 <ArticleThumbnail article={article} />
  )
})}
       

      </div>

    </>
  )
}

export default App
