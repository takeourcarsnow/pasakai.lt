import React from 'react';

interface AgeSliderProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  ranges: Record<string, string>;
  labels: string[];
}

export const AgeSlider: React.FC<AgeSliderProps> = ({ value, onChange, title, ranges, labels }) => {
  const currentRange = ranges[value];

  return (
    <div className="setting-section">
      <h2>{title}</h2>
      <div className="age-slider-container">
        <div className="age-labels">
          {labels.map((label, index) => (
            <span key={index}>{label}</span>
          ))}
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
          <span className="age-emoji">
            {value === '1' ? '👶' : value === '2' ? '📖' : value === '3' ? '📚' : '🎯'}
          </span>
          <span className="age-text">{currentRange}</span>
        </div>
      </div>
    </div>
  );
};