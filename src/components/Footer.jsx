import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>&copy; 2025 ROI Calculator Enterprise. Professional business analysis tools.</p>
            <p className="footer-subtitle">
              Built with research-backed data for enterprise decision makers.
            </p>
          </div>
          
          <div className="footer-links">
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <a href="#terms" className="footer-link">Terms of Service</a>
            <a href="#support" className="footer-link">Support</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer