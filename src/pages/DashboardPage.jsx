import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './DashboardPage.css'

const DashboardPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">S</span>
            <span className="logo-text">SDR Roadmap</span>
          </div>
          <div className="nav-links">
            <span className="user-email">{user?.email}</span>
            <button onClick={handleSignOut} className="nav-link logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1>Welcome to your SDR Dashboard</h1>
            <p>Start your journey to becoming a successful Sales Development Representative</p>
          </header>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-icon">📚</div>
              <h3>Learning Path</h3>
              <p>Follow your personalized curriculum designed for SDR success</p>
              <button className="card-button">Start Learning</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor your advancement and see how far you've come</p>
              <button className="card-button">View Progress</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">🎯</div>
              <h3>Skill Assessment</h3>
              <p>Test your knowledge and identify areas for improvement</p>
              <button className="card-button">Take Assessment</button>
            </div>

            <div className="dashboard-card">
              <div className="card-icon">👥</div>
              <h3>Community</h3>
              <p>Connect with other SDRs and share your experiences</p>
              <button className="card-button">Join Community</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage