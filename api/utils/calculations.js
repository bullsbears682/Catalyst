// API-side ROI Calculations with Currency Support
const { roiCategories, roiScenarios } = require('../../src/data/roiData')
const { insertCalculation } = require('../database/db')

// Currency conversion rates (in production, fetch from API)
const CURRENCY_RATES = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110.0
}

// Convert currency amounts
const convertCurrency = (amount, fromCurrency, toCurrency = 'USD') => {
  if (fromCurrency === toCurrency) return amount
  
  const fromRate = CURRENCY_RATES[fromCurrency] || 1
  const toRate = CURRENCY_RATES[toCurrency] || 1
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / fromRate
  return usdAmount * toRate
}

// Format currency for display
const formatCurrency = (amount, currency = 'USD') => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'C$',
    AUD: 'A$',
    JPY: '¥'
  }
  
  const symbol = symbols[currency] || '$'
  
  if (currency === 'JPY') {
    return `${symbol}${Math.round(amount).toLocaleString()}`
  }
  
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}

// Enhanced ROI calculation with detailed breakdown
const calculateROI = async (investment, category, scenario, specificScenario = null, currency = 'USD', requestInfo = {}) => {
  try {
    const categoryData = roiCategories[category]
    const scenarioData = roiScenarios[scenario]
    
    if (!categoryData || !scenarioData) {
      throw new Error('Invalid category or scenario')
    }
    
    // Determine which specific scenario to use
    let selectedScenario = specificScenario
    if (!selectedScenario || !categoryData.scenarios[selectedScenario]) {
      // Use the first scenario as default
      selectedScenario = Object.keys(categoryData.scenarios)[0]
    }
    
    const roiData = categoryData.scenarios[selectedScenario]
    
    // Convert investment to USD for calculation consistency
    const usdInvestment = convertCurrency(investment, currency, 'USD')
    
    // Base calculations
    const baseROI = roiData.averageROI * scenarioData.multiplier
    const timeToROI = roiData.timeframe
    const riskAdjustedROI = baseROI * (1 - scenarioData.riskFactor)
    const adoptionRate = scenarioData.adoptionRate
    
    // Calculate returns
    const grossReturn = usdInvestment * riskAdjustedROI
    const netReturn = grossReturn - usdInvestment
    const monthlyReturn = netReturn / timeToROI
    const annualReturn = monthlyReturn * 12
    
    // Calculate break-even point
    const breakEvenMonths = Math.ceil(usdInvestment / Math.abs(monthlyReturn))
    
    // Calculate cumulative returns over time
    const monthlyReturns = []
    const cumulativeReturns = []
    let cumulative = 0
    
    for (let month = 1; month <= Math.min(timeToROI + 12, 60); month++) {
      const monthlyGain = monthlyReturn * adoptionRate
      monthlyReturns.push(monthlyGain)
      cumulative += monthlyGain
      cumulativeReturns.push(cumulative)
    }
    
    // Factor breakdown analysis
    const factorAnalysis = Object.entries(roiData.factors || {}).map(([factor, weight]) => ({
      factor: factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      weight: Math.round(weight * 100),
      impact: Math.round(netReturn * weight),
      impactFormatted: formatCurrency(convertCurrency(netReturn * weight, 'USD', currency), currency)
    }))
    
    // Risk assessment
    const riskLevel = scenarioData.riskFactor
    let riskRating = 'Low'
    if (riskLevel > 0.3) riskRating = 'High'
    else if (riskLevel > 0.15) riskRating = 'Medium'
    
    // Confidence intervals
    const confidenceInterval = {
      low: Math.round(netReturn * 0.7),
      high: Math.round(netReturn * 1.3),
      lowFormatted: formatCurrency(convertCurrency(netReturn * 0.7, 'USD', currency), currency),
      highFormatted: formatCurrency(convertCurrency(netReturn * 1.3, 'USD', currency), currency)
    }
    
    // Convert all monetary values to requested currency
    const result = {
      // Input parameters
      investment: Math.round(investment),
      investmentFormatted: formatCurrency(investment, currency),
      category: categoryData.name,
      scenario: scenarioData.name,
      specificScenario: roiData.name,
      currency,
      
      // Core metrics (in requested currency)
      totalReturn: Math.round(convertCurrency(grossReturn, 'USD', currency)),
      totalReturnFormatted: formatCurrency(convertCurrency(grossReturn, 'USD', currency), currency),
      netReturn: Math.round(convertCurrency(netReturn, 'USD', currency)),
      netReturnFormatted: formatCurrency(convertCurrency(netReturn, 'USD', currency), currency),
      
      // ROI percentage
      roi: Math.round((riskAdjustedROI - 1) * 100),
      roiFormatted: `${Math.round((riskAdjustedROI - 1) * 100)}%`,
      
      // Timeline metrics
      timeToROI,
      breakEvenMonths,
      
      // Periodic returns (in requested currency)
      monthlyReturn: Math.round(convertCurrency(monthlyReturn, 'USD', currency)),
      monthlyReturnFormatted: formatCurrency(convertCurrency(monthlyReturn, 'USD', currency), currency),
      annualReturn: Math.round(convertCurrency(annualReturn, 'USD', currency)),
      annualReturnFormatted: formatCurrency(convertCurrency(annualReturn, 'USD', currency), currency),
      
      // Time series data (in requested currency)
      monthlyReturns: monthlyReturns.map(val => Math.round(convertCurrency(val, 'USD', currency))),
      cumulativeReturns: cumulativeReturns.map(val => Math.round(convertCurrency(val, 'USD', currency))),
      
      // Analysis
      factorAnalysis,
      riskLevel,
      riskRating,
      adoptionRate: Math.round(adoptionRate * 100),
      confidenceInterval,
      
      // Metadata
      researchSource: roiData.researchSource,
      calculatedAt: new Date().toISOString(),
      
      // Benchmarking
      industryBenchmark: {
        averageROI: Math.round((roiData.averageROI - 1) * 100),
        timeframe: roiData.timeframe,
        performanceVsBenchmark: Math.round(((riskAdjustedROI / roiData.averageROI) - 1) * 100)
      },
      
      // Recommendations
      recommendations: generateRecommendations(investment, riskAdjustedROI, timeToROI, riskLevel)
    }
    
    // Store calculation in database (non-blocking)
    if (requestInfo.ipAddress) {
      insertCalculation({
        investment: usdInvestment,
        category,
        scenario,
        specificScenario: selectedScenario,
        currency,
        roiResult: result,
        ipAddress: requestInfo.ipAddress,
        userAgent: requestInfo.userAgent
      }).catch(error => {
        console.error('Failed to store calculation:', error)
      })
    }
    
    return result
    
  } catch (error) {
    console.error('ROI Calculation Error:', error)
    throw error
  }
}

