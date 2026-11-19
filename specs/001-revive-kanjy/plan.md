# Implementation Plan: Revive Kanjy

**Branch**: `noe-559-revivir-kanjy` | **Date**: 2026-11-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-revive-kanjy/spec.md`, the approved Paper screens
(`docs/rediseno/doriru/es-*.png`), `docs/DESIGN.md` and `docs/rediseno/COBERTURA.md`.

## Summary

Kanjy today has 27 hand-written N5 kanji, a quick quiz that silently serves mock data, no saved
progress and a build that does not compile. The root cause is that content and behavior were
hand-written into the app: there is no data pipeline, so missing lessons fall back to mock data,
and no study model, so nothing is saved. The plan replaces both: one reproducible script generates
all 2,211 kanji from pinned open sources (measured coverage in research.md), and a spaced-repetition
core (FSRS) stores progress on the device. The UI is rebuilt to the approved notebook design. Mock
data is deleted, and a missing lesson or kanji shows a not-found screen, so the old failure class
cannot come back.

## Technical Context

**Language/Version**: TypeScript 5.8, React 19, Node 24 for the data script.

**Primary Dependencies**: Vite 7, Tailwind CSS 4, React Router 7, ts-fsrs 6, vite-plugin-pwa 2,
idb-keyval (IndexedDB). Fonts: Geist, Newsreader, Klee One. framer-motion stays for the few
animations (loaded with the Emil skill rules before writing motion).

**Storage**: static JSON and SVG generated into `public/data/`; student data in IndexedDB; sync
to Supabase only after Noe's yes (research.md R4).

**Testing**: no unit tests (constitution I). End-to-end scenarios in [quickstart.md](quickstart.md)
with a headless browser at 375 px and 1280 px, screenshots compared with the Paper exports, and
independent reviewers.

**Target Platform**: mobile browsers first (iOS Safari, Android Chrome), desktop browsers;
installable as a PWA.

**Project Type**: single-page web app plus a build-time data script.

**Performance Goals**: first screen under 2 s on 4G; N1 index (1,232 kanji) scrolls without
stutter on a mid-range phone; only the current level's JSON is loaded.

**Constraints**: works offline for levels already opened; no server of our own; no vendor names
in the UI; no keys in text.

**Scale/Scope**: 2,211 kanji, 120+ lessons in N1, 20 screens, up to about 5,000 students.

## Constitution Check

| Principle | How the plan keeps it |
|---|---|
| I Done is what the student sees | quickstart scenarios at 375 and 1280 px, reviewers, screenshots on NOE-559 |
| II Root cause | pipeline plus not-found screen replace mock fallbacks; build fails on missing data |
| III Plan before code | this plan waits for Gate A |
| IV One source of truth | `scripts/build-data` is the only producer; `overrides.json` the only hand edit |
| V Licenses | credits page lists KANJIDIC2, JMdict, KanjiVG (CC BY-SA), Tatoeba (CC BY 2.0 FR), Waller lists; generated data carries its license file |
| VI Keys | Supabase public key only through host variables, after approval |
| VII Money and exposure | Supabase project, Cloudflare Pages site and any domain need Noe's yes (see Decisions) |
| VIII Scale | per-level loading, virtualized N1 index, search index for all levels |
| IX Anti-slop | DESIGN.md rules; reviewers check every screen |
| X No vendor names | sound and sync described plainly; names only in credits |
| XI Simplest thing | FSRS library, browser voice, hosted auth; no custom backend |
| XII Small shipped changes | one commit per task with NOE-559, pushed; slices merged to main as validated |
| XIII Spanish UI | all copy from the approved screens |
| XIV No feature removed | COBERTURA.md maps every current feature; reviewer checks it against the code |

No violations. Gate passes.

## Decisions that need Noe's yes (Gate A)

1. **Accounts**: Supabase (auth and database in one, free tier, works without our own server)
   instead of WorkOS plus a separate database and server. Creating the project needs his yes.
2. **Sound**: the device's own Japanese voice (free); recorded audio only if real phones fail.
3. **Publishing**: Cloudflare Pages free tier for a public preview link.
4. **Delivery order**: the guest app (slices S0 to S5) ships first; sync (S6) after he approves 1.

## Project Structure

### Documentation (this feature)

```text
specs/001-revive-kanjy/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/screens.md
└── tasks.md        (next step)
```

### Source code

```text
scripts/build-data/
├── index.mjs            # downloads pinned sources to .cache/, builds public/data/
├── sources.json         # URLs, versions and checksums
├── overrides.json       # human corrections (meanings order, hidden words)
└── LICENSE-DATA.md      # attribution for generated data

public/data/
├── levels/n5.json … n1.json
├── strokes/{codepoint}.svg
└── search.json

src/
├── app/                 # router, layout (phone and desktop double page), not-found
├── design/              # tokens and notebook components (Hoja, Bandeja, Casilla, Furigana…)
├── data/                # level loader, search, types from data-model.md
├── study/               # FSRS scheduler, daily plan, review session, study days, notes
├── store/               # IndexedDB access; sync interface (local now, Supabase later)
├── sound/               # speechSynthesis wrapper (kana only, voice detection)
├── pages/               # one folder per route in contracts/screens.md
└── main.tsx
```

**Removed** (replaced by the above): `src/data/lessons/*.json`, `src/data/lesson.template.json`,
`src/services/kanjiService.ts` and `quizService.ts` (mock fallbacks), `src/components/MascotCharacter.tsx`,
`PageHeader.tsx`, `AppLayout.tsx` (template header and tab bar), the old pages. `KanjiCanvas.tsx`
is kept and adapted for the writing grid. The four themed lessons' Spanish example sentences move
to `overrides.json` as curated sentences (FR-005).

## Delivery slices (each ends green on build and verified on screen)

| Slice | What lands | Verified by |
|---|---|---|
| S0 | build fixed; `npm run data` generates all levels, strokes and search index; mock data deleted | data script report (2,211 of 2,211), `npm run build` clean |
| S1 | tokens, fonts, notebook components, layout for phone and desktop | component sheet page compared with DESIGN.md |
| S2 | index, level selector, search, kanji page with chips and note, writing and 花丸, not-found | quickstart 2, 3, 5 |
| S3 | FSRS core, today page, first day, review front and back, review finished, stickers, settings | quickstart 1, 4 |
| S4 | phrase cards with empty state, exam setup, question, result, «+ Repasar» | quickstart 6, 7 |
| S5 | account page (local), credits, loading skeletons, sound, PWA, Cloudflare preview after yes | quickstart 8, install on a phone |
| S6 | Supabase auth with email code and Google, sync, account deletion (after yes) | quickstart 9 |

## What must not break

- Every feature in COBERTURA.md keeps its screen (Principle XIV).
- Guest progress is never lost: migrations of IndexedDB are versioned; account creation uploads it
  before switching (SC-005).
- Generated data keeps its licenses and attribution.
- No key in the repo; `npm run data` downloads only public files.

## Execution

Each slice is implemented by Sonnet subagents (`model: "sonnet"`) following `tasks.md`, briefed
with the files and the done-check of each task. Tasks with disjoint files run in parallel (for
example, in S2 the search and the writing page); shared components in S1 go first. Opus reviews
every diff against this plan, DESIGN.md and the quality bar before the next slice. After each
slice: build, quickstart scenarios at both sizes, screenshots next to the Paper exports, then an
independent reviewer per lens (design, copy and repetition, function). Animations load the Emil
skill first.

## Separate proposals (not in this plan)

- Recorded native audio for every word (better voice, has a cost).
- Handwriting recognition to grade the student's strokes.
</content>
</invoke>
