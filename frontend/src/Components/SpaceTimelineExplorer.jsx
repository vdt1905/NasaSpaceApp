import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Zap, Globe, Heart, Cpu, Leaf, GraduationCap, Wifi, Atom, Play, RotateCcw, Keyboard, Info } from 'lucide-react';
import ControlPanel from './ControlPanel';
import InstructionsPanel from './InstructionPanel';
import Rocket from './Rocket';
import Station from './Station';
import StationInfoPopup from './StationInfoPopup';

const SpaceTimelineExplorer = () => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 50 });
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [currentYear, setCurrentYear] = useState(2000);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hoveredStation, setHoveredStation] = useState(null);
  const containerRef = useRef(null);

  const stations = [
    {
      id: 'internet-boom',
      year: 2000,
      title: 'Internet Revolution',
      icon: Globe,
      position: { x: 15, y: 20 },
      color: 'from-blue-400 to-cyan-400',
      glowColor: 'shadow-blue-400/50',
      description: 'The dawn of the digital age with widespread internet adoption and e-commerce.',
      achievements: [
        'First dot-com bubble and recovery',
        'Google search dominance',
        'Amazon reshapes commerce',
        'Napster transforms music',
        'Y2K drives tech upgrades'
      ]
    },
    {
      id: 'social-media',
      year: 2005,
      title: 'Social Networks',
      icon: Wifi,
      position: { x: 35, y: 80 },
      color: 'from-purple-400 to-pink-400',
      glowColor: 'shadow-purple-400/50',
      description: 'Social platforms revolutionized global communication and connection.',
      achievements: [
        'Facebook public launch',
        'YouTube video revolution',
        'Twitter microblogging',
        'MySpace dominance',
        'Web 2.0 user content'
      ]
    },
    {
      id: 'mobile-revolution',
      year: 2010,
      title: 'Mobile Era',
      icon: Zap,
      position: { x: 20, y: 60 },
      color: 'from-emerald-400 to-teal-400',
      glowColor: 'shadow-emerald-400/50',
      description: 'Smartphones transformed daily life and created mobile-first ecosystems.',
      achievements: [
        'iPhone App Store ecosystem',
        'Android market growth',
        'Instagram visual media',
        'Mobile-first internet',
        'Location services emerge'
      ]
    },
    {
      id: 'digital-health',
      year: 2015,
      title: 'Health Tech',
      icon: Heart,
      position: { x: 70, y: 25 },
      color: 'from-red-400 to-rose-400',
      glowColor: 'shadow-red-400/50',
      description: 'Healthcare technology with wearables and telemedicine solutions.',
      achievements: [
        'Fitness trackers mainstream',
        'Telemedicine platforms',
        'Electronic health records',
        'Precision medicine',
        'Health apps wellness'
      ]
    },
    {
      id: 'ai-emergence',
      year: 2018,
      title: 'AI Renaissance',
      icon: Cpu,
      position: { x: 80, y: 70 },
      color: 'from-amber-400 to-orange-400',
      glowColor: 'shadow-amber-400/50',
      description: 'AI and ML became practical tools for businesses and consumers.',
      achievements: [
        'Deep learning breakthroughs',
        'Voice assistants everywhere',
        'Computer vision advances',
        'Natural language processing',
        'Autonomous vehicles'
      ]
    },
    {
      id: 'sustainability',
      year: 2020,
      title: 'Green Tech',
      icon: Leaf,
      position: { x: 45, y: 40 },
      color: 'from-green-400 to-lime-400',
      glowColor: 'shadow-green-400/50',
      description: 'Environmental focus drove clean technology and renewable energy.',
      achievements: [
        'Electric vehicle adoption',
        'Renewable energy parity',
        'Carbon tracking tech',
        'Circular economy',
        'Green building standards'
      ]
    },
    {
      id: 'metaverse',
      year: 2022,
      title: 'Virtual Worlds',
      icon: GraduationCap,
      position: { x: 65, y: 85 },
      color: 'from-violet-400 to-indigo-400',
      glowColor: 'shadow-violet-400/50',
      description: 'VR/AR created immersive experiences and digital social interaction.',
      achievements: [
        'VR/AR mainstream',
        'Virtual real estate',
        'Digital identity systems',
        'Remote work immersion',
        'NFT digital assets'
      ]
    },
    {
      id: 'quantum-future',
      year: 2025,
      title: 'Quantum Age',
      icon: Atom,
      position: { x: 85, y: 50 },
      color: 'from-fuchsia-400 to-purple-400',
      glowColor: 'shadow-fuchsia-400/50',
      description: 'Quantum computing and advanced AI shape the next technological era.',
      achievements: [
        'Quantum computing breakthrough',
        'Neural interfaces',
        'Fusion energy progress',
        'Space tech advancement',
        'Biotechnology revolution'
      ]
    }
  ];

  // Handle rocket movement with keyboard
  const moveRocket = useCallback((dx, dy) => {
    setRocketPosition(prev => {
      const newX = Math.max(0, Math.min(100, prev.x + dx));
      const newY = Math.max(0, Math.min(100, prev.y + dy));
      
      // Update year based on position
      const progress = newX / 100;
      const year = Math.round(2000 + (progress * 25));
      setCurrentYear(Math.max(2000, Math.min(2025, year)));
      setJourneyProgress(progress * 100);
      
      return { x: newX, y: newY };
    });
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.code) {
        case 'Space':
          e.preventDefault();
          if (!isAutoMode) {
            startAutoJourney();
          } else {
            resetJourney();
          }
          break;
        case 'Escape':
          resetJourney();
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveRocket(0, -2);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveRocket(0, 2);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveRocket(-2, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRocket(2, 0);
          break;
        case 'KeyH':
          if (e.ctrlKey) {
            e.preventDefault();
            setShowControls(prev => !prev);
          }
          break;
        case 'KeyI':
          if (e.ctrlKey) {
            e.preventDefault();
            setShowInstructions(prev => !prev);
          }
          break;
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
          if (e.ctrlKey) {
            e.preventDefault();
            const index = parseInt(e.code.replace('Digit', '')) - 1;
            if (index < stations.length) {
              jumpToStation(stations[index]);
            }
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAutoMode, moveRocket, stations]);

  const startAutoJourney = async () => {
    setIsAutoMode(true);
    
    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      
      setRocketPosition(station.position);
      setCurrentYear(station.year);
      setJourneyProgress((i / (stations.length - 1)) * 100);
      setSelectedStation(station);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setIsAutoMode(false);
  };

  const jumpToStation = async (station) => {
    setIsAutoMode(true);
    
    setRocketPosition(station.position);
    setCurrentYear(station.year);
    setJourneyProgress((stations.findIndex(s => s.id === station.id) / (stations.length - 1)) * 100);
    setSelectedStation(station);
    
    setTimeout(() => setIsAutoMode(false), 500);
  };

  const resetJourney = () => {
    setIsAutoMode(false);
    setRocketPosition({ x: 50, y: 50 });
    setCurrentYear(2000);
    setJourneyProgress(0);
    setSelectedStation(null);
  };

  const handleStationHover = (station) => {
    setHoveredStation(station);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden">
      {/* Static Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Static Nebula Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Interactive Container */}
      <div
        ref={containerRef}
        className="absolute inset-0"
      >
        {/* Stations */}
        {stations.map((station, index) => (
          <Station
            key={station.id}
            station={station}
            index={index}
            onJumpToStation={jumpToStation}
            onHover={handleStationHover}
          />
        ))}

        {/* Rocket */}
        <Rocket position={rocketPosition} />
      </div>

      {/* Control Panel */}
      <ControlPanel
        currentYear={currentYear}
        journeyProgress={journeyProgress}
        isAutoMode={isAutoMode}
        onStartAutoJourney={startAutoJourney}
        onResetJourney={resetJourney}
        showControls={showControls}
        onToggleControls={() => setShowControls(prev => !prev)}
        onToggleInstructions={() => setShowInstructions(prev => !prev)}
      />

      {/* Instructions Panel */}
      <InstructionsPanel
        showInstructions={showInstructions}
        onToggleInstructions={() => setShowInstructions(prev => !prev)}
      />

      {/* Keyboard Mode Indicator */}
      <div className="absolute top-6 right-6 bg-green-600/90 backdrop-blur-md rounded-lg px-4 py-2
                  text-white font-semibold flex items-center gap-2">
        <Keyboard size={16} />
        Keyboard Navigation Active
      </div>

      {/* Station Info Popup */}
      <StationInfoPopup station={hoveredStation} isVisible={!!hoveredStation} />

      {/* Information Panel for Selected Station */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div
            className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl rounded-2xl
                      border border-white/20 p-6 max-w-md"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedStation.color}
                             flex items-center justify-center border border-white/30`}>
                <selectedStation.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {selectedStation.title}
                </h3>
                <p className="text-cyan-400 font-mono">{selectedStation.year}</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 leading-relaxed">
              {selectedStation.description}
            </p>
            
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50
                           rounded-lg p-4 border border-purple-500/20">
              <h4 className="text-purple-300 font-semibold mb-3 text-sm uppercase tracking-wider">
                Key Innovations
              </h4>
              <ul className="space-y-2">
                {selectedStation.achievements.map((achievement, index) => (
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
            
            <button
              onClick={() => setSelectedStation(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white
                        transition-colors duration-200"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpaceTimelineExplorer;