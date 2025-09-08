import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  FiTarget, 
  FiCalendar, 
  FiUsers, 
  FiMail, 
  FiLinkedin, 
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAward,
  FiZap,
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiFilter,
  FiSearch,
  FiBarChart,
  FiMessageSquare,
  FiPhone,
  FiVideo,
  FiStar,
  FiFlag,
  FiArrowRight,
  FiRefreshCw,
  FiDownload,
  FiUpload
} from 'react-icons/fi'
import './DailyMissions.css'

const DailyMissions = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('missions')
  const [missions, setMissions] = useState([])
  const [contacts, setContacts] = useState([])
  const [outreachHistory, setOutreachHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Mission types and templates
  const missionTypes = {
    prospecting: {
      title: 'Prospecting Mission',
      icon: FiUsers,
      color: '#3B82F6',
      description: 'Find and research new prospects'
    },
    outreach: {
      title: 'Outreach Mission', 
      icon: FiMail,
      color: '#10B981',
      description: 'Send personalized outreach messages'
    },
    followup: {
      title: 'Follow-up Mission',
      icon: FiMessageSquare,
      color: '#F59E0B',
      description: 'Follow up with existing prospects'
    },
    research: {
      title: 'Research Mission',
      icon: FiSearch,
      color: '#8B5CF6',
      description: 'Research companies and decision makers'
    },
    networking: {
      title: 'Networking Mission',
      icon: FiLinkedin,
      color: '#06B6D4',
      description: 'Expand your professional network'
    }
  }

  useEffect(() => {
    if (user) {
      loadDailyData()
    }
  }, [user, selectedDate])

  const loadDailyData = async () => {
    try {
      setLoading(true)
      
      // Load today's missions
      await loadMissions()
      
      // Load contacts
      await loadContacts()
      
      // Load outreach history
      await loadOutreachHistory()
      
    } catch (error) {
      console.error('Error loading daily data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMissions = async () => {
    try {
      // Try to load from database first
      const { data: dbMissions, error } = await supabase
        .from('daily_missions')
        .select('*')
        .eq('user_id', user.id)
        .eq('mission_date', selectedDate)

      if (!error && dbMissions && dbMissions.length > 0) {
        setMissions(dbMissions)
        return
      }

      // Fallback: Generate new missions for today
      const todayMissions = generateDailyMissions()
      setMissions(todayMissions)
      
      // Save to database
      await saveMissionsToDatabase(todayMissions)

    } catch (error) {
      console.error('Error loading missions:', error)
      // Fallback to localStorage
      const localMissions = loadMissionsFromLocalStorage()
      setMissions(localMissions)
    }
  }

  const generateDailyMissions = () => {
    const missionTemplates = [
      {
        id: `mission-${Date.now()}-1`,
        type: 'prospecting',
        title: 'Research 10 New Prospects',
        description: 'Find 10 new prospects in your target industry and research their company information.',
        targetCount: 10,
        completedCount: 0,
        xpReward: 50,
        priority: 'high',
        estimatedTime: '30 minutes',
        tips: [
          'Use LinkedIn Sales Navigator',
          'Check company websites for recent news',
          'Look for job postings to identify growing companies'
        ]
      },
      {
        id: `mission-${Date.now()}-2`,
        type: 'outreach',
        title: 'Send 5 Personalized Emails',
        description: 'Send 5 personalized cold emails to prospects you researched.',
        targetCount: 5,
        completedCount: 0,
        xpReward: 75,
        priority: 'high',
        estimatedTime: '45 minutes',
        tips: [
          'Reference specific company information',
          'Keep emails under 100 words',
          'Include a clear call-to-action'
        ]
      },
      {
        id: `mission-${Date.now()}-3`,
        type: 'followup',
        title: 'Follow Up with 3 Prospects',
        description: 'Follow up with 3 prospects from previous outreach campaigns.',
        targetCount: 3,
        completedCount: 0,
        xpReward: 40,
        priority: 'medium',
        estimatedTime: '20 minutes',
        tips: [
          'Add new value in each follow-up',
          'Try different channels (email, LinkedIn, phone)',
          'Space follow-ups 3-5 days apart'
        ]
      },
      {
        id: `mission-${Date.now()}-4`,
        type: 'research',
        title: 'Research 2 Target Companies',
        description: 'Deep dive research on 2 companies you want to target.',
        targetCount: 2,
        completedCount: 0,
        xpReward: 30,
        priority: 'medium',
        estimatedTime: '25 minutes',
        tips: [
          'Check recent funding news',
          'Look for new hires in sales/marketing',
          'Identify key decision makers'
        ]
      },
      {
        id: `mission-${Date.now()}-5`,
        type: 'networking',
        title: 'Connect with 5 Industry Professionals',
        description: 'Send connection requests to 5 professionals in your target industry.',
        targetCount: 5,
        completedCount: 0,
        xpReward: 25,
        priority: 'low',
        estimatedTime: '15 minutes',
        tips: [
          'Personalize connection requests',
          'Focus on decision makers',
          'Engage with their content first'
        ]
      }
    ]

    return missionTemplates.map(mission => ({
      ...mission,
      mission_date: selectedDate,
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: 'pending'
    }))
  }

  const saveMissionsToDatabase = async (missionsData) => {
    try {
      const { error } = await supabase
        .from('daily_missions')
        .insert(missionsData)

      if (error) {
        console.error('Error saving missions to database:', error)
        // Fallback to localStorage
        saveMissionsToLocalStorage(missionsData)
      }
    } catch (error) {
      console.error('Error saving missions:', error)
      saveMissionsToLocalStorage(missionsData)
    }
  }

  const saveMissionsToLocalStorage = (missionsData) => {
    try {
      const key = `daily-missions-${user.id}-${selectedDate}`
      localStorage.setItem(key, JSON.stringify(missionsData))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const loadMissionsFromLocalStorage = () => {
    try {
      const key = `daily-missions-${user.id}-${selectedDate}`
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : generateDailyMissions()
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      return generateDailyMissions()
    }
  }

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('outreach_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (!error && data) {
        setContacts(data)
      }
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  const loadOutreachHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('outreach_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(100)

      if (!error && data) {
        setOutreachHistory(data)
      }
    } catch (error) {
      console.error('Error loading outreach history:', error)
    }
  }

  const completeMission = async (missionId) => {
    try {
      const updatedMissions = missions.map(mission => {
        if (mission.id === missionId) {
          const newCompletedCount = mission.completedCount + 1
          const isFullyCompleted = newCompletedCount >= mission.targetCount
          
          return {
            ...mission,
            completedCount: newCompletedCount,
            status: isFullyCompleted ? 'completed' : 'in-progress'
          }
        }
        return mission
      })

      setMissions(updatedMissions)

      // Save to database
      const mission = updatedMissions.find(m => m.id === missionId)
      if (mission) {
        await supabase
          .from('daily_missions')
          .update({
            touches_completed: mission.completedCount,
            mission_completed: mission.status === 'completed'
          })
          .eq('id', missionId)
      }

    } catch (error) {
      console.error('Error completing mission:', error)
    }
  }

  const getMissionProgress = (mission) => {
    return (mission.completedCount / mission.targetCount) * 100
  }

  const getTotalXP = () => {
    return missions
      .filter(mission => mission.status === 'completed')
      .reduce((total, mission) => total + mission.xpReward, 0)
  }

  const getCompletedMissions = () => {
    return missions.filter(mission => mission.status === 'completed').length
  }

  if (loading) {
    return (
      <div className="daily-missions-loading">
        <div className="loading-spinner"></div>
        <p>Loading your daily missions...</p>
      </div>
    )
  }

  return (
    <div className="daily-missions">
      <div className="missions-header">
        <div className="header-content">
          <h1>Daily Missions</h1>
          <p>Complete your daily SDR tasks to build momentum and achieve your goals</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <FiTarget />
            <span className="stat-value">{getCompletedMissions()}/{missions.length}</span>
            <span className="stat-label">Missions</span>
          </div>
          <div className="stat-item">
            <FiZap />
            <span className="stat-value">{getTotalXP()}</span>
            <span className="stat-label">XP Earned</span>
          </div>
          <div className="stat-item">
            <FiCalendar />
            <span className="stat-value">{new Date(selectedDate).toLocaleDateString()}</span>
            <span className="stat-label">Date</span>
          </div>
        </div>
      </div>

      <div className="missions-tabs">
        <button 
          className={`tab-button ${activeTab === 'missions' ? 'active' : ''}`}
          onClick={() => setActiveTab('missions')}
        >
          <FiTarget />
          Daily Missions
        </button>
        <button 
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          <FiUsers />
          Contacts
        </button>
        <button 
          className={`tab-button ${activeTab === 'outreach' ? 'active' : ''}`}
          onClick={() => setActiveTab('outreach')}
        >
          <FiMail />
          Outreach History
        </button>
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <FiBarChart />
          Analytics
        </button>
      </div>

      <div className="missions-content">
        {activeTab === 'missions' && (
          <div className="missions-tab">
            <div className="missions-grid">
              {missions.map((mission) => {
                const missionType = missionTypes[mission.type]
                const progress = getMissionProgress(mission)
                const isCompleted = mission.status === 'completed'
                
                return (
                  <div key={mission.id} className={`mission-card ${isCompleted ? 'completed' : ''}`}>
                    <div className="mission-header">
                      <div className="mission-icon" style={{ backgroundColor: missionType.color }}>
                        <missionType.icon />
                      </div>
                      <div className="mission-status">
                        {isCompleted ? (
                          <FiCheckCircle className="completed-icon" />
                        ) : (
                          <div className="progress-circle">
                            <span>{Math.round(progress)}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mission-content">
                      <h3>{mission.title}</h3>
                      <p>{mission.description}</p>
                      
                      <div className="mission-meta">
                        <span className="priority">{mission.priority}</span>
                        <span className="time">{mission.estimatedTime}</span>
                        <span className="xp">{mission.xpReward} XP</span>
                      </div>

                      <div className="mission-progress">
                        <div className="progress-info">
                          <span>{mission.completedCount}/{mission.targetCount} completed</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {mission.tips && (
                        <div className="mission-tips">
                          <h4>Tips:</h4>
                          <ul>
                            {mission.tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mission-footer">
                      {!isCompleted && (
                        <button 
                          onClick={() => completeMission(mission.id)}
                          className="complete-btn"
                        >
                          <FiCheckCircle />
                          Mark Complete
                        </button>
                      )}
                      {isCompleted && (
                        <div className="completed-badge">
                          <FiAward />
                          <span>Mission Complete!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-tab">
            <div className="contacts-header">
              <h3>Your Contacts</h3>
              <button className="add-contact-btn">
                <FiPlus />
                Add Contact
              </button>
            </div>
            <div className="contacts-list">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <div key={contact.id} className="contact-card">
                    <div className="contact-info">
                      <h4>{contact.contact_name}</h4>
                      <p>{contact.company_name}</p>
                      <span className="contact-role">{contact.role_type}</span>
                    </div>
                    <div className="contact-actions">
                      <button className="action-btn">
                        <FiMail />
                      </button>
                      <button className="action-btn">
                        <FiLinkedin />
                      </button>
                      <button className="action-btn">
                        <FiEye />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FiUsers />
                  <h3>No contacts yet</h3>
                  <p>Start by adding your first contact or completing prospecting missions.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'outreach' && (
          <div className="outreach-tab">
            <div className="outreach-header">
              <h3>Outreach History</h3>
              <div className="outreach-filters">
                <select>
                  <option>All Channels</option>
                  <option>Email</option>
                  <option>LinkedIn</option>
                  <option>Phone</option>
                </select>
              </div>
            </div>
            <div className="outreach-list">
              {outreachHistory.length > 0 ? (
                outreachHistory.map((outreach) => (
                  <div key={outreach.id} className="outreach-card">
                    <div className="outreach-info">
                      <h4>{outreach.contact_name}</h4>
                      <p>{outreach.company_name}</p>
                      <span className="outreach-type">{outreach.outreach_type}</span>
                    </div>
                    <div className="outreach-meta">
                      <span className="outreach-date">
                        {new Date(outreach.sent_at).toLocaleDateString()}
                      </span>
                      <div className="outreach-status">
                        {outreach.replied_at && <FiCheckCircle className="replied" />}
                        {outreach.interview_booked && <FiAward className="interview" />}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <FiMail />
                  <h3>No outreach yet</h3>
                  <p>Complete outreach missions to start building your communication history.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="analytics-header">
              <h3>Performance Analytics</h3>
              <div className="analytics-filters">
                <select>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
            </div>
            <div className="analytics-grid">
              <div className="metric-card">
                <div className="metric-icon">
                  <FiTarget />
                </div>
                <div className="metric-content">
                  <h4>Missions Completed</h4>
                  <span className="metric-value">{getCompletedMissions()}</span>
                  <span className="metric-change">+12% this week</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">
                  <FiMail />
                </div>
                <div className="metric-content">
                  <h4>Emails Sent</h4>
                  <span className="metric-value">0</span>
                  <span className="metric-change">Start sending emails</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">
                  <FiUsers />
                </div>
                <div className="metric-content">
                  <h4>New Contacts</h4>
                  <span className="metric-value">0</span>
                  <span className="metric-change">Start prospecting</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">
                  <FiTrendingUp />
                </div>
                <div className="metric-content">
                  <h4>Response Rate</h4>
                  <span className="metric-value">0%</span>
                  <span className="metric-change">Track your responses</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailyMissions
