import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AIResumeAnalysis from '../components/AIResumeAnalysis'
import AdvancedFeatures from '../components/AdvancedFeatures'
import LinkedInAnalysis from '../components/LinkedInAnalysis'
import TrainingCamp from '../components/TrainingCamp'
import DailyMissions from '../components/DailyMissions'

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
  FiZap,
  FiLinkedin,
  FiStar,
  FiLock

} from 'react-icons/fi'
import SDRLogo from '../components/SDRLogo'
import './DashboardPage.css'

const DashboardPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('roadmap')
  const [selectedMilestone, setSelectedMilestone] = useState(null)
  const [showMilestoneModal, setShowMilestoneModal] = useState(false)
  const [dailyMissions, setDailyMissions] = useState([])
  const [userXP, setUserXP] = useState(0)
  const [streak, setStreak] = useState(0)
  const [completedTasks, setCompletedTasks] = useState({})

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      generateDailyMissions()
      loadUserProgress()
    }
  }, [profile])

  const generateDailyMissions = () => {
    const today = new Date().toDateString()
    const lastGenerated = localStorage.getItem(`missions-generated-${user?.id}`)
    
    // Check if missions were already generated today
    if (lastGenerated === today) {
      const savedMissions = localStorage.getItem(`daily-missions-${user?.id}`)
      if (savedMissions) {
        setDailyMissions(JSON.parse(savedMissions))
        return
      }
    }
    
    const roadmap = generateRoadmap()
    if (!roadmap || !roadmap.milestones || roadmap.milestones.length === 0) {
      // Fallback missions if no roadmap is available
      const fallbackMissions = [
        {
          id: 'mission-fallback-1',
          title: 'Complete your profile',
          description: 'Fill out your onboarding information to get personalized recommendations',
          xp: 25,
          completed: false,
          milestoneId: 1,
          beckyTip: 'Take your time to provide accurate information - this helps us create the best roadmap for you!',
          priority: 1
        },
        {
          id: 'mission-fallback-2',
          title: 'Explore the roadmap',
          description: 'Check out your personalized career roadmap',
          xp: 25,
          completed: false,
          milestoneId: 1,
          beckyTip: 'Your roadmap is customized based on your goals and experience level.',
          priority: 2
        },
        {
          id: 'mission-fallback-3',
          title: 'Set your first goal',
          description: 'Choose a specific milestone to focus on this week',
          xp: 30,
          completed: false,
          milestoneId: 1,
          beckyTip: 'Start with something achievable - small wins build momentum!',
          priority: 3
        }
      ]
      
      setDailyMissions(fallbackMissions)
      localStorage.setItem(`daily-missions-${user?.id}`, JSON.stringify(fallbackMissions))
      localStorage.setItem(`missions-generated-${user?.id}`, today)
      return
    }
    
    const currentMilestone = roadmap.milestones.find(m => m.status === 'in-progress') || roadmap.milestones[0]
    if (!currentMilestone || !currentMilestone.tasks) {
      setDailyMissions([])
      return
    }
    
    // Generate 2-3 prioritized daily missions from current milestone
    const availableTasks = currentMilestone.tasks.filter(task => {
      const taskKey = `task-completed-${user?.id}-${currentMilestone.id}-${task}`
      return !localStorage.getItem(taskKey)
    })
    
    const missions = availableTasks.slice(0, 3).map((task, index) => ({
      id: `mission-${Date.now()}-${index}`,
      title: task,
      description: `Complete: ${task}`,
      xp: 25 + (index * 5), // Slightly more XP for higher priority tasks
      completed: false,
      milestoneId: currentMilestone.id,
      beckyTip: getBeckyTip(task, currentMilestone.title),
      priority: index + 1
    }))
    
    // If we don't have enough tasks, add some general missions
    if (missions.length < 3) {
      const generalMissions = [
        {
          id: `mission-general-${Date.now()}`,
          title: 'Review your progress',
          description: 'Check your roadmap progress and plan tomorrow\'s tasks',
          xp: 20,
          completed: false,
          milestoneId: currentMilestone.id,
          beckyTip: 'Regular review helps you stay on track and celebrate small wins!',
          priority: missions.length + 1
        }
      ]
      missions.push(...generalMissions.slice(0, 3 - missions.length))
    }
    
    setDailyMissions(missions)
    localStorage.setItem(`daily-missions-${user?.id}`, JSON.stringify(missions))
    localStorage.setItem(`missions-generated-${user?.id}`, today)
  }

  const getBeckyTip = (task, milestoneTitle) => {
    const tips = {
      // Sales Foundation Tips
      'Complete sales fundamentals course': 'Start with the basics! This foundation will make everything else easier. Try 30-minute sessions to avoid overwhelm.',
      'Read 3 sales books': 'Choose books that match your learning style. Audiobooks count too! Start with "To Sell is Human" - it\'s perfect for beginners.',
      'Join 5 sales communities': 'Quality over quantity. Engage actively in 2-3 communities rather than lurking in 10. Ask questions and share insights!',
      'Practice elevator pitch': 'Record yourself and listen back. You\'ll be surprised what you catch! Practice in front of a mirror first.',
      'Research SDR role responsibilities': 'Look at actual job postings to understand what companies really want. Focus on the requirements section.',
      
      // Transferable Skills Tips
      'List 10 transferable skills': 'Think beyond obvious skills. Even organizing events counts as project management! Customer service = objection handling.',
      'Create skill mapping document': 'Use a spreadsheet to map your skills to sales competencies. Be specific about how each skill applies.',
      'Practice skill storytelling': 'Use the STAR method: Situation, Task, Action, Result. Keep stories under 2 minutes.',
      'Get feedback from sales professionals': 'Be specific in your questions. "How can I improve my pitch?" is better than "Any advice?"',
      'Update resume with sales focus': 'Use action verbs and quantify achievements when possible. "Increased customer satisfaction by 25%" sounds better than "helped customers".',
      
      // Networking Tips
      'Connect with 50+ sales professionals': 'Personalize each connection request. Mention something specific about their profile or company.',
      'Attend 3 sales events': 'Virtual events count! Come prepared with questions and follow up with new connections within 24 hours.',
      'Join sales communities': 'Start with LinkedIn groups and Slack communities. Introduce yourself and share your goals.',
      'Schedule 10 informational interviews': 'Keep interviews to 15-20 minutes. Have specific questions ready and always send a thank you note.',
      'Create networking tracker': 'Use a simple spreadsheet to track who you\'ve connected with and when to follow up.',
      
      // Tools & Technology Tips
      'Complete CRM certification': 'Start with free certifications like HubSpot Academy. They\'re recognized and comprehensive.',
      'Learn LinkedIn Sales Navigator': 'Practice with the free trial first. Focus on building lists and finding prospects.',
      'Practice with sales engagement tools': 'Many tools offer free trials. Try 2-3 to see which fits your style.',
      'Create tool proficiency list': 'Rate yourself 1-5 on each tool. Focus on getting to level 3-4 on your top 3 tools.',
      'Build sample sales sequences': 'Start with 3-5 touch points. Keep messages short and value-focused.',
      
      // Communication Tips
      'Practice cold calling': 'Start with friends and family. Record calls and review them for improvement areas.',
      'Master objection handling': 'Create a cheat sheet of common objections and your responses. Practice them out loud.',
      'Develop discovery questions': 'Focus on open-ended questions that start with "what", "how", and "why".',
      'Create sales scripts': 'Keep scripts conversational, not robotic. Practice until they feel natural.',
      'Record and analyze calls': 'Listen for tone, pace, and clarity. Note where you lose the prospect\'s attention.',
      
      // Portfolio Tips
      'Create 3 mock sales campaigns': 'Use real companies and scenarios. Include target personas and messaging.',
      'Write customer case studies': 'Even if fictional, make them realistic. Include metrics and outcomes.',
      'Document sales processes': 'Create step-by-step guides. Include best practices and common pitfalls.',
      'Build presentation portfolio': 'Include different types: product demos, discovery calls, closing presentations.',
      'Create sales metrics dashboard': 'Focus on key metrics like conversion rates, response rates, and pipeline velocity.',
      
      // Research Tips
      'Create list of 50 target companies': 'Mix company sizes and industries. Research their recent news and challenges.',
      'Research each company thoroughly': 'Look at their website, LinkedIn, recent news, and Glassdoor reviews.',
      'Identify key decision makers': 'Use LinkedIn Sales Navigator and company websites. Note their titles and backgrounds.',
      'Understand company challenges': 'Read their blog, press releases, and industry reports. Look for pain points.',
      'Prepare company-specific pitches': 'Customize your value proposition for each company\'s specific needs.',
      
      // Application Tips
      'Apply to 20 target companies': 'Quality over quantity. Customize each application with company-specific information.',
      'Write personalized cover letters': 'Mention specific things about the company. Show you\'ve done your research.',
      'Create follow-up sequences': 'Plan 3-5 touch points over 2-3 weeks. Mix email, LinkedIn, and phone.',
      'Request referrals from network': 'Be specific about the role and company. Make it easy for them to help you.',
      'Track application progress': 'Use a spreadsheet or CRM. Note dates, responses, and next steps.',
      
      // Interview Tips
      'Practice common sales questions': 'Focus on behavioral questions. Use the STAR method for all responses.',
      'Prepare STAR method stories': 'Have 5-7 stories ready. Practice telling them in under 2 minutes each.',
      'Mock interview practice': 'Practice with friends or record yourself. Focus on confidence and clarity.',
      'Research interview formats': 'Many sales interviews include role-plays. Practice common scenarios.',
      'Prepare questions for interviewers': 'Ask about their challenges, team culture, and growth opportunities.'
    }
    
    // Contextual tips based on milestone
    const milestoneTips = {
      'Build Sales Foundation': 'Start with the fundamentals - they\'re the building blocks of everything else!',
      'Develop Transferable Skills': 'Your previous experience is valuable. Think about how it applies to sales.',
      'Network with Sales Professionals': 'Networking is about building relationships, not just asking for jobs.',
      'Master Sales Tools & Technology': 'Tools are enablers, not replacements for good sales skills.',
      'Practice Sales Communication': 'Communication is a skill that improves with practice. Start small!',
      'Build Sales Portfolio': 'Your portfolio shows what you can do, not just what you know.',
      'Target & Research Companies': 'Research shows genuine interest and helps you stand out.',
      'Apply Strategically': 'Quality applications beat quantity every time.',
      'Ace Sales Interviews': 'Preparation builds confidence. Practice until it feels natural.'
    }
    
    return tips[task] || milestoneTips[milestoneTitle] || `Focus on this task for 15-20 minutes today. Small progress adds up!`
  }

  const loadUserProgress = () => {
    // Load user progress from localStorage or database
    const savedProgress = localStorage.getItem(`user-progress-${user.id}`)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setUserXP(progress.xp || 0)
      setStreak(progress.streak || 0)
      setCompletedTasks(progress.completedTasks || {})
    }
  }

  const completeMission = (missionId) => {
    const mission = dailyMissions.find(m => m.id === missionId)
    if (!mission) return
    
    // Update mission status immediately
    setDailyMissions(prev => prev.map(m => 
      m.id === missionId ? { ...m, completed: true } : m
    ))
    
    // Award XP immediately
    const newXP = userXP + mission.xp
    setUserXP(newXP)
    
    // Update streak
    const today = new Date().toDateString()
    const lastCompletion = localStorage.getItem(`last-completion-${user?.id}`)
    let newStreak = 1
    
    if (lastCompletion === today) {
      newStreak = streak + 1
    } else if (lastCompletion === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
      // Yesterday - continue streak
      newStreak = streak + 1
    } else {
      // Break in streak - reset to 1
      newStreak = 1
    }
    
    setStreak(newStreak)
    
    // Mark task as completed in milestone
    const taskKey = `task-completed-${user?.id}-${mission.milestoneId}-${mission.title}`
    localStorage.setItem(taskKey, 'true')
    
    // Save updated missions to localStorage
    const updatedMissions = dailyMissions.map(m => 
      m.id === missionId ? { ...m, completed: true } : m
    )
    localStorage.setItem(`daily-missions-${user?.id}`, JSON.stringify(updatedMissions))
    
    // Save progress
    const progress = {
      xp: newXP,
      streak: newStreak,
      completedTasks: { ...completedTasks, [missionId]: true }
    }
    
    localStorage.setItem(`user-progress-${user?.id}`, JSON.stringify(progress))
    localStorage.setItem(`last-completion-${user?.id}`, today)
    
    // Mission completed successfully
  }

  const openMilestoneModal = (milestone) => {
    const roadmap = generateRoadmap()
    
    // Check if this milestone is accessible (previous milestone is completed)
    const previousMilestone = roadmap.milestones.find(m => m.id === milestone.id - 1)
    
    if (milestone.id === 1 || (previousMilestone && previousMilestone.status === 'completed')) {
      // First milestone is always accessible, or previous milestone is completed
      setSelectedMilestone(milestone)
      setShowMilestoneModal(true)
    } else {
      // Show alert that previous milestone must be completed first
      alert(`You must complete the previous milestone before accessing "${milestone.title}"!`)
    }
  }

  const closeMilestoneModal = () => {
    setShowMilestoneModal(false)
    setSelectedMilestone(null)
  }

  const navigateToNextMilestone = (nextMilestoneId) => {
    const roadmap = generateRoadmap()
    const nextMilestone = roadmap.milestones.find(m => m.id === nextMilestoneId)
    
    if (nextMilestone) {
      // Check if current milestone is completed
      const currentMilestone = roadmap.milestones.find(m => m.id === selectedMilestone.id)
      if (currentMilestone && currentMilestone.status === 'completed') {
        setSelectedMilestone(nextMilestone)
        // Keep the modal open but show the next milestone
      } else {
        // Show alert that current milestone must be completed first
        alert('You must complete the current milestone before viewing the next one!')
      }
    } else {
      // If no next milestone, close the modal
      closeMilestoneModal()
    }
  }

  const markMilestoneComplete = (milestone) => {
    // Update the milestone status to completed
    const roadmap = generateRoadmap()
    const updatedMilestones = roadmap.milestones.map(m => 
      m.id === milestone.id ? { ...m, status: 'completed' } : m
    )
    
    // Update the roadmap with the new milestone status
    // In a real app, this would save to the database
    console.log('Milestone marked as complete:', milestone.title)
    
    // Update the selected milestone to show the new status
    setSelectedMilestone({ ...milestone, status: 'completed' })
    
    // Show success message
    alert(`Congratulations! You've completed "${milestone.title}"!`)
  }

  const exportMilestone = (milestone) => {
    // Create the content for export
    const exportContent = `
SDR ROADMAP - MILESTONE EXPORT
================================

MILESTONE: ${milestone.title}
Status: ${milestone.status}
Timeframe: ${milestone.timeframe}
XP: +${milestone.xp}
Estimated Time: ${milestone.estimatedTime || '4-6 hours'}
Difficulty: ${milestone.difficulty || 'Intermediate'}

WHY THIS MATTERS:
${milestone.whyItMatters}

EXAMPLES:
${milestone.examples.map(example => `• ${example}`).join('\n')}

KEY TASKS:
${milestone.tasks.map(task => `□ ${task}`).join('\n')}

RESOURCES:
${milestone.resources.map(resource => `• ${resource.type.toUpperCase()}: ${resource.name}${resource.duration ? ` (${resource.duration})` : ''}`).join('\n')}

PRO TIPS:
• Start Small: Focus on one task at a time. Don't try to complete everything at once.
• Time Management: Block 2-3 hours per week for this milestone. Consistency beats intensity.
• Get Support: Join our community to connect with others working on the same goals.

Generated on: ${new Date().toLocaleDateString()}
    `.trim()

    // Create and download the file
    const blob = new Blob([exportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `milestone-${milestone.id}-${milestone.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
                  navigate('/onboarding')
        return
        }
        throw error
      }

      // Check if onboarding is completed
      if (!data.onboarding_completed) {
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
    // Always generate a roadmap, even without profile data
    try {
      const roadmap = {
        currentLevel: profile ? getCurrentLevel(profile.current_position, profile.experience_years) : 'Entry Level',
        targetLevel: profile ? getTargetLevel(profile.career_goal) : 'SDR',
        milestones: generateMilestones(profile || {}),
        timeline: profile?.timeline || '1-year',
        skills: profile?.skills || [],
        recommendations: generateRecommendations(profile || {})
      }

      return roadmap
    } catch (error) {
      console.error('Error generating roadmap:', error)
      // Return a default roadmap even if there's an error
      return {
        currentLevel: 'Entry Level',
        targetLevel: 'SDR',
        milestones: generateMilestones({}),
        timeline: '1-year',
        skills: [],
        recommendations: generateRecommendations({})
      }
    }
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
    
    try {
      // Epic 3: Roadmap Engine v1 - 10-step roadmap for break-into-sales users
      // Always generate the advanced 10-step roadmap regardless of career goal
      const currentRole = profile.current_position || profile.currentRole || 'entry-level'
      const experienceYears = profile.experience_years || profile.experienceYears || '0-1'
      const personaOrder = getPersonaOrder(currentRole, experienceYears)
      
      const allSteps = [
        {
          id: 1,
          title: 'Build Sales Foundation',
          status: 'completed',
          timeframe: 'Week 1-2',
          description: 'Master the fundamentals of sales and understand what makes a successful SDR',
          whyItMatters: 'Sales is a skill that can be learned. Understanding the basics gives you confidence and credibility when applying for roles. This foundation will be your competitive advantage.',
          examples: ['Read "To Sell is Human" by Daniel Pink', 'Watch sales training videos', 'Join sales communities on LinkedIn'],
          tasks: [
            'Complete sales fundamentals course (2 hours)',
            'Read 3 essential sales books',
            'Join 5 active sales communities',
            'Practice elevator pitch 10 times',
            'Research SDR role responsibilities and metrics'
          ],
          resources: [
            { name: 'Sales Fundamentals Course', url: 'https://www.coursera.org/learn/sales-fundamentals', type: 'course', duration: '2 hours' },
            { name: 'To Sell is Human', url: 'https://www.amazon.com/Sell-Human-Surprising-Moving-Others/dp/1594631905', type: 'book', duration: '6 hours' },
            { name: 'SDR Role Guide', url: 'https://www.saleshacker.com/sdr-role/', type: 'article', duration: '15 min' },
            { name: 'Sales Psychology Basics', url: '#', type: 'video', duration: '45 min' }
          ],
          xp: 100,
          personaPriority: 1,
          estimatedTime: '8-10 hours',
          difficulty: 'Beginner',
          skills: ['Sales Fundamentals', 'Psychology', 'Communication']
        },
        {
          id: 2,
          title: 'Develop Transferable Skills',
          status: 'in-progress',
          timeframe: 'Week 2-3',
          description: 'Transform your existing experience into powerful sales assets',
          whyItMatters: 'Your previous experience is valuable! Customer service, communication, and problem-solving skills directly translate to sales success. This step helps you position yourself as a strong candidate.',
          examples: ['Customer service → objection handling', 'Teaching → presentation skills', 'Retail → relationship building'],
          tasks: [
            'Audit and list 15+ transferable skills',
            'Create detailed skill mapping document',
            'Practice skill storytelling with 3 people',
            'Get feedback from 2 sales professionals',
            'Rewrite resume with sales-focused language'
          ],
          resources: [
            { name: 'Transferable Skills Guide', url: 'https://www.linkedin.com/learning/transferable-skills', type: 'course', duration: '1.5 hours' },
            { name: 'Skill Mapping Template', url: '#', type: 'template', duration: '30 min' },
            { name: 'Resume Writing for Sales', url: 'https://www.saleshacker.com/sales-resume/', type: 'article', duration: '20 min' },
            { name: 'Storytelling for Sales', url: '#', type: 'video', duration: '1 hour' }
          ],
          xp: 150,
          personaPriority: 2,
          estimatedTime: '6-8 hours',
          difficulty: 'Beginner',
          skills: ['Self-Assessment', 'Storytelling', 'Resume Writing']
        },
        {
          id: 3,
          title: 'Network with Sales Professionals',
          status: 'pending',
          timeframe: 'Week 3-4',
          description: 'Build relationships with people in sales to learn and get referrals',
          whyItMatters: '80% of jobs are found through networking. Sales professionals can provide insights, referrals, and mentorship.',
          examples: ['Connect with 50 SDRs on LinkedIn', 'Attend sales meetups', 'Join sales Slack communities'],
          tasks: [
            'Connect with 50+ sales professionals',
            'Attend 3 sales events',
            'Join 5 sales communities',
            'Schedule 10 informational interviews',
            'Create networking tracker'
          ],
          resources: [
            { name: 'LinkedIn Networking Guide', url: 'https://www.linkedin.com/learning/linkedin-networking', type: 'course' },
            { name: 'Sales Meetups Directory', url: 'https://www.meetup.com/topics/sales/', type: 'directory' },
            { name: 'Informational Interview Script', url: '#', type: 'template' }
          ],
          xp: 200,
          personaPriority: 3
        },
        {
          id: 4,
          title: 'Master Sales Tools & Technology',
          status: 'pending',
          timeframe: 'Week 4-5',
          description: 'Learn the essential tools and technology used in modern sales',
          whyItMatters: 'Sales is increasingly technology-driven. Knowing the tools shows you can hit the ground running.',
          examples: ['CRM systems (Salesforce, HubSpot)', 'Sales engagement platforms', 'LinkedIn Sales Navigator'],
          tasks: [
            'Complete CRM certification',
            'Learn LinkedIn Sales Navigator',
            'Practice with sales engagement tools',
            'Create tool proficiency list',
            'Build sample sales sequences'
          ],
          resources: [
            { name: 'Salesforce Trailhead', url: 'https://trailhead.salesforce.com/', type: 'course' },
            { name: 'LinkedIn Sales Navigator', url: 'https://business.linkedin.com/sales-solutions/sales-navigator', type: 'tool' },
            { name: 'Sales Tool Directory', url: 'https://www.g2.com/categories/sales-intelligence', type: 'directory' }
          ],
          xp: 250,
          personaPriority: 4
        },
        {
          id: 5,
          title: 'Create Compelling Sales Materials',
          status: 'pending',
          timeframe: 'Week 5-6',
          description: 'Develop professional materials that showcase your sales potential',
          whyItMatters: 'Your materials are your first impression. Professional, sales-focused content demonstrates your commitment and understanding.',
          examples: ['Sales-focused resume', 'LinkedIn profile optimization', 'Portfolio of sales projects'],
          tasks: [
            'Rewrite resume for sales roles',
            'Optimize LinkedIn profile',
            'Create sales portfolio',
            'Write sample sales emails',
            'Prepare sales pitch deck'
          ],
          resources: [
            { name: 'Sales Resume Template', url: '#', type: 'template' },
            { name: 'LinkedIn Profile Optimization', url: 'https://www.linkedin.com/learning/linkedin-profile-optimization', type: 'course' },
            { name: 'Sales Email Templates', url: '#', type: 'template' }
          ],
          xp: 300,
          personaPriority: 5
        },
        {
          id: 6,
          title: 'Practice Sales Conversations',
          status: 'pending',
          timeframe: 'Week 6-7',
          description: 'Develop confidence and skills through regular sales practice',
          whyItMatters: 'Sales is a performance skill. Regular practice builds confidence and improves your ability to handle real situations.',
          examples: ['Role-play with friends', 'Practice cold calling', 'Record and review conversations'],
          tasks: [
            'Practice 20 sales conversations',
            'Record and review calls',
            'Role-play objection handling',
            'Practice discovery questions',
            'Get feedback from mentors'
          ],
          resources: [
            { name: 'Sales Conversation Practice', url: '#', type: 'course' },
            { name: 'Objection Handling Guide', url: '#', type: 'guide' },
            { name: 'Discovery Question Templates', url: '#', type: 'template' }
          ],
          xp: 350,
          personaPriority: 6
        },
        {
          id: 7,
          title: 'Build Sales Portfolio',
          status: 'pending',
          timeframe: 'Week 7-8',
          description: 'Create tangible evidence of your sales capabilities',
          whyItMatters: 'A portfolio demonstrates your skills and shows employers you\'re serious about sales.',
          examples: ['Mock sales campaigns', 'Customer case studies', 'Sales process documentation'],
          tasks: [
            'Create 3 mock sales campaigns',
            'Write customer case studies',
            'Document sales processes',
            'Build presentation portfolio',
            'Create sales metrics dashboard'
          ],
          resources: [
            { name: 'Portfolio Building Guide', url: '#', type: 'guide' },
            { name: 'Case Study Templates', url: '#', type: 'template' },
            { name: 'Sales Metrics Guide', url: '#', type: 'guide' }
          ],
          xp: 400,
          personaPriority: 7
        },
        {
          id: 8,
          title: 'Target & Research Companies',
          status: 'pending',
          timeframe: 'Week 8-9',
          description: 'Identify and research companies where you want to work',
          whyItMatters: 'Targeted applications are more effective than mass applications. Research shows genuine interest and preparation.',
          examples: ['Create target company list', 'Research company culture', 'Identify key decision makers'],
          tasks: [
            'Create list of 50 target companies',
            'Research each company thoroughly',
            'Identify key decision makers',
            'Understand company challenges',
            'Prepare company-specific pitches'
          ],
          resources: [
            { name: 'Company Research Template', url: '#', type: 'template' },
            { name: 'Decision Maker Research', url: '#', type: 'guide' },
            { name: 'Company Culture Research', url: '#', type: 'guide' }
          ],
          xp: 450,
          personaPriority: 8
        },
        {
          id: 9,
          title: 'Apply Strategically',
          status: 'pending',
          timeframe: 'Week 9-10',
          description: 'Apply to roles with personalized, strategic approaches',
          whyItMatters: 'Quality over quantity. Personalized applications show you\'ve done your homework and are genuinely interested.',
          examples: ['Personalized cover letters', 'Follow-up sequences', 'Referral requests'],
          tasks: [
            'Apply to 20 target companies',
            'Write personalized cover letters',
            'Create follow-up sequences',
            'Request referrals from network',
            'Track application progress'
          ],
          resources: [
            { name: 'Cover Letter Templates', url: '#', type: 'template' },
            { name: 'Follow-up Sequence Guide', url: '#', type: 'guide' },
            { name: 'Application Tracker', url: '#', type: 'tool' }
          ],
          xp: 500,
          personaPriority: 9
        },
        {
          id: 10,
          title: 'Ace Sales Interviews',
          status: 'pending',
          timeframe: 'Week 10-12',
          description: 'Prepare thoroughly for sales interviews and assessments',
          whyItMatters: 'Sales interviews often include role-plays and assessments. Preparation is key to demonstrating your skills.',
          examples: ['Practice common questions', 'Prepare STAR stories', 'Mock interview practice'],
          tasks: [
            'Practice common sales questions',
            'Prepare STAR method stories',
            'Mock interview practice',
            'Research interview formats',
            'Prepare questions for interviewers'
          ],
          resources: [
            { name: 'Sales Interview Guide', url: '#', type: 'guide' },
            { name: 'STAR Method Template', url: '#', type: 'template' },
            { name: 'Mock Interview Practice', url: '#', type: 'tool' }
          ],
          xp: 600,
          personaPriority: 10
        }
      ]
      
      // Sort by persona priority
      return allSteps.sort((a, b) => a.personaPriority - b.personaPriority)
    } catch (error) {
      console.error('Error generating milestones:', error)
      // Return the full advanced roadmap even if there's an error
      return [
        {
          id: 1,
          title: 'Build Sales Foundation',
          status: 'in-progress',
          timeframe: 'Week 1-2',
          description: 'Understand the fundamentals of sales and the SDR role',
          whyItMatters: 'Sales is a skill that can be learned. Understanding the basics gives you confidence and credibility when applying for roles.',
          examples: ['Read "To Sell is Human" by Daniel Pink', 'Watch sales training videos', 'Join sales communities on LinkedIn'],
          tasks: [
            'Complete sales fundamentals course',
            'Read 3 sales books',
            'Join 5 sales communities',
            'Practice elevator pitch',
            'Research SDR role responsibilities'
          ],
          resources: [
            { name: 'Sales Fundamentals Course', url: 'https://www.coursera.org/learn/sales-fundamentals', type: 'course' },
            { name: 'To Sell is Human', url: 'https://www.amazon.com/Sell-Human-Surprising-Moving-Others/dp/1594631905', type: 'book' },
            { name: 'SDR Role Guide', url: 'https://www.saleshacker.com/sdr-role/', type: 'article' }
          ],
          xp: 100,
          personaPriority: 1
        },
        {
          id: 2,
          title: 'Develop Transferable Skills',
          status: 'pending',
          timeframe: 'Week 2-3',
          description: 'Identify and leverage skills from your current role that apply to sales',
          whyItMatters: 'Your previous experience is valuable! Customer service, communication, and problem-solving skills directly translate to sales success.',
          examples: ['Customer service → objection handling', 'Teaching → presentation skills', 'Retail → relationship building'],
          tasks: [
            'List 10 transferable skills',
            'Create skill mapping document',
            'Practice skill storytelling',
            'Get feedback from sales professionals',
            'Update resume with sales focus'
          ],
          resources: [
            { name: 'Transferable Skills Guide', url: 'https://www.linkedin.com/learning/transferable-skills', type: 'course' },
            { name: 'Skill Mapping Template', url: '#', type: 'template' },
            { name: 'Resume Writing for Sales', url: 'https://www.saleshacker.com/sales-resume/', type: 'article' }
          ],
          xp: 150,
          personaPriority: 2
        },
        {
          id: 3,
          title: 'Network with Sales Professionals',
          status: 'pending',
          timeframe: 'Week 3-4',
          description: 'Build relationships with people in sales to learn and get referrals',
          whyItMatters: '80% of jobs are found through networking. Sales professionals can provide insights, referrals, and mentorship.',
          examples: ['Connect with 50 SDRs on LinkedIn', 'Attend sales meetups', 'Join sales Slack communities'],
          tasks: [
            'Connect with 50+ sales professionals',
            'Attend 3 sales events',
            'Join 5 sales communities',
            'Schedule 10 informational interviews',
            'Create networking tracker'
          ],
          resources: [
            { name: 'LinkedIn Networking Guide', url: 'https://www.linkedin.com/learning/linkedin-networking', type: 'course' },
            { name: 'Sales Meetups Directory', url: 'https://www.meetup.com/topics/sales/', type: 'directory' },
            { name: 'Informational Interview Script', url: '#', type: 'template' }
          ],
          xp: 200,
          personaPriority: 3
        }
      ]
    }
  }

  const getPersonaOrder = (currentRole, experienceYears) => {
    // Persona logic for break-into-sales users
    if (currentRole === 'retail' || currentRole === 'customer-service') {
      return 'customer-facing'
    } else if (currentRole === 'student' || experienceYears === '0-1') {
      return 'recent-grad'
    } else if (currentRole === 'support' || currentRole === 'admin') {
      return 'support-role'
    }
    return 'general'
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
            <SDRLogo size="small" showText={true} />
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
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FiUser />
              Overview
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
            <button
              className={`nav-item ${activeTab === 'linkedin-analysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('linkedin-analysis')}
            >
              <FiLinkedin />
              LinkedIn Analysis
            </button>
            <button
              className={`nav-item ${activeTab === 'training-camp' ? 'active' : ''}`}
              onClick={() => setActiveTab('training-camp')}
            >
              <FiBook />
              Training Camp
            </button>
            <button
              className={`nav-item ${activeTab === 'daily-missions' ? 'active' : ''}`}
              onClick={() => setActiveTab('daily-missions')}
            >
              <FiTarget />
              Daily Missions
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
                      {profile.linkedin_url && (
                        <p>
                          <strong>LinkedIn:</strong> 
                          <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="linkedin-link">
                            View Profile
                          </a>
                        </p>
                      )}
                     

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
              {/* XP and Progress Header */}
              <div className="roadmap-progress-header">
                <div className="xp-display">
                  <div className="xp-circle">
                    <span className="xp-number">{userXP}</span>
                    <span className="xp-label">XP</span>
                  </div>
                  <div className="streak-display">
                    <span className="streak-number">{streak}</span>
                    <span className="streak-label">Day Streak</span>
                  </div>
                </div>
                <div className="progress-summary">
                  <h2>Your Career Journey</h2>
                  <p>Level {Math.floor(userXP / 100) + 1} • {roadmap.milestones.filter(m => m.status === 'completed').length}/{roadmap.milestones.length} Milestones Complete</p>
                </div>
              </div>

              {/* Daily Missions Section */}
              <div className="daily-missions-section">
                <div className="missions-header">
                  <h3><FiTarget /> Today's Missions</h3>
                  <p>Complete these tasks to earn XP and advance your career</p>
                </div>
                <div className="missions-grid">
                                  {dailyMissions.map((mission) => (
                  <div key={mission.id} className={`mission-card ${mission.completed ? 'completed' : ''}`}>
                    <div className="mission-header">
                      <div className="mission-title-section">
                        <span className="mission-priority">#{mission.priority}</span>
                        <div className="mission-xp">+{mission.xp} XP</div>
                      </div>
                      <button 
                        className={`mission-complete-btn ${mission.completed ? 'completed' : ''}`}
                        onClick={() => !mission.completed && completeMission(mission.id)}
                        disabled={mission.completed}
                      >
                        {mission.completed ? <FiCheckCircle /> : <FiCheckCircle />}
                      </button>
                    </div>
                    <h4>{mission.title}</h4>
                    <p>{mission.description}</p>
                    <div className="becky-tip">
                      <span className="tip-icon">💡</span>
                      <span className="tip-text">
                        <strong>Becky Lite:</strong> {mission.beckyTip}
                      </span>
                    </div>
                  </div>
                ))}
                </div>
              </div>

              {/* Roadmap Timeline */}
              <div className="roadmap-timeline-section">
                <div className="timeline-header">
                  <h3><FiMap /> Your Personalized Career Roadmap</h3>
                  <p>Follow this proven 10-step path to break into tech sales and land your dream role</p>
                  <div className="roadmap-stats">
                    <div className="stat">
                      <span className="stat-number">{roadmap.milestones.length}</span>
                      <span className="stat-label">Total Steps</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{roadmap.milestones.reduce((sum, m) => sum + m.xp, 0)}</span>
                      <span className="stat-label">Total XP</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{roadmap.milestones.filter(m => m.status === 'completed').length}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                  </div>
                </div>
                
                                <div className="roadmap-timeline">
                  {roadmap.milestones && roadmap.milestones.length > 0 ? (
                    roadmap.milestones.map((milestone, index) => {
                      const previousMilestone = roadmap.milestones.find(m => m.id === milestone.id - 1)
                      const isAccessible = milestone.id === 1 || (previousMilestone && previousMilestone.status === 'completed')
                      
                      return (
                        <div key={milestone.id} className={`milestone ${milestone.status} ${!isAccessible ? 'locked' : ''}`}>
                          <div className="milestone-icon">
                            {milestone.status === 'completed' && <FiCheckCircle />}
                            {milestone.status === 'in-progress' && <FiClock />}
                            {milestone.status === 'pending' && <FiCalendar />}
                          </div>
                          <div className="milestone-content" onClick={() => openMilestoneModal(milestone)}>
                            <div className="milestone-header">
                              <h3>{milestone.title}</h3>
                              <div className="milestone-meta">
                                <span className="milestone-xp">+{milestone.xp} XP</span>
                                <span className="timeframe">{milestone.timeframe}</span>
                                <div className={`status-badge ${milestone.status}`}>
                                  {milestone.status.replace('-', ' ')}
                                </div>
                              </div>
                            </div>
                            
                            <p className="milestone-description">{milestone.description}</p>
                            
                            <div className="milestone-preview">
                              <div className="preview-tasks">
                                <span className="preview-label">Key Tasks:</span>
                                <span className="preview-text">{milestone.tasks.slice(0, 2).join(', ')}...</span>
                              </div>
                              <div className="preview-meta">
                                <div className="preview-resources">
                                  <span className="preview-label">Resources:</span>
                                  <span className="preview-text">{milestone.resources.length} available</span>
                                </div>
                                <div className="preview-time">
                                  <FiClock />
                                  <span>{milestone.estimatedTime || '4-6 hours'}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="milestone-cta">
                              <span className="cta-text">Click to view details</span>
                              <FiArrowRight />
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="no-milestones">
                      <p>No milestones available. Please complete your profile setup.</p>
                      <button onClick={() => navigate('/onboarding')} className="setup-profile-btn">
                        Complete Profile Setup
                      </button>
                    </div>
                  )}
                </div>
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
        
        {activeTab === 'linkedin-analysis' && (
          <div className="linkedin-analysis-tab">
            <LinkedInAnalysis />
          </div>
        )}

        {activeTab === 'training-camp' && (
          <div className="training-camp-tab">
            <TrainingCamp />
          </div>
        )}

        {activeTab === 'daily-missions' && (
          <div className="daily-missions-tab">
            <DailyMissions />
          </div>
        )}
        
       

        </div>
      </div>

      {/* Milestone Detail Modal */}
      {showMilestoneModal && selectedMilestone && (
        <div className="milestone-modal-overlay" onClick={closeMilestoneModal}>
          <div className="milestone-modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeMilestoneModal}>×</button>
            
            <div className="modal-header">
              <div className="milestone-modal-icon">
                {selectedMilestone.status === 'completed' && <FiCheckCircle />}
                {selectedMilestone.status === 'in-progress' && <FiClock />}
                {selectedMilestone.status === 'pending' && <FiCalendar />}
              </div>
              <h2>{selectedMilestone.title}</h2>
              <div className="modal-meta">
                <span className="modal-xp">+{selectedMilestone.xp} XP</span>
                <span className="modal-timeframe">{selectedMilestone.timeframe}</span>
                <div className={`modal-status-badge ${selectedMilestone.status}`}>
                  {selectedMilestone.status.replace('-', ' ')}
                </div>
              </div>
              <div className="modal-details">
                <div className="detail-item">
                  <FiClock />
                  <span>{selectedMilestone.estimatedTime || '4-6 hours'}</span>
                </div>
                <div className="detail-item">
                  <FiTrendingUp />
                  <span>{selectedMilestone.difficulty || 'Intermediate'}</span>
                </div>
                <div className="detail-item">
                  <FiTarget />
                  <span>{selectedMilestone.skills ? selectedMilestone.skills.slice(0, 2).join(', ') : 'Sales Skills'}</span>
                </div>
              </div>
            </div>

            <div className="modal-content">
              <div className="why-it-matters">
                <h3>Why This Matters</h3>
                <p>{selectedMilestone.whyItMatters}</p>
                <div className="examples">
                  <h4>Examples:</h4>
                  <ul>
                    {selectedMilestone.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="modal-tasks">
                <h3>Key Tasks</h3>
                <ul className="modal-tasks-list">
                  {selectedMilestone.tasks.map((task, index) => (
                    <li key={index} className="modal-task-item">
                      <span className="task-text">{task}</span>
                      <button className="task-checkbox">
                        <FiCheckCircle />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-resources">
                <h3>Resources</h3>
                <div className="modal-resources-grid">
                  {selectedMilestone.resources.map((resource, index) => (
                    <a 
                      key={index} 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="modal-resource-card"
                    >
                      <div className="resource-header">
                        <div className="resource-type">{resource.type}</div>
                        {resource.duration && (
                          <div className="resource-duration">
                            <FiClock />
                            <span>{resource.duration}</span>
                          </div>
                        )}
                      </div>
                      <h4>{resource.name}</h4>
                    </a>
                  ))}
                </div>
              </div>

              <div className="milestone-progress">
                <h3>Your Progress</h3>
                <div className="progress-circle">
                  <div className="progress-ring">
                    <div className="progress-text">
                      <span className="progress-percentage">
                        {selectedMilestone.status === 'completed' ? '100%' : selectedMilestone.status === 'in-progress' ? '50%' : '0%'}
                      </span>
                      <span className="progress-label">Complete</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="milestone-tips">
                <h3>Pro Tips</h3>
                <div className="tips-list">
                  <div className="tip-item">
                    <div className="tip-icon">
                      <FiStar />
                    </div>
                    <div className="tip-content">
                      <h4>Start Small</h4>
                      <p>Focus on one task at a time. Don't try to complete everything at once.</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <div className="tip-icon">
                      <FiClock />
                    </div>
                    <div className="tip-content">
                      <h4>Time Management</h4>
                      <p>Block 2-3 hours per week for this milestone. Consistency beats intensity.</p>
                    </div>
                  </div>
                  <div className="tip-item">
                    <div className="tip-icon">
                      <FiUsers />
                    </div>
                    <div className="tip-content">
                      <h4>Get Support</h4>
                      <p>Join our community to connect with others working on the same goals.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="milestone-next">
                <h3>What's Next</h3>
                {selectedMilestone.status === 'completed' ? (
                  <div className="next-milestone" onClick={() => navigateToNextMilestone(selectedMilestone.id + 1)}>
                    <div className="next-icon">
                      <FiArrowRight />
                    </div>
                    <div className="next-content">
                      <h4>Step {selectedMilestone.id + 1}</h4>
                      <p>Great job! Click here to continue to the next milestone.</p>
                    </div>
                  </div>
                ) : (
                  <div className="next-milestone locked">
                    <div className="next-icon">
                      <FiLock />
                    </div>
                    <div className="next-content">
                      <h4>Step {selectedMilestone.id + 1}</h4>
                      <p>Complete this milestone to unlock the next step.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="modal-action-btn primary"
                onClick={() => markMilestoneComplete(selectedMilestone)}
                disabled={selectedMilestone.status === 'completed'}
              >
                <FiEdit /> {selectedMilestone.status === 'completed' ? 'Completed!' : 'Mark as Complete'}
              </button>
              <button 
                className="modal-action-btn secondary"
                onClick={() => exportMilestone(selectedMilestone)}
              >
                <FiDownload /> Export This Step
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage