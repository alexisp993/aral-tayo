# Mastery Engine v1 — Deterministic Contract

## Goal
Produce a deterministic, explainable 0–100 mastery score per student + competency from immutable evidence.

Algorithm identifier: `mastery-v1`

No ML is used.

## Status bands
- 0–39: Needs Practice
- 40–69: Learning
- 70–89: Proficient
- 90–100: Mastered

Boundary rule: round the stored score to two decimals; status is determined from the unrounded internal score using the ranges above.

## Evidence sources
Only completed scored evidence contributes:
- Practice terminal activity completion
- Submitted Quiz item

Learn and Flashcard completion do not prove mastery.

## Competency allocation
An activity may map to multiple competencies.

Normalize its positive competency weights so they sum to 1.0.

Example:
- competency A weight 0.7
- competency B weight 0.3

The same adjusted event score is recorded for each mapped competency with its normalized mapping weight available for aggregation.

For MVP aggregation, each competency's event weight is:
`source_weight × competency_mapping_weight`

## Step 1 — event score

Base:
`base_score = score_fraction × 100`

MVP score_fraction is 0 or 1.

### Practice independence multiplier
Start at 1.00.

Help multiplier:
- no hint and no AI help: 1.00
- hint used, no AI help: 0.85
- AI help used (with or without hint): 0.70

Retry multiplier:
`max(0.70, 1.00 - 0.10 × (attempts_used - 1))`

Examples:
- 1 attempt = 1.00
- 2 attempts = 0.90
- 3 attempts = 0.80
- 4+ bottoms at 0.70

Practice adjusted score:
`base_score × help_multiplier × retry_multiplier`

An incorrect terminal completion remains 0 regardless of multipliers.

### Quiz independence multiplier
Submitted graded Quiz items:
`1.00`

No hint/AI penalty is needed because graded MVP Quiz disallows those forms of assistance.

## Step 2 — channel aggregates

For one competency, calculate weighted mean adjusted score for each available channel.

### Practice channel
Source weight per event: `1.0 × competency_mapping_weight`

`practice_score = weighted_mean(practice adjusted scores)`

### Quiz channel
Source weight per event: `1.0 × competency_mapping_weight`

`quiz_score = weighted_mean(quiz item base scores)`

Only the latest **20 evidence events per source channel per competency** are included in v1, ordered by `occurred_at DESC, event_id DESC`. This prevents unlimited historical accumulation while remaining deterministic.

## Step 3 — consistency/recency channel

### Independent-success streak
Look at the latest scored evidence events for the competency across Practice and Quiz.

An event is an independent success when:
- adjusted score >= 90
- and for Practice: no hint, no AI help, attempts_used = 1
- or it is a correct submitted Quiz item

Count consecutive independent successes from newest backward, capped at 4.

Consistency score:
- 0 successes = 0
- 1 = 25
- 2 = 50
- 3 = 75
- 4+ = 100

### Recency factor
Based on whole elapsed days since newest evidence:
- 0–7 days: 1.00
- 8–14 days: 0.95
- 15–30 days: 0.90
- 31–60 days: 0.80
- 61+ days: 0.70

`consistency_recency_score = consistency_score × recency_factor`

Recency never directly lowers Practice/Quiz accuracy in v1; it only affects this 10% channel.

## Step 4 — raw mastery blend

Nominal channel weights:
- Quiz: 0.60
- Practice: 0.30
- Consistency/recency: 0.10

### Missing-channel normalization
Use only channels that have evidence and renormalize their nominal weights to sum to 1.

The consistency channel is considered available only when at least one scored evidence event exists.

Examples:
- Practice only → Practice 75%, consistency 25% because 0.30 : 0.10 renormalizes to 0.75 : 0.25.
- Quiz only → Quiz 85.7142857%, consistency 14.2857143%.
- Practice + Quiz → all three use 60/30/10.

`raw_mastery = Σ(channel_score × normalized_channel_weight)`

