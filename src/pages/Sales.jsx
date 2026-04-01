import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  User, 
  Truck, 
  X,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  RefreshCw,
  Calendar,
  ArrowUpDown
} from 'lucide-react'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSale, setSelectedSale] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filters, setFilters] = useState({
    vehicleNo: '',
    houseNo: '',
    flockNo: '',
    startDate: '',
    endDate: '',
    userId: ''
  })
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const fetchSales = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/admin/sales', {
        headers: { 'x-auth-token': token },
        params: {
          ...filters,
          vehicleNo: filters.vehicleNo || undefined,
          houseNo: filters.houseNo || undefined,
          flockNo: filters.flockNo || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          userId: filters.userId || undefined
        }
      })
      setSales(res.data)
    } catch (err) {
      console.error('Error fetching sales:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/users', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        })
        setUsers(res.data)
      } catch (err) {}
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSales()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [filters])

  const handleExport = () => {
    const csvData = sales.map(sale => ({
      Date: new Date(sale.date).toLocaleDateString(),
      Farmer: sale.userId?.username || 'Unknown',
      Vehicle: sale.vehicleNo,
      Broker: sale.brokerName,
      House: sale.houseNo,
      Flock: sale.flockNo,
      Weight: sale.netWeight,
      Rate: sale.rate,
      Amount: sale.totalAmount,
      Status: sale.status
    }))
    
    if (csvData.length > 0) {
      const headers = Object.keys(csvData[0]).join(',')
      const rows = csvData.map(row => Object.values(row).join(','))
      const csv = [headers, ...rows].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
    }
  }

  const viewSaleDetails = (sale) => {
    setSelectedSale(sale)
    setShowDetailModal(true)
  }

  const totalPages = Math.ceil(sales.length / itemsPerPage)
  const paginatedSales = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const resetFilters = () => {
    setFilters({
      vehicleNo: '',
      houseNo: '',
      flockNo: '',
      startDate: '',
      endDate: '',
      userId: ''
    })
    setCurrentPage(1)
  }

  return (
    <div className="sales-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">All Sales Records</h1>
          <p className="text-secondary">Comprehensive list of all transactions across all users.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleExport}>
            <FileSpreadsheet size={18} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary" onClick={fetchSales}>
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <div className="card table-filters">
        <div className="filter-row">
          <div className="search-box" style={{ minWidth: '200px' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Vehicle No..." 
              value={filters.vehicleNo}
              onChange={(e) => setFilters(prev => ({ ...prev, vehicleNo: e.target.value }))}
            />
          </div>
          <div className="filter-item">
            <label>House</label>
            <input 
              type="text" 
              placeholder="H-01" 
              value={filters.houseNo}
              onChange={(e) => setFilters(prev => ({ ...prev, houseNo: e.target.value }))}
            />
          </div>
          <div className="filter-item">
            <label>Flock</label>
            <input 
              type="text" 
              placeholder="F-01" 
              value={filters.flockNo}
              onChange={(e) => setFilters(prev => ({ ...prev, flockNo: e.target.value }))}
            />
          </div>
          <div className="filter-item" style={{ minWidth: '200px' }}>
            <label>Farmer</label>
            <select 
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
            >
              <option value="">All Farmers</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.username}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filter-row secondary">
          <div className="filter-item">
            <label>From Date</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="filter-item">
            <label>To Date</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </div>

      <div className="card table-container">
        {loading ? (
          <div className="loading">
            <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ marginLeft: '0.75rem' }}>Loading sales...</span>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Farmer</th>
                  <th>Vehicle Details</th>
                  <th>Weight (kg)</th>
                  <th>Rate</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map(sale => (
                  <tr key={sale._id}>
                    <td>
                      <span className="date-text">{new Date(sale.date).toLocaleDateString()}</span>
                    </td>
                    <td>
                      <div className="farmer-cell">
                        <User size={14} />
                        <span>{sale.userId?.username || 'Unknown Farmer'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="vehicle-cell">
                        <span className="v-no">{sale.vehicleNo}</span>
                        <span className="b-name">{sale.brokerName}</span>
                      </div>
                    </td>
                    <td>{sale.netWeight?.toLocaleString() || 0}</td>
                    <td>₹ {sale.rate}</td>
                    <td>
                      <span className="total-amount">₹ {sale.totalAmount?.toLocaleString() || 0}</span>
                    </td>
                    <td>
                      <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                        {sale.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-icon" 
                        onClick={() => viewSaleDetails(sale)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedSales.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <FileSpreadsheet size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                      <p>No sales records found matching your filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination */}
            {sales.length > 0 && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border)'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sales.length)} of {sales.length} records
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button 
                        key={page}
                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    )
                  })}
                  <button 
                    className="btn btn-ghost btn-sm" 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sale Detail Modal */}
      {showDetailModal && selectedSale && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2>Sale Details</h2>
              <button className="icon-btn-sm" onClick={() => setShowDetailModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                padding: '1rem', 
                background: 'var(--primary-light)', 
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Amount</span>
                <h3 style={{ fontSize: '1.75rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                  ₹ {selectedSale.totalAmount?.toLocaleString()}
                </h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'start' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</label>
                  <p style={{ fontWeight: 600 }}>{new Date(selectedSale.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</label>
                  <span className={`badge ${selectedSale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {selectedSale.status || 'pending'}
                  </span>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Farmer Information</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="user-avatar">
                    {(selectedSale.userId?.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{selectedSale.userId?.username || 'Unknown'}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{selectedSale.userId?.email}</p>
                  </div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Vehicle Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vehicle Number</label>
                    <p style={{ fontWeight: 600 }}>{selectedSale.vehicleNo}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Broker</label>
                    <p>{selectedSale.brokerName}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>House</label>
                    <p>{selectedSale.houseNo || '-'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Flock</label>
                    <p>{selectedSale.flockNo || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Transaction Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Weight</label>
                    <p style={{ fontWeight: 600 }}>{selectedSale.netWeight?.toLocaleString()} kg</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate</label>
                    <p>₨ {selectedSale.rate}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Empty Weight</label>
                    <p>{selectedSale.weight1?.toLocaleString() || 0} kg</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loaded Weight</label>
                    <p>{selectedSale.weight2?.toLocaleString() || 0} kg</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-ghost full-width" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sales
