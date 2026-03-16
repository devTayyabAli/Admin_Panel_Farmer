import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Users, 
  ShoppingBag, 
  Truck, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const fetchStats = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const params = {}
      if (dateRange.start) params.startDate = dateRange.start
      if (dateRange.end) params.endDate = dateRange.end

      const res = await axios.get('/api/admin/stats', {
        headers: { 'x-auth-token': token },
        params
      })
      setData(res.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [dateRange])

  const chartData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ]

  if (loading) return <div className="loading">Loading Dashboard...</div>
  if (!data) return <div className="loading">Error loading data. Please check connection.</div>

  const statsCards = [
    { title: 'Total Revenue', value: `₨ ${((data.stats?.totalAmount || 0) / 1000000).toFixed(2)}M`, icon: <DollarSign size={24} />, color: 'var(--primary)', trend: '+12.5%' },
    { title: 'Total Weight', value: `${((data.stats?.totalWeight || 0) / 1000).toFixed(1)} Tons`, icon: <TrendingUp size={24} />, color: 'var(--success)', trend: '+5.2%' },
    { title: 'Active Farmers', value: data.stats?.totalUsers || 0, icon: <Users size={24} />, color: 'var(--info)', trend: '+2' },
    { title: 'Total Sales', value: data.stats?.totalSales || 0, icon: <ShoppingBag size={24} />, color: 'var(--warning)', trend: '+8%' },
  ]

  return (
    <div className="dash-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Dashboard Overview</h1>
          <p className="text-secondary">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <div className="header-controls">
          <div className="date-display glass-effect">
            <Clock size={16} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="date-filters glass-effect">
            <div className="filter-input">
              <label>From</label>
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
            </div>
            <div className="filter-input">
              <label>To</label>
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
            </div>
            <button className="btn btn-ghost btn-sm reset-btn" onClick={() => setDateRange({ start: '', end: '' })}>Reset</button>
          </div>
        </div>
      </header>

      <div className="stats-grid">
        {statsCards.map((stat, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-icon" style={{ backgroundColor: `rgba(${stat.color}, 0.1)`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <span className="stat-title">{stat.title}</span>
              <h3 className="stat-value">{stat.value}</h3>
              <div className="stat-trend positive">
                <ArrowUpRight size={14} />
                <span>{stat.trend} from last month</span>
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
              <button className="btn btn-ghost btn-sm">Weekly</button>
              <button className="btn btn-ghost btn-sm">Monthly</button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="var(--primary)" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card recent-sales-card">
          <div className="chart-header">
            <h3>Recent Sales</h3>
            <button className="btn btn-ghost btn-sm">View All</button>
          </div>
          <div className="recent-sales-list">
            {data.recentSales.map((sale) => (
              <div key={sale._id} className="sale-item">
                <div className="sale-avatar">
                  {sale.userId.username.charAt(0)}
                </div>
                <div className="sale-info">
                  <span className="farmer-name">{sale.userId.username}</span>
                  <span className="vehicle-no">{sale.vehicleNo}</span>
                </div>
                <div className="sale-amount">
                  <span className="amount">₨ {(sale.totalAmount / 1000).toFixed(0)}k</span>
                  <span className="date">{new Date(sale.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
