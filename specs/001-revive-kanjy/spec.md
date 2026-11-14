# Feature Specification: Revive Kanjy

**Feature Branch**: `noe-559-revivir-kanjy`

**Created**: 2026-11-14

**Status**: Draft

**Linear**: NOE-559

**Input**: User description: "Quiero revivir y actualizar kanjy-study-app para que sea 100% funcional.
Necesitaremos su análisis, maquetado en Paper y rediseño. Hay funcionalidades pendientes para que
funcione correctamente con estudiantes reales; hay que resolver de dónde sacamos y cruzamos los
kanji por nivel N5, N4, etc. y los organizamos de forma entendible y fácil de utilizar."

## Context: what exists today (2026-11-14)

- The production build fails: two type errors in the quiz page.
- "Quiz Rápido" asks for a lesson that does not exist and silently serves five hand-written mock
  kanji, repeated across 15 questions.
- The mixed quiz shows a kunyomi reading (き) under the label "¿Cuál es el significado?".
- Only 27 N5 kanji exist, in 4 hand-written lessons. Progress is never saved. The profile page is
  not routed. Lesson cards are one large card each, which cannot hold 120+ lessons.

## Decisions already made by Noe (2026-11-14)

- Audience: open public of Spanish speakers. No teacher or classroom role.
- Progress: student accounts with sync between devices (backend, keys and monthly cost need his
  separate yes before anything is created).
- Spaced repetition is the center of the app.
- Inside each level, lessons of about ten kanji ordered by usage frequency.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and study any kanji from N5 to N1 in Spanish (Priority: P1)

A student opens Kanjy, picks a level (N5 to N1), sees that level's lessons in order, opens a
lesson and studies each kanji: Spanish meaning, onyomi and kunyomi readings, stroke count, stroke
order, and common words that use it with their Spanish meaning.

**Why this priority**: Without the full content there is nothing to learn beyond 27 kanji; every
other story depends on it.

**Independent Test**: With no account and no review history, open each level, open its first and
last lesson, open any kanji, and check the card against the acceptance bar below.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they choose N4, **Then** they see N4's lessons in frequency
   order, each with its kanji visible, and can reach any of N4's 166 kanji in two taps or by search.
2. **Given** a student on N1 (1,232 kanji), **When** they type "agua", "みず", "mizu" or "水" in
   search, **Then** 水 appears in the first results.
3. **Given** a kanji card, **When** the student opens it, **Then** the first meaning shown is the
   everyday one (日 shows "día, sol", never "Japón" or "solar" first).
4. **Given** an N1 kanji with no common word that has a Spanish meaning, **When** the student opens
   it, **Then** the words section is simply absent; nothing says "sin datos".
5. **Given** a kanji card, **When** the student taps the stroke order, **Then** the strokes are drawn
   in the correct order and the student can practice tracing over a guide.

---

### User Story 2 - Daily review with spaced repetition (Priority: P1)

The home screen tells the student what to do today: review the kanji that are due and learn the
next new ones. Each review asks for a meaning or a reading; the student answers and the app
schedules the next review from how well they knew it.

**Why this priority**: Noe chose it as the center of the app; it is what makes a real student
progress over weeks instead of browsing.

**Independent Test**: Learn a lesson, answer its reviews with some mistakes, move the device clock
forward one and four days, and confirm the failed kanji come back sooner than the known ones.

**Acceptance Scenarios**:

1. **Given** a student with 12 kanji due, **When** they open the app, **Then** the main action is
   reviewing those 12, and the second is learning new kanji.
2. **Given** a review session, **When** the student fails a kanji, **Then** it returns later in the
   same session and is scheduled sooner than a kanji they knew.
3. **Given** nothing due today, **When** they open the app, **Then** the main action is learning the
   next lesson of their level, and the next review time is visible.
4. **Given** a quiz question, **When** it shows a reading, **Then** the prompt says it is a reading
   and asks for the kanji; prompts always match what is shown.

---

### User Story 3 - Account and progress on every device (Priority: P2)

A student can start studying immediately without an account. When they create one, their progress
so far is kept and from then on syncs between phone and computer.

**Why this priority**: Noe chose sync; it protects weeks of progress. It depends on Stories 1 and 2
having progress worth saving, and on his approval of the service and cost.

**Independent Test**: Study on a phone as a guest, create an account, then sign in on a desktop
browser and see the same due reviews and learned kanji.

**Acceptance Scenarios**:

1. **Given** a guest with 30 learned kanji, **When** they create an account, **Then** none of those
   30 are lost.
2. **Given** a signed-in student who reviews on the phone offline, **When** the phone reconnects,
   **Then** the reviews reach the desktop without duplicates or lost answers.
3. **Given** a student who wants to leave, **When** they delete their account, **Then** their
   progress is removed from the server.

---

### User Story 4 - Quizzes by lesson or level (Priority: P3)

Besides the daily review, a student can pick one or more lessons or a whole level and run a quiz
in any of the existing modes (meaning, onyomi, kunyomi, mixed), and see what they missed.

**Why this priority**: It already exists in part; it is fixed and adapted to the new content, but
the daily review covers most study.

