import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function FloatingBot() {
  const botRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const waveControls = useAnimation();
  const navigate = useNavigate();

  // Handle Eye Tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!botRef.current) return;
      
      // Get bot center position
      const rect = botRef.current.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      // Calculate distance and angle
      const deltaX = e.clientX - botCenterX;
      const deltaY = e.clientY - botCenterY;
      
      // Limit the eye movement radius to a few pixels (e.g., 6px)
      const maxOffset = 6;
      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.min(Math.hypot(deltaX, deltaY) / 100, maxOffset); // scale down distance

      setEyeOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle Random Blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // 30% chance to blink every 3 seconds
      if (Math.random() > 0.7) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150); // Blink duration
        
        // Sometimes double blink
        if (Math.random() > 0.5) {
          setTimeout(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 150);
          }, 250);
        }
      }
    }, 3000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Handle Wave on Click
  const handleClick = async () => {
    setIsWaving(true);
    await waveControls.start({
      rotate: [0, -30, 20, -20, 10, 0],
      transition: { duration: 0.8, ease: "easeInOut" }
    });
    setIsWaving(false);
    
    // Redirect to Copilot or open sidebar
    navigate('/dashboard/risk');
  };

  return (
    <div 
      className="fixed bottom-8 right-8 z-[100] cursor-pointer drop-shadow-2xl group flex flex-col items-center"
      onClick={handleClick}
      onMouseEnter={async () => {
        if (!isWaving) {
          setIsWaving(true);
          await waveControls.start({ rotate: [0, -20, 10, -10, 0], transition: { duration: 0.6 } });
          setIsWaving(false);
        }
      }}
    >
      {/* Tooltip */}
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap border border-slate-700 shadow-xl pointer-events-none">
        Open Copilot 👋
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
      </div>

      {/* Floating Bot Container */}
      <motion.div
        ref={botRef}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-28"
      >
        {/* SVG Robot drawing inspired by user image */}
        <svg viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
          {/* EAR ANTENNAS */}
          <path d="M20 70 C 15 50, 15 30, 30 20 L 40 50 Z" fill="#3b82f6" />
          <path d="M180 70 C 185 50, 185 30, 170 20 L 160 50 Z" fill="#3b82f6" />
          
          <rect x="10" y="70" width="20" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <rect x="170" y="70" width="20" height="40" rx="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />

          {/* LEFT ARM (Static) */}
          <path d="M40 140 Q 20 170, 30 200 L 50 180 Q 50 160, 60 140 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
          
          {/* BODY */}
          <rect x="50" y="120" width="100" height="90" rx="45" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          
          {/* CHEST PLATE (Blue) */}
          <path d="M65 140 Q 100 130, 135 140 L 130 180 Q 100 195, 70 180 Z" fill="#0ea5e9" />

          {/* RIGHT ARM (Waving) */}
          <motion.g 
            animate={waveControls} 
            style={{ originX: 0.2, originY: 0.1 }}
            transform="translate(150, 130)"
          >
            <path d="M0 0 Q 30 -30, 45 0 L 25 20 Q 10 10, -5 20 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2"/>
          </motion.g>

          {/* HEAD */}
          <rect x="30" y="30" width="140" height="100" rx="50" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          
          {/* VISOR (Dark Blue) */}
          <rect x="45" y="45" width="110" height="70" rx="35" fill="#1e3a8a" />
          <rect x="50" y="50" width="100" height="60" rx="30" fill="#172554" />

          {/* EYES (Tracking & Blinking) */}
          <g transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
            {/* Left Eye */}
            <motion.path 
              d="M65 75 Q 75 60, 85 75" 
              stroke="#38bdf8" 
              strokeWidth="10" 
              strokeLinecap="round" 
              fill="none"
              animate={{ scaleY: isBlinking ? 0.1 : 1 }}
              transition={{ duration: 0.05 }}
              style={{ originX: '75px', originY: '70px' }}
            />
            {/* Right Eye */}
            <motion.path 
              d="M115 75 Q 125 60, 135 75" 
              stroke="#38bdf8" 
              strokeWidth="10" 
              strokeLinecap="round" 
              fill="none"
              animate={{ scaleY: isBlinking ? 0.1 : 1 }}
              transition={{ duration: 0.05 }}
              style={{ originX: '125px', originY: '70px' }}
            />
          </g>
          
          {/* LIGHT REFLECTIONS (Glass effect on visor) */}
          <path d="M55 60 Q 95 50, 120 70" stroke="rgba(255,255,255,0.1)" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      </motion.div>

      {/* Floating Shadow beneath bot */}
      <motion.div
        animate={{ scale: [1, 0.8, 1], opacity: [0.3, 0.15, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-12 h-3 bg-slate-900 rounded-[100%] mt-2 blur-sm"
      />
    </div>
  );
}
