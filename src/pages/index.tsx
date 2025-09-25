import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FireflyEffect } from '@/components/FireflyEffect';
import { SettingSwiper } from '@/components/SettingSwiper';
import { AgeSlider } from '@/components/AgeSlider';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { TypewriterText } from '@/components/TypewriterText';
import { ShareButtons } from '@/components/ShareButtons';
import { STORY_OPTIONS } from '@/lib/constants';
import type { StoryRequest, StoryResponse } from '@/types';

interface StorySelections {
  time: string;
  place: string;
  characters: string;
  mood: string;
  ageGroup: string;
}

export default function Home() {
  const [selections, setSelections] = useState<StorySelections>({
    time: '',
    place: '',
    characters: '',
    mood: '',
    ageGroup: '2'
  });

  const [story, setStory] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [showShareButtons, setShowShareButtons] = useState<boolean>(false);

  const updateSelection = useCallback((key: keyof StorySelections, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }));
  }, []);

  // Stable callbacks for each setting so child components don't receive a new
  // function reference every render (prevents repeated effect triggers).
  const onTimeSelection = useCallback((value: string) => updateSelection('time', value), [updateSelection]);
  const onPlaceSelection = useCallback((value: string) => updateSelection('place', value), [updateSelection]);
  const onCharacterSelection = useCallback((value: string) => updateSelection('characters', value), [updateSelection]);
  const onMoodSelection = useCallback((value: string) => updateSelection('mood', value), [updateSelection]);
  const onAgeChange = useCallback((value: string) => updateSelection('ageGroup', value), [updateSelection]);

  const generateStory = async () => {
    // Validate selections
    const required = ['time', 'place', 'characters', 'mood'] as const;
    const missing = required.filter(key => !selections[key]);
    
    if (missing.length > 0) {
      const missingLabels = missing.map(key => ({
        time: 'laiką',
        place: 'vietą',
        characters: 'veikėjus',
        mood: 'nuotaiką'
      })[key]);
      
      alert(`Prašome pasirinkti: ${missingLabels.join(', ')} 🎯`);
      return;
    }

    setIsLoading(true);
    setShowStory(false);
    setShowShareButtons(false);

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selections as StoryRequest)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: StoryResponse = await response.json();
      
      setStory(data.story);
      setIsLoading(false);
      setShowStory(true);

      // Scroll to story
      setTimeout(() => {
        const storyContainer = document.querySelector('.story-container');
        if (storyContainer) {
          storyContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error) {
      console.error('Error:', error);
      alert('Įvyko klaida! Bandykite dar kartą. 😔');
      setIsLoading(false);
    }
  };

  const resetStory = () => {
    setShowStory(false);
    setShowShareButtons(false);
    setStory('');
    
    setTimeout(() => {
      const settingsSection = document.querySelector('.story-settings');
      if (settingsSection) {
        settingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleTypewriterComplete = () => {
    setShowShareButtons(true);
  };

  return (
    <>
      <Head>
        <title>✨ PasakAI - Atrask savo stebuklingą pasaką 🪄</title>
        <meta name="description" content="Atrask savo pasaką" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        <meta property="og:title" content="✨ PasakAI ✨" />
        <meta property="og:description" content="Atrask savo pasaką" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        
  {/* Fonts are loaded globally in _document.tsx */}
      </Head>

      <div className="bg-gradient" aria-hidden="true"></div>
      <div className="stars" aria-hidden="true"></div>
      <FireflyEffect />

      <ThemeToggle />

      <div className="social-links">
        <a href="https://www.nefas.tv/" target="_blank" rel="noopener noreferrer" className="patreon-link">
          <span>🐈‍⬛ Autorius</span>
        </a>
      </div>

      <div className="hero">
        <h1>✨ PasakAI ✨</h1>
        <p className="tagline">Atrask savo stebuklingą pasaką 🪄</p>
        <div className="hero-description">
          <p>Pasirink veikėjus, vietą, laiką ir nuotaiką, o mes paversime tavo idėjas magiška istorija!</p>
          <div className="magic-icons" aria-hidden="true">
            <span>🦄</span>
            <span>🌟</span>
            <span>🎭</span>
            <span>🌈</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="story-settings">
          <SettingSwiper
            title="🕰️ Kada vyksta pasaka?"
            options={STORY_OPTIONS.time}
            onSelectionChange={onTimeSelection}
            className="time-swiper"
          />

          <SettingSwiper
            title="📍 Kur vyksta pasaka?"
            options={STORY_OPTIONS.place}
            onSelectionChange={onPlaceSelection}
            className="place-swiper"
          />

          <SettingSwiper
            title="👥 Kas yra veikėjai?"
            options={STORY_OPTIONS.character}
            onSelectionChange={onCharacterSelection}
            className="character-swiper"
          />

          <SettingSwiper
            title="🎭 Kokia nuotaika?"
            options={STORY_OPTIONS.mood}
            onSelectionChange={onMoodSelection}
            className="mood-swiper"
          />

          <AgeSlider
            value={selections.ageGroup}
            onChange={onAgeChange}
          />

          <button 
            className="generate-button" 
            onClick={generateStory}
            disabled={isLoading}
          >
            <span className="button-text">
              {isLoading ? 'Kuriama... 🌟' : 'Sukurti pasaką ✨'}
            </span>
            <div className="button-magic" aria-hidden="true"></div>
          </button>
        </div>

        <div className={`story-container ${showStory || isLoading ? 'show' : ''}`}>
          <LoadingAnimation visible={isLoading} />

          {showStory && (
            <div className="story-content" style={{ display: 'block' }}>
              <div className="story-header">
                <h3>✨ Tavo pasaka paruošta!</h3>
              </div>
              
              <TypewriterText 
                text={story} 
                speed={30} 
                onComplete={handleTypewriterComplete}
              />
              <ShareButtons 
                story={story} 
                visible={showShareButtons}
              />
              <button 
                className="generate-button" 
                onClick={resetStory}
                style={{ marginTop: '2rem' }}
              >
                <span className="button-text">Kurti naują pasaką 🌟</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <footer>
        <div className="footer-social-links">
          <a href="https://www.nefas.tv/" target="_blank" rel="noopener noreferrer" className="patreon-link">
            <span>🐈‍⬛ Autorius</span>
          </a>
        </div>
        <p>Sukurta su 💖 vaikų džiaugsmui</p>
      </footer>
    </>
  );
}