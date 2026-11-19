# UI contract: routes and screens

Each route maps to the approved Paper export it must match (`docs/rediseno/doriru/`).

| Route | Screen | Export |
|---|---|---|
| `/` | Today: first day if no progress, else the daily plan (due reviews, new kanji) | es-16, es-1 |
| `/indice` | 漢字表 index of the current level; level selector sheet | es-2, es-13 |
| `/kanji/:char` | Kanji page: tile, readings, chips, words, writing grid, sentence, note | es-1 |
| `/kanji/:char/escribir` | Writing practice and 花丸 | es-3, es-4 |
| `/repaso` | Review front and back, four buttons | es-8, es-9 |
| `/repaso/listo` | Review finished | es-12 |
| `/frases/:lesson` | Phrase cards; empty card when a kanji has no sentence | es-11, es-19 |
| `/examen` | Exam setup; disabled when nothing is selected | es-10, es-20 |
| `/examen/jugar` | Exam question (no letters on options) | es-5 |
| `/examen/resultado` | Result with 花丸, time per question, «+ Repasar» | es-6 |
| `/buscar?q=` | Search across levels, out-of-level card with furigana | es-17 |
| `/cuenta` | Name, minutes per day, writing, sound, credits link, sign out, delete | es-14 |
| `/creditos` | Data sources and licenses | es-15 |
| any unknown | Not found screen (never mock data) | same pattern as es-19 |
| loading state | Skeleton matching the page | es-18 |

Desktop (≥ 1024 px): index on the left and the notebook as a double page (es-7); the same routes.

## Shared components (from DESIGN.md)

Hoja, Bandeja, Casilla de kanji, Botón principal, Botón secundario, Etiqueta de lectura, Furigana,
Marcatextos, Washi «Hoy», Sello 済, Sticker sakura, 花丸 and red circle, Nota propia, Hoja de
respuestas (exam progress), Barra.

## Rules every screen keeps

No tab bar, no template header, one primary button, no sticky notes, no letters on quiz options,
no middle dot, furigana on kanji above the student's level, keyboard shortcuts only in tooltips.
</content>
</invoke>
