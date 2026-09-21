# TaraLearn Specification Patch v2 — Changelog

## Authority
This patch resolves the implementation-readiness findings from the Codex audit.

Where this patch conflicts with the original handoff, **v2 takes precedence**.

## Approved product decisions
1. Graded Quiz does not expose hints, worked examples, correctness feedback, or answer-solving Tara assistance before submission.
2. Tara may remain available in Quiz only as **Quiz Help**, limited to instruction clarification, interface help, and encouragement.
3. Quiz selections use neutral selected styling until Results.
4. Practice awards **+20 XP once per completed Practice set**. Individual Practice activities award 0 XP.
5. The vertical-slice Practice set contains **7 activities**. Counts are always derived from content, never hard-coded from mockups.
6. Mastery uses the deterministic Mastery v1 contract in `08_MASTERY_ENGINE.md`.
7. Quiz timer is **off by default** for MVP. Timer behavior is configurable for future assessments.
8. Mobile primary navigation uses a bottom navigation bar for Home, Subjects, Progress, Achievements, and AI Tutor.
9. Canonical answer keys, scoring, mastery, XP, streaks, achievements, and submitted-attempt state are server-authoritative.
10. Prototype seed content remains non-official curriculum content and must not be represented as validated DepEd/MATATAG content.

## Mockup exceptions
The existing Quiz mockup remains useful for geometry/layout, but these visual elements are explicitly superseded:
- remove `Need a Hint?` / `Show Hint`
- replace unrestricted `Ask Tara` with quiz-safe `Quiz Help`, or hide it
- do not use green/red correctness styling on an active Quiz selection
- do not assume the shown timer is required
- question counts/progress are data-driven

The Lesson Overview mockup's completed-step count must be data-driven. An incomplete Practice step is not counted as completed.

## New documents
- `15_SEED_IMPORT_CONTRACT.md`
- `16_RESPONSIVE_BEHAVIOR.md`
- `17_ACCESSIBILITY_CONTRACT.md`
- `18_SECURITY_AND_AUTHORITY.md`

## Replaced/revised documents
- `05_ACTIVITY_ENGINE.md`
- `07_DATABASE_SCHEMA.md`
- `08_MASTERY_ENGINE.md`
- `09_GAMIFICATION.md`
- `10_AI_TUTOR.md`
- `13_INTERACTION_STATES.md`
- `14_MOCKUP_MAP.md`
- `adding-fractions.seed.json`

## Implementation gate
After merging this patch, rerun the Codex readiness review. Phase 0 starts only after no blocker remains.

## v2.1 Database Integrity Corrections

1. Mastery evidence uniqueness changed from `event_id` to `(event_id, competency_id)` so one event may produce evidence for multiple competencies.
2. XP uniqueness changed to `(student_id, reward_key)`; event IDs remain for traceability without weakening once-per-reward enforcement.
3. Mastery v1 now defines deterministic `occurred_at ASC, event_id ASC` processing, replay for delayed evidence, and serialization of concurrent updates per student + competency.
