# Mockup Map — v2

## Rule
Mockups remain the visual source of truth **except where v2 behavioral corrections explicitly override misleading content**.

## Canonical mappings
- `01-home.png` → `/student/home`
- `02-subjects.png` → `/student/subjects`
- `03-subject-detail.png` → `/student/subjects/[subjectSlug]`
- `04-lesson-overview.png` → `/student/lessons/[lessonSlug]`
- Learn reference: `05-learn.png` OR current `05-learn-mode.png`
- `06-flashcards.png` → `/student/lessons/[lessonSlug]/flashcards`
- `07-practice-multiple-choice.png` → Practice renderer
- `08-practice-drag-drop.png` → Practice renderer
- `09-practice-match-pairs.png` → Practice renderer
- `10-practice-sort-categorize.png` → Practice renderer
- Hotspot reference: `11-practice-hotspot.png` OR current `11-practice-tap-identify.png`
- Quiz reference: `12-quiz.png` OR current `12-interactive-quiz.png`
- Results reference: `13-results.png` OR current `13-quiz-results.png`
- `14-progress.png` → `/student/progress`
- `15-achievements.png` → `/student/achievements`
- `16-ai-tutor.png` → `/student/ai-tutor`

Filename aliases above are approved; renaming is optional if the mapping remains explicit.

## Quiz mockup override
Keep:
- page geometry
- header hierarchy
- question card
- option layout
- progress area
- navigation structure
- general visual language

Override/remove:
- `Need a Hint?`
- `Show Hint`
- worked solution/hint
- unrestricted Tara wording
- green/red active-answer correctness
- assumption that timer is enabled

If Tara remains in right rail, label as `Quiz Help` and use only `quiz_safe` behavior.

## Practice mockup override
- Practice has 7 activities in vertical slice.
- Counts/progress derive from content.
- Remove per-question `10 XP`.
- Set-level reward may show `Complete Practice: +20 XP`.

## Lesson Overview override
- completed steps derive from terminal states
- partial Practice does not count as completed
- with Learn + Flashcards complete and Practice at 65%, display 2 of 4 completed

## Progress/Achievements placeholder rule
Do not implement fake data solely to reproduce mockup metrics.
For MVP vertical slice:
- omit rankings such as Top 10%
- omit goal editing unless separately approved
- unsupported badge catalog items are visual placeholders
- unsupported subjects use honest empty/locked states or are omitted according to available seed data

## Out-of-scope sidebar
Calendar/Messages are nonfunctional MVP.
Recommended desktop: visible only if needed for visual fidelity, marked Coming Soon/disabled.
Recommended mobile: omit from primary bottom navigation.
