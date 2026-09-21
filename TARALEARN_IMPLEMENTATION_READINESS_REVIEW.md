# TaraLearn Implementation Readiness Review

## 1. Executive Summary

**NOT READY**

The handoff is strong enough to establish the product direction, navigation, visual language, core entities, and intended vertical slice. All expected specification documents exist, the seed JSON parses, all five activity types are represented, competency references resolve, and the 16 expected screens are visually represented.

It is not yet safe to begin Phase 0 because several behavioral contracts remain contradictory or non-deterministic:

1. The graded Quiz mockup exposes a worked hint and an Ask Tara action, while the written specification and seed disable hints and answer help during a graded quiz.
2. Practice XP is defined both as +20 per completed set and as +10 on each of seven seeded activities (potentially +70).
3. The mastery formula names inputs and headline weights but does not define the actual evidence aggregation, smoothing, independence penalties, recency function, cold start, or idempotency behavior.
4. The mockups show 10 Practice questions while the seed contains 7.
5. The database blueprint omits constraints and authority boundaries needed to prevent answer-key exposure and client-side tampering with scores, XP, mastery, and attempts.

No application code, directories, migrations, packages, or mockups were changed. This review is documentation only.

## 2. Files Inspected

### Documentation

- `docs/00_READ_ME_FIRST.md`
- `docs/01_PRODUCT_SPEC.md`
- `docs/02_MVP_SCOPE.md`
- `docs/03_USER_FLOWS_AND_ROUTES.md`
- `docs/04_DESIGN_SYSTEM.md`
- `docs/05_ACTIVITY_ENGINE.md`
- `docs/06_CURRICULUM_MODEL.md`
- `docs/07_DATABASE_SCHEMA.md`
- `docs/08_MASTERY_ENGINE.md`
- `docs/09_GAMIFICATION.md`
- `docs/10_AI_TUTOR.md`
- `docs/11_IMPLEMENTATION_PLAN.md`
- `docs/12_CODEX_MASTER_PROMPT.md`
- `docs/13_INTERACTION_STATES.md`
- `docs/14_MOCKUP_MAP.md`

### Mockups

- `mockups/01-home.png`
- `mockups/02-subjects.png`
- `mockups/03-subject-detail.png`
- `mockups/04-lesson-overview.png`
- `mockups/05-learn-mode.png`
- `mockups/06-flashcards.png`
- `mockups/07-practice-multiple-choice.png`
- `mockups/08-practice-drag-drop.png`
- `mockups/09-practice-match-pairs.png`
- `mockups/10-practice-sort-categorize.png`
- `mockups/11-practice-tap-identify.png`
- `mockups/12-interactive-quiz.png`
- `mockups/13-quiz-results.png`
- `mockups/14-progress.png`
- `mockups/15-achievements.png`
- `mockups/16-ai-tutor.png`
- `mockups/TaraLearn_App_Architecture.png`
- `mockups/TaraLearn_Core_Modules.png`
- `mockups/TaraLearn_User_Journey.png`
- `mockups/README.md`

All PNGs are readable. The 16 screen mockups are 1536×1024 desktop references. The three architecture diagrams were also inspected.

### Seed content

- `seed/grade-5-math/adding-fractions.seed.json`

The JSON is syntactically valid. It contains 5 competencies whose lesson weights sum to 1.0, 5 Learn blocks, 8 flashcards, 7 Practice activities, and 10 Quiz questions. All five activity types are represented. All competency references and answer-key references resolve. IDs and ordinals are unique within their collections.

### Existing project files

There is no application repository in the package. The package currently contains specifications, mockups, diagrams, and seed content only. No `package.json`, Next.js application, source directory, database migrations, tests, environment template, or CI configuration exists.

### Missing or mismatched expected files

- Expected `05-learn.png`; present as `05-learn-mode.png`.
- Expected `11-practice-hotspot.png`; present as `11-practice-tap-identify.png`.
- Expected `12-quiz.png`; present as `12-interactive-quiz.png`.
- Expected `13-results.png`; present as `13-quiz-results.png`.
- No expected screen is visually missing, but `14_MOCKUP_MAP.md` requires the canonical names before implementation. Rename only after product-owner approval; do not silently substitute them.

## 3. Product Understanding

TaraLearn is a child-friendly, curriculum-aligned learning platform whose MVP proves one complete learning loop rather than broad curriculum coverage. The vertical slice is Grade 5 Mathematics, Quarter 1, Fractions, Adding Fractions. A learner discovers or resumes the lesson, studies structured explanations and examples, reviews flashcards, completes varied interactive practice, takes a less-assisted graded quiz, reviews results, receives competency-level mastery updates and a next recommendation, and earns guarded XP/achievements. The system must be content-driven so later grades, subjects, curriculum versions, and official content can be added without rebuilding the interaction layer.

The prototype competency wording and codes are explicitly not official DepEd/MATATAG validation and must remain labeled as prototype data.

## 4. MVP Scope Validation

### IN SCOPE

- Student authentication, profile basics, onboarding, and protected student shell.
- Home, Subjects, Subject Detail, Lesson Overview, Learn, Flashcards, Practice, Quiz, Results, Progress, Achievements, and AI Tutor.
- Five reusable activity renderers: multiple choice, drag/drop, match pairs, sort/categorize, and hotspot/tap.
- Persisted attempts, lesson progress, quiz attempts, competency mastery, XP, streaks, and achievements.
- Grade 5 Mathematics Adding Fractions seeded vertical slice.
- Responsive desktop-first web experience with keyboard and touch alternatives.
- Supabase/PostgreSQL, server-side AI calls, RLS, and PostHog-ready event hooks.

