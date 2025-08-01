// src/config.js - Production Ready Configuration
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-railway-url.up.railway.app' 
    : 'http://localhost:3001',
  API_KEY: 'demo-key-2025',
  ADMIN_API_KEY: 'catalyst-admin-2025',
  API_TIMEOUT: 5000,
  FEATURES: {
    API_INTEGRATION: true,
    LOCAL_FALLBACK: true,
    ANALYTICS_TRACKING: true,
    LEAD_CAPTURE: true,
    PWA_FEATURES: true,
    MULTI_CURRENCY: true
  },
  CURRENCIES: {
    USD: { symbol: '$', rate: 1.0, name: 'US Dollar' },
    EUR: { symbol: '€', rate: 0.85, name: 'Euro' },
    GBP: { symbol: '£', rate: 0.73, name: 'British Pound' },
    CAD: { symbol: 'C$', rate: 1.25, name: 'Canadian Dollar' },
    AUD: { symbol: 'A$', rate: 1.35, name: 'Australian Dollar' },
    JPY: { symbol: '¥', rate: 110.0, name: 'Japanese Yen' }
  },
  ADMIN_PASSWORD: 'CatalystROI2025',
  PERFORMANCE_TARGETS: {
    PAGE_LOAD_TIME: 3000, // 3 seconds
    LIGHTHOUSE_PERFORMANCE: 90,
    LIGHTHOUSE_ACCESSIBILITY: 95,
    LIGHTHOUSE_BEST_PRACTICES: 90,
    LIGHTHOUSE_SEO: 90
  }
}

export default config