# Quickstart: validating Kanjy end to end

No unit tests (constitution I). Each slice is validated by running the real app and comparing
screens with the Paper exports.

## Setup

```bash
npm ci
npm run data      # downloads pinned sources into .cache/ and writes public/data/
npm run build     # must pass with zero type errors
npm run preview   # serves the production build
```

`npm run data` fails loudly if any of the 2,211 kanji lacks a Spanish meaning or a stroke file.

## Scenarios (run at 375 px and at 1280 px, headless browser, screenshots saved per slice)

1. **New visitor**: open `/` on a clean profile; the first-day page shows lesson 1 with 日 and
   «Empezar con 日»; a first review of real kanji starts in under 60 seconds (SC-003).
2. **Content**: open N1 in the index, scroll to the last lesson without stutter; open its last
   kanji; meaning, readings and stroke order show (SC-001, SC-002).
3. **Search**: type «agua», «みず», «mizu», «水» on N1; 水 is in the first results. Search «gato»
   on N5; 猫 shows its level, furigana and «Agregar 猫 a mis repasos».
4. **Review loop**: learn lesson 1, answer with two «Otra vez»; they return in the session;
   advance the clock one and four days; failed kanji come back first. «Repaso terminado» shows the
   count, minutes, the ones that cost, the week of stickers and tomorrow's tiles.
5. **Note**: write a note on 国; it shows on the kanji page, on the back of its review card and on
   the desktop page after a reload.
6. **Exam**: with no lesson selected the button is disabled; with lessons 1 and 2, each of the six
   modes runs with no repeated question and prompts that match; the result shows time per question
   and «+ Repasar» adds the missed kanji.
7. **Phrases**: lesson cards play sentences with the kanji highlighted; an N1 kanji with no
   sentence shows the empty card with words and writing practice.
8. **Sound**: on a phone with a Japanese voice, each play button reads the kana; with sound off in
   Cuenta no button plays.
9. **Account** (only after approval): guest with 30 learned kanji creates an account; a second
   browser signs in and sees the same due reviews (SC-005).

## Evidence

Screenshots per scenario next to the matching Paper export go to the Linear ticket NOE-559 with
independent reviewer scores (minimum 8 of 10 per screen, SC-006).
</content>
</invoke>
