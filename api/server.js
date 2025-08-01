// Production-Grade API Server
const express = require('express')
const cors = require('cors')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

// Import middleware and routes
const { 
  securityMiddleware, 
  calculatorLimiter, 
  leadLimiter, 
  validateApiKey, 
  requireAdmin 
} = require('./middleware/security')
const { initDatabase, insertLead, getLeads, getAnalytics } = require('./database/db')
const { calculateROI } = require('./utils/calculations')
const { sendLeadNotification } = require('./utils/email')
const { generateROIPDF } = require('./utils/pdfGenerator')

const app = express()
const PORT = process.env.PORT || 3001

// Apply security middleware
app.use(securityMiddleware)
app.use(compression())
app.use(morgan('combined'))

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-vercel-url.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

// ROI calculation endpoint
app.post('/api/calculate', calculatorLimiter, validateApiKey, async (req, res) => {
  try {
    const { investment, category, scenario, specificScenario, currency = 'USD' } = req.body

    // Validate required fields
    if (!investment || !category || !scenario) {
      return res.status(400).json({
        error: 'Missing required fields: investment, category, scenario'
      })
    }

    // Validate investment amount
    const numInvestment = Number(investment)
    if (isNaN(numInvestment) || numInvestment < 1000 || numInvestment > 100000000) {
      return res.status(400).json({
        error: 'Investment must be between $1,000 and $100,000,000'
      })
    }

    // Calculate ROI
    const roiResult = await calculateROI(
      numInvestment, 
      category, 
      scenario, 
      specificScenario,
      currency
    )

    if (!roiResult) {
      return res.status(400).json({
        error: 'Unable to calculate ROI with provided parameters'
      })
    }

    // Log calculation for analytics
    console.log(`ROI Calculation: ${numInvestment} ${currency} - ${category} - ${scenario}`)

    res.json({
      success: true,
      data: roiResult,
      timestamp: new Date().toISOString(),
      calculationId: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })

  } catch (error) {
    console.error('ROI Calculation Error:', error)
    res.status(500).json({
      error: 'Internal server error during calculation',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    })
  }
})

// Lead capture endpoint
app.post('/api/leads', leadLimiter, validateApiKey, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      message,
      roiData,
      source = 'calculator'
    } = req.body

    // Validate required fields
    if (!firstName || !lastName || !email || !company) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, company'
      })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email address format'
      })
    }

    // Insert lead into database
    const leadId = await insertLead({
      firstName,
      lastName,
      email,
      phone: phone || null,
      company,
      message: message || null,
      roiData: roiData ? JSON.stringify(roiData) : null,
      source,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      createdAt: new Date().toISOString()
    })

    // Send notification email (non-blocking)
    if (process.env.NODE_ENV === 'production') {
      sendLeadNotification({
        leadId,
        firstName,
        lastName,
        email,
        company,
        message,
        roiData
      }).catch(error => {
        console.error('Email notification error:', error)
      })
    }

    res.status(201).json({
      success: true,
      leadId,
      message: 'Lead captured successfully'
    })

  } catch (error) {
    console.error('Lead Capture Error:', error)
    res.status(500).json({
      error: 'Failed to capture lead',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    })
  }
})

// Admin endpoints
app.get('/api/admin/leads', validateApiKey, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50, search = '', dateFrom, dateTo } = req.query

    const leads = await getLeads({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      dateFrom,
      dateTo
    })

    res.json({
      success: true,
      data: leads,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin Leads Error:', error)
    res.status(500).json({
      error: 'Failed to fetch leads'
    })
  }
})

app.get('/api/admin/analytics', validateApiKey, requireAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query
    
    const analytics = await getAnalytics(period)

    res.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Admin Analytics Error:', error)
    res.status(500).json({
      error: 'Failed to fetch analytics'
    })
  }
})

// Data endpoints
app.get('/api/categories', validateApiKey, (req, res) => {
  try {
    const { roiCategories } = require('../src/data/roiData')
    
    // Transform categories for API response
    const categories = Object.entries(roiCategories).map(([key, category]) => ({
      id: key,
      name: category.name,
      description: category.description,
      scenarioCount: Object.keys(category.scenarios).length
    }))

    res.json({
      success: true,
      data: categories,
      count: categories.length
    })

  } catch (error) {
    console.error('Categories Error:', error)
    res.status(500).json({
      error: 'Failed to fetch categories'
    })
  }
})

app.get('/api/categories/:categoryId/scenarios', validateApiKey, (req, res) => {
  try {
    const { categoryId } = req.params
    const { roiCategories } = require('../src/data/roiData')
    
    const category = roiCategories[categoryId]
    if (!category) {
      return res.status(404).json({
        error: 'Category not found'
      })
    }

    const scenarios = Object.entries(category.scenarios).map(([key, scenario]) => ({
      id: key,
      name: scenario.name,
      description: scenario.description,
      averageROI: scenario.averageROI,
      timeframe: scenario.timeframe,
      researchSource: scenario.researchSource
    }))

    res.json({
      success: true,
      data: scenarios,
      category: {
        id: categoryId,
        name: category.name,
        description: category.description
      }
    })

  } catch (error) {
    console.error('Scenarios Error:', error)
    res.status(500).json({
      error: 'Failed to fetch scenarios'
    })
  }
})

// PDF export endpoint
app.post('/api/export/pdf', calculatorLimiter, validateApiKey, async (req, res) => {
  try {
    const { roiData, companyName, contactInfo } = req.body

    if (!roiData) {
      return res.status(400).json({
        error: 'ROI data is required for PDF export'
      })
    }

    // Generate PDF
    const pdfBuffer = await generateROIPDF(roiData, companyName, contactInfo)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="roi-analysis.pdf"')
    res.send(pdfBuffer)

  } catch (error) {
    console.error('PDF Export Error:', error)
    res.status(500).json({
      error: 'Failed to generate PDF'
    })
  }
})

// Currency rates endpoint
app.get('/api/currencies', validateApiKey, (req, res) => {
  try {
    const config = require('../src/config')
    
    res.json({
      success: true,
      data: config.default.CURRENCIES,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Currencies Error:', error)
    res.status(500).json({
      error: 'Failed to fetch currency data'
    })
  }
})

// Catch-all handler for React app
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err)
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  })
})

// Initialize database and start server
const startServer = async () => {
  try {
    await initDatabase()
    console.log('Database initialized successfully')
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  process.exit(0)
})

startServer()

module.exports = app