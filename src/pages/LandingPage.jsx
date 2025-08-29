import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
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
  FiShield,
  FiMenu,
  FiX
} from 'react-icons/fi'
import './LandingPage.css'

const LandingPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [shouldCheckOnboarding, setShouldCheckOnboarding] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        // PGRST116 is "not found" error, which means user has no profile yet
        console.error('Error checking onboarding status:', error)
        return
      }
      
      // If user has no profile or hasn't completed onboarding, redirect to onboarding
      if (!data || !data.onboarding_completed) {
        navigate('/onboarding')
      } else {
        // User has completed onboarding, redirect to dashboard
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      // Default to onboarding if there's an error
      navigate('/onboarding')
    }
  }

  const handleLoginSuccess = () => {
    closeModals()
    // Set flag to check onboarding status when user state updates
    setShouldCheckOnboarding(true)
  }

  // Check onboarding status when user logs in
  useEffect(() => {
    if (user && shouldCheckOnboarding) {
      checkOnboardingStatus()
      setShouldCheckOnboarding(false)
    }
  }, [user, shouldCheckOnboarding])

  const startOnboarding = () => {
    if (!user) {
      // If user is not authenticated, open signup modal
      openSignupModal()
    } else {
      // If user is authenticated, check if they need onboarding
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
      
      
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={scrollToTop}>
            <span className="logo-icon">S</span>
            <span className="logo-text">SDR Roadmap</span>
          </div>
          
          <div className="nav-links">
            <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
            <a href="#pricing" className="nav-link">Pricing</a>
            <button onClick={() => scrollToSection('about')} className="nav-link">About</button>
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
            <button onClick={() => { scrollToSection('features'); closeMobileMenu(); }} className="mobile-nav-link">Features</button>
            <a href="#pricing" onClick={closeMobileMenu} className="mobile-nav-link">Pricing</a>
            <button onClick={() => { scrollToSection('about'); closeMobileMenu(); }} className="mobile-nav-link">About</button>
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
              <button onClick={startOnboarding} className="hero-cta">
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
        <section id="about" className="about-section">
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
        <section id="features" className="how-it-works-section">
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

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <div className="pricing-container">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Start free, upgrade when you're ready to accelerate.</p>
            
            <div className="pricing-grid">
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3 className="pricing-title">Free</h3>
                  <div className="pricing-price">$0<span className="pricing-period">/forever</span></div>
                </div>
                <ul className="pricing-features">
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Basic career assessment</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>3 role recommendations</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>5-step starter roadmap</span>
                  </li>
                </ul>
                <button onClick={startOnboarding} className="pricing-button free-button">
                  Get Started Free
                </button>
              </div>
              
              <div className="pricing-card popular">
                <div className="popular-badge">Most Popular</div>
                <div className="pricing-header">
                  <h3 className="pricing-title">Pro</h3>
                  <div className="pricing-price">$19<span className="pricing-period">/month</span></div>
                </div>
                <ul className="pricing-features">
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Everything in Free</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Detailed 20+ step roadmap</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Weekly coaching with Becky</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Resume optimization</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Progress tracking</span>
                  </li>
                </ul>
                <button onClick={startOnboarding} className="pricing-button pro-button">
                  Start 7-Day Free Trial
                </button>
              </div>
              
              <div className="pricing-card">
                <div className="pricing-header">
                  <h3 className="pricing-title">Enterprise</h3>
                  <div className="pricing-price">$99<span className="pricing-period">/month</span></div>
                </div>
                <ul className="pricing-features">
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Everything in Pro</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>1-on-1 expert calls</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Priority support</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Custom integrations</span>
                  </li>
                  <li className="pricing-feature">
                    <span className="feature-icon"><FiCheckCircle /></span>
                    <span>Team management</span>
                  </li>
                </ul>
                <button onClick={startOnboarding} className="pricing-button enterprise-button">
                  Contact Sales
                </button>
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
              <button onClick={startOnboarding} className="final-cta-button">
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

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-left">
            <div className="footer-logo">SDR Roadmap</div>
            <div className="footer-copyright">© 2025 SDR Roadmap, Inc.</div>
          </div>
          
          <div className="footer-right">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links">
                <li><a href="#features" className="footer-link">Features</a></li>
                <li><a href="#pricing" className="footer-link">Pricing</a></li>
                <li><a href="#security" className="footer-link">Security</a></li>
                <li><a href="#affiliates" className="footer-link">Affiliates</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links">
                <li><a href="#contact" className="footer-link">Contact us</a></li>
                <li><a href="#api" className="footer-link">API</a></li>
                <li><a href="#guide" className="footer-link">Guide</a></li>
                <li><a href="#blog" className="footer-link">Blog</a></li>
                <li><a href="#changelog" className="footer-link">Changelog</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links">
                <li><a href="#careers" className="footer-link">Careers</a></li>
                <li><a href="#privacy" className="footer-link">Privacy policy</a></li>
                <li><a href="#terms" className="footer-link">Terms of service</a></li>
                <li><a href="#dpa" className="footer-link">DPA</a></li>
                <li><a href="#cookies" className="footer-link">Cookie policy</a></li>
                <li><a href="#trust" className="footer-link">Trust center</a></li>
                <li><a href="#preferences" className="footer-link">Cookie preferences</a></li>
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