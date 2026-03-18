import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Sales from './pages/Sales'
import Vehicles from './pages/Vehicles'
import Login from './pages/Login'

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const handleToggle = () => setIsSidebarOpen(prev => !prev)
    window.addEventListener('toggle-sidebar', handleToggle)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('toggle-sidebar', handleToggle)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <Router>
      <div className="app-container">
        {/* Mobile ONLY overlay */}
        <div 
          className={`drawer-overlay mobile-only ${isSidebarOpen && isMobile ? 'active' : ''}`}
          onClick={closeSidebar}
        ></div>

        <Sidebar 
          isOpen={isSidebarOpen} 
          onLogout={handleLogout}
          onClose={closeSidebar}
        />
        
        <main className={`main-content ${isSidebarOpen && !isMobile ? 'sidebar-open' : ''}`}>
          <Header 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            user={user}
            onLogout={handleLogout}
          />
          
          <div className="content-inner">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
