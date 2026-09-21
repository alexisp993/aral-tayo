# TaraLearn Implementation Readiness Review

## 1. Executive Summary

**NOT READY**

The v2 patch resolves the three original product blockers: graded-Quiz help is now restricted, Practice XP is consistently set-level, and Mastery v1 is deterministic. It also adds useful seed-import, responsive, accessibility, security, and authority contracts. The revised seed parses and validates against its JSON Schema.

Two database constraints still contradict the intended behavior and should be corrected before Phase 0:

1. `mastery_evidence.event_id UUID UNIQUE` prevents one source event from producing evidence rows for multiple competencies, although the activity and mastery specifications explicitly support multi-competency activities.
2. `xp_transactions UNIQUE(student_id, event_type, event_id, reward_key)` does not enforce rewards that are “once per lesson/quiz/content version.” A retake has a new event ID and can therefore insert the same reward key again.

The package is otherwise implementation-ready at the planning level. No application code or migrations were created.

## 2. Files Inspected

Re-inspected all current package files:

- Original documents `docs/00_READ_ME_FIRST.md` through `docs/14_MOCKUP_MAP.md`.
- New documents: `15_SEED_IMPORT_CONTRACT.md`, `16_RESPONSIVE_BEHAVIOR.md`, `17_ACCESSIBILITY_CONTRACT.md`, `18_SECURITY_AND_AUTHORITY.md`, and `V2_CHANGELOG.md`.
- Root `README.md`.
- All 16 screen mockups, three architecture diagrams, and `mockups/README.md`.
- `seed/grade-5-math/adding-fractions.seed.json`.
- `seed/grade-5-math/activity-seed.schema.json`.
- Previous readiness report.

The mockup image hashes are unchanged from the first review. Four filenames remain aliases rather than the originally requested canonical names, but `14_MOCKUP_MAP.md` now explicitly approves them:

- `05-learn-mode.png` → Learn
- `11-practice-tap-identify.png` → Hotspot
- `12-interactive-quiz.png` → Quiz
- `13-quiz-results.png` → Results

There is still no application repository, package manifest, migrations, or test suite; that is expected before Phase 0.

## 3. Product Understanding

TaraLearn is a content-driven Philippine K–12 learning platform. Its MVP validates one complete Grade 5 Mathematics journey: Adding Fractions. Students learn, review flashcards, complete seven reusable interactive Practice activities, take a ten-question independent Quiz, review results, receive competency mastery and recommendations, and earn guarded XP/achievements. Prototype competency content is not represented as officially validated DepEd/MATATAG curriculum.

## 4. MVP Scope Validation

### IN SCOPE

- Student authentication and shell.
- Home, Subjects, Subject Detail, Lesson Overview, Learn, Flashcards, Practice, Quiz, Results, Progress, Achievements, and AI Tutor.
- Five reusable activity renderers.
- Persisted attempts, progress, mastery, XP, streaks, and achievements.
- Desktop, tablet, and mobile web.
- Seven Practice activities and ten Quiz questions for the vertical slice.

### OUT OF SCOPE

- Functional Calendar and Messages.
- Parent, teacher, and admin interfaces.
- Goal editing and grade rankings unless separately approved.
- Unsupported badge/catalog data shown in mockups.
- AI file/image uploads.
- Official curriculum certification.

### AMBIGUOUS

- Exact level-threshold configuration and the complete six-achievement criteria payload are not yet supplied, but these can safely be seeded during the relevant phase.
- Search, notifications, and settings appear visually but their MVP behavior remains minimal/undefined. They should be nonfunctional or limited until separately specified.

## 5. Mockup Audit

