import React from 'react'

const AdminDashboard = ({ onLogout }) => {
  return (
    <div className="admin-dashboard">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Admin Dashboard</h2>
          <p className="card-description">
            Manage leads and view analytics
          </p>
        </div>

        <div className="admin-content">
          <div className="admin-stats grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat-card">
              <div className="stat-label">Total Leads</div>
              <div className="stat-value">0</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">Calculations Today</div>
              <div className="stat-value">0</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-label">Conversion Rate</div>
              <div className="stat-value">0%</div>
            </div>
          </div>

          <div className="admin-actions">
            <p className="text-gray-600">
              Admin dashboard functionality will be implemented in the full version.
              This includes lead management, analytics, and reporting features.
            </p>
          </div>
        </div>

        <div className="admin-footer">
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard