require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const path = require('path');

// Constants
const SAFETY_SETTINGS = [
    'HARM_CATEGORY_HARASSMENT',
    'HARM_CATEGORY_HATE_SPEECH',
    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    'HARM_CATEGORY_DANGEROUS_CONTENT'
].map(category => ({
    category: HarmCategory[category],
    threshold: HarmBlockThreshold.BLOCK_NONE
}));

// Story complexity configurations
const COMPLEXITY_CONFIGS = {
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

// Initialize Express app
const app = express();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: SAFETY_SETTINGS
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Story text cleanup utility
const cleanStoryText = (text) => {
    const cleanups = [
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

// Generate story prompt
const generatePrompt = ({ time, place, characters, mood, ageGroup }) => {
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

// Routes
app.get('/', (req, res) => res.render('index'));

app.post('/api/generate-story', async (req, res) => {
    try {
        const prompt = generatePrompt(req.body);
        const result = await model.generateContent(prompt);
        const story = cleanStoryText(result.response.text());
        
        res.json({ story });
    } catch (error) {
        console.error('Story generation error:', error);
        res.status(500).json({ 
            error: 'Įvyko klaida generuojant pasaką',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Error handlers
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Serverio klaida',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Įvyko vidinė serverio klaida'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Puslapis nerastas' });
});

// Start server if not in production (Vercel handles production)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Export the Express API
module.exports = app;