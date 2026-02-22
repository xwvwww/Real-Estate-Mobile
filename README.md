# Real Estate Mobile

Mobile application for a real estate platform, built with `Expo` and `React Native`.

## Product Scope

The app follows a **B2B2C** model:
- Users browse listings and submit requests.
- Agencies and developers publish listings after verification.
- Admin-side moderation controls listing quality and safety.

## Current Status

Implemented:
- Login flow (`/login`)
- Forgot password screen (`/forgot-password`)
- Multi-step registration (`/register`)
- Reusable UI components for form controls and checkboxes

Planned next:
- Dashboard screens
- Backend integration with Go API
- Listing catalog, map, and request workflow

## Tech Stack

- `Expo`
- `React Native`
- `Expo Router`
- `TypeScript`
- `react-native-svg`
- `expo-document-picker`

## Quick Start

```bash
npm install
npx expo start
```

For cache reset during UI work:

```bash
npx expo start -c
```

## Scripts

```bash
npm run lint
```

## Project Structure

- `app/` — route-based screens
- `components/` — reusable UI components
- `assets/` — icons and static files
- `.github/` — issue/PR templates and repository workflow files

## Git Workflow

- `main` — stable branch
- `develop` — integration branch
- `feature/*` — feature development
- `fix/*` — bug fixes
- `docs/*` — documentation updates

Pull request flow:
1. Create/update an issue.
2. Work in a dedicated branch.
3. Open PR into `develop`.
4. Merge `develop` into `main` for release sync.

## Repository

- GitHub: [xwvwww/Real-Estate-Mobile](https://github.com/xwvwww/Real-Estate-Mobile)

## License

This project is licensed under the MIT License. See `LICENSE`.
