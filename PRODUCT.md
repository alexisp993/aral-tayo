<!-- impeccable:product-schema 1 -->

---

name: Aral Tayo
platform: web
stack: Next.js, React, TypeScript, Tailwind CSS
---

# Aral Tayo

Aral Tayo is a Philippine learning platform for students. Its student experience should feel encouraging, clear, and age-appropriate while supporting learning across school subjects.

## Confirmed product constraints

- The product serves student learning and uses Philippine-inspired visual accents.
- The student shell has Home, Subjects, Progress, Achievements, and AI Tutor as primary destinations.
- Phase 1 established the shared visual primitives, responsive navigation, and app shell.
- Phase 2 includes seed-backed Home, Subjects, Mathematics, Adding Fractions, and Comparing Fractions routes.
- All four lesson steps are account-linked: Learn and Flashcards completion sync through Supabase alongside authenticated Practice attempts and Quiz completion.
- Lesson content now resolves through a shared registry, and Practice, progress, and Quiz APIs validate the requested lesson before loading its seed or question bank.
- Authenticated Practice attempts are validated and scored on the server, then persisted in Supabase.
- Quiz access requires at least 80% distinct correct Practice activities from real saved attempts.
- The Adding Fractions Fraction Quest shuffles five distinct checkpoints from nine games: Fraction Memory, Recipe Builder, Fraction Cannon, Number-Line Dash, Pizza Slice Catch, Fraction Runner, Bridge Builder, Treasure Match, and Order Tower; immutable server-locked answers persist across refresh before account-linked XP, streaks, and achievements are awarded.
- Comparing Fractions provides its own Learn sequence, eight flashcards, seven authenticated Practice activities, and nine-game Quiz bank with independent progress and gating.
- Progress and Achievements provide the first learner-statistics and leaderboard surfaces.
- AI Tutor behavior and AI-generated curriculum remain future scope.
