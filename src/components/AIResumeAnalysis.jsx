import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { aiService } from '../lib/aiService'
import ResumeStatus from './ResumeStatus'
import BeckyLogo from './BeckyLogo'
import { 
  FiCpu, 
  FiTarget, 
  FiUsers, 
  FiMessageSquare, 
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiCopy,
  FiDownload
} from 'react-icons/fi'
import './AIResumeAnalysis.css'

const AIResumeAnalysis = () => {
  const { user } = useAuth()
  const [selectedPrompt, setSelectedPrompt] = useState('masterAnalysis')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState('')
  const [error, setError] = useState('')
  const [analysisHistory, setAnalysisHistory] = useState([])
  const [manualResumeText, setManualResumeText] = useState('')
  const [useManualText, setUseManualText] = useState(false)
  const [savedAnalyses, setSavedAnalyses] = useState([])
  const [showSavedAnalyses, setShowSavedAnalyses] = useState(false)

  const systemPrompts = aiService.getSystemPrompts()

  // Load saved analyses on component mount
  useEffect(() => {
    if (user?.id) {
      loadSavedAnalyses()
    }
  }, [user])

  const loadSavedAnalyses = async () => {
    try {
      const analyses = await aiService.getAnalysisHistory(user.id, 20)
      setSavedAnalyses(analyses)
    } catch (error) {
      console.error('Error loading saved analyses:', error)
    }
  }

  const promptOptions = [
    { 
      key: 'masterAnalysis', 
      label: 'Master Analysis', 
      description: 'Comprehensive SDR assessment with skills, career path, interview prep, and personalization',
      icon: <FiCpu />
    },
    { 
      key: 'advancedAnalysis', 
      label: 'Advanced Analysis', 
      description: 'Competitive positioning, market analysis, and strategic career planning',
      icon: <FiTarget />
    },
    { 
      key: 'skillAnalysis', 
      label: 'Skill Analysis', 
      description: 'Analyze sales skills and identify areas for improvement',
      icon: <FiTarget />
    },
    { 
      key: 'careerPath', 
      label: 'Career Path Planning', 
      description: 'Get recommendations for career progression and timeline',
      icon: <FiUsers />
    },
    { 
      key: 'interviewPrep', 
      label: 'Interview Preparation', 
      description: 'Prepare for sales interviews with targeted questions',
      icon: <FiMessageSquare />
    },
    { 
      key: 'personalization', 
      label: 'Outreach Personalization', 
      description: 'Create personalized outreach strategies',
      icon: <FiCpu />
    }
  ]

  const handleAnalyze = async () => {
    if (!user || !user.id) {
      setError('Please sign in to analyze your resume')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysisResult('')

    try {
      const systemPrompt = selectedPrompt === 'custom' 
        ? customPrompt 
        : systemPrompts[selectedPrompt]

      let result
      
      if (useManualText && manualResumeText.trim()) {
        // Use manually entered text instead of uploaded file
        result = await aiService.processManualTextWithAI(
          manualResumeText.trim(),
          systemPrompt,
          selectedPrompt === 'custom' ? '' : 'Please provide a detailed analysis based on the resume content.'
        )
      } else {
        // Use uploaded file
        result = await aiService.processResumeWithAI(
          user.id, 
          systemPrompt,
          selectedPrompt === 'custom' ? '' : 'Please provide a detailed analysis based on the resume content.'
        )
      }

      setAnalysisResult(result)
      
      // Save the analysis result to database
      try {
        await aiService.saveAnalysisResult(user.id, selectedPrompt, result, {
          manualText: useManualText,
          promptType: selectedPrompt
        })
        // Reload saved analyses
        await loadSavedAnalyses()
      } catch (saveError) {
        console.error('Error saving analysis:', saveError)
        // Continue even if saving fails
      }
      
      // Add to local history
      const newAnalysis = {
        id: Date.now(),
        type: selectedPrompt,
        timestamp: new Date().toISOString(),
        result: result
      }
      setAnalysisHistory(prev => [newAnalysis, ...prev.slice(0, 4)]) // Keep last 5

      // Log the interaction
      await aiService.logAIInteraction(user.id, selectedPrompt, systemPrompt, result, true)

    } catch (err) {
      let errorMessage = err.message || 'Failed to analyze resume'
      
      // Provide helpful guidance for PDF extraction issues
      if (errorMessage.includes('PDF') || errorMessage.includes('extract')) {
        errorMessage = `PDF processing issue: ${errorMessage}\n\n💡 Tip: You can use the "Use manual text input" option above to paste your resume content directly.`
      }
      
      setError(errorMessage)
      await aiService.logAIInteraction(user.id, selectedPrompt, customPrompt || systemPrompts[selectedPrompt], '', false)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const downloadAnalysis = (content, filename) => {
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

  const toggleFavorite = async (analysisId, currentFavorite) => {
    try {
      await aiService.updateAnalysis(analysisId, { is_favorite: !currentFavorite })
      await loadSavedAnalyses() // Reload to get updated data
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const deleteAnalysis = async (analysisId) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await aiService.deleteAnalysis(analysisId)
        await loadSavedAnalyses() // Reload to get updated data
        // Clear current result if it was the deleted one
        setAnalysisResult('')
      } catch (error) {
        console.error('Error deleting analysis:', error)
      }
    }
  }

  const loadSavedAnalysis = async (analysisId) => {
    try {
      const analysis = await aiService.getAnalysisById(analysisId)
      setAnalysisResult(analysis.analysis_content)
      setShowSavedAnalyses(false) // Hide the saved analyses panel
    } catch (error) {
      console.error('Error loading saved analysis:', error)
    }
  }

  return (
    <div className="ai-resume-analysis">
      <div className="analysis-header">
        <div className="becky-intro">
          <BeckyLogo size="large" />
          <div className="becky-text">
            <h2>Meet Becky, Your AI Career Coach! 🤖✨</h2>
            <p>Hi there! I'm Becky, your friendly AI assistant here to help you succeed in your SDR journey! Let me analyze your resume and give you personalized insights and recommendations.</p>
          </div>
        </div>
      </div>
      
      <ResumeStatus />

      <div className="analysis-container">
        <div className="analysis-sidebar">
          <div className="prompt-selection">
            <h3>Choose Analysis Type</h3>
            
            {promptOptions.map(option => (
              <div 
                key={option.key}
                className={`prompt-option ${selectedPrompt === option.key ? 'selected' : ''}`}
                onClick={() => setSelectedPrompt(option.key)}
              >
                <div className="prompt-icon">{option.icon}</div>
                <div className="prompt-content">
                  <h4>{option.label}</h4>
                  <p>{option.description}</p>
                </div>
              </div>
            ))}

            <div 
              className={`prompt-option ${selectedPrompt === 'custom' ? 'selected' : ''}`}
              onClick={() => setSelectedPrompt('custom')}
            >
              <div className="prompt-icon"><FiCpu /></div>
              <div className="prompt-content">
                <h4>Custom Analysis</h4>
                <p>Write your own analysis prompt</p>
              </div>
            </div>
          </div>

          {selectedPrompt === 'custom' && (
            <div className="custom-prompt-section">
              <h4>Custom System Prompt</h4>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter your custom system prompt here..."
                rows={6}
              />
            </div>
          )}

          <div className="manual-text-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <input
                type="checkbox"
                id="useManualText"
                checked={useManualText}
                onChange={(e) => setUseManualText(e.target.checked)}
                style={{ margin: 0 }}
              />
              <label htmlFor="useManualText" style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a1a' }}>
                Use manual text input (if PDF extraction fails)
              </label>
            </div>
            
            {useManualText && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', marginBottom: '8px' }}>
                  Paste Your Resume Text
                </h4>
                <textarea
                  value={manualResumeText}
                  onChange={(e) => setManualResumeText(e.target.value)}
                  placeholder="Copy and paste your resume content here... (at least 50 characters)"
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {manualResumeText.length} characters
                </p>
              </div>
            )}
          </div>

                     <button 
             className="analyze-btn"
             onClick={handleAnalyze}
             disabled={isAnalyzing || (selectedPrompt === 'custom' && !customPrompt.trim()) || (useManualText && !manualResumeText.trim())}
           >
             {isAnalyzing ? (
               <>
                 <BeckyLogo size="small" animated={true} />
                 <FiLoader className="spinner" />
                 Becky is analyzing...
               </>
             ) : (
               <>
                 <BeckyLogo size="small" animated={false} />
                 Let Becky Analyze Your Resume
               </>
             )}
           </button>

          {error && (
            <div className="error-message">
              <FiAlertCircle />
              {error}
            </div>
          )}

          {/* Saved Analyses Section */}
          <div className="saved-analyses-section" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                Saved Analyses ({savedAnalyses.length})
              </h4>
              <button
                onClick={() => setShowSavedAnalyses(!showSavedAnalyses)}
                style={{
                  background: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '14px',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.background = 'transparent'}
              >
                {showSavedAnalyses ? 'Hide' : 'View'} Saved
              </button>
            </div>

            {showSavedAnalyses && savedAnalyses.length > 0 && (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {savedAnalyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    style={{
                      background: analysis.is_favorite ? '#fef3c7' : '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '12px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = analysis.is_favorite ? '#fde68a' : '#f3f4f6'}
                    onMouseOut={(e) => e.target.style.background = analysis.is_favorite ? '#fef3c7' : '#f9fafb'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: 0 }}>
                        {analysis.analysis_title}
                      </h5>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(analysis.id, analysis.is_favorite)
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                            cursor: 'pointer',
                            color: analysis.is_favorite ? '#f59e0b' : '#9ca3af'
                          }}
                          title={analysis.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {analysis.is_favorite ? '★' : '☆'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteAnalysis(analysis.id)
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '14px',
                            cursor: 'pointer',
                            color: '#ef4444'
                          }}
                          title="Delete analysis"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                      {new Date(analysis.created_at).toLocaleDateString()} • {analysis.analysis_type}
                    </p>
                    <p
                      style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: '1.4' }}
                      onClick={() => loadSavedAnalysis(analysis.id)}
                    >
                      {analysis.analysis_content.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}

                      {showSavedAnalyses && savedAnalyses.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
              <p style={{ margin: 0 }}>No saved analyses yet. Run your first analysis to see it here!</p>
            </div>
          )}

          {/* Analysis Progress Summary */}
          {savedAnalyses.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 8px 0' }}>
                Your Analysis Progress
              </h5>
              <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6b7280' }}>
                <span>📊 Total Analyses: {savedAnalyses.length}</span>
                <span>⭐ Favorites: {savedAnalyses.filter(a => a.is_favorite).length}</span>
                <span>📅 Latest: {savedAnalyses[0] ? new Date(savedAnalyses[0].created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="analysis-results">
          {analysisResult ? (
            <div className="result-container">
              <div className="result-header">
                <h3>Analysis Results</h3>
                <div className="result-actions">
                  <button 
                    className="action-btn"
                    onClick={() => copyToClipboard(analysisResult)}
                  >
                    <FiCopy />
                    Copy
                  </button>
                  <button 
                    className="action-btn"
                    onClick={() => downloadAnalysis(analysisResult, `resume-analysis-${Date.now()}.txt`)}
                  >
                    <FiDownload />
                    Download
                  </button>
                </div>
              </div>
              <div className="result-content">
                <pre>{analysisResult}</pre>
              </div>
            </div>
                     ) : (
             <div className="empty-state">
               <BeckyLogo size="xlarge" animated={true} />
               <h3>Ready for Becky's Analysis!</h3>
               <p>Select an analysis type and let Becky work her magic on your resume! ✨</p>
             </div>
           )}

          {analysisHistory.length > 0 && (
            <div className="analysis-history">
              <h3>Recent Analyses</h3>
              <div className="history-list">
                {analysisHistory.map(analysis => (
                  <div key={analysis.id} className="history-item">
                    <div className="history-header">
                      <span className="history-type">
                        {promptOptions.find(opt => opt.key === analysis.type)?.label || 'Custom'}
                      </span>
                      <span className="history-date">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="history-preview">
                      {analysis.result.substring(0, 100)}...
                    </div>
                    <button 
                      className="view-full-btn"
                      onClick={() => setAnalysisResult(analysis.result)}
                    >
                      View Full Analysis
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AIResumeAnalysis
