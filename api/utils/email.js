// Email Notification System
const nodemailer = require('nodemailer')

// Email configuration
const createTransporter = () => {
  // In production, use proper SMTP settings
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  } else {
    // Development: use ethereal email for testing
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    })
  }
}

// Send lead notification email
const sendLeadNotification = async (leadData) => {
  try {
    const transporter = createTransporter()
    
    const {
      leadId,
      firstName,
      lastName,
      email,
      company,
      message,
      roiData
    } = leadData

    // Create HTML email content
    const htmlContent = createLeadNotificationHTML(leadData)
    
    // Email options
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@roicalculator.com',
      to: process.env.NOTIFICATION_EMAIL || 'leads@roicalculator.com',
      subject: `New ROI Calculator Lead: ${firstName} ${lastName} from ${company}`,
      html: htmlContent,
      text: createLeadNotificationText(leadData)
    }

    // Send email
    const result = await transporter.sendMail(mailOptions)
    console.log(`Lead notification sent: ${result.messageId}`)
    
    return result

  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

// Create HTML email content
const createLeadNotificationHTML = (leadData) => {
  const {
    leadId,
    firstName,
    lastName,
    email,
    phone,
    company,
    message,
    roiData
  } = leadData

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New ROI Calculator Lead</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background: #f9f9f9;
          padding: 20px;
          border: 1px solid #ddd;
        }
        .section {
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 5px;
          border-left: 4px solid #667eea;
        }
        .section h3 {
          margin-top: 0;
          color: #667eea;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 10px;
          margin: 10px 0;
        }
        .info-label {
          font-weight: bold;
          color: #555;
        }
        .roi-highlight {
          background: #e8f5e8;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }
        .footer {
          background: #333;
          color: white;
          padding: 15px;
          border-radius: 0 0 8px 8px;
          text-align: center;
          font-size: 12px;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎯 New ROI Calculator Lead</h1>
        <p>Lead ID: ${leadId}</p>
      </div>
      
      <div class="content">
        <div class="section">
          <h3>👤 Contact Information</h3>
          <div class="info-grid">
            <span class="info-label">Name:</span>
            <span>${firstName} ${lastName}</span>
            <span class="info-label">Email:</span>
            <span><a href="mailto:${email}">${email}</a></span>
            <span class="info-label">Phone:</span>
            <span>${phone || 'Not provided'}</span>
            <span class="info-label">Company:</span>
            <span>${company}</span>
          </div>
        </div>

        ${message ? `
        <div class="section">
          <h3>💬 Message</h3>
          <p>${message}</p>
        </div>
        ` : ''}

        ${roiData ? `
        <div class="section">
          <h3>📊 ROI Calculation Details</h3>
          <div class="roi-highlight">
            <div class="info-grid">
              <span class="info-label">Investment:</span>
              <span>${roiData.investmentFormatted || roiData.investment}</span>
              <span class="info-label">Category:</span>
              <span>${roiData.category}</span>
              <span class="info-label">Scenario:</span>
              <span>${roiData.scenario}</span>
              <span class="info-label">ROI:</span>
              <span style="font-weight: bold; color: #28a745;">${roiData.roiFormatted || roiData.roi + '%'}</span>
              <span class="info-label">Net Return:</span>
              <span style="font-weight: bold; color: #28a745;">${roiData.netReturnFormatted || roiData.netReturn}</span>
              <span class="info-label">Timeframe:</span>
              <span>${roiData.timeToROI} months</span>
            </div>
          </div>
        </div>
        ` : ''}

        <div class="section">
          <h3>🚀 Next Steps</h3>
          <p>This lead has expressed interest in ROI analysis. Consider following up with:</p>
          <ul>
            <li>Personalized consultation call</li>
            <li>Detailed ROI report</li>
            <li>Implementation roadmap</li>
            <li>Custom pricing proposal</li>
          </ul>
          <a href="mailto:${email}" class="cta-button">Reply to Lead</a>
        </div>
      </div>

      <div class="footer">
        <p>Generated by ROI Calculator Enterprise | ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `
}

// Create plain text email content
const createLeadNotificationText = (leadData) => {
  const {
    leadId,
    firstName,
    lastName,
    email,
    phone,
    company,
    message,
    roiData
  } = leadData

  let content = `
NEW ROI CALCULATOR LEAD
Lead ID: ${leadId}

CONTACT INFORMATION:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company}
`

  if (message) {
    content += `
MESSAGE:
${message}
`
  }

  if (roiData) {
    content += `
ROI CALCULATION DETAILS:
Investment: ${roiData.investmentFormatted || roiData.investment}
Category: ${roiData.category}
Scenario: ${roiData.scenario}
ROI: ${roiData.roiFormatted || roiData.roi + '%'}
Net Return: ${roiData.netReturnFormatted || roiData.netReturn}
Timeframe: ${roiData.timeToROI} months
`
  }

  content += `
Generated: ${new Date().toLocaleString()}
`

  return content
}

// Send welcome email to lead
const sendWelcomeEmail = async (leadData) => {
  try {
    const transporter = createTransporter()
    
    const {
      firstName,
      lastName,
      email,
      company,
      roiData
    } = leadData

    const htmlContent = createWelcomeEmailHTML(leadData)
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@roicalculator.com',
      to: email,
      subject: `Thank you for your interest, ${firstName}!`,
      html: htmlContent,
      text: createWelcomeEmailText(leadData)
    }

    const result = await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent to ${email}: ${result.messageId}`)
    
    return result

  } catch (error) {
    console.error('Welcome email error:', error)
    throw error
  }
}

