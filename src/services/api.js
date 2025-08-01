// API Service - Frontend to Backend Communication
import config from '../config'

const API_BASE_URL = config.API_BASE_URL
const API_KEY = config.API_KEY
const API_TIMEOUT = config.API_TIMEOUT

// Create fetch wrapper with timeout and error handling
const fetchWithTimeout = async (url, options = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        ...options.headers
      }
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your connection')
    }
    
    throw error
  }
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health`)
    return response
  } catch (error) {
    console.error('Health check failed:', error)
    throw error
  }
}

// Calculate ROI
export const calculateROI = async (calculationData) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/calculate`, {
      method: 'POST',
      body: JSON.stringify(calculationData)
    })
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.error || 'Calculation failed')
    }
  } catch (error) {
    console.error('ROI calculation API error:', error)
    throw error
  }
}

// Submit lead
export const submitLead = async (leadData) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/leads`, {
      method: 'POST',
      body: JSON.stringify(leadData)
    })
    
    if (response.success) {
      return response
    } else {
      throw new Error(response.error || 'Lead submission failed')
    }
  } catch (error) {
    console.error('Lead submission API error:', error)
    throw error
  }
}

// Get categories
export const getCategories = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/categories`)
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.error || 'Failed to fetch categories')
    }
  } catch (error) {
    console.error('Get categories API error:', error)
    throw error
  }
}

// Get scenarios for category
export const getCategoryScenarios = async (categoryId) => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/categories/${categoryId}/scenarios`)
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.error || 'Failed to fetch scenarios')
    }
  } catch (error) {
    console.error('Get scenarios API error:', error)
    throw error
  }
}

// Export PDF
export const exportPDF = async (roiData, companyName = '', contactInfo = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/export/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        roiData,
        companyName,
        contactInfo
      })
    })
    
    if (!response.ok) {
      throw new Error('PDF export failed')
    }
    
    // Handle file download
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roi-analysis-${Date.now()}.pdf`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
    
    return { success: true }
  } catch (error) {
    console.error('PDF export API error:', error)
    throw error
  }
}

// Get currency rates
export const getCurrencyRates = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/currencies`)
    
    if (response.success) {
      return response.data
    } else {
      throw new Error(response.error || 'Failed to fetch currency rates')
    }
  } catch (error) {
    console.error('Get currency rates API error:', error)
    throw error
  }
}

// Admin API functions
export const adminAPI = {
  // Get leads
  getLeads: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString()
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/admin/leads?${queryString}`,
        {
          headers: {
            'x-api-key': config.ADMIN_API_KEY
          }
        }
      )
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch leads')
      }
    } catch (error) {
      console.error('Get leads API error:', error)
      throw error
    }
  },
  
  // Get analytics
  getAnalytics: async (period = '30d') => {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/api/admin/analytics?period=${period}`,
        {
          headers: {
            'x-api-key': config.ADMIN_API_KEY
          }
        }
      )
      
      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error || 'Failed to fetch analytics')
      }
    } catch (error) {
      console.error('Get analytics API error:', error)
      throw error
    }
  }
}

// Offline support utilities
export const offlineUtils = {
  // Save data for later sync
  saveForSync: (type, data) => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline-sync-queue') || '[]')
      offlineData.push({
        type,
        data,
        timestamp: new Date().toISOString(),
        id: Date.now() + Math.random()
      })
      localStorage.setItem('offline-sync-queue', JSON.stringify(offlineData))
    } catch (error) {
      console.error('Failed to save offline data:', error)
    }
  },
  
  // Sync offline data when back online
  syncOfflineData: async () => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline-sync-queue') || '[]')
      
      if (offlineData.length === 0) return
      
      const syncPromises = offlineData.map(async (item) => {
        try {
          switch (item.type) {
            case 'lead':
              await submitLead(item.data)
              break
            case 'calculation':
              // Analytics tracking could go here
              break
            default:
              console.warn('Unknown offline sync type:', item.type)
          }
          return { success: true, id: item.id }
        } catch (error) {
          console.error('Failed to sync item:', item, error)
          return { success: false, id: item.id, error }
        }
      })
      
      const results = await Promise.allSettled(syncPromises)
      
      // Remove successfully synced items
      const remainingData = offlineData.filter(item => {
        const result = results.find(r => r.value?.id === item.id)
        return result?.value?.success !== true
      })
      
      localStorage.setItem('offline-sync-queue', JSON.stringify(remainingData))
      
      return {
        synced: results.filter(r => r.value?.success).length,
        failed: results.filter(r => !r.value?.success).length
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error)
      throw error
    }
  },
  
  // Get offline queue count
  getOfflineQueueCount: () => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('offline-sync-queue') || '[]')
      return offlineData.length
    } catch (error) {
      return 0
    }
  }
}

// Network status monitoring
export const networkMonitor = {
  // Check if online
  isOnline: () => navigator.onLine,
  
  // Add online/offline listeners
  addListeners: (onOnline, onOffline) => {
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  },
  
  // Test actual connectivity (not just navigator.onLine)
  testConnectivity: async () => {
    try {
      await healthCheck()
      return true
    } catch (error) {
      return false
    }
  }
}

// Error handling utilities
export const errorHandler = {
  // Categorize errors
  categorizeError: (error) => {
    if (error.message?.includes('timeout')) {
      return 'timeout'
    } else if (error.message?.includes('network') || error.name === 'NetworkError') {
      return 'network'
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
      return 'auth'
    } else if (error.message?.includes('400')) {
      return 'validation'
    } else if (error.message?.includes('500')) {
      return 'server'
    } else {
      return 'unknown'
    }
  },
  
  // Get user-friendly error message
  getUserMessage: (error) => {
    const category = errorHandler.categorizeError(error)
    
    switch (category) {
      case 'timeout':
        return 'Request timed out. Please check your connection and try again.'
      case 'network':
        return 'Network error. Please check your internet connection.'
      case 'auth':
        return 'Authentication failed. Please refresh the page and try again.'
      case 'validation':
        return 'Invalid input. Please check your data and try again.'
      case 'server':
        return 'Server error. Please try again later.'
      default:
        return error.message || 'An unexpected error occurred.'
    }
  }
}

export default {
  healthCheck,
  calculateROI,
  submitLead,
  getCategories,
  getCategoryScenarios,
  exportPDF,
  getCurrencyRates,
  adminAPI,
  offlineUtils,
  networkMonitor,
  errorHandler
}