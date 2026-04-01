import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Download,
  ChevronRight,
  ShoppingCart,
  X,
  Filter
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(false)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [chartPeriod, setChartPeriod] = useState('weekly')
  const [refreshing, setRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const fetchStats = async () => {
    setStatsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = { period: chartPeriod }
      if (dateRange.start) params.startDate = dateRange.start
      if (dateRange.end) params.endDate = dateRange.end

      const res = await axios.get('/admin/stats', {
        headers: { 'x-auth-token': token },
        params
      })
      setData(res.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setStatsLoading(false)
      setRefreshing(false)
      setLoading(false)
    }
  }

  // Refetch when chart period changes
  useEffect(() => {
    if (data) {
      fetchStats()
    }
  }, [chartPeriod])

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchStats()
  }

  const handleExport = () => {
    const csvData = data?.recentSales?.map(sale => ({
      Date: new Date(sale.date).toLocaleDateString(),
      Farmer: sale.userId?.username,
      Vehicle: sale.vehicleNo,
      Weight: sale.netWeight,
      Rate: sale.rate,
      Amount: sale.totalAmount
    }))
    
    if (csvData && csvData.length > 0) {
      const headers = Object.keys(csvData[0]).join(',')
      const rows = csvData.map(row => Object.values(row).join(','))
      const csv = [headers, ...rows].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
    }
  }

  // Use real chart data from API, fallback to empty data if not available
  const chartData = data?.chartData || [
    { name: 'Mon', sales: 0, orders: 0 },
    { name: 'Tue', sales: 0, orders: 0 },
    { name: 'Wed', sales: 0, orders: 0 },
    { name: 'Thu', sales: 0, orders: 0 },
    { name: 'Fri', sales: 0, orders: 0 },
    { name: 'Sat', sales: 0, orders: 0 },
    { name: 'Sun', sales: 0, orders: 0 },
  ]

  // Show initial loading only
  if (loading) {
    return (
      <div className="loading">
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '0.75rem' }}>Loading Dashboard...</span>
      </div>
    )
  }

  // Show error state
  if (!data) {
    return (
      <div className="loading">
        <span>Error loading data. Please check connection.</span>
        <button className="btn btn-primary" onClick={handleRefresh} style={{ marginLeft: '1rem' }}>
          Retry
        </button>
      </div>
    )
  }

  // Show filter section always, then stats/charts with loading state
  return (
    <div className="dash-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Dashboard Overview</h1>
          <p className="text-secondary">Welcome back, Admin. Here is what is happening today.</p>
        </div>
        <div className="header-controls">
          <div className="date-display">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            <span>Filters {showFilters ? '▲' : '▼'}</span>
          </button>
          <button 
            className="btn btn-ghost" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* Filter Section - Collapsible */}
      {showFilters && (
        <>
        <div className="card dashboard-filters">
          {/* Filter Header */}
          <div className="filter-header">
            <div className="filter-title">
              <Calendar size={20} />
              <h3>Date Range Filter</h3>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setDateRange({ start: '', end: '' })}>
              <RefreshCw size={16} />
              <span>Reset</span>
            </button>
          </div>

        {/* Date Range Section */}
        <div className="filter-section">
          <div className="section-title">
            <Calendar size={16} />
            <span>Select Date Range</span>
          </div>
          <div className="filter-grid date-range">
            <div className="form-group">
              <label className="form-label">From Date</label>
              <div className="input-group date-input-wrapper">
                <input 
                  type="date" 
                  className="form-control"
                  value={dateRange.start} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} 
                />
                <Calendar size={16} className="date-picker-icon" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">To Date</label>
              <div className="input-group date-input-wrapper">
                <input 
                  type="date" 
                  className="form-control"
                  value={dateRange.end} 
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} 
                />
                <Calendar size={16} className="date-picker-icon" />
              </div>
            </div>
            
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button className="btn btn-primary full-width" onClick={handleRefresh}>
                <RefreshCw size={16} />
                <span>Apply Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {(dateRange.start || dateRange.end) && (
          <div className="active-filters">
            <div className="active-filters-title">
              <span>Active Filters:</span>
            </div>
            <div className="filter-tags">
              {dateRange.start && (
                <div className="filter-tag">
                  <span>From: {new Date(dateRange.start).toLocaleDateString()}</span>
                  <button onClick={() => setDateRange(prev => ({ ...prev, start: '' }))}>
                    <X size={12} />
                  </button>
                </div>
              )}
              {dateRange.end && (
                <div className="filter-tag">
                  <span>To: {new Date(dateRange.end).toLocaleDateString()}</span>
                  <button onClick={() => setDateRange(prev => ({ ...prev, end: '' }))}>
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Date Options */}
        <div className="quick-filters">
          <div className="section-title">
            <Calendar size={16} />
            <span>Quick Selection</span>
          </div>
          <div className="quick-filter-buttons">
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => {
                const today = new Date()
                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                setDateRange({ 
                  start: lastWeek.toISOString().split('T')[0], 
                  end: today.toISOString().split('T')[0] 
                })
              }}
            >
              Last 7 Days
            </button>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => {
                const today = new Date()
                const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                setDateRange({ 
                  start: lastMonth.toISOString().split('T')[0], 
                  end: today.toISOString().split('T')[0] 
                })
              }}
            >
              Last 30 Days
            </button>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => {
                const today = new Date()
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
                setDateRange({ 
                  start: firstDay.toISOString().split('T')[0], 
                  end: today.toISOString().split('T')[0] 
                })
              }}
            >
              This Month
            </button>
            <button 
              className="btn btn-ghost btn-sm" 
              onClick={() => {
                const today = new Date()
                const firstDay = new Date(today.getFullYear(), 0, 1)
                setDateRange({ 
                  start: firstDay.toISOString().split('T')[0], 
                  end: today.toISOString().split('T')[0] 
                })
              }}
            >
              This Year
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Stats Section - Shows loading state when filtering */}
      {statsLoading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading stats...</p>
        </div>
      ) : (
        <>
        {(() => {
          const statsCards = [
            { 
              title: 'Total Revenue', 
              value: `₨ ${((data.stats?.totalAmount || 0) / 1000000).toFixed(2)}M`, 
              icon: <DollarSign size={24} />, 
              color: 'primary', 
              trend: '+12.5%',
              trendUp: true 
            },
            { 
              title: 'Total Weight', 
              value: `${((data.stats?.totalWeight || 0) / 1000).toFixed(1)} Tons`, 
              icon: <TrendingUp size={24} />, 
              color: 'success', 
              trend: '+5.2%',
              trendUp: true 
            },
            { 
              title: 'Active Farmers', 
              value: data.stats?.totalUsers || 0, 
              icon: <Users size={24} />, 
              color: 'info', 
              trend: '+2',
              trendUp: true 
            },
            { 
              title: 'Total Sales', 
              value: data.stats?.totalSales || 0, 
              icon: <ShoppingBag size={24} />, 
              color: 'warning', 
              trend: '+8%',
              trendUp: true 
            },
          ]

          return (
            <div className="dash-page">
              <div className="stats-grid">
                {statsCards.map((stat, i) => (
                  <div key={i} className="card stat-card">
                    <div className={`stat-icon ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <div className="stat-content">
                      <span className="stat-title">{stat.title}</span>
                      <h3 className="stat-value">{stat.value}</h3>
                      <div className={`stat-trend ${stat.trendUp ? 'positive' : 'negative'}`}>
                        {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{stat.trend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="charts-grid">
                <div className="card chart-card main-chart">
                  <div className="chart-header">
                    <h3>Sales Performance</h3>
                    <div className="chart-actions">
                      <button 
                        className={`btn btn-sm ${chartPeriod === 'weekly' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setChartPeriod('weekly')}
                      >
                        Weekly
                      </button>
                      <button 
                        className={`btn btn-sm ${chartPeriod === 'monthly' ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setChartPeriod('monthly')}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <YAxis 
                          stroke="#94a3b8" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `${value/1000} k`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                          }}
                          itemStyle={{ color: '#1e293b' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#4f46e5" 
                          fillOpacity={1} 
                          fill="url(#colorSales)" 
                          strokeWidth={3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card recent-sales-card">
                  <div className="chart-header">
                    <h3>Recent Sales</h3>
                    <button className="btn btn-ghost btn-sm" onClick={() => window.location.href = '#/sales'}>
                      View All
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  <div className="recent-sales-list">
                    {data.recentSales && data.recentSales.length > 0 ? (
                      data.recentSales.slice(0, 5).map((sale) => (
                        <div key={sale._id} className="sale-item">
                          <div className="sale-avatar">
                            {(sale.userId?.username || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="sale-info">
                            <span className="farmer-name">{sale.userId?.username || 'Unknown Farmer'}</span>
                            <span className="vehicle-no">{sale.vehicleNo}</span>
                          </div>
                          <div className="sale-amount">
                            <span className="amount">₨ {(sale.totalAmount / 1000).toFixed(0)}k</span>
                            <span className="date">{new Date(sale.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <ShoppingCart size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                        <p>No recent sales found</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })()}
        </>
      )}
    </div>
  )
}

export default Dashboard
