// Email Service for LinkedIn Analysis Leads
// This service handles sending emails to LinkedIn analysis leads

class EmailService {
  constructor() {
    // You can integrate with various email services:
    // - Resend (recommended for React apps)
    // - SendGrid
    // - Mailgun
    // - Supabase Edge Functions + Resend
    
    this.apiKey = import.meta.env.VITE_EMAIL_API_KEY
    this.fromEmail = import.meta.env.VITE_FROM_EMAIL || 'noreply@yourdomain.com'
    this.baseUrl = import.meta.env.VITE_EMAIL_API_URL || 'https://api.resend.com'
  }

  // Send confirmation email immediately after form submission
  async sendConfirmationEmail(leadData) {
    const emailData = {
      to: leadData.email,
      from: this.fromEmail,
      subject: 'Your LinkedIn Analysis is Being Prepared! 🎯',
      html: this.getConfirmationEmailTemplate(leadData)
    }

    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      throw error
    }
  }

  // Send LinkedIn analysis report
  async sendAnalysisReport(leadData, analysisResults) {
    const emailData = {
      to: leadData.email,
      from: this.fromEmail,
      subject: `Your LinkedIn Analysis Report is Ready! 📊`,
      html: this.getAnalysisReportTemplate(leadData, analysisResults)
    }

    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        throw new Error(`Email API error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending analysis report:', error)
      throw error
    }
  }

  // Email template for confirmation
  getConfirmationEmailTemplate(leadData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LinkedIn Analysis Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #6b7280; }
          .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Your LinkedIn Analysis is Being Prepared!</h1>
            <p>Hi ${leadData.firstName}, we're excited to help optimize your LinkedIn profile!</p>
          </div>
          
          <div class="content">
            <h2>What happens next?</h2>
            <p>Our AI is analyzing your LinkedIn profile at <strong>${leadData.linkedinUrl}</strong> to provide personalized recommendations for ${leadData.targetRole} roles.</p>
            
            <div class="highlight">
              <strong>⏰ Timeline:</strong> You'll receive your detailed analysis report within 24 hours.
            </div>
            
            <h3>Your analysis will include:</h3>
            <ul>
              <li>✅ Profile optimization score</li>
              <li>✅ SDR readiness assessment</li>
              <li>✅ Personalized recommendations</li>
              <li>✅ Industry-specific insights</li>
              <li>✅ Action plan with next steps</li>
            </ul>
            
            <p>In the meantime, feel free to explore our <a href="https://yourdomain.com/courses">SDR training courses</a> to get a head start on your career transition.</p>
            
            <a href="https://yourdomain.com/dashboard" class="cta-button">View Dashboard</a>
          </div>
          
          <div class="footer">
            <p>This email was sent because you requested a LinkedIn analysis. If you didn't request this, please ignore this email.</p>
            <p>© 2025 SDR Roadmap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  // Email template for analysis report
  getAnalysisReportTemplate(leadData, analysisResults) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LinkedIn Analysis Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
          .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px; color: #6b7280; }
          .metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
          .metric-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
          .metric-value { font-size: 24px; font-weight: 800; color: #1f2937; }
          .metric-label { font-size: 14px; color: #6b7280; }
          .recommendation { background: #f0f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 15px 0; }
          .cta-button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Your LinkedIn Analysis Report is Ready!</h1>
            <p>Hi ${leadData.firstName}, here's your personalized LinkedIn optimization report</p>
          </div>
          
          <div class="content">
            <h2>Your LinkedIn Performance Metrics</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value">${analysisResults.metrics.profileViews}</div>
                <div class="metric-label">Profile Views</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analysisResults.metrics.connectionRequests}</div>
                <div class="metric-label">Connection Requests</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analysisResults.metrics.engagementRate}%</div>
                <div class="metric-label">Engagement Rate</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${analysisResults.metrics.recruiterViews}</div>
                <div class="metric-label">Recruiter Views</div>
              </div>
            </div>
            
            <h2>Your Profile Score: ${analysisResults.profileScore}/100</h2>
            <p>Based on your ${leadData.experience_level} years of experience targeting ${leadData.targetRole} roles.</p>
            
            <h3>Top Recommendations:</h3>
            ${analysisResults.recommendations.slice(0, 3).map(rec => `
              <div class="recommendation">
                <strong>${rec.category}:</strong> ${rec.suggested}
              </div>
            `).join('')}
            
            <h3>Next Steps:</h3>
            <ol>
              ${analysisResults.nextSteps.slice(0, 3).map(step => `
                <li><strong>${step.title}:</strong> ${step.description}</li>
              `).join('')}
            </ol>
            
            <p>Ready to take your SDR career to the next level? Check out our comprehensive training programs!</p>
            
            <a href="https://yourdomain.com/courses" class="cta-button">Explore SDR Courses</a>
          </div>
          
          <div class="footer">
            <p>Questions about your analysis? Reply to this email and we'll help you out!</p>
            <p>© 2025 SDR Roadmap. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export const emailService = new EmailService()
