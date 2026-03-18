import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Truck, 
  LogOut,
  ChevronLeft,
  X
} from 'lucide-react'

const Sidebar = ({ isOpen, onLogout, onClose }) => {
  const location = useLocation()
  
  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Users', icon: <Users size={20} />, path: '/users' },
    { title: 'Sales', icon: <ShoppingBag size={20} />, path: '/sales' },
    { title: 'Vehicles', icon: <Truck size={20} />, path: '/vehicles' },
  ]

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && isOpen && onClose) {
        // Let the parent handle closing
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, onClose])

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">GPF</div>
          {isOpen && <span className="logo-text">Farmer Admin</span>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="toggle-rail-btn mobile-only" 
            onClick={onClose}
            style={{ display: 'none' }}
          >
            <X size={20} />
          </button>
          <button 
            className="toggle-rail-btn desktop-only" 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          >
            <ChevronLeft size={20} className={!isOpen ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={!isOpen ? item.title : ''}
            onClick={() => {
              if (window.innerWidth <= 768 && onClose) {
                onClose()
              }
            }}
          >
            {item.icon}
            {isOpen && <span className="nav-label">{item.title}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={onLogout} title={!isOpen ? 'Logout' : ''}>
          <LogOut size={20} />
          {isOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