// Create welcome email HTML
const createWelcomeEmailHTML = (leadData) => {
  const { firstName, company, roiData } = leadData

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Interest</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px 20px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background: #f9f9f9;
          padding: 30px 20px;
          border: 1px solid #ddd;
        }
        .highlight-box {
          background: white;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
          margin: 20px 0;
        }
        .cta-button {
          display: inline-block;
          background: #667eea;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          background: #333;
          color: white;
          padding: 20px;
          border-radius: 0 0 8px 8px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Thank You, ${firstName}!</h1>
        <p>We've received your ROI calculation request</p>
      </div>
      
      <div class="content">
        <p>Dear ${firstName},</p>
        
        <p>Thank you for using our ROI Calculator for ${company}. We're excited to help you make data-driven investment decisions.</p>
        
        ${roiData ? `
        <div class="highlight-box">
          <h3>📊 Your ROI Analysis Summary</h3>
          <p><strong>Investment:</strong> ${roiData.investmentFormatted}</p>
          <p><strong>Projected ROI:</strong> ${roiData.roiFormatted}</p>
          <p><strong>Net Return:</strong> ${roiData.netReturnFormatted}</p>
          <p><strong>Timeframe:</strong> ${roiData.timeToROI} months</p>
        </div>
        ` : ''}
        
        <div class="highlight-box">
          <h3>🚀 What's Next?</h3>
          <p>Our team will review your requirements and reach out within 24 hours to discuss:</p>
          <ul>
            <li>Detailed ROI analysis tailored to your specific needs</li>
            <li>Implementation roadmap and best practices</li>
            <li>Custom pricing and timeline estimates</li>
            <li>Success stories from similar organizations</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to explore more scenarios with our calculator or reach out if you have any questions.</p>
        
        <center>
          <a href="mailto:support@roicalculator.com" class="cta-button">Contact Our Team</a>
        </center>
        
        <p>Best regards,<br>
        The ROI Calculator Team</p>
      </div>

      <div class="footer">
        <p>ROI Calculator Enterprise | Professional Business Analysis Tools</p>
        <p>This email was sent because you used our ROI Calculator. If you have questions, please contact support@roicalculator.com</p>
      </div>
    </body>
    </html>
  `
}

// Create welcome email text
const createWelcomeEmailText = (leadData) => {
  const { firstName, company, roiData } = leadData

  let content = `
Dear ${firstName},

Thank you for using our ROI Calculator for ${company}. We're excited to help you make data-driven investment decisions.
`

  if (roiData) {
    content += `
YOUR ROI ANALYSIS SUMMARY:
Investment: ${roiData.investmentFormatted}
Projected ROI: ${roiData.roiFormatted}
Net Return: ${roiData.netReturnFormatted}
Timeframe: ${roiData.timeToROI} months
`
  }

  content += `
WHAT'S NEXT?
Our team will review your requirements and reach out within 24 hours to discuss:
- Detailed ROI analysis tailored to your specific needs
- Implementation roadmap and best practices
- Custom pricing and timeline estimates
- Success stories from similar organizations

In the meantime, feel free to explore more scenarios with our calculator or reach out if you have any questions.

Best regards,
The ROI Calculator Team

ROI Calculator Enterprise | Professional Business Analysis Tools
Contact: support@roicalculator.com
`

  return content
}

module.exports = {
  sendLeadNotification,
  sendWelcomeEmail,
  createTransporter
}