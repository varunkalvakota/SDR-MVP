import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { emailService } from '../lib/emailService'
import { LoginModal, SignupModal, ResetPasswordModal } from '../components/AuthModals'
import BeckyLogo from '../components/BeckyLogo'
import { 
  FiFileText, 
  FiCpu, 
  FiTarget, 
  FiZap, 
  FiUser, 
  FiTrendingUp, 
  FiCheckCircle,
  FiUpload,
  FiUsers,
  FiArrowRight,
  FiMap,
  FiClipboard,
  FiShield,
  FiMenu,
  FiX,
  FiStar,
  FiCalendar,
  FiAward,
  FiBarChart,
  FiMessageSquare,
  FiCheck,
  FiArrowUpRight,
  FiHeart,
  FiEye,
  FiThumbsUp,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiClock,
  FiBookOpen,
} from 'react-icons/fi'
import './LandingPage.css'

const LandingPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [shouldCheckOnboarding, setShouldCheckOnboarding] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle navigation from LinkedIn analysis results page
  useEffect(() => {
    if (location.state?.openSignupModal) {
      setIsSignupModalOpen(true)
      // Clear the state to prevent reopening on refresh
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate, location.pathname])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const openLoginModal = () => {
    setIsSignupModalOpen(false)
    setIsResetModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const openSignupModal = () => {
    setIsLoginModalOpen(false)
    setIsResetModalOpen(false)
    setIsSignupModalOpen(true)
  }

  const openResetModal = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(false)
    setIsResetModalOpen(true)
  }

  const closeModals = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(false)
    setIsResetModalOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const checkOnboardingStatus = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking onboarding status:', error)
        return
      }
      
      if (!data || !data.onboarding_completed) {
        navigate('/onboarding')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      navigate('/onboarding')
    }
  }

  const handleLoginSuccess = () => {
    closeModals()
    setShouldCheckOnboarding(true)
  }

  useEffect(() => {
    if (user && shouldCheckOnboarding) {
      checkOnboardingStatus()
      setShouldCheckOnboarding(false)
    }
  }, [user, shouldCheckOnboarding])

  const startOnboarding = () => {
    if (!user) {
      openSignupModal()
    } else {
      checkOnboardingStatus()
    }
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }


  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={scrollToTop}>
            <BeckyLogo size="small" animated={false} />
            <span className="logo-text">SDR Roadmap</span>
          </div>
          
          <div className="nav-links">
            <button onClick={() => scrollToSection('courses')} className="nav-link">Courses</button>
            <Link to="/linkedin-analysis" className="nav-link">LinkedIn Analysis</Link>
            <a href="#pricing" className="nav-link">Pricing</a>
            <button onClick={() => scrollToSection('how-it-works')} className="nav-link">About</button>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={handleSignOut} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={openLoginModal} className="nav-link login-btn">Login</button>
                <button onClick={openSignupModal} className="nav-link signup-btn">Sign Up</button>
              </>
            )}
          </div>

          <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-links">
            <button onClick={() => { scrollToSection('courses'); closeMobileMenu(); }} className="mobile-nav-link">Courses</button>
            <Link to="/linkedin-analysis" onClick={closeMobileMenu} className="mobile-nav-link">LinkedIn Analysis</Link>
            <a href="#pricing" onClick={closeMobileMenu} className="mobile-nav-link">Pricing</a>
            <button onClick={() => { scrollToSection('how-it-works'); closeMobileMenu(); }} className="mobile-nav-link">About</button>
            <a href="#contact" onClick={closeMobileMenu} className="mobile-nav-link">Contact</a>
          </div>
          
          <div className="mobile-menu-actions">
            {user ? (
              <>
                <Link to="/dashboard" onClick={closeMobileMenu} className="mobile-nav-link">Dashboard</Link>
                <button onClick={() => { handleSignOut(); closeMobileMenu(); }} className="mobile-nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { openLoginModal(); closeMobileMenu(); }} className="mobile-nav-link login-btn">Login</button>
                <button onClick={() => { openSignupModal(); closeMobileMenu(); }} className="mobile-nav-link signup-btn">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section - Enhanced with Visual Process */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <FiStar className="badge-icon" />
                <span>Trusted by 1,000+ SDRs</span>
              </div>
              
              <h1 className="hero-headline">
                Turn Career Confusion into a<br />
                Clear, Winning Plan<br />
                <span className="hero-highlight">Close More Deals.</span>
              </h1>
              
              <p className="hero-subheadline">
                Step into your career simulation — guided by AI, proven by real success stories.
              </p>
              
              <div className="hero-cta-group">
                <button onClick={startOnboarding} className="hero-cta primary">
                  Start My Free Career Plan
                </button>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-image-container">
                <div className="career-map">
                  <div className="map-nodes">
                    <div className="map-node active">
                      <span className="node-icon"><FiUpload /></span>
                      <span className="node-label">Resume Upload</span>
                    </div>
                    <div className="map-path"></div>
                    <div className="map-node">
                      <span className="node-icon"><FiCpu /></span>
                      <span className="node-label">AI Analysis</span>
                    </div>
                    <div className="map-path"></div>
                    <div className="map-node">
                      <span className="node-icon"><FiTarget /></span>
                      <span className="node-label">Roadmap</span>
                    </div>
                  </div>
                  <div className="success-indicator">
                    <div className="success-stat">
                      <span className="stat-number">87%</span>
                      <span className="stat-label">Success Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Cards Section - Enhanced */}
        <section id="courses" className="courses-section">
          <div className="courses-container">
            <div className="section-header">
              <h2 className="section-title">Master Tech Sales with Proven Programs</h2>
              <p className="section-subtitle">Choose your path to success with our comprehensive training programs</p>
            </div>
            
            <div className="course-grid">
              {/* Tech Sales Badge */}
              <div className="course-card featured">
                <div className="course-badge">Most Popular</div>
                <div className="course-header">
                  <div className="course-icon">
                    <FiTarget />
                  </div>
                  <h3 className="course-title">Break Into Tech Sales</h3>
                  <p className="course-description">Break into tech sales & build a $100K+ career from scratch, regardless of your previous knowledge or experience.</p>
                </div>
                <div className="course-features">
                  <div className="feature-item">
                    <FiCheck />
                    <span>Resume & LinkedIn Optimization</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Interview Prep & Mock Calls</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Cold Email Templates</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Job Search Strategy</span>
                  </div>
                </div>
                <div className="course-meta">
                  <div className="course-duration">
                    <FiClock />
                    <span>6 Weeks</span>
                  </div>
                </div>
                <button onClick={startOnboarding} className="course-button">
                  Get Started Free
                </button>
              </div>

              {/* SDR to AE Accelerator */}
              <div className="course-card">
                <div className="course-header">
                  <div className="course-icon">
                    <FiTrendingUp />
                  </div>
                  <h3 className="course-title">SDR To AE Accelerator</h3>
                  <p className="course-description">Become a top-performing SDR & get promoted into a $150-$200K+ AE job by leveraging proven systems.</p>
                </div>
                <div className="course-features">
                  <div className="feature-item">
                    <FiCheck />
                    <span>Performance Optimization</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Promotion Strategy</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>AE Skill Development</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Leadership Training</span>
                  </div>
                </div>
                <div className="course-meta">
                  <div className="course-duration">
                    <FiClock />
                    <span>6 Weeks</span>
                  </div>
                </div>
                <button onClick={startOnboarding} className="course-button">
                  Enroll Now
                </button>
              </div>

              {/* AE Mastery */}
              <div className="course-card">
                <div className="course-header">
                  <div className="course-icon">
                    <FiAward />
                  </div>
                  <h3 className="course-title">AE Mastery</h3>
                  <p className="course-description">Scale your AE career to new levels by setting a new standard of excellence at your company & becoming #1.</p>
                </div>
                <div className="course-features">
                  <div className="feature-item">
                    <FiCheck />
                    <span>Advanced Closing Techniques</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Pipeline Management</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Deal Strategy & Negotiation</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Team Leadership Skills</span>
                  </div>
                </div>
                <div className="course-meta">
                  <div className="course-duration">
                    <FiClock />
                    <span>6 Weeks</span>
                  </div>
                </div>
                <button onClick={startOnboarding} className="course-button">
                  Enroll Now
                </button>
              </div>

              {/* Cold Calling */}
              <div className="course-card">
                <div className="course-header">
                  <div className="course-icon">
                    <FiPhone />
                  </div>
                  <h3 className="course-title">Cold Call Mastery</h3>
                  <p className="course-description">Master cold-calling. Go from hesitant to high-performer on every cold call.</p>
                </div>
                <div className="course-features">
                  <div className="feature-item">
                    <FiCheck />
                    <span>Opening Scripts & Hooks</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Objection Handling</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Call Flow Optimization</span>
                  </div>
                  <div className="feature-item">
                    <FiCheck />
                    <span>Performance Tracking</span>
                  </div>
                </div>
                <div className="course-meta">
                  <div className="course-duration">
                    <FiClock />
                    <span>4 Weeks</span>
                  </div>
                </div>
                <button onClick={startOnboarding} className="course-button">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </section>


        {/* Enhanced Testimonials Section */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="section-header">
              <h2 className="section-title">Real Results, Real People</h2>
              <p className="section-subtitle">Join thousands of SDRs who've transformed their careers</p>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card featured">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">S</div>
                  <div className="testimonial-info">
                    <h4>Sarah Chen</h4>
                    <p>SDR → AE at Salesforce</p>
                    <div className="testimonial-rating">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"SDR Roadmap gave me the clarity, structure, and preparation I needed to land a $106K+ SDR role at Rippling. I knew where I wanted to go, and this program made sure I got there faster and with more confidence than I could have on my own."</p>
                </div>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">4</span>
                    <span className="metric-label">Months to AE</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">$150K</span>
                    <span className="metric-label">New Salary</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">M</div>
                  <div className="testimonial-info">
                    <h4>Marcus Johnson</h4>
                    <p>Marketing → SDR at HubSpot</p>
                    <div className="testimonial-rating">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"I went from a recent grad with no sales background to landing an SDR role at Deel—one of the fastest-growing tech companies. SDR Roadmap didn't just help me get hired, it helped me compete like a top performer."</p>
                </div>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">6</span>
                    <span className="metric-label">Weeks to SDR</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">$85K</span>
                    <span className="metric-label">Starting Salary</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">A</div>
                  <div className="testimonial-info">
                    <h4>Alex Rivera</h4>
                    <p>Teacher → SDR at Zoom</p>
                    <div className="testimonial-rating">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"The course gave me the exact wording, structure, and story I needed to stand out. From interview prep to cold email templates and follow-up strategies, every detail was covered."</p>
                </div>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">8</span>
                    <span className="metric-label">Weeks to SDR</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">$78K</span>
                    <span className="metric-label">Starting Salary</span>
                  </div>
                </div>
              </div>
              
                            <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">D</div>
                  <div className="testimonial-info">
                    <h4>David Kim</h4>
                    <p>SDR at HubSpot</p>
                    <div className="testimonial-rating">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"By my third month in seat, I was already hitting 180%—and now I'm at 200% of quota, thanks to everything I applied from the SDR Accelerator."</p>
                </div>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">200%</span>
                    <span className="metric-label">Quota Achievement</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">3</span>
                    <span className="metric-label">Months to Success</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">E</div>
                  <div className="testimonial-info">
                    <h4>Emily Rodriguez</h4>
                    <p>AE at Zoom</p>
                    <div className="testimonial-rating">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"The program taught me to think like a business owner—owning my process, understanding my product, and adapting my messaging based on who I was talking to."</p>
                </div>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">12</span>
                    <span className="metric-label">Months to AE</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">$120K</span>
                    <span className="metric-label">AE Salary</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">M</div>
                  <div className="testimonial-info">
                    <h4>Michael Chen</h4>
                    <p>SDR at HiBob</p>
                    <div className="testimonial-rating">
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                      <FiStar />
                    </div>
                  </div>
                </div>
                <div className="testimonial-content">
                  <p>"SDR Roadmap helped me make the leap into one of the most competitive and resilient industries. I beat out over 400 applicants and landed an amazing role."</p>
                </div>
                <div className="testimonial-metrics">
                  <div className="metric">
                    <span className="metric-value">400+</span>
                    <span className="metric-label">Applicants Beat</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">$82K</span>
                    <span className="metric-label">Starting Salary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="social-proof-section">
          <div className="social-proof-container">
            <h2 className="section-title">Trusted by 1,000+ SDRs</h2>
            <div className="proof-stats">
              <div className="stat-item">
                <div className="stat-number">87%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3.2x</div>
                <div className="stat-label">Faster Promotion</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">92%</div>
                <div className="stat-label">Would Recommend</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">$150K+</div>
                <div className="stat-label">Average Salary</div>
              </div>
            </div>
          </div>
        </section>

        {/* Skill Accelerators Section */}
        <section className="accelerators-section">
          <div className="accelerators-container">
            <div className="section-header">
              <h2 className="section-title">Skill Accelerators</h2>
              <p className="section-subtitle">Master the specific skills that will accelerate your career growth</p>
            </div>
            <div className="accelerators-grid">
              <div className="accelerator-card">
                <div className="accelerator-icon">
                  <FiPhone />
                </div>
                <h3>Cold Calling</h3>
                <h4>Cold Call Mastery</h4>
                <p>Master cold-calling. Go from hesitant to high-performer on every cold call.</p>
                <div className="accelerator-meta">
                  <span className="duration">4 Weeks</span>
                </div>
              </div>
              
              <div className="accelerator-card">
                <div className="accelerator-icon">
                  <FiMail />
                </div>
                <h3>Cold Email Engine</h3>
                <h4>Master cold-emailing</h4>
                <p>Build a repeatable system that consistently books qualified meetings on autopilot.</p>
                <div className="accelerator-meta">
                  <span className="duration">4 Weeks</span>
                </div>
              </div>
              
              <div className="accelerator-card">
                <div className="accelerator-icon">
                  <FiCpu />
                </div>
                <h3>AI Sales Accelerator</h3>
                <h4>Learn AI-powered sales</h4>
                <p>Learn how the top 0.1% of reps at elite sales orgs use AI to move faster, write better, and close more.</p>
                <div className="accelerator-meta">
                  <span className="duration">6 Weeks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="features-container">
            <div className="section-header">
              <h2 className="section-title">Why SDR Roadmap Works</h2>
              <p className="section-subtitle">Built on proven principles that transform careers, not just resumes</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FiTarget />
                </div>
                <h3>Proven Frameworks</h3>
                <p>Battle-tested strategies from top performers at companies like Salesforce, HubSpot, and Zoom.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FiUsers />
                </div>
                <h3>Community Support</h3>
                <p>Join 1,000+ SDRs in our private community for networking, support, and accountability.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FiZap />
                </div>
                <h3>Fast Results</h3>
                <p>See results in your first week. Most students land interviews within 2-4 weeks.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FiShield />
                </div>
                <h3>Money-Back Guarantee</h3>
                <p>14-day 100% money-back guarantee. We only win when you win.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="how-it-works-container">
            <div className="section-header">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">Three simple steps to your personalized career roadmap</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">
                  <FiFileText />
                </div>
                <h3>Tell Us About You</h3>
                <p>Upload your resume and answer a few quick questions about your goals, timeline, and current situation. Takes less than 5 minutes.</p>
                <div className="step-tags">
                  <span className="step-tag">Resume Analysis</span>
                  <span className="step-tag">Goal Setting</span>
                  <span className="step-tag">Timeline Planning</span>
                </div>
              </div>
              
              <div className="step-arrow">
                <FiArrowRight />
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon becky-step-icon">
                  <BeckyLogo size="medium" animated={true} />
                </div>
                <h3>Meet Becky</h3>
                <p>Your AI career coach analyzes your background, identifies skill gaps, and creates a personalized strategy based on thousands of successful career paths.</p>
                <div className="step-tags">
                  <span className="step-tag">AI Analysis</span>
                  <span className="step-tag">Skill Gap ID</span>
                  <span className="step-tag">Strategy Creation</span>
                </div>
              </div>
              
              <div className="step-arrow">
                <FiArrowRight />
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">
                  <FiMap />
                </div>
                <h3>Get Your Roadmap</h3>
                <p>Follow mission-based steps toward your goal. Track progress, unlock achievements, and adjust your path as you grow.</p>
                <div className="step-tags">
                  <span className="step-tag">Mission Steps</span>
                  <span className="step-tag">Progress Tracking</span>
                  <span className="step-tag">Achievement System</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <div className="pricing-container">
            <div className="section-header">
              <h2 className="section-title">Simple, Transparent Pricing</h2>
              <p className="section-subtitle">Start free, upgrade when you're ready to accelerate</p>
            </div>
            
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Free</h3>
                  <div className="pricing-price">$0<span className="pricing-period">/forever</span></div>
                </div>
                <ul className="pricing-features">
                  <li><FiCheck /> Basic career assessment</li>
                  <li><FiCheck /> 3 role recommendations</li>
                  <li><FiCheck /> 5-step starter roadmap</li>
                  <li><FiCheck /> Community access</li>
                </ul>
                <button onClick={startOnboarding} className="pricing-button">
                  Get Started Free
                </button>
              </div>
              
              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <div className="pricing-header">
                  <h3>Pro</h3>
                  <div className="pricing-price">$19<span className="pricing-period">/month</span></div>
                </div>
                <ul className="pricing-features">
                  <li><FiCheck /> Everything in Free</li>
                  <li><FiCheck /> Detailed 20+ step roadmap</li>
                  <li><FiCheck /> Weekly coaching sessions</li>
                  <li><FiCheck /> Resume optimization</li>
                  <li><FiCheck /> Progress tracking</li>
                  <li><FiCheck /> Priority support</li>
                </ul>
                <button onClick={startOnboarding} className="pricing-button">
                  Start 7-Day Free Trial
                </button>
              </div>
              
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3>Enterprise</h3>
                  <div className="pricing-price">$99<span className="pricing-period">/month</span></div>
                </div>
                <ul className="pricing-features">
                  <li><FiCheck /> Everything in Pro</li>
                  <li><FiCheck /> 1-on-1 expert calls</li>
                  <li><FiCheck /> Priority support</li>
                  <li><FiCheck /> Custom integrations</li>
                  <li><FiCheck /> Team management</li>
                  <li><FiCheck /> Advanced analytics</li>
                </ul>
                <button onClick={startOnboarding} className="pricing-button">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-container">
            <div className="section-header">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Everything you need to know about SDR Roadmap</p>
            </div>
            <div className="faq-grid">
              <div className="faq-item">
                <h3>How long does it take to see results?</h3>
                <p>Most students start seeing results within their first week. Many land interviews within 2-4 weeks and secure offers within 6-8 weeks.</p>
              </div>
              
              <div className="faq-item">
                <h3>What if I have no sales experience?</h3>
                <p>Perfect! Our program is designed specifically for people with no sales background. We'll teach you everything from the ground up.</p>
              </div>
              
              <div className="faq-item">
                <h3>Is there a money-back guarantee?</h3>
                <p>Yes! We offer a 14-day 100% money-back guarantee. If you complete the training and don't see results, we'll refund your money.</p>
              </div>
              
              <div className="faq-item">
                <h3>What companies do your students work at?</h3>
                <p>Our students work at top tech companies including Salesforce, HubSpot, Zoom, Stripe, Notion, Asana, and many more.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="final-cta-container">
            <h2 className="cta-headline">Ready to Transform Your Career?</h2>
            <p className="cta-subheadline">
              Join thousands of SDRs who've already accelerated their careers with our proven system. Start your free career plan today!
            </p>
            <div className="cta-benefits">
              <div className="benefit-item">
                <FiCheckCircle />
                <span>Free career assessment</span>
              </div>
              <div className="benefit-item">
                <FiCheckCircle />
                <span>Personalized roadmap</span>
              </div>
              <div className="benefit-item">
                <FiCheckCircle />
                <span>Community access</span>
              </div>
            </div>
            <button onClick={startOnboarding} className="final-cta-button">
              Start My Free Career Plan
            </button>
            <p className="cta-guarantee">
              <FiShield /> 14-day money-back guarantee • No credit card required
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">SDR Roadmap</div>
            <div className="footer-copyright">© 2025 SDR Roadmap. All rights reserved.</div>
          </div>
          
          <div className="footer-right">
            <div className="footer-column">
              <h4 className="footer-heading">For individuals</h4>
              <ul className="footer-links">
                <li><a href="#courses" className="footer-link">Tech Sales Badge</a></li>
                <li><a href="#courses" className="footer-link">SDR Accelerator</a></li>
                <li><a href="#courses" className="footer-link">AE Mastery</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Skill Accelerators</h4>
              <ul className="footer-links">
                <li><a href="#accelerators" className="footer-link">Cold Calling</a></li>
                <li><a href="#accelerators" className="footer-link">Cold Email Engine</a></li>
                <li><a href="#accelerators" className="footer-link">AI Sales Accelerator</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#blog" className="footer-link">Blog</a></li>
                <li><a href="#podcast" className="footer-link">Podcast</a></li>
                <li><a href="#youtube" className="footer-link">YouTube</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#contact" className="footer-link">Contact</a></li>
                <li><a href="#privacy" className="footer-link">Privacy policy</a></li>
                <li><a href="#terms" className="footer-link">Terms of service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeModals}
        onSwitchToSignup={openSignupModal}
        onSwitchToReset={openResetModal}
        onLoginSuccess={handleLoginSuccess}
      />
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
        prefillData={location.state?.prefillData}
      />
      <ResetPasswordModal
        isOpen={isResetModalOpen}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
      />
    </div>
  )
}

export default LandingPage