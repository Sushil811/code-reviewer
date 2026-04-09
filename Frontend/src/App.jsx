import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import prism from "prismjs"
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum (){
  return 1+1
}`)

  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [review]) 

  async function reviewCode() {
    setLoading(true)
    setReview("Reviewing your code...")
    try {
      const response = await axios.post('http://127.0.0.1:3001/ai/get-review', { code })
      setReview(response.data)
    } catch (error) {
      console.error("AXIOS ERROR:", error)
      const msg = error.response?.data || error.message || "Network Error";
      setReview("Error: " + msg);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main>
        <div className='left'>
          <div className='code'>
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: 'monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
                backgroundColor: "#0c0c0c",
                color: "#fff"
              }}
            />
          </div>
          <div
            onClick={reviewCode}
            className='review'
            style={{ 
              opacity: loading ? 0.5 : 1, 
              pointerEvents: loading ? 'none' : 'auto',
              transition: 'opacity 0.2s'
            }}
          >
            {loading ? "Thinking..." : "Review"}
          </div>
        </div>
        <div className='right'>
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App
