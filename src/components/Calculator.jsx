import React from 'react'
import { roiCategories, roiScenarios } from '../data/roiData'

const Calculator = ({ 
  formData, 
  onInputChange, 
  onCalculate, 
  availableScenarios, 
  isFormValid, 
  isLoading,
  calculationHistory,
  onLoadFromHistory 
}) => {
  return (
    <div className="calculator">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">HubSpot ROI Calculator</h2>
          <p className="card-description">
            Calculate your HubSpot ROI with data from 40+ marketing, sales, and service scenarios. Compare against Salesforce, Marketo, and other platforms.
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onCalculate(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Investment Amount */}
            <div className="form-group">
              <label htmlFor="investment" className="form-label required">
                Investment Amount
              </label>
              <input
                id="investment"
                type="text"
                className="form-input"
                value={formData.investment}
                onChange={(e) => onInputChange('investment', e.target.value)}
                placeholder="Enter investment amount"
              />
              <small className="form-help">Minimum $1,000</small>
            </div>

            {/* Currency */}
            <div className="form-group">
              <label htmlFor="currency" className="form-label">
                Currency
              </label>
              <select
                id="currency"
                className="form-select"
                value={formData.currency}
                onChange={(e) => onInputChange('currency', e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category" className="form-label required">
                Investment Category
              </label>
              <select
                id="category"
                className="form-select"
                value={formData.category}
                onChange={(e) => onInputChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                {Object.entries(roiCategories).map(([key, category]) => (
                  <option key={key} value={key}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario */}
            <div className="form-group">
              <label htmlFor="scenario" className="form-label required">
                Scenario
              </label>
              <select
                id="scenario"
                className="form-select"
                value={formData.scenario}
                onChange={(e) => onInputChange('scenario', e.target.value)}
              >
                {Object.entries(roiScenarios).map(([key, scenario]) => (
                  <option key={key} value={key}>
                    {scenario.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Specific Scenario */}
          {availableScenarios.length > 0 && (
            <div className="form-group">
              <label htmlFor="specificScenario" className="form-label">
                Specific Scenario (Optional)
              </label>
              <select
                id="specificScenario"
                className="form-select"
                value={formData.specificScenario}
                onChange={(e) => onInputChange('specificScenario', e.target.value)}
              >
                <option value="">Use category average</option>
                {availableScenarios.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Calculate Button */}
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Calculating...
                </>
              ) : (
                'Calculate ROI'
              )}
            </button>
          </div>
        </form>

        {/* Calculation History */}
        {calculationHistory.length > 0 && (
          <div className="calculation-history">
            <h3>Recent Calculations</h3>
            <div className="history-list">
              {calculationHistory.slice(0, 5).map((calc, index) => (
                <div key={index} className="history-item">
                  <div className="history-info">
                    <span className="history-category">{calc.category}</span>
                    <span className="history-investment">{calc.investmentFormatted}</span>
                    <span className="history-roi">{calc.roiFormatted}</span>
                  </div>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onLoadFromHistory(calc)}
                  >
                    Load
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Calculator