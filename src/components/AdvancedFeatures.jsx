import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { aiService } from '../lib/aiService'
import BeckyLogo from './BeckyLogo'
import { 
  FiBookOpen, 
  FiBriefcase, 
  FiTrendingUp,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
  FiDownload
} from 'react-icons/fi'
import './AdvancedFeatures.css'

const AdvancedFeatures = () => {
  const { user } = useAuth()
  const [activeFeature, setActiveFeature] = useState('coaching')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [jobDescription, setJobDescription] = useState('')

  const features = [
    {
      key: 'coaching',
      label: 'Personalized Coaching Plan',
      description: 'Get a 30-day customized coaching plan with daily action items',
      icon: <FiBookOpen />
    },
    {
      key: 'jobFit',
      label: 'Job Fit Analysis',
      description: 'Analyze your resume against specific job descriptions',
      icon: <FiBriefcase />
    },
    {
      key: 'marketAnalysis',
      label: 'Market Analysis',
      description: 'Understand your competitive position in the SDR market',
      icon: <FiTrendingUp />
    }
  ]

  const handleCoachingPlan = async () => {
    if (!user || !user.id) {
      setError('Please sign in to generate coaching plan')
      return
    }

    setIsLoading(true)
    setError('')
    setResult('')

    try {
      const coachingPlan = await aiService.generateCoachingPlan(user.id)
      setResult(coachingPlan)
    } catch (err) {
      setError(err.message || 'Failed to generate coaching plan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobFitAnalysis = async () => {
    if (!user || !user.id) {
      setError('Please sign in to analyze job fit')
      return
    }

    if (!jobDescription.trim()) {
      setError('Please enter a job description')
      return
    }

    setIsLoading(true)
    setError('')
    setResult('')

    try {
      const fitAnalysis = await aiService.analyzeJobFit(user.id, jobDescription)
      setResult(fitAnalysis)
    } catch (err) {
      setError(err.message || 'Failed to analyze job fit')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const downloadResult = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="advanced-features">
      <div className="features-header">
        <div className="becky-intro">
          <BeckyLogo size="large" />
          <div className="becky-text">
            <h2>Becky's Advanced Tools! 🚀✨</h2>
            <p>Hi there! I'm Becky, and I've got some special tools to help you excel in your SDR career! Let me create personalized coaching plans and analyze job fits just for you.</p>
          </div>
        </div>
      </div>

      <div className="features-container">
        <div className="features-sidebar">
          <div className="feature-selection">
            <h3>Choose Feature</h3>
            
            {features.map(feature => (
              <div 
                key={feature.key}
                className={`feature-option ${activeFeature === feature.key ? 'selected' : ''}`}
                onClick={() => setActiveFeature(feature.key)}
              >
                <div className="feature-icon">{feature.icon}</div>
                <div className="feature-content">
                  <h4>{feature.label}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {activeFeature === 'coaching' && (
            <div className="feature-action">
                             <button 
                 className="action-btn"
                 onClick={handleCoachingPlan}
                 disabled={isLoading}
               >
                 {isLoading ? (
                   <>
                     <BeckyLogo size="small" animated={true} />
                     <FiLoader className="spinner" />
                     Becky is creating your plan...
                   </>
                 ) : (
                   <>
                     <BeckyLogo size="small" animated={false} />
                     Let Becky Create Your Coaching Plan
                   </>
                 )}
               </button>
            </div>
          )}

          {activeFeature === 'jobFit' && (
            <div className="feature-action">
              <div className="job-description-input">
                <h4>Job Description</h4>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={8}
                />
              </div>
                             <button 
                 className="action-btn"
                 onClick={handleJobFitAnalysis}
                 disabled={isLoading || !jobDescription.trim()}
               >
                 {isLoading ? (
                   <>
                     <BeckyLogo size="small" animated={true} />
                     <FiLoader className="spinner" />
                     Becky is analyzing...
                   </>
                 ) : (
                   <>
                     <BeckyLogo size="small" animated={false} />
                     Let Becky Analyze Job Fit
                   </>
                 )}
               </button>
            </div>
          )}

          {activeFeature === 'marketAnalysis' && (
            <div className="feature-action">
              <button 
                className="action-btn"
                onClick={() => setActiveFeature('advancedAnalysis')}
              >
                <FiTrendingUp />
                Go to Advanced Analysis
              </button>
            </div>
          )}

          {error && (
            <div className="error-message">
              <FiAlertCircle />
              {error}
            </div>
          )}
        </div>

        <div className="features-results">
          {result ? (
            <div className="result-container">
              <div className="result-header">
                <h3>Results</h3>
                <div className="result-actions">
                  <button 
                    className="action-btn"
                    onClick={() => copyToClipboard(result)}
                  >
                    <FiCopy />
                    Copy
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => downloadResult(result, `${activeFeature}-${Date.now()}.txt`)}
                  >
                    <FiDownload />
                    Download
                  </button>
                </div>
              </div>
              <div className="result-content">
                <pre>{result}</pre>
              </div>
            </div>
                     ) : (
             <div className="empty-state">
               <BeckyLogo size="xlarge" animated={true} />
               <h3>Ready for Becky's Advanced Tools!</h3>
               <p>Select a feature and let Becky work her magic! ✨</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}

export default AdvancedFeatures
