# FairPlayReviewSystem (Mobile App)

A comprehensive cricket analysis and fair play review mobile application built with **Expo (React Native)**. It integrates with **Supabase** (client-side) and a separate **FastAPI** backend for match/review workflows and video analysis.

This repository is the **frontend/mobile app**.

## Features

### Match & review workflows

- Authentication and user profile flows (Supabase + API)
- Match management and review flows via the backend API
- Notifications and user-scoped data access via authenticated API calls

### Video analysis (Detection)

The app can upload videos for analysis via backend endpoints such as:

- `POST /api/analyze-video` (match-scoped analysis)
- `POST /api/detect/ball`
- `POST /api/detect/batsman`
- `POST /api/detect/wicket`

Note:

- Backend analysis behavior is implemented server-side. This repo only includes the client integration and configuration.

## Tech stack

- **Mobile**: Expo, React Native, Expo Router, React Query, Supabase JS, React Native Paper
- **Backend (separate service)**: FastAPI + Supabase (server-side)
- **Storage/DB**: Supabase

## Requirements

- **Node.js** (LTS recommended) + **npm**
- Windows, macOS, or Linux

## Installation

### Mobile app

```bash
npm install
```

## Environment variables

### Mobile app (`.env`)

Create from example:

```bash
cp .env.example .env
```

Variables:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_BASE_URL` (example: `http://localhost:8000/api`)

## Quick start

### Run the mobile app

From the repo root:

```bash
npm run start
```

Other options:

```bash
npm run android
npm run ios
npm run web
```

## Backend API (separate service)

This frontend expects a backend that provides endpoints under `EXPO_PUBLIC_API_BASE_URL`.

If you’re running the backend locally, a common setup is:

- Base URL: `http://localhost:8000/api`
- Interactive docs: `http://localhost:8000/docs`

Key endpoints used by the app may include:

- `POST /analyze-video?match_id=<id>`
- `POST /detect/ball`
- `POST /detect/batsman`
- `POST /detect/wicket`

Backend setup, secrets, and ML pipeline details belong in the backend repository/documentation.

## Connecting Mobile ↔ API

For local development:

- Set `EXPO_PUBLIC_API_BASE_URL=http://localhost:8000/api` in `.env`

For device testing (phone), use one of:

- Your machine LAN IP (example: `http://192.168.1.10:8000/api`)
- ngrok public URL (example: `https://<id>.ngrok-free.app/api`)

Restart Expo after changing `.env`.

## Project structure

```text
.
├── app/                     # Expo Router screens
├── components/              # Mobile UI components
├── hooks/                   # Mobile hooks (e.g., camera)
├── services/                # Mobile service layer
├── types/                   # Shared TS types
├── assets/                  # Images/icons
└── README.md
```

## Troubleshooting

- **App can’t reach API on a real device**
  - Don’t use `localhost`. Use LAN IP or ngrok.
  - Ensure firewall allows inbound traffic to port `8000`.

- **Expo env vars not updating**
  - Ensure variables are prefixed with `EXPO_PUBLIC_`.
  - Restart `expo start`.

## Scripts

- `npm run start`: start Expo dev server
- `npm run android`: start + open Android
- `npm run ios`: start + open iOS
- `npm run web`: start web build
- `npm run lint`: lint the mobile app

## License

Academic and demonstration use. Check individual component licenses (Expo, FastAPI, Supabase).
