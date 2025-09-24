import React, { useState, useRef } from 'react';

interface LoadingAnimationProps {
  visible: boolean;
}

const LOADING_MESSAGES = [
  "Renkamos idėjos... ✨",
  "Mezgama istorija... 🧶",
  "Kuriami veikėjai... 👥",
  "Piešiami vaizdai... 🎨",
  "Dėliojami žodžiai... 📝",
  "Beriami burtai... 🪄",
  "Pridedama magijos... ✨",
  "Tikrinama gramatika... 📚",
  "Puošiama istorija... 🎭",
  "Baigiami paskutiniai potėpiai... 🖌️"
];

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ visible }) => {
  const [currentMessage, setCurrentMessage] = useState(LOADING_MESSAGES[0]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (visible) {
      let messageIndex = 0;
      
      // Create sparkles
      const sparklesContainer = document.querySelector('.loading-sparkles');
      if (sparklesContainer) {
        sparklesContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';
          sparkle.innerHTML = '✨';
          sparkle.style.setProperty('--tx', `${Math.random() * 200 - 100}px`);
          sparkle.style.setProperty('--ty', `${Math.random() * 200 - 100}px`);
          sparklesContainer.appendChild(sparkle);
        }
      }

      intervalRef.current = setInterval(() => {
        setCurrentMessage(LOADING_MESSAGES[messageIndex]);
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
      }, 2000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      const sparklesContainer = document.querySelector('.loading-sparkles');
      if (sparklesContainer) {
        sparklesContainer.innerHTML = '';
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [visible]);

  return (
    <div className={`loading-animation ${visible ? 'visible' : ''}`}>
      <div className="loading-text">Kuriama pasaka...</div>
      <div className="loading-dots">
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
        <div className="loading-dot"></div>
      </div>
      <div className="loading-messages">{currentMessage}</div>
      <div className="loading-sparkles"></div>
    </div>
  );
};