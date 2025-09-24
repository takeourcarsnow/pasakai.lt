import React, { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 30, 
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef<(() => void) | undefined>(onComplete);

  // keep the latest onComplete in a ref so the main typing effect
  // doesn't restart when the parent re-creates the callback reference
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // prevent restarting the typing animation if we're already typing the same text
  const typingRef = useRef(false);
  const lastTextRef = useRef<string | null>(null);

  useEffect(() => {
    console.log('TypewriterText - text prop:', text ? text.substring(0, 50) + '...' : 'NO TEXT');
    console.log('TypewriterText - text length:', text?.length || 0);
    
    if (!text) {
      console.log('TypewriterText - No text provided, returning');
      return;
    }

    // If we're already typing the exact same text, don't restart
    if (typingRef.current && lastTextRef.current === text) {
      console.log('TypewriterText - Already typing same text; skipping restart');
      return;
    }

    console.log('TypewriterText - Starting animation');
    typingRef.current = true;
    lastTextRef.current = text;
    setIsTyping(true);
    setDisplayText('');
    
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        const newText = text.substring(0, i + 1);
        console.log(`TypewriterText - Setting text [${i}]:`, newText.substring(0, 20) + '...');
        setDisplayText(newText);
        i++;
      } else {
        console.log('TypewriterText - Animation complete');
        setIsTyping(false);
        typingRef.current = false;
        clearInterval(typeInterval);
        // call the latest onComplete from ref (does not trigger effect re-run)
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => {
      clearInterval(typeInterval);
      typingRef.current = false;
    };
  }, [text, speed]);

  console.log('TypewriterText - Rendering with displayText:', displayText.length, displayText.substring(0, 30));

  return (
    <div id="story-text" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
      {displayText}
      {isTyping && <span className="typing-cursor">|</span>}
    </div>
  );
};