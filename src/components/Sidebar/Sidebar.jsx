import React, { useContext, useEffect, useState } from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { FaPlus } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import "./Sidebar.css"
import { dataContext } from '../../context/UserContext';
function Sidebar({ isOpen, onClose }) {
    const [extend, setExtend] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const {sent, prevPrompt, newChat} = useContext(dataContext)
    async function loadPrevPromot(prompt){
      sent(prompt)
      if (onClose) {
        onClose()
      }
    }
    useEffect(() => {
      if (typeof window === "undefined") return
      const media = window.matchMedia("(max-width: 600px)")
      const handleChange = () => {
        setIsMobile(media.matches)
        if (media.matches) {
          setExtend(true)
        }
      }
      handleChange()
      if (media.addEventListener) {
        media.addEventListener("change", handleChange)
      } else {
        media.addListener(handleChange)
      }
      return () => {
        if (media.removeEventListener) {
          media.removeEventListener("change", handleChange)
        } else {
          media.removeListener(handleChange)
        }
      }
    }, [])
  return (
    <div className={`sidebar ${isOpen ? "is-open" : ""} ${extend ? "is-extended" : "is-collapsed"}`}>
        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => {
              if (isMobile) {
                if (onClose) {
                  onClose()
                }
                return
              }
              setExtend((prev) => !prev)
            }}
            aria-label="Toggle sidebar expand"
          >
            <GiHamburgerMenu />
          </button>
          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            &times;
          </button>
        </div>
        <div className="newchat" onClick={()=>newChat()}>
            <FaPlus />
           <p>New Chat</p>
        </div>
        {prevPrompt.map((item, index)=>{
          return (
           <div className="recent" onClick={()=>loadPrevPromot(item)}>
            <FaRegMessage />
           <p>{item.slice(0, 10) + "..."}</p>
        </div>
          )
        })}
        
    </div>
  )
}

export default Sidebar
