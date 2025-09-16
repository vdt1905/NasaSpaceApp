import React from 'react';
import { motion } from 'framer-motion';

const Stations = () => {
  const stations = [
    { id: 'agriculture', name: 'Agriculture', icon: '🌱', x: 20, y: 30 },
    { id: 'health', name: 'Health', icon: '🏥', x: 70, y: 20 },
    { id: 'technology', name: 'Technology', icon: '⚙️', x: 40, y: 60 },
    { id: 'space', name: 'Space', icon: '🚀', x: 80, y: 70 },
    { id: 'oceans', name: 'Oceans/Weather', icon: '🌊', x: 30, y: 80 }
  ];

  return (
    <>
      {stations.map(station => (
        <motion.div
          key={station.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${station.x}vw`, top: `${station.y}vh` }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Station glow */}
          <div className="absolute inset-0 bg-blue-500 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
          
          {/* Station icon */}
          <div className="relative w-16 h-16 rounded-full bg-black bg-opacity-50 border-2 border-blue-400 flex items-center justify-center text-2xl z-10 station-glow">
            {station.icon}
          </div>
          
          {/* Station label */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 glass-card px-3 py-1 whitespace-nowrap">
            <span className="text-sm font-medium text-white">{station.name}</span>
          </div>
          
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                x: '-50%',
                y: '-50%'
              }}
              animate={{
                rotate: [0, 360],
                x: [0, 30 * Math.cos((i * 2 * Math.PI) / 3)],
                y: [0, 30 * Math.sin((i * 2 * Math.PI) / 3)],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </motion.div>
      ))}
    </>
  );
};

export default Stations;