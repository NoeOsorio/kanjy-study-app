# Research: Revive Kanjy

All numbers below were measured on 2026-11-18 by a script over the real downloads (scratch script
`m.py`, not committed); service facts come from the providers' pricing and docs pages linked.

## R1. Kanji data coverage for Spanish learners

Measured over the 2,211 kanji of the Waller lists (N5 79, N4 166, N3 367, N2 367, N1 1,232):

| Source | N5 | N4 | N3 | N2 | N1 | Total |
|---|---|---|---|---|---|---|
| KANJIDIC2, Spanish meaning | 79 | 166 | 367 | 367 | 1,232 | 100% |
| JMdict, common word with Spanish gloss | 79 | 166 | 367 | 366 | 994 | 89.2% |
| JMdict, any word with Spanish gloss | 79 | 166 | 367 | 367 | 1,165 | 97.0% |
| KanjiVG stroke SVG | 79 | 166 | 367 | 367 | 1,232 | 100% |
| Tatoeba ja-es sentence of 25 chars or less | 79 | 166 | 367 | 357 | 755 | 78.0% |

- **Decision**: levels from the Waller lists (taken from the `jlpt_new` field of
  davidluzgouveia/kanji-data, which reproduces them; only that field is read, nothing derived
  from WaniKani is shipped), meanings and frequency from KANJIDIC2 (CC BY-SA 4.0), words from
  JMdict with Spanish glosses (CC BY-SA 4.0), strokes from KanjiVG r20260714 (CC BY-SA 3.0),
  sentences from Tatoeba per-language exports jpn, spa and jpn-spa links (CC BY 2.0 FR).
- **Words rule**: up to five common words; if a kanji has no common word, fall back to any word
  with a Spanish gloss (covers 97%); otherwise the words section is absent (FR-004).
- **Sentences rule**: up to three sentences of 25 characters or less; the 487 kanji without one
  (N1 477, N2 10) show the «sin ejemplos» card. N5 to N3 have 100% coverage.
- **Quality**: coverage is not quality. The overrides file fixes meaning order; SC-004 has a
  reviewer check all 79 N5 first meanings, and N4 is spot-checked before release.
- **Alternatives rejected**: machine-translating English meanings (adds cost and errors, and
  KANJIDIC2 already covers 100%); WaniKani data (license forbids it).

## R2. Spaced repetition

- **Decision**: `ts-fsrs` 6.x (MIT, official open-spaced-repetition library). `preview()` returns
  the outcome of all four ratings before answering, which gives the intervals shown on the four
  buttons (Otra vez, Difícil, Bien, Fácil).
- **Note**: v6 needs Node 24 on the build side only; bundle size is checked when it is added.
- **Alternatives rejected**: SM-2 by hand (less accurate, custom code against Principle XI).

## R3. Sound

- **Decision**: browser `speechSynthesis` with a ja-JP voice; always speak the kana reading or the
  sentence, never a bare kanji (the engine guesses 日 as ひ or にち). Voices load async, so pick the
  voice on `voiceschanged`; `speak()` only from a tap. If the device has no Japanese voice the
  sound buttons are hidden, and the account toggle says nothing is available. Free, no account.
- **Risk**: voice availability per device is not verified; it is checked on a real iPhone and an
  Android phone in Step 7. If it fails there, recorded audio becomes its own proposal with cost.

## R4. Accounts and sync (needs Noe's yes)

| Option | Free tier | Works from a static site with only a public key | Email code and Google |
|---|---|---|---|
| Supabase (auth + Postgres) | 50,000 MAU, 500 MB DB, pauses after 7 idle days | yes, with row level security | email code yes; Google yes |
| WorkOS AuthKit + Neon or Turso | 1M MAU auth; DB separate | no: needs our own server to verify tokens and write the DB | magic code yes; Google to confirm |

- **Recommendation**: Supabase, the only option with no server of our own. Mitigation for pausing:
  a weekly keep-alive request from a scheduled GitHub Action. Storage: one row per student per
  studied kanji (about 150 bytes); 5,000 students with 300 kanji each is about 225 MB, inside the
  free tier; review history is kept on the device, only the card state syncs.
- **Noe proposed WorkOS**; it is a fine auth, but alone it cannot store progress, so it adds a
  server and a second service. The plan keeps sync behind one interface so either can be wired.

## R5. Hosting (needs Noe's yes to publish)

- **Decision**: Cloudflare Pages free tier: SPA fallback built in, no bandwidth cap on static
  files, no commercial-use ban. Vercel Hobby is non-commercial only; Netlify pauses sites when
  free credits run out.

## R6. Installable app

- **Decision**: `vite-plugin-pwa` 2.x (peer range includes Vite 7). Generated per-level JSON and
  stroke SVGs are cached on first use so a studied level works offline.

## R7. Current build failure (root cause)

`tsc -b` fails with two TS2554 errors in `src/pages/QuizPage.tsx` lines 21 and 22: React 19 types
require an initial value for `useRef`. The page is rebuilt in slice S4; the build is fixed first
in S0 so every slice can be verified on a green build.
</content>
</invoke>