**Independent Test**: Start a quiz from each entry point (a lesson, several lessons, a level) and
confirm questions come only from the chosen kanji, with no repeated question and correct prompts.

**Acceptance Scenarios**:

1. **Given** the quick quiz, **When** the student starts it, **Then** it uses kanji they have
   learned (or their current lesson if none), never placeholder data.
2. **Given** a quiz on one lesson of 10 kanji, **When** it runs, **Then** no question repeats and
   the wrong options are plausible kanji of the same level.

### Edge Cases

- A level with 1,232 kanji and 120+ lessons must stay fast to open and scroll on a phone.
- Kanji whose Spanish meaning list starts with a rare sense (経 "sutra") need the curated order.
- Kanji with no kunyomi or no onyomi: the quiz never asks for the missing reading.
- A guest clears the browser data before creating an account: progress is lost, and the app says
  so plainly in the account invitation.
- Two devices review the same kanji offline: the later answer wins and both answers are counted.
- Opening a lesson or kanji link that does not exist shows a not-found screen, never mock data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST contain the 2,211 kanji of the Waller JLPT lists (N5 79, N4 166,
  N3 367, N2 367, N1 1,232), generated by a reproducible script from pinned open sources.
- **FR-002**: Every kanji MUST show a Spanish meaning, onyomi and kunyomi readings, stroke count
  and stroke order.
- **FR-003**: Meanings MUST show the everyday sense first; a single overrides file corrects the
  order or wording for any kanji and survives regeneration.
- **FR-004**: Each kanji MUST list up to five common words that use it, with reading and Spanish
  meaning, when such words exist; otherwise the section is not shown.
- **FR-005**: Each level MUST be split into lessons of about ten kanji ordered by usage frequency;
  the existing four themed N5 lessons are retired in favor of the generated ones, keeping their
  hand-written Spanish example sentences as curated examples.
- **FR-006**: Students MUST be able to search kanji by Spanish meaning, kana reading, romaji
  reading and the character itself, within a level or across all levels.
- **FR-007**: The library MUST offer a dense grid view and filters by level and by study state
  (new, learning, known).
- **FR-008**: The app MUST schedule reviews with a published spaced-repetition algorithm and show
  a daily "review now" and "learn new" plan on the home screen.
- **FR-009**: Students MUST be able to study as guests with progress stored on the device.
- **FR-010**: Students MUST be able to create an account and sign in; guest progress MUST be kept
  when they do.
- **FR-011**: Signed-in progress MUST sync between devices and survive offline use.
- **FR-012**: Students MUST be able to delete their account and its data.
- **FR-013**: Quiz prompts MUST always describe what is shown; quizzes MUST never use mock data.
- **FR-014**: The app MUST include a credits page with the data sources, their licenses and the
  note that JLPT levels are unofficial lists.
- **FR-015**: The production build MUST compile with no type errors, and the app MUST be
  installable on a phone home screen.
- **FR-016**: Every screen of the redesign MUST be mocked up in Paper and approved by Noe before
  it is implemented, with before and after screenshots on the Linear ticket.

### Key Entities

- **Kanji**: character, level, frequency rank, Spanish meanings (ordered), onyomi, kunyomi, stroke
  count, stroke paths, common words.
- **Word**: written form, kana reading, Spanish meanings, commonness.
- **Lesson**: level, position inside the level, list of about ten kanji.
- **Review state**: per student and kanji: stability, difficulty, due date, history of answers.
- **Student**: guest (device only) or account (synced); level they are studying.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 2,211 kanji open with meaning, readings and stroke order; zero screens
  show placeholder or mock data.
- **SC-002**: On a mid-range phone, opening the N1 lesson list and scrolling it end to end has no
  visible stutter, and the first screen loads in under 2 seconds on 4G.
- **SC-003**: A new visitor starts their first review of real kanji within 60 seconds of opening
  the app, without creating an account.
- **SC-004**: For the 79 N5 kanji, the first meaning shown matches a curated everyday meaning
  in 100% of cases (checked by a reviewer against a dictionary).
- **SC-005**: A guest who creates an account keeps 100% of their learned kanji and due reviews.
- **SC-006**: Independent reviewers score every redesigned screen at least 8 of 10 on usefulness,
  clarity and design, with zero violations of the anti-slop rules.

## Assumptions

- Sign-in uses an email code (no password) plus Google sign-in; Noe confirms in the plan gate.
- The account backend is a hosted auth and database service on its free tier; it needs Noe's yes
  for the account, the keys and any cost before it is created.
- Spanish meanings come from KANJIDIC2; vocabulary from the Spanish JMdict; stroke order from
  KanjiVG; levels from the Waller lists. In a check on the 27 curated kanji, all 27 curated
  meanings appear among KANJIDIC2's first two Spanish meanings, so N5 and N4 curation is a small
  overrides pass, not a rewrite.
- Example sentences beyond the existing curated ones are out of scope for this spec.
- Audio, handwriting recognition, a teacher role and native mobile apps are out of scope.
- The web app is hosted on a free static host; publishing it to the internet needs Noe's yes.
