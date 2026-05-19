import React, { createContext, useRef, useState } from 'react'
import run from '../gemini'
export const dataContext = createContext()

function UserContext({children}) {
  const [input, setInput]= useState("")
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultData, setResultData] = useState("")
  const [recentPrompt, setRecentPrompt] = useState("")
  const [prevPrompt, setPrevPrompt]= useState([])

  function newChat(){
    setShowResult(false)
    setLoading(false)
  }
  const typingRef = useRef({
    buffer: "",
    timer: null,
    done: false,
    started: false
  })

  function startTyping() {
    const typingState = typingRef.current
    if (typingState.timer) return
    typingState.timer = setInterval(() => {
      const state = typingRef.current
      if (!state.buffer) {
        if (state.done) {
          clearInterval(state.timer)
          state.timer = null
          state.done = false
          setLoading(false)
        }
        return
      }
      const match = state.buffer.match(/^\s*\S+\s*/)
      if (!match) return
      const next = match[0]
      state.buffer = state.buffer.slice(next.length)
      setResultData((prev) => prev + next)
    }, 30)
  }

  function enqueueChunk(chunk) {
    const state = typingRef.current
    if (!state.started) {
      state.started = true
      setLoading(false)
    }
    state.buffer += chunk
    startTyping()
  }

 async function sent(input){
  const finalPrompt = `
Format the response using markdown.

Use:
- headings
- bullet points
- numbered lists
- bold text
- proper spacing

User question:
${input}
`;
      const typingState = typingRef.current
      if (typingState.timer) {
        clearInterval(typingState.timer)
      }
      typingState.buffer = ""
      typingState.timer = null
      typingState.done = false
      typingState.started = false
      setResultData("")
      setShowResult(true)
      setRecentPrompt(input)
      setLoading(true)
      setPrevPrompt(prev=>[...prev, input])
      await run(finalPrompt, (token) => {
        if (!token) return
        enqueueChunk(token)
      })
      typingRef.current.done = true
      startTyping()
      setInput("")
    }
    const data={
      input,
      setInput,
      sent,
      loading,
      resultData,
      setResultData,
      setLoading,
      showResult,
      setShowResult,
      recentPrompt,
      setRecentPrompt,
      prevPrompt,
      newChat
    }
  return (
    <>
    <dataContext.Provider value={data}>
        {children}
    </dataContext.Provider>
    </>
  )
}

export default UserContext
