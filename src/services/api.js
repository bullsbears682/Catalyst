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

// Executive Dashboard Analytics
export const getAdvancedAnalytics = async (timeRange = '12M', filters = {}) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/analytics/advanced`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.API_KEY
      },
      body: JSON.stringify({ timeRange, filters })
    })

    if (!response.ok) {
      // Return mock data if API not available
      return generateMockAnalytics(timeRange, filters)
    }

    return await response.json()
  } catch (error) {
    console.warn('Advanced analytics API unavailable, using mock data:', error)
    return generateMockAnalytics(timeRange, filters)
  }
}

export const getBenchmarkData = async (filters = {}) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/analytics/benchmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.API_KEY
      },
      body: JSON.stringify({ filters })
    })

    if (!response.ok) {
      return generateMockBenchmarkData(filters)
    }

    return await response.json()
  } catch (error) {
    console.warn('Benchmark API unavailable, using mock data:', error)
    return generateMockBenchmarkData(filters)
  }
}

export const getPredictiveAnalytics = async (timeRange = '12M') => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/analytics/predictive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.API_KEY
      },
      body: JSON.stringify({ timeRange })
    })

    if (!response.ok) {
      return generateMockPredictiveData(timeRange)
    }

    return await response.json()
  } catch (error) {
    console.warn('Predictive analytics API unavailable, using mock data:', error)
    return generateMockPredictiveData(timeRange)
  }
}

export const exportDashboard = async (options) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}/api/export/dashboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': config.API_KEY
      },
      body: JSON.stringify(options)
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    return response
  } catch (error) {
    console.error('Dashboard export failed:', error)
    throw error
  }
}

// Mock Data Generators (for offline/demo mode)
const generateMockAnalytics = (timeRange, filters) => {
  const months = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : timeRange === '12M' ? 12 : 24
  
  return {
    totalROI: 12500000 + Math.random() * 5000000,
    roiGrowth: 15 + Math.random() * 10,
    avgPayback: 8 + Math.random() * 4,
    paybackImprovement: 12 + Math.random() * 8,
    successRate: 85 + Math.random() * 10,
    successRateChange: 5 + Math.random() * 5,
    avgRiskScore: 3.2 + Math.random() * 1.5,
    riskScoreChange: -8 + Math.random() * 4,
    roiTrend: {
      labels: Array.from({ length: months }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - months + i + 1)
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      }),
      data: Array.from({ length: months }, () => 15 + Math.random() * 25)
    },
    investmentDistribution: {
      labels: ['Digital Transformation', 'Cybersecurity', 'AI & Analytics', 'Cloud Migration', 'Process Automation'],
      data: [35, 25, 20, 12, 8]
    },
    projects: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      riskScore: 1 + Math.random() * 4,
      roi: 10 + Math.random() * 40,
      investment: 50000 + Math.random() * 500000
    })),
    portfolioRisk: {
      score: (2.5 + Math.random() * 1.5).toFixed(1),
      level: Math.random() > 0.6 ? 'medium' : Math.random() > 0.3 ? 'low' : 'high'
    },
    riskRecommendations: [
      { priority: 'high', text: 'Diversify investment portfolio across different risk categories' },
      { priority: 'medium', text: 'Implement additional security measures for high-value projects' },
      { priority: 'low', text: 'Consider increasing budget allocation for proven low-risk initiatives' }
    ]
  }
}

const generateMockBenchmarkData = (filters) => {
  return {
    industries: ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail'],
    yourPerformance: [32, 28, 35, 22, 18],
    industryAverage: [25, 22, 28, 18, 15],
    topQuartile: [45, 38, 42, 35, 28],
    insights: [
      {
        metric: 'Digital Transformation ROI',
        status: 'outperforming',
        message: 'Your digital transformation initiatives are performing 28% above industry average.',
        recommendation: 'Continue investing in digital capabilities and consider expanding successful programs.'
      },
      {
        metric: 'Cybersecurity Investment Returns',
        status: 'average',
        message: 'Security investments are meeting industry standards but have room for improvement.',
        recommendation: 'Focus on measurable security outcomes and consider advanced threat detection.'
      },
      {
        metric: 'AI Implementation Success',
        status: 'outperforming',
        message: 'AI projects are delivering exceptional results, 25% above top quartile performance.',
        recommendation: 'Scale successful AI models and explore new use cases across departments.'
      }
    ]
  }
}

const generateMockPredictiveData = (timeRange) => {
  const months = 12
  const monthLabels = Array.from({ length: months }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() + i + 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  })

  const baseROI = 25
  const historical = Array.from({ length: 6 }, (_, i) => baseROI + Math.sin(i * 0.5) * 5 + Math.random() * 3)
  const predicted = Array.from({ length: months }, (_, i) => baseROI + Math.sin((i + 6) * 0.5) * 5 + (i * 0.5))
  
  return {
    months: monthLabels,
    historical: [...historical, ...Array(months - historical.length).fill(null)],
    predicted: [...Array(6).fill(null), ...predicted.slice(6)],
    confidenceInterval: [...Array(6).fill(null), ...predicted.slice(6).map(val => val + 3)],
    insights: [
      {
        title: 'ROI Growth Trajectory',
        description: 'Based on current trends, ROI is expected to increase by 15-20% over the next 12 months.',
        confidence: 85
      },
      {
        title: 'Market Expansion Opportunity',
        description: 'Emerging technologies show potential for 30% higher returns in Q3-Q4.',
        confidence: 72
      },
      {
        title: 'Risk Mitigation Impact',
        description: 'Implementing recommended risk controls could improve ROI stability by 25%.',
        confidence: 90
      }
    ]
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
  errorHandler,
  getAdvancedAnalytics,
  getBenchmarkData,
  getPredictiveAnalytics,
  exportDashboard
}