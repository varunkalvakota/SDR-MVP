import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { 
  FiBook, 
  FiTarget, 
  FiUsers, 
  FiMessageSquare, 
  FiDatabase,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiTrendingUp,
  FiPlay,
  FiLock,
  FiStar,
  FiZap,
  FiBarChart,
  FiFlag,
  FiArrowRight,
  FiDownload,
  FiEye
} from 'react-icons/fi'
import './TrainingCamp.css'

const TrainingCamp = () => {
  const { user } = useAuth()
  
  const [activeModule, setActiveModule] = useState(null)
  const [userProgress, setUserProgress] = useState({})
  const [userStats, setUserStats] = useState({
    totalXP: 0,
    streak: 0,
    badges: [],
    completedModules: 0,
    totalModules: 4
  })
  const [loading, setLoading] = useState(true)

  // Add error boundary
  if (!user) {
    return (
      <div className="training-camp-error">
        <p>Please log in to access the Training Camp.</p>
      </div>
    )
  }

  // Training modules data
  const trainingModules = [
    {
      id: 'prospecting',
      title: 'Prospecting Mastery',
      description: 'Learn to identify and research high-quality prospects',
      icon: FiTarget,
      color: '#3B82F6',
      difficulty: 'Beginner',
      estimatedTime: '2-3 hours',
      xpReward: 200,
      prerequisites: [],
      lessons: [
        {
          id: 'prospecting-1',
          title: 'Understanding Your Ideal Customer Profile (ICP)',
          type: 'video',
          duration: '15 min',
          content: 'Learn how to define and refine your ideal customer profile for maximum outreach effectiveness.',
          completed: false
        },
        {
          id: 'prospecting-2',
          title: 'Research Tools and Techniques',
          type: 'interactive',
          duration: '20 min',
          content: 'Master the art of prospect research using LinkedIn, company websites, and other tools.',
          completed: false
        },
        {
          id: 'prospecting-3',
          title: 'Qualification Frameworks',
          type: 'quiz',
          duration: '10 min',
          content: 'Learn BANT, MEDDIC, and other qualification frameworks to identify quality prospects.',
          completed: false
        },
        {
          id: 'prospecting-4',
          title: 'Building Your Prospect List',
          type: 'practical',
          duration: '25 min',
          content: 'Hands-on exercise: Build a targeted prospect list of 50 companies.',
          completed: false
        }
      ]
    },
    {
      id: 'outreach',
      title: 'Outreach Excellence',
      description: 'Master cold emailing, LinkedIn messaging, and multi-channel outreach',
      icon: FiMessageSquare,
      color: '#10B981',
      difficulty: 'Intermediate',
      estimatedTime: '3-4 hours',
      xpReward: 300,
      prerequisites: ['prospecting'],
      lessons: [
        {
          id: 'outreach-1',
          title: 'Cold Email Fundamentals',
          type: 'video',
          duration: '18 min',
          content: 'Learn the anatomy of a high-converting cold email and best practices.',
          completed: false
        },
        {
          id: 'outreach-2',
          title: 'Subject Line Mastery',
          type: 'interactive',
          duration: '15 min',
          content: 'Craft subject lines that get opened and drive responses.',
          completed: false
        },
        {
          id: 'outreach-3',
          title: 'LinkedIn Outreach Strategies',
          type: 'video',
          duration: '22 min',
          content: 'Master LinkedIn connection requests and follow-up messaging.',
          completed: false
        },
        {
          id: 'outreach-4',
          title: 'Multi-Channel Sequences',
          type: 'practical',
          duration: '30 min',
          content: 'Build a 5-touch sequence across email, LinkedIn, and phone.',
          completed: false
        },
        {
          id: 'outreach-5',
          title: 'Personalization Techniques',
          type: 'interactive',
          duration: '20 min',
          content: 'Learn to personalize at scale while maintaining efficiency.',
          completed: false
        }
      ]
    },
    {
      id: 'objection-handling',
      title: 'Objection Handling',
      description: 'Turn objections into opportunities with proven frameworks',
      icon: FiUsers,
      color: '#F59E0B',
      difficulty: 'Intermediate',
      estimatedTime: '2-3 hours',
      xpReward: 250,
      prerequisites: ['outreach'],
      lessons: [
        {
          id: 'objection-1',
          title: 'Common SDR Objections',
          type: 'video',
          duration: '16 min',
          content: 'Understand the most common objections you\'ll face as an SDR.',
          completed: false
        },
        {
          id: 'objection-2',
          title: 'The LAER Framework',
          type: 'interactive',
          duration: '18 min',
          content: 'Learn Listen, Acknowledge, Explore, Respond - a proven objection handling method.',
          completed: false
        },
        {
          id: 'objection-3',
          title: 'Role Play Scenarios',
          type: 'practical',
          duration: '25 min',
          content: 'Practice handling objections through realistic role-play scenarios.',
          completed: false
        },
        {
          id: 'objection-4',
          title: 'Advanced Objection Techniques',
          type: 'video',
          duration: '20 min',
          content: 'Master advanced techniques for complex objections.',
          completed: false
        }
      ]
    },
    {
      id: 'crm-mastery',
      title: 'CRM & Sales Tools',
      description: 'Master Salesforce, HubSpot, and other essential sales tools',
      icon: FiDatabase,
      color: '#8B5CF6',
      difficulty: 'Advanced',
      estimatedTime: '4-5 hours',
      xpReward: 400,
      prerequisites: ['objection-handling'],
      lessons: [
        {
          id: 'crm-1',
          title: 'CRM Fundamentals',
          type: 'video',
          duration: '20 min',
          content: 'Understand the role of CRM in sales and best practices.',
          completed: false
        },
        {
          id: 'crm-2',
          title: 'Salesforce Basics',
          type: 'interactive',
          duration: '30 min',
          content: 'Learn to navigate and use Salesforce effectively.',
          completed: false
        },
        {
          id: 'crm-3',
          title: 'HubSpot CRM',
          type: 'interactive',
          duration: '25 min',
          content: 'Master HubSpot CRM features and workflows.',
          completed: false
        },
        {
          id: 'crm-4',
          title: 'Data Management',
          type: 'practical',
          duration: '20 min',
          content: 'Learn to maintain clean, accurate CRM data.',
          completed: false
        },
        {
          id: 'crm-5',
          title: 'Reporting and Analytics',
          type: 'video',
          duration: '18 min',
          content: 'Use CRM reports to track performance and identify opportunities.',
          completed: false
        },
        {
          id: 'crm-6',
          title: 'Integration Best Practices',
          type: 'practical',
          duration: '25 min',
          content: 'Connect your CRM with other sales tools and platforms.',
          completed: false
        }
      ]
    }
  ]

  useEffect(() => {
    if (user) {
      loadUserProgress()
    }
  }, [user])

  const loadUserProgress = async () => {
    try {
      setLoading(true)
      
      // Try to load from database first
      let progressData = null
      let achievementsData = null
      
      try {
        const { data: dbProgressData, error: progressError } = await supabase
          .from('training_progress')
          .select('*')
          .eq('user_id', user.id)

        if (!progressError && dbProgressData) {
          progressData = dbProgressData
        }

        const { data: dbAchievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)

        if (!achievementsError && dbAchievementsData) {
          achievementsData = dbAchievementsData
        }
      } catch (dbError) {
        console.log('Database not available, using localStorage fallback')
      }

      // Fallback to localStorage if database fails
      if (!progressData) {
        const progressKey = `training-progress-${user.id}`
        const localProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
        
        // Convert localStorage format to database format
        progressData = Object.entries(localProgress).map(([moduleName, data]) => ({
          module_name: moduleName,
          score: data.score,
          max_score: 100,
          completed: data.completed,
          attempts: data.attempts,
          last_activity: data.last_activity
        }))
      }

      // Process progress data
      const progress = {}
      let totalXP = 0
      let completedModules = 0
      const badges = achievementsData || []

      if (progressData && Array.isArray(progressData)) {
        progressData.forEach(item => {
          progress[item.module_name] = {
            score: item.score,
            maxScore: item.max_score,
            completed: item.completed,
            attempts: item.attempts,
            badges: item.badges_earned || [],
            streak: item.streak_count || 0,
            lastActivity: item.last_activity
          }
          
          if (item.completed) {
            completedModules++
            totalXP += getModuleXP(item.module_name)
          }
        })
      }

      setUserProgress(progress)
      setUserStats({
        totalXP,
        streak: Math.max(...Object.values(progress).map(p => p.streak || 0), 0),
        badges,
        completedModules,
        totalModules: trainingModules.length
      })

    } catch (error) {
      console.error('Error loading user progress:', error)
      // Set default values to prevent crash
      setUserProgress({})
      setUserStats({
        totalXP: 0,
        streak: 0,
        badges: [],
        completedModules: 0,
        totalModules: 4
      })
    } finally {
      setLoading(false)
    }
  }

  const getModuleXP = (moduleName) => {
    const module = trainingModules.find(m => m.id === moduleName)
    return module ? module.xpReward : 0
  }

  const isModuleUnlocked = (module) => {
    if (module.prerequisites.length === 0) return true
    
    return module.prerequisites.every(prereq => {
      const prereqProgress = userProgress[prereq]
      return prereqProgress && prereqProgress.completed === true
    })
  }

  const getModuleProgress = (moduleId) => {
    const progress = userProgress[moduleId]
    const module = trainingModules.find(m => m.id === moduleId)
    const totalLessons = module ? module.lessons.length : 0
    
    if (!progress) {
      return { completed: 0, total: totalLessons, percentage: 0 }
    }
    
    // Calculate completed lessons based on score (10 points per lesson)
    const completedLessons = Math.floor(progress.score / 10)
    
    return {
      completed: Math.min(completedLessons, totalLessons),
      total: totalLessons,
      percentage: totalLessons > 0 ? (Math.min(completedLessons, totalLessons) / totalLessons) * 100 : 0
    }
  }

  const startModule = (module) => {
    setActiveModule(module)
  }

  const completeLesson = async (moduleId, lessonId) => {
    try {
      console.log(`Completing lesson: ${lessonId} in module: ${moduleId}`)
      
      // Update lesson completion in state
      const updatedModule = {
        ...activeModule,
        lessons: activeModule.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      }
      setActiveModule(updatedModule)

      // Update user progress state
      const currentProgress = userProgress[moduleId] || { 
        score: 0, 
        completed: false, 
        attempts: 0, 
        badges: [], 
        streak: 0 
      }
      
      const newScore = currentProgress.score + 10 // Award 10 points per lesson
      const newAttempts = currentProgress.attempts + 1
      
      // Check if module is completed
      const allLessonsCompleted = updatedModule.lessons.every(lesson => lesson.completed)
      
      // Update local progress state
      setUserProgress(prev => ({
        ...prev,
        [moduleId]: {
          ...currentProgress,
          score: newScore,
          completed: allLessonsCompleted,
          attempts: newAttempts
        }
      }))

      // Update user stats
      setUserStats(prev => ({
        ...prev,
        totalXP: prev.totalXP + 10
      }))

      // Save to database
      await saveProgressToDatabase(moduleId, newScore, allLessonsCompleted, newAttempts)
      
      if (allLessonsCompleted) {
        // Award module completion
        await awardModuleCompletion(moduleId)
      }

      console.log('Lesson completed successfully!')

    } catch (error) {
      console.error('Error completing lesson:', error)
      // Show user-friendly error message
      alert('Failed to save progress. Please try again.')
    }
  }

  const awardModuleCompletion = async (moduleId) => {
    try {
      const module = trainingModules.find(m => m.id === moduleId)
      
      // Add XP
      const newTotalXP = userStats.totalXP + module.xpReward
      
      // Award badge
      const newBadge = {
        achievement_type: 'module_completion',
        achievement_name: `${module.title} Master`,
        achievement_description: `Completed the ${module.title} training module`,
        points_earned: module.xpReward,
        badge_icon: 'trophy',
        user_id: user.id
      }

      // Save to database
      await supabase
        .from('user_achievements')
        .insert([newBadge])

      // Update local state
      setUserStats(prev => ({
        ...prev,
        totalXP: newTotalXP,
        completedModules: prev.completedModules + 1,
        badges: [...prev.badges, newBadge]
      }))

    } catch (error) {
      console.error('Error awarding module completion:', error)
    }
  }

  const saveProgressToDatabase = async (moduleId, score, completed, attempts) => {
    try {
      console.log(`Saving progress to database: ${moduleId}, score: ${score}, completed: ${completed}`)
      
      // Try to save to database
      const { error } = await supabase
        .from('training_progress')
        .upsert({
          user_id: user.id,
          module_name: moduleId,
          module_type: moduleId,
          score: score,
          max_score: 100,
          completed: completed,
          attempts: attempts,
          last_activity: new Date().toISOString()
        })

      if (error) {
        console.error('Database error:', error)
        // Don't throw error - fall back to localStorage
        console.log('Falling back to localStorage for progress saving')
        saveProgressToLocalStorage(moduleId, score, completed, attempts)
        return
      }

      console.log('Progress saved to database successfully')

    } catch (error) {
      console.error('Error saving progress to database:', error)
      // Fall back to localStorage
      console.log('Falling back to localStorage for progress saving')
      saveProgressToLocalStorage(moduleId, score, completed, attempts)
    }
  }

  const saveProgressToLocalStorage = (moduleId, score, completed, attempts) => {
    try {
      const progressKey = `training-progress-${user.id}`
      const existingProgress = JSON.parse(localStorage.getItem(progressKey) || '{}')
      
      existingProgress[moduleId] = {
        score,
        completed,
        attempts,
        last_activity: new Date().toISOString()
      }
      
      localStorage.setItem(progressKey, JSON.stringify(existingProgress))
      console.log('Progress saved to localStorage successfully')
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  const closeModule = () => {
    setActiveModule(null)
    loadUserProgress() // Refresh progress
  }

  if (loading) {
    return (
      <div className="training-camp-loading">
        <div className="loading-spinner"></div>
        <p>Loading your training progress...</p>
      </div>
    )
  }

  if (activeModule) {
    return (
      <div className="training-camp-module">
        <div className="module-header">
          <button onClick={closeModule} className="back-button">
            <FiArrowRight className="back-icon" />
            Back to Training Camp
          </button>
          <div className="module-info">
            <div className="module-icon" style={{ backgroundColor: activeModule.color }}>
              <activeModule.icon />
            </div>
            <div>
              <h2>{activeModule.title}</h2>
              <p>{activeModule.description}</p>
              <div className="module-meta">
                <span className="difficulty">{activeModule.difficulty}</span>
                <span className="duration">{activeModule.estimatedTime}</span>
                <span className="xp">{activeModule.xpReward} XP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lessons-container">
          <h3>Lessons</h3>
          <div className="lessons-list">
            {activeModule.lessons.map((lesson, index) => {
              const moduleProgress = userProgress[activeModule.id]
              const completedLessons = moduleProgress ? Math.floor(moduleProgress.score / 10) : 0
              const isLessonCompleted = index < completedLessons
              
              return (
                <div key={lesson.id} className={`lesson-item ${isLessonCompleted ? 'completed' : ''}`}>
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-content">
                    <div className="lesson-header">
                      <h4>{lesson.title}</h4>
                      <div className="lesson-meta">
                        <span className="lesson-type">{lesson.type}</span>
                        <span className="lesson-duration">{lesson.duration}</span>
                      </div>
                    </div>
                    <p className="lesson-description">{lesson.content}</p>
                    {isLessonCompleted ? (
                      <div className="lesson-completed">
                        <FiCheckCircle />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => completeLesson(activeModule.id, lesson.id)}
                        className="start-lesson-btn"
                      >
                        <FiPlay />
                        Start Lesson
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="training-camp" style={{
      WebkitFontSmoothing: 'subpixel-antialiased',
      MozOsxFontSmoothing: 'auto',
      textRendering: 'optimizeLegibility',
      fontSmooth: 'never',
      filter: 'none',
      transform: 'none',
      willChange: 'auto'
    }}>
      <div className="training-header" style={{
        WebkitFontSmoothing: 'subpixel-antialiased',
        MozOsxFontSmoothing: 'auto',
        textRendering: 'optimizeLegibility',
        fontSmooth: 'never',
        filter: 'none',
        transform: 'none',
        willChange: 'auto'
      }}>
        <div style={{
          position: 'relative',
          zIndex: 10,
          isolation: 'isolate',
          WebkitFontSmoothing: 'none',
          MozOsxFontSmoothing: 'unset',
          textRendering: 'geometricPrecision',
          fontSmooth: 'never',
          filter: 'none',
          transform: 'none',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          imageRendering: 'crisp-edges'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '900',
            color: '#1a202c',
            margin: '0 0 1rem 0',
            letterSpacing: '-0.02em',
            fontFamily: 'Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'unset',
            textRendering: 'geometricPrecision',
            fontSmooth: 'never',
            filter: 'none',
            transform: 'none',
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            imageRendering: 'crisp-edges',
            position: 'relative',
            zIndex: 11
          }}>Training Camp</h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#374151',
            margin: '0',
            fontWeight: '600',
            lineHeight: '1.6',
            fontFamily: 'Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'none',
            MozOsxFontSmoothing: 'unset',
            textRendering: 'geometricPrecision',
            fontSmooth: 'never',
            filter: 'none',
            transform: 'none',
            willChange: 'auto',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            imageRendering: 'crisp-edges',
            position: 'relative',
            zIndex: 11
          }}>Master the essential skills to become a top-performing SDR</p>
        </div>
        <div className="user-stats">
          <div className="stat-item">
            <FiTrendingUp />
            <span className="stat-value" style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1a202c',
              WebkitFontSmoothing: 'subpixel-antialiased',
              MozOsxFontSmoothing: 'auto',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'never',
              filter: 'none',
              transform: 'none'
            }}>{userStats.totalXP}</span>
            <span className="stat-label" style={{
              fontSize: '0.85rem',
              color: '#64748b',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center',
              WebkitFontSmoothing: 'subpixel-antialiased',
              MozOsxFontSmoothing: 'auto',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'never',
              filter: 'none',
              transform: 'none'
            }}>Total XP</span>
          </div>
          <div className="stat-item">
            <FiZap />
            <span className="stat-value" style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1a202c',
              WebkitFontSmoothing: 'subpixel-antialiased',
              MozOsxFontSmoothing: 'auto',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'never',
              filter: 'none',
              transform: 'none'
            }}>{userStats.streak}</span>
            <span className="stat-label" style={{
              fontSize: '0.85rem',
              color: '#64748b',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center',
              WebkitFontSmoothing: 'subpixel-antialiased',
              MozOsxFontSmoothing: 'auto',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'never',
              filter: 'none',
              transform: 'none'
            }}>Day Streak</span>
          </div>
          <div className="stat-item">
            <FiAward />
            <span className="stat-value" style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1a202c',
              WebkitFontSmoothing: 'subpixel-antialiased',
              MozOsxFontSmoothing: 'auto',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'never',
              filter: 'none',
              transform: 'none'
            }}>{userStats.badges.length}</span>
            <span className="stat-label" style={{
              fontSize: '0.85rem',
              color: '#64748b',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              textAlign: 'center',
              WebkitFontSmoothing: 'subpixel-antialiased',
              MozOsxFontSmoothing: 'auto',
              textRendering: 'optimizeLegibility',
              fontSmooth: 'never',
              filter: 'none',
              transform: 'none'
            }}>Badges</span>
          </div>
        </div>
      </div>

      <div className="progress-overview">
        <div className="progress-header">
          <h3>Your Progress</h3>
          <span className="progress-text">
            {userStats.completedModules}/{userStats.totalModules} modules completed
          </span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(userStats.completedModules / userStats.totalModules) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="modules-grid">
        {trainingModules.map((module) => {
          const isUnlocked = isModuleUnlocked(module)
          const progress = getModuleProgress(module.id)
          const moduleProgress = userProgress[module.id]
          
          return (
            <div 
              key={module.id} 
              className={`module-card ${!isUnlocked ? 'locked' : ''} ${moduleProgress?.completed ? 'completed' : ''}`}
            >
              <div className="module-card-header">
                <div className="module-icon" style={{ backgroundColor: module.color }}>
                  <module.icon />
                </div>
                <div className="module-status">
                  {!isUnlocked ? (
                    <FiLock className="lock-icon" />
                  ) : moduleProgress?.completed ? (
                    <FiCheckCircle className="completed-icon" />
                  ) : (
                    <FiPlay className="play-icon" />
                  )}
                </div>
              </div>

              <div className="module-card-content">
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                
                <div className="module-meta">
                  <span className="difficulty">{module.difficulty}</span>
                  <span className="duration">{module.estimatedTime}</span>
                  <span className="xp">{module.xpReward} XP</span>
                </div>

                {isUnlocked && (
                  <div className="module-progress">
                    <div className="progress-info">
                      <span>{progress.completed}/{progress.total} lessons</span>
                      <span>{Math.round(progress.percentage)}%</span>
                    </div>
                    <div className="progress-bar-small">
                      <div 
                        className="progress-fill-small" 
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {moduleProgress?.badges && moduleProgress.badges.length > 0 && (
                  <div className="module-badges">
                    {moduleProgress.badges.map((badge, index) => (
                      <div key={index} className="badge">
                        <FiAward />
                        <span>{badge}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="module-card-footer">
                {!isUnlocked ? (
                  <button className="module-btn locked" disabled>
                    <FiLock />
                    Complete prerequisites
                  </button>
                ) : (
                  <button 
                    onClick={() => startModule(module)}
                    className="module-btn"
                  >
                    {moduleProgress?.completed ? (
                      <>
                        <FiEye />
                        Review Module
                      </>
                    ) : (
                      <>
                        <FiPlay />
                        Start Training
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {userStats.badges.length > 0 && (
        <div className="achievements-section">
          <h3>Recent Achievements</h3>
          <div className="badges-grid">
            {userStats.badges.slice(-3).map((badge, index) => (
              <div key={index} className="badge-card">
                <FiAward className="badge-icon" />
                <div className="badge-info">
                  <h4>{badge.achievement_name}</h4>
                  <p>{badge.achievement_description}</p>
                  <span className="badge-points">+{badge.points_earned} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Add error boundary wrapper
const TrainingCampWithErrorBoundary = () => {
  try {
    return <TrainingCamp />
  } catch (error) {
    console.error('TrainingCamp error:', error)
    return (
      <div className="training-camp-error">
        <p>Something went wrong loading the Training Camp. Please refresh the page.</p>
        <p>Error: {error.message}</p>
      </div>
    )
  }
}

export default TrainingCampWithErrorBoundary
