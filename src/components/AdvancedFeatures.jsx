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
  FiDownload,
  FiStar,
  FiTarget,
  FiZap
} from 'react-icons/fi'

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
      icon: <FiBookOpen />,
      color: '#3b82f6'
    },
    {
      key: 'jobFit',
      label: 'Job Fit Analysis',
      description: 'Analyze your resume against specific job descriptions',
      icon: <FiBriefcase />,
      color: '#10b981'
    },
    {
      key: 'marketAnalysis',
      label: 'Market Analysis',
      description: 'Understand your competitive position in the SDR market',
      icon: <FiTrendingUp />,
      color: '#f59e0b'
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
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '1rem'
        }}>
          <BeckyLogo size="large" animated={true} />
          
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: '#1f2937',
              margin: '0 0 0.5rem 0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Becky's Advanced Tools! 🚀✨
            </h1>
          </div>
        </div>
        <p style={{
          fontSize: '1.1rem',
          color: '#6b7280',
          margin: 0,
          lineHeight: '1.6'
        }}>
          Hi there! I'm Becky, and I've got some special tools to help you excel in your SDR career! Let me create personalized coaching plans and analyze job fits just for you.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '2rem',
        minHeight: '600px'
      }}>
        {/* Sidebar */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem',
            color: '#1f2937'
          }}>
            Choose Feature
          </h3>
          
          <div style={{ marginBottom: '2rem' }}>
            {features.map(feature => (
              <div 
                key={feature.key}
                onClick={() => setActiveFeature(feature.key)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '0.75rem',
                  cursor: 'pointer',
                  border: activeFeature === feature.key ? 'none' : '1px solid #e5e7eb',
                  background: activeFeature === feature.key ? feature.color : 'white',
                  transition: 'all 0.2s ease',
                  boxShadow: activeFeature === feature.key ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: activeFeature === feature.key ? 'white' : feature.color,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: activeFeature === feature.key ? feature.color : 'white',
                    fontSize: '1.2rem'
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      margin: '0 0 0.25rem 0',
                      color: activeFeature === feature.key ? 'white' : '#1f2937'
                    }}>
                      {feature.label}
                    </h4>
                    <p style={{
                      fontSize: '0.875rem',
                      color: activeFeature === feature.key ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Section */}
          {activeFeature === 'coaching' && (
            <div>
                             <button 
                 onClick={handleCoachingPlan}
                 disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  background: isLoading ? '#9ca3af' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
               >
                 {isLoading ? (
                   <>
                    <FiLoader style={{ animation: 'spin 1s linear infinite' }} />
                     Becky is creating your plan...
                   </>
                ) : (
                  <>
                    <BeckyLogo size="small" animated={false} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                        Let Becky Create Your Coaching Plan
                      </div>
                    </div>
                  </>
                )}
               </button>
            </div>
          )}

          {activeFeature === 'jobFit' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  Job Description
                </h4>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    transition: 'border-color 0.2s ease'
                  }}
                />
              </div>
                             <button 
                 onClick={handleJobFitAnalysis}
                 disabled={isLoading || !jobDescription.trim()}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  background: (isLoading || !jobDescription.trim()) ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (isLoading || !jobDescription.trim()) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
               >
                 {isLoading ? (
                   <>
                    <FiLoader style={{ animation: 'spin 1s linear infinite' }} />
                     Becky is analyzing...
                   </>
                 ) : (
                   <>
                    <FiTarget />
                     Let Becky Analyze Job Fit
                   </>
                 )}
               </button>
            </div>
          )}

          {activeFeature === 'marketAnalysis' && (
            <div>
              <button 
                onClick={() => setActiveFeature('advancedAnalysis')}
                style={{
                  width: '100%',
                  padding: '1rem 1.5rem',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <FiTrendingUp />
                Go to Advanced Analysis
              </button>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FiAlertCircle />
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {result ? (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  margin: 0,
                  color: '#1f2937'
                }}>
                  Results
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <button 
                    onClick={() => copyToClipboard(result)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FiCopy />
                    Copy
                  </button>
                  <button 
                    onClick={() => downloadResult(result, `${activeFeature}-${Date.now()}.txt`)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <FiDownload />
                    Download
                  </button>
                </div>
              </div>
              <div style={{
                flex: 1,
                overflow: 'auto'
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  fontSize: '0.875rem',
                  lineHeight: '1.6',
                  color: '#374151',
                  margin: 0,
                  fontFamily: 'inherit'
                }}>
                  {result}
                </pre>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <BeckyLogo size="xlarge" animated={true} />
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#1f2937'
              }}>
                Ready for Becky's Advanced Tools!
              </h3>
              <p style={{
                fontSize: '1rem',
                margin: 0,
                maxWidth: '300px'
              }}>
                Select a feature and let Becky work her magic! ✨
              </p>
            </div>
           )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default AdvancedFeatures