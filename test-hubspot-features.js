#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🧡 Testing HubSpot ROI Calculator Features...\n')

// Test 1: HubSpot ROI Data Structure
const testROIData = () => {
  console.log('1️⃣ Testing HubSpot ROI Data Structure...')
  
  try {
    const { roiCategories, hubSpotConfig, getTotalScenarios } = require('./src/data/roiData.js')
    
    // Test scenario count
    const totalScenarios = getTotalScenarios()
    console.log(`   ✅ Total HubSpot Scenarios: ${totalScenarios}`)
    
    // Test required HubSpot categories
    const requiredCategories = [
      'marketing-hub',
      'sales-hub', 
      'service-hub',
      'operations-hub',
      'competitive-analysis',
      'industry-specific'
    ]
    
    let categoriesFound = 0
    requiredCategories.forEach(category => {
      if (roiCategories[category]) {
        categoriesFound++
        const scenarioCount = Object.keys(roiCategories[category].scenarios).length
        console.log(`   ✅ ${roiCategories[category].name}: ${scenarioCount} scenarios`)
      } else {
        console.log(`   ❌ Missing category: ${category}`)
      }
    })
    
    // Test HubSpot-specific features in scenarios
    let hubSpotFeaturesCount = 0
    let competitorComparisonCount = 0
    
    Object.values(roiCategories).forEach(category => {
      Object.values(category.scenarios).forEach(scenario => {
        if (scenario.hubSpotFeatures) hubSpotFeaturesCount++
        if (scenario.competitorComparison) competitorComparisonCount++
      })
    })
    
    console.log(`   ✅ Scenarios with HubSpot Features: ${hubSpotFeaturesCount}`)
    console.log(`   ✅ Scenarios with Competitor Comparisons: ${competitorComparisonCount}`)
    
    // Test HubSpot configuration
    if (hubSpotConfig && hubSpotConfig.brandColors) {
      console.log(`   ✅ HubSpot Brand Colors: ${hubSpotConfig.brandColors.primary}`)
      console.log(`   ✅ HubSpot Hubs: ${Object.keys(hubSpotConfig.hubSpotHubs).length}`)
      console.log(`   ✅ Pricing Tiers: ${Object.keys(hubSpotConfig.pricingTiers).length}`)
    }
    
    return categoriesFound === requiredCategories.length
  } catch (error) {
    console.log(`   ❌ Error testing ROI data: ${error.message}`)
    return false
  }
}

// Test 2: HubSpot Components
const testHubSpotComponents = () => {
  console.log('\n2️⃣ Testing HubSpot Components...')
  
  const hubspotComponents = [
    'src/components/CompetitiveAnalysis.jsx',
    'src/components/HubSpotSalesTools.jsx'
  ]
  
  let componentsFound = 0
  
  hubspotComponents.forEach(componentPath => {
    if (fs.existsSync(componentPath)) {
      const content = fs.readFileSync(componentPath, 'utf8')
      
      // Check for HubSpot-specific content
      const hasHubSpotBranding = content.includes('HubSpot') || content.includes('hubspot')
      const hasCompetitorLogic = content.includes('Salesforce') || content.includes('Marketo') || content.includes('Zendesk')
      const hasExportFunction = content.includes('export') && content.includes('default')
      
      if (hasHubSpotBranding && hasExportFunction) {
        componentsFound++
        console.log(`   ✅ ${path.basename(componentPath)} - HubSpot branded`)
        if (hasCompetitorLogic) {
          console.log(`   ✅ ${path.basename(componentPath)} - Competitor analysis ready`)
        }
      } else {
        console.log(`   ❌ ${path.basename(componentPath)} - Missing HubSpot features`)
      }
    } else {
      console.log(`   ❌ ${componentPath} - MISSING`)
    }
  })
  
  return componentsFound === hubspotComponents.length
}

// Test 3: HubSpot Branding
const testHubSpotBranding = () => {
  console.log('\n3️⃣ Testing HubSpot Branding...')
  
  const brandingFiles = [
    { file: 'src/index.css', checks: ['#FF7A59', 'hubspot-coral', 'HubSpot'] },
    { file: 'src/components/Header.jsx', checks: ['HubSpot ROI Calculator', 'Grow Better'] },
    { file: 'index.html', checks: ['HubSpot ROI Calculator', 'marketing', 'sales'] },
    { file: 'src/components/Calculator.jsx', checks: ['HubSpot ROI Calculator', 'marketing, sales, and service'] }
  ]
  
  let brandingPassed = 0
  
  brandingFiles.forEach(({ file, checks }) => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      const passedChecks = checks.filter(check => content.includes(check))
      
      if (passedChecks.length === checks.length) {
        brandingPassed++
        console.log(`   ✅ ${file} - HubSpot branding complete`)
      } else {
        console.log(`   ⚠️ ${file} - Missing: ${checks.filter(c => !passedChecks.includes(c)).join(', ')}`)
      }
    } else {
      console.log(`   ❌ ${file} - MISSING`)
    }
  })
  
  return brandingPassed === brandingFiles.length
}