// Generate personalized recommendations
const generateRecommendations = (investment, roi, timeframe, riskLevel) => {
  const recommendations = []
  
  // ROI-based recommendations
  if (roi < 1.5) {
    recommendations.push({
      type: 'warning',
      title: 'Consider Alternative Options',
      description: 'This investment shows lower than average returns. Consider exploring other categories or scenarios.',
      priority: 'high'
    })
  } else if (roi > 3.0) {
    recommendations.push({
      type: 'success',
      title: 'Excellent ROI Potential',
      description: 'This investment shows strong return potential. Consider prioritizing this initiative.',
      priority: 'high'
    })
  }
  
  // Timeline recommendations
  if (timeframe > 18) {
    recommendations.push({
      type: 'info',
      title: 'Long-term Investment',
      description: 'This is a long-term investment. Ensure you have adequate resources and patience for the full timeline.',
      priority: 'medium'
    })
  } else if (timeframe < 6) {
    recommendations.push({
      type: 'success',
      title: 'Quick Returns',
      description: 'This investment offers relatively quick returns, making it ideal for immediate impact.',
      priority: 'medium'
    })
  }
  
  // Risk-based recommendations
  if (riskLevel > 0.25) {
    recommendations.push({
      type: 'warning',
      title: 'High Risk Investment',
      description: 'This investment carries higher risk. Consider implementing strong change management and monitoring.',
      priority: 'high'
    })
  }
  
  // Investment size recommendations
  if (investment > 1000000) {
    recommendations.push({
      type: 'info',
      title: 'Large Investment',
      description: 'For investments of this size, consider phased implementation and detailed risk assessment.',
      priority: 'medium'
    })
  }
  
  return recommendations
}

// Batch calculation for scenario comparison
const calculateMultipleScenarios = async (investment, category, currency = 'USD', requestInfo = {}) => {
  const scenarios = ['conservative', 'realistic', 'optimistic']
  const results = {}
  
  for (const scenario of scenarios) {
    try {
      results[scenario] = await calculateROI(investment, category, scenario, null, currency, requestInfo)
    } catch (error) {
      console.error(`Failed to calculate ${scenario} scenario:`, error)
      results[scenario] = null
    }
  }
  
  return results
}

module.exports = {
  calculateROI,
  calculateMultipleScenarios,
  convertCurrency,
  formatCurrency,
  generateRecommendations
}