import React from 'react'

const Results = ({ results, onNewCalculation, onShowLeadForm, onExportPDF }) => {
  if (!results) return null

  return (
    <div className="results">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">ROI Analysis Results</h2>
          <p className="card-description">
            Based on {results.researchSource}
          </p>
        </div>

        <div className="results-summary grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="result-metric">
            <div className="metric-label">Investment</div>
            <div className="metric-value">{results.investmentFormatted}</div>
          </div>
          
          <div className="result-metric">
            <div className="metric-label">Net Return</div>
            <div className="metric-value text-success">{results.netReturnFormatted}</div>
          </div>
          
          <div className="result-metric">
            <div className="metric-label">ROI</div>
            <div className="metric-value text-success">{results.roiFormatted}</div>
          </div>
        </div>

        <div className="results-details">
          <div className="detail-row">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{results.category}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Scenario:</span>
            <span className="detail-value">{results.scenario}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Time to ROI:</span>
            <span className="detail-value">{results.timeToROI} months</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Monthly Return:</span>
            <span className="detail-value">{results.monthlyReturnFormatted}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Annual Return:</span>
            <span className="detail-value">{results.annualReturnFormatted}</span>
          </div>
        </div>

        <div className="results-actions space-x-4">
          <button className="btn btn-primary" onClick={onShowLeadForm}>
            Get Detailed Analysis
          </button>
          <button className="btn btn-secondary" onClick={onExportPDF}>
            Export PDF
          </button>
          <button className="btn btn-secondary" onClick={onNewCalculation}>
            New Calculation
          </button>
        </div>
      </div>
    </div>
  )
}

export default Results