| Screen | Route | Major/shared components | Unique components | Data | States | Responsive challenge |
|---|---|---|---|---|---|---|
| Home | `/student/home` | AppShell, Sidebar, TopBar, StatCard, ProgressBar | WelcomeHero, ContinueLearning, TodayLessons | resume, progress, XP, streak | empty/loading/in-progress | Dense hero and dashboard columns |
| Subjects | `/student/subjects` | AppShell, SubjectCard | GradeSelector, SubjectGrid | grade subjects/progress | selected/empty/loading | Grade tabs and card grid |
| Subject Detail | `/student/subjects/[subjectSlug]` | AppShell, tabs, progress | UnitList, LessonList | units, lessons, gates | selected/locked/current | Desktop master/detail collapse |
| Lesson Overview | `/student/lessons/[lessonSlug]` | AppShell, LessonStepCard | LearningPath, Outcomes | lesson/gating/progress | not-started/partial/complete/locked | Four-step path becomes vertical |
| Learn | `/student/lessons/[lessonSlug]/learn` | Breadcrumbs, ProgressBar | LearnContent, WorkedExamples | content blocks/progress | tabs/loading/complete | Equations and right rail |
| Flashcards | `/student/lessons/[lessonSlug]/flashcards` | AppShell, progress | FlashcardDeck | cards/position/completion | front/back/navigation | Large card and rail stacking |
| Practice MCQ | Practice route | ActivityShell, progress, help, feedback | MultipleChoiceActivity | sanitized activity/attempt | selected/retry/feedback | Options/action area |
| Practice Drag | Practice route | ActivityShell | DragDropActivity | config/attempt | selected/placed/retry | Spatial layout and first-class select/move path |
| Practice Match | Practice route | ActivityShell | MatchPairsActivity | pairs/attempt | paired/disconnected/feedback | List pairing on narrow screens |
| Practice Sort | Practice route | ActivityShell | SortCategorizeActivity | categories/attempt | moved/removed/feedback | Category columns become list controls |
| Practice Hotspot | Practice route | ActivityShell | HotspotActivity | structured regions | selected/count/feedback | Scalable targets and nonvisual equivalent |
| Quiz | `/student/lessons/[lessonSlug]/quiz` | QuizShell, neutral renderer, progress | Intro, Navigator, SubmitConfirmation | server attempt/sanitized questions | save/unanswered/submitted | Remove misleading hint/timer/correctness visuals |
| Results | `/student/lessons/[lessonSlug]/results/[attemptId]` | AppShell | Score, Review, Mastery, Recommendation | authorized submitted result | review/retake | Dense review hierarchy |
| Progress | `/student/progress` | AppShell, StatCard | SubjectProgress, Chart, RecentActivity | aggregates/history | empty/data/error | Chart summary and card stacking |
| Achievements | `/student/achievements` | AppShell, BadgeCard | LevelCard, BadgeGrid | XP/levels/awards | locked/earned/new | Placeholder badges must not become fake data |
| AI Tutor | `/student/ai-tutor` | AppShell | Chat, Composer, QuickActions | owned conversation/context | sending/failure/safety | Composer visibility and rail order |

The visual system remains coherent. V2 correctly declares behavioral overrides for misleading mockup content rather than silently treating it as executable behavior.

## 6. User Flow Validation

The full journey is covered by routes and content. Flashcards are now explicitly available immediately. Practice requires Learn; Quiz requires 80% Practice completion. Counts are content-derived. Resume behavior remains adequately specified at a product level and can use the latest incomplete lesson step/attempt.

With seven required Practice activities, an 80% gate means the sixth terminal completion unlocks Quiz (6/7 = 85.71%). This is deterministic, though the implementation should calculate the threshold with `completed / required >= 0.8`, not rounded display percentages.

## 7. Activity Engine Review

V2 cleanly separates canonical private activity, sanitized public DTO, renderer response, server validator, evidence, and derived consumers. All five renderers share one shell. Quiz answer keys and hidden rationale are explicitly excluded. Partial credit defaults to all-or-nothing. Versioning and event identity are defined.

The design is implementable without five unrelated page architectures. Seed-to-relational mapping is now documented and schema validated.

## 8. Practice vs Quiz Review

The behavioral distinction is now consistent:

- Practice allows immediate validation, retries, hints, scaffolding, and explanations.
- Quiz uses neutral selection, no hints/correctness/solutions before submission, server scoring, immutable submission, and post-submission review.

The unchanged Quiz mockup still visually violates these rules, but `V2_CHANGELOG.md`, `13_INTERACTION_STATES.md`, and `14_MOCKUP_MAP.md` explicitly and consistently supersede those elements. This is no longer a blocker.

## 9. Curriculum Model Review

