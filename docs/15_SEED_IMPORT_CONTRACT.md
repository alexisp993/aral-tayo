# Seed Import Contract v1

## Purpose
Define how nested prototype seed JSON becomes canonical database records.

## Seed schema
Validate seed against `activity-seed.schema.json` before import.

## Natural keys
Importer resolves/creates deterministically using:
- curriculum: jurisdiction + name + version
- grade: curriculum + ordinal
- subject: curriculum + slug
- quarter: grade + ordinal
- unit: subject + grade + quarter + slug
- lesson: unit + slug
- competency: curriculum + grade + subject + key/slug
- activity: stable seed `id` + version
- quiz: seed quiz `id` + version

Importer must be rerunnable without duplicating records.

## Nested-to-relational mapping
Seed `competency_keys` become `activity_competencies` join rows.
Lesson competency weights become `lesson_competencies`.
Practice activities become canonical `activities`.
Quiz questions also become canonical versioned `activities`, then connect through `quiz_activities`.

## Defaults
If omitted:
- activity version = 1
- quiz version = 1
- active = true for prototype environment
- partial credit = false
- estimated_seconds = null

## Private/public split
Seed answer keys are imported into private canonical storage.
Student content APIs/views emit sanitized DTOs.

## Publication
Seed status is `prototype_seed`.
Importer must not mark prototype content as officially validated curriculum.

## Update behavior
Changing a published activity's scoring meaning creates a new activity version.
Historical attempts retain the version they used.

## Validation failures
Fail import atomically for:
- duplicate stable IDs in same version
- unresolved competency key
- unresolved answer-key item/option IDs
- invalid ordinals
- invalid activity type
- malformed type-specific config
- quiz referencing missing question/activity
