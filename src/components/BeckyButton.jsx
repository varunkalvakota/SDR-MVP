import BeckyLogo from './BeckyLogo'

const BeckyButton = () => {
  const handleBeckyClick = () => {
    console.log('Becky coaching plan clicked!');
    // Add your coaching plan logic here
  };

  return (
    <div 
      onClick={handleBeckyClick}
      style={{
        width: '100%',
        maxWidth: '1200px',
        margin: '2rem auto',
        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        border: 'none',
        borderRadius: '20px',
        padding: '2.5rem 6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '3rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        minHeight: '140px',
        boxSizing: 'border-box',
        color: 'white',
        fontSize: '1.8rem',
        fontWeight: '800',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '0 15px 40px rgba(37, 99, 235, 0.4)',
        textDecoration: 'none',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-6px)';
        e.target.style.boxShadow = '0 20px 50px rgba(37, 99, 235, 0.5)';
        e.target.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 15px 40px rgba(37, 99, 235, 0.4)';
        e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
      }}
    >
      {/* Becky Logo */}
      <div style={{
        flexShrink: 0
      }}>
        <BeckyLogo size="xlarge" animated={true} />
      </div>
      
      {/* Text Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: '2.2rem',
          fontWeight: '900',
          lineHeight: '1.1',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          textAlign: 'left',
          textShadow: '0 3px 6px rgba(0, 0, 0, 0.2)'
        }}>
          Let Becky Create Your Coaching<br />Plan
        </div>
      </div>
      
    </div>
  )
}

export default BeckyButton