The schema now includes `grade_subjects`, curriculum-scoped competencies, lesson prerequisites, scoped slugs, content/activity versions, and immutable historical references. This is sufficient for the MVP and extensible without over-generalization.

Importer natural keys and prototype publication status are documented. Official content can replace or extend the prototype through curriculum/content versions.

## 10. Database Review

Strengths include server-owned derived fields, sanitized public access, versioned attempts, explicit checks/uniques, mastery evidence, daily streak events, AI retention fields, indexes, deny-by-default RLS, and future-parent isolation.

Required corrections:

- **BLOCKER:** remove the standalone uniqueness on `mastery_evidence.event_id`. Retain `UNIQUE(event_id, competency_id)`. Otherwise one activity event cannot record evidence for both `fraction-word-problems` and `add-like-fractions`, as required by seeded activity `af-pr-07`.
- **BLOCKER:** add `UNIQUE(student_id, reward_key)` to `xp_transactions`, or an equivalent partial/source uniqueness contract. The present four-column uniqueness permits the same stable reward key with a different retake event ID.
- Recommended: add checks for nonnegative attempt counts/durations/scores/XP bonuses, valid statuses/source types, `submitted_at >= started_at`, and `ended_at >= started_at`.
- Recommended: state FK delete actions explicitly in migrations, consistent with soft-versioned history.

Likely migration groups remain identity, curriculum/content, learning evidence, gamification, AI, indexes/constraints, public views/RPCs, and RLS. No migrations were created.

## 11. Mastery Engine Review

Mastery v1 is now deterministic and testable. It defines evidence sources, independence multipliers, retry penalties, channel aggregation, a latest-20 window, consistency, recency, missing-channel normalization, smoothing, retakes, review dates, idempotency, examples, and pure-function requirements.

One clarification is advisable but not blocking: mandate chronological processing or explicitly specify handling of delayed/out-of-order events, because 50/50 smoothing makes the final stored state order-sensitive. Normal synchronous submissions will naturally process in order.

The formula is deliberately simple and appropriate for MVP.

## 12. Gamification Review

The XP conflict is resolved: Practice items grant zero; completing the required set grants +20 once. Quiz performance bonuses do not stack, and retakes may improve mastery without farming XP. Meaningful streak events and timezone behavior are explicit.

The database uniqueness must be corrected as described in section 10; otherwise the written one-time reward policy is not enforced by the final guard.

## 13. AI Tutor Review

The three server-derived help levels (`practice_guided`, `quiz_safe`, `post_submission`) are clear. Quiz-safe prohibitions cover direct, indirect, encoded, and near-identical-example attempts. The context builder, language behavior, retention default, logging minimization, failure states, and authority boundary are sufficient for MVP planning.

Prompt/model implementation must still be evaluated adversarially, but that is an implementation/test task, not a missing product decision.

## 14. Accessibility Review

The new contract closes the prior gaps: keyboard completion, focus destinations, live regions, first-class alternatives to drag/match/sort/hotspot, flashcard semantics, timer announcements, chart summaries, alt treatment, touch targets, zoom/reflow, text resizing, contrast, and reduced motion are specified.

Accessibility must be implemented per phase as required, not deferred to Phase 11.

## 15. Responsive Design Review

The new responsive contract is sufficient: named breakpoint intent, five-item mobile bottom navigation, profile sheet, contextual-rail order, sticky-action conditions, first-class spatial fallbacks, Subject Detail sequence, artwork priority, wide-content rules, and Results order are all defined.

Breakpoint values may be tuned by visual testing without changing product behavior.

## 16. Security and Data Integrity Review

The security contract appropriately treats the browser as untrusted, isolates answer keys, verifies Results ownership/submission/version, centralizes authoritative mutations, requires transactions or an idempotent outbox, defines RLS test actors, minimizes child data, constrains analytics, and keeps AI outside scoring/mastery authority.

The remaining risk is not architectural intent but the two contradictory uniqueness definitions in the database blueprint. Once fixed, the authority model is ready for Phase 0 design work.

## 17. Cross-Document Conflicts

