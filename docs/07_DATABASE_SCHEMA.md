# Database Schema Blueprint — v2

Target: PostgreSQL / Supabase.

## Authority model
The browser may submit learner input. It is never authoritative for:
- correctness
- score
- answer keys
- submitted Quiz state
- mastery
- XP
- streaks
- achievements

Those values are produced by trusted server/database operations.

## Identity
### profiles
`id PK -> auth.users`, display_name, role, avatar_url, created_at, updated_at

Constraints:
- role enum/check
- one profile per auth user

### students
id PK, profile_id FK UNIQUE, grade_level_id FK, timezone, preferred_language

Timezone must be an IANA timezone string.

### parents
id PK, profile_id FK UNIQUE

### parent_students
parent_id FK, student_id FK, relationship_label
PK(parent_id, student_id)

Parent feature remains disabled in MVP UI.

## Curriculum
### curricula
id, name, version, jurisdiction, status, created_at

UNIQUE(name, version, jurisdiction)

### grade_levels
id, curriculum_id FK, name, ordinal
UNIQUE(curriculum_id, ordinal)

### subjects
id, curriculum_id FK, name, slug, icon_key, theme_key
UNIQUE(curriculum_id, slug)

### grade_subjects
grade_level_id FK, subject_id FK
PK(grade_level_id, subject_id)

### quarters
id, grade_level_id FK, ordinal, name
UNIQUE(grade_level_id, ordinal)

### units
id, subject_id FK, grade_level_id FK, quarter_id FK, title, slug, ordinal, description
UNIQUE(subject_id, grade_level_id, quarter_id, slug)
UNIQUE(subject_id, grade_level_id, quarter_id, ordinal)

### lessons
id, unit_id FK, title, slug, ordinal, summary, estimated_minutes, status, content_version
UNIQUE(unit_id, slug)
UNIQUE(unit_id, ordinal)

### lesson_prerequisites
lesson_id FK, prerequisite_lesson_id FK
PK(lesson_id, prerequisite_lesson_id)
CHECK lesson_id <> prerequisite_lesson_id

### competencies
id, curriculum_id FK, subject_id FK, grade_level_id FK, code nullable, statement, slug
UNIQUE(curriculum_id, grade_level_id, subject_id, slug)

### lesson_competencies
lesson_id FK, competency_id FK, weight
PK(lesson_id, competency_id)
CHECK weight > 0

## Content
### lesson_content_blocks
id, lesson_id FK, version, type, ordinal, content_json, active
UNIQUE(lesson_id, version, ordinal)

### flashcards
id, lesson_id FK, version, ordinal, front_json, back_json, active
UNIQUE(lesson_id, version, ordinal)

### activities
id, lesson_id FK, stable_key, version, type, title, instruction,
public_config_json, **answer_key_json PRIVATE**, hint_text,
explanation_json, difficulty, estimated_seconds, active, published_at

UNIQUE(stable_key, version)
CHECK version >= 1

Important: student-facing queries/views/RPCs must never expose `answer_key_json` for an active graded Quiz.

### activity_competencies
activity_id FK, competency_id FK, weight
PK(activity_id, competency_id)
CHECK weight > 0

### quizzes
id, lesson_id FK, stable_key, version, title, config_json, active
UNIQUE(stable_key, version)

### quiz_activities
quiz_id FK, activity_id FK, ordinal, points
PK(quiz_id, activity_id)
UNIQUE(quiz_id, ordinal)
CHECK points > 0

## Learning
### study_sessions
id, student_id FK, lesson_id FK nullable, started_at, ended_at, duration_seconds

### practice_attempts
id, event_id UUID UNIQUE, student_id FK, activity_id FK, activity_version,
response_json, is_correct SERVER-OWNED, score_fraction SERVER-OWNED,
attempts_used, hint_used, ai_help_used, started_at, completed_at

CHECK score_fraction BETWEEN 0 AND 1
UNIQUE(student_id, event_id)

