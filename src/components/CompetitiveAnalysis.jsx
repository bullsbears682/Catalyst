import React, { useState, useEffect } from 'react'
import { hubSpotConfig } from '../data/roiData'

const CompetitiveAnalysis = ({ selectedScenario, investmentAmount, onClose }) => {
  const [activeComparison, setActiveComparison] = useState('salesforce')
  const [analysisData, setAnalysisData] = useState(null)

  useEffect(() => {
    if (selectedScenario && investmentAmount) {
      generateCompetitiveAnalysis()
    }
  }, [selectedScenario, investmentAmount])

  const generateCompetitiveAnalysis = () => {
    const analysis = {
      hubspot: {
        name: 'HubSpot',
        totalCost: calculateTotalCost('hubspot', investmentAmount),
        implementationTime: '1-3 months',
        userAdoption: '95%',
        trainingRequired: '2 weeks',
        features: ['All-in-One Platform', 'Integrated Marketing & Sales', 'Easy Setup', 'Great Support'],
        roi: selectedScenario.averageROI * 1.1,
        pros: [
          'Single platform for marketing, sales, and service',
          'Faster implementation and user adoption',
          'Lower total cost of ownership',
          'Excellent customer support and training',
          'No complex customizations required'
        ],
        cons: [
          'Fewer enterprise-level customizations',
          'Limited advanced workflow capabilities',
          'Reporting could be more robust'
        ]
      },
      salesforce: {
        name: 'Salesforce',
        totalCost: calculateTotalCost('salesforce', investmentAmount),
        implementationTime: '6-12 months',
        userAdoption: '70%',
        trainingRequired: '8 weeks',
        features: ['Highly Customizable', 'Enterprise Scale', 'AppExchange', 'Advanced Analytics'],
        roi: selectedScenario.averageROI * 0.85,
        pros: [
          'Extremely customizable and scalable',
          'Robust enterprise features',
          'Large ecosystem of apps and integrations',
          'Advanced reporting and analytics',
          'Strong workflow automation'
        ],
        cons: [
          'Complex and expensive to implement',
          'Requires significant training and expertise',
          'High total cost of ownership',
          'Steep learning curve for users',
          'Requires separate marketing automation tool'
        ]
      },
      marketo: {
        name: 'Marketo',
        totalCost: calculateTotalCost('marketo', investmentAmount),
        implementationTime: '4-8 months',
        userAdoption: '65%',
        trainingRequired: '6 weeks',
        features: ['Advanced Automation', 'Lead Scoring', 'Attribution', 'Enterprise Marketing'],
        roi: selectedScenario.averageROI * 0.90,
        pros: [
          'Sophisticated marketing automation',
          'Advanced lead scoring and nurturing',
          'Comprehensive attribution reporting',
          'Good integration with Salesforce',
          'Powerful campaign management'
        ],
        cons: [
          'Steep learning curve and complex interface',
          'Expensive and requires technical expertise',
          'Limited CRM capabilities',
          'Requires separate sales and service tools',
          'Time-consuming setup and maintenance'
        ]
      },
      zendesk: {
        name: 'Zendesk',
        totalCost: calculateTotalCost('zendesk', investmentAmount),
        implementationTime: '2-4 months',
        userAdoption: '85%',
        trainingRequired: '3 weeks',
        features: ['Customer Support', 'Ticketing', 'Knowledge Base', 'Chat Support'],
        roi: selectedScenario.averageROI * 0.80,
        pros: [
          'Excellent customer support features',
          'User-friendly interface',
          'Good ticketing and knowledge base',
          'Reasonable pricing for support features',
          'Strong chat and messaging capabilities'
        ],
        cons: [
          'Limited marketing and sales features',
          'Requires separate CRM and marketing tools',
          'Basic reporting capabilities',
          'No integrated marketing automation',
          'Fragmented customer data across tools'
        ]
      }
    }

    setAnalysisData(analysis)
  }

  const calculateTotalCost = (platform, investment) => {
    const costMultipliers = {
      hubspot: 1.0,
      salesforce: 1.8,
      marketo: 1.6,
      zendesk: 1.2
    }
    return Math.round(investment * costMultipliers[platform])
  }

  const getCompetitorLogos = () => ({
    salesforce: '☁️',
    marketo: '📊',
    zendesk: '🎧',
    mailchimp: '🐵'
  })

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!analysisData) {
    return (
      <div className="competitive-analysis loading">
        <div className="loading-spinner">Generating competitive analysis...</div>
      </div>
    )
  }

  return (
    <div className="competitive-analysis">
      <div className="competitive-header">
        <h2>🥊 HubSpot vs. Competitors</h2>
        <p>See how HubSpot compares to other platforms for your specific use case</p>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* Platform Selector */}
      <div className="platform-selector">
        <button
          className={`platform-btn ${activeComparison === 'salesforce' ? 'active' : ''}`}
          onClick={() => setActiveComparison('salesforce')}
        >
          ☁️ vs. Salesforce
        </button>
        <button
          className={`platform-btn ${activeComparison === 'marketo' ? 'active' : ''}`}
          onClick={() => setActiveComparison('marketo')}
        >
          📊 vs. Marketo
        </button>
        <button
          className={`platform-btn ${activeComparison === 'zendesk' ? 'active' : ''}`}
          onClick={() => setActiveComparison('zendesk')}
        >
          🎧 vs. Zendesk
        </button>
      </div>

      {/* Comparison Table */}
      <div className="comparison-table">
        <div className="comparison-header">
          <div className="competitor-column">
            <h3>🧡 HubSpot</h3>
          </div>
          <div className="competitor-column">
            <h3>{getCompetitorLogos()[activeComparison]} {analysisData[activeComparison].name}</h3>
          </div>
        </div>

        <div className="comparison-row">
          <div className="comparison-label">Total Cost (3 Years)</div>
          <div className="hubspot-value winner">{formatCurrency(analysisData.hubspot.totalCost)}</div>
          <div className="competitor-value">{formatCurrency(analysisData[activeComparison].totalCost)}</div>
        </div>

        <div className="comparison-row">
          <div className="comparison-label">Implementation Time</div>
          <div className="hubspot-value winner">{analysisData.hubspot.implementationTime}</div>
          <div className="competitor-value">{analysisData[activeComparison].implementationTime}</div>
        </div>

        <div className="comparison-row">
          <div className="comparison-label">User Adoption Rate</div>
          <div className="hubspot-value winner">{analysisData.hubspot.userAdoption}</div>
          <div className="competitor-value">{analysisData[activeComparison].userAdoption}</div>
        </div>

        <div className="comparison-row">
          <div className="comparison-label">Training Required</div>
          <div className="hubspot-value winner">{analysisData.hubspot.trainingRequired}</div>
          <div className="competitor-value">{analysisData[activeComparison].trainingRequired}</div>
        </div>

        <div className="comparison-row">
          <div className="comparison-label">Expected ROI</div>
          <div className="hubspot-value winner">{Math.round(analysisData.hubspot.roi * 100)}%</div>
          <div className="competitor-value">{Math.round(analysisData[activeComparison].roi * 100)}%</div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="detailed-analysis">
        <div className="analysis-section">
          <h4>🧡 HubSpot Advantages</h4>
          <ul className="pros-list">
            {analysisData.hubspot.pros.map((pro, index) => (
              <li key={index} className="pro-item">✅ {pro}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h4>{getCompetitorLogos()[activeComparison]} {analysisData[activeComparison].name} Strengths</h4>
          <ul className="pros-list">
            {analysisData[activeComparison].pros.map((pro, index) => (
              <li key={index} className="pro-item">✅ {pro}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h4>🧡 HubSpot Limitations</h4>
          <ul className="cons-list">
            {analysisData.hubspot.cons.map((con, index) => (
              <li key={index} className="con-item">⚠️ {con}</li>
            ))}
          </ul>
        </div>

        <div className="analysis-section">
          <h4>{getCompetitorLogos()[activeComparison]} {analysisData[activeComparison].name} Challenges</h4>
          <ul className="cons-list">
            {analysisData[activeComparison].cons.map((con, index) => (
              <li key={index} className="con-item">❌ {con}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ROI Summary */}
      <div className="roi-summary">
        <h4>💰 Financial Impact Summary</h4>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Cost Savings with HubSpot:</span>
            <span className="stat-value positive">
              {formatCurrency(analysisData[activeComparison].totalCost - analysisData.hubspot.totalCost)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Faster Implementation:</span>
            <span className="stat-value positive">
              {analysisData[activeComparison].implementationTime.split('-')[0]}x faster
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Higher User Adoption:</span>
            <span className="stat-value positive">
              +{parseInt(analysisData.hubspot.userAdoption) - parseInt(analysisData[activeComparison].userAdoption)}%
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="competitive-actions">
        <button className="btn btn-primary">
          📊 Generate Full Comparison Report
        </button>
        <button className="btn btn-secondary">
          📧 Email This Analysis
        </button>
        <button className="btn btn-secondary">
          🗓️ Schedule HubSpot Demo
        </button>
      </div>
    </div>
  )
}

export default CompetitiveAnalysis