# TaraLearn Product Specification

## Product
TaraLearn is a Philippine curriculum-aligned learning companion for K–12 learners. The MVP proves the concept with a Grade 5 Mathematics vertical slice.

## Product promise
Help a learner understand a lesson, practice it interactively, demonstrate mastery, and know what to study next.

## Primary users
### Student
Learns lessons, completes interactive activities, takes assessments, earns XP/achievements, and receives targeted help.

### Parent
Future-facing role. Database architecture should support parent-child relationships, but the parent portal is not required for the first vertical slice.

### Teacher / Admin
Future roles. Do not build their portals in MVP.

## Student information architecture
- Home
- Subjects
  - Subject Detail
    - Unit
      - Lesson Overview
        - Learn
        - Flashcards
        - Practice
        - Quiz
        - Results
- Progress
- Achievements
- AI Tutor

## Core learning loop
1. Discover/continue a lesson.
2. Learn the concept with explanation, examples, and visuals.
3. Review vocabulary/concepts with flashcards.
4. Practice through interactive activities.
5. Take a less-assisted quiz.
6. Review results.
7. Update competency mastery.
8. Recommend the next lesson or remediation activity.

## First vertical slice
Grade 5 → Mathematics → Quarter 1 → Unit: Fractions → Lesson: Adding Fractions.

The vertical slice must exercise every reusable system:
- curriculum navigation
- lesson content
- flashcards
- all five activity renderers
- quiz
- attempts
- mastery
- XP/streak
- achievements
- AI Tutor context
- results/recommendations

## Product principles
- Child-friendly but not babyish.
- Explain rather than punish mistakes.
- Practice should be forgiving.
- Assessment should measure independent performance.
- Use visuals and interaction where they improve understanding.
- Do not gamify by encouraging random clicking.
- Every scored activity maps to a learning competency.
- Keep architecture content-driven so new subjects/grades require content more than code.
