# Codex Implementation Plan

## Strategy
Build one complete vertical slice before expanding content.

## Phase 0 — Repository foundation
- Next.js + TypeScript
- Tailwind
- lint/format/test setup
- environment template
- Supabase client/server utilities
- route groups/layout
- basic auth

Acceptance:
app boots, auth works, protected student shell works.

## Phase 1 — Design system and app shell
Implement shared:
- sidebar
- top bar
- cards
- buttons
- progress
- badges
- responsive behavior

Acceptance:
screens can be assembled without page-specific duplicated CSS.

## Phase 2 — Curriculum navigation
Implement:
- Home
- Subjects
- Subject Detail
- Lesson Overview

Use seed data first, database-backed.

Acceptance:
Alex can navigate to Adding Fractions and resume it from Home.

## Phase 3 — Learning modes
Implement:
- Learn
- Flashcards

Acceptance:
completion persists and lesson progress updates.

## Phase 4 — Activity Engine
Implement `ActivityRenderer` plus:
1. Multiple Choice
2. Drag & Drop
3. Match Pairs
4. Sort & Categorize
5. Hotspot/Tap

Acceptance:
all five render from structured activity data and emit the normalized attempt contract.

## Phase 5 — Practice
Implement practice sequence, retries, hints, feedback, XP hooks, contextual AI help.

Acceptance:
practice attempts persist and progress advances.

## Phase 6 — Quiz and Results
Implement quiz attempt lifecycle, timer if configured, final submission, scoring, review, results.

Acceptance:
quiz does not leak correctness before submission; results correctly show score/review.

## Phase 7 — Mastery
Implement competency evidence updates and recommendations.

Acceptance:
activity/quiz results change competency mastery predictably and idempotently.

## Phase 8 — Gamification
Implement XP ledger, streak, levels, achievements.

Acceptance:
no duplicate XP; achievements unlock from real events.

## Phase 9 — AI Tutor
Implement dedicated page and contextual helper using the same service/context builder.

Acceptance:
practice help is scaffolded; quiz help does not reveal graded answers.

## Phase 10 — Progress and Achievements
Connect pages to real learning data.

Acceptance:
no placeholder statistics in production paths.

## Phase 11 — QA
- responsive checks
- keyboard accessibility
- drag/drop alternative input
- loading/error/empty states
- RLS tests
- attempt/mastery/XP idempotency tests
- visual comparison against mockups

## Do not expand scope until the vertical slice passes end-to-end.
