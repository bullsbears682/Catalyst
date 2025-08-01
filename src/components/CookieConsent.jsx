import React, { useState, useEffect } from 'react'

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    const preferences = localStorage.getItem('cookiePreferences')
    
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000)
    } else if (preferences) {
      setCookiePreferences(JSON.parse(preferences))
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    }
    
    setCookiePreferences(allAccepted)
    saveCookieConsent(allAccepted)
    setShowBanner(false)
    
    // Initialize analytics and other services
    initializeServices(allAccepted)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    }
    
    setCookiePreferences(onlyNecessary)
    saveCookieConsent(onlyNecessary)
    setShowBanner(false)
    
    // Clean up any existing cookies
    cleanupCookies()
  }

  const handleCustomize = () => {
    setShowPreferences(true)
  }

  const handleSavePreferences = () => {
    saveCookieConsent(cookiePreferences)
    setShowBanner(false)
    setShowPreferences(false)
    
    // Initialize services based on preferences
    initializeServices(cookiePreferences)
  }

  const saveCookieConsent = (preferences) => {
    const consentData = {
      timestamp: new Date().toISOString(),
      preferences: preferences,
      version: '1.0'
    }
    
    localStorage.setItem('cookieConsent', JSON.stringify(consentData))
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences))
    
    // Set consent cookies
    document.cookie = `cookieConsent=true; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Strict`
    document.cookie = `cookiePreferences=${encodeURIComponent(JSON.stringify(preferences))}; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Strict`
  }

  const initializeServices = (preferences) => {
    // Initialize analytics if allowed
    if (preferences.analytics) {
      // Initialize analytics tracking
      console.log('Analytics enabled')
      // You can add Google Analytics, Mixpanel, etc. here
    }

    // Initialize functional cookies if allowed
    if (preferences.functional) {
      // Initialize functional features
      console.log('Functional cookies enabled')
    }

    // Initialize marketing cookies if allowed
    if (preferences.marketing) {
      // Initialize marketing tracking
      console.log('Marketing cookies enabled')
    }
  }

  const cleanupCookies = () => {
    // Remove analytics cookies
    document.cookie = '_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = '_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = '_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    
    // Remove other tracking cookies
    const cookiesToRemove = ['_fbp', '_fbc', 'hubspotutk', 'mixpanel']
    cookiesToRemove.forEach(cookie => {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
  }

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return // Cannot disable necessary cookies
    
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const cookieInfo = {
    necessary: {
      title: 'Necessary Cookies',
      description: 'These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      examples: 'Session cookies, authentication tokens, CSRF protection'
    },
    functional: {
      title: 'Functional Cookies',
      description: 'These cookies enhance your experience by remembering your preferences and settings.',
      examples: 'Language preferences, currency selection, form data'
    },
    analytics: {
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: 'Google Analytics, usage statistics, performance metrics'
    },
    marketing: {
      title: 'Marketing Cookies',
      description: 'These cookies are used to track visitors across websites to display relevant advertisements.',
      examples: 'Ad targeting, conversion tracking, social media pixels'
    }
  }

  if (!showBanner && !showPreferences) return null

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="cookie-banner">
          <div className="cookie-banner-content">
            <div className="cookie-banner-text">
              <h3>🍪 We Value Your Privacy</h3>
              <p>
                We use cookies to enhance your browsing experience, serve personalized content, 
                and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. 
                You can customize your preferences or learn more in our{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>.
              </p>
            </div>
            
            <div className="cookie-banner-actions">
              <button 
                onClick={handleRejectAll}
                className="btn btn-secondary btn-sm"
              >
                Reject All
              </button>
              <button 
                onClick={handleCustomize}
                className="btn btn-outline btn-sm"
              >
                Customize
              </button>
              <button 
                onClick={handleAcceptAll}
                className="btn btn-primary btn-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="modal-overlay">
          <div className="modal-content cookie-preferences-modal">
            <div className="modal-header">
              <h2>🍪 Cookie Preferences</h2>
              <button 
                onClick={() => setShowPreferences(false)}
                className="modal-close"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="cookie-preferences-intro">
                <p>
                  We respect your privacy and give you full control over your data. 
                  Choose which types of cookies you're comfortable with. You can change 
                  these settings at any time.
                </p>
              </div>

              <div className="cookie-categories">
                {Object.entries(cookieInfo).map(([key, info]) => (
                  <div key={key} className="cookie-category">
                    <div className="cookie-category-header">
                      <div className="cookie-category-title">
                        <h4>{info.title}</h4>
                        <label className="cookie-toggle">
                          <input
                            type="checkbox"
                            checked={cookiePreferences[key]}
                            onChange={() => handlePreferenceChange(key)}
                            disabled={key === 'necessary'}
                          />
                          <span className={`toggle-slider ${key === 'necessary' ? 'disabled' : ''}`}>
                            <span className="toggle-button"></span>
                          </span>
                        </label>
                      </div>
                      {key === 'necessary' && (
                        <span className="required-badge">Always Active</span>
                      )}
                    </div>
                    
                    <div className="cookie-category-description">
                      <p>{info.description}</p>
                      <details className="cookie-examples">
                        <summary>Examples</summary>
                        <p className="examples-text">{info.examples}</p>
                      </details>
                    </div>
                  </div>
                ))}
              </div>

              <div className="gdpr-compliance-info">
                <h4>🛡️ Your Rights Under GDPR</h4>
                <ul>
                  <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Portability:</strong> Transfer your data to another service</li>
                  <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                </ul>
                <p>
                  Contact us at <a href="mailto:privacy@roicalculator.com">privacy@roicalculator.com</a> to exercise your rights.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setShowPreferences(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePreferences}
                className="btn btn-primary"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Button (always visible after consent) */}
      {!showBanner && (
        <button 
          onClick={() => setShowPreferences(true)}
          className="cookie-settings-btn"
          title="Cookie Settings"
        >
          🍪
        </button>
      )}
    </>
  )
}

export default CookieConsent