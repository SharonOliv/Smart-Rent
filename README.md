# Smart Rent

A full-stack house rental/booking platform: browse and post listings, book a
property for a date range, take a personality quiz to find compatible
roommates, view listings in 360°/VR, and chat with an AI assistant.

Link: https://smart-rent-woad.vercel.app/

```
smartrent/
├── backend/   Express + MongoDB API
└── frontend/  React (Vite) + Tailwind CSS
```

## Design

The frontend uses a custom "blueprint" visual identity built for this app
specifically — a warm paper background, a deep ink/blueprint-blue palette,
brass accents, and a signature house-pin mark used as the logo, loading
state, and empty-state graphic. Fonts: Fraunces (display), Plus Jakarta Sans
(body), IBM Plex Mono (labels/prices/dates). All of it is implemented with
Tailwind v4 design tokens in `frontend/src/index.css`.

## Requirements

- Node.js 18+
- A MongoDB database — either:
  - **Local**: install MongoDB Community Server and run `mongod`, or
  - **Atlas** (free tier): create a cluster at mongodb.com/atlas and copy
    its connection string

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

- `MONGODB_URI` — your local Mongo URL or Atlas connection string
- `JWT_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
- `OPENAI_API_KEY` — your own OpenAI key, only needed for the chatbot;
  everything else works without it. Never commit this file or hardcode a key
  in source.

Seed some demo data (a few users and listings) so the app isn't empty:

```bash
npm run seed
```

This prints demo login credentials to the console, e.g. `sharon / sharon123`.

Start the API:

```bash
npm run dev
```

Runs on `http://localhost:5000`. Check `http://localhost:5000/api/health` to
confirm it's up.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000/api, edit if needed
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Features

- **Auth**: signup/login with bcrypt + JWT; password reset flow (returns a
  token directly since no email service is configured — see below)
- **Listings**: post a property with image uploads, browse/filter by
  location and price, see your own listings in a dashboard
- **Booking**: pick move-in/move-out dates; the server rejects overlapping
  bookings on the same property
- **Roommate matching**: a 4-question personality quiz feeds a compatibility
  score against other users
- **360° VR tours**: view a listing's photo as an immersive panorama
- **AI chat assistant**: a chat widget backed by your own OpenAI key,
  called only from the server — the key never reaches the browser

## Known limitations (good next steps)

- **Password reset has no email sender.** Requesting a reset returns the
  token directly in the API response/console instead of emailing it, so the
  flow is testable locally. Wire up a real provider (Resend, SendGrid, SES)
  before this touches real users.
- **Image storage is local disk** (`backend/uploads/`) — fine for
  development; swap in S3/Cloudinary for production.
- **No automated tests yet.**
- The frontend bundle is a single ~1MB JS chunk — consider `React.lazy`
  code-splitting if load time becomes a concern.
