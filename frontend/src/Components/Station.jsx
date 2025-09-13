import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Globe, Heart, Cpu, Leaf, GraduationCap, Wifi, Atom, Play, RotateCcw, Keyboard, Info } from 'lucide-react';

// Station Component
export const Station = ({ station, index, onJumpToStation, onHover }) => {
  const IconComponent = station.icon;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(station);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHover(null);
  };

  return (
    <div
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer`}
      style={{ left: `${station.position.x}%`, top: `${station.position.y}%` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onJumpToStation(station)}
    >
      {/* Station Orbit */}
      <motion.div
        className="absolute inset-0 w-24 h-24 border-2 border-white/20 rounded-full"
        style={{ left: '-48px', top: '-48px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Station Planet */}
      <div
        className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${station.color} 
                   ${station.glowColor} shadow-2xl flex items-center justify-center
                   border border-white/30 backdrop-blur-sm transition-transform duration-300
                   ${isHovered ? 'scale-110' : 'scale-100'}`}
      >
        <IconComponent className="w-8 h-8 text-white drop-shadow-lg" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {index + 1}
        </div>
      </div>
      
      {/* Station Label */}
      <div
        className="absolute top-20 left-1/2 transform -translate-x-1/2 
                   bg-black/70 backdrop-blur-md px-4 py-2 rounded-lg
                   border border-white/20 whitespace-nowrap transition-opacity duration-300"
      >
        <div className="text-white font-bold text-sm">{station.year}</div>
        <div className="text-gray-300 text-xs">{station.title}</div>
      </div>
    </div>
  );
};

export default Station