# Aral Tayo

Philippine curriculum-aligned interactive learning for K–12 students. The first vertical slice covers Grade 5 Mathematics: Adding Fractions.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS, Supabase-compatible clients, Zod, Vitest, Testing Library, and Playwright.

## Requirements

- Node.js 22.12 or newer (`.nvmrc` pins 22.22.2)
- npm

## Getting Started

```sh
npm install
copy .env.example .env.local
npm run dev
```

Add the Supabase URL, publishable key, and secret/service-role key to `.env.local`. Apply the SQL files in `supabase/migrations` in timestamp order before testing authenticated Practice, Quiz, Progress, or Achievements.

## Available Scripts

- `npm run dev` — development server
- `npm run build` / `npm start` — production build/server
- `npm run lint` — ESLint
- `npm run typecheck` — strict TypeScript check
- `npm run test` / `npm run test:watch` — unit/component tests
- `npm run test:e2e` — Playwright smoke test
- `npm run format` / `npm run format:check` — Prettier

## Project Structure

- `src/app` — App Router entry points
- `src/config` — non-secret application metadata
- `src/lib/env` — validated client/server environment boundaries
- `src/lib/supabase` — browser, authenticated server, and service-role clients
- `src/lib/utils` — small shared utilities
- `src/test` and `tests/e2e` — test setup and smoke tests

## Specification

- `/docs` is the behavioral and technical source of truth.
- `/mockups` is the visual source of truth, subject to documented v2 corrections.
- `/seed` contains prototype vertical-slice content, not officially validated curriculum data.

## Implementation Status

**Adding Fractions vertical slice.** The responsive student shell, Home, Subjects, lesson overview, Learn, Flashcards, authenticated Practice, server-enforced Quiz gating, randomized Quiz sessions, XP, streaks, achievements, and leaderboard foundation are implemented. AI Tutor behavior and AI-generated curriculum remain future work.

All four lesson steps are tied to the authenticated account and stored in Supabase. Learn and Flashcards completion, Practice attempts, and quiz completion sync across a student's devices; quiz results, XP, streaks, and achievements are also account-linked.

The Quiz unlocks after at least six of the seven distinct Practice activities have been answered correctly across saved attempts. Each Fraction Quest has five shuffled checkpoints containing Bridge Builder, Treasure Match, and Order Tower interactions. Answers lock immediately on the server, survive refresh, and are graded only from saved responses.

## Security Notes

Never commit `.env.local`. The Supabase service-role key and OpenAI API key are server-only. Browser code is untrusted and must never become authoritative for answer keys, scores, mastery, XP, streaks, or achievements.
