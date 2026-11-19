# Data Model: Revive Kanjy

Two kinds of data: **generated content** (read-only, built by `scripts/build-data`, shipped as static
files) and **student data** (written on the device, synced to the account after approval).

## Generated content

### Level file `public/data/levels/{n5..n1}.json`

| Field | Type | Notes |
|---|---|---|
| `level` | `"N5" \| … \| "N1"` | |
| `lessons` | `Lesson[]` | in frequency order |
| `kanji` | `Record<char, Kanji>` | every kanji of the level |

### Kanji

| Field | Type | Rule |
|---|---|---|
| `char` | string | one character |
| `level` | level | from the Waller list |
| `frequencyRank` | number or null | KANJIDIC2 `freq`; shown as «Muy común» (≤ 500), «Común» (≤ 1,500), hidden otherwise |
| `grade` | number or null | KANJIDIC2 school grade; shown as «2.º de primaria» (1 to 6), «Secundaria» (8) |
| `difficulty` | 1 \| 2 \| 3 | derived from stroke count and level; shown as Fácil, Media, Difícil with three bars |
| `meanings` | string[] | Spanish, everyday first; overrides applied; never empty (build fails) |
| `onyomi` | string[] | katakana; may be empty |
| `kunyomi` | string[] | hiragana with okurigana marks; may be empty |
| `strokeCount` | number | |
| `words` | `Word[]` | 0 to 5 |
| `sentences` | `Sentence[]` | 0 to 3; empty means the «sin ejemplos» card |
| `lesson` | number | position of its lesson inside the level |

### Word

`{ written, reading, meaning, level }`. `level` is the highest level among the word's kanji, so the
UI knows when to show furigana (FR-018).

### Sentence

`{ ja, reading, es, kanjiLevels }`. `reading` is the kana for furigana; `kanjiLevels` maps each
kanji in the sentence to its level.

### Lesson

`{ level, number, kanji: char[] }`. About ten kanji, frequency order.

### Strokes `public/data/strokes/{codepoint}.svg`

KanjiVG paths, one SVG per kanji, loaded on demand.

### Overrides `scripts/build-data/overrides.json`

`{ [char]: { meanings?: string[], hideWords?: string[] } }`. The only place for human corrections;
survives regeneration (Principle IV).

### Search index `public/data/search.json`

Compact rows `[char, level, meanings joined, kana readings, romaji readings]` for all 2,211 kanji,
loaded on first search.

## Student data (IndexedDB on the device; synced after approval)

### ReviewCard (one per studied kanji)

| Field | Type | Notes |
|---|---|---|
| `char` | string | key |
| `fsrs` | ts-fsrs `Card` JSON | due, stability, difficulty, reps, lapses, state |
| `addedFrom` | `"lesson" \| "search" \| "exam"` | «Agregar a mis repasos» uses search or exam |
| `updatedAt` | ISO time | sync conflict rule: latest wins |

States follow FSRS: New → Learning → Review ↔ Relearning. «Otra vez» sends a card back to
Relearning and it reappears in the same session.

### ReviewLog (device only)

`{ char, rating, reviewedAt, elapsedMs }`: feeds «Repaso terminado» (24 repasados, 7 minutos, 3 te
costaron) and the exam result time per question. Not synced, to keep the database small (R4).

### Note

`{ char, text, updatedAt }`. One per kanji; empty text deletes it.

### StudyDay

`{ date }` for each day with at least one review or new kanji. The week of stickers reads the last
seven days; a missing day is blank, never a broken streak.

### Settings

`{ level, minutesPerDay: 5 | 10 | 20 | 30, writing: boolean, sound: boolean, name? }`.
`minutesPerDay` sets new kanji per day: 5 → 1, 10 → 2, 20 → 4, 30 → 6, plus all due reviews.

### LessonProgress (derived, not stored)

Learned count per lesson comes from ReviewCards; a lesson with all kanji past Learning gets 済.

## Sync tables (only after Noe's yes; Supabase per R4)

`review_cards(user_id, char, fsrs jsonb, updated_at)`, `notes(user_id, char, text, updated_at)`,
`study_days(user_id, date)`, `settings(user_id, data jsonb)`. Row level security: a user reads and
writes only their rows. Guest data is uploaded once on account creation (SC-005).
</content>
</invoke>
