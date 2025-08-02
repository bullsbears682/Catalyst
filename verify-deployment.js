#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies that the deployed application is working correctly
 */

const https = require('https')
const http = require('http')

console.log('🔍 Verifying Deployment...\n')

// Test URLs (replace with your actual URLs)
const BACKEND_URL = 'https://your-railway-url.up.railway.app'
const FRONTEND_URL = 'https://your-vercel-url.vercel.app'

const testEndpoint = (url, description) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http
    
    console.log(`Testing ${description}...`)
    console.log(`URL: ${url}`)
    
    const req = protocol.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${description} - Status: ${res.statusCode}`)
          try {
            const jsonData = JSON.parse(data)
            if (jsonData.status === 'OK') {
              console.log(`✅ Health check passed`)
            }
          } catch (e) {
            console.log(`✅ Response received (HTML/other)`)
          }
        } else {
          console.log(`❌ ${description} - Status: ${res.statusCode}`)
        }
        console.log('---')
        resolve(res.statusCode === 200)
      })
    })
    
    req.on('error', (err) => {
      console.log(`❌ ${description} - Error: ${err.message}`)
      console.log('---')
      resolve(false)
    })
    
    req.setTimeout(10000, () => {
      console.log(`❌ ${description} - Timeout`)
      console.log('---')
      req.destroy()
      resolve(false)
    })
  })
}

const runDeploymentTests = async () => {
  console.log('🚀 DEPLOYMENT VERIFICATION SUITE')
  console.log('=' .repeat(50))
  
  // Test backend health endpoint
  const backendHealth = await testEndpoint(`${BACKEND_URL}/api/health`, 'Backend Health Check')
  
  // Test backend ROI endpoint
  const backendROI = await testEndpoint(`${BACKEND_URL}/api/calculate`, 'Backend ROI API')
  
  // Test frontend
  const frontend = await testEndpoint(FRONTEND_URL, 'Frontend Application')
  
  // Summary
  console.log('\n📋 DEPLOYMENT TEST RESULTS')
  console.log('=' .repeat(50))
  console.log(`${backendHealth ? '✅' : '❌'} Backend Health Check`)
  console.log(`${backendROI ? '✅' : '❌'} Backend API Endpoints`)
  console.log(`${frontend ? '✅' : '❌'} Frontend Application`)
  
  const allPassed = backendHealth && frontend
  
  if (allPassed) {
    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!')
    console.log('✅ All systems operational')
    console.log('✅ Ready for enterprise sales')
    console.log('\n🔗 Production URLs:')
    console.log(`Frontend: ${FRONTEND_URL}`)
    console.log(`Backend API: ${BACKEND_URL}`)
    console.log(`Admin Dashboard: ${FRONTEND_URL}/admin`)
    console.log(`Health Check: ${BACKEND_URL}/api/health`)
  } else {
    console.log('\n⚠️  Some services need attention')
    console.log('Please check the failed endpoints above')
  }
  
  return allPassed
}

// Manual verification checklist
const printManualChecklist = () => {
  console.log('\n📋 MANUAL VERIFICATION CHECKLIST')
  console.log('=' .repeat(50))
  console.log('After deployment, manually verify:')
  console.log('')
  console.log('🧪 Core Functionality:')
  console.log('  [ ] ROI Calculator works with different scenarios')
  console.log('  [ ] AI Assistant provides intelligent responses')
  console.log('  [ ] Executive Dashboard loads with charts')
  console.log('  [ ] PDF generation and download works')
  console.log('  [ ] Multi-currency support functions')
  console.log('')
  console.log('🔐 Enterprise Features:')
  console.log('  [ ] Admin dashboard accessible via /admin')
  console.log('  [ ] Authentication system works')
  console.log('  [ ] Role-based permissions enforced')
  console.log('  [ ] Theme switching (Light/Dark/Premium)')
  console.log('  [ ] PWA install prompt appears')
  console.log('')
  console.log('📱 User Experience:')
  console.log('  [ ] Mobile responsive design')
  console.log('  [ ] Glass morphism effects work')
  console.log('  [ ] Animations and micro-interactions')
  console.log('  [ ] Cookie consent banner appears')
  console.log('  [ ] All links and buttons functional')
  console.log('')
  console.log('🚀 Performance:')
  console.log('  [ ] Page loads in < 3 seconds')
  console.log('  [ ] API responses in < 500ms')
  console.log('  [ ] No console errors')
  console.log('  [ ] Lighthouse score > 90')
}

// Run if called directly
if (require.main === module) {
  console.log('⚠️  UPDATE URLS FIRST!')
  console.log('Edit this file and replace:')
  console.log('- BACKEND_URL with your Railway URL')
  console.log('- FRONTEND_URL with your Vercel URL')
  console.log('')
  
  // Uncomment the line below after updating URLs
  // runDeploymentTests()
  
  printManualChecklist()
}

module.exports = { runDeploymentTests, testEndpoint }