import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Globe, Heart, Cpu, Leaf, GraduationCap, Wifi, Atom, Play, RotateCcw, Keyboard, Info } from 'lucide-react';


const ControlPanel = ({ 
  currentYear, 
  journeyProgress, 
  isAutoMode, 
  onStartAutoJourney, 
  onResetJourney, 
  showControls, 
  onToggleControls,
  onToggleInstructions 
}) => {
  return (
    <>
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl rounded-2xl
                      border border-white/20 p-6 min-w-80 z-10"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text 
                            bg-gradient-to-r from-cyan-400 to-purple-400
                            font-mono tracking-wider">
                MISSION CONTROL
              </h2>
              <button 
                onClick={onToggleControls}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Year</span>
                <span className="text-cyan-400 font-mono font-bold text-xl">
                  {currentYear}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Progress</span>
                <span className="text-purple-400 font-mono font-bold">
                  {Math.round(journeyProgress)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500
                            shadow-lg shadow-purple-500/50"
                  initial={{ width: "0%" }}
                  animate={{ width: `${journeyProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onStartAutoJourney}
                  disabled={isAutoMode}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 
                            hover:from-cyan-400 hover:to-blue-500
                            disabled:opacity-50 disabled:cursor-not-allowed
                            text-white font-semibold py-3 px-6 rounded-lg
                            shadow-lg shadow-cyan-500/25 transition-all duration-200
                            flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  {isAutoMode ? 'TRAVELING...' : 'AUTO PILOT'}
                </button>
                
                <button
                  onClick={onResetJourney}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600
                            hover:from-purple-500 hover:to-pink-500
                            text-white font-semibold py-3 px-6 rounded-lg
                            shadow-lg shadow-purple-500/25 transition-all duration-200
                            flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  RESET
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onToggleInstructions}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600
                            hover:from-blue-500 hover:to-indigo-500
                            text-white font-semibold py-3 px-6 rounded-lg
                            shadow-lg shadow-blue-500/25 transition-all duration-200
                            flex items-center justify-center gap-2"
                >
                  <Info size={16} />
                  HELP
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="text-xs text-gray-400 space-y-1">
                <div>⌨️ SPACE: Auto pilot</div>
                <div>⌨️ ESC: Reset journey</div>
                <div>⌨️ Arrows: Navigate rocket</div>
                <div>⌨️ Ctrl+1-8: Jump to station</div>
                <div>⌨️ Ctrl+H: Toggle this panel</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Controls Button */}
      {!showControls && (
        <button
          onClick={onToggleControls}
          className="absolute top-6 left-6 bg-black/70 backdrop-blur-md rounded-lg p-3
                    border border-white/20 text-white z-10 transition-all hover:scale-110"
        >
          ☰
        </button>
      )}
    </>
  );
};

export default ControlPanel