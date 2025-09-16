// utils/collisionDetection.js
export const checkCollisions = (rocketPosition) => {
  const stations = [
    { id: 'agriculture', x: 20, y: 30, radius: 5 },
    { id: 'health', x: 70, y: 20, radius: 5 },
    { id: 'technology', x: 40, y: 60, radius: 5 },
    { id: 'space', x: 80, y: 70, radius: 5 },
    { id: 'oceans', x: 30, y: 80, radius: 5 }
  ];
  
  for (const station of stations) {
    const distance = Math.sqrt(
      Math.pow(rocketPosition.x - station.x, 2) + 
      Math.pow(rocketPosition.y - station.y, 2)
    );
    
    if (distance < station.radius) {
      return station.id;
    }
  }
  
  return null;
};

// utils/preloadAssets.js
export const preloadAssets = () => {
  return new Promise((resolve) => {
    // In a real implementation, we would preload images, sounds, etc.
    setTimeout(resolve, 2000); // Simulate loading time
  });
};