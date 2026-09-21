# Activity Engine — v2

## Goal
Render structured learning activities through one reusable engine while keeping rendering, response collection, validation, persistence, scoring, mastery, and rewards cleanly separated.

## Supported MVP types
- `multiple_choice`
- `drag_drop`
- `match_pairs`
- `sort_categorize`
- `hotspot`

## Renderer
Conceptual API:

`<ActivityRenderer activity={publicActivity} mode="practice|quiz" />`

The renderer receives a **sanitized public activity DTO**. It never receives a canonical answer key for a graded Quiz.

## Boundaries

### Canonical activity
Server/private representation:
- id
- lesson_id
- version
- type
- instruction
- config
- answer_key
- explanation
- competency mappings
- publication state

### Public activity DTO
May contain only what is required to render:
- id
- version
- type
- instruction
- public config
- media references
- display metadata

For graded Quiz, exclude:
- answer key
- correctness flags
- private rationales that reveal the answer
- hidden scoring data

### Renderer response
Type-specific learner response only.

### Server validator
Receives:
- authenticated student
- canonical activity/version
- learner response
- mode
- attempt/session identity

Returns normalized validation/scoring result.

## Normalized evidence result
- event_id
- student_id
- activity_id
- activity_version
- competency mappings
- mode
- score_fraction: 0..1
- is_correct
- attempts_used
- hint_used
- ai_help_used
- started_at
- completed_at
- duration_seconds

## Practice
Purpose: teaching/reinforcement.

Flow:
`ready → interacting → submitting → feedback → retry/complete`

Rules:
- immediate validation
- maximum guided retries default: 2
- hints allowed
- Tara scaffolding allowed
- first incorrect response does not immediately reveal final answer
- all attempts may be stored for history
- only the final completed activity creates one mastery evidence event
- **individual Practice activities award 0 XP**
- completing the configured Practice set awards +20 XP once

Practice completion:
- Set is complete when every required activity has a terminal completion record.
- MVP vertical slice has 7 required Practice activities.
- Progress denominator is derived from the set content.
- Quiz unlock threshold remains configurable; vertical-slice seed uses 80% Practice completion.

## Quiz
Purpose: independent assessment.

Flow:
`intro → answering/saving → submit confirmation → submitted → results`

Rules:
- no correctness feedback before final submission
- no answer key in client payload
- no hints in graded MVP Quiz
- no similar solved example for the active item
- Tara Quiz Help may clarify instructions/interface or encourage, but may not solve or derive the active answer
- selection styling is neutral
- scoring occurs server-side
- submitted attempt is immutable
- Results may expose correct answers and explanations
- timer disabled by default

## Partial credit
MVP default is **all-or-nothing per activity/question** for all five activity types.
`score_fraction` is therefore 0 or 1 unless a future activity explicitly declares another scoring policy.

## Hotspot rules
Hotspot config supports:
- `selection_count` when any N regions are valid
- `correct_region_ids` when location matters

Every region must have a stable ID and accessible label.

## Versioning
Every canonical activity has an integer version beginning at 1.
Attempts/evidence store the exact activity version.
Published content is not mutated in a way that changes historical scoring; create a new version.

## Idempotency
Every submission carries a server-issued or server-validated request/event ID.
Derived processing uses that event ID exactly once.
Network retries must return the existing result rather than duplicate evidence/rewards.

## Anti-random-click rules
- no per-click XP
- no per-retry XP
- only terminal Practice completion contributes one evidence event per activity version
- repeated client submissions cannot create duplicate derived events