### OUT OF SCOPE

- Functional Calendar and Messages.
- Parent, teacher, and admin portals.
- CMS, payments, multiplayer, social feeds, leaderboards, live classes, LMS/school integrations, advanced games, and native apps.
- Official production curriculum validation.
- Adaptive/ML mastery or recommendation systems.

### AMBIGUOUS

- Whether onboarding is required for the vertical-slice acceptance path beyond choosing/confirming grade.
- Whether Calendar/Messages remain visible but disabled, are labeled “Coming soon,” or are hidden.
- Whether Flashcards are immediately available or require Learn to be started/completed.
- Whether a Practice “set” is 7 seeded activities or 10 questions as shown in the mockups.
- Whether Quiz is strictly timed, optionally timed, or merely displays elapsed time; seed sets a 600-second timer while the mockup shows `00:45` without clarifying countdown versus elapsed time.
- Whether “Try Again” on Results creates a new attempt and whether attempts are limited.
- Search, notifications, goals editing, rankings (“Top 10%”), and settings are visually present but not defined as functional MVP behavior.

## 5. Mockup Audit

| Screen | Route | Shared components | Unique components | Data/backend dependencies | Required states | Likely responsive challenge |
|---|---|---|---|---|---|---|
| Home | `/student/home` | AppShell, StudentSidebar, TopBar, PageHeader, StatCard, ProgressBar, BadgeCard | WelcomeHero, ContinueLearningCard, TodayLessons, GoalsCard | profile, resume pointer, lesson progress, XP, streak, scores, achievements | loading, no activity, in-progress, completed, error | Hero and two-column dashboard must collapse without burying Continue Learning |
| Subjects | `/student/subjects` | AppShell, Sidebar, TopBar, SubjectCard, ProgressBar | GradeSelector, SubjectsGrid | grade, available subjects, subject progress | loading, empty grade, selected grade | Eight-card grid and grade tabs need compact, horizontally scrollable or wrapped treatment |
| Subject Detail | `/student/subjects/[subjectSlug]` | AppShell, Sidebar, TopBar, Tabs, ProgressBar | SubjectHero, UnitList, LessonList | subject, grade, quarters, units, lessons, progress/gates | unit/quarter selection, locked/current/completed lesson | Split master/detail layout becomes sequential; selected context must remain clear |
| Lesson Overview | `/student/lessons/[lessonSlug]` | AppShell, Sidebar, TopBar, ProgressBar, LessonStepCard | LessonHero, LearningPath, Outcomes, LessonDetails | lesson, competencies, gating, completion, recommendation | not started, in progress, completed, locked | Four horizontal steps and right rail must become a readable ordered sequence |
| Learn | `/student/lessons/[lessonSlug]/learn` | AppShell, TopBar, Breadcrumbs, ProgressBar, AITutorHelpCard | LearnContent, content tabs, worked examples, visual models | content blocks, lesson progress, completion mutation | tab selection, loading/error, complete, AI drawer | Equations/diagrams and contextual rail must fit without shrinking text |
| Flashcards | `/student/lessons/[lessonSlug]/flashcards` | AppShell, TopBar, Breadcrumbs, ProgressBar, AITutorHelpCard | FlashcardDeck, CardFace, DeckNavigation | flashcards, review position, completion mutation | front/back/flipping, next/previous, first/last, complete | Large card, side navigation, and related-card rail need single-column ordering |
| Practice: Multiple Choice | `/student/lessons/[lessonSlug]/practice` | ActivityShell, QuestionProgress, HintPanel, AITutorPanel, AnswerFeedback, XPReward | MultipleChoiceActivity | activity payload without unsafe fields, attempt API, progress | ready, selected, submitting, correct, incorrect, retrying | Options must stack and feedback/actions remain visible |
| Practice: Drag & Drop | same Practice route | Same ActivityShell | DragDropActivity, DropZone, selectable alternative | config, answer validation, attempts | selected, dragging, placed, invalid, checking, retry | Drag geometry must reflow; click/keyboard path must be equally prominent |
| Practice: Match Pairs | same Practice route | Same ActivityShell | MatchPairsActivity, PairConnector | pair config, validation, attempts | source selected, paired, disconnected, feedback | Two columns/connector lines do not translate directly to narrow screens |
| Practice: Sort & Categorize | same Practice route | Same ActivityShell | SortCategorizeActivity, CategoryZone | category mapping, validation, attempts | item selected, placed, moved, feedback | Three category columns and seven items require accessible list-based fallback |
| Practice: Hotspot | same Practice route | Same ActivityShell | HotspotActivity, FractionModel | structured visual and expected selection | selected/deselected, count status, checking, feedback | SVG/DOM targets must scale while retaining 44px targets and labels |
| Quiz | `/student/lessons/[lessonSlug]/quiz` | QuizShell, QuestionProgress, navigation protection | QuizIntro, QuizQuestionRenderer, QuizNavigator, Timer, SubmitConfirmation | server-created attempt, sanitized question data, autosave, gate state | before, answering, unanswered, saving, leave warning, submit, expired | Header, timer, choices, and navigation must remain visible; help rail must be removed/restricted |
| Results | `/student/lessons/[lessonSlug]/results/[attemptId]` | AppShell, ProgressBar, AITutorPanel | ScoreSummary, QuestionReview, MasterySummary, RecommendationCard | submitted attempt, server score, explanations, mastery, XP events | loading, authorized result, review selection, retake allowed/blocked | Dense score/review/action layout must become a coherent vertical review |
| Progress | `/student/progress` | AppShell, Sidebar, TopBar, StatCard, ProgressBar | SubjectProgressList, LearningActivityChart, RecentActivity, Goals | aggregate progress, sessions, history, goals | loading, no activity, period selection, error | Chart and multi-column cards need accessible summaries and stacking |
| Achievements | `/student/achievements` | AppShell, Sidebar, TopBar, BadgeCard, Tabs, ProgressBar | LevelCard, BadgeGrid, RecentAchievements | XP total, level thresholds, definitions, awards | locked, earned, newly unlocked, filtered, empty | Badge grid and level rail must preserve readable criteria |
| AI Tutor | `/student/ai-tutor` | AppShell, Sidebar, TopBar | AITutorChat, MessageList, Composer, QuickActions, SuggestedTopics | conversation authorization, server AI endpoint, context builder, moderation | empty, sending, streaming, failed, safety refusal, history | Composer must remain reachable; quick actions/topics should collapse below chat |

