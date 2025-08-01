import React, { useState } from 'react'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'

const Footer = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [showTermsOfService, setShowTermsOfService] = useState(false)

  const handleSupportClick = () => {
    window.open('mailto:support@roicalculator.com?subject=ROI Calculator Support Request&body=Hello ROI Calculator Team,%0D%0A%0D%0AI need assistance with:%0D%0A%0D%0A[Please describe your issue or question]%0D%0A%0D%0AThank you!', '_blank')
  }

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-text">
              <p>&copy; 2025 ROI Calculator. Built for business professionals.</p>
              <p className="footer-subtitle">
                Research-backed calculations to help you make better investment decisions.
              </p>
            </div>
            
            <div className="footer-links">
              <button 
                onClick={() => setShowPrivacyPolicy(true)}
                className="footer-link"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setShowTermsOfService(true)}
                className="footer-link"
              >
                Terms of Service
              </button>
              <button 
                onClick={handleSupportClick}
                className="footer-link"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showPrivacyPolicy && (
        <PrivacyPolicy onClose={() => setShowPrivacyPolicy(false)} />
      )}
      
      {showTermsOfService && (
        <TermsOfService onClose={() => setShowTermsOfService(false)} />
      )}
    </>
  )
}

export default Footer