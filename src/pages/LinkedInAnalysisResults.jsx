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
import SDRLogo from '../components/SDRLogo'
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
            <div class="metric-value">${Math.round(30 + (data.analysisResults.score_total * 0.5) + Math.random() * 20)}</div>
            <div>Profile Views</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round(8 + (data.analysisResults.score_total * 0.2) + Math.random() * 10)}</div>
            <div>Connection Requests</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round((2 + (data.analysisResults.score_total * 0.03) + Math.random() * 2) * 10) / 10}%</div>
            <div>Engagement Rate</div>
          </div>
          <div class="metric">
            <div class="metric-value">${Math.round(4 + (data.analysisResults.score_total * 0.1) + Math.random() * 5)}</div>
            <div>Recruiter Views</div>
          </div>
        </div>
        
        <h3>SalesLens Profile Score: ${data.analysisResults.score_total}/100</h3>
        <p>Stage: ${data.analysisResults.stage === 'breaking_in' ? 'Breaking into tech sales' : 'Experienced professional'}</p>
        
        <div class="recommendations">
          <h3>Headline Options:</h3>
          ${data.analysisResults.headline_options.map((headline, index) => `
            <div class="recommendation">
              <strong>Option ${index + 1}:</strong> ${headline}
            </div>
          `).join('')}
          
          <h3>About Section Rewrite:</h3>
          <div class="recommendation">
            ${data.analysisResults.about_rewrite}
          </div>
          
          <h3>Priority Checklist:</h3>
          ${data.analysisResults.priority_checklist.map((item, index) => `
            <div class="recommendation">
              <strong>${index + 1}.</strong> ${item}
            </div>
          `).join('')}
          
          <h3>Recruiter Summary Line:</h3>
          <div class="recommendation">
            "${data.analysisResults.recruiter_summary_line}"
          </div>
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
            <SDRLogo size="small" showText={true} />
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

          {/* Profile Score - Most Important First */}
          <div className="score-section">
            <div className="score-card">
              <div className="score-header">
                <FiAward className="score-icon" />
                <h3>SalesLens Profile Analysis</h3>
              </div>
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{analysisResults.score_total}</span>
                  <span className="score-total">/100</span>
                </div>
                <div className="score-description">
                  {analysisResults.score_total >= 90 ? 'Elite' : 
                   analysisResults.score_total >= 80 ? 'Strong' : 
                   analysisResults.score_total >= 70 ? 'Adequate' : 
                   analysisResults.score_total >= 60 ? 'Risky' : 'Blocking Issues'} - 
                  {analysisResults.stage === 'breaking_in' ? 'Breaking into tech sales' : 'Experienced professional'}
                </div>
              </div>
            </div>
          </div>

          {/* Priority Checklist - Action Items First */}
          <div className="priority-section">
            <h2>Priority Action Items</h2>
            <div className="priority-list">
              {analysisResults.priority_checklist.map((item, index) => (
                <div key={index} className="priority-item">
                  <div className="priority-number">{index + 1}</div>
                  <div className="priority-text">{item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Headline Options - Critical for Visibility */}
          <div className="headline-section">
            <h2>Headline Optimization</h2>
            <div className="headline-options">
              {analysisResults.headline_options.map((headline, index) => (
                <div key={index} className="headline-option">
                  <div className="option-number">{index + 1}</div>
                  <div className="option-text">{headline}</div>
                </div>
              ))}
            </div>
          </div>

          {/* About Section Rewrite - Key for Storytelling */}
          <div className="about-section">
            <h2>About Section Rewrite</h2>
            <div className="about-rewrite">
              <div className="rewrite-content">
                <p>{analysisResults.about_rewrite}</p>
              </div>
            </div>
          </div>

          {/* Recruiter Summary Line - For Easy Apply */}
          <div className="recruiter-summary-section">
            <h2>Recruiter Summary Line</h2>
            <div className="summary-content">
              <p className="summary-text">"{analysisResults.recruiter_summary_line}"</p>
              <p className="summary-note">Copy this line for Easy Apply notes and recruiter outreach</p>
            </div>
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

          {/* Detailed Scores */}
          <div className="detailed-scores-section">
            <h2>Detailed Analysis Scores</h2>
            <div className="scores-grid">
              <div className="score-item">
                <div className="score-label">Headline & Top Card</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.headline_topcard}%`}}></div>
                  <span className="score-value">{analysisResults.scores.headline_topcard}/18</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">About Section</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.about}%`}}></div>
                  <span className="score-value">{analysisResults.scores.about}/14</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Experience</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.experience}%`}}></div>
                  <span className="score-value">{analysisResults.scores.experience}/24</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Skills</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.skills}%`}}></div>
                  <span className="score-value">{analysisResults.scores.skills}/10</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Education & Certifications</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.education_certs}%`}}></div>
                  <span className="score-value">{analysisResults.scores.education_certs}/6</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Recommendations</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.recs_endorsements}%`}}></div>
                  <span className="score-value">{analysisResults.scores.recs_endorsements}/6</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Photo & Banner</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.photo_banner}%`}}></div>
                  <span className="score-value">{analysisResults.scores.photo_banner}/4</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Activity & Branding</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.activity_branding}%`}}></div>
                  <span className="score-value">{analysisResults.scores.activity_branding}/8</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Settings Hygiene</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.settings_hygiene}%`}}></div>
                  <span className="score-value">{analysisResults.scores.settings_hygiene}/5</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">ATS & Boolean Alignment</div>
                <div className="score-bar">
                  <div className="score-fill" style={{width: `${analysisResults.scores.ats_boolean_alignment}%`}}></div>
                  <span className="score-value">{analysisResults.scores.ats_boolean_alignment}/5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline Options */}
          <div className="headline-section">
            <h2>Headline Optimization</h2>
            <div className="headline-options">
              {analysisResults.headline_options.map((headline, index) => (
                <div key={index} className="headline-option">
                  <div className="option-number">{index + 1}</div>
                  <div className="option-text">{headline}</div>
                </div>
              ))}
            </div>
          </div>

          {/* About Section Rewrite */}
          <div className="about-section">
            <h2>About Section Rewrite</h2>
            <div className="about-rewrite">
              <div className="rewrite-content">
                <p>{analysisResults.about_rewrite}</p>
              </div>
            </div>
          </div>

          {/* Experience Rewrites */}
          <div className="experience-section">
            <h2>Experience Optimization</h2>
            {analysisResults.experience_rewrites.map((exp, index) => (
              <div key={index} className="experience-rewrite">
                <div className="exp-header">
                  <h4>{exp.normalized_title}</h4>
                  <span className="exp-tools">{exp.tools.join(', ')}</span>
                </div>
                <div className="exp-bullets">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="exp-bullet">
                      <span className="bullet-point">•</span>
                      <span className="bullet-text">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Skills Optimization */}
          <div className="skills-section">
            <h2>Skills Optimization</h2>
            <div className="skills-content">
              <div className="skills-to-add">
                <h4>Add These Skills:</h4>
                <div className="skills-list">
                  {analysisResults.skills.add_now.map((skill, index) => (
                    <span key={index} className="skill-tag add">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="skills-to-pin">
                <h4>Pin These Top 3:</h4>
                <div className="skills-list">
                  {analysisResults.skills.pin_top3.map((skill, index) => (
                    <span key={index} className="skill-tag pin">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Settings & Contact Info */}
          <div className="settings-section">
            <h2>Settings & Contact Optimization</h2>
            <div className="settings-content">
              <div className="setting-item">
                <h4>Location</h4>
                <p><strong>Current:</strong> {analysisResults.settings.location.current}</p>
                <p><strong>Suggested:</strong> {analysisResults.settings.location.suggest}</p>
              </div>
              <div className="setting-item">
                <h4>Industry</h4>
                <p><strong>Current:</strong> {analysisResults.settings.industry.current}</p>
                <p><strong>Suggested:</strong> {analysisResults.settings.industry.suggest}</p>
              </div>
              <div className="setting-item">
                <h4>Open to Work</h4>
                <p><strong>Current:</strong> {analysisResults.settings.open_to_work.status}</p>
                <p><strong>Suggested:</strong> {analysisResults.settings.open_to_work.suggest}</p>
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="education-section">
            <h2>Education & Certifications</h2>
            <div className="education-content">
              <div className="education-item">
                <h4>Graduation Year</h4>
                <p><strong>Present:</strong> {analysisResults.education_certs.grad_year_present ? 'Yes' : 'No'}</p>
                <p>Add graduation year to improve recruiter filtering</p>
              </div>
              <div className="education-item">
                <h4>Recommended Certifications</h4>
                <div className="cert-list">
                  {analysisResults.education_certs.cert_suggestions.map((cert, index) => (
                    <span key={index} className="cert-tag">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity & Branding Plan */}
          <div className="activity-section">
            <h2>Activity & Personal Branding Plan</h2>
            <div className="activity-content">
              <div className="activity-item">
                <h4>Post Ideas (Next 2 Weeks)</h4>
                <ul>
                  {analysisResults.activity_plan.posts.map((post, index) => (
                    <li key={index}>{post}</li>
                  ))}
                </ul>
              </div>
              <div className="activity-item">
                <h4>Comment Strategies</h4>
                <ul>
                  {analysisResults.activity_plan.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                  ))}
                </ul>
              </div>
              <div className="activity-item">
                <h4>Networking Playbook</h4>
                <ul>
                  {analysisResults.activity_plan.networking_playbook.map((strategy, index) => (
                    <li key={index}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Priority Checklist */}
          <div className="priority-section">
            <h2>Priority Checklist</h2>
            <div className="priority-list">
              {analysisResults.priority_checklist.map((item, index) => (
                <div key={index} className="priority-item">
                  <div className="priority-number">{index + 1}</div>
                  <div className="priority-text">{item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Summary Line */}
          <div className="recruiter-summary-section">
            <h2>Recruiter Summary Line</h2>
            <div className="summary-content">
              <p className="summary-text">"{analysisResults.recruiter_summary_line}"</p>
              <p className="summary-note">Copy this line for Easy Apply notes and recruiter outreach</p>
            </div>
          </div>

          {/* Boolean Search Keywords */}
          <div className="keywords-section">
            <h2>Boolean Search & ATS Keywords</h2>
            <div className="keywords-content">
              <div className="keyword-bank">
                <h4>Your Keyword Bank</h4>
                <div className="keyword-categories">
                  <div className="keyword-category">
                    <h5>Roles:</h5>
                    <div className="keyword-tags">
                      {analysisResults.keyword_bank.role.map((keyword, index) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                  <div className="keyword-category">
                    <h5>Functions:</h5>
                    <div className="keyword-tags">
                      {analysisResults.keyword_bank.functions.map((keyword, index) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                  <div className="keyword-category">
                    <h5>Stack:</h5>
                    <div className="keyword-tags">
                      {analysisResults.keyword_bank.stack.map((keyword, index) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                  <div className="keyword-category">
                    <h5>Sectors:</h5>
                    <div className="keyword-tags">
                      {analysisResults.keyword_bank.sector.map((keyword, index) => (
                        <span key={index} className="keyword-tag">{keyword}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="boolean-line">
                <h4>Boolean Search Line</h4>
                <div className="boolean-text">
                  <code>{analysisResults.boolean_line}</code>
                </div>
                <p className="boolean-note">This is the search string recruiters will use to find your optimized profile</p>
              </div>
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