Visual observations: the system consistently uses a ~240px sidebar, top search/profile bar, navy typography, bright blue primary CTAs, pastel cards, rounded corners, subtle blue shadows, subject/activity color identities, and a contextual right rail. The mockups contain large decorative illustrations and dense desktop layouts; image assets are not supplied separately, so implementation needs an approved asset source or explicit reconstruction permission. Calendar and Messages appear in every sidebar despite being out of scope.

## 6. User Flow Validation

The documented flow is coherent:

`Home → Subjects → Mathematics → Adding Fractions → Learn → Flashcards → Practice → Quiz → Results → mastery update → recommendation`.

The route map covers every step and Results is correctly attempt-addressed. Resume behavior is stated but needs a precise rule for choosing the resume target when several activities/attempts exist. Gating must be enforced by trusted server/data logic, not merely disabled UI.

The Lesson Overview mockup shows Learn and Flashcards completed, Practice at 65%, and Quiz locked. This broadly matches the seed’s `learn_required_for_practice`, `practice_required_for_quiz`, and 80% practice threshold. However, “Flashcards available immediately or after Learn starts” is not deterministic and should be fixed in configuration.

## 7. Activity Engine Review

The shared renderer model is the right level of abstraction: one `ActivityShell` owns lifecycle, navigation, persistence, help, feedback, XP hooks, mastery hooks, and accessibility, while type-specific renderers own response editing and local validation shape.

Recommended normalized boundaries:

- Public activity DTO: prompt/config needed to render; no answer key, scoring secret, or private rationale.
- Renderer response: a type-safe response payload only.
- Server validator: validates payload against the versioned canonical activity and returns a normalized result according to mode.
- Attempt service: persists immutable attempt evidence.
- Event handlers: derive progress, mastery, XP, and achievements idempotently after persistence.

The seed is structurally usable as import content, but it does not exactly match the common database model: activities use `competency_keys` rather than join rows and omit `lesson_id`, title, estimated seconds, active, and version. Those omissions are acceptable in a nested import format only if a documented seed schema and importer supply/validate them. Add a JSON Schema or runtime schema before ingestion.

Hotspot’s `selected_count: 3` is correct for “any 3 of 8,” but the activity model also needs a general region-ID rule for hotspots where location matters. Match and sort should define whether partial credit is possible; MVP should default to all-or-nothing unless explicitly configured.

## 8. Practice vs Quiz Review

The written behavior is clear and appropriate:

- Practice validates immediately, supports retries, hints, explanations, and scaffolded Tara help.
- Quiz records answers without correctness feedback, does not reveal the correct answer before submission, and permits full explanations only in Results.

The seed reinforces the distinction with `reveal_correctness_during_quiz: false`, `allow_hints: false`, and `allow_ai_answer_help: false`.

The Quiz mockup conflicts materially. It displays a “Need a Hint?” panel containing the solution method and a Show Hint button. It also says Tara can “explain this question or give a similar example.” The selected answer is outlined green, which can be interpreted as correctness feedback. For MVP, the Quiz screen must use neutral selection styling, remove the worked hint, and either remove contextual Tara or restrict it to instruction clarification/general encouragement with a visible quiz-safe label. The Results mockup correctly reveals correctness and explanations after submission.

## 9. Curriculum Model Review

Strengths:

- Clear hierarchy and content separation.
- Stable-ID plus slug intent.
- Many-to-many lesson/competency and activity/competency mappings.
- Curriculum versioning acknowledged.
- Prototype curriculum disclaimer is explicit.

Gaps:

- `subjects` links directly to curriculum while grade applicability is inferred through units; define allowed grade/subject membership explicitly or document this invariant.
- Competencies lack curriculum/version identity beyond indirect subject/grade FKs; prevent cross-curriculum joins.
- Lesson prerequisites are required conceptually but absent from the database blueprint; use a lesson-prerequisite join table rather than a JSON-only field.
- Slug uniqueness scope is unspecified (global versus parent-scoped).
- Publication/version semantics for mutable content and in-flight attempts are unspecified. Attempts must retain the activity version used.
- The seed uses human-readable keys rather than stable database IDs; the importer must resolve keys deterministically and be repeatable.

The model is extensible enough for MVP after these invariants are documented; do not generalize further into a universal standards framework.

## 10. Database Review

### Strengths

- Separates identity, curriculum/content, learning evidence, gamification, and AI records.
- Uses join tables for many-to-many competency mappings.
- Separates quiz attempts from quiz attempt items.
- Includes an append-only XP ledger and student-local timezone.
- Anticipates parent-child access without requiring the parent portal.

### Missing constraints and invariants

