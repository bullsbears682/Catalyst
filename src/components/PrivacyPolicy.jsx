import React from 'react'

const PrivacyPolicy = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content privacy-policy-modal">
        <div className="modal-header">
          <h2>🛡️ Privacy Policy</h2>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <div className="modal-body privacy-content">
          <div className="privacy-section">
            <p><strong>Last Updated:</strong> December 15, 2024</p>
            <p><strong>Effective Date:</strong> January 1, 2025</p>
            <p><em>Note: We're updating our privacy practices for the new year. The main changes are around cookie management and data retention periods.</em></p>
          </div>

          <div className="privacy-section">
            <h3>What Information Do We Collect?</h3>
            <p>Look, we're not trying to be sneaky here. Here's what we actually collect and why:</p>
            
            <h4>Stuff You Give Us Directly</h4>
            <ul>
              <li><strong>Contact Info:</strong> Your name, email, phone number, company name (when you fill out forms)</li>
              <li><strong>ROI Calculations:</strong> The numbers you put in, what categories you pick, your results</li>
              <li><strong>Feedback:</strong> If you email us or use our contact forms</li>
            </ul>

            <h4>Stuff We Collect Automatically</h4>
            <ul>
              <li><strong>Usage Data:</strong> Which pages you visit, how long you stay, what buttons you click</li>
              <li><strong>Technical Stuff:</strong> Your IP address, browser type, device info (pretty standard web stuff)</li>
              <li><strong>Performance Data:</strong> How fast the site loads for you, any errors you encounter</li>
            </ul>

            <h4>Cookies & Tracking</h4>
            <p>Yeah, we use cookies. Most websites do. We try to be reasonable about it:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> These keep the site working. Can't really turn these off.</li>
              <li><strong>Analytics:</strong> Help us see what's popular and what's broken</li>
              <li><strong>Preferences:</strong> Remember your settings so you don't have to keep re-entering them</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>What Do We Do With Your Information?</h3>
            <p>We're not in the business of selling your data. Here's what we actually do:</p>
            <ul>
              <li><strong>Make the calculator work:</strong> Obviously, we need your input to calculate ROI and generate reports</li>
              <li><strong>Make it better:</strong> We look at usage patterns to fix bugs and add features people actually want</li>
              <li><strong>Keep in touch:</strong> Send you your reports, maybe occasional updates (you can opt out)</li>
              <li><strong>Stay legal:</strong> Sometimes we have to keep records for compliance reasons</li>
              <li><strong>Marketing:</strong> Only if you explicitly say it's okay. We hate spam too.</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>3. Information Sharing</h3>
            <p>We <strong>DO NOT</strong> sell your personal information. We may share data with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Email services, hosting providers, analytics tools</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>4. Your GDPR Rights (EU Users)</h3>
            <div className="gdpr-rights">
              <div className="right-item">
                <h4>🔍 Right to Access</h4>
                <p>Request a copy of all personal data we hold about you</p>
              </div>
              <div className="right-item">
                <h4>✏️ Right to Rectification</h4>
                <p>Correct any inaccurate or incomplete personal data</p>
              </div>
              <div className="right-item">
                <h4>🗑️ Right to Erasure</h4>
                <p>Request deletion of your personal data ("right to be forgotten")</p>
              </div>
              <div className="right-item">
                <h4>📦 Right to Portability</h4>
                <p>Transfer your data to another service in a machine-readable format</p>
              </div>
              <div className="right-item">
                <h4>🚫 Right to Object</h4>
                <p>Object to processing of your personal data for marketing purposes</p>
              </div>
              <div className="right-item">
                <h4>⏸️ Right to Restrict</h4>
                <p>Limit how we process your personal data in certain circumstances</p>
              </div>
            </div>
          </div>

          <div className="privacy-section">
            <h3>5. Data Security</h3>
            <ul>
              <li><strong>Encryption:</strong> All data transmitted using HTTPS/TLS encryption</li>
              <li><strong>Access Controls:</strong> Limited access to personal data on need-to-know basis</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              <li><strong>Data Minimization:</strong> We only collect data necessary for our service</li>
              <li><strong>Retention Limits:</strong> Data deleted after reasonable retention period</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>6. Cookies & Tracking</h3>
            <div className="cookie-types">
              <div className="cookie-type">
                <h4>🔧 Necessary Cookies</h4>
                <p>Essential for website functionality. Cannot be disabled.</p>
                <p><em>Examples: Session management, security tokens, form data</em></p>
              </div>
              <div className="cookie-type">
                <h4>⚙️ Functional Cookies</h4>
                <p>Remember your preferences and settings.</p>
                <p><em>Examples: Language, currency, calculation history</em></p>
              </div>
              <div className="cookie-type">
                <h4>📊 Analytics Cookies</h4>
                <p>Help us understand how you use our service.</p>
                <p><em>Examples: Page views, user flows, performance metrics</em></p>
              </div>
              <div className="cookie-type">
                <h4>🎯 Marketing Cookies</h4>
                <p>Used for targeted advertising and marketing campaigns.</p>
                <p><em>Examples: Ad targeting, conversion tracking, remarketing</em></p>
              </div>
            </div>
          </div>

          <div className="privacy-section">
            <h3>7. Data Retention</h3>
            <ul>
              <li><strong>Account Data:</strong> Retained while your account is active</li>
              <li><strong>ROI Calculations:</strong> Stored for 3 years for analytics purposes</li>
              <li><strong>Marketing Data:</strong> Deleted immediately upon opt-out</li>
              <li><strong>Log Data:</strong> Automatically deleted after 12 months</li>
              <li><strong>Legal Data:</strong> Retained as required by applicable law</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>8. International Transfers</h3>
            <p>Your data may be transferred to and processed in countries other than your own. We ensure adequate protection through:</p>
            <ul>
              <li>EU-US Data Privacy Framework compliance</li>
              <li>Standard Contractual Clauses (SCCs)</li>
              <li>Adequacy decisions by the European Commission</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h3>9. Children's Privacy</h3>
            <p>Our service is not intended for children under 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
          </div>

          <div className="privacy-section">
            <h3>10. Changes to This Policy</h3>
            <p>We may update this privacy policy to reflect changes in our practices or legal requirements. We will notify you of material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending email notification to registered users</li>
              <li>Displaying a prominent notice on our service</li>
            </ul>
          </div>

          <div className="privacy-section contact-section">
            <h3>11. Contact Information</h3>
            <div className="contact-details">
              <div className="contact-item">
                <h4>📧 Data Protection Officer</h4>
                <p>Email: <a href="mailto:privacy@roicalculator.com">privacy@roicalculator.com</a></p>
              </div>
              <div className="contact-item">
                <h4>🏢 Company Address</h4>
                <p>ROI Calculator Enterprise<br />
                123 Business District<br />
                San Francisco, CA 94105<br />
                United States</p>
              </div>
              <div className="contact-item">
                <h4>🇪🇺 EU Representative</h4>
                <p>Email: <a href="mailto:eu-privacy@roicalculator.com">eu-privacy@roicalculator.com</a></p>
              </div>
            </div>
          </div>

          <div className="privacy-section">
            <h3>12. Supervisory Authority</h3>
            <p>If you are in the EU and have concerns about our data processing, you have the right to lodge a complaint with your local data protection authority.</p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary">
            I Understand
          </button>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy