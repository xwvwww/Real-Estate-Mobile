# Qonys Mobile

Mobile application for the Qonys real estate platform, built with `Expo`, `React Native`, `Expo Router`, and `TypeScript`.

The app supports three main mobile roles:
- `user` — browses listings, saves favorites, sends applications, chats with companies
- `agency` — creates and manages listings, reviews applications, works with messages
- `developer` — creates projects, publishes objects, reviews applications

## Current Scope

Implemented in the mobile app:
- authentication with backend login
- user registration
- company registration for `agency` and `developer`
- forgot password request flow
- password reset confirm flow
- account confirmation screen
- role-based dashboards
- public catalog and object details
- favorites synced with backend
- application creation and application detail screens
- chat/message flows based on applications
- profile update and password change
- developer projects: list, create, view, delete
- listing/object management for backend-created items:
  - create
  - view
  - edit
  - delete
  - add media
  - delete media
- reusable UI building blocks for empty states, dropdowns, headers, status badges, avatar picker

Still dependent on backend contracts:
- dedicated company settings update endpoint
- realtime messaging / online presence
- full backend-driven company-owned listings list endpoint
- moderator/admin flows are expected on web, not mobile

## Tech Stack

- `Expo`
- `React Native`
- `Expo Router`
- `TypeScript`
- `React Context` for auth session
- `expo-secure-store` for session persistence
- `expo-document-picker` for files and images
- `expo-image-picker` for avatar/gallery selection
- `expo-image`
- `react-native-maps`
- `react-native-svg`

## Backend

The app is configured through environment variables.

Main variable:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/v1
```

Create local env from the example:

```bash
cp .env.example .env
```

Then set `EXPO_PUBLIC_API_URL` to the backend you want to test against.

Important:
- do not commit local `.env`
- keep server-specific IPs and internal URLs out of the repository when possible

## Quick Start

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Start Expo with cache reset:

```bash
npx expo start -c
```

## Available Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run check:conflicts
```

## Project Structure

```text
app/          Route-based screens built with Expo Router
components/   Reusable UI components
constants/    Static configuration and temporary mock data
contexts/     Shared app context, including auth session
lib/          API clients and backend mapping helpers
stores/       Local client state for drafts and favorites
assets/       Images, icons, branding assets
scripts/      Project scripts and git hook helpers
.githooks/    Lightweight git hooks
```

Key folders:
- `app/(tabs)` — user tab screens
- `app/agency-*` — agency screens
- `app/developer-*` — developer screens
- `app/object`, `app/request`, `app/message` — detail routes
- `lib/api.ts` — main backend API layer

## Auth and Session

Authentication is backend-based.

Current auth flow:
- `POST /authentication/token`
- `POST /authentication/user`
- `POST /authentication/company`
- `POST /authentication/password-reset/request`
- `PUT /authentication/password-reset/confirm`
- `PUT /users/activate/{token}`

Session persistence:
- native: `expo-secure-store`
- web: `localStorage`

## Git Hooks

This repository uses a lightweight pre-commit hook from `.githooks/pre-commit`.

Current behavior:
- runs `scripts/check-conflicts.sh`
- blocks commits only if unresolved merge markers exist

## Branch Strategy

- `main` — stable branch
- `develop` — integration branch
- `feature/*` — feature work
- `fix/*` — bug fixes
- `docs/*` — documentation changes

Typical flow:
1. create or update a feature branch
2. merge into `develop`
3. validate integration
4. merge `develop` into `main`

## Repository Remotes

This project may be used with multiple remotes depending on the deployment environment.

Check remotes locally with:

```bash
git remote -v
```

## Notes for Development

- some screens still use temporary local data for presentation where backend contracts are incomplete
- backend-driven listing edit/delete currently works best for real backend-created listings opened by numeric id
- admin and moderator functionality is intentionally out of scope for this mobile app
- if Expo on a physical device hangs on load, verify both phone and laptop are on the same Wi‑Fi or use a tunnel

## License

This project is licensed under the MIT License. See [LICENSE](/Users/alnur/Desktop/Real_Estate/real-estate-app/LICENSE).
