import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Truck, 
  MapPin, 
  Hash, 
  User, 
  MoreHorizontal, 
  AlertCircle, 
  Search,
  Eye,
  History,
  X,
  ChevronRight,
  Calendar,
  DollarSign,
  RefreshCw,
  Plus
} from 'lucide-react'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [vehicleHistory, setVehicleHistory] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/admin/vehicles', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setVehicles(res.data)
    } catch (err) {
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchVehicles()
  }

  const fetchVehicleHistory = async (vehicleNumber) => {
    try {
      const res = await axios.get('/admin/sales', {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        params: { vehicleNo: vehicleNumber }
      })
      setVehicleHistory(res.data)
    } catch (err) {
      console.error('Error fetching vehicle history:', err)
    }
  }

  const viewHistory = (vehicle) => {
    setSelectedVehicle(vehicle)
    fetchVehicleHistory(vehicle.vehicleNumber)
    setShowHistoryModal(true)
  }

  const filteredVehicles = vehicles.filter(v =>
    (v.vehicleNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (v.brokerName?.toLowerCase() || '').includes(search.toLowerCase())
  )

  return (
    <div className="vehicles-page">
      <header className="page-header">
        <div>
          <h1 className="gradient-text">Registered Vehicles ({filteredVehicles.length})</h1>
          <p className="text-secondary">Track all vehicles and their associated brokers.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div className="search-box" style={{ minWidth: '280px' }}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search vehicle or broker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={18} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </header>

      {loading ? (
        <div className="loading">
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '0.75rem' }}>Loading vehicles...</span>
        </div>
      ) : (
        <div className="vehicles-grid">
          {filteredVehicles.map(vehicle => (
            <div key={vehicle._id} className="card vehicle-card">
              <div className="card-top">
                <div className="vehicle-icon">
                  <Truck size={24} />
                </div>
                <button className="btn-icon transparent">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <div className="card-body">
                <h2 className="vehicle-number">{vehicle.vehicleNumber}</h2>
                <p className="broker-name">Broker: {vehicle.brokerName}</p>

                <div className="details-list">
                  {vehicle.houseNo && (
                    <div className="detail-item">
                      <MapPin size={16} />
                      <span>House: {vehicle.houseNo}</span>
                    </div>
                  )}
                  {vehicle.flockNo && (
                    <div className="detail-item">
                      <Hash size={16} />
                      <span>Flock: {vehicle.flockNo}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <User size={16} />
                    <span>Created By: {vehicle.createdBy?.username || 'System'}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="btn btn-ghost btn-sm full-width" 
                  onClick={() => viewHistory(vehicle)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <History size={16} />
                  View History
                </button>
              </div>
            </div>
          ))}

          <div className="card add-vehicle-card">
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'var(--primary-light)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '0.5rem'
            }}>
              <Truck size={32} style={{ color: 'var(--primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Vehicles</h3>
            <p>Vehicles are automatically registered when a sale is created.</p>
          </div>
        </div>
      )}

      {/* Vehicle History Modal */}
      {showHistoryModal && selectedVehicle && (
        <div className="modal-overlay" onClick={() => setShowHistoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ marginBottom: '0.25rem' }}>Vehicle History</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{selectedVehicle.vehicleNumber} - {selectedVehicle.brokerName}</p>
              </div>
              <button className="icon-btn-sm" onClick={() => setShowHistoryModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {vehicleHistory.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {vehicleHistory.map((sale, index) => (
                    <div 
                      key={sale._id} 
                      style={{ 
                        padding: '1rem', 
                        background: 'var(--bg-body)', 
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <span style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '0.25rem',
                            fontSize: '0.75rem', 
                            color: 'var(--text-muted)',
                            marginBottom: '0.25rem'
                          }}>
                            <Calendar size={12} />
                            {new Date(sale.date).toLocaleDateString()}
                          </span>
                          <h4 style={{ fontSize: '1rem' }}>{sale.userId?.username || 'Unknown Farmer'}</h4>
                        </div>
                        <span className={`badge ${sale.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {sale.status || 'pending'}
                        </span>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(3, 1fr)', 
                        gap: '0.75rem',
                        padding: '0.75rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weight</span>
                          <p style={{ fontWeight: 600 }}>{sale.netWeight?.toLocaleString()} kg</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate</span>
                          <p style={{ fontWeight: 600 }}>₨ {sale.rate}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Amount</span>
                          <p style={{ fontWeight: 600, color: 'var(--success)' }}>₨ {sale.totalAmount?.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <History size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>No history found for this vehicle.</p>
                </div>
              )}
            </div>
            
            <div className="modal-actions" style={{ marginTop: '1rem' }}>
              <button className="btn btn-ghost full-width" onClick={() => setShowHistoryModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Vehicles