- Unique: `students.profile_id`, `parents.profile_id`, scoped slugs, `(lesson_id, ordinal)` for blocks/cards/activities, `(quiz_id, ordinal)`, `(student_id, lesson_id)`, `(student_id, competency_id)`, `(student_id, achievement_id)`.
- Checks: ordinal/weights/points/XP nonnegative, score fractions 0–1, percentages/mastery 0–100, submitted time after start, valid mode/status/role enumerations.
- FKs need explicit delete/update policies.
- `xp_transactions` needs a concrete idempotency key, not merely “a unique constraint”; recommended `(student_id, event_type, event_id, reward_key)`.
- `quiz_attempts` needs status, attempt number, activity/quiz version snapshot, last-saved timestamp, and a unique submission/idempotency mechanism.
- `activity_attempts` needs an event/request id and explicit relationship to a quiz attempt when used for quiz evidence, or quiz item evidence must remain exclusively in `quiz_attempt_items`.
- `lesson_progress` and `competency_mastery` need authoritative update ownership and updated/version timestamps.
- Streak history cannot be audited from only the aggregate `student_streaks` row; derive from meaningful events or add daily streak records.
- AI messages need provider/model metadata, safety status, deletion/retention fields, and possibly redaction metadata without storing unnecessary prompt context.

### Indexes

Add likely indexes for `(units.subject_id, grade_level_id, quarter_id, ordinal)`, lesson/competency and activity/competency reverse lookups, quiz attempt history `(student_id, quiz_id, submitted_at)`, attempt items by attempt, due reviews `(student_id, next_review_at)`, student achievements by earned date, conversations by student/update time, and messages by conversation/create time. Partial indexes for active/published content may be useful.

### RLS and authority

Students should read their own profile and learning records, but direct client writes to correctness, scores, mastery, XP, streaks, achievements, submitted attempts, or answer keys must be denied. Use server-side trusted functions/transactions for validation and derived updates. Public curriculum views must exclude `answer_key_json`, private rationales when necessary, and unpublished content. Parent policies should remain disabled until the feature exists and must verify the relationship rather than trust a client-supplied student ID.

Likely migrations are identity, curriculum, content, learning, gamification, AI, constraints/indexes, RLS policies, trusted functions, and seed import—but none should be created yet.

## 11. Mastery Engine Review

The mastery concept is correct but not yet implementable deterministically. Status bands and the 60/30/10 headline blend are clear, but the following are undefined:

- How question scores aggregate when one question maps to multiple competencies.
- Whether practice accuracy includes every retry, final response only, or weighted attempts.
- Exact hint and AI-help penalties.
- Definition and formula for repeated-success/recency evidence.
- Cold-start behavior when there is no quiz or practice evidence.
- Smoothing constant and whether old evidence decays.
- Effect of difficulty and competency mapping weights.
- Retake behavior and protection from processing one attempt twice.
- Next-review date selection inside the 3–7 and 7–14 day ranges.

Recommended MVP default: define a pure, versioned configuration and a pure calculation function. Score each immutable evidence event once; allocate it by normalized competency weights; apply fixed independence multipliers; aggregate practice and quiz evidence with documented missing-channel behavior; use a fixed exponential smoothing factor; and record the algorithm version and triggering event ID. Avoid ML.

## 12. Gamification Review

The append-only ledger, local-day streak concept, threshold-table levels, one-time achievements, and non-stacking quiz bonus rule are sound.

Required clarifications:

- Choose set-level or item-level Practice XP. The seed’s seven `xp_reward: 10` values conflict with the +20 Practice-set rule.
- Define exact source/idempotency keys for Learn, Flashcards, Practice, Quiz, bonuses, mastery, and achievement XP.
- Define whether quiz retakes earn base/bonus XP and, if so, under what diminishing/first-completion rule.
- Define “meaningful learning action” for streaks and the timezone-change rule.
- Define complete level thresholds and achievement criteria as configuration.
- Ensure achievement bonus XP cannot recursively or repeatedly trigger awards.

Recommended default: award the documented set-level rewards once per lesson/content version; no per-question Practice XP; quiz performance bonuses once per quiz version using the best first qualifying result; calculate streak dates in the student’s IANA timezone at event time and retain the event’s derived local date.

## 13. AI Tutor Review

The intended context and high-level Practice/Quiz split are sufficient to design an architecture, but not yet sufficient for safe implementation.

Use one server-only tutor service with:

- An authoritative context builder that fetches grade, curriculum location, mastery, recent evidence, current activity metadata, mode, and help history.
- A policy layer that computes `allowed_help_level`; never trust a mode or permissions value sent only by the browser.
- A quiz-safe path that excludes the active answer key and blocks solving/deriving the active item.
- Input/output moderation, age-appropriate system policy, rate limits, bounded context, logging/redaction, and safe fallback responses.
- Conversation ownership checks and a retention/deletion policy.

Missing details include exact allowed-help levels, behavior for prompt injection or requests to reveal quiz answers, Filipino-language selection/fallback, retention duration, attachment policy, escalation/refusal behavior, and whether recent mistakes may include answer keys in model context. The AI must not be in the trusted scoring path.

## 14. Accessibility Review

The documents correctly require keyboard operation, focus-visible states, semantic controls, 44px targets, non-color status, structured hotspots, alternatives to drag, and reduced motion.

Concrete gaps:

