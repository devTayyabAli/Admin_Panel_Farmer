import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, Filter, Download, ArrowRight, Eye, User, Truck } from 'lucide-react'

const Sales = () => {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    vehicleNo: '',
    houseNo: '',
    flockNo: '',
    startDate: '',
    endDate: '',
    userId: ''
  })
  const [users, setUsers] = useState([])

  const fetchSales = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/admin/sales', {
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
        const res = await axios.get('/api/admin/users', {
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

  return (
    <div className="sales-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">All Sales Records</h1>
          <p className="text-secondary">Comprehensive list of all transactions across all users.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="btn btn-primary">Reports</button>
        </div>
      </header>

      <div className="card table-filters glass-effect">
        <div className="filter-row">
          <div className="search-box">
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
          <div className="filter-item">
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
            <label>From</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="filter-item">
            <label>To</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setFilters({
            vehicleNo: '',
            houseNo: '',
            flockNo: '',
            startDate: '',
            endDate: '',
            userId: ''
          })}>Reset Filters</button>
        </div>
      </div>

      <div className="card table-container">
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
            {sales.map(sale => (
              <tr key={sale._id}>
                <td>
                  <span className="date-text">{new Date(sale.date).toLocaleDateString()}</span>
                </td>
                <td>
                  <div className="farmer-cell">
                    <User size={14} className="text-muted" />
                    <span>{sale.userId?.username || 'Unknown Farmer'}</span>
                  </div>
                </td>
                <td>
                  <div className="vehicle-cell">
                    <span className="v-no">{sale.vehicleNo}</span>
                    <span className="b-name">{sale.brokerName}</span>
                  </div>
                </td>
                <td>{sale.netWeight.toLocaleString()}</td>
                <td>₨ {sale.rate}</td>
                <td>
                  <span className="total-amount">₨ {sale.totalAmount.toLocaleString()}</span>
                </td>
                <td>
                  <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {sale.status}
                  </span>
                </td>
                <td>
                  <button className="btn-icon">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Sales
