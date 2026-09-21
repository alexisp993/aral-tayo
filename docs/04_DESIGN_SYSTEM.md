# TaraLearn Design System

## Visual direction
Clean, modern, cheerful, child-friendly educational UI with Philippine-inspired accents. Avoid overly childish styling so the system can scale from elementary through high school.

## Existing visual language
- White / very light blue canvas
- Dark navy headings/body emphasis
- Bright blue primary actions
- Soft pastel feature cards
- Rounded corners
- Subtle shadows
- Friendly vector illustrations
- Philippine sun/flag/scenery motifs used selectively
- Color-coded subjects and activity types

## Layout
Desktop reference canvas: approximately 16:9.
- Persistent left sidebar
- Top search/profile bar
- Main content area
- Optional right contextual rail on learning screens

Use the mockups as visual source of truth for proportions.

## Component hierarchy
- `AppShell`
- `StudentSidebar`
- `TopBar`
- `PageHeader`
- `Breadcrumbs`
- `Card`
- `StatCard`
- `ProgressBar`
- `SubjectCard`
- `UnitCard`
- `LessonRow`
- `LessonStepCard`
- `Flashcard`
- `ActivityShell`
- `QuestionProgress`
- `HintCard`
- `AITutorHelpCard`
- `AnswerFeedback`
- `XPReward`
- `QuizResults`
- `BadgeCard`

## Interaction states
Every interactive control must support:
- default
- hover (pointer)
- focus-visible
- pressed/dragging when relevant
- selected
- disabled
- correct
- incorrect

Never rely on color alone to communicate correctness.

## Responsive behavior
- Desktop: match supplied mockups closely.
- Tablet: collapse right rail below main content when needed.
- Mobile: sidebar becomes drawer/bottom navigation; activity content becomes single-column.
- Preserve content order and learning functionality.

## Accessibility
- Keyboard operable activities.
- Drag/drop must have click/keyboard alternatives.
- Visible focus rings.
- Semantic buttons/forms.
- Text alternatives for meaningful diagrams.
- Minimum touch target approximately 44px.
- Respect reduced-motion preferences.
