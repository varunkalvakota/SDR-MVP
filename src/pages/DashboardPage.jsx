import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AIResumeAnalysis from '../components/AIResumeAnalysis'
import AdvancedFeatures from '../components/AdvancedFeatures'
import { 
  FiUser, 
  FiTarget, 
  FiTrendingUp, 
  FiCalendar, 
  FiMap,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiBook,
  FiVideo,
  FiUsers,
  FiDollarSign,
  FiBriefcase,
  FiLogOut,
  FiEdit,
  FiDownload,
  FiArrowRight,
  FiCpu,
  FiZap
} from 'react-icons/fi'
import './DashboardPage.css'

const DashboardPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

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

      if (error) {
        // If no profile found, redirect to onboarding
        if (error.code === 'PGRST116') {
          console.log('No profile found, redirecting to onboarding...')
          navigate('/onboarding')
          return
        }
        throw error
      }

      // Check if onboarding is completed
      if (!data.onboarding_completed) {
        console.log('Onboarding not completed, redirecting...')
        navigate('/onboarding')
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Failed to load your profile')
    } finally {
      setLoading(false)
    }
  }

  const generateRoadmap = () => {
    if (!profile) return null

    const roadmap = {
      currentLevel: getCurrentLevel(profile.current_position, profile.experience_years),
      targetLevel: getTargetLevel(profile.career_goal),
      milestones: generateMilestones(profile),
      timeline: profile.timeline || '1-year',
      skills: profile.skills || [],
      recommendations: generateRecommendations(profile)
    }

    return roadmap
  }

  const getCurrentLevel = (position, experience) => {
    if (position === 'sdr') {
      if (experience === '0-1') return 'Junior SDR'
      if (experience === '1-3') return 'Mid-level SDR'
      return 'Senior SDR'
    }
    if (position === 'ae') return 'Account Executive'
    if (position === 'manager') return 'Sales Manager'
    return 'Entry Level'
  }

  const getTargetLevel = (goal) => {
    const goals = {
      'promotion': 'Account Executive',
      'management': 'Sales Manager',
      'pivot': 'New Role',
      'break-in': 'SDR',
      'salary': 'Higher Paying Role'
    }
    return goals[goal] || 'Career Growth'
  }

  const generateMilestones = (profile) => {
    const milestones = []
    
    if (profile.career_goal === 'promotion') {
      milestones.push(
        { id: 1, title: 'Master SDR Fundamentals', status: 'completed', timeframe: 'Month 1-2' },
        { id: 2, title: 'Improve Lead Qualification', status: 'in-progress', timeframe: 'Month 2-3' },
        { id: 3, title: 'Develop Closing Skills', status: 'pending', timeframe: 'Month 3-4' },
        { id: 4, title: 'Build Pipeline Management', status: 'pending', timeframe: 'Month 4-5' },
        { id: 5, title: 'Prepare for AE Transition', status: 'pending', timeframe: 'Month 5-6' }
      )
    } else if (profile.career_goal === 'management') {
      milestones.push(
        { id: 1, title: 'Excel in Current Role', status: 'completed', timeframe: 'Month 1-2' },
        { id: 2, title: 'Develop Leadership Skills', status: 'in-progress', timeframe: 'Month 2-3' },
        { id: 3, title: 'Mentor Junior SDRs', status: 'pending', timeframe: 'Month 3-4' },
        { id: 4, title: 'Learn Management Tools', status: 'pending', timeframe: 'Month 4-5' },
        { id: 5, title: 'Apply for Management Role', status: 'pending', timeframe: 'Month 5-6' }
      )
    } else {
      milestones.push(
        { id: 1, title: 'Assess Current Skills', status: 'completed', timeframe: 'Week 1-2' },
        { id: 2, title: 'Identify Skill Gaps', status: 'in-progress', timeframe: 'Week 2-3' },
        { id: 3, title: 'Develop Action Plan', status: 'pending', timeframe: 'Week 3-4' },
        { id: 4, title: 'Execute Learning Plan', status: 'pending', timeframe: 'Month 2-3' },
        { id: 5, title: 'Apply New Skills', status: 'pending', timeframe: 'Month 3-4' }
      )
    }

    return milestones
  }

  const generateRecommendations = (profile) => {
    const recommendations = {
      courses: [
        { title: 'Advanced Sales Techniques', platform: 'Coursera', duration: '6 weeks', rating: 4.8 },
        { title: 'Sales Management Fundamentals', platform: 'LinkedIn Learning', duration: '4 hours', rating: 4.6 },
        { title: 'CRM Mastery', platform: 'Udemy', duration: '8 hours', rating: 4.7 }
      ],
      books: [
        { title: 'The Challenger Sale', author: 'Matthew Dixon', rating: 4.5 },
        { title: 'SPIN Selling', author: 'Neil Rackham', rating: 4.6 },
        { title: 'To Sell is Human', author: 'Daniel Pink', rating: 4.4 }
      ],
      resources: [
        { title: 'Sales Hacker Blog', type: 'Blog', url: 'https://saleshacker.com' },
        { title: 'Sales Development Podcast', type: 'Podcast', url: 'https://sdreps.com' },
        { title: 'Sales Enablement Community', type: 'Community', url: 'https://salesenablement.com' }
      ]
    }

    return recommendations
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const exportRoadmap = () => {
    const roadmap = generateRoadmap()
    const dataStr = JSON.stringify(roadmap, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'career-roadmap.json'
    link.click()
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your personalized roadmap...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button onClick={fetchUserProfile}>Try Again</button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="dashboard-error">
        <p>No profile found. Please complete onboarding first.</p>
      </div>
    )
  }

  const roadmap = generateRoadmap()

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">S</span>
            <span className="logo-text">SDR Roadmap</span>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span>Welcome, {profile.first_name}!</span>
            <button onClick={handleSignOut} className="signout-btn">
              <FiLogOut />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <nav className="dashboard-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FiUser />
              Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <FiMap />
              Career Roadmap
            </button>
            <button 
              className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              <FiTrendingUp />
              Progress
            </button>
            <button 
              className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              <FiBook />
              Resources
            </button>
                    <button
          className={`nav-item ${activeTab === 'ai-analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-analysis')}
        >
          <FiCpu />
          AI Analysis
        </button>
        <button
          className={`nav-item ${activeTab === 'advanced-features' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced-features')}
        >
          <FiZap />
          Advanced Features
        </button>
          </nav>
        </div>

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-header">
                <h1>Your Career Overview</h1>
                <button onClick={exportRoadmap} className="export-btn">
                  <FiDownload />
                  Export Roadmap
                </button>
              </div>

              <div className="overview-grid">
                <div className="overview-card">
                  <div className="card-header">
                    <FiUser />
                    <h3>Personal Info</h3>
                  </div>
                  <div className="card-content">
                    <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Current Role:</strong> {profile.current_position || 'Not specified'}</p>
                    <p><strong>Experience:</strong> {profile.experience_years || 'Not specified'}</p>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-header">
                    <FiTarget />
                    <h3>Career Goals</h3>
                  </div>
                  <div className="card-content">
                    <p><strong>Primary Goal:</strong> {profile.career_goal || 'Not specified'}</p>
                    <p><strong>Timeline:</strong> {profile.timeline || 'Not specified'}</p>
                    <p><strong>Industry:</strong> {profile.preferred_industry || 'Not specified'}</p>
                    <p><strong>Salary Expectation:</strong> {profile.salary_expectation || 'Not specified'}</p>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-header">
                    <FiTrendingUp />
                    <h3>Current Level</h3>
                  </div>
                  <div className="card-content">
                    <div className="level-indicator">
                      <span className="current-level">{roadmap.currentLevel}</span>
                      <FiArrowRight />
                      <span className="target-level">{roadmap.targetLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <div className="card-header">
                    <FiAward />
                    <h3>Key Skills</h3>
                  </div>
                  <div className="card-content">
                    <div className="skills-list">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))
                      ) : (
                        <p>No skills specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="roadmap-tab">
              <div className="roadmap-header">
                <h1>Your Personalized Career Roadmap</h1>
                <p>From {roadmap.currentLevel} to {roadmap.targetLevel}</p>
              </div>

              <div className="roadmap-timeline">
                {roadmap.milestones.map((milestone, index) => (
                  <div key={milestone.id} className={`milestone ${milestone.status}`}>
                    <div className="milestone-icon">
                      {milestone.status === 'completed' && <FiCheckCircle />}
                      {milestone.status === 'in-progress' && <FiClock />}
                      {milestone.status === 'pending' && <FiCalendar />}
                    </div>
                    <div className="milestone-content">
                      <h3>{milestone.title}</h3>
                      <p className="timeframe">{milestone.timeframe}</p>
                      <div className={`status-badge ${milestone.status}`}>
                        {milestone.status.replace('-', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-tab">
              <div className="progress-header">
                <h1>Your Progress</h1>
                <p>Track your journey to {roadmap.targetLevel}</p>
              </div>

              <div className="progress-stats">
                <div className="stat-card">
                  <div className="stat-number">
                    {roadmap.milestones.filter(m => m.status === 'completed').length}
                  </div>
                  <div className="stat-label">Completed Milestones</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {roadmap.milestones.filter(m => m.status === 'in-progress').length}
                  </div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">
                    {roadmap.milestones.filter(m => m.status === 'pending').length}
                  </div>
                  <div className="stat-label">Upcoming</div>
                </div>
              </div>

              <div className="progress-chart">
                <div className="chart-header">
                  <h3>Overall Progress</h3>
                  <span className="progress-percentage">
                    {Math.round((roadmap.milestones.filter(m => m.status === 'completed').length / roadmap.milestones.length) * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(roadmap.milestones.filter(m => m.status === 'completed').length / roadmap.milestones.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="resources-tab">
              <div className="resources-header">
                <h1>Recommended Resources</h1>
                <p>Curated learning materials for your career growth</p>
              </div>

              <div className="resources-grid">
                <div className="resource-section">
                  <h3><FiVideo /> Online Courses</h3>
                  <div className="resource-list">
                    {roadmap.recommendations.courses.map((course, index) => (
                      <div key={index} className="resource-item">
                        <div className="resource-info">
                          <h4>{course.title}</h4>
                          <p>{course.platform} • {course.duration}</p>
                        </div>
                        <div className="resource-rating">
                          ⭐ {course.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="resource-section">
                  <h3><FiBook /> Books</h3>
                  <div className="resource-list">
                    {roadmap.recommendations.books.map((book, index) => (
                      <div key={index} className="resource-item">
                        <div className="resource-info">
                          <h4>{book.title}</h4>
                          <p>by {book.author}</p>
                        </div>
                        <div className="resource-rating">
                          ⭐ {book.rating}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="resource-section">
                  <h3><FiUsers /> Communities & Blogs</h3>
                  <div className="resource-list">
                    {roadmap.recommendations.resources.map((resource, index) => (
                      <div key={index} className="resource-item">
                        <div className="resource-info">
                          <h4>{resource.title}</h4>
                          <p>{resource.type}</p>
                        </div>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                          Visit →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

                {activeTab === 'ai-analysis' && (
        <div className="ai-analysis-tab">
          <AIResumeAnalysis />
        </div>
      )}
      {activeTab === 'advanced-features' && (
        <div className="advanced-features-tab">
          <AdvancedFeatures />
        </div>
      )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage