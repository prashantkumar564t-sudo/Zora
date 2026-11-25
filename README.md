# ZORA — Cinematic OTT Streaming Web App (UI/UX & Frontend Prototype)

**ZORA** is a dark editorial (`#141414`) OTT streaming showcase web application built with a crisp streaming-grade visual hierarchy, responsive cinema playback, mood-based discovery, and persistent client-side profiles.

## Features

- **Profile Switcher (Profile Gate)** — Switch seamlessly between `Prashant`, `Recruiter Demo`, and `Kids` profiles. The `Kids` profile automatically filters the catalog to `U` and `U/A 13+` titles, and each profile maintains its own independent watchlist and viewing history.
- **Animated "Explore by Mood" Discovery** — Four interactive glassmorphic mood cards (*High-Octane Action*, *Mind-Bending Thrillers*, *Heartfelt Drama*, *Binge Web Series*) with crimson glow active states and an animated filtered catalog shelf below.
- **Live Search & Category Filters** — Expanding top-bar live search filters by movie title, actor, or genre in real time alongside instant category pills (`All`, `Action`, `Thriller`, `Drama`, `Web Series`).
- **Animated "Surprise Me" Picker** — Interactive navbar dice button with hover shimmer and a 0.6s shuffle animation that automatically opens the Detail Modal for a randomly selected title.
- **Custom Responsive YouTube Cinema Player** — Full-viewport uncropped YouTube playback on desktop with an auto-hiding top header (`← Back to ZORA`, `Hindi` badge, `4K UHD • DOLBY ATMOS`), plus a dedicated mobile watch view with a separate sticky top bar, crisp 16:9 edge-to-edge player, synopsis, and *More Like This* recommendations.
- **LocalStorage Watchlist & Continue Watching** — Toggling `+ My List` persists saved titles in `localStorage` under the `My List` tab, and clicking `Play Now` automatically adds titles to the *Continue Watching* horizontal row below the Hero Banner with a crimson progress bar along the bottom edge of each card.
- **Detail Modal with Instant Share** — Glassmorphic movie details modal showing cast, genres, `Audio: Hindi`, *More Like This* recommendations, and a Share icon button that copies the URL with a brief `Link copied!` toast.

## Tech Stack

- **Framework:** Next.js 15 (App Router) & React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (`motion/react`)
- **Icons:** Lucide React (`lucide-react`)
- **Video Playback:** Responsive YouTube IFrame Embeds

## Getting Started

```bash
# Install dependencies
npm install

# Run local development server (http://localhost:3000)
npm run dev

# Run unit tests
npx tsx --test lib/catalog.test.ts

# Run linter and production build
npm run lint
npm run build
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Vercel automatically detects Next.js using `vercel.json` and runs `npm run build` with zero extra configuration required.

---

*Educational portfolio & UI/UX prototype showcasing public YouTube embeds. All media rights belong to their respective owners.*
