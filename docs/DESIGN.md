# Design System: Kanjy (Sakura)

Replaces the first «highlighter» direction (2026-11-14), which Noe found boring. Kanjy should feel like a
spring walk under cherry trees: warm, alive and a little playful, while staying fast to use every day.

## 1. Visual Theme & Atmosphere

A soft, blush-paper interface where learning literally makes a branch bloom. Density 4 («daily app
balanced»), variance 6 (offset hero, asymmetric branch illustration, regular grids where the content is a
grid), motion 6 (fluid, with one delightful moment per session, never in the way).

The metaphor carries meaning, it is not decoration:

- A kanji you have not studied is a **closed bud**.
- A kanji you learned is an **open blossom**.
- A kanji due for review today is a **blossom in full pink**: the strongest color on screen, because it is
  what you should do now.
- Each level is a **branch**. As you learn, it fills with flowers. That is the progress view.

## 2. Color Palette & Roles

- **Blush Paper** (#FFF7F8): app background, the color of light through petals.
- **Petal White** (#FFFFFF): raised surfaces (answer tiles, sheets, inputs).
- **Plum Ink** (#2B1F27): primary text and kanji. Never pure black.
- **Dusk Mauve** (#7A6872): secondary text, labels, readings in romaji.
- **Petal Mist** (#FCE8EE): learned-kanji tiles, chips, secondary buttons.
- **Bud Line** (#EBD9DF): outline of not-yet-studied kanji tiles; the only structural line.
- **Sakura** (#B84A73): the single accent for anything carrying text. Primary buttons, active tab,
  focus ring. White text on it passes 4.5:1.
- **Sakura Bloom** (#D45C88): the same accent, lighter, only for large kanji tiles due today (26px and
  up, where 3:1 is enough) and for petals in illustrations.
- **Branch Bark** (#6B4A3F): illustration only (branch strokes). Never text or UI.
- **Torii Vermilion** (#D64B3C): mistakes only (wrong answer tile, error text).

Semantic rule: pink means «do this now». A screen never has more than one pink-filled button.

## 3. Typography Rules

- **UI and display:** Outfit. Headlines 600 to 700, tracking -0.02em; labels 400 to 500.
- **Kanji and kana:** Zen Maru Gothic, a rounded Japanese face that feels friendly and stays legible at
  small sizes. Kanji hero 120 to 140px, lists 24 to 30px.
- **Scale:** 13, 15, 17, 20, 28, 40, 64 and the kanji hero size. Body never below 15px.
- **Banned:** Inter, generic serifs, all-caps paragraphs, gradient text.

## 4. Component Stylings

- **Primary button:** Sakura fill, Petal White text 17px/600, 56px tall, 18px radius. Press: scale 0.97
  in 140ms ease-out. No shadow, no glow.
- **Answer tiles:** the chosen correct answer turns Sakura (it blooms); when the answer was wrong, the
  correct tile turns Plum Ink and the chosen one turns vermilion. «Seguir» is always Sakura.
- **Library:** lessons of ten kanji in rows of five tiles at least 56px tall, each lesson with a small
  label; the student's current lesson label is Sakura.
- **Secondary button:** Petal Mist fill, Plum Ink text. Same size and press.
- **Kanji tile:** square, 14px radius. Due: Sakura fill, white kanji. Learned: Petal Mist fill, Plum Ink
  kanji. New: Petal White with 1.5px Bud Line outline, Dusk Mauve kanji.
- **Chips:** pill, Petal Mist; active chip Plum Ink fill. Status chips start with a tiny tile swatch so the
  filters double as the legend.
- **Sheets:** Petal White, 28px top radius, soft shadow tinted plum (0 -12px 32px rgba(43,31,39,0.08)).
- **Inputs:** label above, Petal White field, 1.5px Bud Line, focus ring Sakura.
- **Cards:** only the «Hoy» hero is a card (Petal Mist, 28px radius) because it holds the branch.
  Everything else lives directly on the background. No box inside a box.
- **Empty states:** a single closed bud illustration and one line; no explanations.

## 5. Layout Principles

- Phone first at 390px, 24px side gutter, single column. Tab bar with four items.
- Desktop: 1440px, sidebar 232px, content capped at 1200px. Hoy and the branch on the left, the level
  grid on the right; a kanji opens in a side panel instead of leaving the grid.
- Lists are built for 1,232 items: search, level switch, status filters, a dense grid where each row of
  ten is one lesson, and «Ir a mi lección».
- Touch targets at least 44px. No horizontal page scroll; chip rows scroll inside themselves.

## 6. Motion & Interaction

Load the Emil design engineering skill before writing any motion code.

- Press feedback on every pressable: scale 0.97, 140ms, cubic-bezier(0.23, 1, 0.32, 1).
- Correct answer: the tile blooms (scale 0.96 to 1, Petal Mist to Sakura, 220ms ease-out) and three
  petals drift off it (transform and opacity only, 700ms). Rare, celebratory, never blocks «Seguir».
- Wrong answer: the tile shakes 4px twice in 180ms and turns vermilion; the correct one fills plum.
- End of a review session: petals fall across the branch for 1.2s; the newly learned blossoms open in a
  40ms stagger.
- Hoy hero: two or three petals drift slowly across the card (linear, 12s loop). Paused under
  prefers-reduced-motion, which keeps only opacity changes.
- No animation on keyboard-triggered actions, tab switches or list scrolling.

## 7. Anti-Patterns (Banned)

- No middle dot «·» as a separator. No numbering for its own sake. No cartoon names.
- No colored bar on the left edge of anything. No nested bordered boxes. No hairline dividers.
- No repeated information on one screen. Shortcuts only in tooltips.
- No vendor names in the UI (only the sign-in choice may say Google).
- No emojis, no neon glows, no pure black, no purple, no gradient text, no confetti outside the end of a
  session, no mascots that talk.
- No invented words: say «por repasar», «aprendidos», «nuevos», never «capullos por abrir».
