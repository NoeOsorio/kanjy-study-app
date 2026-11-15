# Design System: Kanjy (Camino)

Chosen by Noe on 2026-11-14 from three generated concepts (`docs/rediseno/conceptos/concepto-b-camino.jpg`).
Replaces «marcatextos» and «sakura plano», both rejected as boring or basic. References: Duolingo
(game, celebration), Headspace or Finch (warm illustration), Apple Fitness (progress you can feel).

**Rule zero (constitution XIV):** every feature in `docs/rediseno/COBERTURA.md` has a screen. Nothing is
removed without Noe's explicit yes.

## 1. Visual Theme & Atmosphere

A playful, gamified study app. Each JLPT level is a mountain; its lessons are chunky round nodes on a
winding path that climbs to a torii gate under cherry trees. A small blossom character, **Kanjy**, walks the
path with the student, reacts to answers and celebrates. Density 4, variance 6, motion 7: bouncy and
celebratory, never in the way of answering.

## 2. Color Palette & Roles

- **Cloud White** (#FFFFFF): screen background for study screens.
- **Sky** (#BFE6FF to #E9F6FF gradient): background of the path screen only.
- **Plum Ink** (#2B1F27): text and kanji. Never pure black.
- **Mauve** (#6E5A66): secondary text.
- **Sakura** (#FF5C93) with **Sakura Deep** (#D63B74) as its 3D bottom edge: the main action, completed
  nodes, active tab. One accent.
- **Leaf** (#58C25A) with **Leaf Deep** (#3E9A41): correct answers and success only.
- **Torii Red** (#E5483B) with **Torii Deep** (#B8322A): wrong answers only, and the torii illustration.
- **Sun** (#FFC83D): stars on completed nodes, streak flame.
- **Stone** (#E6E1E5) with **Stone Deep** (#C9C1C7): locked or not-yet nodes, secondary chunky buttons.
- **Mountain** (#7C8DA8 to #A9B6CB), **Grass** (#8BCB6A), **Path** (#F3E3C3): illustration only.

## 3. Typography Rules

- **UI:** Nunito. Titles 800 to 900, buttons 800, body 600. Rounded and friendly.
- **Kanji and kana:** M PLUS Rounded 1c, 700 to 800.
- Scale: 13, 15, 17, 20, 26, 34, 56, and 120 for the hero kanji. Body never below 15px.

## 4. Component Stylings

- **Chunky button:** 56px tall, 16px radius, fill color plus a 5px solid bottom edge in the deep shade
  (box-shadow 0 5px 0 deep). Text Nunito 800, 17px, uppercase allowed only for short labels. Press: moves
  down 5px and the edge disappears (100ms). Primary Sakura, success Leaf, secondary White with Stone edge.
- **Path node:** 72px circle with a 6px deep bottom edge. Completed: Sakura with a Sun star badge. Current:
  Sakura with a white ring and the mascot next to it. Due for review: Sakura with a small flame badge.
  Locked: Stone with a lock.
- **Answer tile:** white, 2px Stone border, 5px Stone bottom edge, 20px radius. Selected correct: Leaf.
  Selected wrong: Torii Red; the correct one then turns Leaf.
- **Kanji tile (library):** 56px or larger, same chunky edge. Learned: Sakura tint (#FFE3EE) with Sakura
  border; due: Sakura fill, white kanji; new: white with Stone border.
- **Feedback banner:** full-width bottom sheet. Correct: Leaf tint (#E5F7DF), title in Leaf Deep, Leaf
  button, mascot cheering. Wrong: Torii tint (#FDE3E0), title in Torii Deep, Torii button, mascot thinking.
- **Progress bar:** 16px tall, rounded, Stone track, Sakura fill with a small blossom at its tip.
- **Mascot Kanjy:** round five-petal blossom, pink (#FF8FB5) with a deeper outline (#E5608F), face in the
  center (two dark eyes with white highlights, small smile, blush cheeks), tiny arms. Moods: happy, cheering
  (arms up, confetti petals), thinking (hand on chin), sleepy (empty states). Original character, never a
  copy of another brand's mascot.
- **Tab bar:** white, four items (Hoy, Kanji, Quiz, Cuenta), active item in Sakura with a filled icon.

## 5. Layout Principles

- Phone first at 390px with 20px gutters; desktop 1440px with a left sidebar and content capped at 1200px.
- The path screen is the home; everything else is white and calm so the kanji stay readable.
- Lists hold 1,232 kanji: search, level switch, status filters, lessons in rows of five tiles.
- Touch targets at least 44px. Keyboard shortcuts on desktop live in tooltips only.

## 6. Motion & Interaction

Load the Emil design engineering skill before writing motion code.

- Chunky press: translateY(5px) and edge to 0, 100ms ease-out; release 140ms.
- Correct: tile turns Leaf with a 1.0 to 1.06 to 1.0 pop (220ms), petals burst, mascot jumps.
- Wrong: tile shakes 6px twice (200ms) and turns Torii Red; mascot tilts its head.
- Path: the current node bobs 4px (2s loop); finishing a lesson fills the next node with a star burst.
- Session end: confetti petals for 1.2s, streak flame grows.
- Respect prefers-reduced-motion: keep color changes, drop movement.

## 7. Anti-Patterns (Banned)

- No middle dot «·» as a separator. No numbering for its own sake. No cartoon names for features.
- No colored bar on the left edge of anything. No nested bordered boxes. No hairline dividers.
- No repeated information on one screen. Shortcuts only in tooltips.
- No vendor names in the UI (only the sign-in choice may say Google).
- No emojis as icons. No pure black. No neon glow. No copied mascots or brand assets.
- No invented words: «por repasar», «aprendidos», «nuevos», «lección», plain Spanish.
