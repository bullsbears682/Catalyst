import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('React Error Boundary caught an error:', error, errorInfo)
    }
    
    // In production, you might want to log to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h1>Something went wrong</h1>
            <p>We're sorry, but something unexpected happened.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="error-reload-btn"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Performance monitoring
const measurePerformance = () => {
  // Measure First Contentful Paint
  if ('performance' in window && 'getEntriesByType' in performance) {
    const paintEntries = performance.getEntriesByType('paint')
    paintEntries.forEach(entry => {
      console.log(`${entry.name}: ${entry.startTime}ms`)
    })
  }

  // Measure Core Web Vitals
  if ('web-vital' in window) {
    // This would be implemented with web-vitals library in production
    // import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'
  }
}

// Initialize performance monitoring
if (process.env.NODE_ENV === 'production') {
  measurePerformance()
}

// React 18 Concurrent Features
const root = ReactDOM.createRoot(document.getElementById('root'))

// Render app with error boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// Register service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                if (confirm('New version available! Refresh to update?')) {
                  window.location.reload()
                }
              }
            })
          }
        })
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}

// PWA install prompt
let deferredPrompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredPrompt = e
  
  // Show custom install button
  const installButton = document.getElementById('pwa-install-button')
  if (installButton) {
    installButton.style.display = 'block'
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)
        deferredPrompt = null
        installButton.style.display = 'none'
      }
    })
  }
})

// Track PWA installation
window.addEventListener('appinstalled', (evt) => {
  console.log('PWA was installed')
  // Analytics tracking could go here
})

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a')
  skipLink.href = '#main-content'
  skipLink.textContent = 'Skip to main content'
  skipLink.className = 'skip-link'
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: #667eea;
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10000;
    transition: top 0.3s;
  `
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px'
  })
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px'
  })
  
  document.body.insertBefore(skipLink, document.body.firstChild)
})

// Handle online/offline status
window.addEventListener('online', () => {
  console.log('App is online')
  document.body.classList.remove('offline')
})

window.addEventListener('offline', () => {
  console.log('App is offline')
  document.body.classList.add('offline')
})

// Prevent zoom on iOS
document.addEventListener('gesturestart', (e) => {
  e.preventDefault()
})

// Handle viewport changes for mobile
const handleViewportChange = () => {
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
}

window.addEventListener('resize', handleViewportChange)
window.addEventListener('orientationchange', handleViewportChange)
handleViewportChange()

export default App