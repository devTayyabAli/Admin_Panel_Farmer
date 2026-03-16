import React from 'react'
import { Menu, Bell, Search, User } from 'lucide-react'

const Header = ({ toggleSidebar, user }) => {
  return (
    <header className="header glass-effect">
      <div className="header-left">
        <button className="icon-btn mobile-only" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>
      </div>

      <div className="header-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{user?.username || 'Admin User'}</span>
            <span className="user-role">{user?.role === 'admin' ? 'Super Admin' : 'Farmer'}</span>
          </div>
          <div className="avatar">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
