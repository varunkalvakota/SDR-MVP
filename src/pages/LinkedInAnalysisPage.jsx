import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { aiService } from '../lib/aiService'
import { 
  FiLinkedin,
  FiCpu,
  FiCheckCircle,
  FiShield,
  FiArrowLeft
} from 'react-icons/fi'
import './LinkedInAnalysisPage.css'

const LinkedInAnalysisPage = () => {
  const navigate = useNavigate()
  const [linkedinFormData, setLinkedinFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedinUrl: '',
    targetRole: '',
    experience: ''
  })
  const [isLinkedinFormSubmitting, setIsLinkedinFormSubmitting] = useState(false)
  const [linkedinFormMessage, setLinkedinFormMessage] = useState('')

  const handleLinkedInAnalysisSubmit = async (e) => {
    e.preventDefault()
    setIsLinkedinFormSubmitting(true)
    setLinkedinFormMessage('')

    try {
      // Generate real LinkedIn analysis using AI
      const analysisResults = await performRealLinkedInAnalysis(linkedinFormData)
      
      // Save lead data to database
      const { error } = await supabase
        .from('linkedin_leads')
        .insert({
          first_name: linkedinFormData.firstName,
          last_name: linkedinFormData.lastName,
          email: linkedinFormData.email,
          linkedin_url: linkedinFormData.linkedinUrl,
          target_role: linkedinFormData.targetRole,
          experience_level: linkedinFormData.experience,
          created_at: new Date().toISOString(),
          status: 'analysis_completed',
          analysis_completed_at: new Date().toISOString(),
          analysis_results: JSON.stringify(analysisResults)
        })

      if (error) throw error

      // Store analysis results in session storage for the results page
      sessionStorage.setItem('linkedinAnalysisResults', JSON.stringify({
        leadData: linkedinFormData,
        analysisResults: analysisResults,
        leadId: 'temp-id' // We don't have the actual ID since we're not selecting
      }))

      // Redirect to results page
      navigate('/linkedin-analysis-results')

    } catch (error) {
      console.error('Error saving LinkedIn lead:', error)
      console.error('Error details:', error.message)
      console.error('Form data:', linkedinFormData)
      setLinkedinFormMessage(`Error: ${error.message}. Please check the console for details.`)
    } finally {
      setIsLinkedinFormSubmitting(false)
    }
  }

  // Perform real LinkedIn analysis using AI service
  const performRealLinkedInAnalysis = async (leadData) => {
    try {
      // Create profile data object for AI analysis
      const profileData = {
        current_position: leadData.targetRole || 'Professional',
        experience_years: leadData.experience || 'Not specified',
        career_goal: `Transitioning to ${leadData.targetRole} role`,
        skills: [], // We don't have skills from the form, but AI will provide suggestions
        linkedin_url: leadData.linkedinUrl
      }

      // Use the AI service to analyze the LinkedIn profile
      const aiResponse = await aiService.analyzeLinkedInProfile(profileData)
      
      // Parse the AI response
      let analysisData
      try {
        // Try to parse as JSON first
        analysisData = JSON.parse(aiResponse)
      } catch (parseError) {
        // If JSON parsing fails, create a structured response from the text
        analysisData = createStructuredAnalysisFromText(aiResponse, leadData)
      }

      return analysisData
    } catch (error) {
      console.error('AI analysis failed:', error)
      // Fallback to enhanced mock data based on profile
      return generateMockLinkedInAnalysis(leadData)
    }
  }

  // Create structured analysis from AI text response
  const createStructuredAnalysisFromText = (aiText, leadData) => {
    // Extract key information from AI text response
    const profileScore = extractScore(aiText, 'profile|score') || 75
    const optimizationScore = extractScore(aiText, 'optimization') || 80
    const sdrScore = extractScore(aiText, 'SDR|readiness') || 70

    return {
      score_total: profileScore,
      scores: {
        headline_topcard: Math.round(profileScore * 0.18),
        about: Math.round(profileScore * 0.14),
        experience: Math.round(profileScore * 0.24),
        skills: Math.round(profileScore * 0.10),
        education_certs: Math.round(profileScore * 0.06),
        recs_endorsements: Math.round(profileScore * 0.06),
        photo_banner: Math.round(profileScore * 0.04),
        activity_branding: Math.round(profileScore * 0.08),
        settings_hygiene: Math.round(profileScore * 0.05),
        ats_boolean_alignment: Math.round(profileScore * 0.05)
      },
      stage: leadData.experience === '0-1' ? 'breaking_in' : 'experienced',
      headline_options: extractHeadlineOptions(aiText) || [
        `${leadData.targetRole} | B2B SaaS & AI | Pipeline Generation, Cold Calling, Salesforce`,
        `Sales Development Representative | Outbound Prospecting | Meetings Booked 120%+`,
        `BDR | Tech Sales | ZoomInfo, Sales Navigator, Outreach | Building Qualified Pipeline`
      ],
      about_rewrite: extractAboutRewrite(aiText) || `Tech sales professional focused on building qualified pipeline for SaaS and AI teams. I run targeted outbound across phone, email, and LinkedIn, align to ICP pains, and book high-quality meetings. Recent impact includes [quota attainment %], [meetings booked per month], and [$ pipeline generated], using Salesforce, ZoomInfo, and Outreach. I learn fast, iterate cadences, and test messaging to raise reply and connect rates. Looking to help a North America team hit revenue goals by owning top-of-funnel and partnering tightly with AEs. Open to connect with SDR leaders and recruiters.`,
      experience_rewrites: [
        {
          role_input_title: leadData.targetRole || 'Current Role',
          normalized_title: leadData.targetRole,
          bullets: [
            `Generated [X] qualified meetings per month against a target of [Y], finishing at [Z]% to quota`,
            `Drove [$] in sourced pipeline across [SMB/MM/ENT] accounts in [sector]`,
            `Executed [50 to 80] cold calls daily with [connect rate %], converting [conversation to meeting %]`,
            `Built account lists with ZoomInfo and Sales Navigator, raising reply rates to [rate %] via personalization`,
            `Logged all activities in Salesforce and maintained [100%] next-step hygiene`
          ],
          tools: ['Salesforce', 'Outreach', 'ZoomInfo', 'LinkedIn Sales Navigator'],
          sales_reframing_used: true
        }
      ],
      skills: {
        add_now: ['Prospecting', 'Salesforce', 'LinkedIn Sales Navigator', 'Outbound', 'Cold Calling', 'Pipeline Generation'],
        pin_top3: ['Prospecting', 'Salesforce', 'LinkedIn Sales Navigator'],
        ordering_shortlist: ['Prospecting', 'Salesforce', 'LinkedIn Sales Navigator', 'Outbound Sales', 'Cold Calling', 'Pipeline Generation', 'Lead Generation', 'B2B Sales']
      },
      settings: {
        location: { current: 'Not specified', suggest: 'City, State/Province, Country' },
        industry: { current: 'Not specified', suggest: 'Software Development' },
        open_to_work: { status: 'off', suggest: 'on_recruiters_only' },
        contact_info: { has_email: false, custom_url: { has: false, suggest: 'linkedin.com/in/firstname-lastname' } }
      },
      education_certs: {
        grad_year_present: false,
        cert_suggestions: ['HubSpot Inbound Sales', 'Salesforce Trailhead (Admin Basics)', 'LinkedIn Sales Navigator Fundamentals', 'ZoomInfo Certification']
      },
      recs_plan: {
        targets: ['current_manager', 'AE_partner', 'mentor'],
        talk_tracks: ['quota_attainment', 'prospecting_grit', 'coachability']
      },
      photo_banner: {
        photo_verdict: 'ok',
        banner_theme: ['tech sales theme', 'subtle brand graphic']
      },
      activity_plan: {
        posts: [
          'Share insights about SDR best practices and prospecting techniques',
          'Post about your journey transitioning into tech sales',
          'Engage with industry leaders and share thoughtful comments'
        ],
        comments: [
          'Comment on SDR manager posts with valuable insights',
          'Engage with sales tool company posts',
          'Respond to job postings with relevant experience'
        ],
        networking_playbook: [
          'Connect with SDR Managers at target companies with a 2-line note',
          'Engage on their posts before requesting coffee chat',
          'Reply to recruiter InMails within 24 hours'
        ]
      },
      priority_checklist: extractPriorityChecklist(aiText) || [
        'Update headline with SDR keywords and value proposition',
        'Rewrite About section with metrics and tools',
        'Add missing SDR skills to profile',
        'Set Open to Work for recruiters only',
        'Update location to be more specific'
      ],
      recruiter_summary_line: extractRecruiterSummary(aiText) || `${leadData.targetRole} with ${leadData.experience} years experience, focused on building qualified pipeline for SaaS and AI teams using Salesforce, Outreach, and LinkedIn Sales Navigator.`,
      keyword_bank: {
        role: ['SDR', 'BDR'],
        functions: ['Outbound Prospecting', 'Cold Calling', 'Pipeline Generation', 'Meetings Booked', 'SQLs', 'SAOs', 'Quota Attainment'],
        stack: ['Salesforce', 'Outreach', 'Salesloft', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Gong'],
        sector: ['SaaS', 'AI', 'Cloud', 'Cybersecurity', 'Fintech'],
        geo: ['United States', 'Canada']
      },
      boolean_line: '(title:SDR OR title:BDR OR "Sales Development Representative" OR "Business Development Representative") AND (SaaS OR AI OR Cloud OR Cybersecurity OR Fintech) AND (Salesforce OR Outreach OR Salesloft OR ZoomInfo OR "Sales Navigator") AND (prospecting OR "pipeline generation" OR "cold calling") AND (United States OR Canada)'
    }
  }

  // Helper functions to extract data from AI text response
  const extractScore = (text, keyword) => {
    const regex = new RegExp(`${keyword}[^0-9]*([0-9]{1,3})`, 'i')
    const match = text.match(regex)
    return match ? parseInt(match[1]) : null
  }

  // General text cleaning function
  const cleanText = (text) => {
    if (!text) return ''
    
    return text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold formatting
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic formatting
      .replace(/^["']|["']$/g, '') // Remove surrounding quotes
      .replace(/^["']|["']$/g, '') // Remove quotes again
      .replace(/^\s*["']|["']\s*$/g, '') // Remove quotes with whitespace
      .replace(/^["']|["']$/g, '') // Remove quotes again
      .replace(/^-\s*/, '') // Remove bullet points
      .replace(/^\d+\.\s*/, '') // Remove numbering
      .replace(/^Diagnosis[^:]*:\s*/i, '') // Remove diagnosis text
      .replace(/^Rewrite[^:]*:\s*/i, '') // Remove rewrite label
      .replace(/^Option\s*\d+[^:]*:\s*/i, '') // Remove option labels
      .trim()
  }

  const extractHeadlineOptions = (text) => {
    const headlines = []
    
    // Try multiple patterns to find headlines
    const patterns = [
      /headline[^:]*:([^\n]+)/gi,
      /option\s*\d+[^:]*:([^\n]+)/gi,
      /rewrite[^:]*:([^\n]+)/gi
    ]
    
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(text)) !== null && headlines.length < 3) {
        let headline = cleanText(match[1])
        
        // Only add if it's a meaningful headline (not just markdown artifacts)
        if (headline.length > 10 && !headline.match(/^[\*\-\d\s,"']+$/)) {
          headlines.push(headline)
        }
      }
    }
    
    return headlines.length > 0 ? headlines : null
  }

  const extractAboutRewrite = (text) => {
    // Look for rewrite section specifically
    const rewriteRegex = /rewrite[^:]*:([^]+?)(?=\n\n|\n[A-Z]|$)/i
    let match = text.match(rewriteRegex)
    
    if (!match) {
      // Fallback to general about section
      const aboutRegex = /about[^:]*:([^]+?)(?=\n\n|\n[A-Z]|$)/i
      match = text.match(aboutRegex)
    }
    
    if (match) {
      let content = match[1].trim()
      
      // Extract just the rewrite content if it contains diagnosis
      if (content.includes('Rewrite:')) {
        const rewriteMatch = content.match(/Rewrite[^:]*:\s*["']?([^"']+)["']?/i)
        if (rewriteMatch) {
          content = rewriteMatch[1].trim()
        }
      }
      
      content = cleanText(content)
      
      // Only return if it's meaningful content
      if (content.length > 20 && !content.match(/^[\*\-\d\s,"']+$/)) {
        return content
      }
    }
    return null
  }

  const extractPriorityChecklist = (text) => {
    const checklist = []
    const checklistRegex = /priority[^:]*:([^]+?)(?=\n\n|\n[A-Z]|$)/i
    const match = text.match(checklistRegex)
    if (match) {
      const items = match[1]
        .split('\n')
        .map(item => cleanText(item))
        .filter(item => item.length > 0 && !item.match(/^[\*\-\d\s,"']+$/)) // Filter out markdown artifacts
      return items.slice(0, 5) // Limit to 5 items
    }
    return null
  }

  const extractRecruiterSummary = (text) => {
    const summaryRegex = /recruiter[^:]*summary[^:]*:([^\n]+)/i
    const match = text.match(summaryRegex)
    if (match) {
      let summary = cleanText(match[1])
      
      // Only return if it's meaningful content (not just markdown artifacts)
      if (summary.length > 10 && !summary.match(/^[\*\-\d\s,"']+$/)) {
        return summary
      }
    }
    return null
  }

  // Generate mock LinkedIn analysis using SalesLens format (fallback)
  const generateMockLinkedInAnalysis = (leadData) => {
    const baseScore = 70
    const experienceBonus = leadData.experience === '4-5' ? 15 : 
                           leadData.experience === '6+' ? 20 : 
                           leadData.experience === '2-3' ? 10 : 5
    
    const totalScore = Math.min(100, baseScore + experienceBonus)
    
    return {
      score_total: totalScore,
      scores: {
        headline_topcard: Math.round(totalScore * 0.18),
        about: Math.round(totalScore * 0.14),
        experience: Math.round(totalScore * 0.24),
        skills: Math.round(totalScore * 0.10),
        education_certs: Math.round(totalScore * 0.06),
        recs_endorsements: Math.round(totalScore * 0.06),
        photo_banner: Math.round(totalScore * 0.04),
        activity_branding: Math.round(totalScore * 0.08),
        settings_hygiene: Math.round(totalScore * 0.05),
        ats_boolean_alignment: Math.round(totalScore * 0.05)
      },
      stage: leadData.experience === '0-1' ? 'breaking_in' : 'experienced',
      headline_options: [
        `${leadData.targetRole} | B2B SaaS & AI | Pipeline Generation, Cold Calling, Salesforce`,
        `Sales Development Representative | Outbound Prospecting | Meetings Booked 120%+`,
        `BDR | Tech Sales | ZoomInfo, Sales Navigator, Outreach | Building Qualified Pipeline`
      ],
      about_rewrite: `Tech sales professional focused on building qualified pipeline for SaaS and AI teams. I run targeted outbound across phone, email, and LinkedIn, align to ICP pains, and book high-quality meetings. Recent impact includes [quota attainment %], [meetings booked per month], and [$ pipeline generated], using Salesforce, ZoomInfo, and Outreach. I learn fast, iterate cadences, and test messaging to raise reply and connect rates. Looking to help a North America team hit revenue goals by owning top-of-funnel and partnering tightly with AEs. Open to connect with SDR leaders and recruiters.`,
      experience_rewrites: [
        {
          role_input_title: leadData.current_position || 'Current Role',
          normalized_title: leadData.targetRole,
          bullets: [
            `Generated [X] qualified meetings per month against a target of [Y], finishing at [Z]% to quota`,
            `Drove [$] in sourced pipeline across [SMB/MM/ENT] accounts in [sector]`,
            `Executed [50 to 80] cold calls daily with [connect rate %], converting [conversation to meeting %]`,
            `Built account lists with ZoomInfo and Sales Navigator, raising reply rates to [rate %] via personalization`,
            `Logged all activities in Salesforce and maintained [100%] next-step hygiene`
          ],
          tools: ['Salesforce', 'Outreach', 'ZoomInfo', 'LinkedIn Sales Navigator'],
          sales_reframing_used: true
        }
      ],
      skills: {
        add_now: ['Prospecting', 'Salesforce', 'LinkedIn Sales Navigator', 'Outbound', 'Cold Calling', 'Pipeline Generation'],
        pin_top3: ['Prospecting', 'Salesforce', 'LinkedIn Sales Navigator'],
        ordering_shortlist: ['Prospecting', 'Salesforce', 'LinkedIn Sales Navigator', 'Outbound Sales', 'Cold Calling', 'Pipeline Generation', 'Lead Generation', 'B2B Sales']
      },
      settings: {
        location: { current: 'Not specified', suggest: 'City, State/Province, Country' },
        industry: { current: 'Not specified', suggest: 'Software Development' },
        open_to_work: { status: 'off', suggest: 'on_recruiters_only' },
        contact_info: { has_email: false, custom_url: { has: false, suggest: 'linkedin.com/in/firstname-lastname' } }
      },
      education_certs: {
        grad_year_present: false,
        cert_suggestions: ['HubSpot Inbound Sales', 'Salesforce Trailhead (Admin Basics)', 'LinkedIn Sales Navigator Fundamentals', 'ZoomInfo Certification']
      },
      recs_plan: {
        targets: ['current_manager', 'AE_partner', 'mentor'],
        talk_tracks: ['quota_attainment', 'prospecting_grit', 'coachability']
      },
      photo_banner: {
        photo_verdict: 'ok',
        banner_theme: ['tech sales theme', 'subtle brand graphic']
      },
      activity_plan: {
        posts: [
          'Share insights about SDR best practices and prospecting techniques',
          'Post about your journey transitioning into tech sales',
          'Engage with industry leaders and share thoughtful comments'
        ],
        comments: [
          'Comment on SDR manager posts with valuable insights',
          'Engage with sales tool company posts',
          'Respond to job postings with relevant experience'
        ],
        networking_playbook: [
          'Connect with SDR Managers at target companies with a 2-line note',
          'Engage on their posts before requesting coffee chat',
          'Reply to recruiter InMails within 24 hours'
        ]
      },
      priority_checklist: [
        'Update headline with SDR keywords and value proposition',
        'Rewrite About section with metrics and tools',
        'Add missing SDR skills to profile',
        'Set Open to Work for recruiters only',
        'Update location to be more specific'
      ],
      recruiter_summary_line: `${leadData.targetRole} with ${leadData.experience} years experience, focused on building qualified pipeline for SaaS and AI teams using Salesforce, Outreach, and LinkedIn Sales Navigator.`,
      keyword_bank: {
        role: ['SDR', 'BDR'],
        functions: ['Outbound Prospecting', 'Cold Calling', 'Pipeline Generation', 'Meetings Booked', 'SQLs', 'SAOs', 'Quota Attainment'],
        stack: ['Salesforce', 'Outreach', 'Salesloft', 'ZoomInfo', 'LinkedIn Sales Navigator', 'Gong'],
        sector: ['SaaS', 'AI', 'Cloud', 'Cybersecurity', 'Fintech'],
        geo: ['United States', 'Canada']
      },
      boolean_line: '(title:SDR OR title:BDR OR "Sales Development Representative" OR "Business Development Representative") AND (SaaS OR AI OR Cloud OR Cybersecurity OR Fintech) AND (Salesforce OR Outreach OR Salesloft OR ZoomInfo OR "Sales Navigator") AND (prospecting OR "pipeline generation" OR "cold calling") AND (United States OR Canada)'
    }
  }

  const handleLinkedinFormChange = (e) => {
    const { name, value } = e.target
    setLinkedinFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="linkedin-analysis-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <button onClick={() => navigate('/')} className="back-button">
            <FiArrowLeft />
            Back to Home
          </button>
        </div>
      </nav>

      <main className="main-content">
        {/* LinkedIn Analysis Section */}
        <section className="linkedin-analysis-section">
          <div className="linkedin-analysis-container">
            <div className="section-header">
              <h1 className="section-title">Get Your Free LinkedIn Analysis</h1>
              <p className="section-subtitle">Discover how to optimize your LinkedIn profile for SDR roles in just 2 minutes</p>
            </div>
            <div className="linkedin-analysis-content">
              <div className="analysis-preview">
                <div className="preview-card">
                  <div className="preview-header">
                    <FiLinkedin className="preview-icon" />
                    <h3>LinkedIn Profile Analysis</h3>
                  </div>
                  <div className="preview-metrics">
                    <div className="preview-metric">
                      <span className="metric-value">87</span>
                      <span className="metric-label">Profile Views</span>
                    </div>
                    <div className="preview-metric">
                      <span className="metric-value">23</span>
                      <span className="metric-label">Connection Requests</span>
                    </div>
                    <div className="preview-metric">
                      <span className="metric-value">4.2%</span>
                      <span className="metric-label">Engagement Rate</span>
                    </div>
                    <div className="preview-metric">
                      <span className="metric-value">12</span>
                      <span className="metric-label">Recruiter Views</span>
                    </div>
                  </div>
                  <div className="preview-features">
                    <div className="feature-item">
                      <FiCheckCircle />
                      <span>Profile optimization score</span>
                    </div>
                    <div className="feature-item">
                      <FiCheckCircle />
                      <span>SDR readiness assessment</span>
                    </div>
                    <div className="feature-item">
                      <FiCheckCircle />
                      <span>Personalized recommendations</span>
                    </div>
                    <div className="feature-item">
                      <FiCheckCircle />
                      <span>Industry-specific insights</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="analysis-form">
                <div className="form-header">
                  <h3>Get Your Free Analysis</h3>
                  <p>Enter your details below and we'll send you a personalized LinkedIn optimization report</p>
                </div>
                
                <form className="linkedin-form" onSubmit={handleLinkedInAnalysisSubmit}>
                  {linkedinFormMessage && (
                    <div className={`form-message ${linkedinFormMessage.includes('Thank you') ? 'success' : 'error'}`}>
                      {linkedinFormMessage}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={linkedinFormData.firstName}
                      onChange={handleLinkedinFormChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={linkedinFormData.lastName}
                      onChange={handleLinkedinFormChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={linkedinFormData.email}
                      onChange={handleLinkedinFormChange}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="linkedinUrl">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={linkedinFormData.linkedinUrl}
                      onChange={handleLinkedinFormChange}
                      required
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="targetRole">Target Role</label>
                    <select 
                      id="targetRole" 
                      name="targetRole" 
                      value={linkedinFormData.targetRole}
                      onChange={handleLinkedinFormChange}
                      required
                    >
                      <option value="">Select your target role</option>
                      <option value="SDR">Sales Development Representative (SDR)</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="experience">Years of Experience</label>
                    <select 
                      id="experience" 
                      name="experience" 
                      value={linkedinFormData.experience}
                      onChange={handleLinkedinFormChange}
                      required
                    >
                      <option value="">Select your experience level</option>
                      <option value="0-1">0-1 years</option>
                      <option value="2-3">2-3 years</option>
                      <option value="4-5">4-5 years</option>
                      <option value="6+">6+ years</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="analysis-submit-btn"
                    disabled={isLinkedinFormSubmitting}
                  >
                    <FiCpu className="btn-icon" />
                    {isLinkedinFormSubmitting ? 'Analyzing...' : 'Get My Free LinkedIn Analysis'}
                  </button>
                  
                  <p className="form-disclaimer">
                    <FiShield className="disclaimer-icon" />
                    We'll analyze your profile and deliver your detailed report in 2 minutes. No spam, ever.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LinkedInAnalysisPage
