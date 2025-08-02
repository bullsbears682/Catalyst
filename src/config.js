// src/config.js - Production Ready Configuration
const config = {
  API_BASE_URL: process.env.NODE_ENV === 'production'
    ? (import.meta.env.VITE_API_URL || 'https://web-production-xxxx.up.railway.app') // Replace with your Railway URL
    : 'http://localhost:3001',
  API_KEY: 'demo-key-2025',
  ADMIN_API_KEY: 'catalyst-admin-2025',
  
  // Production optimizations
  ENABLE_ANALYTICS: process.env.NODE_ENV === 'production',
  ENABLE_ERROR_REPORTING: process.env.NODE_ENV === 'production',
  CACHE_DURATION: process.env.NODE_ENV === 'production' ? 300000 : 0, // 5 minutes in production
  MAX_RETRIES: 3,
  
  // Feature flags
  ENABLE_AI_FEATURES: true,
  ENABLE_EXECUTIVE_DASHBOARD: true,
  ENABLE_ENTERPRISE_AUTH: true,
  ENABLE_PWA_FEATURES: true,
  
  // UI Configuration
  DEFAULT_THEME: 'light',
  ENABLE_GLASS_MORPHISM: true,
  ENABLE_ANIMATIONS: true,
  
  // Business Configuration
  COMPANY_NAME: 'ROI Calculator Enterprise',
  SUPPORT_EMAIL: 'support@roi-calculator.com',
  VERSION: '2.0.0',
  
  // Performance settings
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 20,
  CHART_ANIMATION_DURATION: 750
}

export default config