import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HyperspaceTransition = ({ station, onComplete }) => {
  const transitionRef = useRef(null);
  const warpLinesRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete
    });

    // Create warp speed lines
    const createWarpLines = () => {
      if (!warpLinesRef.current) return;
      
      warpLinesRef.current.innerHTML = '';
      for (let i = 0; i < 50; i++) {
        const line = document.createElement('div');
        line.className = 'absolute w-1 h-20 bg-white transform origin-center';
        line.style.left = `${Math.random() * 100}%`;
        line.style.top = `${Math.random() * 100}%`;
        line.style.opacity = Math.random() * 0.5 + 0.5;
        warpLinesRef.current.appendChild(line);
        
        tl.to(line, {
          scaleX: 50,
          duration: 1,
          ease: "power1.out"
        }, 0);
      }
    };

    // Animation sequence
    tl.to(transitionRef.current, {
      backgroundColor: 'white',
      duration: 1,
      ease: "power1.in"
    });
    
    tl.call(createWarpLines);
    
    tl.to(transitionRef.current, {
      backgroundColor: 'black',
      duration: 1,
      ease: "power1.out"
    }, 1);
    
  }, [station, onComplete]);

  return (
    <div
      ref={transitionRef}
      className="fixed inset-0 bg-black bg-opacity-0 z-50 flex items-center justify-center"
    >
      <div className="text-white text-4xl font-bold z-10">
        Entering {station} Station...
      </div>
      <div ref={warpLinesRef} className="absolute inset-0 overflow-hidden"></div>
    </div>
  );
};

export default HyperspaceTransition;