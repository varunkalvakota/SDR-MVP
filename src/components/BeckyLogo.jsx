import React from 'react'
import './BeckyLogo.css'

const BeckyLogo = ({ size = 'medium', animated = true }) => {
  return (
    <div className={`becky-logo ${size} ${animated ? 'animated' : ''}`}>
      <div className="becky-face">
        {/* Hair */}
        <div className="becky-hair">
          <div className="becky-hair-main"></div>
          <div className="becky-hair-bangs"></div>
          <div className="becky-hair-side left"></div>
          <div className="becky-hair-side right"></div>
        </div>
        
        {/* Face */}
        <div className="becky-face-skin"></div>
        
        {/* Eyes */}
        <div className="becky-eyes">
          <div className="becky-eye left">
            <div className="becky-eyelash"></div>
            <div className="becky-pupil"></div>
            <div className="becky-highlight"></div>
          </div>
          <div className="becky-eye right">
            <div className="becky-eyelash"></div>
            <div className="becky-pupil"></div>
            <div className="becky-highlight"></div>
          </div>
        </div>
        
        {/* Nose */}
        <div className="becky-nose"></div>
        
        {/* Smile */}
        <div className="becky-smile">
          <div className="becky-lip-top"></div>
          <div className="becky-lip-bottom"></div>
        </div>
        
        {/* Cheeks */}
        <div className="becky-cheek left"></div>
        <div className="becky-cheek right"></div>
        
        {/* Headband */}
        <div className="becky-headband">
          <div className="becky-headband-bow"></div>
        </div>
        
        {/* Sparkles */}
        <div className="becky-sparkles">
          <div className="sparkle s1"></div>
          <div className="sparkle s2"></div>
          <div className="sparkle s3"></div>
        </div>
      </div>
      <div className="becky-name">Becky</div>
    </div>
  )
}

export default BeckyLogo

