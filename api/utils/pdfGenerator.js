// PDF Generation Utility for ROI Reports
const puppeteer = require('puppeteer')
const fs = require('fs').promises

// Generate ROI PDF Report
const generateROIPDF = async (roiData, companyName = '', contactInfo = {}) => {
  let browser = null
  
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Set page format
    await page.setViewport({ width: 1200, height: 800 })
    
    // Generate HTML content
    const htmlContent = generateROIReportHTML(roiData, companyName, contactInfo)
    
    // Set HTML content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000
    })
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #666;">
          <span>ROI Analysis Report - ${companyName || 'Enterprise'}</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 10px; width: 100%; text-align: center; color: #666;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span> | Generated on ${new Date().toLocaleDateString()}</span>
        </div>
      `
    })
    
    return pdfBuffer
    
  } catch (error) {
    console.error('PDF Generation Error:', error)
    throw new Error('Failed to generate PDF report')
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

// Generate HTML content for PDF
const generateROIReportHTML = (roiData, companyName, contactInfo) => {
  const {
    investment,
    investmentFormatted,
    category,
    scenario,
    specificScenario,
    roi,
    roiFormatted,
    netReturn,
    netReturnFormatted,
    totalReturn,
    totalReturnFormatted,
    timeToROI,
    monthlyReturn,
    monthlyReturnFormatted,
    annualReturn,
    annualReturnFormatted,
    breakEvenMonths,
    currency,
    researchSource,
    factorAnalysis,
    recommendations,
    calculatedAt
  } = roiData

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>ROI Analysis Report - ${companyName || 'Enterprise'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .section {
          margin-bottom: 30px;
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }
        
        .section h2 {
          color: #667eea;
          font-size: 20px;
          margin-bottom: 15px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 5px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin: 20px 0;
        }
        
        .metric-card {
          text-align: center;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        .metric-label {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 5px;
          text-transform: uppercase;
          font-weight: bold;
        }
        
        .metric-value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }
        
        .metric-value.positive {
          color: #10b981;
        }
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        
        .details-table th,
        .details-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .details-table th {
          background: #f9fafb;
          font-weight: bold;
          color: #374151;
        }
        
        .factor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .factor-item:last-child {
          border-bottom: none;
        }
        
        .factor-name {
          font-weight: 500;
        }
        
        .factor-impact {
          color: #10b981;
          font-weight: bold;
        }
        
        .recommendation {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 10px 0;
        }
        
        .recommendation h4 {
          color: #1e40af;
          margin-bottom: 5px;
        }
        
        .recommendation p {
          color: #374151;
          font-size: 14px;
        }
        
        .footer {
          margin-top: 40px;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
        
        .research-citation {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          padding: 15px;
          border-radius: 8px;
          margin: 15px 0;
        }
        
        .research-citation strong {
          color: #92400e;
        }
        
        @media print {
          .header {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ROI Analysis Report</h1>
        <p>${companyName ? `Prepared for ${companyName}` : 'Enterprise ROI Analysis'}</p>
        <p>Generated on ${new Date(calculatedAt).toLocaleDateString()}</p>
      </div>
      
      <div class="container">
        <!-- Executive Summary -->
        <div class="section">
          <h2>Executive Summary</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Investment</div>
              <div class="metric-value">${investmentFormatted}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Net Return</div>
              <div class="metric-value positive">${netReturnFormatted}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">ROI</div>
              <div class="metric-value positive">${roiFormatted}</div>
            </div>
          </div>
          
          <p>This analysis projects a <strong>${roiFormatted}</strong> return on investment over <strong>${timeToROI} months</strong> for your <strong>${category}</strong> initiative using a <strong>${scenario}</strong> scenario.</p>
        </div>
        
        <!-- Investment Details -->
        <div class="section">
          <h2>Investment Details</h2>
          <table class="details-table">
            <tr>
              <th>Category</th>
              <td>${category}</td>
            </tr>
            <tr>
              <th>Scenario</th>
              <td>${scenario}</td>
            </tr>
            ${specificScenario ? `
            <tr>
              <th>Specific Initiative</th>
              <td>${specificScenario}</td>
            </tr>
            ` : ''}
            <tr>
              <th>Currency</th>
              <td>${currency}</td>
            </tr>
            <tr>
              <th>Time to ROI</th>
              <td>${timeToROI} months</td>
            </tr>
            <tr>
              <th>Break-even Point</th>
              <td>${breakEvenMonths} months</td>
            </tr>
          </table>
        </div>
        
        <!-- Financial Projections -->
        <div class="section">
          <h2>Financial Projections</h2>
          <table class="details-table">
            <tr>
              <th>Initial Investment</th>
              <td>${investmentFormatted}</td>
            </tr>
            <tr>
              <th>Total Return</th>
              <td style="color: #10b981; font-weight: bold;">${totalReturnFormatted}</td>
            </tr>
            <tr>
              <th>Net Return</th>
              <td style="color: #10b981; font-weight: bold;">${netReturnFormatted}</td>
            </tr>
            <tr>
              <th>Monthly Return</th>
              <td>${monthlyReturnFormatted}</td>
            </tr>
            <tr>
              <th>Annual Return</th>
              <td>${annualReturnFormatted}</td>
            </tr>
          </table>
        </div>
        
        ${factorAnalysis && factorAnalysis.length > 0 ? `
        <!-- Impact Factors -->
        <div class="section">
          <h2>Value Creation Factors</h2>
          ${factorAnalysis.map(factor => `
            <div class="factor-item">
              <span class="factor-name">${factor.factor} (${factor.weight}%)</span>
              <span class="factor-impact">${factor.impactFormatted}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        ${recommendations && recommendations.length > 0 ? `
        <!-- Recommendations -->
        <div class="section">
          <h2>Strategic Recommendations</h2>
          ${recommendations.map(rec => `
            <div class="recommendation">
              <h4>${rec.title}</h4>
              <p>${rec.description}</p>
            </div>
          `).join('')}
        </div>
        ` : ''}
        
        <!-- Research Foundation -->
        <div class="section">
          <h2>Research Foundation</h2>
          <div class="research-citation">
            <strong>Data Source:</strong> ${researchSource}
          </div>
          <p>This analysis is based on industry research and benchmarking data from leading consulting firms and technology vendors. ROI projections include risk adjustments and adoption factors based on real-world implementation experience.</p>
        </div>
        
        ${contactInfo && (contactInfo.name || contactInfo.email) ? `
        <!-- Contact Information -->
        <div class="section">
          <h2>Contact Information</h2>
          <table class="details-table">
            ${contactInfo.name ? `
            <tr>
              <th>Contact</th>
              <td>${contactInfo.name}</td>
            </tr>
            ` : ''}
            ${contactInfo.email ? `
            <tr>
              <th>Email</th>
              <td>${contactInfo.email}</td>
            </tr>
            ` : ''}
            ${contactInfo.phone ? `
            <tr>
              <th>Phone</th>
              <td>${contactInfo.phone}</td>
            </tr>
            ` : ''}
          </table>
        </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <p><strong>Disclaimer:</strong> This ROI analysis is based on industry benchmarks and research data. Actual results may vary based on specific implementation factors, organizational readiness, and market conditions. This report is for informational purposes only and should not be considered as financial advice.</p>
        <p style="margin-top: 10px;">Generated by ROI Calculator Enterprise | Professional Business Analysis Tools</p>
      </div>
    </body>
    </html>
  `
}

module.exports = {
  generateROIPDF
}