### quiz_attempts
id, student_id FK, quiz_id FK, quiz_version, attempt_number,
status, started_at, last_saved_at, submitted_at,
score SERVER-OWNED, max_score SERVER-OWNED, percent SERVER-OWNED,
submission_event_id UUID UNIQUE

UNIQUE(student_id, quiz_id, quiz_version, attempt_number)
CHECK percent IS NULL OR percent BETWEEN 0 AND 100

### quiz_attempt_items
id, quiz_attempt_id FK, activity_id FK, activity_version,
response_json, score SERVER-OWNED, max_score SERVER-OWNED,
is_correct SERVER-OWNED, saved_at

UNIQUE(quiz_attempt_id, activity_id)

### lesson_progress
student_id FK, lesson_id FK, status, percent_complete,
learn_completed_at, flashcards_completed_at, practice_completed_at,
quiz_completed_at, last_activity_at, updated_at
PK(student_id, lesson_id)
CHECK percent_complete BETWEEN 0 AND 100

### mastery_evidence
id, event_id UUID, student_id FK, competency_id FK,
source_type, source_id, algorithm_version,
raw_score, adjusted_score, occurred_at, created_at

UNIQUE(event_id, competency_id)

### competency_mastery
student_id FK, competency_id FK, mastery_score, status,
evidence_count, last_practiced_at, next_review_at,
algorithm_version, last_processed_event_id, updated_at
PK(student_id, competency_id)
CHECK mastery_score BETWEEN 0 AND 100

## Gamification
### xp_transactions
id, student_id FK, event_type, event_id, reward_key, amount, reason, created_at
UNIQUE(student_id, reward_key)
CHECK amount >= 0

### learning_day_events
id, student_id FK, source_event_id UNIQUE, local_date, timezone_at_event, created_at
UNIQUE(student_id, source_event_id)

### student_streaks
student_id PK/FK, current_streak, longest_streak, last_active_date, updated_at

### achievements
id, key UNIQUE, title, description, icon_key, criteria_json, xp_bonus, active

### student_achievements
student_id FK, achievement_id FK, source_event_id, earned_at
PK(student_id, achievement_id)

## AI
### ai_conversations
id, student_id FK, lesson_id nullable, competency_id nullable,
created_at, updated_at, expires_at nullable, deleted_at nullable

### ai_messages
id, conversation_id FK, role, content,
provider nullable, model nullable, safety_status,
redaction_metadata_json, created_at, deleted_at nullable

## Delete policy
- Published curriculum/evidence records should generally be soft-deactivated/versioned rather than cascaded away.
- Student-account deletion requires an explicit product/privacy workflow; do not rely on accidental cascade behavior.
- Historical attempts must retain version references required for review/audit.

## Indexes
At minimum:
- units(subject_id, grade_level_id, quarter_id, ordinal)
- lessons(unit_id, ordinal)
- lesson_competencies(competency_id, lesson_id)
- activities(lesson_id, active)
- activity_competencies(competency_id, activity_id)
- practice_attempts(student_id, activity_id, completed_at)
- quiz_attempts(student_id, quiz_id, submitted_at)
- quiz_attempt_items(quiz_attempt_id)
- competency_mastery(student_id, next_review_at)
- xp_transactions(student_id, created_at)
- student_achievements(student_id, earned_at)
- ai_conversations(student_id, updated_at)
- ai_messages(conversation_id, created_at)

## RLS
Deny by default.

Student:
- may read own safe profile/progress/attempt/results data
- may submit responses only through approved server/RPC paths
- cannot directly write derived fields
- cannot read another student's records
- cannot read canonical Quiz answer keys before submission

Curriculum:
- students read only active/published public content through sanitized views/queries

Service/server:
- validates responses
- scores Quiz
- writes immutable evidence
- updates mastery/progress
- grants XP/streak/achievements transactionally

Future parent:
- no active access policy until parent feature is implemented and relationship authorization is tested
