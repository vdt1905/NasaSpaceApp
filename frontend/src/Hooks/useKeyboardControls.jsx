import { useEffect, useState } from 'react';

export const useKeyboardControls = (setRocketVelocity) => {
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
  
  useEffect(() => {
    const speed = 0.15;
    let x = 0;
    let y = 0;
    
    if (keys['w'] || keys['arrowup']) y -= speed;
    if (keys['s'] || keys['arrowdown']) y += speed;
    if (keys['a'] || keys['arrowleft']) x -= speed;
    if (keys['d'] || keys['arrowright']) x += speed;
    
    // Apply some inertia for smoother movement
    setRocketVelocity(prev => ({
      x: x !== 0 ? x : prev.x * 0.9,
      y: y !== 0 ? y : prev.y * 0.9
    }));
  }, [keys, setRocketVelocity]);
};