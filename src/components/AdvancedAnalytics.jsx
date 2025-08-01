import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut, Radar, Scatter } from 'react-chartjs-2'
import * as apiService from '../services/api'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
)

const AdvancedAnalytics = ({ onClose }) => {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [selectedMetric, setSelectedMetric] = useState('roi_distribution')
  const [filterCategory, setFilterCategory] = useState('all')
  const [comparisonMode, setComparisonMode] = useState(false)

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiService.adminAPI.getAnalytics(timeRange)
      setAnalyticsData(data)
    } catch (err) {
      setError(err.message || 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#667eea',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        intersect: false,
        mode: 'index'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11,
            family: 'Inter, sans-serif'
          }
        }
      }
    }
  }

  // ROI Distribution Chart Data
  const roiDistributionData = useMemo(() => {
    if (!analyticsData?.roiDistribution) return null

    return {
      labels: analyticsData.roiDistribution.map(item => `${item.range}%`),
      datasets: [
        {
          label: 'Number of Calculations',
          data: analyticsData.roiDistribution.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 205, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 205, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 2
        }
      ]
    }
  }, [analyticsData])

  // Category Performance Chart Data
  const categoryPerformanceData = useMemo(() => {
    if (!analyticsData?.categoryPerformance) return null

    const categories = analyticsData.categoryPerformance
    return {
      labels: categories.map(cat => cat.category),
      datasets: [
        {
          label: 'Average ROI (%)',
          data: categories.map(cat => cat.avgROI),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2
        },
        {
          label: 'Total Calculations',
          data: categories.map(cat => cat.totalCalculations),
          backgroundColor: 'rgba(118, 75, 162, 0.8)',
          borderColor: 'rgba(118, 75, 162, 1)',
          borderWidth: 2,
          yAxisID: 'y1'
        }
      ]
    }
  }, [analyticsData])

  // Time Series Chart Data
  const timeSeriesData = useMemo(() => {
    if (!analyticsData?.timeSeries) return null

    return {
      labels: analyticsData.timeSeries.map(item => 
        new Date(item.date).toLocaleDateString()
      ),
      datasets: [
        {
          label: 'Daily Calculations',
          data: analyticsData.timeSeries.map(item => item.calculations),
          borderColor: 'rgba(102, 126, 234, 1)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'New Leads',
          data: analyticsData.timeSeries.map(item => item.leads),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  }, [analyticsData])

  // Investment Size Distribution
  const investmentDistributionData = useMemo(() => {
    if (!analyticsData?.investmentDistribution) return null

    return {
      labels: analyticsData.investmentDistribution.map(item => item.range),
      datasets: [
        {
          label: 'Investment Distribution',
          data: analyticsData.investmentDistribution.map(item => item.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 205, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ]
        }
      ]
    }
  }, [analyticsData])

  // Scenario Comparison Radar Chart
  const scenarioComparisonData = useMemo(() => {
    if (!analyticsData?.scenarioComparison) return null

    const scenarios = analyticsData.scenarioComparison
    return {
      labels: ['Conservative', 'Realistic', 'Optimistic'],
      datasets: [
        {
          label: 'Average ROI',
          data: [
            scenarios.conservative?.avgROI || 0,
            scenarios.realistic?.avgROI || 0,
            scenarios.optimistic?.avgROI || 0
          ],
          backgroundColor: 'rgba(102, 126, 234, 0.2)',
          borderColor: 'rgba(102, 126, 234, 1)',
          pointBackgroundColor: 'rgba(102, 126, 234, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(102, 126, 234, 1)'
        },
        {
          label: 'Usage Count',
          data: [
            scenarios.conservative?.count || 0,
            scenarios.realistic?.count || 0,
            scenarios.optimistic?.count || 0
          ],
          backgroundColor: 'rgba(118, 75, 162, 0.2)',
          borderColor: 'rgba(118, 75, 162, 1)',
          pointBackgroundColor: 'rgba(118, 75, 162, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(118, 75, 162, 1)'
        }
      ]
    }
  }, [analyticsData])

  // Key Performance Indicators
  const kpiData = useMemo(() => {
    if (!analyticsData) return []

    return [
      {
        title: 'Total Calculations',
        value: analyticsData.totalCalculations?.toLocaleString() || '0',
        change: analyticsData.calculationsGrowth || 0,
        icon: '📊'
      },
      {
        title: 'Total Leads',
        value: analyticsData.totalLeads?.toLocaleString() || '0',
        change: analyticsData.leadsGrowth || 0,
        icon: '👥'
      },
      {
        title: 'Average ROI',
        value: `${analyticsData.averageROI?.toFixed(1) || '0'}%`,
        change: analyticsData.roiGrowth || 0,
        icon: '💰'
      },
      {
        title: 'Conversion Rate',
        value: `${analyticsData.conversionRate?.toFixed(1) || '0'}%`,
        change: analyticsData.conversionGrowth || 0,
        icon: '🎯'
      },
      {
        title: 'Avg Investment',
        value: `$${(analyticsData.averageInvestment || 0).toLocaleString()}`,
        change: analyticsData.investmentGrowth || 0,
        icon: '💵'
      },
      {
        title: 'Active Users',
        value: analyticsData.activeUsers?.toLocaleString() || '0',
        change: analyticsData.userGrowth || 0,
        icon: '🔥'
      }
    ]
  }, [analyticsData])

  // Export analytics data
  const exportAnalytics = useCallback(async () => {
    try {
      const exportData = {
        timeRange,
        generatedAt: new Date().toISOString(),
        summary: kpiData,
        rawData: analyticsData
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `roi-analytics-${timeRange}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [analyticsData, kpiData, timeRange])

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content analytics-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading advanced analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal-content analytics-modal">
          <div className="error-container">
            <h3>Analytics Error</h3>
            <p>{error}</p>
            <button onClick={fetchAnalytics} className="btn btn-primary">
              Retry
            </button>
            <button onClick={onClose} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content analytics-modal">
        <div className="analytics-header">
          <div className="analytics-title">
            <h2>📊 Advanced Analytics Dashboard</h2>
            <p>Comprehensive ROI Calculator Performance Metrics</p>
          </div>
          
          <div className="analytics-controls">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="analytics-select"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="analytics-select"
            >
              <option value="roi_distribution">ROI Distribution</option>
              <option value="category_performance">Category Performance</option>
              <option value="time_series">Time Series</option>
              <option value="investment_size">Investment Analysis</option>
              <option value="scenario_comparison">Scenario Comparison</option>
            </select>
            
            <button onClick={exportAnalytics} className="btn btn-secondary">
              📥 Export Data
            </button>
            
            <button onClick={onClose} className="btn btn-primary">
              ✕ Close
            </button>
          </div>
        </div>

        <div className="analytics-content">
          {/* KPI Cards */}
          <div className="kpi-grid">
            {kpiData.map((kpi, index) => (
              <div key={index} className="kpi-card">
                <div className="kpi-icon">{kpi.icon}</div>
                <div className="kpi-content">
                  <h3>{kpi.title}</h3>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className={`kpi-change ${kpi.change >= 0 ? 'positive' : 'negative'}`}>
                    {kpi.change >= 0 ? '↗' : '↘'} {Math.abs(kpi.change).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Chart Area */}
          <div className="chart-container">
            {selectedMetric === 'roi_distribution' && roiDistributionData && (
              <div className="chart-wrapper">
                <h3>ROI Distribution Analysis</h3>
                <div className="chart-canvas">
                  <Doughnut data={roiDistributionData} options={chartOptions} />
                </div>
              </div>
            )}

            {selectedMetric === 'category_performance' && categoryPerformanceData && (
              <div className="chart-wrapper">
                <h3>Category Performance Metrics</h3>
                <div className="chart-canvas">
                  <Bar 
                    data={categoryPerformanceData} 
                    options={{
                      ...chartOptions,
                      scales: {
                        ...chartOptions.scales,
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          grid: {
                            drawOnChartArea: false
                          }
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            )}

            {selectedMetric === 'time_series' && timeSeriesData && (
              <div className="chart-wrapper">
                <h3>Usage Trends Over Time</h3>
                <div className="chart-canvas">
                  <Line data={timeSeriesData} options={chartOptions} />
                </div>
              </div>
            )}

            {selectedMetric === 'investment_size' && investmentDistributionData && (
              <div className="chart-wrapper">
                <h3>Investment Size Distribution</h3>
                <div className="chart-canvas">
                  <Bar data={investmentDistributionData} options={chartOptions} />
                </div>
              </div>
            )}

            {selectedMetric === 'scenario_comparison' && scenarioComparisonData && (
              <div className="chart-wrapper">
                <h3>Scenario Comparison Analysis</h3>
                <div className="chart-canvas">
                  <Radar data={scenarioComparisonData} options={chartOptions} />
                </div>
              </div>
            )}
          </div>

          {/* Detailed Analytics Tables */}
          <div className="analytics-tables">
            <div className="analytics-table-section">
              <h3>📈 Top Performing Categories</h3>
              <div className="analytics-table">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Avg ROI</th>
                      <th>Calculations</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.topCategories?.map((category, index) => (
                      <tr key={index}>
                        <td>{category.name}</td>
                        <td className="metric-value positive">
                          {category.avgROI.toFixed(1)}%
                        </td>
                        <td>{category.calculations.toLocaleString()}</td>
                        <td>{category.conversionRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="analytics-table-section">
              <h3>🏢 Enterprise Clients</h3>
              <div className="analytics-table">
                <table>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Total Investment</th>
                      <th>Calculations</th>
                      <th>Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData?.topClients?.map((client, index) => (
                      <tr key={index}>
                        <td>{client.company}</td>
                        <td className="metric-value">
                          ${client.totalInvestment.toLocaleString()}
                        </td>
                        <td>{client.calculations}</td>
                        <td>{new Date(client.lastActivity).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Real-time Metrics */}
          <div className="realtime-metrics">
            <h3>⚡ Real-time Activity</h3>
            <div className="realtime-grid">
              <div className="realtime-card">
                <div className="realtime-label">Active Sessions</div>
                <div className="realtime-value">{analyticsData?.activeSessions || 0}</div>
              </div>
              <div className="realtime-card">
                <div className="realtime-label">Calculations Today</div>
                <div className="realtime-value">{analyticsData?.calculationsToday || 0}</div>
              </div>
              <div className="realtime-card">
                <div className="realtime-label">Leads Today</div>
                <div className="realtime-value">{analyticsData?.leadsToday || 0}</div>
              </div>
              <div className="realtime-card">
                <div className="realtime-label">Avg Session Duration</div>
                <div className="realtime-value">{analyticsData?.avgSessionDuration || '0m'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedAnalytics