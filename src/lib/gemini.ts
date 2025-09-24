import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { ComplexityConfig, StoryRequest } from '@/types';

// Safety settings for the AI model
const SAFETY_SETTINGS = [
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_HATE_SPEECH', 
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_DANGEROUS_CONTENT'
].map(category => ({
  category: HarmCategory[category as keyof typeof HarmCategory],
  threshold: HarmBlockThreshold.BLOCK_NONE
}));

// Story complexity configurations based on age groups
export const COMPLEXITY_CONFIGS: Record<string, ComplexityConfig> = {
  '1': {
    wordCount: '100-150',
    style: `
      - Naudoti labai paprastus, trumpus sakinius
      - Vengti sudėtingų žodžių
      - Daug kartojimų
      - 100-150 žodžių ilgio
      - Ryškūs, aiškūs veikėjai
      - Labai paprasta istorijos eiga
      - Daug emocijų ir jausmų aprašymų
      - Dažnas emoji naudojimas
    `
  },
  '2': {
    wordCount: '150-200',
    style: `
      - Naudoti nesudėtingus sakinius
      - Įtraukti keletą naujų žodžių
      - 150-200 žodžių ilgio
      - Aiški istorijos eiga
      - Paprastos, bet įdomios situacijos
      - Reguliarus emoji naudojimas
    `
  },
  '3': {
    wordCount: '200-250',
    style: `
      - Galima naudoti sudėtingesnius sakinius
      - Įtraukti įdomesnį žodyną
      - 200-250 žodžių ilgio
      - Sudėtingesnė istorijos eiga
      - Įdomesni charakterių aprašymai
      - Vidutinis emoji naudojimas
    `
  },
  '4': {
    wordCount: '250-300',
    style: `
      - Naudoti įvairius sudėtingus sakinius
      - Turtingas žodynas
      - 250-300 žodžių ilgio
      - Sudėtinga istorijos eiga
      - Gilesnė moralinė žinutė
      - Subtilus emoji naudojimas
      - Išsamūs veikėjų aprašymai
      - Sudėtingesnės situacijos ir sprendimai
    `
  }
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  safetySettings: SAFETY_SETTINGS
});

// Clean up story text from markdown formatting
export const cleanStoryText = (text: string): string => {
  const cleanups: [RegExp, string][] = [
    [/\*\*/g, ''],           
    [/\*/g, ''],             
    [/#+\s/g, ''],           
    [/`/g, ''],              
    [/>/g, ''],              
    [/\[([^\]]+)\]\([^)]+\)/g, '$1']
  ];

  return cleanups.reduce((text, [pattern, replacement]) => 
    text.replace(pattern, replacement),
    text.split('\n\n')
      .map(paragraph => paragraph.trim().replace(/^\*+|\*+$|^_+|_+$/g, ''))
      .join('\n\n')
  );
};

// Generate story prompt based on user selections
export const generatePrompt = ({ time, place, characters, mood, ageGroup }: StoryRequest): string => {
  const complexity = COMPLEXITY_CONFIGS[ageGroup].style;
  
  return `
    Sukurk vaikišką pasaką lietuvių kalba su šiais parametrais:
    Laikas: ${time}
    Vieta: ${place}
    Veikėjai: ${characters}
    Nuotaika: ${mood}
    
    Istorijos sudėtingumas ir stilius:
    ${complexity}
    
    Pasaka turi būti:
    - Suskirstyta į 4-5 aiškias pastraipas
    - Pradėti su "Vieną kartą..." arba panašiai
    - Turėti įdomią kulminaciją
    - Turėti laimingą pabaigą
    - Turėti aiškią moralinę žinutę
    - Būti lengvai suprantama pasirinktai amžiaus grupei
    
    SVARBU: 
    - Nerašyti žodžių tarp žvaigždučių ir apskritai nenaudoti jų niekur (*)
    - Privalo nebūti gramatinių ar stiliaus klaidų
    - Nenaudoti jokių specialių simbolių ar formatavimo
    - Būtinai pridėt atitinkamus emoji prie kiekvieno arba kas antro sakinio
    - Kiekviena pastraipa turi prasidėti paprastu tekstu be jokių simbolių
    
    Prašau formatuoti pastraipas su dvigubais naujų eilučių tarpais tarp jų.
  `.trim();
};

// Generate story using Gemini AI
export const generateStory = async (request: StoryRequest): Promise<string> => {
  const prompt = generatePrompt(request);
  const result = await model.generateContent(prompt);
  return cleanStoryText(result.response.text());
};