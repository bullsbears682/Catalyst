// API Security (api/middleware/security.js)
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// Rate limiting configuration
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: message,
      retryAfter: Math.round(windowMs / 1000)
    })
  }
})

// Different rate limits for different endpoints
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
)

const calculatorLimiter = createRateLimit(
  5 * 60 * 1000, // 5 minutes
  50, // 50 calculations per 5 minutes
  'Too many calculations, please wait before trying again.'
)

const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 login attempts per 15 minutes
  'Too many authentication attempts, please try again later.'
)

const leadLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 lead submissions per hour
  'Too many form submissions, please try again later.'
)

// Helmet configuration for security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        // Remove potentially dangerous characters
        obj[key] = obj[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim()
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key])
      }
    }
  }

  if (req.body) sanitize(req.body)
  if (req.query) sanitize(req.query)
  if (req.params) sanitize(req.params)
  
  next()
}

// API key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }
  
  const validKeys = ['demo-key-2025', 'catalyst-admin-2025']
  if (!validKeys.includes(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' })
  }
  
  req.apiKey = apiKey
  next()
}

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
  if (req.apiKey !== 'catalyst-admin-2025') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

const securityMiddleware = [
  helmetConfig,
  generalLimiter,
  sanitizeInput
]

module.exports = {
  securityMiddleware,
  generalLimiter,
  calculatorLimiter,
  authLimiter,
  leadLimiter,
  validateApiKey,
  requireAdmin,
  sanitizeInput
}