- No defined focus order or focus destination after validation, feedback, modal/drawer open, question navigation, or card flip.
- No live-region announcement contract for selection counts, pair creation, placement, validation, XP, timer warnings, and errors.
- Match-pair connector lines need a list/select alternative and accessible relationship summary.
- Drag/sort need explicit move commands, current location announcements, and undo/remove actions.
- Hotspots need names for every region, keyboard traversal, selected-state semantics, and a nonvisual equivalent.
- Flashcards need correct button semantics and must not rely on a 3D flip to expose content.
- Quiz timer needs pause/extension policy consideration and must not be the only time signal.
- Progress charts require text/table summaries.
- Decorative versus meaningful illustrations need alt-text rules.
- Contrast, zoom/reflow at 200–400%, and large-text behavior are not specified or evidenced by desktop mockups.
- Color coding in progress, subjects, and correct/incorrect states must retain text/icons in every implementation state.

## 15. Responsive Design Review

The general direction is present but insufficient for implementation-level consistency. The package says sidebar → drawer/bottom nav, right rail → below content, and learning content → one column, but does not choose between drawer and bottom navigation or specify key breakpoints and ordering.

Decisions needed in design documentation:

- Mobile primary navigation pattern and treatment of out-of-scope items.
- Exact order of the right-rail cards when moved below main content.
- Sticky behavior for question progress, timer, and primary actions.
- Mobile interaction pattern for pair matching and categorization.
- Whether desktop hero artwork is cropped, hidden, or reduced.
- Handling of wide fraction diagrams, equations, charts, tabs, and dense Results review.
- Tablet behavior for the Subject Detail master/detail view.

Recommended default: bottom navigation for the five MVP destinations, overflow/profile sheet for settings/logout, contextual content after the main task, sticky bottom primary action where it does not cover content, and list/select alternatives for spatial activities.

## 16. Security and Data Integrity Review

- Keep Supabase service credentials and AI API keys server-only.
- Never send canonical quiz answer keys in page payloads, static bundles, analytics events, or AI context before submission.
- Validate every response against the stored activity version on the server.
- Use transactions/idempotency so attempt submission, score, mastery evidence, XP, streak, and achievements cannot partially or repeatedly apply.
- Freeze submitted attempts and prevent client updates to derived fields.
- Authorize Results by attempt ownership.
- Restrict curriculum writes to service/admin roles; expose only active/published content.
- Test every RLS policy with owner, other student, unauthenticated user, future parent, and service role.
- Minimize child data: avoid unnecessary birth dates, school details, precise location, free-form profile fields, and unbounded analytics identifiers.
- Define AI chat retention, deletion, redaction, reporting, and moderation; avoid placing personal data in prompts.
- Do not allow file uploads or user-generated public content in MVP unless separately designed and moderated.
- Treat analytics as pseudonymous, minimize properties, and avoid recording answer text or chat content by default.
- Parental functionality needs explicit authorization and consent design before activation; database readiness alone is not permission to expose it.

These are implementation concerns, not legal advice.

## 17. Cross-Document Conflicts

| Severity | Files | Conflict | Recommended Resolution |
|---|---|---|---|
| BLOCKER | `10_AI_TUTOR.md`, `05_ACTIVITY_ENGINE.md`, `13_INTERACTION_STATES.md`, seed quiz settings, `12-interactive-quiz.png` | Written rules and seed prohibit answer help/hints during the graded quiz; mockup shows a worked hint, Show Hint, and Tara offering to explain the active question. | Declare behavioral safety rules authoritative: remove worked hint/Show Hint from graded Quiz and replace Tara card with quiz-safe clarification/encouragement or hide it. Produce an approved corrected visual annotation/mockup before Phase 1/6. |
| HIGH | `09_GAMIFICATION.md`, `05_ACTIVITY_ENGINE.md`, seed Practice activities, Practice mockups | Gamification awards +20 for a completed Practice set; activity engine says XP once per activity completion; each of 7 seed activities has 10 XP; mockups show 10 XP beside each question. | Choose one policy. Recommended: +20 once per completed Practice set, remove/ignore per-item reward for this set, and show potential set reward rather than per-question award. |
| HIGH | `08_MASTERY_ENGINE.md`, `11_IMPLEMENTATION_PLAN.md` | Phase 7 acceptance requires predictable/idempotent mastery, but the calculation omits exact aggregation, smoothing, independence/recency formulas, cold start, and duplicate-event handling. | Add a deterministic v1 formula with constants, worked examples, missing-evidence rules, event IDs, and expected outputs before implementing Phase 7. |
| HIGH | `07_DATABASE_SCHEMA.md`, `05_ACTIVITY_ENGINE.md`, `12_CODEX_MASTER_PROMPT.md` | Activities store `answer_key_json` alongside readable content, while quiz answers must not leak; no public/private DTO or RLS/view boundary is specified. | Define private canonical activity storage and sanitized student-facing queries/views; scoring must be server-side. |
| MEDIUM | Practice mockups, seed | Mockups label Practice as 10 questions; seed contains 7 Practice activities. | Make both use one configured count. Recommended: update the visual copy/derived UI to 7 for the vertical slice unless three quality activities are intentionally added. |
| MEDIUM | `09_GAMIFICATION.md`, `15-achievements.png` | MVP achievement examples are six named items, while the mockup displays a broader catalog (28 badges, Reading Star, Science Learner, Filipino Pride, etc.) unsupported by seed/config. | Treat unsupported badges/statistics as visual placeholders and seed only approved MVP definitions; update mockup-map notes to distinguish them. |
| MEDIUM | `02_MVP_SCOPE.md`, `14-progress.png`, `15-achievements.png` | Progress/Achievements mockups include goals editing, monthly charts, rankings, many subjects, and extensive history not explicitly scoped or modeled. | Define these as either read-only derived UI, prototype placeholders, or out of MVP. Recommended: omit ranking and goal editing; show only data supported by the vertical slice plus honest empty states. |
| MEDIUM | `03_USER_FLOWS_AND_ROUTES.md`, seed gating | Flashcards are “available immediately or after Learn starts,” while seed only defines Learn→Practice and Practice→Quiz gates. | Add an explicit flashcard gate flag and default it to immediately available, or require Learn completion consistently. |
| MEDIUM | `07_DATABASE_SCHEMA.md`, seed | Database activities have single-row fields plus join-table competency mappings; nested seed uses `competency_keys`, omits several database fields, and embeds quiz questions rather than referencing canonical activity records. | Document an import schema/mapping, version defaults, idempotent natural keys, and whether quiz questions become activities plus `quiz_activities`. |
| MEDIUM | `06_CURRICULUM_MODEL.md`, `07_DATABASE_SCHEMA.md` | Curriculum model requires lesson prerequisites; schema has no prerequisite relationship. | Add a `lesson_prerequisites` join in the schema plan. |
| LOW | `14_MOCKUP_MAP.md`, actual filenames | Four canonical expected filenames differ from actual files. | Rename after approval or update the map to the actual canonical names before implementation. |
| LOW | `04-lesson-overview.png`, seed | Mockup says “3 of 4 steps completed” while Practice is visibly only 65% and Quiz locked; that wording counts an incomplete Practice as completed. | Derive completed-step count strictly from completion state; the shown state should be 2 of 4 completed. |
| LOW | `12-interactive-quiz.png`, seed | Seed timer is 600 seconds; mockup shows `00:45` without specifying elapsed or remaining time. | Label timer semantics and define timeout behavior; recommended countdown from 10:00 with autosubmit only if explicitly approved. |

