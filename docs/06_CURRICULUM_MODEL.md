# Curriculum and Content Model

## Hierarchy
Curriculum
→ Grade
→ Subject
→ Quarter
→ Unit
→ Lesson
→ Competency
→ Content / Activities

## Requirements
- Support multiple curriculum versions.
- Use stable IDs plus human-readable slugs.
- A lesson may map to one or more competencies.
- An activity must map to at least one competency.
- Content must be separable from application code.

## Core entities
### Curriculum
name, version, jurisdiction, effective dates, status.

### Grade
display order, label.

### Subject
name, slug, icon, theme metadata.

### Quarter
number/order.

### Unit
title, description, order.

### Lesson
title, summary, estimated time, order, prerequisites, publication status.

### Competency
code when available, statement, learning objective, subject/grade context.

### Lesson content
Structured sections such as:
- explanation
- worked example
- visual model
- vocabulary
- real-life example
- key takeaway

### Flashcards
front/back plus optional media.

### Activities
Use the Activity Engine model.

## First seed hierarchy
Philippine Curriculum
→ Grade 5
→ Mathematics
→ Quarter 1
→ Fractions
→ Adding Fractions

Seed competencies for the prototype:
- identify numerator and denominator
- recognize equivalent fractions
- add fractions with the same denominator
- add fractions with different denominators using a common denominator
- solve simple real-life fraction addition problems

These are prototype content labels; production curriculum content should later be validated against the applicable official curriculum source before public release.
