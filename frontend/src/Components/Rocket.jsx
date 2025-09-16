import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Rocket = ({ position, velocity }) => {
  const rocketRef = useRef(null);
  const flameRef = useRef(null);

  useEffect(() => {
    // Update rocket position based on props
    if (rocketRef.current) {
      gsap.to(rocketRef.current, {
        x: `${position.x}vw`,
        y: `${position.y}vh`,
        duration: 0.1,
        ease: "power1.out"
      });
    }
    
    // Animate flame based on velocity
    if (flameRef.current) {
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      const flameSize = Math.min(30, 15 + speed * 50);
      
      gsap.to(flameRef.current, {
        height: flameSize,
        duration: 0.1
      });
    }
  }, [position, velocity]);

  // Calculate rotation based on velocity
  const rotation = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);

  return (
    <div 
      ref={rocketRef}
      className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${position.x}vw`, top: `${position.y}vh`, rotate: `${rotation}deg` }}
    >
      {/* Rocket body */}
      <div className="absolute w-12 h-8 bg-gray-200 rounded-t-lg rounded-br-lg transform skew-x-12 shadow-lg">
        <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-2 left-4"></div> {/* Cockpit */}
      </div>
      
      {/* Rocket fins */}
      <div className="absolute w-4 h-4 bg-red-500 transform -skew-x-12 -rotate-45 -bottom-2 -left-2"></div>
      <div className="absolute w-4 h-4 bg-red-500 transform -skew-x-12 rotate-45 -bottom-2 -right-2"></div>
      
      {/* Rocket flame */}
      <div 
        ref={flameRef}
        className="absolute top-8 left-4 w-4 h-4 bg-orange-500 rounded-full transform -translate-x-1/2 flame-glow"
        style={{ height: '15px' }}
      ></div>
    </div>
  );
};

export default Rocket;