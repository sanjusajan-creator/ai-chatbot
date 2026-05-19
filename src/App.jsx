import { useState } from 'react'
import Chatsection from './components/chatSection/Chatsection'
import Separation from './components/separation/Separation'
import Sidebar from './components/Sidebar/Sidebar'
import { GiHamburgerMenu } from "react-icons/gi";
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)
  const closeSidebar = () => setIsSidebarOpen(false)
  return (
    <div className={`app ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <button
        type="button"
        className="mobile-menu-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <GiHamburgerMenu />
      </button>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <Separation />
      <Chatsection />
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export default App
