import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Calendar, 
  Shield, 
  Plus, 
  X,
  Edit2,
  Trash2,
  Check,
  User as UserIcon,
  AlertCircle
} from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' })
  const [editUser, setEditUser] = useState({ username: '', email: '', role: 'user' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/admin/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setUsers(res.data)
    } catch (err) {
      console.error('Error fetching users:', err)
      showToast('Failed to fetch users', 'error')
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
      await axios.post('/admin/users', newUser, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setShowModal(false)
      setNewUser({ username: '', email: '', password: '', role: 'user' })
      fetchUsers()
      showToast('User created successfully!')
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to create user', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.put(`/admin/users/${selectedUser._id}`, editUser, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setShowEditModal(false)
      setSelectedUser(null)
      fetchUsers()
      showToast('User updated successfully!')
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to update user', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsSubmitting(true)
    try {
      await axios.delete(`/admin/users/${selectedUser._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setShowDeleteModal(false)
      setSelectedUser(null)
      fetchUsers()
      showToast('User deleted successfully!')
    } catch (err) {
      showToast(err.response?.data?.msg || 'Failed to delete user', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openEditModal = (user) => {
    setSelectedUser(user)
    setEditUser({ username: user.username, email: user.email, role: user.role })
    setShowEditModal(true)
  }

  const openDeleteModal = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const filteredUsers = users.filter(u => 
    (u.username?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (u.email?.toLowerCase() || '').includes(search.toLowerCase())
  )

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  return (
    <div className="users-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`} style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
          {toast.type === 'success' && <Check size={20} />}
          {toast.type === 'error' && <AlertCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      <header className="page-header">
        <div>
          <h1 className="gradient-text">Registered Users</h1>
          <p className="text-secondary">Manage and monitor all platform members.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add New User
        </button>
      </header>

      <div className="card table-filters">
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

      {/* Mobile Responsive User Cards */}
      {isMobile ? (
        <div className="user-cards-list">
          {currentUsers.map(user => (
            <div key={user._id} className="user-card">
              <div className="user-card-header">
                <div className="user-avatar">{(user.username || '?').charAt(0).toUpperCase()}</div>
                <div className="user-card-info">
                  <h4>{user.username || 'Unknown User'}</h4>
                  <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-secondary'}`}>
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="user-card-body">
                <div className="user-card-row">
                  <Mail size={14} />
                  <span>{user.email}</span>
                </div>
                <div className="user-card-row">
                  <Calendar size={14} />
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="user-card-actions">
                <button 
                  className="icon-btn-sm" 
                  onClick={() => openEditModal(user)}
                  style={{ color: '#3b82f6' }}
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  className="icon-btn-sm" 
                  onClick={() => openDeleteModal(user)}
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <UserIcon size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
              <p>No users found matching your search.</p>
            </div>
          )}
        </div>
      ) : (
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
              {currentUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{(user.username || '?').charAt(0).toUpperCase()}</div>
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
                    <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-secondary'}`}>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="icon-btn-sm" 
                        onClick={() => openEditModal(user)}
                        title="Edit User"
                        style={{ color: '#3b82f6' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="icon-btn-sm" 
                        onClick={() => openDeleteModal(user)}
                        title="Delete User"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <UserIcon size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                    <p>No users found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
          </div>
          <div className="pagination-controls">
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-compact" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New User</h2>
              <button className="icon-btn-sm" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    required 
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    required 
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    required 
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter password"
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
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Edit User</h2>
              <button className="icon-btn-sm" onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditUser}>
              <div className="form-group">
                <label>Username</label>
                <input 
                  type="text" 
                  required 
                  value={editUser.username}
                  onChange={(e) => setEditUser(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  required 
                  value={editUser.email}
                  onChange={(e) => setEditUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select 
                  value={editUser.role}
                  onChange={(e) => setEditUser(prev => ({ ...prev, role: e.target.value }))}
                >
                  <option value="user">Farmer (User)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: '#fee2e2', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <AlertCircle size={32} style={{ color: '#ef4444' }} />
              </div>
              <h2 style={{ marginBottom: '0.5rem' }}>Delete User</h2>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Are you sure you want to delete <strong>{selectedUser?.username}</strong>? This action cannot be undone.
              </p>
              <div className="modal-actions" style={{ justifyContent: 'center' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
