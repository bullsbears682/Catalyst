import React, { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'

// Import components (we'll create these)
import Header from './components/Header'
import Calculator from './components/Calculator'
import Results from './components/Results'
import LeadForm from './components/LeadForm'
import AdminDashboard from './components/AdminDashboard'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import SuccessMessage from './components/SuccessMessage'

// Import utilities
import { validateInputs } from './utils/validation'
import { roiCategories, roiScenarios, calculateROI } from './data/roiData'
import config from './config'

// API service
import * as apiService from './services/api'

function App() {
  // Core state
  const [currentView, setCurrentView] = useState('calculator')
  
  // Check URL for admin access
  useEffect(() => {
    const path = window.location.pathname
    if (path === '/admin' || path === '/dashboard') {
      setCurrentView('admin')
    }
  }, []) // calculator, results, admin
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  // Calculator state
  const [formData, setFormData] = useState({
    investment: '',
    category: '',
    scenario: 'realistic',
    specificScenario: '',
    currency: 'USD'
  })
  
  // Results state
  const [roiResults, setRoiResults] = useState(null)
  const [calculationHistory, setCalculationHistory] = useState([])
  
  // Admin state
  const [adminAuthenticated, setAdminAuthenticated] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  
  // UI state
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState(null)

  // Load calculation history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('roi-calculation-history')
      if (savedHistory) {
        setCalculationHistory(JSON.parse(savedHistory))
      }
    } catch (error) {
      console.error('Failed to load calculation history:', error)
    }
  }, [])

  // Save calculation history to localStorage
  const saveCalculationHistory = useCallback((newCalculation) => {
    try {
      const updatedHistory = [newCalculation, ...calculationHistory.slice(0, 9)] // Keep last 10
      setCalculationHistory(updatedHistory)
      localStorage.setItem('roi-calculation-history', JSON.stringify(updatedHistory))
    } catch (error) {
      console.error('Failed to save calculation history:', error)
    }
  }, [calculationHistory])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Clear messages after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  // Handle form input changes
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Reset specific scenario when category changes
      if (field === 'category') {
        newData.specificScenario = ''
      }
      
      return newData
    })
    
    // Clear any existing errors
    if (error) setError(null)
  }, [error])

  // Calculate ROI
  const calculateROIHandler = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Validate inputs
      const validation = validateInputs(
        formData.investment,
        formData.category,
        formData.scenario,
        formData.specificScenario
      )
      
      if (!validation.isValid) {
        throw new Error(validation.errors[0])
      }
      
      let result
      
      // Try API first if online
      if (isOnline && config.FEATURES.API_INTEGRATION) {
        try {
          result = await apiService.calculateROI({
            investment: Number(formData.investment),
            category: formData.category,
            scenario: formData.scenario,
            specificScenario: formData.specificScenario,
            currency: formData.currency
          })
        } catch (apiError) {
          console.warn('API calculation failed, falling back to local:', apiError)
          
          // Fallback to local calculation
          if (config.FEATURES.LOCAL_FALLBACK) {
            result = calculateROI(
              Number(formData.investment),
              formData.category,
              formData.scenario,
              formData.specificScenario
            )
          } else {
            throw apiError
          }
        }
      } else {
        // Use local calculation
        result = calculateROI(
          Number(formData.investment),
          formData.category,
          formData.scenario,
          formData.specificScenario
        )
      }
      
      if (!result) {
        throw new Error('Unable to calculate ROI with the provided parameters')
      }
      
      // Set results and save to history
      setRoiResults(result)
      saveCalculationHistory({
        ...result,
        timestamp: new Date().toISOString(),
        inputData: { ...formData }
      })
      
      // Switch to results view
      setCurrentView('results')
      
      // Show success message
      setSuccess('ROI calculation completed successfully!')
      
    } catch (error) {
      console.error('ROI calculation error:', error)
      setError(error.message || 'Failed to calculate ROI. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [formData, isOnline, saveCalculationHistory])

  // Handle lead form submission
  const handleLeadSubmission = useCallback(async (leadData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (isOnline && config.FEATURES.LEAD_CAPTURE) {
        await apiService.submitLead({
          ...leadData,
          roiData: roiResults
        })
        
        setSuccess('Thank you! We\'ll be in touch within 24 hours.')
        setShowLeadForm(false)
      } else {
        // Offline fallback - save to localStorage
        const offlineLeads = JSON.parse(localStorage.getItem('offline-leads') || '[]')
        offlineLeads.push({
          ...leadData,
          roiData: roiResults,
          timestamp: new Date().toISOString(),
          status: 'offline'
        })
        localStorage.setItem('offline-leads', JSON.stringify(offlineLeads))
        
        setSuccess('Lead saved offline. We\'ll process it when you\'re back online.')
        setShowLeadForm(false)
      }
    } catch (error) {
      console.error('Lead submission error:', error)
      setError('Failed to submit lead. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [isOnline, roiResults])

  // Handle admin authentication
  const handleAdminAuth = useCallback(async (password) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (password === config.ADMIN_PASSWORD) {
        setAdminAuthenticated(true)
        setCurrentView('admin')
        setSuccess('Admin access granted')
      } else {
        throw new Error('Invalid admin password')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
      setAdminPassword('')
    }
  }, [])

  // Handle PWA installation
  const handlePWAInstall = useCallback(async () => {
    if (installPrompt) {
      installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        setSuccess('App installed successfully!')
      }
      
      setInstallPrompt(null)
    }
  }, [installPrompt])

  // Get available scenarios for selected category
  const availableScenarios = useMemo(() => {
    if (!formData.category || !roiCategories[formData.category]) {
      return []
    }
    
    return Object.entries(roiCategories[formData.category].scenarios).map(([key, scenario]) => ({
      id: key,
      name: scenario.name,
      description: scenario.description
    }))
  }, [formData.category])

  // Check if form is valid
  const isFormValid = useMemo(() => {
    return formData.investment && 
           formData.category && 
           formData.scenario &&
           Number(formData.investment) >= 1000
  }, [formData])

  return (
    <div className="app" id="main-content">
      {/* Header */}
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        onAdminAuth={handleAdminAuth}
        adminPassword={adminPassword}
        onAdminPasswordChange={setAdminPassword}
        adminAuthenticated={adminAuthenticated}
        installPrompt={installPrompt}
        onPWAInstall={handlePWAInstall}
        isOnline={isOnline}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Loading Overlay */}
        {isLoading && <LoadingSpinner />}
        
        {/* Error Messages */}
        {error && (
          <ErrorMessage 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        {/* Success Messages */}
        {success && (
          <SuccessMessage 
            message={success} 
            onClose={() => setSuccess(null)} 
          />
        )}

        {/* Calculator View */}
        {currentView === 'calculator' && (
          <Calculator
            formData={formData}
            onInputChange={handleInputChange}
            onCalculate={calculateROIHandler}
            availableScenarios={availableScenarios}
            isFormValid={isFormValid}
            isLoading={isLoading}
            calculationHistory={calculationHistory}
            onLoadFromHistory={(calculation) => {
              setFormData(calculation.inputData)
              setRoiResults(calculation)
              setCurrentView('results')
            }}
          />
        )}

        {/* Results View */}
        {currentView === 'results' && roiResults && (
          <Results
            results={roiResults}
            onNewCalculation={() => {
              setCurrentView('calculator')
              setRoiResults(null)
            }}
            onShowLeadForm={() => setShowLeadForm(true)}
            onExportPDF={() => {
              // PDF export functionality
              if (config.FEATURES.API_INTEGRATION && isOnline) {
                apiService.exportPDF(roiResults)
              } else {
                setError('PDF export requires internet connection')
              }
            }}
          />
        )}

        {/* Admin Dashboard */}
        {currentView === 'admin' && adminAuthenticated && (
          <AdminDashboard
            onLogout={() => {
              setAdminAuthenticated(false)
              setCurrentView('calculator')
            }}
          />
        )}

        {/* Lead Form Modal */}
        {showLeadForm && (
          <LeadForm
            onSubmit={handleLeadSubmission}
            onClose={() => setShowLeadForm(false)}
            roiResults={roiResults}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* GDPR Cookie Consent */}
      <CookieConsent />

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="offline-indicator">
          <span>📵 Offline Mode - Limited functionality available</span>
        </div>
      )}
    </div>
  )
}

export default App