import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Globe, Heart, Cpu, Leaf, GraduationCap, Wifi, Atom, Play, RotateCcw, Keyboard, Info } from 'lucide-react';


export const StationInfoPopup = ({ station, isVisible }) => {
  if (!station || !isVisible) return null;

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 
                 max-w-md z-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${station.color}
                       flex items-center justify-center border border-white/30`}>
          <station.icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            {station.title}
          </h3>
          <p className="text-cyan-400 font-mono">{station.year}</p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">
        {station.description}
      </p>
      
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50
                     rounded-lg p-4 border border-purple-500/20">
        <h4 className="text-purple-300 font-semibold mb-3 text-sm uppercase tracking-wider">
          Key Innovations
        </h4>
        <ul className="space-y-2">
          {station.achievements.map((achievement, index) => (
            <li
              key={index}
              className="text-gray-300 text-sm flex items-start gap-2"
            >
              <span className="text-purple-400 mt-1">◦</span>
              {achievement}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default StationInfoPopup