## 18. Missing Decisions

| Question | Why it matters | Recommended default |
|---|---|---|
| What is the authoritative Practice XP unit: item or set? | Prevents inconsistent UI, farming, and ledger design. | +20 once per completed Practice set; retries and individual items grant no separate XP. |
| What exact deterministic mastery-v1 formula should be approved? | Phase 7 cannot be tested or accepted without exact expected outputs. | Fixed 60/30/10 channel blend, explicit missing-channel normalization, fixed hint/AI/retry multipliers, fixed smoothing, and event idempotency; publish worked examples. |
| Should graded Quiz show any contextual Tara control? | Determines the safest resolution of the most serious mockup conflict. | Show only a clearly labeled “Quiz help” control limited to instruction clarification and encouragement; no hints, similar solved problem, or active-item derivation. |
| Is Practice 7 or 10 questions in the vertical slice? | Affects progress denominator, completion threshold, content QA, and visual fidelity. | Use the 7 validated seed activities and derive all counts from content. |
| What is the mobile primary navigation pattern? | Drawer versus bottom navigation materially affects shell implementation. | Bottom navigation for the five MVP destinations; profile/settings in a sheet. |
| What is the MVP AI chat retention/deletion policy? | Necessary for child-data minimization and schema/API behavior. | Short configurable retention, user/guardian deletion path when available, no training use, and minimal redacted logs. |
| Is the 10-minute Quiz timer enforced, and what occurs at zero? | Affects attempt integrity, accessibility, and autosave. | Timer off by default for MVP unless assessment policy requires it; if enabled, visible countdown with server deadline and explicit autosubmit behavior. |

## 19. Proposed Component Architecture

```text
RootLayout
└─ AuthenticatedStudentLayout
   └─ AppShell
      ├─ StudentSidebar / MobileStudentNav
      ├─ TopBar
      ├─ PageHeader / Breadcrumbs
      └─ Page content
         ├─ Curriculum
         │  ├─ SubjectCard
         │  ├─ UnitCard
         │  ├─ LessonCard
         │  └─ LessonStepCard
         ├─ Shared feedback/data
         │  ├─ ProgressBar
         │  ├─ StatCard
         │  ├─ BadgeCard
         │  ├─ EmptyState
         │  ├─ ErrorState
         │  └─ LoadingSkeleton
         ├─ Learning
         │  ├─ LearnContent
         │  │  ├─ ExplanationBlock
         │  │  ├─ WorkedExampleBlock
         │  │  └─ VisualModel
         │  └─ FlashcardDeck
         │     ├─ Flashcard
         │     └─ FlashcardNavigation
         ├─ Activities
         │  └─ ActivityShell
         │     ├─ QuestionProgress
         │     ├─ ActivityRenderer
         │     │  ├─ MultipleChoiceActivity
         │     │  ├─ DragDropActivity
         │     │  ├─ MatchPairsActivity
         │     │  ├─ SortCategorizeActivity
         │     │  └─ HotspotActivity
         │     ├─ HintPanel
         │     ├─ AnswerFeedback
         │     ├─ XPReward
         │     └─ AITutorPanel
         ├─ Quiz
         │  ├─ QuizShell
         │  ├─ QuizIntro
         │  ├─ QuizQuestionRenderer (reuses input renderers in quiz mode)
         │  ├─ QuizNavigator
         │  ├─ SubmitConfirmation
         │  └─ QuizResults
         │     ├─ ScoreSummary
         │     ├─ QuestionReview
         │     ├─ MasterySummary
         │     └─ NextRecommendation
         └─ AI Tutor
            ├─ AITutorPanel
            └─ AITutorChat
               ├─ MessageList
               ├─ QuickActions
               └─ TutorComposer
```

