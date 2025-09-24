import React, { useEffect } from 'react';

interface FireflyEffectProps {
  count?: number;
}

export const FireflyEffect: React.FC<FireflyEffectProps> = ({ count = 30 }) => {
  useEffect(() => {
    const createFireflies = () => {
      const existingFirefly = document.querySelector('.firefly');
      if (existingFirefly) {
        existingFirefly.remove();
      }

      const firefly = document.createElement('div');
      firefly.className = 'firefly';
      
      for (let i = 0; i < count; i++) {
        const glow = document.createElement('div');
        glow.className = 'firefly-glow';
        
        const tx = Math.random() * 200 - 100;
        const ty = Math.random() * 200 - 100;
        const duration = 6 + Math.random() * 4;
        const delay = -Math.random() * 10;
        
        glow.style.setProperty('--tx', `${tx}px`);
        glow.style.setProperty('--ty', `${ty}px`);
        glow.style.setProperty('--duration', `${duration}s`);
        glow.style.setProperty('--delay', `${delay}s`);
        glow.style.left = `${Math.random() * 100}%`;
        glow.style.top = `${Math.random() * 100}%`;
        
        firefly.appendChild(glow);
      }
      
      document.body.appendChild(firefly);
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(createFireflies);
    } else {
      setTimeout(createFireflies, 0);
    }

    return () => {
      const firefly = document.querySelector('.firefly');
      if (firefly) {
        firefly.remove();
      }
    };
  }, [count]);

  return null;
};