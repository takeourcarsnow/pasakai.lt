import React, { useState } from 'react';
import type { AgeRange } from '@/types';

interface AgeSliderProps {
  value: string;
  onChange: (value: string) => void;
}

const AGE_RANGES: Record<string, AgeRange> = {
  '1': { text: '3-6 metų vaikams', emoji: '👶' },
  '2': { text: '7-9 metų vaikams', emoji: '📖' },
  '3': { text: '10-12 metų vaikams', emoji: '📚' },
  '4': { text: '13+ metų vaikams', emoji: '🎯' }
};

export const AgeSlider: React.FC<AgeSliderProps> = ({ value, onChange }) => {
  const currentRange = AGE_RANGES[value];

  return (
    <div className="setting-section">
      <h2>👶 Skaitytojo amžius</h2>
      <div className="age-slider-container">
        <div className="age-labels">
          <span>3-6 m.</span>
          <span>7-9 m.</span>
          <span>10-12 m.</span>
          <span>13+ m.</span>
        </div>
        <input
          type="range"
          id="age-slider"
          min="1"
          max="4"
          value={value}
          step="1"
          className="age-slider"
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="age-description" id="age-description">
          <span className="age-emoji">{currentRange.emoji}</span>
          <span className="age-text">{currentRange.text}</span>
        </div>
      </div>
    </div>
  );
};