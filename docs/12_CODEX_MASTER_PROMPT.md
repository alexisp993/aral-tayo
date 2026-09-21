# Codex Master Prompt

You are implementing TaraLearn from an approved product specification and approved visual mockups.

## Source-of-truth rules
1. Read every file in `/docs` before changing application architecture.
2. `/docs` is the behavioral/technical source of truth.
3. `/mockups` is the visual source of truth.
4. Do not redesign the screens.
5. Do not invent features outside `02_MVP_SCOPE.md`.
6. When a mockup conflicts with MVP scope (for example Calendar/Messages visible in navigation), preserve visual compatibility where useful but do not build out-of-scope functionality.
7. If implementation requires a decision not covered by the docs, choose the smallest extensible solution and document it rather than silently changing product behavior.

## Build strategy
Implement `11_IMPLEMENTATION_PLAN.md` sequentially.
Do not attempt the entire application in one uncontrolled pass.

At the start of each phase:
- state which files/routes/components will change
- identify the mockup(s) being implemented
- list acceptance criteria

At the end of each phase:
- run lint/typecheck/tests
- report failures
- visually compare the page against its mockup
- list intentional deviations, if any
- do not continue to the next phase while critical acceptance criteria fail

## Architecture requirements
- Next.js + TypeScript + Tailwind.
- PostgreSQL/Supabase.
- Content-driven curriculum.
- Reusable Activity Engine.
- Reusable shared UI components.
- No page-specific copies of the same activity logic.
- Persist attempts, progress, mastery, XP, streaks, and achievements.
- Apply RLS.
- Keep AI provider calls server-side.
- Never expose API secrets to the browser.

## Visual implementation
Match:
- layout proportions
- spacing hierarchy
- typography hierarchy
- card structure
- border radius
- shadows
- subject/activity colors
- progress indicators
- sidebar/topbar
- responsive information hierarchy

Do not use a generic admin-dashboard template in place of the mockups.

## Interactive activities
All activity types must be usable by mouse/touch and keyboard/click alternatives.
Practice and Quiz behavior must follow `05_ACTIVITY_ENGINE.md`.

## Testing priorities
Write tests for:
- activity validation
- quiz scoring
- mastery updates
- duplicate XP prevention
- achievement evaluation
- lesson gating
- AI quiz-help restrictions

## First target
Complete the Grade 5 Mathematics → Fractions → Adding Fractions vertical slice end-to-end before adding another lesson or subject.