Keep input renderers reusable between Practice and Quiz, but keep orchestration separate: `ActivityShell` may reveal immediate feedback while `QuizShell` only records neutral responses. Avoid placing persistence or scoring logic inside visual components.

## 20. Proposed Project Structure

```text
app/
  (auth)/login/ onboarding/
  student/
    layout.tsx
    home/
    subjects/[subjectSlug]/
    lessons/[lessonSlug]/
      learn/ flashcards/ practice/ quiz/ results/[attemptId]/
    progress/ achievements/ ai-tutor/
  api/ai-tutor/
components/
  ui/                 # primitive, visual components
  layout/             # shell/sidebar/topbar/mobile nav
features/
  curriculum/
    components/ queries/ types.ts
  learning/
    components/ progress/
  activities/
    components/
      ActivityShell.tsx ActivityRenderer.tsx renderers/
    schemas/ validators/ responses/ types.ts
  quiz/
    components/ server/ scoring/
  mastery/
    calculate.ts config.ts types.ts
  gamification/
    xp.ts streaks.ts levels.ts achievements.ts
  ai-tutor/
    context-builder.ts policy.ts prompts/ server/
lib/
  supabase/client.ts server.ts middleware.ts
  auth/ errors/ time/ analytics/
services/
  attempts/ progress/ recommendations/
config/
  gating.ts mastery.ts gamification.ts
content/
  schemas/ seed-import/
types/
  database.generated.ts
supabase/
  migrations/ seed/
tests/
  unit/ integration/ e2e/ accessibility/ fixtures/
public/
  brand/ illustrations/ activity-media/
```

Prefer feature ownership for domain code and a small `components/ui` for reusable visual primitives. Keep deterministic domain functions independent of React and Supabase so they are easy to unit test. Keep server-only answer validation, scoring, derived writes, and AI provider code in server-only modules.

## 21. Implementation Order Review

The broad sequence is sensible, but dependencies should be tightened:

1. **Pre-Phase 0 decision pass:** resolve the blockers/high conflicts in this report and approve deterministic contracts.
2. **Phase 0 — Repository foundation plus domain contracts:** establish tooling/auth/Supabase utilities and also activity schemas, sanitized DTO boundaries, event/idempotency conventions, and RLS threat model. This prevents UI from hardening around unsafe shapes.
3. **Phase 1 — Design system and shell:** include responsive navigation decision and asset inventory/licensing.
4. **Phase 2 — Curriculum navigation:** include schema-backed seed importer and gating policy skeleton.
5. **Phase 3 — Learn and Flashcards:** complete/persist via the event model, not ad hoc mutations.
6. **Phase 4 — Activity Engine:** build renderer inputs and pure validators; implement accessibility alternatives at the same time, not deferred to QA.
7. **Phase 5 — Practice:** finalize attempts, retries, feedback, progress, and Practice XP contract. Integrate a stubbed policy boundary for Tara context, not the provider.
8. **Phase 6 — Quiz and Results:** implement private answer validation, autosave, immutable submission, scoring, and post-submit review.
9. **Phase 7 — Mastery and recommendations:** only after the mastery-v1 specification is approved; implement from immutable attempt evidence.
10. **Phase 8 — Gamification:** ledger/streak/achievement consumers can now use stable completion events.
11. **Phase 9 — AI Tutor:** connect provider to the already tested policy/context boundary.
12. **Phase 10 — Progress and Achievements:** real aggregate data only.
13. **Phase 11 — QA:** retain final audit, but move unit, accessibility, RLS, and idempotency tests into their owning phases. QA must not be the first time these are tested.

The main changes are to add domain/security contracts to Phase 0 and make testing/accessibility continuous. Mastery should remain after Quiz because it depends on stable evidence. Gamification should remain after stable learning events.

## 22. Testing Strategy

### Unit

- Runtime validation for every activity config, response, and answer key.
- Correct/incorrect and malformed responses for all five validators.
- Quiz scoring, partial-credit policy, unanswered items, and version mismatch.
- Mastery cold start, weighted competencies, hints/AI/retries, smoothing, recency, repeated processing, and boundary bands 39/40/69/70/89/90.
- XP eligibility, bonuses, non-stacking, retries, retakes, and idempotency keys.
- Streak same-day events, consecutive days, missed days, DST, timezone changes, and midnight boundaries.
- Achievement criteria and one-time awards.
- Lesson gates, direct-route denial, and resume target selection.
- AI help-level rules for Practice, active Quiz, submitted Quiz, and adversarial requests.

### Integration

- Completing Learn/Flashcards writes progress once.
- Every Practice submission persists evidence; set completion advances progress and awards XP once.
- Quiz creation/autosave/submission is authorized, atomic, and immutable after submission.
- Quiz submission creates one score, updates mastery once, awards XP once, and evaluates achievements once.
- Continue Learning resolves correctly after each learning step and interrupted attempt.
- Sanitized content queries never return quiz answer keys.
- RLS matrices for student A, student B, unauthenticated, future parent, and service role.
- AI context builder returns only allowed, owned, minimal data.

### E2E

- Sign in/onboard → Home → Subjects → Mathematics → Adding Fractions → Learn → Flashcards → all five Practice types → Quiz → Results → Progress/Achievements.
- Resume from Home after interruption in Learn, Practice, and Quiz.
- Locked route cannot be bypassed by URL.
- Wrong-first Practice path: retry → hint → Tara → completion.
- Quiz never shows correctness/answer/help before submission; Results does afterward.
- Duplicate submit/reload/network retry does not duplicate score, XP, mastery, or achievement.
- Mobile and tablet versions of the core journey.

### Accessibility

