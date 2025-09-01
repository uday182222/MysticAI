import { useState, useEffect } from 'react';

export function MagicalOrb() {
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks(prev => prev + 1);
    
    // Create magical particles effect
    const orb = document.querySelector('.magical-orb');
    if (orb) {
      for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--mystical-gold)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.left = '50%';
        particle.style.top = '50%';
        
        const angle = (i * 60) * Math.PI / 180;
        const distance = 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.style.animation = `
          particleFloat 1s ease-out forwards
        `;
        
        // Add custom animation
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        orb.appendChild(particle);
        
        setTimeout(() => {
          orb.removeChild(particle);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    // Add particle animation CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particleFloat {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      className="magical-orb"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      title={`✨ Mystical Energy: ${clicks} clicks`}
      style={{
        position: 'fixed',
        top: '50%',
        right: '50px',
        transform: 'translateY(-50%)',
        zIndex: 1000,
      }}
    >
      {/* Inner glow effect */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: isHovered 
            ? 'radial-gradient(circle, var(--mystical-gold), var(--mystical-violet))' 
            : 'radial-gradient(circle, var(--mystical-silver), var(--mystical-purple))',
          transition: 'all 0.3s ease',
          opacity: 0.8,
        }}
      />
      
      {/* Rune symbol */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px',
          color: 'var(--mystical-gold)',
          fontFamily: 'var(--font-mystical)',
          textShadow: '0 0 10px var(--mystical-gold)',
          transition: 'all 0.3s ease',
        }}
      >
        ⚡
      </div>
    </div>
  );
}