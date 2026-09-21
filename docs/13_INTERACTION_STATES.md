# Interaction States — v2 Addendum/Replacement

## Authority
This v2 file supersedes conflicting interaction behavior in the original.

## Shared
`default → interacting → submitting → success/error`

All controls: default, hover, focus-visible, active, disabled, loading.

Do not communicate status by color alone.

## Practice
`ready → interacting → submit → correct/incorrect → retry/help/explanation → complete`

Incorrect:
- supportive error state
- first failure does not reveal final answer
- Try Again
- Hint
- Ask Tara

Correct:
- explicit success icon/text
- concise explanation
- Continue

**No per-question XP celebration.**
Practice set completion may show `+20 XP`.

## Quiz
### Active question
- selection uses neutral blue/brand selection state
- no green/red correctness treatment
- no “Correct/Incorrect”
- no worked hint
- no Show Hint
- optional `Quiz Help` opens `quiz_safe` Tara behavior only

### Timer
Off by default.
If future config enables a timer:
- semantics must explicitly say remaining time
- server owns deadline
- autosubmit behavior must be configured and announced
- accessibility accommodations require separate product handling

### Submission
If unanswered questions remain:
- show count
- Review Questions
- Submit Anyway

After final submission:
- attempt freezes
- server scores once
- navigate to Results

### Results
May show:
- learner answer
- correct answer
- correct/incorrect styling
- explanation
- mastery changes
- XP
- recommendation

## Lesson progress
Completed step count includes only terminally completed steps.
Partial Practice is not a completed step.

## Counts
Question/activity counts are always derived from loaded content.
Never hard-code “10” from a mockup.

Vertical-slice Practice: 7 activities.
Vertical-slice Quiz: 10 questions.

## Focus
After validation in Practice:
- move programmatic focus to feedback heading/summary
- Continue/Try Again follows in logical order

After question navigation:
- focus question heading/instruction

After drawer/dialog close:
- return focus to opener

## Live announcements
Use polite live regions for:
- validation result
- selection/placement changes when needed
- pair creation/removal
- hotspot selected count
- saved/error state
- XP award
Use assertive only for blocking errors or time-critical warnings.
