import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SupabaseSetup from '../components/SupabaseSetup'
import { LoginModal, SignupModal } from '../components/AuthModals'
import './LandingPage.css'

const LandingPage = () => {
  const { user, signOut } = useAuth()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const openLoginModal = () => {
    setIsSignupModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const openSignupModal = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(true)
  }

  const closeModals = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(false)
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
      </main>

      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={closeModals}
        onSwitchToSignup={openSignupModal}
      />
      <SignupModal 
        isOpen={isSignupModalOpen}
        onClose={closeModals}
        onSwitchToLogin={openLoginModal}
      />
    </div>
  )
}

export default LandingPage