| Severity | Files | Conflict | Recommended Resolution |
|---|---|---|---|
| BLOCKER | `07_DATABASE_SCHEMA.md`, `05_ACTIVITY_ENGINE.md`, `08_MASTERY_ENGINE.md`, seed `af-pr-07` | `mastery_evidence.event_id` is globally unique, but one event may map to multiple competencies and requires one row per `(event_id, competency_id)`. | Remove `UNIQUE` from `event_id`; retain the composite unique constraint. |
| BLOCKER | `07_DATABASE_SCHEMA.md`, `09_GAMIFICATION.md`, `18_SECURITY_AND_AUTHORITY.md` | XP is promised once per content/quiz version, but uniqueness includes the per-attempt event ID, so a retake can insert the same `reward_key` again. | Add `UNIQUE(student_id, reward_key)` or define an equivalent stable award identity enforced independently of attempt event IDs. |
| LOW | `08_MASTERY_ENGINE.md` | Smoothing is deterministic for a given processing order, but delayed/out-of-order evidence behavior is not stated. | Require processing in source occurrence order or document a deterministic replay/recalculation rule. |
| LOW | Original mockups versus v2 docs | Static mockups retain incorrect Quiz hints/timer, Practice 10-count/10-XP, Lesson step count, and unsupported metrics. | Already resolved by explicit v2 overrides; maintain an implementation deviation checklist during visual QA. |

## 18. Missing Decisions

No product-owner decision is required for the two blockers; the existing approved behavior already determines the correct constraints.

One engineering decision should be recorded before Mastery implementation:

| Question | Why it matters | Recommended default |
|---|---|---|
| How are delayed/out-of-order mastery events handled? | Smoothing is order-sensitive. | Serialize per student+competency in `occurred_at,event_id` order; if late evidence is accepted, replay that competency’s retained evidence deterministically. |

## 19. Proposed Component Architecture

```text
AuthenticatedStudentLayout
└─ AppShell
   ├─ StudentSidebar / MobileStudentNav
   ├─ TopBar
   └─ Page
      ├─ Curriculum: SubjectCard, UnitCard, LessonCard, LessonStepCard
      ├─ Shared: ProgressBar, StatCard, BadgeCard, loading/empty/error states
      ├─ LearnContent / FlashcardDeck / Flashcard
      ├─ ActivityShell
      │  ├─ QuestionProgress
      │  ├─ ActivityRenderer
      │  │  ├─ MultipleChoiceActivity
      │  │  ├─ DragDropActivity
      │  │  ├─ MatchPairsActivity
      │  │  ├─ SortCategorizeActivity
      │  │  └─ HotspotActivity
      │  ├─ HintPanel
      │  ├─ AnswerFeedback
      │  └─ AITutorPanel
      ├─ QuizShell / SubmitConfirmation / QuizResults
      └─ AITutorChat
```

Renderers collect responses; server-only domain services validate, score, persist, and derive learning state.

## 20. Proposed Project Structure

```text
app/                    # routes/layouts/server endpoints
components/ui/          # visual primitives
components/layout/      # shell/navigation
features/curriculum/    # queries/types/cards
features/learning/      # Learn/Flashcards/progress
features/activities/    # schemas/renderers/responses
features/quiz/          # lifecycle/scoring/results
features/mastery/       # pure mastery-v1 calculator/config
features/gamification/  # XP/streak/levels/achievements
features/ai-tutor/      # policy/context/prompts/server provider
lib/supabase/           # client/server/database types
services/               # attempts/events/recommendations
config/                 # gates/mastery/rewards/levels
content/                # validation/import utilities
supabase/                # future migrations/seeds
tests/                   # unit/integration/e2e/accessibility
public/                  # approved brand/illustration/media assets
```

## 21. Implementation Order Review

The existing phases remain valid with two refinements:

- Resolve the two schema blockers before Phase 0 approval.
- In Phase 0, establish domain schemas, sanitized DTOs, event identities, transaction/RLS boundaries, and automated seed validation alongside repository/auth foundations.
- Implement accessibility tests and behavior in each owning phase; Phase 11 is final verification, not first coverage.

No major phase reorder is necessary.

## 22. Testing Strategy

### Unit

