import React, { useState } from 'react'

const Header = ({ 
  currentView, 
  onViewChange, 
  onAdminAuth, 
  adminPassword,
  onAdminPasswordChange,
  adminAuthenticated,
  installPrompt,
  onPWAInstall,
  isOnline 
}) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const handleAdminSubmit = (e) => {
    e.preventDefault()
    onAdminAuth(adminPassword)
    setShowAdminLogin(false)
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content flex items-center justify-between">
          {/* Logo and Title */}
          <div className="header-brand flex items-center">
            <div className="brand-icon">🧡</div>
            <div className="brand-text">
              <h1 className="brand-title">HubSpot ROI Calculator</h1>
              <p className="brand-subtitle">Grow Better with Data-Driven Decisions</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="header-nav flex items-center space-x-4">
            <button
              className={`nav-btn ${currentView === 'calculator' ? 'active' : ''}`}
              onClick={() => onViewChange('calculator')}
            >
              Calculator
            </button>
            
            {/* Show Back to Calculator button only when in admin view */}
            {currentView === 'admin' && (
              <button
                className="nav-btn"
                onClick={() => {
                  onViewChange('calculator')
                  window.history.pushState({}, '', '/')
                }}
              >
                ← Back to Calculator
              </button>
            )}

            {/* PWA Install Button */}
            {installPrompt && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={onPWAInstall}
                id="pwa-install-button"
              >
                📱 Install App
              </button>
            )}

            {/* Online/Offline Indicator */}
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? '🟢' : '🔴'}
            </div>

            {/* Admin Access - Hidden, only accessible via URL */}
            {currentView === 'admin' && !adminAuthenticated && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAdminLogin(true)}
              >
                🔐 Admin Login
              </button>
            )}
            
            {currentView === 'admin' && adminAuthenticated && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onViewChange('calculator')
                  // You might want to add a logout function here
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="modal-backdrop" onClick={() => setShowAdminLogin(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Admin Access</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowAdminLogin(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAdminSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="admin-password" className="form-label">
                      Admin Password
                    </label>
                    <input
                      id="admin-password"
                      type="password"
                      className="form-input"
                      value={adminPassword}
                      onChange={(e) => onAdminPasswordChange(e.target.value)}
                      placeholder="Enter admin password"
                      autoFocus
                    />
                    <small className="form-help">
                      Default password: CatalystROI2025
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowAdminLogin(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!adminPassword}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header