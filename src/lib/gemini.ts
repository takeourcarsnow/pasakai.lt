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
export const generatePrompt = ({ time, place, characters, mood, ageGroup, language }: StoryRequest): string => {
  const complexity = COMPLEXITY_CONFIGS[ageGroup].style;
  
  if (language === 'en') {
    return `
      Create a children's story in English with these parameters:
      Time: ${time}
      Place: ${place}
      Characters: ${characters}
      Mood: ${mood}
      
      Story complexity and style:
      ${complexity.replace(/lietuvių/g, 'English').replace(/žodžių/g, 'words')}
      
      The story must be:
      - Divided into 4-5 clear paragraphs
      - Start with "Once upon a time..." or similar
      - Have an interesting climax
      - Have a happy ending
      - Have a clear moral message
      - Be easily understandable for the selected age group
      
      IMPORTANT:
      - Do not write words between asterisks and do not use them anywhere (*)
      - Must have no grammatical or style errors
      - Do not use any special symbols or formatting
      - Be sure to add appropriate emojis to every or every other sentence
      - Each paragraph must start with plain text without any symbols
      
      Please format paragraphs with double newlines between them.
    `.trim();
  }
  
  if (language === 'es') {
    return `
      Crea un cuento infantil en español con estos parámetros:
      Tiempo: ${time}
      Lugar: ${place}
      Personajes: ${characters}
      Ambiente: ${mood}
      
      Complejidad y estilo de la historia:
      ${complexity.replace(/lietuvių/g, 'español').replace(/žodžių/g, 'palabras')}
      
      El cuento debe ser:
      - Dividido en 4-5 párrafos claros
      - Comenzar con "Érase una vez..." o similar
      - Tener un clímax interesante
      - Tener un final feliz
      - Tener un mensaje moral claro
      - Ser fácilmente comprensible para el grupo de edad seleccionado
      
      IMPORTANTE:
      - No escribir palabras entre asteriscos y no usarlos en ningún lugar (*)
      - Debe no tener errores gramaticales o de estilo
      - No usar símbolos especiales o formato
      - Asegurarse de agregar emojis apropiados a cada oración o cada dos oraciones
      - Cada párrafo debe comenzar con texto plano sin símbolos
      
      Por favor formatea los párrafos con doble salto de línea entre ellos.
    `.trim();
  }
  
  if (language === 'fr') {
    return `
      Créez une histoire pour enfants en français avec ces paramètres:
      Temps: ${time}
      Lieu: ${place}
      Personnages: ${characters}
      Ambiance: ${mood}
      
      Complexité et style de l'histoire:
      ${complexity.replace(/lietuvių/g, 'français').replace(/žodžių/g, 'mots')}
      
      L'histoire doit être:
      - Divisée en 4-5 paragraphes clairs
      - Commencer par "Il était une fois..." ou similaire
      - Avoir un climax intéressant
      - Avoir une fin heureuse
      - Avoir un message moral clair
      - Être facilement compréhensible pour le groupe d'âge sélectionné
      
      IMPORTANT:
      - Ne pas écrire de mots entre astérisques et ne pas les utiliser nulle part (*)
      - Doit ne pas avoir d'erreurs grammaticales ou de style
      - Ne pas utiliser de symboles spéciaux ou de formatage
      - S'assurer d'ajouter des emojis appropriés à chaque phrase ou tous les deux phrases
      - Chaque paragraphe doit commencer par du texte brut sans symboles
      
      Veuillez formater les paragraphes avec un double saut de ligne entre eux.
    `.trim();
  }
  
  if (language === 'de') {
    return `
      Erstelle eine Kindergeschichte auf Deutsch mit diesen Parametern:
      Zeit: ${time}
      Ort: ${place}
      Charaktere: ${characters}
      Stimmung: ${mood}
      
      Komplexität und Stil der Geschichte:
      ${complexity.replace(/lietuvių/g, 'Deutsch').replace(/žodžių/g, 'Wörter')}
      
      Die Geschichte muss sein:
      - In 4-5 klare Absätze unterteilt
      - Beginnen mit "Es war einmal..." oder ähnlich
      - Einen interessanten Höhepunkt haben
      - Ein glückliches Ende haben
      - Eine klare moralische Botschaft haben
      - Für die ausgewählte Altersgruppe leicht verständlich sein
      
      WICHTIG:
      - Keine Wörter zwischen Sternchen schreiben und sie nirgendwo verwenden (*)
      - Muss keine grammatikalischen oder Stilfehler haben
      - Keine Sonderzeichen oder Formatierung verwenden
      - Sicherstellen, dass passende Emojis zu jedem oder jedem zweiten Satz hinzugefügt werden
      - Jeder Absatz muss mit reinem Text ohne Symbole beginnen
      
      Bitte formatiere Absätze mit doppeltem Zeilenumbruch dazwischen.
    `.trim();
  }
  
  if (language === 'it') {
    return `
      Crea una storia per bambini in italiano con questi parametri:
      Tempo: ${time}
      Luogo: ${place}
      Personaggi: ${characters}
      Atmosfera: ${mood}
      
      Complessità e stile della storia:
      ${complexity.replace(/lietuvių/g, 'italiano').replace(/žodžių/g, 'parole')}
      
      La storia deve essere:
      - Divisa in 4-5 paragrafi chiari
      - Iniziare con "C'era una volta..." o simile
      - Avere un climax interessante
      - Avere un finale felice
      - Avere un messaggio morale chiaro
      - Essere facilmente comprensibile per il gruppo di età selezionato
      
      IMPORTANTE:
      - Non scrivere parole tra asterischi e non usarli da nessuna parte (*)
      - Deve non avere errori grammaticali o di stile
      - Non usare simboli speciali o formattazione
      - Assicurarsi di aggiungere emoji appropriate a ogni frase o ogni due frasi
      - Ogni paragrafo deve iniziare con testo semplice senza simboli
      
      Per favore formatta i paragrafi con doppio a capo tra di loro.
    `.trim();
  }
  
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