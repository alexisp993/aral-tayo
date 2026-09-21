# Security and Authority Contract v1

## Trust boundary
Browser is untrusted.

Client may propose:
- response
- navigation intent
- UI state

Client may not authoritatively set:
- correctness
- score
- answer key
- mastery
- XP
- streak
- achievement
- submitted Quiz status

## Answer-key isolation
Canonical answer keys remain server/private.
Do not include them in:
- page props
- browser bundles
- public Supabase views
- analytics
- active Quiz AI context

Results endpoint may reveal correct answer only after verifying:
- authenticated owner
- attempt submitted
- requested question belongs to that attempt/version

## Transaction boundary
Final submission processing should atomically or safely idempotently coordinate:
1. persist immutable submission
2. score
3. create evidence
4. update progress/mastery
5. create XP transactions
6. update streak
7. evaluate achievements

If architecture cannot make all six one database transaction, use an idempotent event/outbox workflow with unique event IDs. Never rely on best-effort client sequencing.

## RLS matrix tests
For each protected table/view test:
- unauthenticated
- student owner
- different student
- future parent without relationship
- future parent with relationship (only when feature enabled)
- service role

## Direct writes
Deny student direct writes to derived/authoritative fields.
Use server actions/API/RPC with authorization and canonical validation.

## Child-data minimization
MVP does not require:
- birth date
- school name
- precise location
- public profile
- public posts
- file uploads

Do not add them incidentally.

## Analytics
Use pseudonymous IDs.
Do not send:
- answer keys
- raw AI chat
- unnecessary response text
- sensitive profile fields

## AI
Provider/API keys server-only.
Server computes help level.
AI output never changes score/mastery directly.

## Idempotency
Every meaningful mutation has an event/request identity.
Database uniqueness is the final guard against duplicate processing.

## Content integrity
Published activity/quiz versions used by attempts are immutable for scoring purposes.
Edits create new versions.
