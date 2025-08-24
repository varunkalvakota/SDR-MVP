import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  FiUpload, 
  FiCpu, 
  FiMap, 
  FiArrowRight, 
  FiArrowLeft,
  FiFileText,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiCalendar,
  FiBriefcase,
  FiLoader,
  FiArrowLeft as FiBack
} from 'react-icons/fi'
import './OnboardingPage.css'

const OnboardingPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isContinuing, setIsContinuing] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    email: '',
    currentRole: '',
    experienceYears: '',
    resume: null,
    linkedinUrl: '',
    
    // Step 2: Goals & Preferences
    careerGoal: '',
    timeline: '',
    preferredIndustry: '',
    salaryExpectation: '',
    workStyle: '',
    
    // Step 3: Additional Info
    skills: [],
    challenges: '',
    motivation: '',
    availability: ''
  })

  // Force re-render when form data changes
  const [formKey, setFormKey] = useState(0)

  const totalSteps = 3

  useEffect(() => {
    if (user) {
      loadExistingProfile()
    }
  }, [user])

  // Direct pre-fill when user metadata is available
  useEffect(() => {
    if (user && user.user_metadata && (user.user_metadata.first_name || user.user_metadata.last_name)) {
      setFormData(prev => ({
        ...prev,
        firstName: user.user_metadata.first_name || '',
        lastName: user.user_metadata.last_name || '',
        email: user.email || ''
      }))
      
      setFormKey(prev => prev + 1)
      setIsNewUser(true)
    }
  }, [user])



  const loadExistingProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data && !error) {
        // Pre-fill form with existing data
                 setFormData({
           firstName: data.first_name || '',
           lastName: data.last_name || '',
           email: data.email || '',
           currentRole: data.current_position || '',
           experienceYears: data.experience_years || '',
           resume: null, // File object can't be restored from URL
           linkedinUrl: data.linkedin_url || '',
           careerGoal: data.career_goal || '',
           timeline: data.timeline || '',
           preferredIndustry: data.preferred_industry || '',
           salaryExpectation: data.salary_expectation || '',
           workStyle: data.work_style || '',
           skills: data.skills || [],
           challenges: data.challenges || '',
           motivation: data.motivation || '',
           availability: data.availability || ''
         })
        
        // Check if user has some data but hasn't completed onboarding
        if (data.first_name && data.last_name && data.email && !data.onboarding_completed) {
          setIsContinuing(true)
        }
      }
    } catch (error) {
      // User doesn't have a profile yet, pre-fill with auth data
      setIsNewUser(true)
      
      // Pre-fill form with data from user metadata if available
      if (user.user_metadata && (user.user_metadata.first_name || user.user_metadata.last_name)) {
                 const newFormData = {
           firstName: user.user_metadata.first_name || '',
           lastName: user.user_metadata.last_name || '',
           email: user.email || '',
           currentRole: '',
           experienceYears: '',
           resume: null,
           linkedinUrl: '',
           careerGoal: '',
           timeline: '',
           preferredIndustry: '',
           salaryExpectation: '',
           workStyle: '',
           skills: [],
           challenges: '',
           motivation: '',
           availability: ''
         }
        setFormData(newFormData)
      } else {
        // Set email at least
                 const defaultFormData = {
           firstName: '',
           lastName: '',
           email: user.email || '',
           currentRole: '',
           experienceYears: '',
           resume: null,
           linkedinUrl: '',
           careerGoal: '',
           timeline: '',
           preferredIndustry: '',
           salaryExpectation: '',
           workStyle: '',
           skills: [],
           challenges: '',
           motivation: '',
           availability: ''
         }
        setFormData(defaultFormData)
      }
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        resume: file
      }))
    }
  }

  const uploadResume = async (file) => {
    if (!file || !user) return null
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file)
    
    if (error) {
      return null
    }
    
    // For private buckets, we need to use a signed URL or just return the file path
    // The actual URL will be generated when needed for viewing
    return fileName
  }

  const saveToSupabase = async () => {
    try {
      setIsSubmitting(true)
      setError('')
      

      
      // Upload resume if provided
      let resumeUrl = null
      if (formData.resume) {
        resumeUrl = await uploadResume(formData.resume)
      }
      
                    // Prepare data for database
                 const profileData = {
           id: user.id,
           email: formData.email,
           first_name: formData.firstName,
           last_name: formData.lastName,
           current_position: formData.currentRole,
           experience_years: formData.experienceYears,
           resume_url: resumeUrl,
           linkedin_url: formData.linkedinUrl,
           career_goal: formData.careerGoal,
           timeline: formData.timeline,
           preferred_industry: formData.preferredIndustry,
           salary_expectation: formData.salaryExpectation,
           work_style: formData.workStyle,
           skills: formData.skills || [],
           challenges: formData.challenges,
           motivation: formData.motivation,
           availability: formData.availability,
           onboarding_completed: true
         }
      
      console.log('Saving profile data:', profileData)
      
      // Skip the check and go straight to upsert since RLS is causing 406 errors
      console.log('Skipping profile check due to RLS issues, going straight to upsert')
      
      // Use upsert with email as conflict key since that's where the duplicate is happening
      const result = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'email' })
      
      const { data, error } = result
      
      console.log('Supabase result:', { data, error })
      
      if (error) {
        console.error('Supabase error:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message}`)
      }
      return true
      
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Failed to save your profile. Please try again.')
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('Please sign in to save your profile.')
      return
    }
    
    console.log('User data:', {
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata
    })
    
    // Add form validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('Please fill in all required fields (First Name, Last Name, Email).')
      return
    }
    
    console.log('Form data before save:', formData)
    
    const success = await saveToSupabase()
    if (success) {
      // Navigate to dashboard after successful save
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    }
  }

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {[1, 2, 3].map(step => (
        <div key={step} className={`step-dot ${step <= currentStep ? 'active' : ''}`}>
          {step < currentStep ? <FiCheckCircle /> : step}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="onboarding-step">
      <div className="step-header">
        <div className="step-icon"><FiUser /></div>
        <h2>Tell Us About You</h2>
        <p>Let's start with some basic information to personalize your experience</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>First Name *</label>
          <div className="input-with-badge">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
              required
            />
            {isNewUser && user?.user_metadata?.first_name && (
              <span className="pre-filled-badge">Pre-filled</span>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label>Last Name *</label>
          <div className="input-with-badge">
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
              required
            />
            {isNewUser && user?.user_metadata?.last_name && (
              <span className="pre-filled-badge">Pre-filled</span>
            )}
          </div>
        </div>
        
                           <div className="form-group">
            <label>Email Address *</label>
            <div className="input-with-badge">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
              {isNewUser && user?.email && (
                <span className="pre-filled-badge">Pre-filled</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>LinkedIn Profile URL</label>
            <input
              type="text"
              value={formData.linkedinUrl}
              onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
            <small>We'll analyze your LinkedIn profile to help optimize it for SDR roles</small>
          </div>
         

         
 

                 <div className="form-group">
          <label>Current Role</label>
          <select
            value={formData.currentRole}
            onChange={(e) => handleInputChange('currentRole', e.target.value)}
          >
            <option value="">Select your current role</option>
            <option value="sdr">SDR (Sales Development Representative)</option>
            <option value="ae">AE (Account Executive)</option>
            <option value="manager">Sales Manager</option>
            <option value="student">Student</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Years of Experience</label>
          <select
            value={formData.experienceYears}
            onChange={(e) => handleInputChange('experienceYears', e.target.value)}
          >
            <option value="">Select experience level</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        
        <div className="form-group full-width">
          <label>Upload Resume (Optional)</label>
          <div className="file-upload">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="file-upload-label">
              <FiUpload />
              <span>{formData.resume ? formData.resume.name : 'Choose file or drag here'}</span>
            </label>
          </div>
          <small>PDF, DOC, or DOCX files accepted</small>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="onboarding-step">
      <div className="step-header">
        <div className="step-icon"><FiTarget /></div>
        <h2>Define Your Goals</h2>
        <p>Help us understand your career aspirations and preferences</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Career Goal *</label>
          <select
            value={formData.careerGoal}
            onChange={(e) => handleInputChange('careerGoal', e.target.value)}
            required
          >
            <option value="">Select your primary goal</option>
            <option value="promotion">Get promoted to AE</option>
            <option value="management">Move into management</option>
            <option value="pivot">Pivot to different role</option>
            <option value="break-in">Break into tech sales</option>
            <option value="salary">Increase salary</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Timeline</label>
          <select
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
          >
            <option value="">Select your timeline</option>
            <option value="3-months">3 months</option>
            <option value="6-months">6 months</option>
            <option value="1-year">1 year</option>
            <option value="2-years">2 years</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Preferred Industry</label>
          <select
            value={formData.preferredIndustry}
            onChange={(e) => handleInputChange('preferredIndustry', e.target.value)}
          >
            <option value="">Select industry</option>
            <option value="saas">SaaS</option>
            <option value="fintech">FinTech</option>
            <option value="healthcare">Healthcare</option>
            <option value="ecommerce">E-commerce</option>
            <option value="enterprise">Enterprise</option>
            <option value="startup">Startup</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Salary Expectation</label>
          <select
            value={formData.salaryExpectation}
            onChange={(e) => handleInputChange('salaryExpectation', e.target.value)}
          >
            <option value="">Select salary range</option>
            <option value="40-60k">$40k - $60k</option>
            <option value="60-80k">$60k - $80k</option>
            <option value="80-100k">$80k - $100k</option>
            <option value="100k+">$100k+</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Work Style</label>
          <select
            value={formData.workStyle}
            onChange={(e) => handleInputChange('workStyle', e.target.value)}
          >
            <option value="">Select work style</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="office">Office</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="onboarding-step">
      <div className="step-header">
        <div className="step-icon"><FiTrendingUp /></div>
        <h2>Final Details</h2>
        <p>Help us create the most personalized roadmap for you</p>
      </div>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Key Skills (Select all that apply)</label>
          <div className="skills-grid">
            {[
              'Cold Calling', 'Email Outreach', 'LinkedIn Sales', 'CRM Management',
              'Lead Qualification', 'Objection Handling', 'Presentation Skills',
              'Negotiation', 'Account Management', 'Team Leadership'
            ].map(skill => (
              <label key={skill} className="skill-checkbox">
                <input
                  type="checkbox"
                  checked={formData.skills.includes(skill)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('skills', [...formData.skills, skill])
                    } else {
                      handleInputChange('skills', formData.skills.filter(s => s !== skill))
                    }
                  }}
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="form-group full-width">
          <label>Biggest Career Challenge</label>
          <textarea
            value={formData.challenges}
            onChange={(e) => handleInputChange('challenges', e.target.value)}
            placeholder="What's your biggest challenge in advancing your career?"
            rows="3"
          />
        </div>
        
        <div className="form-group full-width">
          <label>What motivates you?</label>
          <textarea
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            placeholder="Tell us what drives you in your career..."
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>Weekly Availability</label>
          <select
            value={formData.availability}
            onChange={(e) => handleInputChange('availability', e.target.value)}
          >
            <option value="">Select availability</option>
            <option value="5-hours">5 hours/week</option>
            <option value="10-hours">10 hours/week</option>
            <option value="15-hours">15 hours/week</option>
            <option value="20+hours">20+ hours/week</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      default:
        return renderStep1()
    }
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="header-left">
            <button onClick={() => navigate('/')} className="back-button">
              <FiBack /> Back to Home
            </button>
          </div>
          <div className="header-center">
            <div className="logo-section">
              <span className="logo-icon">S</span>
              <span className="logo-text">SDR Roadmap</span>
            </div>
          </div>
          <div className="header-right">
            {renderStepIndicator()}
          </div>
        </div>
        
        {!user && (
          <div className="auth-notice">
            <p>Please sign in to save your onboarding data and create your personalized roadmap.</p>
            <button onClick={() => navigate('/')} className="auth-button">
              Back to Sign In
            </button>
          </div>
        )}
        
        {isContinuing && (
          <div className="continue-notice">
            <p>Welcome back! We found your previous onboarding progress. You can continue where you left off or update your information.</p>
          </div>
        )}
        
        {!isContinuing && user && isNewUser && (
          <div className="welcome-notice">
            <p>Welcome to SDR Roadmap! We've pre-filled your information from your signup. Let's create your personalized career plan.</p>
          </div>
        )}
        

        

        
                 {error && (
           <div className="error-message">
             <p>{error}</p>
             <button 
               onClick={() => {
                 console.log('Current user:', user)
                 console.log('Current form data:', formData)
               }}
               style={{ marginTop: '10px', padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
             >
               Debug Info (Check Console)
             </button>
           </div>
         )}
        
                 <div className="onboarding-content" key={formKey}>
           {renderCurrentStep()}
         </div>
        
        <div className="onboarding-footer">
          <div className="step-navigation">
            {currentStep > 1 && (
              <button onClick={prevStep} className="nav-button prev-button">
                <FiArrowLeft />
                Previous
              </button>
            )}
            
            <div className="step-progress">
              Step {currentStep} of {totalSteps}
            </div>
            
            {currentStep < totalSteps ? (
              <button 
                onClick={nextStep} 
                className="nav-button next-button"
                disabled={!formData.firstName || !formData.lastName || !formData.email}
              >
                Next
                <FiArrowRight />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                className="nav-button submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="loader-icon" />
                    Saving...
                  </>
                ) : (
                  <>
                    Create My Roadmap
                    <FiArrowRight />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
