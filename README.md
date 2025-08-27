## PasakAI (pasakai.lt)

Lithuanian children's story generator web app. The frontend is a single EJS page that lets users pick time, place, characters, mood and target age; the server calls Google Gemini (via @google/generative-ai) to generate a short, age-appropriate story in Lithuanian.

Key features
- Interactive, animated UI (Swiper + custom CSS/JS) at `views/index.ejs` and `public/` assets.
- Server API implemented with Express in `api/index.js` which uses the `@google/generative-ai` client.
- Configurable story complexity and safety settings.
- Ready for deployment on Vercel (see `vercel.json`).

Tech stack
- Node.js (>=18)
- Express
- EJS (view engine)
- @google/generative-ai (Gemini client)
- Swiper (front-end selection UI)

Quick file map
- `api/index.js` — Express server and /api/generate-story handler.
- `views/index.ejs` — Single page UI template.
- `public/css/style.css` — Styling and animations.
- `public/js/main.js` — Client logic: swipers, UI, calling the API.
- `vercel.json` — Vercel build/routes configuration.
- `package.json` — scripts & dependencies.

Requirements / assumptions
- Node.js v18 or newer (see `package.json.engines`).
- A Google Gemini API key set in `GEMINI_API_KEY` environment variable for story generation.
- This README assumes you want to run the app locally for development or deploy to Vercel.

Environment variables
- `GEMINI_API_KEY` (required) — API key for the Google Generative AI / Gemini client.
- `NODE_ENV` (optional) — set to `development` to get extra error details.

Local development
1. Install dependencies

```powershell
npm install
```

2. Create a `.env` file at the project root with at least:

```powershell
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

3. Run in dev mode (nodemon)

```powershell
npm run dev
```

4. Open http://localhost:3000 in your browser.

Production / Vercel
- `vercel.json` is present and maps `/` and `/api/*` to `api/index.js`. To deploy:
  - Add `GEMINI_API_KEY` to your Vercel project environment variables.
  - Push to GitHub and import the repo into Vercel, or use the Vercel CLI.

API
- POST /api/generate-story
  - Request JSON body: { time, place, characters, mood, ageGroup }
    - `ageGroup` is a stringified number between 1 and 4 (the UI uses 1..4)
  - Response: { story } where `story` is the generated Lithuanian text.

Example curl (local server)

```powershell
curl -Method POST -ContentType 'application/json' -Body (ConvertTo-Json @{ time='Seniai seniai'; place='Stebuklingame miške'; characters='Princesė ir drakonas'; mood='Linksma'; ageGroup='2' }) http://localhost:3000/api/generate-story
```

Notes and caveats
- The app depends on Google's Gemini model via `@google/generative-ai`. Make sure your API key has access and that you understand usage costs and quotas.
- `api/index.js` includes safety setting stubs and text-cleanup logic. The app expects the model to return plain text. If the client library or model signature changes, the API wrapper may need updates.
- Do not commit secrets. Add `.env` to `.gitignore` if not already present.

Troubleshooting
- Server doesn't start: ensure Node >= 18 and run `npm install`.
- 500 from /api/generate-story: check `GEMINI_API_KEY` and VPC/network restrictions; set `NODE_ENV=development` locally to see error.message details.
- Missing frontend behavior: `public/js/main.js` expects Swiper from CDN; ensure network access or vendor the Swiper package.

Potential next steps (recommended)
- Add a `.env.example` to show required env variables (without secrets).
- Add a small automated test that mocks the Gemini client for the API endpoint.
- Add a `.gitignore` entry if not present to ignore `.env`.

License
- No license file included in the repo. Add `LICENSE` if you plan to open-source. By default, code in the repo is under the repository owner's terms.

Requirements coverage
- Analyze webapp: Done — README inspects server, views, public assets and Vercel config.
- Generate README: Done — this file created with setup, API, and deployment docs.

Contact / author
- Repo: pasakai.lt (owner: takeourcarsnow)

---
Generated on: 2025-08-27
