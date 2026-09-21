# Accessibility Contract v1

## Baseline
Accessibility is implemented during each feature phase, not deferred to QA.

## Keyboard
Every learning activity must be completable without drag gestures or pointer-only actions.

## Focus
- route/page: focus main heading after navigation
- question change: focus question heading
- Practice feedback: focus feedback summary
- dialog/drawer open: focus first meaningful control
- close: return focus to opener
- errors: focus/announce error summary when blocking

## Live regions
Polite announcements:
- selected count
- placement/move
- pair connected/disconnected
- saved state
- Practice result
- XP earned

Assertive:
- blocking submission error
- urgent timer expiration only when timer is enabled

## Multiple choice
Use radio-group semantics.

## Drag/drop
Provide:
- Select item
- Move to/choose destination
- Remove/undo
- announce current destination

## Match pairs
Provide a nonvisual/list pairing workflow.
Connector lines are decorative representation, not the only relationship information.

## Sort
Each item exposes its current category and actions to move/remove.

## Hotspot
Each region has:
- stable ID
- accessible name
- selected state
- keyboard focus
Also provide a nonvisual equivalent control when the visual itself cannot communicate sufficiently.

## Flashcards
Use explicit button semantics for Flip/Show answer.
Do not make 3D animation the only way content becomes available.

## Timer
Timer off by default.
If enabled:
- announce meaningful thresholds, not every second
- visible text states remaining time
- never rely on color alone

## Charts
Progress charts require text/table summaries of the same essential information.

## Images
Decorative images: empty alt.
Instructionally meaningful images: concise alt or structured accessible equivalent.

## Visual
- visible focus
- status uses icon/text + color
- minimum ~44px touch targets
- test contrast
- test 200% and 400% zoom/reflow
- support text resizing
- respect reduced motion
