import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  FiLinkedin, 
  FiEye, 
  FiUsers, 
  FiMessageCircle, 
  FiTarget,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiDownload,
  FiShare2,
  FiHome,
  FiTrendingUp,
  FiAward,
  FiClock
} from 'react-icons/fi'
import BeckyLogo from '../components/BeckyLogo'
import './LinkedInAnalysisResults.css'

const LinkedInAnalysisResults = () => {
  const navigate = useNavigate()
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get analysis results from session storage
    const storedData = sessionStorage.getItem('linkedinAnalysisResults')
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)
        setAnalysisData(parsedData)
      } catch (error) {
        console.error('Error parsing analysis data:', error)
        navigate('/')
      }
    } else {
      // No analysis data found, redirect to home
      navigate('/')
    }
    
    setLoading(false)
  }, [navigate])

  const handleGetStarted = () => {
    // Store the user's information for autofill on signup
    const signupData = {
      firstName: analysisData.leadData.firstName,
      lastName: analysisData.leadData.lastName,
      email: analysisData.leadData.email,
      targetRole: analysisData.leadData.targetRole,
      experience: analysisData.leadData.experience,
      linkedinUrl: analysisData.leadData.linkedinUrl,
      source: 'linkedin_analysis_results'
    }
    
    // Store in session storage for the signup form to use
    sessionStorage.setItem('signupPrefillData', JSON.stringify(signupData))
    
    // Navigate to the landing page with signup modal trigger
    navigate('/', { 
      state: { 
        openSignupModal: true,
        prefillData: signupData
      } 
    })
  }

  const handleDownloadReport = () => {
    // Create a downloadable report
    const reportContent = generateReportContent(analysisData)
    const blob = new Blob([reportContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `linkedin-analysis-${analysisData.leadData.firstName}-${analysisData.leadData.lastName}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateReportContent = (data) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>LinkedIn Analysis Report - ${data.leadData.firstName} ${data.leadData.lastName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 40px; }
          .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 30px 0; }
          .metric { background: #f8fafc; padding: 20px; border-radius: 10px; text-align: center; }
          .metric-value { font-size: 2em; font-weight: bold; color: #2563eb; }
          .recommendations { margin: 30px 0; }
          .recommendation { background: #f0f9ff; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0ea5e9; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LinkedIn Analysis Report</h1>
          <h2>${data.leadData.firstName} ${data.leadData.lastName}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div class="metrics">
          <div class="metric">
            <div class="metric-value">${data.analysisResults.metrics.profileViews}</div>
            <div>Profile Views</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.analysisResults.metrics.connectionRequests}</div>
            <div>Connection Requests</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.analysisResults.metrics.engagementRate}%</div>
            <div>Engagement Rate</div>
          </div>
          <div class="metric">
            <div class="metric-value">${data.analysisResults.metrics.recruiterViews}</div>
            <div>Recruiter Views</div>
          </div>
        </div>
        
        <h3>Profile Score: ${data.analysisResults.profileScore}/100</h3>
        
        <div class="recommendations">
          <h3>Recommendations:</h3>
          ${data.analysisResults.recommendations.map(rec => `
            <div class="recommendation">
              <strong>${rec.category}:</strong> ${rec.suggested}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `
  }

  if (loading) {
    return (
      <div className="analysis-results-loading">
        <div className="loading-spinner"></div>
        <p>Generating your LinkedIn analysis...</p>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="analysis-results-error">
        <h2>No Analysis Data Found</h2>
        <p>Please complete the LinkedIn analysis form first.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go to Analysis Form
        </button>
      </div>
    )
  }

  const { leadData, analysisResults } = analysisData

  return (
    <div className="analysis-results-page">
      {/* Header */}
      <header className="results-header">
        <div className="header-content">
          <div className="logo-section" onClick={() => navigate('/')}>
            <BeckyLogo size="small" animated={false} />
            <span className="logo-text">SDR Roadmap</span>
          </div>
          <button onClick={() => navigate('/')} className="home-btn">
            <FiHome />
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="results-main">
        <div className="results-container">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">
              <FiCheckCircle />
            </div>
            <h1>Your LinkedIn Analysis is Ready!</h1>
            <p className="success-subtitle">
              Hi {leadData.firstName}, here's your personalized LinkedIn optimization report for {leadData.targetRole} roles.
            </p>
          </div>

          {/* Profile Overview */}
          <div className="profile-overview">
            <div className="overview-header">
              <FiLinkedin className="linkedin-icon" />
              <h2>Profile Overview</h2>
            </div>
            <div className="overview-content">
              <div className="profile-info">
                <div className="info-item">
                  <strong>Name:</strong> {leadData.firstName} {leadData.lastName}
                </div>
                <div className="info-item">
                  <strong>Target Role:</strong> {leadData.targetRole}
                </div>
                <div className="info-item">
                  <strong>Experience Level:</strong> {leadData.experience} years
                </div>
                <div className="info-item">
                  <strong>LinkedIn Profile:</strong> 
                  <a href={leadData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="profile-link">
                    View Profile <FiArrowRight />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="metrics-section">
            <h2>Your LinkedIn Performance Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <FiEye className="metric-icon" />
                <div className="metric-value">{analysisResults.metrics.profileViews}</div>
                <div className="metric-label">Profile Views</div>
                <div className="metric-description">People who viewed your profile this month</div>
              </div>
              
              <div className="metric-card">
                <FiUsers className="metric-icon" />
                <div className="metric-value">{analysisResults.metrics.connectionRequests}</div>
                <div className="metric-label">Connection Requests</div>
                <div className="metric-description">New connection requests received</div>
              </div>
              
              <div className="metric-card">
                <FiMessageCircle className="metric-icon" />
                <div className="metric-value">{analysisResults.metrics.engagementRate}%</div>
                <div className="metric-label">Engagement Rate</div>
                <div className="metric-description">Average engagement on your posts</div>
              </div>
              
              <div className="metric-card">
                <FiTarget className="metric-icon" />
                <div className="metric-value">{analysisResults.metrics.recruiterViews}</div>
                <div className="metric-label">Recruiter Views</div>
                <div className="metric-description">Recruiters who viewed your profile</div>
              </div>
            </div>
          </div>

          {/* Profile Score */}
          <div className="score-section">
            <div className="score-card">
              <div className="score-header">
                <FiAward className="score-icon" />
                <h3>Overall Profile Score</h3>
              </div>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{analysisResults.profileScore}</span>
                  <span className="score-total">/100</span>
                </div>
                <div className="score-description">
                  Based on your {leadData.experience} years of experience targeting {leadData.targetRole} roles
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations-section">
            <h2>Optimization Recommendations</h2>
            <div className="recommendations-grid">
              {analysisResults.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="rec-header">
                    <h4>{rec.category}</h4>
                    <span className={`priority-badge ${rec.priority}`}>{rec.priority}</span>
                  </div>
                  <div className="rec-content">
                    <div className="current-state">
                      <strong>Current:</strong> {rec.current}
                    </div>
                    <div className="suggested-state">
                      <strong>Suggested:</strong> {rec.suggested}
                    </div>
                    <div className="impact">
                      <strong>Impact:</strong> {rec.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SDR Readiness */}
          <div className="readiness-section">
            <h2>SDR Readiness Assessment</h2>
            <div className="readiness-content">
              <div className="readiness-score">
                <div className="score-circle">
                  <span className="score-number">{analysisResults.sdrReadiness.score}</span>
                  <span className="score-total">/100</span>
                </div>
                <div className="score-label">SDR Readiness Score</div>
              </div>
              
              <div className="strengths-gaps">
                <div className="strengths">
                  <h4><FiCheckCircle className="strength-icon" /> Your Strengths</h4>
                  <ul>
                    {analysisResults.sdrReadiness.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="gaps">
                  <h4><FiAlertCircle className="gap-icon" /> Areas to Develop</h4>
                  <ul>
                    {analysisResults.sdrReadiness.gaps.map((gap, index) => (
                      <li key={index}>{gap}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-section">
            <h2>Your Action Plan</h2>
            <div className="steps-list">
              {analysisResults.nextSteps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-content">
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                    <div className="step-details">
                      <div className="step-action">
                        <strong>Action:</strong> {step.action}
                      </div>
                      <div className="step-meta">
                        <span className="time-required">
                          <FiClock /> {step.timeToComplete}
                        </span>
                        <span className={`priority ${step.priority}`}>
                          {step.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="cta-section">
            <div className="cta-card">
              <h3>Ready to Accelerate Your SDR Career?</h3>
              <p>Join thousands of professionals who've transformed their careers with our proven SDR training programs.</p>
              <div className="cta-buttons">
                <button onClick={handleGetStarted} className="btn-primary">
                  Get Started
                </button>
                <button onClick={handleDownloadReport} className="btn-secondary">
                  <FiDownload />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LinkedInAnalysisResults
