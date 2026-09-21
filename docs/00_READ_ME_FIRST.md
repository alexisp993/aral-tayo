# TaraLearn Codex Implementation Pack

## Purpose
This folder is the implementation source of truth for the TaraLearn MVP.

**Behavioral source of truth:** `/docs`  
**Visual source of truth:** `/mockups`  
**Seed content:** `/seed`

Codex must implement the product from these specifications and mockups rather than redesigning the experience.

## MVP learning loop
Home → Subjects → Subject Detail → Lesson Overview → Learn → Flashcards → Interactive Practice → Quiz → Results → Progress / Achievements

AI Tutor is available as contextual help throughout the learning experience.

## MVP student navigation
- Home
- Subjects
- Progress
- Achievements
- AI Tutor

Calendar and Messages may remain visible in existing visual references, but they are **not functional MVP requirements**.

## Core technical direction
- Next.js + TypeScript
- Tailwind CSS
- PostgreSQL / Supabase
- Supabase Auth + Storage
- OpenAI API for the AI Tutor
- Vercel deployment
- PostHog-ready analytics hooks

## Critical implementation rules
1. Do not redesign screens unless a specification explicitly requires a responsive adaptation.
2. Reuse shared layout and activity components.
3. Do not hard-code Grade 5 Mathematics into the architecture; it is the first vertical slice only.
4. Separate curriculum/content data from rendering logic.
5. Separate activity data from activity renderer components.
6. Practice and Quiz have different feedback rules.
7. Mastery is competency-based, not merely lesson-completion based.
8. AI Tutor must receive curriculum and learner context.
9. Build the vertical slice first before expanding subjects or grades.
10. Use accessible keyboard/touch interactions and clear focus states for every interactive activity.

## Recommended Codex reading order
1. 01_PRODUCT_SPEC.md
2. 02_MVP_SCOPE.md
3. 03_USER_FLOWS_AND_ROUTES.md
4. 04_DESIGN_SYSTEM.md
5. 05_ACTIVITY_ENGINE.md
6. 06_CURRICULUM_MODEL.md
7. 07_DATABASE_SCHEMA.md
8. 08_MASTERY_ENGINE.md
9. 09_GAMIFICATION.md
10. 10_AI_TUTOR.md
11. 11_IMPLEMENTATION_PLAN.md
12. 12_CODEX_MASTER_PROMPT.md