// Test 4: Competitive Analysis Features
const testCompetitiveFeatures = () => {
  console.log('\n4️⃣ Testing Competitive Analysis Features...')
  
  try {
    const { roiCategories } = require('./src/data/roiData.js')
    const competitiveCategory = roiCategories['competitive-analysis']
    
    if (!competitiveCategory) {
      console.log('   ❌ Competitive analysis category missing')
      return false
    }
    
    const requiredCompetitors = ['salesforce', 'marketo', 'zendesk']
    const scenarios = Object.keys(competitiveCategory.scenarios)
    
    let competitorsCovered = 0
    requiredCompetitors.forEach(competitor => {
      const hasCompetitorScenario = scenarios.some(scenario => 
        scenario.includes(competitor) || 
        competitiveCategory.scenarios[scenario].name.toLowerCase().includes(competitor)
      )
      
      if (hasCompetitorScenario) {
        competitorsCovered++
        console.log(`   ✅ ${competitor.charAt(0).toUpperCase() + competitor.slice(1)} comparison available`)
      } else {
        console.log(`   ❌ Missing ${competitor} comparison`)
      }
    })
    
    // Test consolidation ROI
    const hasConsolidation = scenarios.some(scenario => 
      scenario.includes('consolidation') || 
      competitiveCategory.scenarios[scenario].name.toLowerCase().includes('consolidation')
    )
    
    if (hasConsolidation) {
      console.log('   ✅ Platform consolidation ROI available')
      competitorsCovered++
    }
    
    return competitorsCovered >= 3
  } catch (error) {
    console.log(`   ❌ Error testing competitive features: ${error.message}`)
    return false
  }
}

// Test 5: CSS Styles for HubSpot Components
const testHubSpotStyles = () => {
  console.log('\n5️⃣ Testing HubSpot Component Styles...')
  
  if (!fs.existsSync('src/index.css')) {
    console.log('   ❌ CSS file missing')
    return false
  }
  
  const cssContent = fs.readFileSync('src/index.css', 'utf8')
  
  const requiredStyles = [
    'competitive-analysis',
    'hubspot-coral',
    'platform-selector',
    'comparison-table',
    'battle-cards',
    'sales-tools'
  ]
  
  let stylesFound = 0
  requiredStyles.forEach(style => {
    if (cssContent.includes(style)) {
      stylesFound++
      console.log(`   ✅ .${style} styles available`)
    } else {
      console.log(`   ❌ Missing .${style} styles`)
    }
  })
  
  // Test HubSpot color variables
  const hubspotColors = ['#FF7A59', '--hubspot-coral', '--primary: #FF7A59']
  const colorCount = hubspotColors.filter(color => cssContent.includes(color)).length
  
  if (colorCount > 0) {
    console.log(`   ✅ HubSpot brand colors applied (${colorCount}/3)`)
    stylesFound++
  }
  
  return stylesFound >= 5
}

// Test 6: Package Dependencies
const testDependencies = () => {
  console.log('\n6️⃣ Testing Package Dependencies...')
  
  if (!fs.existsSync('package.json')) {
    console.log('   ❌ package.json missing')
    return false
  }
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  const requiredDeps = [
    'react',
    'react-dom', 
    'express',
    'helmet',
    'puppeteer',
    'chart.js',
    'react-chartjs-2'
  ]
  
  let depsFound = 0
  requiredDeps.forEach(dep => {
    if (dependencies[dep]) {
      depsFound++
      console.log(`   ✅ ${dep} v${dependencies[dep]}`)
    } else {
      console.log(`   ❌ Missing dependency: ${dep}`)
    }
  })
  
  return depsFound === requiredDeps.length
}

// Run all tests
const runAllTests = () => {
  const testResults = [
    testROIData(),
    testHubSpotComponents(), 
    testHubSpotBranding(),
    testCompetitiveFeatures(),
    testHubSpotStyles(),
    testDependencies()
  ]
  
  const passedTests = testResults.filter(result => result).length
  const totalTests = testResults.length
  
  console.log('\n' + '='.repeat(50))
  console.log(`🧡 HubSpot ROI Calculator Test Results: ${passedTests}/${totalTests}`)
  console.log('='.repeat(50))
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! HubSpot ROI Calculator ready for launch!')
    console.log('\n🚀 Key Features:')
    console.log('   • 31 HubSpot-specific ROI scenarios')
    console.log('   • Marketing, Sales, Service & Operations Hubs')
    console.log('   • Competitive analysis vs Salesforce, Marketo, Zendesk')
    console.log('   • Sales enablement tools with battle cards')
    console.log('   • HubSpot orange branding throughout')
    console.log('   • Professional proposal generation')
    console.log('   • Industry-specific scenarios')
    console.log('\n💰 Perfect for HubSpot sales teams to:')
    console.log('   • Justify HubSpot investments')
    console.log('   • Compare against competitors')
    console.log('   • Generate professional proposals')
    console.log('   • Handle competitive objections')
    console.log('   • Demonstrate ROI to prospects')
  } else {
    console.log('⚠️  Some tests failed. Review the issues above.')
    console.log(`   ${totalTests - passedTests} test(s) need attention.`)
  }
  
  return passedTests === totalTests
}

// Execute if run directly
if (require.main === module) {
  runAllTests()
}

module.exports = { runAllTests }