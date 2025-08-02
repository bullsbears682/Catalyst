import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement, RadialLinearScale } from 'chart.js'
import { Line, Bar, Doughnut, Radar, Scatter, Bubble } from 'react-chartjs-2'
import * as apiService from '../services/api'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement, RadialLinearScale)

const ExecutiveDashboard = ({ onClose }) => {
  const [dashboardData, setDashboardData] = useState(null)
  const [timeRange, setTimeRange] = useState('12M')
  const [selectedMetrics, setSelectedMetrics] = useState(['roi', 'investment', 'savings', 'payback'])
  const [benchmarkData, setBenchmarkData] = useState(null)
  const [predictiveData, setPredictiveData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('overview')
  const [filters, setFilters] = useState({
    industry: 'all',
    company_size: 'all',
    region: 'all',
    investment_range: 'all'
  })

  // Fetch comprehensive dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const [analytics, benchmark, predictive] = await Promise.all([
        apiService.getAdvancedAnalytics(timeRange, filters),
        apiService.getBenchmarkData(filters),
        apiService.getPredictiveAnalytics(timeRange)
      ])
      
      setDashboardData(analytics)
      setBenchmarkData(benchmark)
      setPredictiveData(predictive)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [timeRange, filters])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Executive KPI Cards
  const executiveKPIs = useMemo(() => {
    if (!dashboardData) return []
    
    return [
      {
        title: 'Total ROI Generated',
        value: `$${(dashboardData.totalROI / 1000000).toFixed(1)}M`,
        change: dashboardData.roiGrowth,
        trend: 'up',
        icon: '📈',
        color: 'text-green-600'
      },
      {
        title: 'Average Payback Period',
        value: `${dashboardData.avgPayback} months`,
        change: dashboardData.paybackImprovement,
        trend: 'down',
        icon: '⏱️',
        color: 'text-blue-600'
      },
      {
        title: 'Success Rate',
        value: `${dashboardData.successRate}%`,
        change: dashboardData.successRateChange,
        trend: 'up',
        icon: '🎯',
        color: 'text-purple-600'
      },
      {
        title: 'Risk Score',
        value: dashboardData.avgRiskScore,
        change: dashboardData.riskScoreChange,
        trend: 'down',
        icon: '⚡',
        color: 'text-orange-600'
      }
    ]
  }, [dashboardData])

  // Predictive ROI Chart
  const predictiveROIChart = useMemo(() => {
    if (!predictiveData) return null

    return {
      labels: predictiveData.months,
      datasets: [
        {
          label: 'Historical ROI',
          data: predictiveData.historical,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Predicted ROI',
          data: predictiveData.predicted,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderDash: [5, 5],
          tension: 0.4
        },
        {
          label: 'Confidence Interval',
          data: predictiveData.confidenceInterval,
          borderColor: 'rgba(16, 185, 129, 0.3)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: '-1'
        }
      ]
    }
  }, [predictiveData])

  // Industry Benchmark Chart
  const benchmarkChart = useMemo(() => {
    if (!benchmarkData) return null

    return {
      labels: benchmarkData.industries,
      datasets: [
        {
          label: 'Your Performance',
          data: benchmarkData.yourPerformance,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 2
        },
        {
          label: 'Industry Average',
          data: benchmarkData.industryAverage,
          backgroundColor: 'rgba(156, 163, 175, 0.6)',
          borderColor: 'rgb(156, 163, 175)',
          borderWidth: 2
        },
        {
          label: 'Top Quartile',
          data: benchmarkData.topQuartile,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgb(16, 185, 129)',
          borderWidth: 2
        }
      ]
    }
  }, [benchmarkData])

  // Risk-Return Scatter Plot
  const riskReturnChart = useMemo(() => {
    if (!dashboardData?.projects) return null

    return {
      datasets: [
        {
          label: 'Projects',
          data: dashboardData.projects.map(project => ({
            x: project.riskScore,
            y: project.roi,
            r: project.investment / 10000
          })),
          backgroundColor: 'rgba(147, 51, 234, 0.6)',
          borderColor: 'rgb(147, 51, 234)'
        }
      ]
    }
  }, [dashboardData])

  // Export dashboard data
  const exportDashboard = useCallback(async (format) => {
    try {
      const response = await apiService.exportDashboard({
        format,
        timeRange,
        filters,
        includeCharts: true,
        includeRawData: true
      })
      
      const blob = new Blob([response.data], { 
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `executive-dashboard-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [timeRange, filters])

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content executive-dashboard">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading Executive Dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content executive-dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h2>🏢 Executive Dashboard</h2>
            <p>Strategic insights and predictive analytics</p>
          </div>
          <div className="header-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-range-select"
            >
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="12M">Last 12 Months</option>
              <option value="24M">Last 24 Months</option>
            </select>
            <div className="export-controls">
              <button onClick={() => exportDashboard('pdf')} className="btn btn-secondary btn-sm">
                📄 Export PDF
              </button>
              <button onClick={() => exportDashboard('xlsx')} className="btn btn-secondary btn-sm">
                📊 Export Excel
              </button>
            </div>
            <button onClick={onClose} className="modal-close">✕</button>
          </div>
        </div>

        <div className="dashboard-nav">
          {['overview', 'predictive', 'benchmark', 'risk'].map(view => (
            <button
              key={view}
              className={`nav-tab ${activeView === view ? 'active' : ''}`}
              onClick={() => setActiveView(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {activeView === 'overview' && (
            <>
              <div className="kpi-grid">
                {executiveKPIs.map((kpi, index) => (
                  <div key={index} className="kpi-card">
                    <div className="kpi-header">
                      <span className="kpi-icon">{kpi.icon}</span>
                      <h3>{kpi.title}</h3>
                    </div>
                    <div className="kpi-value">
                      <span className={kpi.color}>{kpi.value}</span>
                      <div className={`kpi-change ${kpi.trend === 'up' ? 'positive' : 'negative'}`}>
                        {kpi.trend === 'up' ? '↗' : '↘'} {Math.abs(kpi.change)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="charts-grid">
                <div className="chart-container">
                  <h3>ROI Performance Over Time</h3>
                  {dashboardData?.roiTrend && (
                    <Line
                      data={{
                        labels: dashboardData.roiTrend.labels,
                        datasets: [{
                          label: 'ROI %',
                          data: dashboardData.roiTrend.data,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'top' },
                          title: { display: false }
                        }
                      }}
                    />
                  )}
                </div>

                <div className="chart-container">
                  <h3>Investment Distribution</h3>
                  {dashboardData?.investmentDistribution && (
                    <Doughnut
                      data={{
                        labels: dashboardData.investmentDistribution.labels,
                        datasets: [{
                          data: dashboardData.investmentDistribution.data,
                          backgroundColor: [
                            'rgba(59, 130, 246, 0.8)',
                            'rgba(16, 185, 129, 0.8)',
                            'rgba(245, 158, 11, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(147, 51, 234, 0.8)'
                          ]
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { position: 'right' }
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {activeView === 'predictive' && (
            <div className="predictive-view">
              <div className="predictive-header">
                <h3>🔮 Predictive Analytics</h3>
                <p>AI-powered forecasting based on historical data and market trends</p>
              </div>
              
              <div className="chart-container large">
                <h4>ROI Forecast - Next 12 Months</h4>
                {predictiveROIChart && (
                  <Line
                    data={predictiveROIChart}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                          callbacks: {
                            label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'ROI %' }
                        }
                      }
                    }}
                  />
                )}
              </div>

              <div className="predictions-grid">
                {predictiveData?.insights?.map((insight, index) => (
                  <div key={index} className="prediction-card">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                    <div className="confidence-score">
                      Confidence: {insight.confidence}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'benchmark' && (
            <div className="benchmark-view">
              <div className="benchmark-header">
                <h3>📊 Industry Benchmarking</h3>
                <p>Compare your performance against industry standards</p>
              </div>

              <div className="chart-container large">
                <h4>Performance vs Industry Benchmarks</h4>
                {benchmarkChart && (
                  <Bar
                    data={benchmarkChart}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: { display: true, text: 'ROI %' }
                        }
                      }
                    }}
                  />
                )}
              </div>

              <div className="benchmark-insights">
                {benchmarkData?.insights?.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <div className={`insight-status ${insight.status}`}>
                      {insight.status === 'outperforming' ? '🚀' : 
                       insight.status === 'average' ? '📈' : '⚠️'}
                    </div>
                    <div className="insight-content">
                      <h4>{insight.metric}</h4>
                      <p>{insight.message}</p>
                      <div className="insight-recommendation">
                        💡 {insight.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'risk' && (
            <div className="risk-view">
              <div className="risk-header">
                <h3>⚡ Risk Analysis</h3>
                <p>Portfolio risk assessment and optimization recommendations</p>
              </div>

              <div className="chart-container large">
                <h4>Risk vs Return Analysis</h4>
                {riskReturnChart && (
                  <Bubble
                    data={riskReturnChart}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                          callbacks: {
                            label: (context) => [
                              `Risk Score: ${context.parsed.x}`,
                              `ROI: ${context.parsed.y}%`,
                              `Investment: $${(context.parsed.r * 10000).toLocaleString()}`
                            ]
                          }
                        }
                      },
                      scales: {
                        x: {
                          title: { display: true, text: 'Risk Score' }
                        },
                        y: {
                          title: { display: true, text: 'ROI %' }
                        }
                      }
                    }}
                  />
                )}
              </div>

              <div className="risk-metrics">
                <div className="risk-card">
                  <h4>Portfolio Risk Score</h4>
                  <div className="risk-score-display">
                    <div className={`risk-gauge ${dashboardData?.portfolioRisk?.level}`}>
                      {dashboardData?.portfolioRisk?.score || 'N/A'}
                    </div>
                    <p>{dashboardData?.portfolioRisk?.level || 'Unknown'} Risk</p>
                  </div>
                </div>

                <div className="risk-recommendations">
                  <h4>Risk Optimization</h4>
                  {dashboardData?.riskRecommendations?.map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <span className="rec-priority">{rec.priority}</span>
                      <span className="rec-text">{rec.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExecutiveDashboard