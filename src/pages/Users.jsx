import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Filter, MoreVertical, Mail, Calendar, Shield } from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.post('/api/admin/users', newUser, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setShowModal(false)
      setNewUser({ username: '', email: '', password: '', role: 'user' })
      fetchUsers()
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredUsers = users.filter(u => 
    (u.username?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div className="users-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Registered Users</h1>
          <p className="text-secondary">Manage and monitor all platform members.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Add New User</button>
      </header>

      <div className="card table-filters glass-effect">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-actions">
          <span className="text-muted">{filteredUsers.length} Users found</span>
        </div>
      </div>

      <div className="card table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Contact Info</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar">{(user.username || '?').charAt(0)}</div>
                    <span>{user.username || 'Unknown User'}</span>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-warning'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <button className="icon-btn-sm">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-state">No users found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-effect">
            <h2>Add New User</h2>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  required 
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  required 
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  required 
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">Farmer (User)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Users
