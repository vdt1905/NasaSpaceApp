import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence,useMotionValue } from 'framer-motion';
import {  useMemo } from 'react';


// Custom hooks for keyboard input and collision detection
const useKeyboard = () => {
  const [keys, setKeys] = useState({});
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: true }));
    };
    
    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key.toLowerCase()]: false }));
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return keys;
};

const useCollision = (rect1, rect2, threshold = 50) => {
  const distance = Math.sqrt(
    Math.pow(rect1.x - rect2.x, 2) + Math.pow(rect1.y - rect2.y, 2)
  );
  return distance < threshold;
};

// Enhanced Starfield background component
// const Starfield = ({ count = 300, speed = 0.1 }) => {
//   const starsRef = useRef([]);
  
//   useEffect(() => {
//     starsRef.current = Array.from({ length: count }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 3 + 1,
//       opacity: Math.random() * 0.8 + 0.2,
//       speed: Math.random() * speed + 0.05,
//       direction: Math.random() > 0.5 ? 1 : -1
//     }));
//   }, [count, speed]);

//   return (
//     <div className="absolute inset-0 overflow-hidden">
//       {starsRef.current.map(star => (
//         <motion.div
//           key={star.id}
//           className="absolute bg-white rounded-full"
//           style={{
//             left: `${star.x}%`,
//             top: `${star.y}%`,
//             width: `${star.size}px`,
//             height: `${star.size}px`,
//             opacity: star.opacity,
//           }}
//           animate={{
//             x: [0, 100 * star.direction],
//             y: [0, 100 * star.direction],
//             transition: {
//               duration: 20 / star.speed,
//               repeat: Infinity,
//               repeatType: "loop"
//             }
//           }}
//         />
//       ))}
//     </div>
//   );
// };
const Starfield = ({ count = 200, speed = 0.1, quality = 'medium' }) => {
  const starsRef = useRef([]);
  const nebulaCloudsRef = useRef([]);
  const distantStarsRef = useRef([]);
  
  // Performance settings based on quality
  const settings = {
    low: {
      starCount: Math.min(count * 0.5, 100),
      distantCount: Math.min(count * 0.3, 50),
      nebulaCount: 2,
      particles: 0,
      effects: false
    },
    medium: {
      starCount: Math.min(count, 200),
      distantCount: Math.min(count * 0.7, 100),
      nebulaCount: 3,
      particles: 30,
      effects: true
    },
    high: {
      starCount: Math.min(count, 300),
      distantCount: Math.min(count * 1.2, 200),
      nebulaCount: 4,
      particles: 60,
      effects: true
    }
  };

  const config = settings[quality] || settings.medium;
  
  useEffect(() => {
    // Main twinkling stars - optimized
    starsRef.current = Array.from({ length: config.starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleDelay: Math.random() * 5,
      color: i % 4 === 0 ? 'cyan' : i % 3 === 0 ? 'blue' : 'white',
      brightness: Math.random() * 0.6 + 0.4
    }));

    // Distant background stars - simplified
    distantStarsRef.current = Array.from({ length: config.distantCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.3 + 0.1,
      twinkleDelay: Math.random() * 8
    }));

    // Nebula clouds - reduced and simplified
    nebulaCloudsRef.current = Array.from({ length: config.nebulaCount }, (_, i) => ({
      id: i,
      x: Math.random() * 110 - 5,
      y: Math.random() * 110 - 5,
      size: Math.random() * 200 + 150,
      opacity: Math.random() * 0.1 + 0.03,
      color: ['purple', 'blue', 'indigo'][i % 3],
      rotation: Math.random() * 360
    }));
  }, [count, speed, quality]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900">
      {/* Static background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-900/5 to-black/30" />
      
      {/* Nebula clouds - minimal animation */}
      {nebulaCloudsRef.current.map(cloud => (
        <motion.div
          key={`nebula-${cloud.id}`}
          className={`absolute rounded-full blur-3xl opacity-${Math.floor(cloud.opacity * 100)}`}
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            background: cloud.color === 'purple' ? 
              'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' :
              cloud.color === 'blue' ? 
              'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)' :
              'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            transform: `rotate(${cloud.rotation}deg)`
          }}
          animate={{
            rotate: [cloud.rotation, cloud.rotation + 360],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 80,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Distant background stars - simple opacity animation */}
      {distantStarsRef.current.map(star => (
        <motion.div
          key={`distant-${star.id}`}
          className="absolute bg-gray-400 rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.twinkleDelay
          }}
        />
      ))}

      {/* Main stars - optimized twinkling */}
      {starsRef.current.map(star => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color === 'cyan' ? '#06b6d4' :
                           star.color === 'blue' ? '#3b82f6' : '#ffffff',
            boxShadow: star.color === 'white' ? 'none' : `0 0 ${star.size * 1.5}px currentColor`
          }}
          animate={{
            opacity: [star.brightness * 0.4, star.brightness, star.brightness * 0.6],
            scale: [0.9, 1, 0.9]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.twinkleDelay
          }}
        />
      ))}

      {/* Conditional effects for medium/high quality only */}
      {config.effects && (
        <>
          {/* Shooting stars - reduced frequency */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`shooting-${i}`}
              className="absolute opacity-0"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                x: [0, 150],
                y: [0, 150],
              }}
              transition={{
                duration: 1.5,
                delay: i * 15 + Math.random() * 10,
                repeat: Infinity,
                repeatDelay: 20
              }}
            >
              <div className="w-2 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rotate-45" />
            </motion.div>
          ))}

          {/* Single central cosmic effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full opacity-5 blur-2xl -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.02, 0.06, 0.02]
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}

      {/* Particles for medium/high quality */}
      {config.particles > 0 && [...Array(config.particles)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute bg-cyan-500 rounded-full opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '1px',
            height: '1px'
          }}
          animate={{
            x: [0, Math.random() * 100 - 50],
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 0.2, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: Math.random() * 20,
            ease: "linear"
          }}
        />
      ))}

      {/* Static corner vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/15 pointer-events-none" />
    </div>
  );
};

// Nebula background for depth
const NebulaBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-900 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 bg-purple-900 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute top-1/3 right-1/3 w-1/4 h-1/4 bg-cyan-800 rounded-full blur-3xl opacity-30"></div>
    </div>
  );
};

// Enhanced Rocket component with realistic animations
// const Rocket = ({ position, velocity, isWarping, isBoosting }) => {
//   const rocketRef = useRef(null);
//   const [rotation, setRotation] = useState(0);
//   const [exhaustSize, setExhaustSize] = useState(1);

//   // Calculate rotation based on velocity
//   useEffect(() => {
//     if (!velocity || isWarping) return;
    
//     const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI;
//     setRotation(angle + 90); // Add 90 degrees to point upward by default
    
//     // Calculate exhaust size based on speed
//     const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
//     setExhaustSize(Math.min(1.5, 1 + speed / 10));
//   }, [velocity, isWarping]);

//   // Exhaust animation
//   useEffect(() => {
//     if (isWarping) return;
    
//     const interval = setInterval(() => {
//       setExhaustSize(prev => prev === 1 ? 1.2 : 1);
//     }, 200);
    
//     return () => clearInterval(interval);
//   }, [isWarping]);

//   return (
//     <motion.div
//       ref={rocketRef}
//       className="absolute z-20 pointer-events-none"
//       style={{
//         left: position.x,
//         top: position.y,
//         transform: 'translate(-50%, -50%)'
//       }}
//       animate={{
//         scale: isWarping ? [1, 0.8, 1.5, 2, 0] : 1,
//         rotate: rotation
//       }}
//       transition={{
//         scale: { duration: isWarping ? 2 : 0.2 },
//         rotate: { duration: 0.2 }
//       }}
//     >
//       {/* Rocket body */}
//       <div className="relative">
//         <div className="w-10 h-12 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg relative shadow-lg">
//           {/* Cockpit */}
//           <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-700 rounded-full" />
//           {/* Wings */}
//           <div className="absolute bottom-2 left-0 w-3 h-4 bg-blue-600 rounded-r-sm" />
//           <div className="absolute bottom-2 right-0 w-3 h-4 bg-blue-600 rounded-l-sm" />
//         </div>
        
//         {/* Thruster flame */}
//         <motion.div
//           className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
//           animate={{
//             scaleY: [1, exhaustSize, 1],
//             opacity: [0.7, 1, 0.7]
//           }}
//           transition={{
//             duration: 0.2,
//             repeat: isBoosting ? Infinity : 0
//           }}
//         >
//           <div className="w-3 h-4 bg-gradient-to-b from-yellow-400 via-orange-500 to-red-600 rounded-b-full" />
//           {isBoosting && (
//             <motion.div
//               className="absolute top-0 left-0 w-full h-full bg-yellow-300 rounded-b-full blur-sm"
//               animate={{ opacity: [0, 0.8, 0] }}
//               transition={{ duration: 0.3, repeat: Infinity }}
//             />
//           )}
//         </motion.div>

//         {/* Warp effect */}
//         {isWarping && (
//           <motion.div
//             className="absolute -inset-4 rounded-full bg-cyan-400 blur-xl"
//             animate={{ opacity: [0, 0.8, 0] }}
//             transition={{ duration: 0.5, repeat: Infinity }}
//           />
//         )}
//       </div>
//     </motion.div>
//   );
// };
// const Rocket = ({ position, velocity, isWarping, isBoosting }) => {
//   const rocketRef = useRef(null);
//   const [rotation, setRotation] = useState(0);
//   const [exhaustSize, setExhaustSize] = useState(1);

//   // Calculate rotation based on velocity
//   useEffect(() => {
//     if (!velocity || isWarping) return;
    
//     const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI;
//     setRotation(angle + 90); // Add 90 degrees to point upward by default
    
//     // Calculate exhaust size based on speed
//     const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
//     setExhaustSize(Math.min(2.5, 1 + speed / 8));
//   }, [velocity, isWarping]);

//   // Exhaust animation
//   useEffect(() => {
//     if (isWarping) return;
    
//     const interval = setInterval(() => {
//       setExhaustSize(prev => prev === 1 ? 1.5 : 1);
//     }, 150);
    
//     return () => clearInterval(interval);
//   }, [isWarping]);

//   return (
//     <motion.div
//       ref={rocketRef}
//       className="absolute z-20 pointer-events-none"
//       style={{
//         left: position.x,
//         top: position.y,
//         transform: 'translate(-50%, -50%)'
//       }}
//       animate={{
//         scale: isWarping ? [1, 0.8, 1.5, 2, 0] : 1,
//         rotate: rotation
//       }}
//       transition={{
//         scale: { duration: isWarping ? 2 : 0.2 },
//         rotate: { duration: 0.2 }
//       }}
//     >
//       {/* Rocket body - Much bigger and more detailed */}
//       <div className="relative">
//         {/* Main rocket body */}
//         <div className="w-16 h-32 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 rounded-t-3xl relative shadow-2xl border border-gray-400">
//           {/* Nose cone details */}
//           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-gradient-to-b from-red-500 to-red-600 rounded-t-3xl border-b-2 border-red-700" />
          
//           {/* Command module */}
//           <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-14 h-6 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg border border-blue-900">
//             {/* Windows */}
//             <div className="absolute top-1 left-2 w-2 h-2 bg-cyan-200 rounded-full opacity-80" />
//             <div className="absolute top-1 right-2 w-2 h-2 bg-cyan-200 rounded-full opacity-80" />
//             <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-cyan-300 rounded-sm opacity-90" />
//           </div>
          
