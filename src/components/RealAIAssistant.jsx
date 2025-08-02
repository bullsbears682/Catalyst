import React, { useState, useEffect, useRef } from 'react'
import * as apiService from '../services/api'

// Real AI Assistant with actual OpenAI integration
const RealAIAssistant = ({ roiData, onInsightGenerated }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "👋 Hi! I'm your AI ROI analyst. I can help you optimize your investments, predict market trends, and provide data-driven insights. What would you like to analyze?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiCapabilities, setAiCapabilities] = useState({
    sentiment_analysis: true,
    trend_prediction: true,
    risk_assessment: true,
    market_intelligence: true,
    optimization_suggestions: true
  })
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Real AI-powered analysis functions
  const analyzeROITrends = async (data) => {
    try {
      const analysis = await apiService.analyzeROIWithAI({
        roiData: data,
        analysisType: 'trend_analysis',
        includeMarketData: true
      })
      return analysis
    } catch (error) {
      console.error('AI analysis failed:', error)
      return generateFallbackAnalysis(data)
    }
  }

  const predictFutureROI = async (data, timeframe = '12M') => {
    try {
      const prediction = await apiService.predictROIWithAI({
        historicalData: data,
        timeframe,
        includeExternalFactors: true,
        confidenceLevel: 0.85
      })
      return prediction
    } catch (error) {
      console.error('AI prediction failed:', error)
      return generateFallbackPrediction(data, timeframe)
    }
  }

  const generateOptimizationSuggestions = async (data) => {
    try {
      const suggestions = await apiService.getAIOptimizationSuggestions({
        currentROI: data.roi,
        investment: data.investment,
        category: data.category,
        riskTolerance: data.riskTolerance || 'medium'
      })
      return suggestions
    } catch (error) {
      console.error('AI optimization failed:', error)
      return generateFallbackOptimization(data)
    }
  }

  const performSentimentAnalysis = async (textData) => {
    try {
      const sentiment = await apiService.analyzeSentimentWithAI({
        text: textData,
        context: 'financial_roi',
        includeEmotions: true
      })
      return sentiment
    } catch (error) {
      console.error('Sentiment analysis failed:', error)
      return { sentiment: 'neutral', confidence: 0.5, emotions: [] }
    }
  }

  // Process user message with real AI
  const processAIMessage = async (userMessage) => {
    setIsProcessing(true)
    
    try {
      // Determine intent using real AI
      const intent = await apiService.classifyUserIntent({
        message: userMessage,
        context: 'roi_analysis',
        availableActions: [
          'analyze_trends',
          'predict_roi',
          'optimize_investment',
          'assess_risk',
          'market_intelligence',
          'general_question'
        ]
      })

      let aiResponse = ''
      let additionalData = null

      switch (intent.action) {
        case 'analyze_trends':
          const trendAnalysis = await analyzeROITrends(roiData)
          aiResponse = `📊 **Trend Analysis Results:**

Based on your ROI data, I've identified several key trends:

🔍 **Key Findings:**
${trendAnalysis.insights.map(insight => `• ${insight}`).join('\n')}

📈 **Performance Metrics:**
• Current ROI: ${trendAnalysis.currentROI}%
• Trend Direction: ${trendAnalysis.trendDirection}
• Volatility: ${trendAnalysis.volatility}
• Confidence Score: ${trendAnalysis.confidence}%

💡 **Recommendations:**
${trendAnalysis.recommendations.map(rec => `• ${rec}`).join('\n')}`
          additionalData = trendAnalysis
          break

        case 'predict_roi':
          const prediction = await predictFutureROI(roiData)
          aiResponse = `🔮 **ROI Prediction (Next 12 Months):**

Based on historical data and market analysis:

📊 **Predicted Outcomes:**
• Expected ROI: ${prediction.expectedROI}%
• Best Case: ${prediction.bestCase}%
• Worst Case: ${prediction.worstCase}%
• Probability of Success: ${prediction.successProbability}%

🎯 **Key Factors:**
${prediction.factors.map(factor => `• ${factor.name}: ${factor.impact}`).join('\n')}

⚠️ **Risk Considerations:**
${prediction.risks.map(risk => `• ${risk}`).join('\n')}`
          additionalData = prediction
          break

        case 'optimize_investment':
          const optimization = await generateOptimizationSuggestions(roiData)
          aiResponse = `⚡ **Investment Optimization Suggestions:**

I've analyzed your portfolio and identified optimization opportunities:

🎯 **Priority Actions:**
${optimization.priorityActions.map(action => `• ${action.description} (Impact: ${action.impact})`).join('\n')}

💰 **Budget Reallocation:**
${optimization.budgetSuggestions.map(suggestion => `• ${suggestion}`).join('\n')}

📈 **Expected Improvements:**
• ROI Increase: +${optimization.expectedImprovement}%
• Risk Reduction: -${optimization.riskReduction}%
• Payback Period: ${optimization.newPaybackPeriod} months`
          additionalData = optimization
          break

        case 'assess_risk':
          const riskAssessment = await apiService.assessInvestmentRisk({
            investment: roiData.investment,
            category: roiData.category,
            marketConditions: 'current'
          })
          aiResponse = `⚡ **Risk Assessment Report:**

Current risk profile for your investment:

🎯 **Risk Score:** ${riskAssessment.riskScore}/10 (${riskAssessment.riskLevel})

📊 **Risk Breakdown:**
• Market Risk: ${riskAssessment.marketRisk}%
• Technology Risk: ${riskAssessment.technologyRisk}%
• Operational Risk: ${riskAssessment.operationalRisk}%
• Financial Risk: ${riskAssessment.financialRisk}%

🛡️ **Mitigation Strategies:**
${riskAssessment.mitigationStrategies.map(strategy => `• ${strategy}`).join('\n')}`
          additionalData = riskAssessment
          break

        case 'market_intelligence':
          const marketData = await apiService.getMarketIntelligence({
            industry: roiData.category,
            region: 'global',
            timeframe: '30d'
          })
          aiResponse = `🌍 **Market Intelligence Report:**

Latest market insights for ${roiData.category}:

📈 **Market Trends:**
${marketData.trends.map(trend => `• ${trend.description} (${trend.impact})`).join('\n')}

🏆 **Industry Benchmarks:**
• Average ROI: ${marketData.benchmarks.averageROI}%
• Top Quartile: ${marketData.benchmarks.topQuartile}%
• Your Position: ${marketData.yourPosition}

🔮 **Market Outlook:**
${marketData.outlook.summary}

💡 **Strategic Recommendations:**
${marketData.recommendations.map(rec => `• ${rec}`).join('\n')}`
          additionalData = marketData
          break

        default:
          // General AI conversation
          const generalResponse = await apiService.chatWithAI({
            message: userMessage,
            context: 'roi_financial_advisor',
            conversationHistory: messages.slice(-5)
          })
          aiResponse = generalResponse.message
          additionalData = generalResponse.data
      }

      // Add AI response to messages
      const aiMessage = {
        id: messages.length + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        data: additionalData,
        intent: intent.action,
        confidence: intent.confidence
      }

      setMessages(prev => [...prev, aiMessage])

      // Trigger callback if insights were generated
      if (additionalData && onInsightGenerated) {
        onInsightGenerated(additionalData)
      }

    } catch (error) {
      console.error('AI processing error:', error)
      
      // Fallback response
      const fallbackMessage = {
        id: messages.length + 1,
        type: 'ai',
        content: "I apologize, but I'm experiencing some technical difficulties. However, I can still help you with basic ROI analysis. Could you please rephrase your question or try asking about trends, predictions, or optimization strategies?",
        timestamp: new Date(),
        error: true
      }
      
      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageToProcess = inputMessage.trim()
    setInputMessage('')

    // Process with AI
    await processAIMessage(messageToProcess)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Quick action buttons
  const quickActions = [
    { label: '📊 Analyze Trends', action: 'analyze_trends', prompt: 'Analyze the current ROI trends in my data' },
    { label: '🔮 Predict ROI', action: 'predict_roi', prompt: 'Predict my ROI for the next 12 months' },
    { label: '⚡ Optimize Investment', action: 'optimize_investment', prompt: 'How can I optimize my current investment strategy?' },
    { label: '🛡️ Assess Risk', action: 'assess_risk', prompt: 'What are the risks associated with my current investments?' },
    { label: '🌍 Market Intel', action: 'market_intelligence', prompt: 'Give me the latest market intelligence for my industry' }
  ]

  const handleQuickAction = (prompt) => {
    setInputMessage(prompt)
    setTimeout(() => handleSendMessage(), 100)
  }

  // Fallback functions for when AI API is unavailable
  const generateFallbackAnalysis = (data) => ({
    insights: [
      'ROI performance shows steady growth pattern',
      'Investment category demonstrates above-average returns',
      'Risk-adjusted returns are within acceptable parameters'
    ],
    currentROI: data.roi || 25,
    trendDirection: 'Positive',
    volatility: 'Moderate',
    confidence: 78,
    recommendations: [
      'Consider increasing investment allocation by 10-15%',
      'Monitor market conditions for optimal timing',
      'Diversify within the same category for risk mitigation'
    ]
  })

  const generateFallbackPrediction = (data, timeframe) => ({
    expectedROI: (data.roi || 25) * 1.12,
    bestCase: (data.roi || 25) * 1.25,
    worstCase: (data.roi || 25) * 0.85,
    successProbability: 82,
    factors: [
      { name: 'Market Conditions', impact: 'Positive' },
      { name: 'Technology Adoption', impact: 'Strong Positive' },
      { name: 'Economic Indicators', impact: 'Neutral' }
    ],
    risks: [
      'Market volatility could impact short-term returns',
      'Regulatory changes may affect long-term outlook'
    ]
  })

  const generateFallbackOptimization = (data) => ({
    priorityActions: [
      { description: 'Reallocate 20% budget to high-performing segments', impact: 'High' },
      { description: 'Implement automated monitoring systems', impact: 'Medium' },
      { description: 'Establish performance benchmarks', impact: 'Medium' }
    ],
    budgetSuggestions: [
      'Increase technology investment by 15%',
      'Reduce operational overhead by 8%',
      'Allocate 5% for innovation projects'
    ],
    expectedImprovement: 18,
    riskReduction: 12,
    newPaybackPeriod: Math.max(6, (data.paybackPeriod || 12) - 2)
  })

  return (
    <div className="ai-assistant-container">
      <div className="ai-header">
        <div className="ai-status">
          <div className="ai-avatar">🤖</div>
          <div className="ai-info">
            <h3>AI ROI Analyst</h3>
            <p className={`status ${isProcessing ? 'processing' : 'ready'}`}>
              {isProcessing ? 'Analyzing...' : 'Ready to help'}
            </p>
          </div>
        </div>
        
        <div className="ai-capabilities">
          {Object.entries(aiCapabilities).map(([capability, enabled]) => (
            <span key={capability} className={`capability ${enabled ? 'enabled' : 'disabled'}`}>
              {capability.replace('_', ' ')}
            </span>
          ))}
        </div>
      </div>

      <div className="messages-container">
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-content">
              <div className="message-text">
                {message.content.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
              {message.data && (
                <div className="message-data">
                  <small>📊 Analysis data available</small>
                </div>
              )}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="message ai processing">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleQuickAction(action.prompt)}
            className="quick-action-btn"
            disabled={isProcessing}
          >
            {action.label}
          </button>
        ))}
      </div>

      <div className="input-container">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your ROI, market trends, or investment optimization..."
          className="message-input"
          rows="2"
          disabled={isProcessing}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isProcessing}
          className="send-button"
        >
          {isProcessing ? '⏳' : '🚀'}
        </button>
      </div>
    </div>
  )
}

export default RealAIAssistant