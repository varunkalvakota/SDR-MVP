import React from 'react'
import './SDRLogo.css'

const SDRLogo = ({ size = 'medium', showText = true, className = '' }) => {
  const sizeClasses = {
    small: 'sdr-logo-small',
    medium: 'sdr-logo-medium',
    large: 'sdr-logo-large'
  }

  return (
    <div className={`sdr-logo ${sizeClasses[size]} ${className}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" className="logo-path">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path 
            d="M15 85 Q25 75 35 65 Q45 55 55 45 Q65 35 75 25 Q80 20 85 25 Q90 30 85 35 Q75 45 65 55 Q55 65 45 75 Q35 85 25 90 Q20 95 15 90 Q10 85 15 85 Z" 
            fill="url(#pathGradient)"
            className="winding-path"
          />
          <circle 
            cx="85" 
            cy="35" 
            r="6" 
            fill="#3B82F6" 
            className="end-marker"
          />
        </svg>
      </div>
      {showText && (
        <div className="logo-text">
          <span className="logo-brand">SDR</span>
          <span className="logo-sub">roadmap</span>
          <div className="logo-tagline">Your next role made obvious</div>
        </div>
      )}
    </div>
  )
}

export default SDRLogo