//           {/* Fuel tank sections with realistic bands */}
//           <div className="absolute top-16 left-0 w-full h-1 bg-gray-600" />
//           <div className="absolute top-20 left-0 w-full h-1 bg-gray-600" />
//           <div className="absolute top-24 left-0 w-full h-1 bg-gray-600" />
          
//           {/* Side boosters/details */}
//           <div className="absolute top-18 left-0 w-3 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-l-lg border border-gray-700" />
//           <div className="absolute top-18 right-0 w-3 h-8 bg-gradient-to-b from-gray-400 to-gray-600 rounded-r-lg border border-gray-700" />
          
//           {/* Main wings - larger and more realistic */}
//           <div className="absolute bottom-4 -left-2 w-6 h-8 bg-gradient-to-r from-gray-500 to-gray-700 transform skew-y-12 border border-gray-800" />
//           <div className="absolute bottom-4 -right-2 w-6 h-8 bg-gradient-to-l from-gray-500 to-gray-700 transform -skew-y-12 border border-gray-800" />
          
//           {/* Stabilizer fins */}
//           <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-gray-600" />
          
//           {/* Landing legs (small details) */}
//           <div className="absolute bottom-6 left-1 w-1 h-4 bg-gray-800 transform rotate-45" />
//           <div className="absolute bottom-6 right-1 w-1 h-4 bg-gray-800 transform -rotate-45" />
//         </div>
        
//         {/* Main engine bell */}
//         <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-6 bg-gradient-to-b from-gray-600 to-gray-900 rounded-b-full border-2 border-gray-800">
//           <div className="absolute inset-1 bg-gradient-to-b from-gray-700 to-black rounded-b-full" />
//         </div>
        
//         {/* Thruster flames - Multiple realistic flames */}
//         <motion.div
//           className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
//           animate={{
//             scaleY: [1, exhaustSize, 1],
//             opacity: [0.8, 1, 0.8]
//           }}
//           transition={{
//             duration: 0.15,
//             repeat: isBoosting ? Infinity : 0
//           }}
//         >
//           {/* Main flame */}
//           <div className="w-6 h-12 bg-gradient-to-b from-blue-400 via-yellow-400 via-orange-500 to-red-600 rounded-b-full relative">
//             {/* Inner flame core */}
//             <div className="absolute inset-1 bg-gradient-to-b from-white via-blue-200 via-yellow-200 to-orange-300 rounded-b-full opacity-80" />
//           </div>
          
//           {/* Side exhaust flames */}
//           <motion.div 
//             className="absolute -left-4 top-2 w-3 h-8 bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 rounded-b-full"
//             animate={{ scaleY: [0.8, 1.2, 0.8] }}
//             transition={{ duration: 0.2, repeat: Infinity }}
//           />
//           <motion.div 
//             className="absolute -right-4 top-2 w-3 h-8 bg-gradient-to-b from-yellow-300 via-orange-400 to-red-500 rounded-b-full"
//             animate={{ scaleY: [0.8, 1.2, 0.8] }}
//             transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
//           />
          
//           {/* Boosting effects */}
//           {isBoosting && (
//             <>
//               <motion.div
//                 className="absolute -inset-2 bg-gradient-to-b from-blue-300 via-yellow-200 to-red-400 rounded-b-full blur-sm"
//                 animate={{ 
//                   opacity: [0, 0.6, 0],
//                   scaleY: [1, 1.5, 1]
//                 }}
//                 transition={{ duration: 0.2, repeat: Infinity }}
//               />
//               {/* Afterburner effect */}
//               <motion.div
//                 className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-gradient-to-b from-transparent via-blue-400 to-transparent rounded-full blur-lg"
//                 animate={{ 
//                   opacity: [0, 0.8, 0],
//                   scaleX: [0.5, 1.5, 0.5]
//                 }}
//                 transition={{ duration: 0.3, repeat: Infinity }}
//               />
//             </>
//           )}
//         </motion.div>

//         {/* Enhanced warp effect */}
//         {isWarping && (
//           <>
//             <motion.div
//               className="absolute -inset-8 rounded-full bg-cyan-400 blur-2xl"
//               animate={{ 
//                 opacity: [0, 0.8, 0],
//                 scale: [0.8, 1.5, 0.8]
//               }}
//               transition={{ duration: 0.4, repeat: Infinity }}
//             />
//             <motion.div
//               className="absolute -inset-12 rounded-full bg-blue-500 blur-3xl"
//               animate={{ 
//                 opacity: [0, 0.6, 0],
//                 scale: [1, 2, 1]
//               }}
//               transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//             />
//             {/* Warp particles */}
//             <motion.div
//               className="absolute -inset-4 border-2 border-cyan-300 rounded-full"
//               animate={{ 
//                 opacity: [0, 1, 0],
//                 scale: [0.5, 3, 0.5],
//                 rotate: [0, 360]
//               }}
//               transition={{ duration: 1, repeat: Infinity }}
//             />
//           </>
//         )}

//         {/* Speed lines when moving fast */}
//         {velocity && Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) > 5 && !isWarping && (
//           <motion.div
//             className="absolute inset-0 pointer-events-none"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.6 }}
//           >
//             {[...Array(6)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute w-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
//                 style={{
//                   height: '40px',
//                   left: `${20 + i * 10}%`,
//                   top: '-20px',
//                   transform: 'rotate(-90deg)'
//                 }}
//                 animate={{
//                   opacity: [0, 1, 0],
//                   scaleX: [0, 1, 0]
//                 }}
//                 transition={{
//                   duration: 0.3,
//                   repeat: Infinity,
//                   delay: i * 0.1
//                 }}
//               />
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// };


