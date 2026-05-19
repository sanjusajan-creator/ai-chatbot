import React, { useContext, useEffect, useRef } from "react";
import "./Chatsection.css";
import DarkMode from "../DarkMode/DarkMode";
import { LuSendHorizontal } from "react-icons/lu";
import { dataContext } from "../../context/UserContext";
import ReactMarkdown from "react-markdown";
import user from "../../Assets/user.png";
import ai from "../../Assets/ai.png";
function Chatsection() {
  let { sent, input, setInput, showResult, resultData, recentPrompt, loading } =
    useContext(dataContext);
  const resultRef = useRef(null);
  const tailRef = useRef(null);
  function shouldUseMarkdown(text) {
    return (
      text.includes("##") ||
      text.includes("- ") ||
      text.includes("1.") ||
      text.length > 200
    );
  }

  useEffect(() => {
    if (!showResult) return;
    if (tailRef.current) {
      tailRef.current.scrollIntoView({ block: "end" });
      return;
    }
    if (!resultRef.current) return;
    resultRef.current.scrollTop = resultRef.current.scrollHeight;
  }, [resultData, showResult]);

  return (
    <div className="chatsection">
      <div className="topsection">
        {!showResult ? (
          <div className="headings">
            <span>HELLO USER,</span>
            <span>I'm Your Own Assistant</span>
            <span>How can I help you...?</span>
          </div>
        ) : (
          <div className="result" ref={resultRef}>
            <div className="userbox">
              <img src={user} alt="" width="60px" />
              <p>{recentPrompt}</p>
            </div>
            <div className="aibox">
              <img src={ai} alt="" width="60px" />
              <div className="aibox-content">
                {loading && (
                  <div className="loader">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                )}
                {shouldUseMarkdown(resultData) ? (
                  <div className="markdown">
                    <ReactMarkdown>{resultData}</ReactMarkdown>
                    <span className="tail-anchor" ref={tailRef} />
                  </div>
                ) : (
                  <p className="plain-text">
                    {resultData}
                    <span className="tail-anchor" ref={tailRef} />
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="bottomsection">
        <input
          type="text"
          placeholder="Enter a prompt"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        {input ?   <button
          id="sendbtn"
          onClick={() => {
            sent(input);
            setInput("");
          }}
        >
          <LuSendHorizontal />
        </button>: null}
      
        <DarkMode />
      </div>
    </div>
  );
}

export default Chatsection;
