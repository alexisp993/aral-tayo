---
name: Aral Tayo Learning Quest
description: A tactile paper-and-ink learning game that makes progress visible and practice feel playful.
colors:
  canvas: "#f7f3e8"
  paper: "#fffdf4"
  ink: "#17150f"
  ink-muted: "#5d574a"
  coral-action: "#ff6b5d"
  coral-strong: "#d5453c"
  yellow-reward: "#ffd95f"
  mint-success: "#91e3b7"
  green-progress: "#5cc98c"
  blue-learning: "#cfe8ff"
  pink-heart: "#ffc1b9"
  disabled-paper: "#ded9cb"
typography:
  display:
    fontFamily: "Fredoka Variable, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 3.75rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Fredoka Variable, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Nunito Sans Variable, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.75
  label:
    fontFamily: "Nunito Sans Variable, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1.25
rounded:
  control: "10px"
  card: "12px"
  surface: "16px"
  full: "9999px"
spacing:
  compact: "12px"
  standard: "16px"
  roomy: "24px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.coral-action}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "10px 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "10px 16px"
    height: "44px"
  game-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "24px"
---

# Design System: Aral Tayo Learning Quest

## Overview

**Creative North Star: “The Classroom Game Table”**

Aral Tayo feels like a welcoming tabletop learning game: warm paper, confident ink, tactile controls, and bright classroom materials. The system adapts the energetic visual grammar of jovVix to an individual Filipino learner journey without borrowing its brand, logo, or assets.

Routine learning remains calm and legible; scoring moments become more expressive through reward colors, authored feedback, and one short pop animation. The interface is playful without making curriculum instructions ambiguous.

**Key Characteristics:**

- Warm paper surfaces outlined in dark ink.
- Fredoka display lettering paired with sturdy Nunito Sans body copy.
- Coral actions, yellow rewards, mint success, blue learning, and pink hearts.
- Visible progress, XP, streaks, achievements, and locked states.
- Desktop sidebar and mobile bottom navigation expressed in the same tactile language.

## Colors

The palette resembles physical classroom materials arranged on warm drawing paper.

### Primary

- **Coral Action:** Primary calls to action and important interactive moments.
- **Dark Ink:** Type, borders, icons, and structural dividers.

### Secondary

- **Reward Yellow:** Active navigation, points, highlights, and earned states.
- **Success Mint:** Correct answers, completion, and leaderboard emphasis.
- **Learning Blue:** Quiz introductions and instructional support.
- **Heart Pink:** Attempts, hearts, and warm alert states.

### Neutral

- **Canvas:** The application ground.
- **Paper:** Cards, fields, and quiet controls.
- **Muted Ink:** Secondary copy derived from the same warm neutral family.
- **Disabled Paper:** Locked and unavailable states.

**The Material Color Rule.** Every accent represents a learning material or state; do not introduce unrelated decorative gradients.

## Typography

**Display Font:** Fredoka Variable
**Body Font:** Nunito Sans Variable

**Character:** Fredoka gives headings the hand-lettered friendliness of the chosen reference while Nunito Sans keeps instructions, questions, and data easy to scan.

### Hierarchy

- **Display:** Route identity and major game outcomes; maximum 3.75rem.
- **Headline:** Question prompts and section titles; usually 1.875rem.
- **Body:** Explanations and instructions at 1rem with generous line height and a 65–75 character measure.
- **Label:** Controls, metadata, scores, and status text at 0.875rem and extra-bold weight.

**The Friendly, Never Fuzzy Rule.** Display type carries personality; all task instructions remain direct and high-contrast.

## Layout

The desktop shell reserves a fixed 15rem sidebar and centers content inside a 90rem maximum canvas. Page identity and the next useful action appear in the first viewport. Game surfaces narrow to 64rem so questions remain focused.

At compact widths, the sidebar becomes a fixed five-item bottom navigation. Multi-column score and choice layouts collapse before text becomes cramped. Controls retain a minimum 44px target.

## Elevation & Depth

Depth is structural and tactile. Paper surfaces use a dark offset foundation plus a soft ambient tail; interactive controls use a smaller version of the same shadow and visibly press toward the page when selected.

### Shadow Vocabulary

- **Paper Lift:** `7px 8px 0 #17150f, 11px 13px 22px rgba(23,21,15,.13)` for primary game surfaces.
- **Control Lift:** `3px 4px 0 #17150f, 5px 7px 12px rgba(23,21,15,.1)` for buttons, chips, and choices.

**The Physical Response Rule.** Offset shadows are reserved for tangible surfaces and controls; plain text and passive metadata remain flat.

## Shapes

Controls use 10–12px corners and major surfaces use 16px corners. Two-pixel ink borders make silhouettes deliberate. Full pills are limited to progress tracks, avatars, and compact counters.

## Components

### Buttons

- **Primary:** Coral fill, dark ink text, two-pixel ink border, and Control Lift.
- **Secondary:** Paper fill with the same border and depth.
- **Ghost:** Underlined ink text with no floating container.
- **States:** Hover increases lift slightly; active and selected controls compress the shadow. Disabled controls switch to Disabled Paper.

### Cards / Containers

- **Game Surface:** Paper fill, 16px corners, two-pixel dark border, Paper Lift.
- **Utility Region:** Flat reward-color fill without another nested shadow.
- **Internal Padding:** 20–36px depending on viewport and task density.

### Inputs / Fields

Fields use Paper fill, a two-pixel ink border, 10px corners, and a three-pixel visible focus outline. Radio choices turn Reward Yellow when selected.

### Navigation

Desktop navigation uses extra-bold labels and line icons. The active destination becomes a yellow tactile tab. Mobile uses the same five destinations in a fixed paper dock, with coral carrying active state.

### Game HUD

Hearts, streak, and points appear as compact tactile chips. Progress uses a dark outlined track and Success Green fill. Correct feedback uses Mint; guided retry uses Yellow; final results use stars and account-linked XP.

### Fraction Quest games

Five visible checkpoint nodes show session progress without exposing outcomes. Each quest shuffles five distinct mechanics from the nine-game library. Fraction Memory asks learners to flip cards and clear three equivalent-fraction pairs; Recipe Builder asks learners to combine two measured ingredients in a mixing bowl; Fraction Cannon lets learners aim and fire at one of three fraction targets; Number-Line Dash asks them to position a marker before the final beat; Pizza Slice Catch asks them to steer a plate under a falling fraction card; Fraction Runner asks them to dodge an obstacle course and cross a labeled finish gate. Action games pause when the tab is hidden and replace automatic motion with explicit step controls for reduced-motion users. Bridge Builder uses large button planks, Treasure Match uses labeled selects with unique destinations, and Order Tower uses explicit Move up/Move down controls. Every mechanism is keyboard and touch operable.

## Do's and Don'ts

### Do:

- **Do** keep questions, progress, and the next action understandable within seconds.
- **Do** use reward colors consistently for meaning across Practice, Quiz, Progress, and Achievements.
- **Do** preserve secure server validation behind every scored activity.
- **Do** show locked requirements with an exact recovery path.

### Don't:

- **Don't** copy third-party logos, illustrations, or branded assets.
- **Don't** nest multiple lifted cards; colored flat regions belong inside one paper surface.
- **Don't** use decorative gradients, glass effects, or low-contrast gray copy.
- **Don't** expose answer keys or scoring secrets in client payloads.
