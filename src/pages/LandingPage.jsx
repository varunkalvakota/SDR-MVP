import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SupabaseSetup from '../components/SupabaseSetup'
import { LoginModal, SignupModal, ResetPasswordModal } from '../components/AuthModals'
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
  FiShield
} from 'react-icons/fi'
import './LandingPage.css'

const LandingPage = () => {
  const { user, signOut } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
  
  const isSupabaseConfigured = 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder' &&
    supabaseUrl.includes('supabase.co') && 
    supabaseAnonKey.length > 50

  return (
    <div className="landing-page">
      {!isSupabaseConfigured && <SupabaseSetup />}
      
      
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">S</span>
            <span className="logo-text">SDR Roadmap</span>
          </div>
          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button onClick={handleSignOut} className="nav-link logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={openLoginModal} className="nav-link">Login</button>
                <button onClick={openSignupModal} className="nav-link signup-btn">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-headline">
                Turn Career Confusion into a Clear, Winning Plan
              </h1>
              <p className="hero-subheadline">
                Step into your career simulation — guided by AI, proven by real success stories.
              </p>
              <button onClick={openSignupModal} className="hero-cta">
                Start My Free Career Plan
              </button>
            </div>
            <div className="hero-visual">
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
                    <span className="node-label">Career Plan</span>
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
        </section>

        {/* What It Is / Who It's For Section */}
        <section className="about-section">
          <div className="about-container">
            <div className="about-intro">
              <h2 className="section-title">What Is SDRroadmap?</h2>
              <p className="section-subtitle">
                SDRroadmap is a dynamic career operating system for SDRs and aspiring tech sales pros. 
                Think of it as a coach + GPS for your career.
              </p>
            </div>
            
            <div className="persona-cards">
              <div className="persona-card">
                <div className="persona-icon"><FiTrendingUp /></div>
                <h3 className="persona-title">SDRs Seeking Promotion</h3>
                <p className="persona-description">
                  Ready to level up from SDR to AE, team lead, or management? 
                  Get a clear roadmap with skill gaps and action steps.
                </p>
                <div className="progress-indicator">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '75%'}}></div>
                  </div>
                  <span className="progress-text">Career Advancement Track</span>
                </div>
              </div>
              
              <div className="persona-card">
                <div className="persona-icon"><FiArrowRight /></div>
                <h3 className="persona-title">SDRs Pivoting Roles</h3>
                <p className="persona-description">
                  Transitioning to customer success, marketing, or product? 
                  Navigate your pivot with confidence and strategic planning.
                </p>
                <div className="progress-indicator">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '60%'}}></div>
                  </div>
                  <span className="progress-text">Transition Track</span>
                </div>
              </div>
              
              <div className="persona-card">
                <div className="persona-icon"><FiUsers /></div>
                <h3 className="persona-title">Breaking Into Tech Sales</h3>
                <p className="persona-description">
                  Non-tech professionals ready to enter the high-growth world of tech sales. 
                  Start with a plan, not just applications.
                </p>
                <div className="progress-indicator">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '45%'}}></div>
                  </div>
                  <span className="progress-text">Entry Track</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It Works Section */}
        <section className="principles-section">
          <div className="principles-container">
            <h2 className="section-title">Why It Works</h2>
            <p className="section-subtitle">
              Built on proven principles that transform careers, not just resumes.
            </p>
            
            <div className="principles-grid">
              <div className="principle-card">
                <div className="principle-icon"><FiTarget /></div>
                <h3 className="principle-title">Begin With the End in Mind</h3>
                <p className="principle-description">
                  We start with your goal and reverse-engineer your path. 
                  No generic advice—just your personalized route to success.
                </p>
              </div>
              
              <div className="principle-card">
                <div className="principle-icon"><FiZap /></div>
                <h3 className="principle-title">Clarity Over Complexity</h3>
                <p className="principle-description">
                  No fluff. No overwhelming lists. Just clear, actionable steps 
                  that move you forward every single day.
                </p>
              </div>
              
              <div className="principle-card">
                <div className="principle-icon"><FiUser /></div>
                <h3 className="principle-title">Personal, Not Generic</h3>
                <p className="principle-description">
                  Your roadmap is unique to you—your background, goals, and timeline. 
                  Because one-size-fits-all doesn't fit anyone.
                </p>
              </div>
              
              <div className="principle-card">
                <div className="principle-icon"><FiTrendingUp /></div>
                <h3 className="principle-title">Progress-Driven Results</h3>
                <p className="principle-description">
                  Track your advancement with mission-based milestones. 
                  See your growth and stay motivated every step of the way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Proof / Credibility Section */}
        <section className="proof-section">
          <div className="proof-container">
            <h2 className="section-title">Real Results, Real People</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-number">87%</span>
                <span className="stat-label">Report clearer career direction within 2 weeks</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">3.2x</span>
                <span className="stat-label">Faster promotion rate compared to traditional methods</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">92%</span>
                <span className="stat-label">Would recommend to a colleague</span>
              </div>
            </div>
            
            <div className="testimonials">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "SDRroadmap turned my vague 'I want to be promoted' into a concrete 6-month plan. 
                  I hit AE in 4 months instead of wandering aimlessly for years."
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">S</div>
                  <div className="author-info">
                    <span className="author-name">Sarah Chen</span>
                    <span className="author-role">SDR → AE at Salesforce</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "The AI analysis was spot-on. It identified gaps I didn't even know I had and 
                  gave me a clear action plan to pivot from marketing to sales."
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">M</div>
                  <div className="author-info">
                    <span className="author-name">Marcus Johnson</span>
                    <span className="author-role">Marketing → SDR at HubSpot</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-content">
                  "Finally, a career tool that doesn't give me the same generic advice. 
                  My roadmap was actually tailored to my background and goals."
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">A</div>
                  <div className="author-info">
                    <span className="author-name">Alex Rivera</span>
                    <span className="author-role">Teacher → SDR at Zoom</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-it-works-section">
          <div className="how-it-works-container">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to your personalized career roadmap</p>
            
            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-icon"><FiClipboard /></div>
                  <h3 className="step-title">Tell Us About You</h3>
                  <p className="step-description">
                    Upload your resume and answer a few quick questions about your goals, 
                    timeline, and current situation. Takes less than 5 minutes.
                  </p>
                  <div className="step-features">
                    <span className="feature-tag">Resume Analysis</span>
                    <span className="feature-tag">Goal Setting</span>
                    <span className="feature-tag">Timeline Planning</span>
                  </div>
                </div>
              </div>
              
              <div className="step-connector"><FiArrowRight /></div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-icon"><FiCpu /></div>
                  <h3 className="step-title">Meet Becky</h3>
                  <p className="step-description">
                    Your AI career coach analyzes your background, identifies skill gaps, 
                    and creates a personalized strategy based on thousands of successful career paths.
                  </p>
                  <div className="step-features">
                    <span className="feature-tag">AI Analysis</span>
                    <span className="feature-tag">Skill Gap ID</span>
                    <span className="feature-tag">Strategy Creation</span>
                  </div>
                </div>
              </div>
              
              <div className="step-connector"><FiArrowRight /></div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-icon"><FiMap /></div>
                  <h3 className="step-title">Get Your Roadmap</h3>
                  <p className="step-description">
                    Follow mission-based steps toward your goal. Track progress, 
                    unlock achievements, and adjust your path as you grow.
                  </p>
                  <div className="step-features">
                    <span className="feature-tag">Mission Steps</span>
                    <span className="feature-tag">Progress Tracking</span>
                    <span className="feature-tag">Achievement System</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="final-cta-section">
          <div className="final-cta-container">
            <div className="cta-content">
              <h2 className="cta-headline">
                Start Your Free Plan Now
              </h2>
              <p className="cta-subheadline">
                Get your first roadmap on us. No credit card required. 
                See results in your first week.
              </p>
              <div className="cta-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon"><FiCheckCircle /></span>
                  <span>Personalized career roadmap in minutes</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon"><FiCheckCircle /></span>
                  <span>AI-powered skill gap analysis</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon"><FiCheckCircle /></span>
                  <span>Mission-based action steps</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon"><FiCheckCircle /></span>
                  <span>Progress tracking and achievements</span>
                </div>
              </div>
              <button onClick={openSignupModal} className="final-cta-button">
                Start My Free Career Plan
              </button>
              <p className="cta-guarantee">
                <FiShield /> Free forever plan • No spam • Trusted by 1000+ professionals
              </p>
            </div>
            <div className="cta-visual">
              <div className="dashboard-preview">
                <div className="preview-header">
                  <div className="preview-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="preview-title">Your Career Dashboard</span>
                </div>
                <div className="preview-content">
                  <div className="preview-mission">
                    <span className="mission-status"><FiTarget /></span>
                    <div className="mission-info">
                      <span className="mission-title">Current Mission: Network with 5 AEs</span>
                      <div className="mission-progress">
                        <div className="mission-bar">
                          <div className="mission-fill" style={{width: '60%'}}></div>
                        </div>
                        <span className="mission-text">3/5 Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className="preview-stats">
                    <div className="preview-stat">
                      <span className="stat-value">87%</span>
                      <span className="stat-name">Progress</span>
                    </div>
                    <div className="preview-stat">
                      <span className="stat-value">12</span>
                      <span className="stat-name">Missions</span>
                    </div>
                    <div className="preview-stat">
                      <span className="stat-value">4</span>
                      <span className="stat-name">Badges</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeModals}
        onSwitchToSignup={openSignupModal}
        onSwitchToReset={openResetModal}
      />
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
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