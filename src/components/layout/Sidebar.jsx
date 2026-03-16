import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Truck, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react'

const Sidebar = ({ isOpen, onLogout }) => {
  const location = useLocation()
  
  const navItems = [
    { title: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { title: 'Users', icon: <Users size={20} />, path: '/users' },
    { title: 'Sales', icon: <ShoppingBag size={20} />, path: '/sales' },
    { title: 'Vehicles', icon: <Truck size={20} />, path: '/vehicles' },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">GPF</div>
          {isOpen && <span className="logo-text">Farmer Admin</span>}
        </div>
        <button 
          className="toggle-rail-btn" 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
        >
          <ChevronLeft size={20} className={!isOpen ? 'rotate-180' : ''} />
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={!isOpen ? item.title : ''}
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
