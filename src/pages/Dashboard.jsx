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
  ShoppingCart
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
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [chartPeriod, setChartPeriod] = useState('weekly')
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = {}
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
      setLoading(false)
      setRefreshing(false)
    }
  }

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

  const weeklyData = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 2000, orders: 12 },
    { name: 'Thu', sales: 2780, orders: 16 },
    { name: 'Fri', sales: 1890, orders: 11 },
    { name: 'Sat', sales: 2390, orders: 14 },
    { name: 'Sun', sales: 3490, orders: 21 },
  ]

  const monthlyData = [
    { name: 'Week 1', sales: 15000, orders: 89 },
    { name: 'Week 2', sales: 18000, orders: 105 },
    { name: 'Week 3', sales: 12000, orders: 72 },
    { name: 'Week 4', sales: 21000, orders: 125 },
  ]

  const chartData = chartPeriod === 'weekly' ? weeklyData : monthlyData

  if (loading) {
    return (
      <div className="loading">
        <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '0.75rem' }}>Loading Dashboard...</span>
      </div>
    )
  }

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

      <div className="date-filters glass-effect" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-input">
          <label>From Date</label>
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} 
          />
        </div>
        <div className="filter-input">
          <label>To Date</label>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} 
          />
        </div>
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={() => setDateRange({ start: '', end: '' })}
          style={{ alignSelf: 'flex-end' }}
        >
          Reset Filters
        </button>
      </div>

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
                  tickFormatter={(value) => `₨${value/1000}k`}
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
}

export default Dashboard