## Step 5 — smoothing

Cold start:
If no previous mastery exists:
`new_mastery = raw_mastery`

Existing mastery:
`new_mastery = 0.50 × previous_mastery + 0.50 × raw_mastery`

The previous mastery must be the state immediately before the triggering new evidence event is processed.

Store score rounded to 2 decimal places.

## Idempotency
Every source completion/submission has a unique event ID.

Before processing:
- if `(event_id, competency_id)` already exists in `mastery_evidence`, do nothing and return existing state.

Mastery update and evidence insertion occur in one transaction.

Store:
- algorithm_version = `mastery-v1`
- triggering event ID
- raw/adjusted evidence
- resulting mastery

## Evidence Processing Order

Evidence for one student + competency is processed serially in:
1. `occurred_at ASC`
2. `event_id ASC`

If a new event follows the most recently processed event, process it normally.

If delayed evidence arrives earlier than evidence already included in the current mastery state:
1. store the new immutable evidence if it does not already exist
2. retrieve the retained evidence for that student + competency
3. sort by `occurred_at ASC, event_id ASC`
4. replay Mastery v1 from the beginning with the same algorithm/configuration
5. replace the derived `competency_mastery` state with the replay result
6. preserve immutable `mastery_evidence` history
7. update `next_review_at` from the final replayed state

Concurrent updates for the same `student_id + competency_id` must be serialized with a database-safe mechanism so two events cannot calculate from the same stale mastery state. The implementation mechanism is intentionally left open.

Fetching, ordering, locking, replay orchestration, transactions, and persistence remain outside the pure calculation function.

## Retakes
A Quiz retake creates new immutable evidence with new event IDs.
It does not overwrite old evidence.
The latest-20 window and smoothing handle repeated attempts deterministically.

## Difficulty
Difficulty does **not** change mastery weight in v1.
Difficulty remains metadata for future versions.

## Review schedule
After mastery update, set `next_review_at` from the resulting status:
- Needs Practice: same local calendar day; if already past study session, next session may surface it immediately
- Learning: +1 calendar day
- Proficient: +5 calendar days
- Mastered: +10 calendar days

Use the student's IANA timezone when deriving calendar dates.

## Worked examples

### Example A — first independent Practice success
Correct on first attempt, no help.

Adjusted Practice = 100.
Consistency = 25.
Both available channels are Practice and consistency.

Raw:
`100×0.75 + 25×0.25 = 81.25`

Cold start mastery = **81.25 → Proficient**

### Example B — first Practice success with hint and second attempt
Correct, hint used, 2 attempts.

Base = 100
Help = 0.85
Retry = 0.90
Adjusted Practice = 76.50
Independent-success streak = 0 → consistency = 0

Raw:
`76.5×0.75 + 0×0.25 = 57.375`

Cold start mastery = **57.38 → Learning**

### Example C — subsequent perfect Quiz evidence
Previous mastery = 57.375.
Assume Practice channel = 76.5, Quiz channel = 100.
Newest event is correct Quiz; independent-success streak = 1 → consistency = 25.
Recency = 1.0.

Raw:
`100×0.60 + 76.5×0.30 + 25×0.10`
`= 60 + 22.95 + 2.5 = 85.45`

Smoothed:
`57.375×0.50 + 85.45×0.50 = 71.4125`

Stored mastery = **71.41 → Proficient**

### Example D — duplicate event
If Example C's event ID is submitted again, no new evidence row is created and mastery remains **71.41**.

## Pure-function requirement
Implement calculation as a pure domain function with:
- previous mastery
- evidence set
- current local date/time context
- algorithm config/version

It must not query Supabase internally. Fetch data outside, calculate, then persist transactionally.

## Required unit tests
Cover:
- cold start
- missing channels
- hint/AI/retry multipliers
- weighted competency mapping
- latest-20 cutoff
- recency boundaries
- streak 0/1/2/3/4
- smoothing
- duplicate event
- status boundaries
- review dates
