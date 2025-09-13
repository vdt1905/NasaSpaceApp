import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Globe, Heart, Cpu, Leaf, GraduationCap, Wifi, Atom, Play, RotateCcw, Keyboard, Info } from 'lucide-react';


export const InstructionsPanel = ({ showInstructions, onToggleInstructions }) => {
  return (
    <AnimatePresence>
      {showInstructions && (
        <motion.div
          className="absolute bottom-6 left-6 bg-black/80 backdrop-blur-xl rounded-2xl
                    border border-white/20 p-6 max-w-md z-10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-transparent bg-clip-text 
                          bg-gradient-to-r from-cyan-400 to-purple-400">
              KEYBOARD CONTROLS
            </h3>
            <button 
              onClick={onToggleInstructions}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium">Arrow Keys</span>
              <span className="bg-gray-700 px-2 py-1 rounded">Move Rocket</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium">Space</span>
              <span className="bg-gray-700 px-2 py-1 rounded">Auto Pilot</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium">Escape</span>
              <span className="bg-gray-700 px-2 py-1 rounded">Reset</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium">Ctrl + 1-8</span>
              <span className="bg-gray-700 px-2 py-1 rounded">Jump to Station</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="font-medium">Ctrl + H</span>
              <span className="bg-gray-700 px-2 py-1 rounded">Toggle Controls</span>
            </div>
            
            <div className="pt-2 text-cyan-400 font-medium">
              Use arrow keys to navigate the rocket through the timeline
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstructionsPanel