# Responsive Behavior Contract v1

## Desktop
Primary reference: 1536×1024 mockups.
Persistent sidebar + top bar.
Contextual right rail may sit beside main learning content.

## Breakpoint intent
Use project tokens rather than scattering values. Initial implementation may use:
- mobile: < 768px
- tablet: 768–1199px
- desktop: >= 1200px

Adjust only if visual testing proves necessary.

## Mobile navigation
Bottom navigation:
- Home
- Subjects
- Progress
- Achievements
- AI Tutor

Profile/settings/logout live in a profile sheet/menu.
Calendar/Messages are not primary mobile destinations in MVP.

## Context rail order on narrow screens
Move below the main task in this order:
1. progress/status
2. contextual help
3. encouragement/supporting content

Never place help above the actual question.

## Sticky behavior
Mobile Practice/Quiz:
- question header/progress may remain compact at top
- primary Check/Next action may use a sticky bottom action area if it does not obscure content
- timer, if ever enabled, remains visible but non-alarming

## Spatial activity fallbacks
Drag/drop:
select item → select destination.

Match:
select left item → choose matching right item from accessible list.

Sort:
select item → choose category.

Hotspot:
structured visual plus keyboard/list equivalent.

These are first-class interactions, not emergency fallbacks.

## Subject Detail
Desktop master/detail becomes:
subject header → unit selector → selected unit lessons.

## Hero artwork
On mobile:
- reduce or hide decorative artwork before shrinking important text/actions
- meaningful instructional visuals remain

## Wide content
Equations/diagrams:
- responsive SVG/DOM
- avoid horizontal scrolling where possible

Charts:
- stack
- provide textual/table summary

Tabs:
- horizontally scrollable only when necessary, with visible active state

Results:
score summary → mastery/recommendation → question review → actions.