- Five activity validators and malformed payloads.
- Quiz scoring/unanswered items/version checks.
- Every Mastery v1 example, boundary, multiplier, latest-20, recency, smoothing, duplicate, and multi-competency mapping.
- XP eligibility, non-stacking, retakes, concurrent duplicates, and stable reward-key uniqueness.
- Streak timezone/DST/day boundaries.
- Achievement uniqueness, lesson gates, resume logic, and AI help-level rules.

### Integration

- Practice completion updates progress and awards +20 once.
- Multi-competency event creates all required mastery rows.
- Quiz submission is atomic/idempotent and updates mastery once.
- Retakes cannot duplicate base or performance XP.
- Continue Learning resumes correctly.
- Public content never exposes answer keys.
- Full RLS matrix.

### E2E

- Complete the full student learning journey.
- Interrupt/resume Learn, Practice, and Quiz.
- Attempt direct locked-route access.
- Verify Quiz shows no answer help/correctness before submission.
- Retry/reload/concurrent submit without duplicate derived effects.
- Repeat core journey at tablet/mobile widths.

### Accessibility

- Keyboard-only completion of all five activity types.
- Focus management and live announcements.
- Screen-reader labels and nonvisual hotspot/chart equivalents.
- Drag/match/sort alternatives.
- Contrast, 200%/400% reflow, text resize, touch targets, and reduced motion.

## 23. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Multi-competency evidence insert fails | HIGH | HIGH | Fix `event_id` uniqueness before migrations; integration-test `af-pr-07`. |
| Duplicate XP on retakes | HIGH | HIGH | Enforce stable reward-key uniqueness independent of event ID; concurrency tests. |
| Visual team follows obsolete mockup behavior | MEDIUM | HIGH | Maintain v2 override checklist beside visual QA references. |
| Quiz answer-key leakage | LOW | HIGH | Sanitized DTO/view, server scoring, leakage tests. |
| Out-of-order mastery processing | LOW | MEDIUM | Serialize or deterministically replay evidence. |
| Spatial activity accessibility regression | MEDIUM | HIGH | Build first-class non-drag interactions with each renderer. |
| RLS exposes child data | MEDIUM | HIGH | Deny by default and automate the documented actor matrix. |
| AI circumvents quiz-safe policy | MEDIUM | HIGH | Server help level, no answer key context, adversarial tests. |
| Prototype content appears official | LOW | HIGH | Preserve status/disclaimer and publication gate. |
| Missing illustration assets cause visual drift | MEDIUM | MEDIUM | Inventory and approve source assets during Phase 1 planning. |

## 24. Pre-Implementation Checklist

- [PASS] All original and v2 documents inspected.
- [PASS] All mockups accounted for and filename aliases approved.
- [PASS] Quiz safety conflict resolved by authoritative v2 overrides.
- [PASS] Practice XP and count conflicts resolved.
- [PASS] Mastery v1 is deterministic and testable.
- [PASS] Seed parses and validates against `activity-seed.schema.json`.
- [PASS] Seven Practice activities and ten Quiz questions are configured.
- [PASS] Practice items contain no per-item XP field.
- [PASS] Quiz timer is disabled and help level is `quiz_safe`.
- [PASS] Responsive and accessibility contracts are implementation-ready.
- [PASS] Answer-key and server-authority boundaries are documented.
- [BLOCKER] Mastery evidence uniqueness prevents multi-competency events.
- [BLOCKER] XP uniqueness does not enforce once-per-version rewards across retakes.
- [WARNING] Mastery processing order for delayed events should be documented.
- [WARNING] Approved illustration assets remain outside the package.
- [PASS] No application implementation was started.

## 25. Recommendation

**CHANGES REQUIRED BEFORE PHASE 0**

Exact next actions:

1. In `07_DATABASE_SCHEMA.md`, change `mastery_evidence.event_id UUID UNIQUE` to non-unique `event_id UUID`, retaining `UNIQUE(event_id, competency_id)`.
2. In `07_DATABASE_SCHEMA.md`, enforce one-time rewards with `UNIQUE(student_id, reward_key)` (or an equally strict stable award identity), while keeping event ID for traceability.
3. Add one sentence to `08_MASTERY_ENGINE.md` defining ordered processing/replay for delayed evidence.
4. Re-run the readiness gate. With those two constraints fixed, no product blocker identified in this audit remains.
