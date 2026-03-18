import React from 'react'
import { Menu, Bell, Search, User, ChevronDown, LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const Header = ({ toggleSidebar, user, onLogout }) => {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn mobile-menu-btn" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search anything..." />
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle Button */}
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile" style={{ position: 'relative' }}>
          <div 
            className="user-info"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: 'pointer' }}
          >
            <span className="user-name">{user?.username || 'Admin User'}</span>
            <span className="user-role">{user?.role === 'admin' ? 'Super Admin' : 'Farmer'}</span>
          </div>
          <div 
            className="avatar"
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ cursor: 'pointer' }}
          >
            <User size={20} />
          </div>
          
          {/* User Dropdown */}
          {showDropdown && (
            <div 
              style={{ 
                position: 'absolute', 
                top: 'calc(100% + 0.5rem)', 
                right: 0, 
                background: 'var(--bg-surface)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                minWidth: '180px',
                zIndex: 100
              }}
            >
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.username}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <div style={{ padding: '0.5rem' }}>
                <button 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    width: '100%', 
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Settings size={16} />
                  Settings
                </button>
                <button 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    width: '100%', 
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--danger)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--danger-light)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  onClick={onLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
