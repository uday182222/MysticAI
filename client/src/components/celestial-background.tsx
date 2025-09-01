import { useEffect, useRef } from 'react';

export function CelestialBackground() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    // Create stars
    const createStars = () => {
      const starsContainer = starsRef.current;
      if (!starsContainer) return;

      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starsContainer.appendChild(star);
      }
    };

    createStars();

    // Cleanup
    return () => {
      if (starsRef.current) {
        starsRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="celestial-bg">
      {/* Animated Stars */}
      <div ref={starsRef} className="stars"></div>
      
      {/* Nebula Effects */}
      <div className="nebula nebula-1"></div>
      <div className="nebula nebula-2"></div>
      <div className="nebula nebula-3"></div>
      
      {/* Constellation SVG */}
      <svg className="constellation w-full h-full absolute top-0 left-0" viewBox="0 0 1920 1080">
        {/* Orion-like constellation */}
        <g className="constellation-group">
          <line x1="300" y1="200" x2="450" y2="280" className="constellation-line" />
          <line x1="450" y1="280" x2="600" y2="220" className="constellation-line" />
          <line x1="600" y1="220" x2="750" y2="300" className="constellation-line" />
          <line x1="350" y1="350" x2="500" y2="400" className="constellation-line" />
          <line x1="500" y1="400" x2="650" y2="380" className="constellation-line" />
          <line x1="400" y1="500" x2="550" y2="520" className="constellation-line" />
          <line x1="550" y1="520" x2="700" y2="510" className="constellation-line" />
          
          {/* Constellation stars */}
          <circle cx="300" cy="200" r="3" fill="var(--mystical-gold)" className="constellation-star" />
          <circle cx="450" cy="280" r="4" fill="var(--mystical-silver)" className="constellation-star" />
          <circle cx="600" cy="220" r="3" fill="var(--mystical-gold)" className="constellation-star" />
          <circle cx="750" cy="300" r="2" fill="var(--mystical-silver)" className="constellation-star" />
          <circle cx="350" cy="350" r="3" fill="var(--mystical-violet)" className="constellation-star" />
          <circle cx="500" cy="400" r="4" fill="var(--mystical-gold)" className="constellation-star" />
          <circle cx="650" cy="380" r="3" fill="var(--mystical-silver)" className="constellation-star" />
          <circle cx="400" cy="500" r="2" fill="var(--mystical-violet)" className="constellation-star" />
          <circle cx="550" cy="520" r="3" fill="var(--mystical-gold)" className="constellation-star" />
          <circle cx="700" cy="510" r="3" fill="var(--mystical-silver)" className="constellation-star" />
        </g>

        {/* Second constellation */}
        <g className="constellation-group" style={{animationDelay: '3s'}}>
          <line x1="1200" y1="150" x2="1300" y2="200" className="constellation-line" />
          <line x1="1300" y1="200" x2="1400" y2="180" className="constellation-line" />
          <line x1="1400" y1="180" x2="1500" y2="250" className="constellation-line" />
          <line x1="1250" y1="300" x2="1350" y2="350" className="constellation-line" />
          <line x1="1350" y1="350" x2="1450" y2="320" className="constellation-line" />
          
          <circle cx="1200" cy="150" r="3" fill="var(--mystical-indigo)" className="constellation-star" />
          <circle cx="1300" cy="200" r="4" fill="var(--mystical-gold)" className="constellation-star" />
          <circle cx="1400" cy="180" r="3" fill="var(--mystical-silver)" className="constellation-star" />
          <circle cx="1500" cy="250" r="2" fill="var(--mystical-violet)" className="constellation-star" />
          <circle cx="1250" cy="300" r="3" fill="var(--mystical-indigo)" className="constellation-star" />
          <circle cx="1350" cy="350" r="4" fill="var(--mystical-gold)" className="constellation-star" />
          <circle cx="1450" cy="320" r="3" fill="var(--mystical-silver)" className="constellation-star" />
        </g>
      </svg>
    </div>
  );
}