- Automated semantic/contrast checks plus manual screen-reader checks.
- Complete each activity with keyboard only and without drag gestures.
- Focus order/return after drawers, feedback, navigation, and submission.
- Live announcements for selection, placement, matching, errors, progress, and timer.
- Nonvisual alternatives for hotspot and charts.
- Touch targets, zoom/reflow, landscape mobile, text resizing, and reduced motion.

## 23. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Visual drift from mockups | MEDIUM | MEDIUM | Create tokens from measured references, implement shared shell, and run per-screen visual comparison. |
| Missing source illustration assets | HIGH | MEDIUM | Inventory ownership/licensing and obtain approved assets before visual implementation; do not scrape substitutes. |
| Activity engine over-engineering | MEDIUM | MEDIUM | Use one discriminated union, five renderers, pure validators, and only currently required extension points. |
| Inconsistent activity JSON | HIGH | HIGH | Add versioned JSON/runtime schemas and validate seed/imports in CI. |
| Quiz answer keys reach browser | MEDIUM | HIGH | Private storage, sanitized DTO/view, server scoring, and explicit leakage tests. |
| Non-deterministic mastery | HIGH | HIGH | Approve mastery-v1 formula, version config, pure tests, immutable evidence, idempotent processing. |
| Duplicate XP/achievements | MEDIUM | HIGH | Unique event/reward keys, append-only ledger, transactional consumers, concurrency tests. |
| RLS mistakes expose child data | MEDIUM | HIGH | Deny-by-default policies, ownership matrices, automated RLS tests, server-only privileged paths. |
| Tara reveals active quiz answers | HIGH | HIGH | Server-derived help policy, exclude answer key, adversarial tests, safe refusal/fallback. |
| Poor drag/match/sort accessibility | HIGH | HIGH | Design click/list alternatives first and test keyboard/screen reader in Phase 4. |
| Mobile spatial activities fail | MEDIUM | HIGH | Responsive prototypes for the five renderers and list/select fallbacks before full styling. |
| Curriculum schema becomes too rigid | MEDIUM | MEDIUM | Stable IDs, scoped slugs, join tables, versioning, JSON only for truly variable content. |
| Prototype content mistaken for official | MEDIUM | HIGH | Preserve status/disclaimer, label environments, require a publication approval gate. |
| Client tampers with attempts/mastery | MEDIUM | HIGH | Trusted server validation and derived writes; deny direct client mutation of authoritative fields. |
| Child chat stores excessive personal data | MEDIUM | HIGH | Data minimization, bounded retention, redaction, deletion controls, no raw chat analytics. |
| Mockup placeholder metrics become production fake data | MEDIUM | MEDIUM | Render real vertical-slice data and honest empty states only. |

## 24. Pre-Implementation Checklist

- [PASS] All 15 expected documentation files exist and were reviewed.
- [PASS] All 16 expected screen concepts have visual references.
- [WARNING] Four mockup filenames differ from the canonical map.
- [PASS] Seed JSON parses successfully.
- [PASS] Seed hierarchy matches Grade 5 → Mathematics → Quarter 1 → Fractions → Adding Fractions.
- [PASS] Seed competency weights total 1.0 and all activity competency references resolve.
- [PASS] All five activity types appear in Practice/Quiz content.
- [WARNING] No formal seed schema/import contract exists.
- [BLOCKER] Graded Quiz mockup conflicts with no-hint/no-answer-help requirements.
- [BLOCKER] Practice XP unit conflicts across gamification, engine, seed, and mockups.
- [BLOCKER] Mastery-v1 calculation is not deterministic enough to implement/test.
- [WARNING] Practice count is 10 in mockups and 7 in seed.
- [WARNING] Answer-key exposure boundary and trusted scoring flow are unspecified.
- [WARNING] Required database constraints, idempotency keys, and write authority are incomplete.
- [WARNING] Responsive behavior lacks specific navigation/order/activity decisions.
- [WARNING] Accessibility principles exist, but focus/live-region/nonvisual contracts are incomplete.
- [WARNING] AI tutor policy needs enforceable help levels, retention, and adversarial behavior.
- [WARNING] Illustration/source asset package is absent.
- [PASS] MVP versus future roles/features is mostly clear.
- [PASS] Calendar and Messages are explicitly nonfunctional MVP items.
- [PASS] Implementation phases broadly respect system dependencies.
- [PASS] No application implementation was started during this review.

## 25. Recommendation

**CHANGES REQUIRED BEFORE PHASE 0**

Exact next actions:

1. Approve and document the graded-Quiz visual/behavior correction: no worked hint, no correctness-colored selection, and only quiz-safe Tara assistance if retained.
2. Choose and document one Practice XP policy; align the gamification document, activity engine, seed, and UI copy.
3. Publish a deterministic mastery-v1 specification with constants, cold-start behavior, penalties, smoothing, recency, idempotency, and worked examples.
4. Reconcile the Practice question count (recommended: derive 7 from the seed) and correct the Lesson Overview completed-step count.
5. Add a seed schema/import mapping and define canonical activity/version handling, including quiz-question storage.
6. Amend the database blueprint with required constraints, idempotency keys, server-owned derived fields, answer-key isolation, transaction boundaries, and RLS test cases.
7. Decide the mobile navigation pattern and document ordering/fallbacks for spatial activities and contextual rails.
8. Define AI help levels, quiz-safe enforcement, chat retention/deletion, and minimal logging.
9. Inventory and approve the illustration/brand assets needed to reproduce the mockups.
10. Re-run this checklist after the documents are updated. Do not begin Phase 0 until the three blockers are resolved.
