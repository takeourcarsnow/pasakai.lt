import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FireflyEffect } from '@/components/FireflyEffect';
import { SettingSwiper } from '@/components/SettingSwiper';
import { AgeSlider } from '@/components/AgeSlider';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { TypewriterText } from '@/components/TypewriterText';
import { ShareButtons } from '@/components/ShareButtons';
import { STORY_OPTIONS, LANGUAGES } from '@/lib/constants';
import type { StoryRequest, StoryResponse } from '@/types';

interface StorySelections {
  language: string;
  time: string;
  place: string;
  characters: string;
  mood: string;
  ageGroup: string;
}

export default function Home() {
  const [selections, setSelections] = useState<StorySelections>({
    language: 'lt',
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
  const onLanguageSelection = useCallback((value: string) => updateSelection('language', value), [updateSelection]);
  const onTimeSelection = useCallback((value: string) => updateSelection('time', value), [updateSelection]);
  const onPlaceSelection = useCallback((value: string) => updateSelection('place', value), [updateSelection]);
  const onCharacterSelection = useCallback((value: string) => updateSelection('characters', value), [updateSelection]);
  const onMoodSelection = useCallback((value: string) => updateSelection('mood', value), [updateSelection]);
  const onAgeChange = useCallback((value: string) => updateSelection('ageGroup', value), [updateSelection]);

  // Helper function to get UI text based on language
  const getUIText = (key: string): string => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        lt: '✨ PasakAI ✨',
        en: '✨ StoryAI ✨',
        es: '✨ CuentoAI ✨',
        fr: '✨ HistoireAI ✨',
        de: '✨ GeschichteAI ✨',
        it: '✨ StoriaAI ✨'
      },
      tagline: {
        lt: 'Atrask savo stebuklingą pasaką 🪄',
        en: 'Discover your magical story 🪄',
        es: 'Descubre tu cuento mágico 🪄',
        fr: 'Découvrez votre histoire magique 🪄',
        de: 'Entdecken Sie Ihre magische Geschichte 🪄',
        it: 'Scopri la tua storia magica 🪄'
      },
      description: {
        lt: 'Pasirink veikėjus, vietą, laiką ir nuotaiką, o mes paversime tavo idėjas magiška istorija!',
        en: 'Choose characters, place, time and mood, and we will turn your ideas into a magical story!',
        es: '¡Elige personajes, lugar, tiempo y ambiente, y convertiremos tus ideas en una historia mágica!',
        fr: 'Choisissez les personnages, le lieu, le temps et l\'ambiance, et nous transformerons vos idées en une histoire magique !',
        de: 'Wählen Sie Charaktere, Ort, Zeit und Stimmung, und wir verwandeln Ihre Ideen in eine magische Geschichte!',
        it: 'Scegli personaggi, luogo, tempo e atmosfera, e trasformeremo le tue idee in una storia magica!'
      },
      languageTitle: {
        lt: '🌍 Kalba',
        en: '🌍 Language',
        es: '🌍 Idioma',
        fr: '🌍 Langue',
        de: '🌍 Sprache',
        it: '🌍 Lingua'
      },
      timeTitle: {
        lt: '🕰️ Kada vyksta pasaka?',
        en: '🕰️ When does the story take place?',
        es: '🕰️ ¿Cuándo ocurre el cuento?',
        fr: '🕰️ Quand l\'histoire se déroule-t-elle ?',
        de: '🕰️ Wann spielt die Geschichte?',
        it: '🕰️ Quando si svolge la storia?'
      },
      placeTitle: {
        lt: '📍 Kur vyksta pasaka?',
        en: '📍 Where does the story take place?',
        es: '📍 ¿Dónde ocurre el cuento?',
        fr: '📍 Où se déroule l\'histoire ?',
        de: '📍 Wo spielt die Geschichte?',
        it: '📍 Dove si svolge la storia?'
      },
      characterTitle: {
        lt: '👥 Kas yra veikėjai?',
        en: '👥 Who are the characters?',
        es: '👥 ¿Quiénes son los personajes?',
        fr: '👥 Qui sont les personnages ?',
        de: '👥 Wer sind die Charaktere?',
        it: '👥 Chi sono i personaggi?'
      },
      moodTitle: {
        lt: '🎭 Kokia nuotaika?',
        en: '🎭 What is the mood?',
        es: '🎭 ¿Cuál es el ambiente?',
        fr: '🎭 Quelle est l\'ambiance ?',
        de: '🎭 Wie ist die Stimmung?',
        it: '🎭 Qual è l\'atmosfera?'
      },
      creating: {
        lt: 'Kuriama... 🌟',
        en: 'Creating... 🌟',
        es: 'Creando... 🌟',
        fr: 'Création... 🌟',
        de: 'Erstellen... 🌟',
        it: 'Creazione... 🌟'
      },
      createButton: {
        lt: 'Sukurti pasaką ✨',
        en: 'Create story ✨',
        es: 'Crear cuento ✨',
        fr: 'Créer l\'histoire ✨',
        de: 'Geschichte erstellen ✨',
        it: 'Crea storia ✨'
      },
      storyReady: {
        lt: '✨ Tavo pasaka paruošta!',
        en: '✨ Your story is ready!',
        es: '✨ ¡Tu cuento está listo!',
        fr: '✨ Votre histoire est prête !',
        de: '✨ Ihre Geschichte ist fertig!',
        it: '✨ La tua storia è pronta!'
      },
      createNew: {
        lt: 'Kurti naują pasaką 🌟',
        en: 'Create new story 🌟',
        es: 'Crear nuevo cuento 🌟',
        fr: 'Créer une nouvelle histoire 🌟',
        de: 'Neue Geschichte erstellen 🌟',
        it: 'Crea nuova storia 🌟'
      },
      footer: {
        lt: 'Sukurta su 💖 vaikų džiaugsmui',
        en: 'Created with 💖 for children\'s joy',
        es: 'Creado con 💖 para la alegría de los niños',
        fr: 'Créé avec 💖 pour la joie des enfants',
        de: 'Mit 💖 für die Freude der Kinder erstellt',
        it: 'Creato con 💖 per la gioia dei bambini'
      },
      author: {
        lt: '🐈‍⬛ Autorius',
        en: '🐈‍⬛ Author',
        es: '🐈‍⬛ Autor',
        fr: '🐈‍⬛ Auteur',
        de: '🐈‍⬛ Autor',
        it: '🐈‍⬛ Autore'
      }
    };
    return texts[key]?.[selections.language] || texts[key]?.en || key;
  };

  const generateStory = async () => {
    // Validate selections
    const required = ['time', 'place', 'characters', 'mood'] as const;
    const missing = required.filter(key => !selections[key]);
    
    if (missing.length > 0) {
      const missingLabels: Record<string, Record<string, string>> = {
        time: {
          lt: 'laiką',
          en: 'time',
          es: 'tiempo',
          fr: 'temps',
          de: 'Zeit',
          it: 'tempo'
        },
        place: {
          lt: 'vietą',
          en: 'place',
          es: 'lugar',
          fr: 'lieu',
          de: 'Ort',
          it: 'luogo'
        },
        characters: {
          lt: 'veikėjus',
          en: 'characters',
          es: 'personajes',
          fr: 'personnages',
          de: 'Charaktere',
          it: 'personaggi'
        },
        mood: {
          lt: 'nuotaiką',
          en: 'mood',
          es: 'ambiente',
          fr: 'ambiance',
          de: 'Stimmung',
          it: 'atmosfera'
        }
      };
      
      const labels = missing.map(key => missingLabels[key]?.[selections.language] || missingLabels[key]?.en || key);
      alert(`Prašome pasirinkti: ${labels.join(', ')} 🎯`);
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
      const errorMessages: Record<string, string> = {
        lt: 'Įvyko klaida! Bandykite dar kartą. 😔',
        en: 'An error occurred! Please try again. 😔',
        es: '¡Ocurrió un error! Por favor, inténtalo de nuevo. 😔',
        fr: 'Une erreur s\'est produite ! Veuillez réessayer. 😔',
        de: 'Ein Fehler ist aufgetreten! Bitte versuchen Sie es erneut. 😔',
        it: 'Si è verificato un errore! Per favore, riprova. 😔'
      };
      alert(errorMessages[selections.language] || errorMessages.en);
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
        <title>{getUIText('title')}</title>
        <meta name="description" content={getUIText('description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        <meta property="og:title" content={getUIText('title')} />
        <meta property="og:description" content={getUIText('description')} />
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
          <span>{getUIText('author')}</span>
        </a>
      </div>

      <div className="hero">
        <h1>{getUIText('title')}</h1>
        <p className="tagline">{getUIText('tagline')}</p>
        <div className="hero-description">
          <p>{getUIText('description')}</p>
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
            title={getUIText('languageTitle')}
            options={LANGUAGES}
            onSelectionChange={onLanguageSelection}
            className="language-swiper"
          />

          <SettingSwiper
            title={getUIText('timeTitle')}
            options={STORY_OPTIONS[selections.language as keyof typeof STORY_OPTIONS].time}
            onSelectionChange={onTimeSelection}
            className="time-swiper"
          />

          <SettingSwiper
            title={getUIText('placeTitle')}
            options={STORY_OPTIONS[selections.language as keyof typeof STORY_OPTIONS].place}
            onSelectionChange={onPlaceSelection}
            className="place-swiper"
          />

          <SettingSwiper
            title={getUIText('characterTitle')}
            options={STORY_OPTIONS[selections.language as keyof typeof STORY_OPTIONS].character}
            onSelectionChange={onCharacterSelection}
            className="character-swiper"
          />

          <SettingSwiper
            title={getUIText('moodTitle')}
            options={STORY_OPTIONS[selections.language as keyof typeof STORY_OPTIONS].mood}
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
              {isLoading ? getUIText('creating') : getUIText('createButton')}
            </span>
            <div className="button-magic" aria-hidden="true"></div>
          </button>
        </div>

        <div className={`story-container ${showStory || isLoading ? 'show' : ''}`}>
          <LoadingAnimation visible={isLoading} />

          {showStory && (
            <div className="story-content" style={{ display: 'block' }}>
              <div className="story-header">
                <h3>{getUIText('storyReady')}</h3>
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
                <span className="button-text">{getUIText('createNew')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <footer>
        <div className="footer-social-links">
          <a href="https://www.nefas.tv/" target="_blank" rel="noopener noreferrer" className="patreon-link">
            <span>{getUIText('author')}</span>
          </a>
        </div>
        <p>{getUIText('footer')}</p>
      </footer>
    </>
  );
}