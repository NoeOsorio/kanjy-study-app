# Tasks: Revive Kanjy

**Input**: plan.md, spec.md, research.md, data-model.md, contracts/screens.md, quickstart.md

**Tests**: no unit tests (constitution I). Each task ends with an observable done-check.

**Format**: `[ID] [P?] [Story] Description`. [P] = can run in parallel (different files).
Every commit carries NOE-559 and is pushed. Executed by Sonnet subagents; Opus reviews each diff.

## Phase 1: Setup (slice S0)

- [x] T001 Fix the two TS2554 `useRef` errors in src/pages/QuizPage.tsx. Done: `npm run build` passes.
- [x] T002 Add dependencies ts-fsrs 6, idb-keyval, vite-plugin-pwa 2 and the three fonts in package.json and index.html. Done: `npm ci && npm run build` passes.
- [x] T003 Create scripts/build-data/sources.json with pinned URLs and checksums for kanji-data (jlpt_new only), KANJIDIC2, JMdict, KanjiVG r20260714 and Tatoeba jpn, spa and jpn-spa links; add `.cache/` to .gitignore. Done: file lists six sources with versions.
- [x] T004 Write scripts/build-data/index.mjs that downloads to .cache/, verifies checksums, builds levels, lessons of about ten by KANJIDIC2 frequency, words (common first, any Spanish gloss as fallback, max five), sentences (max three, 25 chars or less) with kana readings from the kuromoji tokenizer (pinned version, IPAdic) and the level of each kanji, difficulty, grade and frequency label, and writes public/data/levels/*.json, public/data/strokes/*.svg and public/data/search.json per data-model.md; it exits non-zero if any kanji lacks a meaning or strokes. Add `npm run data`. Done: report prints 2,211 of 2,211 with meanings and strokes, coverage per level matches research.md R1; a reviewer checks the readings of 20 random sentences.
- [x] T005 Create scripts/build-data/overrides.json with the everyday first meaning for all 79 N5 kanji and the curated sentences from the four old lessons; create scripts/build-data/LICENSE-DATA.md. Done: 日 first meaning is «día, sol»; regeneration keeps overrides.
- [x] T006 Delete src/data/lessons/, src/data/lesson.template.json, src/services/kanjiService.ts and src/services/quizService.ts, and point the old pages at the new data loader or a not-found screen. Done: `grep -ri "mock" src` finds nothing; build passes.

## Phase 2: Foundation (slice S1, blocks every story)

- [x] T007 Create src/design/tokens.css with the palette (white paper, trays #FBF2F5, rail #F2E1E7, wine #A8325A, sakura, reading tags, highlighter, red pen) and type roles from docs/DESIGN.md. Done: a component sheet page renders with the right colors.
- [x] T008 [P] Create notebook components in src/design/: Hoja, Bandeja, CasillaKanji (learned, today, pending), BotonPrincipal, BotonSecundario, EtiquetaLectura, Furigana, Marcatextos, Washi, Sello済, StickerSakura, Hanamaru, NotaPropia, HojaRespuestas. Done: component sheet at /_componentes (dev only) matches the exports by eye and by a reviewer.
- [x] T009 [P] Create src/data/ loader (per-level fetch, cache), types from data-model.md and search over search.json (meaning, kana, romaji, character). Done: in the browser console, search «agua», «みず», «mizu», «水» returns 水 first.
- [x] T010 [P] Create src/store/ with IndexedDB stores for ReviewCard, ReviewLog, Note, StudyDay, Settings and a `SyncAdapter` interface with a local implementation. Done: data survives a reload.
- [x] T011 Create src/app/ router per contracts/screens.md, phone layout and desktop double page (index left at 1024 px and wider), not-found screen; delete src/components/MascotCharacter.tsx, PageHeader.tsx, AppLayout.tsx and the old pages as their routes move. Done: every route opens; unknown routes show not-found; build passes.

## Phase 3: User Story 1, browse and study any kanji (slice S2)

Independent test: quickstart scenarios 2, 3 and 5.

- [ ] T012 [P] [US1] Index 漢字表 in src/pages/indice/ with finished lessons folded with 済, current lesson with washi «Hoy», next lessons, virtualized for N1, and the level selector sheet with kanji previews; the state filter (FR-007) is mocked in Paper and approved by Noe before it is built. Done: N1 scrolls end to end smoothly at 375 px; matches es-2 and es-13.
- [ ] T013 [P] [US1] Kanji page in src/pages/kanji/ with tile and stroke-order play, readings, chips (difficulty, frequency, grade, strokes), words with furigana rule, writing grid preview, sentence with highlighter, note, and play buttons on the kanji and words (T026). Done: matches es-1 for 国; an N1 kanji with no words hides the section.
- [ ] T013b [US1] Desktop double page content in src/pages/kanji/ at 1024 px and wider: stroke-order strip, «En frases, con cada lectura», «No lo confundas con», writing pad and note. Done: matches es-7.
- [ ] T014 [US1] Writing practice and 花丸 in src/pages/escribir/ reusing src/components/KanjiCanvas.tsx with the KanjiVG guide, undo, clear and hint. Done: matches es-3 and es-4.
- [ ] T015 [P] [US1] Search page in src/pages/buscar/ with out-of-level card, furigana and «Agregar a mis repasos». Done: «gato» on N5 shows 猫 as in es-17.
- [ ] T016 [US1] Note editing on the kanji page saving to the Note store. Done: note on 国 survives reload.

## Phase 4: User Story 2, daily review (slice S3)

Independent test: quickstart scenarios 1 and 4.

- [ ] T017 [US2] FSRS scheduler in src/study/ using ts-fsrs `preview()` for the four buttons, session queue where «Otra vez» returns in the same session, daily plan from minutesPerDay. Done: with the clock moved one and four days, failed kanji are due first.
- [ ] T018 [P] [US2] Today page and first day in src/pages/hoy/ (first day when no progress), with the next review time when nothing is due. Done: matches es-16 and the plan shows due and new counts.
- [ ] T019 [P] [US2] Review front and back in src/pages/repaso/ with note on the back, intervals on the buttons and play buttons. Done: matches es-8 and es-9.
- [ ] T020 [US2] Review finished in src/pages/repaso/listo with 花丸 count, minutes, «te costaron», week of stickers from StudyDay, tomorrow tiles. Done: matches es-12; a skipped day is blank.

## Phase 5: User Story 4, quizzes and phrase cards (slice S4)

Independent test: quickstart scenarios 6 and 7.

- [ ] T021 [P] [US4] Exam setup in src/pages/examen/ with lesson trays, six modes, washi «Para empezar» on Significado, disabled state. Done: matches es-10 and es-20.
- [ ] T022 [US4] Exam question and result with no letters on options, plausible same-level distractors, no repeats, time per question, «+ Repasar», play button on the prompt, words mode disabled when the selection has no words. Done: matches es-5 and es-6 for each mode.
- [ ] T023 [P] [US4] Phrase cards in src/pages/frases/ with furigana, highlighter, words, meaning, play button, and the empty card. Done: matches es-11 and es-19.

## Phase 6: User Story 5, the notebook around the study (slice S5)

Independent test: quickstart scenarios 5 and 8.

- [ ] T024 [P] [US5] Account page in src/pages/cuenta/ (name box, minutes per day with the new-kanji preview, writing and sound toggles, credits link, sign out and delete hidden until accounts exist). Done: matches es-14.
- [ ] T025 [P] [US5] Credits page in src/pages/creditos/ from LICENSE-DATA.md. Done: matches es-15.
- [ ] T026 [P] [US5] Sound in src/sound/ (ja-JP voice, kana only, hidden without a voice, respects the toggle). Done: plays on a real phone with a Japanese voice.
- [ ] T027 [P] [US5] Loading skeletons per page. Done: matches es-18.
- [ ] T027b [US5] Press feedback and the four animations of FR-024, after loading the Emil skill. Done: a reviewer checks timing and easing on a phone.
- [ ] T028 [US5] PWA manifest, icons and caching of opened levels with vite-plugin-pwa. Done: installs on a phone and opens a studied level offline.

## Phase 7: User Story 3, accounts and sync (slice S6, only after Noe's yes)

- [ ] T029 [US3] Supabase project, tables and row level security per data-model.md (Noe creates the account; an Ask Human ticket is opened in Linear when this slice starts; keys only in host variables). Done: a test user reads only their rows.
- [ ] T030 [US3] Supabase SyncAdapter with email code and Google sign-in, guest upload on account creation, latest-wins merge, unhide and wire sign out and account deletion in T024's page. Done: quickstart scenario 9.

## Phase 8: Polish and evidence

- [ ] T031 Run every quickstart scenario at 375 and 1280 px headless, save screenshots next to the Paper exports, attach to NOE-559. Done: evidence on the ticket.
- [ ] T032 Independent reviewers (design, copy and repetition, function, coverage table against code) score each screen; a reviewer checks the 79 N5 first meanings against a dictionary (SC-004) and spot-checks 40 N4 kanji; fix below 8. Done: every screen at 8 or more and the meaning checks pass.
- [ ] T033 Cloudflare Pages preview deployment after Noe's yes (Ask Human ticket in Linear when reached). Done: public link opens on a phone.

## Dependencies

S0 → S1 → S2 → S3 → S4 → S5 → (S6 after approval) → polish. Inside a phase, [P] tasks have
disjoint files and run in parallel; T014 needs T013's page; T020 needs T017.

## Implementation strategy

MVP is S0 to S3: the full content, the kanji pages and the daily review as a guest. Each slice is
merged to main once its scenarios pass.
</content>
</invoke>
