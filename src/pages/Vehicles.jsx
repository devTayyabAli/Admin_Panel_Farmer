import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Truck, MapPin, Hash, User, MoreHorizontal, AlertCircle, Search } from 'lucide-react'

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/admin/vehicles', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      })
      setVehicles(res.data)
    } catch (err) {
      console.error('Error fetching vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

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
        <div className="search-box glass-effect">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search vehicle or broker..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

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
              <button className="btn btn-ghost btn-sm full-width">View History</button>
            </div>
          </div>
        ))}

        <div className="card add-vehicle-card">
          <AlertCircle size={32} className="text-muted" />
          <p>Vehicles are automatically registered when a sale is created.</p>
        </div>
      </div>

    </div>
  )
}

export default Vehicles
