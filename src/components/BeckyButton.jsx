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
      {/* Becky Avatar */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        flexShrink: 0
      }}>
        {/* Face */}
        <div style={{
          width: '110px',
          height: '110px',
          background: '#f5d5ae',
          borderRadius: '50%',
          position: 'relative',
          zIndex: 3,
          border: '4px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Eyes */}
          <div style={{
            position: 'absolute',
            top: '35px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '18px'
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              background: '#1f2937',
              borderRadius: '50%'
            }}></div>
            <div style={{
              width: '10px',
              height: '10px',
              background: '#1f2937',
              borderRadius: '50%'
            }}></div>
          </div>
          {/* Eyebrows */}
          <div style={{
            position: 'absolute',
            top: '28px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '18px'
          }}>
            <div style={{
              width: '12px',
              height: '5px',
              background: '#92400e',
              borderRadius: '3px'
            }}></div>
            <div style={{
              width: '12px',
              height: '5px',
              background: '#92400e',
              borderRadius: '3px'
            }}></div>
          </div>
          {/* Mouth */}
          <div style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '18px',
            height: '8px',
            background: '#92400e',
            borderRadius: '0 0 10px 10px'
          }}></div>
        </div>
        {/* Hair */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90px',
          height: '55px',
          background: '#92400e',
          borderRadius: '50% 50% 0 0',
          zIndex: 2
        }}></div>
        {/* Headband */}
        <div style={{
          position: 'absolute',
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '95px',
          height: '15px',
          background: '#ec4899',
          borderRadius: '8px',
          zIndex: 4,
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.15)'
        }}></div>
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
      
      {/* Becky Name */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: '#ec4899',
        fontSize: '1.4rem',
        fontWeight: '900',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}>
        Becky
      </div>
    </div>
  )
}

export default BeckyButton
