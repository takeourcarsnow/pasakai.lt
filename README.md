# 🌟 PasakAI - Lithuanian Story Generator (Next.js)

A magical story generator for children that creates personalized Lithuanian fairy tales using Google's Gemini AI. This is the fully converted Next.js + TypeScript version.

## 🚀 Features

- **Interactive Story Creation**: Choose time, place, characters, mood, and age group
- **AI-Powered Stories**: Uses Google Gemini AI to generate unique Lithuanian fairy tales
- **Age-Appropriate Content**: Customized complexity based on child's age (3-6, 7-9, 10-12, 13+ years)
- **Beautiful UI**: Modern design with animations, firefly effects, and theme switching
- **TypeScript & React**: Fully converted from Express.js + EJS to Next.js with TypeScript
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Share Stories**: Copy to clipboard, share on social media

## 🛠️ Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Google Gemini AI** - Story generation
- **Swiper.js** - Touch sliders
- **CSS3** - Advanced animations and effects
- **Vercel** - Deployment platform

## 🎯 Age Groups & Story Complexity

1. **3-6 years**: Simple sentences, lots of emojis, 100-150 words
2. **7-9 years**: Basic complexity, clear story flow, 150-200 words
3. **10-12 years**: More complex vocabulary, detailed characters, 200-250 words
4. **13+ years**: Advanced language, deeper moral lessons, 250-300 words

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd pasakainext
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AgeSlider.tsx
│   ├── FireflyEffect.tsx
│   ├── LoadingAnimation.tsx
│   ├── SettingSwiper.tsx
│   ├── ShareButtons.tsx
│   ├── ThemeToggle.tsx
│   └── TypewriterText.tsx
├── lib/                 # Utilities and configurations
│   ├── constants.ts     # Story options
│   └── gemini.ts        # AI integration
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   │   └── generate-story.ts
│   ├── _app.tsx
│   └── index.tsx
├── styles/              # CSS styles
│   └── globals.css
└── types/               # TypeScript type definitions
    └── index.ts
```

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## 🌟 Key Features Implementation

### Story Generation
Stories are generated using Google's Gemini AI with custom prompts tailored to:
- Selected story elements (time, place, characters, mood)
- Age-appropriate complexity levels
- Lithuanian language requirements
- Emoji integration and formatting

### Interactive UI Components
- **Swiper Integration**: Touch-friendly selection of story elements
- **Theme Toggle**: Light/dark mode with system preference detection
- **Loading Animation**: Engaging animations during story generation
- **Typewriter Effect**: Stories appear with typewriter animation
- **Firefly Animation**: Ambient background animations

### Mobile-First Design
- Responsive layout for all screen sizes
- Touch-friendly controls
- Optimized loading for mobile networks
- Progressive enhancement

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `GEMINI_API_KEY`
3. Deploy automatically on git push

### Other Platforms

The app can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- AWS
- Google Cloud Platform

## 📊 Migration from Express.js

This project was successfully converted from an Express.js + EJS application to Next.js + TypeScript:

### What was converted:
- ✅ Express.js API → Next.js API routes
- ✅ EJS templates → React components
- ✅ Vanilla JavaScript → TypeScript
- ✅ CSS → CSS modules with TypeScript integration
- ✅ File structure → Modern Next.js structure
- ✅ Dependencies → Updated to latest versions

### Files removed:
- `api/index.js` (old Express server)
- `views/index.ejs` (EJS template)
- `public/js/main.js` (vanilla JavaScript)
- `public/css/style.css` (moved to src/styles)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for story generation
- Lithuanian language support
- Child-friendly content focus
- Community feedback and testing

---

Made with 💖 for children's joy | Sukurta su 💖 vaikų džiaugsmui