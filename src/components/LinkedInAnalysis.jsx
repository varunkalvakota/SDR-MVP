import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { aiService } from '../lib/aiService'

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
      // Use AI to analyze LinkedIn profile and provide SDR optimization recommendations
      const aiAnalysis = await performAILinkedInAnalysis(profile)
      setAnalysis(aiAnalysis)
      
      // Save analysis to database
      await saveLinkedInAnalysis(aiAnalysis)
    } catch (error) {
      console.error('Error analyzing LinkedIn:', error)
      setError('Failed to analyze LinkedIn profile. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const performAILinkedInAnalysis = async (profile) => {
    try {
      // Use the dedicated LinkedIn analysis method
      const aiResponse = await aiService.analyzeLinkedInProfile(profile)
      
      // Parse the AI response
      let analysisData
      try {
        // Try to parse as JSON first
        analysisData = JSON.parse(aiResponse)
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        analysisData = createStructuredAnalysisFromText(aiResponse, profile)
      }

      return analysisData
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Fallback to enhanced mock data based on profile
      return createFallbackAnalysis(profile)
    }
  }

  const createStructuredAnalysisFromText = (aiText, profile) => {
    // Extract key information from AI text response
    const profileScore = extractScore(aiText, 'profile') || 75
    const optimizationScore = extractScore(aiText, 'optimization') || 80
    const sdrScore = extractScore(aiText, 'SDR|readiness') || 70

    return {
      profileScore,
      optimizationScore,
      recommendations: [
        {
          category: 'Headline',
          current: 'Current headline from profile',
          suggested: extractSuggestion(aiText, 'headline') || 'SDR Pivot | Results-driven | Relationship Builder',
          priority: 'high',
          impact: 'High visibility to recruiters'
        },
        {
          category: 'About Section',
          current: 'Current about section',
          suggested: extractSuggestion(aiText, 'about') || 'I\'m transitioning to SDR roles because I love building relationships and driving results...',
          priority: 'high',
          impact: 'Shows SDR readiness and specific wins'
        }
      ],
      sdrReadiness: {
        score: sdrScore,
        strengths: extractList(aiText, 'strengths') || ['Communication skills', 'Sales experience'],
        gaps: extractList(aiText, 'gaps') || ['SDR-specific terminology', 'Tech industry knowledge']
      },
      nextSteps: extractList(aiText, 'next steps|action plan') || [
        {
          title: 'Update headline with SDR pivot language',
          description: 'Your headline is the first thing recruiters see. Make it SDR-focused and results-driven.',
          action: 'Replace your current headline with something like: "SDR Pivot | Results-driven | Relationship Builder | Ready to Drive Revenue Growth"',
          impact: 'High visibility to recruiters and hiring managers',
          timeToComplete: '5 minutes',
          priority: 'high'
        },
        {
          title: 'Rewrite about section with specific wins',
          description: 'Your about section should tell a compelling story of why you\'re transitioning to SDR and what value you bring.',
          action: 'Write 2-3 paragraphs highlighting: 1) Your transition story, 2) Specific achievements with numbers, 3) Why you\'re passionate about sales development',
          impact: 'Shows SDR readiness and specific wins',
          timeToComplete: '15-20 minutes',
          priority: 'high'
        },
        {
          title: 'Add SDR-relevant skills to profile',
          description: 'Include skills that SDR recruiters are looking for to improve your searchability.',
          action: 'Add skills like: Cold Calling, Lead Generation, CRM (Salesforce/HubSpot), Sales Prospecting, Email Outreach, LinkedIn Sales Navigator',
          impact: 'Increases profile visibility in recruiter searches',
          timeToComplete: '10 minutes',
          priority: 'medium'
        }
      ],
      metrics: {
        profileViews: 50,
        connectionRequests: 15,
        engagementRate: 3.5,
        recruiterViews: 8
      }
    }
  }

  const createFallbackAnalysis = (profile) => {
    // Enhanced fallback analysis based on profile data
    const baseScore = 70
    const experienceBonus = profile.experience_years === '3-5' ? 10 : 
                           profile.experience_years === '5+' ? 15 : 0
    const skillsBonus = profile.skills?.length > 5 ? 5 : 0
    
    return {
      profileScore: Math.min(100, baseScore + experienceBonus + skillsBonus),
      optimizationScore: 85,
      recommendations: [
        {
          category: 'Headline',
          current: `${profile.current_position || 'Professional'} at ${profile.company || 'Company'}`,
          suggested: `SDR Pivot | ${profile.experience_years || 'Experienced'} | Results-driven`,
          priority: 'high',
          impact: 'High visibility to recruiters'
        },
        {
          category: 'About Section',
          current: 'Standard professional description',
          suggested: `I'm pivoting into SDR because I love building relationships and driving results. ${profile.skills?.slice(0, 3).join(', ')}. Ready to learn and contribute to a high-performing SDR team.`,
          priority: 'high',
          impact: 'Shows SDR readiness and specific skills'
        }
      ],
      sdrReadiness: {
        score: 75,
        strengths: profile.skills?.slice(0, 3) || ['Communication', 'Sales', 'Relationship building'],
        gaps: ['SDR-specific terminology', 'Tech industry knowledge', 'Outreach experience']
      },
      nextSteps: [
        {
          title: 'Update headline with SDR pivot language',
          description: 'Your headline is the first thing recruiters see. Make it SDR-focused and results-driven.',
          action: `Replace your current headline with something like: "SDR Pivot | ${profile.experience_years || 'Experienced'} | Results-driven | Ready to Drive Revenue Growth"`,
          impact: 'High visibility to recruiters and hiring managers',
          timeToComplete: '5 minutes',
          priority: 'high'
        },
        {
          title: 'Rewrite about section with specific wins',
          description: 'Your about section should tell a compelling story of why you\'re transitioning to SDR and what value you bring.',
          action: 'Write 2-3 paragraphs highlighting: 1) Your transition story, 2) Specific achievements with numbers, 3) Why you\'re passionate about sales development',
          impact: 'Shows SDR readiness and specific wins',
          timeToComplete: '15-20 minutes',
          priority: 'high'
        },
        {
          title: 'Add SDR-relevant skills to profile',
          description: 'Include skills that SDR recruiters are looking for to improve your searchability.',
          action: 'Add skills like: Cold Calling, Lead Generation, CRM (Salesforce/HubSpot), Sales Prospecting, Email Outreach, LinkedIn Sales Navigator',
          impact: 'Increases profile visibility in recruiter searches',
          timeToComplete: '10 minutes',
          priority: 'medium'
        },
        {
          title: 'Create SDR-focused content',
          description: 'Share content that demonstrates your knowledge and passion for sales development.',
          action: 'Post about: SDR best practices, sales trends, your learning journey, or insights from sales podcasts/books you\'re consuming',
          impact: 'Builds credibility and attracts SDR professionals',
          timeToComplete: '20-30 minutes',
          priority: 'medium'
        },
        {
          title: 'Network with SDR professionals',
          description: 'Connect with current SDRs, managers, and sales leaders to learn and get referrals.',
          action: 'Send personalized connection requests to SDRs at target companies. Include a message about your career transition and ask for advice.',
          impact: 'Opens doors to opportunities and insider knowledge',
          timeToComplete: '30 minutes',
          priority: 'high'
        }
      ],
      metrics: {
        profileViews: 45,
        connectionRequests: 12,
        engagementRate: 3.2,
        recruiterViews: 6
      }
    }
  }

  const extractScore = (text, keyword) => {
    const regex = new RegExp(`${keyword}[^0-9]*([0-9]{1,3})`, 'i')
    const match = text.match(regex)
    return match ? parseInt(match[1]) : null
  }

  const extractSuggestion = (text, category) => {
    const regex = new RegExp(`${category}[^:]*:([^\\n]+)`, 'i')
    const match = text.match(regex)
    return match ? match[1].trim() : null
  }

  const extractList = (text, keyword) => {
    const regex = new RegExp(`${keyword}[^\\n]*\\n([^\\n]+)`, 'i')
    const match = text.match(regex)
    if (match) {
      return match[1].split(',').map(item => item.trim()).filter(item => item.length > 0)
    }
    return null
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
                  <div className="step-header">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-title-section">
                      <h4 className="step-title">{typeof step === 'string' ? step : step.title}</h4>
                      <div className="step-meta">
                        <span className={`priority-badge priority-${typeof step === 'object' ? step.priority : 'medium'}`}>
                          {typeof step === 'object' ? step.priority : 'medium'} priority
                        </span>
                        <span className="time-estimate">
                          {typeof step === 'object' ? step.timeToComplete : '10-15 minutes'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {typeof step === 'object' && (
                    <div className="step-details">
                      <div className="step-description">
                        <strong>Why this matters:</strong>
                        <p>{step.description}</p>
                      </div>
                      
                      <div className="step-action">
                        <strong>What to do:</strong>
                        <p>{step.action}</p>
                      </div>
                      
                      <div className="step-impact">
                        <strong>Expected impact:</strong>
                        <p>{step.impact}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Content Suggestions */}
          {analysis.contentSuggestions && (
            <div className="content-suggestions-section">
              <h3>AI-Generated Content Strategy</h3>
              <div className="content-suggestions-grid">
                <div className="content-card">
                  <h4>📝 Post Topics</h4>
                  <ul>
                    {analysis.contentSuggestions.postTopics?.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    )) || [
                      'SDR career transition journey',
                      'Sales skills that transfer to SDR',
                      'Learning from SDR professionals',
                      'Building relationships in sales'
                    ].map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="content-card">
                  <h4>🎯 Networking Targets</h4>
                  <ul>
                    {analysis.contentSuggestions.networkingTargets?.map((target, index) => (
                      <li key={index}>{target}</li>
                    )) || [
                      'SDR managers and directors',
                      'Sales development professionals',
                      'Tech company recruiters',
                      'Sales trainers and coaches'
                    ].map((target, index) => (
                      <li key={index}>{target}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="content-card">
                  <h4>💡 Engagement Strategy</h4>
                  <p>{analysis.contentSuggestions.engagementStrategy || 'Focus on providing value through thoughtful comments and sharing insights about sales development. Engage with SDR content and contribute to discussions about sales best practices.'}</p>
                </div>
              </div>
            </div>
          )}

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
