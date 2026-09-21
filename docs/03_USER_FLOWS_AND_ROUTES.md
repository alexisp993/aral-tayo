# User Flows and Routes

## Student routes
- `/` → redirect based on auth
- `/login`
- `/onboarding`
- `/student/home`
- `/student/subjects`
- `/student/subjects/[subjectSlug]`
- `/student/lessons/[lessonSlug]`
- `/student/lessons/[lessonSlug]/learn`
- `/student/lessons/[lessonSlug]/flashcards`
- `/student/lessons/[lessonSlug]/practice`
- `/student/lessons/[lessonSlug]/quiz`
- `/student/lessons/[lessonSlug]/results/[attemptId]`
- `/student/progress`
- `/student/achievements`
- `/student/ai-tutor`

## Primary vertical-slice flow
Home
→ Subjects
→ Mathematics
→ Adding Fractions
→ Learn
→ Flashcards
→ Practice
→ Quiz
→ Results
→ Next recommendation

## Lesson gating
Default MVP:
- Learn available immediately.
- Flashcards available immediately or after Learn starts.
- Practice available after Learn.
- Quiz unlocks after minimum practice completion.
- Results are available after quiz submission.

Keep gating configurable in data/config, not hard-coded.

## Practice flow
Ready
→ Interacting
→ Submit/check
→ Correct OR Incorrect
→ Feedback
→ Retry/hint/AI help when allowed
→ Complete
→ Next activity

## Quiz flow
Ready
→ Answer
→ Save response
→ Next
→ Submit quiz
→ Score
→ Mastery update
→ Results/review

Quiz must not reveal correctness before submission unless a future quiz configuration explicitly enables it.

## Resume behavior
Store the last active lesson/activity and allow Home's Continue Learning CTA to return the student to the correct location.
