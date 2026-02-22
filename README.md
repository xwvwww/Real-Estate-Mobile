# Real Estate Mobile

Mobile app for a real estate platform, built with `Expo + React Native`.

## Overview

This project is part of a diploma system and follows a **B2B2C** product model:
- End users can browse listings and submit applications.
- Companies (agencies/developers) can publish and manage listings after verification.
- Admin flow includes moderation and status control.

## Current Progress

Implemented screens and flows:
- Login screen (`/login`)
- Forgot password screen (`/forgot-password`)
- Multi-step registration (`/register`)
- Shared UI components (checkbox, backgrounds, form controls)

## Tech Stack

- `Expo`
- `React Native`
- `Expo Router`
- `TypeScript`
- `expo-document-picker`
- `react-native-svg`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npx expo start
```

3. Start with clean Metro cache (recommended after UI updates):

```bash
npx expo start -c
```

## Project Structure

- `app/` — route-based screens (`expo-router`)
- `components/` — reusable UI blocks
- `assets/` — icons and static assets

## Useful Commands

```bash
# Lint
npm run lint

# Start Expo with cache reset
npx expo start -c
```

## Git Workflow

Branch strategy used in this repo:
- `main` — stable production-ready state
- `develop` — integration branch
- `feature/*` — feature work
- `fix/*` — bug fixes
- `docs/*` — documentation updates

## Repository

GitHub: [xwvwww/Real-Estate-Mobile](https://github.com/xwvwww/Real-Estate-Mobile)
