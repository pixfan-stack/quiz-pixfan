# Quiz PixFan

Bilingual (French / English) quiz web app built with **React + TypeScript + Vite**, ready for **Cloudflare Pages** (static frontend + optional Pages Functions).

## 📊 Current Content

- **6 quiz categories** with **120 questions total** (20 per category)
- **Exposure Triangle**: Aperture, shutter speed, ISO fundamentals
- **Composition & Framing**: Rule of thirds, leading lines, negative space
- **Light & Color**: Golden hour, white balance, color temperature
- **Gear & Lenses**: Focal lengths, sensor formats, filters
- **History & Iconic Photographers**: From Niépce to modern legends
- **Photography Genres**: Portrait, street, landscape, macro, and more

## 🚀 Features

- ✅ **Fully bilingual** (FR/EN) with automatic language detection
- ✅ **Single & multiple choice** questions with explanations
- ✅ **Real-time scoring** with streaks and timing
- ✅ **Cross-device high scores** via Cloudflare D1 backend
- ✅ **Local high scores** via localStorage (offline support)
- ✅ **Social sharing** (Twitter/X, Facebook, LinkedIn, WhatsApp)
- ✅ **Responsive design** with glassmorphism UI
- ✅ **Accessible** with ARIA labels, keyboard navigation, and skip links
- ✅ **Cloudflare Pages ready** with D1 database integration

## 📈 Recent Updates

### v1.2.0 - Cloudflare Backend Integration
- Added Cloudflare D1 database for cross-device high scores
- Implemented remote score synchronization
- Added leaderboard API endpoint
- Created comprehensive deployment guide

### v1.1.0 - Accessibility & Content Expansion
- Added 108 new questions (total: 120 questions, 20 per category)
- Improved accessibility with skip links and ARIA labels
- Enhanced keyboard navigation and screen reader support
- Added comprehensive NEXT_STEPS.md for future development

## Architecture summary

| Layer | Role |
| --- | --- |
| **Components** | `LanguageSwitcher`, `QuizSelector`, `QuestionView`, `ResultScreen`, `HighScoreBadge`, `QuizScreen` |
| **Data flow** | `questions.json` → user selects quiz → `useQuizEngine` scores answers → `ResultScreen` |
| **i18n** | `react-i18next` + JSON files in `public/locales/{en,fr}/translation.json`; quiz content has inline `fr`/`en` fields |
| **High scores** | `src/utils/highscore.ts` (localStorage). Optional API client: `highscoreApi.ts` + `functions/api/highscore.ts` |
| **Sharing** | `src/utils/share.ts` builds Twitter/X, Facebook, LinkedIn, WhatsApp URLs with localized text |

```
User → LanguageSwitcher (persists i18nextLng)
     → QuizSelector (reads questions.json + local high scores)
     → QuestionView / useQuizEngine (single & multiple choice, streaks, timer)
     → ResultScreen (score message + social share buttons)
```

## Project structure

```
quizz-pixfan/
├── functions/
│   └── api/
│       └── highscore.ts          # Example Pages Function (KV/D1 ready)
├── public/
│   ├── _redirects                # SPA fallback for Cloudflare Pages
│   └── locales/
│       ├── en/
│       │   └── translation.json  # English UI strings
│       └── fr/
│           └── translation.json  # French UI strings
├── src/
│   ├── components/
│   │   ├── HighScoreBadge.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── QuestionView.tsx
│   │   ├── QuizScreen.tsx
│   │   ├── QuizSelector.tsx
│   │   └── ResultScreen.tsx
│   ├── data/
│   │   └── questions.json        # Quizzes + localized questions
│   ├── hooks/
│   │   └── useQuizEngine.ts      # Scoring, streaks, navigation
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   └── quiz.ts
│   ├── utils/
│   │   ├── highscore.ts          # localStorage high scores
│   │   ├── highscoreApi.ts       # Optional fetch to /api/highscore
│   │   ├── locale.ts
│   │   ├── scoring.ts
│   │   └── share.ts              # Social share URL builders
│   ├── App.tsx
│   ├── i18n.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## How to add content

### New questions / quizzes

Edit `src/data/questions.json`. Every user-facing string needs both `fr` and `en`:

```json
{
  "id": "my-quiz",
  "title": { "en": "My Quiz", "fr": "Mon quiz" },
  "description": { "en": "…", "fr": "…" },
  "questions": [
    {
      "id": "q1",
      "type": "single",
      "text": { "en": "…", "fr": "…" },
      "answers": [
        { "id": "a", "text": { "en": "…", "fr": "…" } }
      ],
      "correctAnswers": ["a"],
      "explanation": { "en": "…", "fr": "…" }
    }
  ]
}
```

- `"type": "single"` → one correct answer id  
- `"type": "multiple"` → one or more correct answer ids  

### New UI strings

1. Add the same key path in:
   - `public/locales/en/translation.json`
   - `public/locales/fr/translation.json`
2. Use `t('section.key')` or `t('section.key', { name: value })` in components.

### Share messages & URL

- Text: `share.text` in both locale files (`{{score}}`, `{{total}}`, `{{percent}}`, `{{quizTitle}}`)
- Hashtags: `share.hashtags`
- App URL: set `VITE_APP_URL` (see `.env.example`) or edit `APP_SHARE_URL` in `src/utils/share.ts`

## How to run and deploy

### Local development

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

### Production build

```bash
npm run build
```

Output directory: **`dist/`**

Preview locally:

```bash
npm run preview
```

### Deploy to Cloudflare Pages

1. Push the repo to GitHub/GitLab, or use direct upload.
2. In Cloudflare Pages, create a project and set:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (or your monorepo path)
3. (Optional) Framework preset: *None* or *Vite*.
4. (Optional) Environment variable: `VITE_APP_URL=https://your-domain.pages.dev`
5. Deploy. Pages Functions under `functions/` are picked up automatically when present.

### Optional remote high scores

1. Deploy with the `functions/api/highscore.ts` file.
2. Bind KV or D1 (see comments in that file).
3. Uncomment the `submitRemoteHighScore` / `fetchRemoteHighScore` call sites in `ResultScreen` / `useQuizEngine`.

The app remains fully usable **without** any backend — high scores stay in the browser.

## License

Demo project — no proprietary assets. System fonts only.
