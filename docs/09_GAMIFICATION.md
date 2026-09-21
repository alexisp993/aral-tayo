# Gamification — v2

## Goal
Reward meaningful learning without rewarding repeated clicks/retries.

## XP contract
All rewards are server-authoritative and idempotent.

### MVP rewards
- Complete Learn for lesson/content version: +10 XP once
- Complete Flashcards for lesson/content version: +10 XP once
- Complete required Practice set for lesson/content version: +20 XP once
- Complete Quiz version: +30 XP once
- First Quiz result >= 90% for quiz version: +20 XP once
- First perfect Quiz result for quiz version: +30 XP once
- First time a competency reaches Mastered under current mastery algorithm: +50 XP once

### Bonus stacking
Perfect Quiz does **not** also receive the >=90% bonus.
A perfect qualifying result receives +30 performance bonus, not +50.

### Practice
Individual Practice activities: **0 XP**
Retries: **0 XP**
Hints/AI help do not reduce the +20 set-completion XP.
Mastery evidence may still reflect assistance.

### Quiz retakes
Base Quiz completion XP is awarded once per quiz version.
Performance bonus is awarded once per quiz version when first qualified.
Retakes can improve mastery but cannot farm base/bonus XP.

## Idempotency keys
Examples:
- Learn: `lesson-learn-complete:{lesson_id}:{content_version}`
- Flashcards: `lesson-flashcards-complete:{lesson_id}:{content_version}`
- Practice: `lesson-practice-complete:{lesson_id}:{content_version}`
- Quiz base: `quiz-complete:{quiz_id}:{quiz_version}`
- Quiz >=90: `quiz-90:{quiz_id}:{quiz_version}`
- Quiz perfect: `quiz-perfect:{quiz_id}:{quiz_version}`
- Mastery: `competency-mastered:{competency_id}:{algorithm_version}`

Database uniqueness is enforced through:
`(student_id, reward_key)`

`event_id` and `event_type` remain on each transaction for traceability and classification, but do not weaken the stable reward-key uniqueness boundary.

## Streak
A meaningful learning day requires at least one:
- Learn completion
- Flashcards completion
- Practice set completion
- submitted Quiz

Opening pages/chatting alone does not count.

At event time:
1. use student's current IANA timezone
2. derive and store `local_date`
3. store `timezone_at_event`
4. never retroactively move an existing event if timezone changes later

Multiple meaningful events on one local date count as one streak day.

## Levels
Level thresholds are configuration.
Initial prototype thresholds may be seeded, but UI must read configuration rather than infer a formula.

## Achievements
MVP approved examples:
- First Lesson
- 3-Day Streak
- 7-Day Streak
- Math Explorer
- Perfect Quiz
- Fraction Master

Unsupported badges visible in mockups are placeholders, not required MVP content.

Achievement awards are unique by `(student_id, achievement_id)`.
Achievement bonus XP, if configured, is a separate idempotent ledger event and cannot recursively re-award the same achievement.

## UI
Do not show `10 XP` beside individual Practice questions.
Show set-level reward copy such as `Complete Practice: +20 XP` where useful.
