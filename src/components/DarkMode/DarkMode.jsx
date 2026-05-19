import React, { useEffect, useState } from 'react'
import { MdOutlineWbSunny } from "react-icons/md";
import { FiMoon } from "react-icons/fi";
import "./DarkMode.css"
function DarkMode() {
    const [mode, setMode] = useState("darkmode")
    function toggle(){
        if(mode === "darkmode"){
            setMode("lightmode")
        }else{
            setMode("darkmode")
        }
    }
    useEffect(()=>{
        document.body.className=mode
    },[mode])
  return (
    <button className='darkmodebtn' onClick={()=>{
        toggle()
    }}>{mode === "darkmode" ? <MdOutlineWbSunny /> : <FiMoon />}</button>
  )
}

export default DarkMode