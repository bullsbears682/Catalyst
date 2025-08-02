import React, { useState, useEffect } from 'react'
import { hubSpotConfig } from '../data/roiData'

const HubSpotSalesTools = ({ roiData, prospectData, onClose }) => {
  const [activeTab, setActiveTab] = useState('battlecards')
  const [selectedCompetitor, setSelectedCompetitor] = useState('salesforce')
  const [proposalData, setProposalData] = useState(null)
  const [battleCards, setBattleCards] = useState(null)

  useEffect(() => {
    generateSalesAssets()
  }, [roiData, prospectData])

  const generateSalesAssets = () => {
    // Generate battle cards
    const cards = {
      salesforce: {
        name: 'Salesforce',
        logo: '☁️',
        strengths: [
          'Highly customizable platform',
          'Large ecosystem of apps',
          'Enterprise-grade features',
          'Advanced reporting capabilities',
          'Strong workflow automation'
        ],
        weaknesses: [
          'Complex and expensive implementation',
          'Steep learning curve',
          'Requires extensive training',
          'High total cost of ownership',
          'Fragmented user experience'
        ],
        objections: {
          'Salesforce is more established': {
            response: "While Salesforce has been around longer, HubSpot was built for the modern buyer. Our all-in-one platform eliminates the need for multiple tools and reduces complexity by 60%.",
            stats: "95% user adoption vs 70% with Salesforce"
          },
          'Salesforce has more features': {
            response: "More features often mean more complexity. HubSpot provides the essential features you need with 3x faster implementation. Our customers see ROI in 3 months vs 12+ months with Salesforce.",
            stats: "3 months to ROI vs 12+ months"
          },
          'Salesforce integrates with everything': {
            response: "HubSpot offers 500+ integrations plus native marketing, sales, and service tools. No need to manage multiple vendors and contracts.",
            stats: "Single platform vs 3-5 separate tools"
          }
        },
        winningTalks: [
          'Total Cost of Ownership comparison',
          'Implementation speed and user adoption',
          'All-in-one platform benefits',
          'Customer success stories in their industry'
        ],
        pricing: {
          salesforce: '$150/user/month + implementation costs',
          hubspot: '$90/user/month with faster ROI'
        }
      },
      marketo: {
        name: 'Marketo',
        logo: '📊',
        strengths: [
          'Advanced marketing automation',
          'Sophisticated lead scoring',
          'Enterprise-level features',
          'Good Salesforce integration',
          'Comprehensive attribution'
        ],
        weaknesses: [
          'Complex interface and setup',
          'Requires technical expertise',
          'No native CRM capabilities',
          'Expensive implementation',
          'Poor user experience'
        ],
        objections: {
          'Marketo has better automation': {
            response: "HubSpot's automation is designed for ease of use without sacrificing power. Our visual workflow builder allows non-technical users to create sophisticated campaigns.",
            stats: "2 weeks setup vs 6+ months with Marketo"
          },
          'Marketo is more advanced': {
            response: "Advanced shouldn't mean complicated. HubSpot delivers enterprise features with consumer-grade usability. Your team will actually use it.",
            stats: "95% user adoption vs 65% with Marketo"
          },
          'Marketo integrates better with Salesforce': {
            response: "Why deal with integration headaches? HubSpot's native CRM eliminates data silos and provides a unified customer view from first touch to closed deal.",
            stats: "Single platform vs managing 2-3 separate tools"
          }
        },
        winningTalks: [
          'Ease of use and user adoption',
          'All-in-one platform benefits',
          'Faster time to value',
          'Lower total cost of ownership'
        ],
        pricing: {
          marketo: '$200/user/month + Salesforce CRM',
          hubspot: '$120/user/month all-inclusive'
        }
      },
      zendesk: {
        name: 'Zendesk',
        logo: '🎧',
        strengths: [
          'Strong support ticketing',
          'Good knowledge base',
          'User-friendly interface',
          'Reasonable support pricing',
          'Chat capabilities'
        ],
        weaknesses: [
          'Limited marketing features',
          'No native CRM',
          'Basic reporting',
          'Fragmented customer data',
          'Requires multiple tools'
        ],
        objections: {
          'Zendesk is better for support': {
            response: "HubSpot Service Hub provides excellent support features PLUS connects to your marketing and sales data. See the full customer journey, not just support tickets.",
            stats: "360° customer view vs fragmented data"
          },
          'Zendesk is cheaper': {
            response: "When you factor in the need for separate CRM and marketing tools, HubSpot's all-in-one platform typically costs 40% less than a Zendesk + Salesforce + marketing automation stack.",
            stats: "40% lower total cost vs tool stack"
          },
          'Our team knows Zendesk': {
            response: "HubSpot's intuitive interface means faster adoption. Plus, you'll eliminate the complexity of managing multiple tools and data sources.",
            stats: "Single login vs managing 3+ platforms"
          }
        },
        winningTalks: [
          'Unified customer data',
          'All-in-one platform benefits',
          'Marketing and sales integration',
          'Total cost comparison'
        ],
        pricing: {
          zendesk: '$110/user/month + CRM + Marketing tools',
          hubspot: '$80/user/month all-inclusive'
        }
      }
    }

    setBattleCards(cards)

    // Generate proposal data
    if (roiData && prospectData) {
      const proposal = generateProposal(roiData, prospectData)
      setProposalData(proposal)
    }
  }

  const generateProposal = (roi, prospect) => {
    return {
      companyName: prospect?.company || 'Your Company',
      industry: prospect?.industry || 'Technology',
      challenges: [
        'Fragmented customer data across multiple systems',
        'Manual processes slowing down sales and marketing',
        'Difficulty tracking ROI on marketing investments',
        'Poor lead quality and conversion rates'
      ],
      solution: {
        marketingHub: {
          features: ['Lead Generation', 'Marketing Automation', 'Email Marketing', 'SEO Tools'],
          benefits: ['40% increase in qualified leads', '60% faster campaign deployment', '25% improvement in conversion rates'],
          investment: Math.round((roi?.investment || 50000) * 0.4)
        },
        salesHub: {
          features: ['CRM', 'Deal Pipeline', 'Email Tracking', 'Meeting Scheduler'],
          benefits: ['35% faster deal closure', '50% improvement in forecast accuracy', '30% increase in sales productivity'],
          investment: Math.round((roi?.investment || 50000) * 0.4)
        },
        serviceHub: {
          features: ['Ticketing', 'Knowledge Base', 'Customer Feedback', 'Live Chat'],
          benefits: ['45% reduction in resolution time', '30% increase in customer satisfaction', '25% reduction in support costs'],
          investment: Math.round((roi?.investment || 50000) * 0.2)
        }
      },
      timeline: {
        'Month 1': 'Platform setup and data migration',
        'Month 2': 'Team training and workflow configuration',
        'Month 3': 'Go-live and optimization',
        'Month 6': 'Full ROI realization'
      },
      investment: {
        total: roi?.investment || 50000,
        roi: roi?.roi || 280,
        paybackPeriod: '6 months',
        yearOneReturn: Math.round((roi?.investment || 50000) * 2.8)
      }
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleExportProposal = () => {
    // Generate PDF proposal
    console.log('Exporting proposal...', proposalData)
  }

  const handleScheduleDemo = () => {
    // Open calendar booking
    window.open('https://meetings.hubspot.com/demo', '_blank')
  }

  const renderBattleCards = () => {
    const competitor = battleCards[selectedCompetitor]
    
    return (
      <div className="battle-cards">
        <div className="competitor-selector">
          {Object.keys(battleCards).map(key => (
            <button
              key={key}
              className={`competitor-btn ${selectedCompetitor === key ? 'active' : ''}`}
              onClick={() => setSelectedCompetitor(key)}
            >
              {battleCards[key].logo} {battleCards[key].name}
            </button>
          ))}
        </div>

        <div className="battle-card">
          <div className="card-header">
            <h3>{competitor.logo} HubSpot vs. {competitor.name}</h3>
          </div>

          <div className="card-sections">
            <div className="strengths-weaknesses">
              <div className="section">
                <h4>Their Strengths</h4>
                <ul>
                  {competitor.strengths.map((strength, index) => (
                    <li key={index}>✅ {strength}</li>
                  ))}
                </ul>
              </div>

              <div className="section">
                <h4>Their Weaknesses</h4>
                <ul>
                  {competitor.weaknesses.map((weakness, index) => (
                    <li key={index}>❌ {weakness}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="objection-handling">
              <h4>🛡️ Objection Handling</h4>
              {Object.entries(competitor.objections).map(([objection, response]) => (
                <div key={objection} className="objection-item">
                  <div className="objection">
                    <strong>Objection:</strong> "{objection}"
                  </div>
                  <div className="response">
                    <strong>Response:</strong> {response.response}
                  </div>
                  <div className="stat">
                    <strong>Proof Point:</strong> {response.stats}
                  </div>
                </div>
              ))}
            </div>

            <div className="winning-talks">
              <h4>🏆 Winning Talk Tracks</h4>
              <ul>
                {competitor.winningTalks.map((talk, index) => (
                  <li key={index}>{talk}</li>
                ))}
              </ul>
            </div>

            <div className="pricing-comparison">
              <h4>💰 Pricing Comparison</h4>
              <div className="pricing-grid">
                <div className="pricing-item competitor">
                  <strong>{competitor.name}:</strong> {competitor.pricing[selectedCompetitor]}
                </div>
                <div className="pricing-item hubspot">
                  <strong>HubSpot:</strong> {competitor.pricing.hubspot}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderProposal = () => {
    if (!proposalData) return <div>Generating proposal...</div>

    return (
      <div className="proposal-generator">
        <div className="proposal-header">
          <h3>📋 HubSpot Proposal for {proposalData.companyName}</h3>
          <div className="proposal-actions">
            <button className="btn btn-primary" onClick={handleExportProposal}>
              📄 Export PDF
            </button>
            <button className="btn btn-secondary" onClick={handleScheduleDemo}>
              🗓️ Schedule Demo
            </button>
          </div>
        </div>

        <div className="proposal-content">
          <section className="challenges-section">
            <h4>🎯 Business Challenges</h4>
            <ul>
              {proposalData.challenges.map((challenge, index) => (
                <li key={index}>{challenge}</li>
              ))}
            </ul>
          </section>

          <section className="solution-section">
            <h4>🚀 Recommended Solution</h4>
            
            <div className="hubs-grid">
              <div className="hub-card marketing">
                <h5>📈 Marketing Hub Professional</h5>
                <div className="features">
                  {proposalData.solution.marketingHub.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <div className="benefits">
                  {proposalData.solution.marketingHub.benefits.map((benefit, index) => (
                    <div key={index} className="benefit">✅ {benefit}</div>
                  ))}
                </div>
                <div className="investment">
                  Investment: {formatCurrency(proposalData.solution.marketingHub.investment)}
                </div>
              </div>

              <div className="hub-card sales">
                <h5>💼 Sales Hub Professional</h5>
                <div className="features">
                  {proposalData.solution.salesHub.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <div className="benefits">
                  {proposalData.solution.salesHub.benefits.map((benefit, index) => (
                    <div key={index} className="benefit">✅ {benefit}</div>
                  ))}
                </div>
                <div className="investment">
                  Investment: {formatCurrency(proposalData.solution.salesHub.investment)}
                </div>
              </div>

              <div className="hub-card service">
                <h5>🎧 Service Hub Professional</h5>
                <div className="features">
                  {proposalData.solution.serviceHub.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                <div className="benefits">
                  {proposalData.solution.serviceHub.benefits.map((benefit, index) => (
                    <div key={index} className="benefit">✅ {benefit}</div>
                  ))}
                </div>
                <div className="investment">
                  Investment: {formatCurrency(proposalData.solution.serviceHub.investment)}
                </div>
              </div>
            </div>
          </section>

          <section className="timeline-section">
            <h4>📅 Implementation Timeline</h4>
            <div className="timeline">
              {Object.entries(proposalData.timeline).map(([period, activity]) => (
                <div key={period} className="timeline-item">
                  <div className="timeline-period">{period}</div>
                  <div className="timeline-activity">{activity}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="investment-section">
            <h4>💰 Investment & ROI Summary</h4>
            <div className="investment-grid">
              <div className="investment-item">
                <span className="label">Total Investment:</span>
                <span className="value">{formatCurrency(proposalData.investment.total)}</span>
              </div>
              <div className="investment-item">
                <span className="label">Expected ROI:</span>
                <span className="value positive">{proposalData.investment.roi}%</span>
              </div>
              <div className="investment-item">
                <span className="label">Payback Period:</span>
                <span className="value">{proposalData.investment.paybackPeriod}</span>
              </div>
              <div className="investment-item highlight">
                <span className="label">Year 1 Return:</span>
                <span className="value positive">{formatCurrency(proposalData.investment.yearOneReturn)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  const renderDemoScenarios = () => {
    const scenarios = [
      {
        title: 'Marketing Qualified Lead Journey',
        description: 'Show how a visitor becomes a customer through HubSpot',
        steps: [
          'Visitor discovers blog post through SEO',
          'Downloads content offer via landing page',
          'Enters nurturing workflow',
          'Lead scoring identifies sales readiness',
          'Sales rep receives notification',
          'Deal created and tracked through pipeline'
        ]
      },
      {
        title: 'Customer Support Excellence',
        description: 'Demonstrate integrated customer service experience',
        steps: [
          'Customer submits support ticket',
          'Ticket automatically assigned based on expertise',
          'Agent sees full customer history',
          'Knowledge base suggests solutions',
          'Issue resolved and customer surveyed',
          'Feedback triggers process improvement'
        ]
      },
      {
        title: 'Sales Pipeline Management',
        description: 'Show how deals progress through the sales process',
        steps: [
          'Lead assigned to sales rep',
          'Contact research and preparation',
          'Meeting scheduled and tracked',
          'Proposal generated and sent',
          'Deal probability updated',
          'Contract signed and revenue attributed'
        ]
      }
    ]

    return (
      <div className="demo-scenarios">
        <h3>🎬 Demo Scenarios</h3>
        <p>Use these scenarios to showcase HubSpot's capabilities during demos</p>
        
        {scenarios.map((scenario, index) => (
          <div key={index} className="scenario-card">
            <h4>{scenario.title}</h4>
            <p>{scenario.description}</p>
            <div className="scenario-steps">
              {scenario.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="scenario-step">
                  <span className="step-number">{stepIndex + 1}</span>
                  <span className="step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="sales-tools-overlay">
      <div className="sales-tools-container">
        <div className="sales-tools-header">
          <h2>🛠️ HubSpot Sales Enablement Tools</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sales-tools-tabs">
          <button
            className={`tab-btn ${activeTab === 'battlecards' ? 'active' : ''}`}
            onClick={() => setActiveTab('battlecards')}
          >
            ⚔️ Battle Cards
          </button>
          <button
            className={`tab-btn ${activeTab === 'proposal' ? 'active' : ''}`}
            onClick={() => setActiveTab('proposal')}
          >
            📋 Proposal Generator
          </button>
          <button
            className={`tab-btn ${activeTab === 'demos' ? 'active' : ''}`}
            onClick={() => setActiveTab('demos')}
          >
            🎬 Demo Scenarios
          </button>
        </div>

        <div className="sales-tools-content">
          {activeTab === 'battlecards' && battleCards && renderBattleCards()}
          {activeTab === 'proposal' && renderProposal()}
          {activeTab === 'demos' && renderDemoScenarios()}
        </div>
      </div>
    </div>
  )
}

export default HubSpotSalesTools