import React from 'react'

const TermsOfService = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content terms-modal">
        <div className="modal-header">
          <h2>📋 Terms of Service</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <div className="modal-body">
          <div className="terms-section">
            <p><strong>Last Updated:</strong> December 15, 2024</p>
            <p><strong>Effective Date:</strong> January 1, 2025</p>
          </div>

          <div className="terms-section">
            <h3>What This Service Is</h3>
            <p>This is a business ROI calculator. You put in numbers, we give you projections based on industry data. Pretty straightforward.</p>
          </div>

          <div className="terms-section">
            <h3>What You Can Expect</h3>
            <ul>
              <li>ROI calculations based on real industry research</li>
              <li>Professional PDF reports you can share</li>
              <li>Data that's as accurate as we can make it</li>
              <li>A service that works reliably</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>What We Expect From You</h3>
            <ul>
              <li>Don't try to hack or break the service</li>
              <li>Use it for legitimate business purposes</li>
              <li>Don't spam us or other users</li>
              <li>Be reasonable with your usage</li>
            </ul>
          </div>

          <div className="terms-section">
            <h3>The Fine Print</h3>
            <p>Our ROI calculations are estimates based on industry data. Your actual results will vary. We're not financial advisors, so don't make major business decisions based solely on our calculator.</p>
            
            <p>We provide this service "as is" and can't guarantee it'll be perfect or always available. We'll do our best to keep it running smoothly.</p>
          </div>

          <div className="terms-section">
            <h3>Privacy & Data</h3>
            <p>We handle your data according to our Privacy Policy. We don't sell your information and we try to be reasonable about what we collect.</p>
          </div>

          <div className="terms-section">
            <h3>Changes to These Terms</h3>
            <p>We might update these terms occasionally. If we make major changes, we'll let you know.</p>
          </div>

          <div className="terms-section">
            <h3>Contact</h3>
            <p>Questions? Email us at <a href="mailto:legal@roicalculator.com">legal@roicalculator.com</a></p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            Got It
          </button>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService