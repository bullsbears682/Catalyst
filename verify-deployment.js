#!/usr/bin/env node
// Deployment Verification Script - ROI Calculator Enterprise

const fs = require('fs')
const path = require('path')

console.log('🚀 ROI Calculator Enterprise - Deployment Verification\n')

const checks = []

// Check 1: Package.json exists and has required dependencies
console.log('📦 Checking package.json...')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  
  const requiredDeps = [
    'react', 'react-dom', 'express', 'helmet', 'sqlite3', 
    'nodemailer', 'puppeteer', 'cors', 'compression'
  ]
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  )
  
  if (missingDeps.length === 0) {
    console.log('✅ All required dependencies present')
    checks.push({ name: 'Dependencies', status: 'pass' })
  } else {
    console.log(`❌ Missing dependencies: ${missingDeps.join(', ')}`)
    checks.push({ name: 'Dependencies', status: 'fail', details: missingDeps })
  }
} catch (error) {
  console.log('❌ package.json not found or invalid')
  checks.push({ name: 'Dependencies', status: 'fail', details: 'package.json missing' })
}

// Check 2: Core files exist
console.log('\n📁 Checking core files...')
const coreFiles = [
  'index.html',
  'src/main.jsx',
  'src/App.jsx',
  'src/config.js',
  'src/data/roiData.js',
  'src/utils/validation.js',
  'src/services/api.js',
  'api/server.js',
  'api/database/db.js',
  'api/middleware/security.js',
  'railway.json',
  'vite.config.js'
]

let allFilesExist = true
coreFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    allFilesExist = false
  }
})

checks.push({ 
  name: 'Core Files', 
  status: allFilesExist ? 'pass' : 'fail',
  details: allFilesExist ? 'All files present' : 'Some files missing'
})

// Check 3: ROI Data validation
console.log('\n📊 Checking ROI data...')
try {
  const { roiCategories, roiScenarios } = require('./src/data/roiData.js')
  
  const categoryCount = Object.keys(roiCategories).length
  const scenarioCount = Object.keys(roiScenarios).length
  
  let totalScenarios = 0
  Object.values(roiCategories).forEach(category => {
    totalScenarios += Object.keys(category.scenarios).length
  })
  
  console.log(`✅ Categories: ${categoryCount}`)
  console.log(`✅ Base scenarios: ${scenarioCount}`)
  console.log(`✅ Total specific scenarios: ${totalScenarios}`)
  
  if (totalScenarios >= 85) {
    console.log('✅ 85+ scenarios requirement met')
    checks.push({ name: 'ROI Data', status: 'pass', details: `${totalScenarios} scenarios` })
  } else {
    console.log(`❌ Only ${totalScenarios} scenarios (need 85+)`)
    checks.push({ name: 'ROI Data', status: 'fail', details: `Only ${totalScenarios} scenarios` })
  }
} catch (error) {
  console.log('❌ ROI data validation failed:', error.message)
  checks.push({ name: 'ROI Data', status: 'fail', details: error.message })
}

// Check 4: Configuration files
console.log('\n⚙️  Checking configuration...')
const configFiles = [
  { file: '.env.example', desc: 'Environment template' },
  { file: 'tailwind.config.js', desc: 'Tailwind CSS config' },
  { file: 'postcss.config.js', desc: 'PostCSS config' },
  { file: 'README.md', desc: 'Documentation' }
]

let configComplete = true
configFiles.forEach(({ file, desc }) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${desc} (${file})`)
  } else {
    console.log(`❌ ${desc} (${file}) - MISSING`)
    configComplete = false
  }
})

checks.push({ 
  name: 'Configuration', 
  status: configComplete ? 'pass' : 'fail',
  details: configComplete ? 'All config files present' : 'Some config files missing'
})

// Check 5: API structure
console.log('\n🔧 Checking API structure...')
const apiDirs = ['api/data', 'api/utils', 'api/middleware', 'api/database']
let apiComplete = true

apiDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`)
  } else {
    console.log(`❌ ${dir}/ - MISSING`)
    apiComplete = false
  }
})

checks.push({ 
  name: 'API Structure', 
  status: apiComplete ? 'pass' : 'fail',
  details: apiComplete ? 'All API directories present' : 'Some API directories missing'
})

// Check 6: Component structure
console.log('\n🎨 Checking React components...')
const componentFiles = [
  'src/components/Header.jsx',
  'src/components/Calculator.jsx',
  'src/components/Results.jsx',
  'src/components/LeadForm.jsx',
  'src/components/AdminDashboard.jsx',
  'src/components/Footer.jsx',
  'src/components/LoadingSpinner.jsx',
  'src/components/ErrorMessage.jsx',
  'src/components/SuccessMessage.jsx'
]

let componentsComplete = true
componentFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${path.basename(file)}`)
  } else {
    console.log(`❌ ${path.basename(file)} - MISSING`)
    componentsComplete = false
  }
})

checks.push({ 
  name: 'React Components', 
  status: componentsComplete ? 'pass' : 'fail',
  details: componentsComplete ? 'All components present' : 'Some components missing'
})

// Summary
console.log('\n' + '='.repeat(60))
console.log('📋 DEPLOYMENT VERIFICATION SUMMARY')
console.log('='.repeat(60))

const passedChecks = checks.filter(check => check.status === 'pass').length
const totalChecks = checks.length

checks.forEach(check => {
  const status = check.status === 'pass' ? '✅ PASS' : '❌ FAIL'
  console.log(`${status} - ${check.name}`)
  if (check.status === 'fail' && check.details) {
    console.log(`    Details: ${check.details}`)
  }
})

console.log('\n' + '-'.repeat(60))
console.log(`RESULT: ${passedChecks}/${totalChecks} checks passed`)

if (passedChecks === totalChecks) {
  console.log('\n🎉 ALL CHECKS PASSED - READY FOR DEPLOYMENT!')
  console.log('\nNext steps:')
  console.log('1. Run: npm install')
  console.log('2. Run: npm run dev (for development)')
  console.log('3. Run: npm run build (for production)')
  console.log('4. Deploy API to Railway')
  console.log('5. Deploy frontend to Vercel')
  console.log('\n🚀 Your $50,000+ enterprise ROI calculator is ready!')
} else {
  console.log('\n⚠️  SOME CHECKS FAILED - PLEASE FIX BEFORE DEPLOYMENT')
  console.log('\nReview the failed checks above and ensure all requirements are met.')
}

console.log('\n' + '='.repeat(60))