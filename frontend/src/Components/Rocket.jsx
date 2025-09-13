import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Zap, Globe, Heart, Cpu, Leaf, GraduationCap, Wifi, Atom, Play, RotateCcw, Keyboard, Info } from 'lucide-react';


export const Rocket = ({ position }) => {
  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ease-out"
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        {/* Rocket Body */}
        <div
          className="relative w-12 h-20 bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500
                     rounded-t-full rounded-b-lg shadow-2xl border border-white/30"
        >
          {/* Rocket Window */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2
                        w-4 h-4 bg-cyan-300 rounded-full border-2 border-white/50
                        shadow-inner" />
          
          {/* Rocket Fins */}
          <div className="absolute bottom-0 -left-2 w-4 h-6 bg-gray-700
                        transform rotate-12 rounded-l-lg" />
          <div className="absolute bottom-0 -right-2 w-4 h-6 bg-gray-700
                        transform -rotate-12 rounded-r-lg" />
        </div>
        
        {/* Engine Flames */}
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="w-6 h-8 bg-gradient-to-b from-orange-400 via-red-500 to-yellow-300
                        rounded-b-full blur-sm" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2
                        w-4 h-6 bg-gradient-to-b from-blue-400 to-purple-500
                        rounded-b-full" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Rocket