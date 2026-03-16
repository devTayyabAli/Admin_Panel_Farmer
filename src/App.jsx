import React, { useState } from 'react'
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
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev)
    window.addEventListener('toggle-sidebar', handleToggle)
    return () => window.removeEventListener('toggle-sidebar', handleToggle)
  }, [])

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <Router>
      <div className="app-container">
        {/* Mobile ONLY overlay */}
        <div 
          className={`drawer-overlay mobile-only ${isSidebarOpen ? 'active' : ''}`} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <Sidebar isOpen={isSidebarOpen} onLogout={() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }} />
        
        <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
          <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} user={user} />
          
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