const Rocket = ({ position, velocity, isWarping, isBoosting }) => {
  const rocketRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [exhaustSize, setExhaustSize] = useState(1);

  // Calculate rotation based on velocity
  useEffect(() => {
    if (!velocity || isWarping) return;
    
    const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI;
    setRotation(angle + 90); // Add 90 degrees to point upward by default
    
    // Calculate exhaust size based on speed
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    setExhaustSize(Math.min(2.5, 1 + speed / 8));
  }, [velocity, isWarping]);

  // Exhaust animation
  useEffect(() => {
    if (isWarping) return;
    
    const interval = setInterval(() => {
      setExhaustSize(prev => prev === 1 ? 1.5 : 1);
    }, 150);
    
    return () => clearInterval(interval);
  }, [isWarping]);

  return (
    <motion.div
      ref={rocketRef}
      className="absolute z-20 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        scale: isWarping ? [1, 0.8, 1.5, 2, 0] : 1,
        rotate: rotation
      }}
      transition={{
        scale: { duration: isWarping ? 2 : 0.2 },
        rotate: { duration: 0.2 }
      }}
    >
      {/* NASA Space Shuttle Style Rocket */}
      <div className="relative">
        
        {/* External Tank (Orange) - Behind orbiter */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-2 w-8 h-40 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 shadow-2xl z-10"
             style={{ borderRadius: '12px 12px 4px 4px' }}>
          {/* Tank nose cone */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-orange-300 to-orange-400"
               style={{ borderRadius: '50% 50% 0 0' }} />
          
          {/* Tank bands and details */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-orange-700 opacity-60" />
          <div className="absolute top-16 left-0 w-full h-0.5 bg-orange-700 opacity-60" />
          <div className="absolute top-24 left-0 w-full h-0.5 bg-orange-700 opacity-60" />
          <div className="absolute top-32 left-0 w-full h-0.5 bg-orange-700 opacity-60" />
          
          {/* NASA text */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 rotate-90 text-xs font-bold text-white opacity-80">
            NASA
          </div>
        </div>

        {/* Solid Rocket Boosters */}
        {/* Left SRB */}
        <div className="absolute -left-4 top-6 w-5 h-36 bg-gradient-to-b from-gray-100 via-white to-gray-200 shadow-xl z-20"
             style={{ borderRadius: '8px 8px 2px 2px' }}>
          {/* SRB nose cone */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-50 to-gray-100"
               style={{ borderRadius: '50% 50% 0 0' }} />
          
          {/* SRB segments */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-18 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-24 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-30 left-0 w-full h-0.5 bg-gray-400" />
          
          {/* Recovery parachute compartment */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gray-300 rounded-sm" />
          
          {/* SRB nozzle */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-gray-600 to-gray-800"
               style={{ borderRadius: '0 0 50% 50%' }} />
        </div>
        
        {/* Right SRB */}
        <div className="absolute -right-4 top-6 w-5 h-36 bg-gradient-to-b from-gray-100 via-white to-gray-200 shadow-xl z-20"
             style={{ borderRadius: '8px 8px 2px 2px' }}>
          {/* SRB nose cone */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-gradient-to-b from-gray-50 to-gray-100"
               style={{ borderRadius: '50% 50% 0 0' }} />
          
          {/* SRB segments */}
          <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-18 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-24 left-0 w-full h-0.5 bg-gray-400" />
          <div className="absolute top-30 left-0 w-full h-0.5 bg-gray-400" />
          
          {/* Recovery parachute compartment */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gray-300 rounded-sm" />
          
          {/* SRB nozzle */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-3 bg-gradient-to-b from-gray-600 to-gray-800"
               style={{ borderRadius: '0 0 50% 50%' }} />
        </div>

        {/* Space Shuttle Orbiter */}
        <div className="relative w-10 h-32 bg-gradient-to-b from-gray-50 via-white to-gray-100 shadow-2xl z-30"
             style={{ borderRadius: '50% 50% 4px 4px' }}>
          
          {/* Orbiter nose cone */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-12 bg-gradient-to-b from-gray-100 to-white"
               style={{ borderRadius: '50% 50% 20px 20px' }}>
            {/* Cockpit windows */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-800 opacity-60 rounded-sm" />
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-5 h-1.5 bg-gray-800 opacity-60 rounded-sm" />
          </div>
          
          {/* Wings */}
          <div className="absolute top-16 -left-6 w-6 h-12 bg-gradient-to-r from-gray-200 to-gray-100 transform -skew-y-12 shadow-lg"
               style={{ borderRadius: '0 8px 8px 0' }} />
          <div className="absolute top-16 -right-6 w-6 h-12 bg-gradient-to-l from-gray-200 to-gray-100 transform skew-y-12 shadow-lg"
               style={{ borderRadius: '8px 0 0 8px' }} />
          
          {/* Cargo bay doors */}
          <div className="absolute top-12 left-1 w-8 h-16 border border-gray-300 opacity-40 rounded-sm" />
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-400 opacity-60" />
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-400 opacity-60" />
          
          {/* NASA logo and text */}
          <div className="absolute top-18 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-600 rounded-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-sm" />
          </div>
          <div className="absolute top-21 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">NASA</div>
          
          {/* Main engines area */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-b-lg">
            {/* Three main engines */}
            <div className="absolute -bottom-1 left-1 w-1.5 h-2 bg-gray-700 rounded-b-full" />
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-2 bg-gray-700 rounded-b-full" />
            <div className="absolute -bottom-1 right-1 w-1.5 h-2 bg-gray-700 rounded-b-full" />
          </div>
          
          {/* Vertical tail */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-gray-100 to-gray-200 shadow-md"
               style={{ borderRadius: '0 0 8px 8px' }} />
        </div>
        
        {/* External Tank Engine Exhausts */}
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          animate={{
            scaleY: [1, exhaustSize * 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.15,
            repeat: isBoosting ? Infinity : 0
          }}
        >
          <div className="w-8 h-12 bg-gradient-to-b from-blue-200 via-yellow-300 via-orange-400 to-red-600 rounded-b-full relative">
            <div className="absolute inset-1 bg-gradient-to-b from-white via-blue-100 via-yellow-100 to-orange-200 rounded-b-full opacity-70" />
          </div>
        </motion.div>
        
        {/* SRB Exhausts */}
        <motion.div
          className="absolute -bottom-4 -left-4"
          animate={{
            scaleY: [1, exhaustSize * 0.9, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.15,
            repeat: isBoosting ? Infinity : 0
          }}
        >
          <div className="w-4 h-10 bg-gradient-to-b from-blue-300 via-yellow-400 to-red-500 rounded-b-full" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-4 -right-4"
          animate={{
            scaleY: [1, exhaustSize * 0.9, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 0.15,
            repeat: isBoosting ? Infinity : 0,
            delay: 0.05
          }}
        >
          <div className="w-4 h-10 bg-gradient-to-b from-blue-300 via-yellow-400 to-red-500 rounded-b-full" />
        </motion.div>
        
        {/* Orbiter Main Engine Exhausts */}
        <motion.div
          className="absolute -bottom-3 left-2"
          animate={{
            scaleY: [1, exhaustSize * 0.7, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 0.15,
            repeat: isBoosting ? Infinity : 0
          }}
        >
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-200 via-yellow-300 to-red-500 rounded-b-full" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2"
          animate={{
            scaleY: [1, exhaustSize * 0.7, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 0.15,
            repeat: isBoosting ? Infinity : 0,
            delay: 0.03
          }}
        >
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-200 via-yellow-300 to-red-500 rounded-b-full" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-3 right-2"
          animate={{
            scaleY: [1, exhaustSize * 0.7, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 0.15,
            repeat: isBoosting ? Infinity : 0,
            delay: 0.06
          }}
        >
          <div className="w-1.5 h-8 bg-gradient-to-b from-blue-200 via-yellow-300 to-red-500 rounded-b-full" />
        </motion.div>

        {/* Boosting effects */}
        {isBoosting && (
          <>
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-blue-200 via-yellow-200 to-red-300 rounded-b-full blur-sm"
              animate={{ 
                opacity: [0, 0.6, 0],
                scaleY: [1, 1.3, 1]
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
            {/* Afterburner effect */}
            <motion.div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-transparent via-blue-300 to-transparent rounded-full blur-lg"
              animate={{ 
                opacity: [0, 0.7, 0],
                scaleX: [0.5, 1.2, 0.5]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </>
        )}

        {/* Enhanced warp effect */}
        {isWarping && (
          <>
            <motion.div
              className="absolute -inset-8 rounded-full bg-cyan-400 blur-2xl"
              animate={{ 
                opacity: [0, 0.8, 0],
                scale: [0.8, 1.5, 0.8]
              }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
            <motion.div
              className="absolute -inset-12 rounded-full bg-blue-500 blur-3xl"
              animate={{ 
                opacity: [0, 0.6, 0],
                scale: [1, 2, 1]
              }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            {/* Warp particles */}
            <motion.div
              className="absolute -inset-4 border-2 border-cyan-300 rounded-full"
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0.5, 3, 0.5],
                rotate: [0, 360]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </>
        )}

        {/* Speed lines when moving fast */}
        {velocity && Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) > 5 && !isWarping && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                style={{
                  height: '50px',
                  left: `${15 + i * 8}%`,
                  top: '-25px',
                  transform: 'rotate(-90deg)'
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleX: [0, 1, 0]
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};



// const Rocket = ({ position, velocity, isWarping, isBoosting }) => {
//   const rocketRef = useRef(null);
//   const [rotation, setRotation] = useState(0);
//   const [exhaustSize, setExhaustSize] = useState(1);

//   // Calculate rotation based on velocity
//   useEffect(() => {
//     if (!velocity || isWarping) return;
    
//     const angle = Math.atan2(velocity.y, velocity.x) * 180 / Math.PI;
//     setRotation(angle + 90); // Add 90 degrees to point upward by default
    
//     // Calculate exhaust size based on speed
//     const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
//     setExhaustSize(Math.min(2.5, 1 + speed / 8));
//   }, [velocity, isWarping]);

//   // Exhaust animation
//   useEffect(() => {
//     if (isWarping) return;
    
//     const interval = setInterval(() => {
//       setExhaustSize(prev => prev === 1 ? 1.5 : 1);
//     }, 150);
    
//     return () => clearInterval(interval);
//   }, [isWarping]);

//   return (
//     <motion.div
//       ref={rocketRef}
//       className="absolute z-20 pointer-events-none"
//       style={{
//         left: position.x,
//         top: position.y,
//         transform: 'translate(-50%, -50%)'
//       }}
//       animate={{
//         scale: isWarping ? [1, 0.8, 1.5, 2, 0] : 1,
//         rotate: rotation
//       }}
//       transition={{
//         scale: { duration: isWarping ? 2 : 0.2 },
//         rotate: { duration: 0.2 }
//       }}
//     >
//       {/* ISRO GSLV Mark III Rocket */}
//       <div className="relative">
        
//         {/* Side Solid Boosters */}
//         {/* Left Booster */}
//         <div className="absolute -left-6 top-8 w-4 h-28 bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-lg rounded-b-sm border border-gray-300 shadow-lg">
//           {/* Booster nose */}
//           <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg" />
//           {/* ISRO text */}
//           <div className="absolute top-8 left-1/2 transform -translate-x-1/2 rotate-90 text-xs font-bold text-gray-700">ISRO</div>
//           {/* Booster bands */}
//           <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-400" />
//           <div className="absolute top-18 left-0 w-full h-0.5 bg-gray-400" />
//           {/* Nozzle */}
//           <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-full" />
//         </div>
        
//         {/* Right Booster */}
//         <div className="absolute -right-6 top-8 w-4 h-28 bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-lg rounded-b-sm border border-gray-300 shadow-lg">
//           {/* Booster nose */}
//           <div className="absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg" />
//           {/* INDIA text */}
//           <div className="absolute top-8 left-1/2 transform -translate-x-1/2 rotate-90 text-xs font-bold text-gray-700">INDIA</div>
//           {/* Booster bands */}
//           <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-400" />
//           <div className="absolute top-18 left-0 w-full h-0.5 bg-gray-400" />
//           {/* Nozzle */}
//           <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-4 bg-gradient-to-b from-gray-600 to-gray-800 rounded-b-full" />
//         </div>

//         {/* Main Core Stage */}
//         <div className="w-12 h-36 bg-gradient-to-b from-white to-gray-100 relative shadow-2xl border border-gray-200">
          
//           {/* Payload Fairing (Top) */}
//           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-10 h-12 bg-gradient-to-b from-gray-50 to-white rounded-t-2xl border border-gray-200">
//             {/* Indian flag stripes */}
//             <div className="absolute top-3 left-0 w-full h-1 bg-orange-500" />
//             <div className="absolute top-4 left-0 w-full h-1 bg-white" />
//             <div className="absolute top-5 left-0 w-full h-1 bg-green-600" />
//           </div>
          
//           {/* Upper Stage */}
//           <div className="absolute top-12 left-0 w-full h-8 bg-gradient-to-b from-gray-50 to-gray-100 border-t border-b border-gray-300">
//             {/* ISRO logo area */}
//             <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-orange-400 rounded-sm" />
//             <div className="absolute top-3.5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">ISRO</div>
//           </div>
          
//           {/* Cryogenic Stage Label */}
//           <div className="absolute top-20 left-0 w-full h-6 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 border-y border-gray-300">
//             <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800">GSLV</div>
//             <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-800">MK III</div>
//           </div>
          
//           {/* Main fuel tank */}
//           <div className="absolute top-26 left-0 w-full h-8 bg-gradient-to-b from-white to-gray-50">
//             {/* Tank bands */}
//             <div className="absolute top-2 left-0 w-full h-0.5 bg-gray-300" />
//             <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-300" />
//           </div>
          
//           {/* Main engine section */}
//           <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-b from-gray-200 to-gray-400" />
//         </div>
        
//         {/* Main Engine Nozzle */}
//         <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-gray-500 to-gray-900 rounded-b-2xl border-2 border-gray-700">
//           <div className="absolute inset-1 bg-gradient-to-b from-gray-600 to-black rounded-b-2xl" />
//         </div>
        
//         {/* Side Booster Exhausts */}
//         <motion.div
//           className="absolute -bottom-6 -left-6"
//           animate={{
//             scaleY: [1, exhaustSize * 0.8, 1],
//             opacity: [0.7, 1, 0.7]
//           }}
//           transition={{
//             duration: 0.15,
//             repeat: isBoosting ? Infinity : 0
//           }}
//         >
//           <div className="w-3 h-8 bg-gradient-to-b from-blue-300 via-yellow-400 to-red-500 rounded-b-full" />
//         </motion.div>
        
//         <motion.div
//           className="absolute -bottom-6 -right-6"
//           animate={{
//             scaleY: [1, exhaustSize * 0.8, 1],
//             opacity: [0.7, 1, 0.7]
//           }}
//           transition={{
//             duration: 0.15,
//             repeat: isBoosting ? Infinity : 0,
//             delay: 0.05
//           }}
//         >
//           <div className="w-3 h-8 bg-gradient-to-b from-blue-300 via-yellow-400 to-red-500 rounded-b-full" />
//         </motion.div>
        
//         {/* Main Engine Exhaust */}
//         <motion.div
//           className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
//           animate={{
//             scaleY: [1, exhaustSize, 1],
//             opacity: [0.8, 1, 0.8]
//           }}
//           transition={{
//             duration: 0.15,
//             repeat: isBoosting ? Infinity : 0
//           }}
//         >
//           {/* Main flame */}
//           <div className="w-6 h-16 bg-gradient-to-b from-blue-200 via-yellow-300 via-orange-400 to-red-600 rounded-b-full relative">
//             {/* Inner flame core */}
//             <div className="absolute inset-1 bg-gradient-to-b from-white via-blue-100 via-yellow-100 to-orange-200 rounded-b-full opacity-70" />
//           </div>
          
//           {/* Boosting effects */}
//           {isBoosting && (
//             <>
//               <motion.div
//                 className="absolute -inset-2 bg-gradient-to-b from-blue-200 via-yellow-200 to-red-300 rounded-b-full blur-sm"
//                 animate={{ 
//                   opacity: [0, 0.6, 0],
//                   scaleY: [1, 1.3, 1]
//                 }}
//                 transition={{ duration: 0.2, repeat: Infinity }}
//               />
//               {/* Afterburner effect */}
//               <motion.div
//                 className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-20 bg-gradient-to-b from-transparent via-blue-300 to-transparent rounded-full blur-lg"
//                 animate={{ 
//                   opacity: [0, 0.7, 0],
//                   scaleX: [0.5, 1.2, 0.5]
//                 }}
//                 transition={{ duration: 0.3, repeat: Infinity }}
//               />
//             </>
//           )}
//         </motion.div>

//         {/* Enhanced warp effect */}
//         {isWarping && (
//           <>
//             <motion.div
//               className="absolute -inset-8 rounded-full bg-cyan-400 blur-2xl"
//               animate={{ 
//                 opacity: [0, 0.8, 0],
//                 scale: [0.8, 1.5, 0.8]
//               }}
//               transition={{ duration: 0.4, repeat: Infinity }}
//             />
//             <motion.div
//               className="absolute -inset-12 rounded-full bg-blue-500 blur-3xl"
//               animate={{ 
//                 opacity: [0, 0.6, 0],
//                 scale: [1, 2, 1]
//               }}
//               transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
//             />
//             {/* Warp particles */}
//             <motion.div
//               className="absolute -inset-4 border-2 border-cyan-300 rounded-full"
//               animate={{ 
//                 opacity: [0, 1, 0],
//                 scale: [0.5, 3, 0.5],
//                 rotate: [0, 360]
//               }}
//               transition={{ duration: 1, repeat: Infinity }}
//             />
//           </>
//         )}

//         {/* Speed lines when moving fast */}
//         {velocity && Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y) > 5 && !isWarping && (
//           <motion.div
//             className="absolute inset-0 pointer-events-none"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.6 }}
//           >
//             {[...Array(6)].map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute w-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
//                 style={{
//                   height: '40px',
//                   left: `${20 + i * 10}%`,
//                   top: '-20px',
//                   transform: 'rotate(-90deg)'
//                 }}
//                 animate={{
//                   opacity: [0, 1, 0],
//                   scaleX: [0, 1, 0]
//                 }}
//                 transition={{
//                   duration: 0.3,
//                   repeat: Infinity,
//                   delay: i * 0.1
//                 }}
//               />
//             ))}
//           </motion.div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// Enhanced Station component
const Station = ({ station, onCollision, isNearby }) => {
  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: `${station.x}%`,
        top: `${station.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      animate={{
        y: [-3, 3, -3],
        scale: isNearby ? 1.2 : 1,
        rotate: isNearby ? [0, 5, -5, 0] : 0
      }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.3 },
        rotate: { duration: 2, repeat: Infinity }
      }}
      onClick={onCollision}
      whileHover={{ scale: 1.1 }}
    >
      {/* Station glow */}
      <motion.div 
        className={`absolute inset-0 rounded-full blur-md ${station.glowColor}`}
        style={{ transform: 'scale(2)' }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Station body */}
      <div className={`relative w-16 h-16 rounded-full border-4 ${station.borderColor} ${station.bgColor} 
                      shadow-lg flex items-center justify-center z-10 backdrop-blur-sm`}>
        <div className="text-2xl">{station.icon}</div>
        
        {/* Orbiting particles */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute w-2 h-2 bg-white rounded-full -top-1 left-1/2 transform -translate-x-1/2" />
          <div className="absolute w-1 h-1 bg-white rounded-full top-1/2 -right-1 transform -translate-y-1/2" />
        </motion.div>
      </div>

      {/* Station label */}
      <AnimatePresence>
        {isNearby && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <div className="bg-black bg-opacity-80 text-white px-3 py-1 rounded-lg border border-cyan-400 backdrop-blur-sm shadow-lg">
              <div className="text-sm font-semibold">{station.name}</div>
              <div className="text-xs text-gray-300">Press SPACE or Click</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};



// Example usage with sample station data






// const WarpOverlay = ({ isWarping, onWarpComplete, targetStation }) => {
//   const [phase, setPhase] = useState('approach');
//   const [progress, setProgress] = useState(0);
  
//   // Simplified easing curves
//   const smooth = [0.4, 0, 0.2, 1];
//   const dramatic = [0.68, -0.55, 0.265, 1.55];

//   // Minimal cosmic elements for performance
//   const cosmicElements = useMemo(() => ({
//     galaxies: Array.from({ length: 8 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 60 + 30,
//       brightness: Math.random() * 0.4 + 0.2,
//     })),

//     particles: Array.from({ length: 100 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 2 + 0.5,
//       speed: Math.random() * 1 + 0.5,
//     })),

//     voidLines: Array.from({ length: 6 }, (_, i) => ({
//       id: i,
//       angle: i * 60,
//       length: Math.random() * 150 + 100,
//     })),
//   }), []);

//   useEffect(() => {
//     if (isWarping) {
//       setPhase('approach');
//       setProgress(0);
      
//       const progressTimer = setInterval(() => {
//         setProgress(prev => Math.min(prev + 1, 100));
//       }, 80);
      
//       const approachTimer = setTimeout(() => setPhase('void'), 3000);
//       const voidTimer = setTimeout(() => setPhase('tesseract'), 6000);
//       const tesseractTimer = setTimeout(() => setPhase('arrival'), 9000);
//       const arrivalTimer = setTimeout(() => {
//         onWarpComplete();
//         setPhase('approach');
//         setProgress(0);
//       }, 12000);

//       return () => {
//         clearInterval(progressTimer);
//         [approachTimer, voidTimer, tesseractTimer, arrivalTimer].forEach(clearTimeout);
//       };
//     }
//   }, [isWarping, onWarpComplete]);

//   if (!isWarping) return null;

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 z-50 bg-black overflow-hidden select-none"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         {/* Phase 1: Deep Space Approach */}
//         {phase === 'approach' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1.5, ease: smooth }}
//           >
//             {/* Distant galaxies */}
//             {cosmicElements.galaxies.map((galaxy) => (
//               <motion.div
//                 key={galaxy.id}
//                 className="absolute rounded-full"
//                 style={{
//                   left: `${galaxy.x}%`,
//                   top: `${galaxy.y}%`,
//                   width: `${galaxy.size}px`,
//                   height: `${galaxy.size * 0.6}px`,
//                   background: `radial-gradient(ellipse, rgba(100, 150, 255, ${galaxy.brightness}) 0%, transparent 70%)`,
//                   filter: 'blur(2px)',
//                   transform: 'translate(-50%, -50%)',
//                 }}
//                 animate={{
//                   opacity: [galaxy.brightness * 0.5, galaxy.brightness, galaxy.brightness * 0.5],
//                   scale: [0.8, 1.2, 0.8],
//                 }}
//                 transition={{
//                   duration: 4,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               />
//             ))}

//             {/* Floating particles */}
//             {cosmicElements.particles.slice(0, 50).map((particle) => (
//               <motion.div
//                 key={particle.id}
//                 className="absolute rounded-full bg-white"
//                 style={{
//                   left: `${particle.x}%`,
//                   top: `${particle.y}%`,
//                   width: `${particle.size}px`,
//                   height: `${particle.size}px`,
//                   opacity: 0.3,
//                 }}
//                 animate={{
//                   opacity: [0.1, 0.4, 0.1],
//                   y: [0, -20, 0],
//                 }}
//                 transition={{
//                   duration: 3 + Math.random() * 2,
//                   repeat: Infinity,
//                   ease: "easeInOut",
//                 }}
//               />
//             ))}

//             <motion.div
//               className="absolute top-8 left-8 text-blue-300 font-mono text-sm"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 1, duration: 1 }}
//             >
//               <div className="font-light tracking-wide">DEEP SPACE</div>
//               <div className="text-xs mt-1 opacity-70">Approaching cosmic boundary</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Phase 2: The Void */}
//         {phase === 'void' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1, ease: smooth }}
//             style={{
//               background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
//             }}
//           >
//             {/* Void energy lines */}
//             {cosmicElements.voidLines.map((line) => (
//               <motion.div
//                 key={line.id}
//                 className="absolute top-1/2 left-1/2 origin-left"
//                 style={{
//                   width: `${line.length}px`,
//                   height: '2px',
//                   background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.6) 50%, transparent 100%)',
//                   transform: `translate(-50%, -50%) rotate(${line.angle}deg)`,
//                   filter: 'blur(1px)',
//                 }}
//                 animate={{
//                   opacity: [0, 0.8, 0],
//                   scaleX: [0, 1, 0],
//                 }}
//                 transition={{
//                   duration: 2,
//                   repeat: Infinity,
//                   delay: line.id * 0.3,
//                   ease: smooth,
//                 }}
//               />
//             ))}

//             {/* Central void portal */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//               animate={{
//                 scale: [0.8, 1.3, 0.8],
//                 rotate: [0, 360],
//               }}
//               transition={{
//                 duration: 6,
//                 repeat: Infinity,
//                 ease: "linear",
//               }}
//             >
//               <div 
//                 className="w-40 h-40 rounded-full"
//                 style={{
//                   background: 'radial-gradient(circle, transparent 40%, rgba(139, 92, 246, 0.3) 70%, transparent 100%)',
//                   filter: 'blur(15px)',
//                 }}
//               />
//             </motion.div>

//             {/* Void particles */}
//             {cosmicElements.particles.map((particle) => (
//               <motion.div
//                 key={particle.id}
//                 className="absolute rounded-full"
//                 style={{
//                   left: `${particle.x}%`,
//                   top: `${particle.y}%`,
//                   width: `${particle.size * 0.5}px`,
//                   height: `${particle.size * 0.5}px`,
//                   background: 'rgba(139, 92, 246, 0.4)',
//                 }}
//                 animate={{
//                   opacity: [0, 0.6, 0],
//                   x: [(50 - particle.x) * 0.5, (50 - particle.x) * 2],
//                   y: [(50 - particle.y) * 0.5, (50 - particle.y) * 2],
//                 }}
//                 transition={{
//                   duration: particle.speed * 3,
//                   repeat: Infinity,
//                   ease: smooth,
//                 }}
//               />
//             ))}

//             <motion.div
//               className="absolute top-8 left-8 text-purple-300 font-mono text-sm"
//               animate={{
//                 opacity: [0.7, 1, 0.7],
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <div className="font-light tracking-wide">THE VOID</div>
//               <div className="text-xs mt-1 opacity-70">Between dimensions</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Phase 3: Tesseract Space */}
//         {phase === 'tesseract' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1 }}
//           >
//             {/* 4D cubes */}
//             <div className="absolute inset-0 flex items-center justify-center">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <motion.div
//                   key={i}
//                   className="absolute border-2 border-white/40"
//                   style={{
//                     width: '60px',
//                     height: '60px',
//                     left: `${45 + (i % 3) * 10}%`,
//                     top: `${45 + Math.floor(i / 3) * 10}%`,
//                     transform: 'translate(-50%, -50%)',
//                   }}
//                   animate={{
//                     rotateX: [0, 360],
//                     rotateY: [0, 360],
//                     rotateZ: [0, 180],
//                     scale: [0.5, 1.2, 0.5],
//                     opacity: [0.3, 0.8, 0.3],
//                   }}
//                   transition={{
//                     duration: 4,
//                     repeat: Infinity,
//                     delay: i * 0.2,
//                     ease: "easeInOut",
//                   }}
//                 />
//               ))}
//             </div>

//             {/* Grid overlay */}
//             <motion.div
//               className="absolute inset-0 opacity-20"
//               animate={{
//                 background: [
//                   'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
//                   'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
//                   'linear-gradient(225deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
//                   'linear-gradient(315deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
//                 ],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             />

//             <motion.div
//               className="absolute top-8 left-8 text-white font-mono text-sm"
//               animate={{
//                 textShadow: ['0 0 10px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.8)', '0 0 10px rgba(255,255,255,0.5)'],
//               }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <div className="font-light tracking-wide">TESSERACT</div>
//               <div className="text-xs mt-1 opacity-70">4th dimensional space</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Phase 4: Arrival */}
//         {phase === 'arrival' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1 }}
//           >
//             {/* Bright flash */}
//             <motion.div
//               className="absolute inset-0 bg-white"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: [0, 0.8, 0] }}
//               transition={{ duration: 1.5 }}
//             />

//             {/* New stars appearing */}
//             {cosmicElements.particles.slice(0, 60).map((star) => (
//               <motion.div
//                 key={star.id}
//                 className="absolute rounded-full bg-white"
//                 style={{
//                   left: `${star.x}%`,
//                   top: `${star.y}%`,
//                   width: `${star.size}px`,
//                   height: `${star.size}px`,
//                 }}
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 0.8, scale: 1 }}
//                 transition={{
//                   delay: 1 + Math.random() * 1,
//                   duration: 1,
//                   ease: dramatic,
//                 }}
//               />
//             ))}

//             {/* Destination text */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
//               initial={{ opacity: 0, scale: 0.5, y: 50 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               transition={{ delay: 1.5, duration: 2, ease: dramatic }}
//             >
//               <motion.div
//                 className="text-cyan-300 text-sm font-light mb-3 tracking-widest uppercase"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 2, duration: 1 }}
//               >
//                 New Universe
//               </motion.div>
              
//               <motion.div
//                 className="text-white text-4xl font-light mb-2"
//                 initial={{ opacity: 0, letterSpacing: '0.5em' }}
//                 animate={{ opacity: 1, letterSpacing: '0.1em' }}
//                 transition={{ delay: 2.5, duration: 1.5 }}
//                 style={{
//                   textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
//                 }}
//               >
//                 {targetStation?.name || 'DESTINATION'}
//               </motion.div>
              
//               <motion.div
//                 className="text-blue-300 text-sm font-light"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 3, duration: 1 }}
//               >
//                 Dimensional transition complete
//               </motion.div>
//             </motion.div>

//             <motion.div
//               className="absolute top-8 left-8 text-green-300 font-mono text-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1, duration: 1 }}
//             >
//               <div className="font-light tracking-wide">ARRIVAL</div>
//               <div className="text-xs mt-1 opacity-70">Journey complete</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Progress Bar */}
//         <motion.div
//           className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 1 }}
//         >
//           <div className="w-80 h-1.5 bg-gray-900 rounded-full overflow-hidden">
//             <motion.div
//               className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-full"
//               animate={{ width: `${progress}%` }}
//               transition={{ ease: "easeOut" }}
//             />
//           </div>
          
//           <motion.div 
//             className="text-center text-cyan-300 text-sm mt-2 font-mono font-light"
//             animate={{ opacity: [0.8, 1, 0.8] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             {Math.round(progress)}% • {phase.toUpperCase()}
//           </motion.div>
//         </motion.div>

//         {/* Vignette */}
//         <div 
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.6) 100%)',
//           }}
//         />
//       </motion.div>
//     </AnimatePresence>
//   );
// };





// const WarpOverlay = ({ isWarping, onWarpComplete, targetStation }) => {
//   const [phase, setPhase] = useState('engage');
//   const [progress, setProgress] = useState(0);
  
//   // Optimized easing curves
//   const smooth = [0.4, 0, 0.2, 1];
//   const dramatic = [0.68, -0.55, 0.265, 1.55];

//   // Scalable star field - fewer stars, better performance
//   const stars = useMemo(() => 
//     Array.from({ length: 300 }, (_, i) => ({
//       id: i,
//       x: Math.random() * 100,
//       y: Math.random() * 100,
//       size: Math.random() * 2 + 0.5,
//       speed: Math.random() * 1 + 0.5,
//       layer: i < 100 ? 'near' : i < 200 ? 'mid' : 'far',
//     }))
//   , []);

//   useEffect(() => {
//     if (isWarping) {
//       setPhase('engage');
//       setProgress(0);
      
//       // Smooth progress with consistent timing
//       const progressTimer = setInterval(() => {
//         setProgress(prev => Math.min(prev + 1.2, 100));
//       }, 50);
      
//       // Simplified phase timing
//       const engageTimer = setTimeout(() => setPhase('warp'), 1800);
//       const warpTimer = setTimeout(() => setPhase('arrival'), 4500);
//       const arrivalTimer = setTimeout(() => {
//         onWarpComplete();
//         setPhase('engage');
//         setProgress(0);
//       }, 7000);

//       return () => {
//         clearInterval(progressTimer);
//         [engageTimer, warpTimer, arrivalTimer].forEach(clearTimeout);
//       };
//     }
//   }, [isWarping, onWarpComplete]);

//   if (!isWarping) return null;

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         className="fixed inset-0 z-50 bg-black overflow-hidden select-none"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.6 }}
//       >
//         {/* Phase 1: Engage */}
//         {phase === 'engage' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0, scale: 1.1 }}
//             transition={{ duration: 0.8, ease: smooth }}
//           >
//             {/* Stars appear and start glowing */}
//             {stars.map((star) => (
//               <motion.div
//                 key={star.id}
//                 className="absolute rounded-full bg-white"
//                 style={{
//                   left: `${star.x}%`,
//                   top: `${star.y}%`,
//                   width: `${star.size}px`,
//                   height: `${star.size}px`,
//                 }}
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ 
//                   opacity: star.layer === 'near' ? 0.9 : star.layer === 'mid' ? 0.6 : 0.3,
//                   scale: [0, 1, 1.2, 1],
//                 }}
//                 transition={{ 
//                   duration: 1.5,
//                   delay: Math.random() * 0.8,
//                   ease: smooth,
//                 }}
//               />
//             ))}

//             {/* Central energy buildup */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//               initial={{ scale: 0, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 1.2, ease: dramatic }}
//             >
//               <div 
//                 className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_30px_#22d3ee,0_0_60px_#22d3ee]"
//               />
//             </motion.div>

//             {/* Simple expanding ring */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/60"
//               initial={{ width: 0, height: 0, opacity: 0 }}
//               animate={{ 
//                 width: 200,
//                 height: 200,
//                 opacity: [0, 0.8, 0],
//               }}
//               transition={{ delay: 1, duration: 1.5, ease: smooth }}
//             />

//             <motion.div
//               className="absolute top-8 left-8 text-cyan-300 font-mono text-sm"
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.8, duration: 0.8 }}
//             >
//               <div className="font-light tracking-wide">WARP DRIVE</div>
//               <div className="text-xs mt-1 opacity-70">Engaging...</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Phase 2: Warp */}
//         {phase === 'warp' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.4 }}
//           >
//             {/* Star streaking effect */}
//             {stars.map((star) => {
//               const centerX = 50;
//               const centerY = 50;
//               const angle = Math.atan2(star.y - centerY, star.x - centerX);
//               const distance = Math.sqrt((star.x - centerX) ** 2 + (star.y - centerY) ** 2);
              
//               return (
//                 <motion.div
//                   key={star.id}
//                   className="absolute bg-white origin-center"
//                   style={{
//                     left: `${star.x}%`,
//                     top: `${star.y}%`,
//                     width: `${star.size}px`,
//                     transform: `rotate(${angle}rad)`,
//                   }}
//                   animate={{
//                     height: star.layer === 'near' ? [star.size, 150] : 
//                             star.layer === 'mid' ? [star.size, 100] : [star.size, 60],
//                     opacity: star.layer === 'near' ? [0.9, 1, 0.7] : 
//                              star.layer === 'mid' ? [0.6, 0.8, 0.5] : [0.3, 0.5, 0.2],
//                     x: [0, Math.cos(angle) * distance * 2],
//                     y: [0, Math.sin(angle) * distance * 2],
//                   }}
//                   transition={{
//                     duration: star.speed * 2.5,
//                     repeat: Infinity,
//                     ease: "linear",
//                     delay: Math.random() * 0.5,
//                   }}
//                 />
//               );
//             })}

//             {/* Central warp core */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
//               animate={{
//                 scale: [1, 1.5, 1],
//                 opacity: [0.8, 1, 0.8],
//               }}
//               transition={{
//                 duration: 1.8,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//               <div 
//                 className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
//                 style={{
//                   filter: 'blur(8px)',
//                   boxShadow: '0 0 40px rgba(34, 211, 238, 0.8)',
//                 }}
//               />
//             </motion.div>

//             {/* Warp rings */}
//             {Array.from({ length: 8 }).map((_, i) => (
//               <motion.div
//                 key={i}
//                 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/30"
//                 style={{
//                   width: 120 + i * 40,
//                   height: 120 + i * 40,
//                 }}
//                 animate={{
//                   scale: [1, 0.2],
//                   opacity: [0.6, 0],
//                 }}
//                 transition={{
//                   duration: 1.2,
//                   repeat: Infinity,
//                   delay: i * 0.15,
//                   ease: "easeOut",
//                 }}
//               />
//             ))}

//             <motion.div
//               className="absolute top-8 left-8 text-cyan-300 font-mono text-sm"
//               animate={{
//                 color: ['#67e8f9', '#ffffff', '#67e8f9'],
//               }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//             >
//               <div className="font-light tracking-wide">WARP TUNNEL</div>
//               <div className="text-xs mt-1 opacity-70">Transit active</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Phase 3: Arrival */}
//         {phase === 'arrival' && (
//           <motion.div
//             className="absolute inset-0"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Bright flash */}
//             <motion.div
//               className="absolute inset-0 bg-white"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: [0, 0.7, 0] }}
//               transition={{ duration: 1.2, ease: smooth }}
//             />

//             {/* Stars reappear */}
//             {stars.slice(0, 150).map((star) => (
//               <motion.div
//                 key={star.id}
//                 className="absolute rounded-full bg-white"
//                 style={{
//                   left: `${star.x}%`,
//                   top: `${star.y}%`,
//                   width: `${star.size}px`,
//                   height: `${star.size}px`,
//                 }}
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ 
//                   opacity: 0.8,
//                   scale: 1,
//                 }}
//                 transition={{
//                   delay: 0.8 + Math.random() * 0.8,
//                   duration: 1,
//                   ease: dramatic,
//                 }}
//               />
//             ))}

//             {/* Destination reveal */}
//             <motion.div
//               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
//               initial={{ opacity: 0, scale: 0.5, y: 30 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               transition={{ delay: 1.2, duration: 1.5, ease: dramatic }}
//             >
//               <motion.div
//                 className="text-cyan-300 text-xs font-light mb-3 tracking-widest uppercase"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 1.8, duration: 0.8 }}
//               >
//                 Arrival
//               </motion.div>
              
//               <motion.div
//                 className="text-white text-3xl font-light mb-2"
//                 initial={{ 
//                   opacity: 0, 
//                   letterSpacing: '0.3em',
//                 }}
//                 animate={{ 
//                   opacity: 1, 
//                   letterSpacing: '0.05em',
//                 }}
//                 transition={{ delay: 2, duration: 1.2 }}
//                 style={{
//                   textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
//                 }}
//               >
//                 {targetStation?.name || 'DESTINATION'}
//               </motion.div>
              
//               <motion.div
//                 className="text-cyan-400 text-xs font-light tracking-wide"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 2.5, duration: 0.8 }}
//               >
//                 Coordinates synchronized
//               </motion.div>
//             </motion.div>

//             <motion.div
//               className="absolute top-8 left-8 text-green-300 font-mono text-sm"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1, duration: 0.8 }}
//             >
//               <div className="font-light tracking-wide">ARRIVAL</div>
//               <div className="text-xs mt-1 opacity-70">Complete</div>
//             </motion.div>
//           </motion.div>
//         )}

//         {/* Simple Progress Bar */}
//         <motion.div
//           className="absolute bottom-8 left-1/2 -translate-x-1/2"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.8 }}
//         >
//           <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
//             <motion.div
//               className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
//               animate={{ width: `${progress}%` }}
//               transition={{ ease: "easeOut" }}
//             />
//           </div>
          
//           <motion.div 
//             className="text-center text-cyan-300 text-xs mt-2 font-mono font-light"
//             animate={{ opacity: [0.7, 1, 0.7] }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             {Math.round(progress)}%
//           </motion.div>
//         </motion.div>

//         {/* Subtle vignette */}
//         <div 
//           className="absolute inset-0 pointer-events-none"
//           style={{
//             background: 'radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.4) 100%)',
//           }}
//         />
//       </motion.div>
//     </AnimatePresence>
//   );
// };


// const WarpOverlay = ({ isWarping, onWarpComplete, targetStation }) => {
//   const [phase, setPhase] = useState('engage');
//   const [progress, setProgress] = useState(0);
  
//   // Motion values for smooth transitions
//   const warpIntensity = useMotionValue(0);
//   const tunnelDepth = useMotionValue(0);
  
//   // Ultra-smooth easing curves
//   const silky = [0.25, 0.46, 0.45, 0.94];
//   const cinematic = [0.83, 0, 0.17, 1];
//   const elastic = [0.68, -0.55, 0.265, 1.55];

//   // Optimized star field with layers for depth
//   const starField = useMemo(() => {
//     const layers = {
//       distant: Array.from({ length: 80 }, (_, i) => ({
//         id: `distant-${i}`,
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 0.8 + 0.3,
//         speed: Math.random() * 0.3 + 0.1,
//         brightness: Math.random() * 0.4 + 0.2,
//         layer: 'distant',
//         distance: Math.random() * 50 + 80
//       })),
//       mid: Array.from({ length: 120 }, (_, i) => ({
//         id: `mid-${i}`,
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 1.2 + 0.5,
//         speed: Math.random() * 0.6 + 0.3,
//         brightness: Math.random() * 0.5 + 0.4,
//         layer: 'mid',
//         distance: Math.random() * 40 + 40
//       })),
//       close: Array.from({ length: 100 }, (_, i) => ({
//         id: `close-${i}`,
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 2 + 1,
//         speed: Math.random() * 1 + 0.7,
//         brightness: Math.random() * 0.6 + 0.6,
//         layer: 'close',
//         distance: Math.random() * 30 + 10
//       }))
//     };
//     return [...layers.distant, ...layers.mid, ...layers.close];
//   }, []);

//   // Smooth progress animation
//   const animateProgress = useCallback(() => {
//     if (!isWarping) return;
    
//     const startTime = Date.now();
//     const duration = 6500; // Total animation duration
    
//     const updateProgress = () => {
//       const elapsed = Date.now() - startTime;
//       const progressValue = Math.min((elapsed / duration) * 100, 100);
      
//       // Smooth easing function
//       const easedProgress = progressValue < 50 
//         ? 2 * progressValue * progressValue / 100 / 100 * 100
//         : 100 - Math.pow(-2 * progressValue / 100 + 2, 3) / 2 * 100;
      
//       setProgress(easedProgress);
      
//       if (progressValue < 100) {
//         requestAnimationFrame(updateProgress);
//       }
//     };
    
//     requestAnimationFrame(updateProgress);
//   }, [isWarping]);

//   useEffect(() => {
//     if (isWarping) {
//       setPhase('engage');
//       setProgress(0);
      
//       // Start smooth progress
//       animateProgress();
      
//       // Phase transitions with smooth timing
//       const phases = [
//         { phase: 'engage', delay: 0 },
//         { phase: 'tunnel', delay: 2000 },
//         { phase: 'warp', delay: 3500 },
//         { phase: 'arrival', delay: 5500 },
//       ];
      
//       const timers = phases.map(({ phase, delay }) =>
//         setTimeout(() => setPhase(phase), delay)
//       );
      
//       const completeTimer = setTimeout(() => {
//         onWarpComplete();
//         setPhase('engage');
//         setProgress(0);
//         warpIntensity.set(0);
//         tunnelDepth.set(0);
//       }, 7200);
      
//       return () => {
//         [...timers, completeTimer].forEach(clearTimeout);
//       };
//     }
//   }, [isWarping, onWarpComplete, animateProgress, warpIntensity, tunnelDepth]);

//   // Update motion values based on phase
//   useEffect(() => {
//     if (phase === 'tunnel') {
//       warpIntensity.set(0.3);
//       tunnelDepth.set(0.5);
//     } else if (phase === 'warp') {
//       warpIntensity.set(1);
//       tunnelDepth.set(1);
//     } else if (phase === 'arrival') {
//       warpIntensity.set(0);
//       tunnelDepth.set(0);
//     }
//   }, [phase, warpIntensity, tunnelDepth]);

//   if (!isWarping) return null;

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         className="fixed inset-0 z-50 bg-black overflow-hidden select-none"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.8, ease: cinematic }}
//       >
//         {/* Dynamic Star Field */}
//         <div className="absolute inset-0">
//           {starField.map((star) => {
//             const centerX = 50;
//             const centerY = 50;
//             const deltaX = star.x - centerX;
//             const deltaY = star.y - centerY;
//             const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
//             const angle = Math.atan2(deltaY, deltaX);
            
//             return (
//               <Star
//                 key={star.id}
//                 star={star}
//                 phase={phase}
//                 angle={angle}
//                 distance={distance}
//                 progress={progress}
//               />
//             );
//           })}
//         </div>

//         {/* Central Warp Core */}
//         <WarpCore phase={phase} progress={progress} />

//         {/* Tunnel Effect */}
//         {(phase === 'tunnel' || phase === 'warp') && (
//           <TunnelEffect phase={phase} progress={progress} />
//         )}

//         {/* Phase-specific overlays */}
//         {phase === 'engage' && <EngageOverlay />}
//         {phase === 'arrival' && <ArrivalOverlay targetStation={targetStation} />}

//         {/* Progress Indicator */}
//         <ProgressBar progress={progress} phase={phase} />

//         {/* Atmospheric Effects */}
//         <AtmosphericEffects phase={phase} />
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// // Individual Star Component for better performance
// const Star = React.memo(({ star, phase, angle, distance, progress }) => {
//   const getStarTransforms = () => {
//     switch (phase) {
//       case 'engage':
//         return {
//           x: 0,
//           y: 0,
//           scale: [0.5, 1, 1.1, 1],
//           opacity: star.brightness,
//           width: star.size,
//           height: star.size,
//         };
      
//       case 'tunnel':
//         const tunnelStretch = Math.min(distance * 0.3, 20);
//         return {
//           x: Math.cos(angle) * tunnelStretch,
//           y: Math.sin(angle) * tunnelStretch,
//           scale: 1 + (star.layer === 'close' ? 0.3 : 0.1),
//           opacity: star.brightness * 0.9,
//           width: star.size,
//           height: star.size + tunnelStretch * 0.5,
//         };
      
//       case 'warp':
//         const warpDistance = distance * (2 + star.speed);
//         const streakLength = star.layer === 'close' ? 60 : star.layer === 'mid' ? 40 : 25;
//         return {
//           x: Math.cos(angle) * warpDistance,
//           y: Math.sin(angle) * warpDistance,
//           scale: 1,
//           opacity: star.brightness * (star.layer === 'close' ? 1.2 : 0.8),
//           width: star.size * 0.8,
//           height: streakLength,
//           rotate: (angle * 180) / Math.PI,
//         };
      
//       case 'arrival':
//         return {
//           x: 0,
//           y: 0,
//           scale: 1,
//           opacity: star.brightness * 0.7,
//           width: star.size,
//           height: star.size,
//         };
      
//       default:
//         return {
//           x: 0,
//           y: 0,
//           scale: 1,
//           opacity: star.brightness,
//           width: star.size,
//           height: star.size,
//         };
//     }
//   };

//   const transforms = getStarTransforms();

//   return (
//     <motion.div
//       className="absolute bg-white rounded-full"
//       style={{
//         left: `${star.x}%`,
//         top: `${star.y}%`,
//         transformOrigin: 'center center',
//       }}
//       animate={{
//         ...transforms,
//         filter: phase === 'warp' 
//           ? `blur(${star.layer === 'close' ? 0.5 : 0.2}px) brightness(${1 + star.speed * 0.3})`
//           : 'blur(0px) brightness(1)',
//       }}
//       transition={{
//         duration: phase === 'engage' ? 1.8 : 
//                  phase === 'tunnel' ? 1.2 :
//                  phase === 'warp' ? 0.8 : 1.5,
//         ease: phase === 'warp' ? 'linear' : [0.25, 0.46, 0.45, 0.94],
//         delay: phase === 'engage' ? Math.random() * 0.6 : 0,
//       }}
//     />
//   );
// });

// // Warp Core Component
// const WarpCore = ({ phase, progress }) => (
//   <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//     {phase === 'engage' && (
//       <motion.div
//         className="relative"
//         initial={{ scale: 0, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ delay: 0.5, duration: 1.5, ease: [0.68, -0.55, 0.265, 1.55] }}
//       >
//         <div 
//           className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
//           style={{
//             filter: 'blur(2px)',
//             boxShadow: '0 0 30px rgba(34, 211, 238, 0.8), 0 0 60px rgba(34, 211, 238, 0.4)',
//           }}
//         />
        
//         {/* Pulsing rings */}
//         {Array.from({ length: 3 }).map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/40"
//             style={{
//               width: 40 + i * 30,
//               height: 40 + i * 30,
//             }}
//             animate={{
//               scale: [1, 1.3, 1],
//               opacity: [0.6, 0.2, 0.6],
//             }}
//             transition={{
//               duration: 2 + i * 0.5,
//               repeat: Infinity,
//               ease: 'easeInOut',
//             }}
//           />
//         ))}
//       </motion.div>
//     )}

//     {(phase === 'tunnel' || phase === 'warp') && (
//       <motion.div
//         className="relative"
//         animate={{
//           scale: phase === 'warp' ? [1, 1.5, 1.2] : [1, 1.2, 1],
//           opacity: [0.9, 1, 0.9],
//         }}
//         transition={{
//           duration: phase === 'warp' ? 1.2 : 2,
//           repeat: Infinity,
//           ease: 'easeInOut',
//         }}
//       >
//         <div 
//           className={`rounded-full bg-gradient-to-r ${
//             phase === 'warp' 
//               ? 'from-white via-cyan-300 to-blue-500 w-32 h-32' 
//               : 'from-cyan-300 to-blue-400 w-16 h-16'
//           }`}
//           style={{
//             filter: `blur(${phase === 'warp' ? 12 : 6}px)`,
//             boxShadow: `0 0 ${phase === 'warp' ? 80 : 40}px rgba(34, 211, 238, ${phase === 'warp' ? 1 : 0.8})`,
//           }}
//         />
//       </motion.div>
//     )}
//   </motion.div>
// );

// // Tunnel Effect Component
// const TunnelEffect = ({ phase, progress }) => (
//   <div className="absolute inset-0 flex items-center justify-center">
//     {Array.from({ length: 12 }).map((_, i) => (
//       <motion.div
//         key={i}
//         className="absolute rounded-full border border-cyan-400/20"
//         style={{
//           width: 200 + i * 100,
//           height: 200 + i * 100,
//         }}
//         animate={{
//           scale: phase === 'warp' ? [1, 0.1] : [1, 0.8, 1],
//           opacity: phase === 'warp' ? [0.4, 0] : [0.3, 0.6, 0.3],
//         }}
//         transition={{
//           duration: phase === 'warp' ? 1.5 : 3,
//           repeat: Infinity,
//           delay: i * (phase === 'warp' ? 0.1 : 0.2),
//           ease: phase === 'warp' ? 'easeOut' : 'easeInOut',
//         }}
//       />
//     ))}
//   </div>
// );

// // Engage Phase Overlay
// const EngageOverlay = () => (
//   <motion.div
//     className="absolute top-8 left-8 text-cyan-300 font-mono text-sm"
//     initial={{ opacity: 0, y: -20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.8, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
//   >
//     <motion.div 
//       className="font-light tracking-wider text-base"
//       animate={{ opacity: [0.7, 1, 0.7] }}
//       transition={{ duration: 2.5, repeat: Infinity }}
//     >
//       WARP DRIVE ENGAGING
//     </motion.div>
//     <motion.div 
//       className="text-xs mt-2 opacity-70"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 0.7 }}
//       transition={{ delay: 1.2 }}
//     >
//       Spatial coordinates locked
//     </motion.div>
//   </motion.div>
// );

// // Arrival Phase Overlay
// const ArrivalOverlay = ({ targetStation }) => (
//   <motion.div
//     className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
//     initial={{ opacity: 0, scale: 0.8, y: 50 }}
//     animate={{ opacity: 1, scale: 1, y: 0 }}
//     transition={{ delay: 0.5, duration: 2, ease: [0.68, -0.55, 0.265, 1.55] }}
//   >
//     <motion.div
//       className="text-cyan-300 text-sm font-light mb-4 tracking-widest uppercase"
//       initial={{ opacity: 0, letterSpacing: '0.5em' }}
//       animate={{ opacity: 1, letterSpacing: '0.3em' }}
//       transition={{ delay: 1, duration: 1.5 }}
//     >
//       Destination Reached
//     </motion.div>
    
//     <motion.div
//       className="text-white text-4xl font-extralight mb-4"
//       initial={{ opacity: 0, scale: 0.5 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{ delay: 1.5, duration: 1.8, ease: [0.68, -0.55, 0.265, 1.55] }}
//       style={{
//         textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
//         fontFamily: 'system-ui, -apple-system, sans-serif',
//       }}
//     >
//       {targetStation?.name || 'NEW HORIZON'}
//     </motion.div>
    
//     <motion.div
//       className="text-cyan-400 text-sm font-light tracking-wide"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ delay: 2.5, duration: 1 }}
//     >
//       Welcome to your destination
//     </motion.div>
//   </motion.div>
// );

// // Progress Bar Component
// const ProgressBar = ({ progress, phase }) => (
//   <motion.div
//     className="absolute bottom-8 left-1/2 -translate-x-1/2"
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: 0.5, duration: 1 }}
//   >
//     <div className="w-80 h-1.5 bg-gray-900/80 rounded-full overflow-hidden backdrop-blur-sm">
//       <motion.div
//         className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 rounded-full"
//         style={{
//           width: `${progress}%`,
//           filter: 'blur(0.5px)',
//           boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)',
//         }}
//         transition={{ type: 'spring', stiffness: 200, damping: 40 }}
//       />
//     </div>
    
//     <motion.div 
//       className="text-center text-cyan-300 text-xs mt-3 font-mono font-light tracking-wider"
//       animate={{ 
//         opacity: [0.6, 1, 0.6],
//         color: phase === 'arrival' ? '#10b981' : '#67e8f9'
//       }}
//       transition={{ duration: 2, repeat: Infinity }}
//     >
//       {phase === 'arrival' ? 'COMPLETE' : `${Math.round(progress)}%`}
//     </motion.div>
//   </motion.div>
// );

// // Atmospheric Effects
// const AtmosphericEffects = ({ phase }) => (
//   <>
//     {/* Subtle vignette */}
//     <div 
//       className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
//       style={{
//         background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
//         opacity: phase === 'warp' ? 0.8 : 0.3,
//       }}
//     />
    
//     {/* Light flash for arrival */}
//     {phase === 'arrival' && (
//       <motion.div
//         className="absolute inset-0 bg-white pointer-events-none"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: [0, 0.4, 0] }}
//         transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
//       />
//     )}
//   </>
// );

// Demo Component





const WarpOverlay = ({ isWarping, onWarpComplete, targetStation }) => {
  const [phase, setPhase] = useState('dive');
  const [progress, setProgress] = useState(0);
  
  // Ultra-smooth easing
  const smoothEasing = [0.25, 0.1, 0.25, 1];

  // Optimized star field for 60fps performance
  const starField = useMemo(() => ({
    // Layer 1: Close stars (fastest)
    close: Array.from({ length: 80 }, (_, i) => ({
      id: `close-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 1,
      speed: 1,
      brightness: Math.random() * 0.4 + 0.6,
    })),
    
    // Layer 2: Medium stars
    medium: Array.from({ length: 120 }, (_, i) => ({
      id: `med-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1 + 0.5,
      speed: 0.7,
      brightness: Math.random() * 0.3 + 0.4,
    })),
    
    // Layer 3: Far stars (slowest)
    far: Array.from({ length: 200 }, (_, i) => ({
      id: `far-${i}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 0.8 + 0.3,
      speed: 0.4,
      brightness: Math.random() * 0.2 + 0.2,
    })),
  }), []);

  useEffect(() => {
    if (isWarping) {
      setPhase('dive');
      setProgress(0);
      
      // Smooth progress increment
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 0.5; // Slower, smoother increment
        });
      }, 30);
      
      // Phase transitions
      const diveTimer = setTimeout(() => setPhase('tunnel'), 3000);
      const tunnelTimer = setTimeout(() => setPhase('breach'), 8000);
      const breachTimer = setTimeout(() => setPhase('emerge'), 10000);
      const completeTimer = setTimeout(() => {
        onWarpComplete();
        setPhase('dive');
        setProgress(0);
      }, 12500);

      return () => {
        clearInterval(progressInterval);
        [diveTimer, tunnelTimer, breachTimer, completeTimer].forEach(clearTimeout);
      };
    }
  }, [isWarping, onWarpComplete]);

  if (!isWarping) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 bg-black overflow-hidden select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: smoothEasing }}
        style={{ 
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        }}
      >
        {/* Phase 1: Deep Space Dive */}
        <AnimatePresence>
          {phase === 'dive' && (
            <motion.div
              className="absolute inset-0"
              key="dive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: smoothEasing }}
            >
              {/* Far stars - slowest movement */}
              {starField.far.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.brightness,
                    willChange: 'transform',
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [star.brightness * 0.8, star.brightness, star.brightness * 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Medium stars */}
              {starField.medium.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-blue-100"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.brightness,
                    willChange: 'transform',
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [star.brightness * 0.7, star.brightness, star.brightness * 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Close stars */}
              {starField.close.map((star) => (
                <motion.div
                  key={star.id}
                  className="absolute rounded-full bg-cyan-200"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    opacity: star.brightness,
                    willChange: 'transform',
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [star.brightness * 0.6, star.brightness, star.brightness * 0.6],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Gentle cosmic background */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    'radial-gradient(circle at 30% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 70% 30%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1, ease: smoothEasing }}
              >
                <motion.h1
                  className="text-4xl font-thin text-white mb-4 tracking-wider"
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  UNIVERSE DIVE
                </motion.h1>
                <motion.p
                  className="text-cyan-300 text-lg font-light"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Initiating deep space traverse
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Star Tunnel */}
        <AnimatePresence>
          {phase === 'tunnel' && (
            <motion.div
              className="absolute inset-0"
              key="tunnel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: smoothEasing }}
            >
              {/* All stars moving toward center with different speeds */}
              {[...starField.far, ...starField.medium, ...starField.close].map((star) => {
                const centerX = 50;
                const centerY = 50;
                const deltaX = centerX - star.x;
                const deltaY = centerY - star.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const normalizedSpeed = star.speed * (distance / 50);

                return (
                  <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                      left: `${star.x}%`,
                      top: `${star.y}%`,
                      width: `${star.size}px`,
                      height: `${star.size}px`,
                      willChange: 'transform, opacity',
                    }}
                    animate={{
                      x: [0, deltaX * normalizedSpeed * 15],
                      y: [0, deltaY * normalizedSpeed * 15],
                      opacity: [star.brightness, star.brightness, 0],
                      scale: [1, 1 + normalizedSpeed * 0.5, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: smoothEasing,
                      repeatDelay: 0,
                    }}
                  />
                );
              })}

              {/* Tunnel effect rings */}
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute top-1/2 left-1/2 border border-cyan-400/20 rounded-full"
                  style={{
                    width: `${100 + i * 50}px`,
                    height: `${100 + i * 50}px`,
                    transform: 'translate(-50%, -50%)',
                    willChange: 'transform, opacity',
                  }}
                  animate={{
                    scale: [0.1, 2],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Center glow */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div 
                  className="w-32 h-32 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                />
              </motion.div>

              <motion.div
                className="absolute top-8 left-8 text-cyan-300 text-lg font-light"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                HYPERDRIVE TUNNEL
                <div className="text-sm opacity-70 mt-1">
                  Approaching light speed
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 3: Dimensional Breach */}
        <AnimatePresence>
          {phase === 'breach' && (
            <motion.div
              className="absolute inset-0"
              key="breach"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: smoothEasing }}
            >
              {/* White flash transition */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: smoothEasing,
                }}
              />

              <motion.div
                className="absolute top-8 left-8 text-white text-lg font-light"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                DIMENSIONAL BREACH
                <div className="text-sm opacity-80 mt-1">
                  Reality barrier crossed
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 4: Universe Emergence */}
        <AnimatePresence>
          {phase === 'emerge' && (
            <motion.div
              className="absolute inset-0"
              key="emerge"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: smoothEasing }}
            >
              {/* New universe star field */}
              {[...starField.far, ...starField.medium].map((star, index) => (
                <motion.div
                  key={`new-${star.id}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size * 1.2}px`,
                    height: `${star.size * 1.2}px`,
                    willChange: 'transform, opacity',
                  }}
                  initial={{ 
                    opacity: 0, 
                    scale: 0,
                    rotate: 180,
                  }}
                  animate={{ 
                    opacity: star.brightness, 
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    delay: Math.random() * 1.5,
                    duration: 1.2,
                    ease: smoothEasing,
                  }}
                />
              ))}

              {/* Destination reveal */}
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1.5, ease: smoothEasing }}
              >
                <motion.div
                  className="text-cyan-300 text-sm font-light mb-3 uppercase tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                >
                  Universe Transfer Complete
                </motion.div>
                
                <motion.div
                  className="text-white text-5xl font-thin mb-4 tracking-wide"
                  initial={{ opacity: 0, letterSpacing: '1em' }}
                  animate={{ opacity: 1, letterSpacing: '0.1em' }}
                  transition={{ delay: 2, duration: 1.5, ease: smoothEasing }}
                >
                  {targetStation?.name || 'NEW DIMENSION'}
                </motion.div>
                
                <motion.div
                  className="text-blue-300 text-lg font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5, duration: 1 }}
                >
                  Welcome to your destination universe
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smooth Progress Bar */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: smoothEasing }}
        >
          <div className="w-72 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              style={{
                width: `${progress}%`,
                willChange: 'width',
              }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>
          
          <motion.div 
            className="text-center text-cyan-300 text-xs mt-2 font-mono tracking-wider"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {Math.round(progress)}% • {phase.toUpperCase()}
          </motion.div>
        </motion.div>

        {/* Subtle vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};















// Example usage component with enhanced styling




// Example usage component
const WarpDemo = () => {
  const [isWarping, setIsWarping] = useState(false);
  const [targetStation] = useState({ name: "Kepler Station" });

  const handleWarpStart = () => {
    setIsWarping(true);
  };

  const handleWarpComplete = () => {
    setIsWarping(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {!isWarping && (
        <motion.button
          onClick={handleWarpStart}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg text-lg tracking-wider hover:from-cyan-400 hover:to-purple-500 transition-all duration-300"
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 245, 255, 0.5)" }}
          whileTap={{ scale: 0.95 }}
        >
          INITIATE WARP SEQUENCE
        </motion.button>
      )}
      
      <InterstellarWarpOverlay
        isWarping={isWarping}
        onWarpComplete={handleWarpComplete}
        targetStation={targetStation}
      />
    </div>
  );
};



// Enhanced Station detail page component
const StationDetail = ({ station, onBack }) => {
  const chartData = {
    agriculture: { value: 85, trend: '+12%', prediction: 'Crop yield increase expected' },
    health: { value: 92, trend: '+8%', prediction: 'Disease prevention improving' },
    technology: { value: 78, trend: '+15%', prediction: 'Innovation acceleration detected' },
    space: { value: 96, trend: '+5%', prediction: 'Exploration missions expanding' },
    oceans: { value: 74, trend: '+18%', prediction: 'Climate monitoring enhanced' }
  };

  const data = chartData[station.id] || chartData.agriculture;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Starfield count={100} speed={0.05} />
      <NebulaBackground />
      
      <div className="relative z-10 p-8">
        {/* Back button */}
        <motion.button
          onClick={onBack}
          className="mb-8 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg border border-cyan-500 transition-colors flex items-center shadow-lg"
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ←
          </motion.span>
          <span className="ml-2">Return to Space</span>
        </motion.button>

        {/* Station header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div 
            className="text-6xl mb-4"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            {station.icon}
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold text-white mb-4"
            initial={{ letterSpacing: '0.2em', opacity: 0 }}
            animate={{ letterSpacing: '0em', opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {station.name}
          </motion.h1>
          <motion.div 
            className="text-xl text-cyan-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Terra Analytics & Predictions
          </motion.div>
        </motion.div>

        {/* Analytics dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Main metric */}
          <motion.div
            className="bg-black bg-opacity-50 rounded-xl p-6 border border-cyan-500 backdrop-blur-sm shadow-lg"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-xl text-white mb-4">Current Status</h3>
            <div className="flex items-center justify-center h-32 relative">
              <motion.div
                className="text-6xl font-bold text-cyan-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring", stiffness: 100 }}
              >
                {data.value}%
              </motion.div>
              <motion.div 
                className="absolute bottom-0 text-green-400 text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 }}
              >
                {data.trend}
              </motion.div>
            </div>
          </motion.div>

          {/* Chart visualization */}
          <motion.div
            className="bg-black bg-opacity-50 rounded-xl p-6 border border-purple-500 backdrop-blur-sm shadow-lg"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <h3 className="text-xl text-white mb-4">Trend Analysis</h3>
            <div className="h-32 relative">
              <svg className="w-full h-full" viewBox="0 0 300 100">
                <motion.path
                  d="M10,80 Q50,60 100,50 T200,30 T290,20"
                  stroke="cyan"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 1.5 }}
                />
                <motion.circle
                  cx="290"
                  cy="20"
                  r="4"
                  fill="cyan"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 3.5, duration: 0.5 }}
                />
                
                {/* Animated data points */}
                {[10, 100, 200, 290].map((x, i) => (
                  <motion.circle
                    key={i}
                    cx={x}
                    cy={i === 0 ? 80 : i === 1 ? 50 : i === 2 ? 30 : 20}
                    r="3"
                    fill="white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.3 }}
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Prediction panel */}
          <motion.div
            className="lg:col-span-2 bg-black bg-opacity-50 rounded-xl p-6 border border-green-500 backdrop-blur-sm shadow-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            <h3 className="text-xl text-white mb-4 flex items-center">
              <motion.span
                animate={{ rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mr-2"
              >
                🔮
              </motion.span>
              AI Prediction
            </h3>
            <motion.div
              className="text-lg text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              {data.prediction}
            </motion.div>
            
            {/* Animated progress bar */}
            <div className="mt-4 bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${data.value}%` }}
                transition={{ duration: 2, delay: 2.0 }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Terra Metaverse component
const TerraMetaverse = () => {
  const [rocketPosition, setRocketPosition] = useState({ x: 400, y: 300 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isWarping, setIsWarping] = useState(false);
  const [isBoosting, setIsBoosting] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [nearbyStation, setNearbyStation] = useState(null);
  const keys = useKeyboard();

  const stations = [
    {
      id: 'agriculture',
      name: 'Agriculture',
      icon: '🌱',
      x: 20,
      y: 30,
      bgColor: 'bg-green-900',
      borderColor: 'border-green-500',
      glowColor: 'bg-green-500'
    },
    {
      id: 'health',
      name: 'Health',
      icon: '🏥',
      x: 80,
      y: 25,
      bgColor: 'bg-red-900',
      borderColor: 'border-red-500',
      glowColor: 'bg-red-500'
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: '⚙️',
      x: 75,
      y: 70,
      bgColor: 'bg-blue-900',
      borderColor: 'border-blue-500',
      glowColor: 'bg-blue-500'
    },
    {
      id: 'space',
      name: 'Space',
      icon: '🚀',
      x: 25,
      y: 75,
      bgColor: 'bg-purple-900',
      borderColor: 'border-purple-500',
      glowColor: 'bg-purple-500'
    },
    {
      id: 'oceans',
      name: 'Oceans & Weather',
      icon: '🌊',
      x: 50,
      y: 50,
      bgColor: 'bg-cyan-900',
      borderColor: 'border-cyan-500',
      glowColor: 'bg-cyan-500'
    }
  ];

  // Rocket movement logic
  useEffect(() => {
    if (isWarping || currentStation) return;

    const moveRocket = () => {
      const speed = 5;
      const friction = 0.92;
      const acceleration = 0.5;
      
      let newVelocity = { ...velocity };
      
      // Apply acceleration based on key presses
      if (keys.w || keys.arrowup) newVelocity.y -= acceleration;
      if (keys.s || keys.arrowdown) newVelocity.y += acceleration;
      if (keys.a || keys.arrowleft) newVelocity.x -= acceleration;
      if (keys.d || keys.arrowright) newVelocity.x += acceleration;
      
      // Apply friction
      newVelocity.x *= friction;
      newVelocity.y *= friction;
      
      // Limit maximum speed
      const currentSpeed = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
      if (currentSpeed > speed) {
        newVelocity.x = (newVelocity.x / currentSpeed) * speed;
        newVelocity.y = (newVelocity.y / currentSpeed) * speed;
      }
      
      setVelocity(newVelocity);
      
      // Check if boosting (significant movement)
      setIsBoosting(currentSpeed > 2);
      
      // Update position with boundary checks
      setRocketPosition(prev => ({
        x: Math.max(20, Math.min(window.innerWidth - 20, prev.x + newVelocity.x)),
        y: Math.max(20, Math.min(window.innerHeight - 20, prev.y + newVelocity.y))
      }));
    };

    const interval = setInterval(moveRocket, 16);
    return () => clearInterval(interval);
  }, [keys, velocity, isWarping, currentStation]);

  // Collision detection
  useEffect(() => {
    if (isWarping || currentStation) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let closest = null;
    let closestDistance = Infinity;

    stations.forEach(station => {
      const stationPos = {
        x: (station.x / 100) * windowWidth,
        y: (station.y / 100) * windowHeight
      };

      if (useCollision(rocketPosition, stationPos, 80)) {
        const distance = Math.sqrt(
          Math.pow(rocketPosition.x - stationPos.x, 2) + 
          Math.pow(rocketPosition.y - stationPos.y, 2)
        );
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = station;
        }
      }
    });

    setNearbyStation(closest);

    // Handle space key for interaction
    if (closest && keys[' ']) {
      handleStationInteraction(closest);
    }
  }, [rocketPosition, keys, isWarping, currentStation]);

  const handleStationInteraction = (station) => {
    if (isWarping) return;
    
    setIsWarping(true);
    setVelocity({ x: 0, y: 0 });
    setIsBoosting(false);
  };

  const handleWarpComplete = () => {
    setIsWarping(false);
    setCurrentStation(nearbyStation);
  };

  const handleBackToSpace = () => {
    setCurrentStation(null);
    setRocketPosition({ x: 400, y: 300 });
    setVelocity({ x: 0, y: 0 });
  };

  if (currentStation) {
    return <StationDetail station={currentStation} onBack={handleBackToSpace} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black overflow-hidden relative">
      <Starfield count={300} speed={0.1} />
      <NebulaBackground />
      
      {/* Instructions */}
      <motion.div
        className="absolute top-4 left-4 z-30 bg-black bg-opacity-80 text-white p-4 rounded-lg border border-cyan-500 backdrop-blur-sm shadow-lg"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="text-lg font-bold mb-2">🚀 Terra Navigation</div>
        <div className="text-sm space-y-1">
          <div>WASD / Arrow Keys: Move Rocket</div>
          <div>SPACE / Click: Enter Station</div>
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        className="absolute top-4 right-4 z-30 text-right"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div 
          className="text-3xl font-bold text-white mb-1"
          animate={{ textShadow: ["0 0 5px rgba(255,255,255,0.5)", "0 0 20px rgba(103,232,249,0.8)", "0 0 5px rgba(255,255,255,0.5)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          TERRA
        </motion.div>
        <div className="text-lg text-cyan-400">Cosmic Exploration</div>
      </motion.div>

      {/* Rocket */}
      <Rocket 
        position={rocketPosition} 
        velocity={velocity}
        isWarping={isWarping} 
        isBoosting={isBoosting}
      />

      {/* Stations */}
      {stations.map(station => (
        <Station
          key={station.id}
          station={station}
          isNearby={nearbyStation?.id === station.id}
          onCollision={() => handleStationInteraction(station)}
        />
      ))}

      {/* Warp overlay */}
      <AnimatePresence>
        <WarpOverlay
          isWarping={isWarping}
          onWarpComplete={handleWarpComplete}
          targetStation={nearbyStation}
        />
      </AnimatePresence>
    </div>
  );
};

export default TerraMetaverse;

