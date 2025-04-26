import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const Fireworks = () => {
  useEffect(() => {
    // Function to trigger fireworks
    const SECONDS = 1;
    const duration = SECONDS * 1000; // Duration of the animation (2 seconds)
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      // Launch fireworks from random positions
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount: 40,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250); // Fireworks burst every 250ms

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allows clicks to pass through
        zIndex: 9999,
      }}
    />
  );
};

export default Fireworks;
