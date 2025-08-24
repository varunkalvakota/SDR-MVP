import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

import { 
  FiLinkedin, 
  FiTrendingUp, 
  FiTarget, 
  FiCheckCircle, 
  FiAlertCircle,
  FiEye,
  FiMessageCircle,
  FiUsers,
  FiAward,
  FiEdit,
  FiRefreshCw,
  FiExternalLink
} from 'react-icons/fi'
import './LinkedInAnalysis.css'

const LinkedInAnalysis = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)


  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load profile')
    }
  }

  const analyzeLinkedIn = async () => {
    if (!profile?.linkedin_url) {
      setError('No LinkedIn URL found in your profile. Please update your profile in onboarding to add your LinkedIn URL.')
      return
    }

    setIsAnalyzing(true)
    setError('')

    try {
      // Simulate LinkedIn analysis using the URL from their profile
      const mockAnalysis = await simulateLinkedInAnalysis(profile.linkedin_url)
      setAnalysis(mockAnalysis)
      
      // Save analysis to database
      await saveLinkedInAnalysis(mockAnalysis)
    } catch (error) {
      console.error('Error analyzing LinkedIn:', error)
      setError('Failed to analyze LinkedIn profile. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const simulateLinkedInAnalysis = async (linkedinUrl) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock analysis data
    return {
      profileScore: 72,
      optimizationScore: 85,
      recommendations: [
        {
          category: 'Headline',
          current: 'Sales Representative at Company XYZ',
          suggested: 'SDR Pivot | 120% to target | Books first meetings',
          priority: 'high',
          impact: 'High visibility to recruiters'
        },
        {
          category: 'About Section',
          current: 'Experienced sales professional...',
          suggested: 'I\'m pivoting into SDR because I love building relationships and driving results. Recent wins: Increased sales 25% and closed 15 deals/month. In the last 30 days I built a one-pager and booked 3 HM chats. If you\'re hiring SDRs, I\'d value 5 minutes of feedback on my week-one plan.',
          priority: 'high',
          impact: 'Shows SDR readiness and specific wins'
        },
        {
          category: 'Featured Content',
          current: 'No featured content',
          suggested: 'Add 60s Loom video, one-pager, and thank-you recap',
          priority: 'medium',
          impact: 'Demonstrates skills and preparation'
        },
        {
          category: 'Experience Bullets',
          current: 'Responsible for sales activities',
          suggested: 'Increased upsells 18% by asking one question at minute one',
          priority: 'medium',
          impact: 'Quantified achievements stand out'
        }
      ],
      metrics: {
        profileViews: 45,
        connectionRequests: 12,
        engagementRate: 3.2,
        recruiterViews: 8
      },
      sdrReadiness: {
        score: 78,
        strengths: ['Communication skills', 'Sales experience', 'Relationship building'],
        gaps: ['SDR-specific terminology', 'Tech industry knowledge', 'Outreach experience']
      },
      nextSteps: [
        'Update headline with SDR pivot language',
        'Rewrite about section with specific wins',
        'Create and pin 60-second Loom video',
        'Add SDR-relevant skills to profile',
        'Start posting SDR-focused content'
      ]
    }
  }

  const saveLinkedInAnalysis = async (analysisData) => {
    try {
      const { error } = await supabase
        .from('ai_analysis_results')
        .insert({
          user_id: user.id,
          analysis_type: 'linkedinAnalysis',
          analysis_title: 'LinkedIn Profile Optimization for SDR Roles',
          analysis_content: JSON.stringify(analysisData),
          metadata: {
            profileScore: analysisData.profileScore,
            optimizationScore: analysisData.optimizationScore,
            linkedinUrl: profile.linkedin_url
          },
          tags: ['linkedin', 'optimization', 'sdr-readiness']
        })

      if (error) throw error
    } catch (error) {
      console.error('Error saving LinkedIn analysis:', error)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  if (!profile) {
    return (
      <div className="linkedin-analysis-container">
        <div className="loading-state">
          <FiRefreshCw className="loading-icon" />
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="linkedin-analysis-container">
      <div className="analysis-header">
        <div className="header-content">
          <div className="header-icon">
            <FiLinkedin />
          </div>
          <div className="header-text">
            <h2>LinkedIn Profile Analysis</h2>
            <p>Optimize your LinkedIn profile for SDR roles with AI-powered insights</p>
          </div>
        </div>
        
        {profile.linkedin_url && (
          <div className="linkedin-url-display">
            <FiExternalLink />
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
              View Profile
            </a>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {!profile.linkedin_url ? (
        <div className="no-linkedin-state">
          <FiLinkedin className="no-linkedin-icon" />
          <h3>No LinkedIn Profile Found</h3>
          <p>We couldn't find a LinkedIn URL in your profile. Please update your profile in onboarding to add your LinkedIn URL.</p>
          <button 
            className="primary-button"
            onClick={() => window.location.href = '/onboarding'}
          >
            Update Profile
          </button>
        </div>
      ) : !analysis ? (
        <div className="analysis-cta">
          <div className="cta-content">
                         <FiEye className="cta-icon" />
             <h3>Ready to Analyze Your LinkedIn Profile?</h3>
             <p>We'll analyze your LinkedIn profile at <strong>{profile.linkedin_url}</strong> to provide personalized recommendations for SDR roles.</p>
            <button 
              className="analyze-button"
              onClick={analyzeLinkedIn}
              disabled={isAnalyzing}
            >
                             {isAnalyzing ? (
                 <>
                   <FiRefreshCw className="spinning" />
                   Analyzing...
                 </>
               ) : (
                 <>
                   <FiTrendingUp />
                   Analyze My Profile
                 </>
               )}
            </button>
          </div>
        </div>
      ) : (
        <div className="analysis-results">
          

          {/* Score Overview */}
          <div className="score-overview">
            <div className="score-card">
              <div className="score-header">
                <FiTarget />
                <h3>Profile Score</h3>
              </div>
              <div className="score-value" style={{ color: getScoreColor(analysis.profileScore) }}>
                {analysis.profileScore}/100
              </div>
              <p>Current LinkedIn effectiveness</p>
            </div>
            
            <div className="score-card">
              <div className="score-header">
                <FiTrendingUp />
                <h3>Optimization Potential</h3>
              </div>
              <div className="score-value" style={{ color: getScoreColor(analysis.optimizationScore) }}>
                {analysis.optimizationScore}/100
              </div>
              <p>Improvement opportunity</p>
            </div>
            
            <div className="score-card">
              <div className="score-header">
                <FiAward />
                <h3>SDR Readiness</h3>
              </div>
              <div className="score-value" style={{ color: getScoreColor(analysis.sdrReadiness.score) }}>
                {analysis.sdrReadiness.score}/100
              </div>
              <p>Fit for SDR roles</p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations-section">
            <h3>Optimization Recommendations</h3>
            <div className="recommendations-grid">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="rec-header">
                    <h4>{rec.category}</h4>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  
                  <div className="rec-content">
                    <div className="rec-current">
                      <strong>Current:</strong>
                      <p>{rec.current}</p>
                    </div>
                    
                    <div className="rec-suggested">
                      <strong>Suggested:</strong>
                      <p>{rec.suggested}</p>
                    </div>
                    
                    <div className="rec-impact">
                      <strong>Impact:</strong>
                      <p>{rec.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="metrics-section">
            <h3>Profile Metrics</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <FiEye />
                <div className="metric-value">{analysis.metrics.profileViews}</div>
                <div className="metric-label">Profile Views</div>
              </div>
              
              <div className="metric-card">
                <FiUsers />
                <div className="metric-value">{analysis.metrics.connectionRequests}</div>
                <div className="metric-label">Connection Requests</div>
              </div>
              
              <div className="metric-card">
                <FiMessageCircle />
                <div className="metric-value">{analysis.metrics.engagementRate}%</div>
                <div className="metric-label">Engagement Rate</div>
              </div>
              
              <div className="metric-card">
                <FiTarget />
                <div className="metric-value">{analysis.metrics.recruiterViews}</div>
                <div className="metric-label">Recruiter Views</div>
              </div>
            </div>
          </div>

          {/* SDR Readiness */}
          <div className="readiness-section">
            <h3>SDR Role Readiness</h3>
            <div className="readiness-content">
              <div className="strengths">
                <h4>Your Strengths</h4>
                <ul>
                  {analysis.sdrReadiness.strengths.map((strength, index) => (
                    <li key={index}>
                      <FiCheckCircle />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="gaps">
                <h4>Areas to Develop</h4>
                <ul>
                  {analysis.sdrReadiness.gaps.map((gap, index) => (
                    <li key={index}>
                      <FiAlertCircle />
                      {gap}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="next-steps-section">
            <h3>Recommended Next Steps</h3>
            <div className="steps-list">
              {analysis.nextSteps.map((step, index) => (
                <div key={index} className="step-item">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-text">{step}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="secondary-button"
              onClick={analyzeLinkedIn}
              disabled={isAnalyzing}
            >
              <FiRefreshCw />
              Re-analyze
            </button>
            
            <button 
              className="primary-button"
              onClick={() => window.open(profile.linkedin_url, '_blank')}
            >
              <FiEdit />
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LinkedInAnalysis
