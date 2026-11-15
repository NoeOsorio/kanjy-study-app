# Brief común para maquetar Kanjy (estilo Camino) en Paper

Read this whole file before touching Paper.

## Where

- Paper file id: `01M7E4X9A9M27JNJJ070PRDD7E` («Kanjy rediseño»). Page «Camino celular», page id `p-6-0`.
  Always pass `fileId` and `pageId` explicitly. Never touch other pages or other agents' artboards.
- First load the Paper tools with ToolSearch (query "Paper", max_results 30), then call
  `get_guide({topic:"paper-mcp-instructions"})` once and follow it (small write_html calls, screenshot
  review after each section, `height: fit-content` when content clips, `finish_working_on_nodes` at the end).
- Design system: `/Users/noe/Dev/Web/kanjy-noe-559/docs/DESIGN.md` (read it). Feature coverage that must
  be visible: `/Users/noe/Dev/Web/kanjy-noe-559/docs/rediseno/COBERTURA.md`.
- Reference concept image: `/Users/noe/Dev/Web/kanjy-noe-559/docs/rediseno/conceptos/concepto-b-camino.jpg`.

## Reusable nodes (clone with `<x-paper-clone node-id="..." style="..."/>`)

| Node id | What |
|---|---|
| `D-0` | iOS status bar (paste as first child of every phone artboard) |
| `1QW-0` | Mascot SVG, happy (96px; set width/height in style to resize) |
| `1RG-0` | Mascot SVG, cheering (arms up) |
| `1S1-0` | Mascot SVG, thinking |
| `1SL-0` | Mascot SVG, sleepy (empty states) |
| `1T4-0` | Chunky primary button (Sakura) |
| `1T6-0` | Chunky success button (Leaf) |
| `1T8-0` | Chunky error button (Torii red) |
| `1TA-0` | Chunky secondary button (white) |
| `1TD-0`, `1TH-0`, `1TM-0`, `1TP-0` | Path nodes: completed, due, current, locked |
| `1TU-0`, `1TW-0`, `1TY-0` | Answer tiles: neutral, correct, wrong |
| `1U0-0`, `1U2-0`, `1U4-0` | Kanji tiles: learned, due, new |
| `1U6-0` | Progress bar |
| `1XP-0` | Tab bar (Hoy active). For another active tab, recolor icon and label: active `#FF5C93` weight 900, inactive `#A99FA6` |
| `1U9-0` | Finished «Hoy» screen, for style reference (do not edit) |

After cloning, change text with `set_text_content` and styles with `update_styles`.

## Visual rules

- Phone artboards: 390 x 844, background `#FFFFFF` (study screens), fonts Nunito (UI, 800 to 900 for
  titles and buttons, 600 to 700 body) and 'M PLUS Rounded 1c' (kanji and kana, 700 to 800).
- Chunky style everywhere: fills with a solid darker bottom edge (box-shadow 0 5px 0 deep color), 16 to 20px
  radius. Ink `#2B1F27`, mauve `#6E5A66`, stone `#E6E1E5`/`#C9C1C7`, sakura `#FF5C93`/`#D63B74`, tint
  `#FFE3EE`, leaf `#58C25A`/`#3E9A41`/`#E5F7DF`, torii `#E5483B`/`#B8322A`/`#FDE3E0`, sun `#FFC83D`.
- The mascot appears where it adds warmth (results, feedback, empty states, first day), small, never
  covering content.
- Use real data. N5 kanji in frequency order: 日一国人年大十二本中 (lesson 1, learned), 長出三時行見月後前生
  (lesson 2, current), 五間上東四今金九入学 (lesson 3). 水 = agua, スイ (sui), みず (mizu), 4 strokes,
  grade 1; words 水曜日 すいようび miércoles, 水道 すいどう agua corriente, 海水 かいすい agua de mar.
  Example sentence: 水を飲みます。 «Mizu o nomimasu.» «Bebo agua.»

## Mandatory rules from Noe (any violation fails review)

- Never the middle dot «·» as a separator. No numbering for its own sake (no «Paso 1»). No cartoon names.
- No colored bar on the left edge of anything. No box inside a box inside a card. No hairline dividers.
- No repeated information on one screen. Keyboard shortcuts never as visible text (mention in a layer name
  «tooltip» if needed, not on screen).
- Plain natural Spanish, few words, no explanations of the obvious. No vendor names except «Continuar con
  Google».
- Every feature listed for your screens below must be visible. Do not drop anything.

## When you finish

Screenshot every artboard you made, fix issues (two passes max), call `finish_working_on_nodes` with your
artboard ids, and reply with: the artboard names and ids, which COBERTURA rows each one covers, and anything
you could not include.
