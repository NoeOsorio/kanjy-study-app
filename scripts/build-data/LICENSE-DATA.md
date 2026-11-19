# Licenses of the generated data

The code of this repository is MIT. The files in `public/data/` are generated from the open sources
below and keep their licenses. Any copy or derivative of them must keep the attribution and, where
the license says so, be shared under the same terms. The app shows this list on its credits page.

| Source | What we take | Author | License |
|---|---|---|---|
| KANJIDIC2 | Spanish meanings, onyomi and kunyomi, stroke count, school grade, frequency | Electronic Dictionary Research and Development Group (EDRDG), Jim Breen | CC BY-SA 4.0, https://www.edrdg.org/edrdg/licence.html |
| JMdict | Words, readings and Spanish glosses | EDRDG, with the Spanish glosses by the JMdict translators | CC BY-SA 4.0, https://www.edrdg.org/edrdg/licence.html |
| KanjiVG r20260714 | Stroke order drawings (SVG) | Ulrich Apel and contributors | CC BY-SA 3.0, https://creativecommons.org/licenses/by-sa/3.0/ , https://kanjivg.tagaini.net |
| Tatoeba | Japanese sentences and their Spanish translations (jpn_sentences, spa_sentences, jpn-spa_links) | Tatoeba contributors | CC BY 2.0 FR, https://creativecommons.org/licenses/by/2.0/fr/ , https://tatoeba.org |
| JLPT kanji lists (Waller) | Which kanji belong to N5, N4, N3, N2 and N1, read only from the `jlpt_new` field of davidluzgouveia/kanji-data | Jonathan Waller (tanos.co.uk); file compiled by David Gouveia | Repository MIT; lists published by their author for study use |
| kuromoji with IPAdic | Kana readings of the example sentences, computed at build time, nothing from it is shipped | Atilika, ICOT, NAIST | Apache 2.0 (kuromoji), IPAdic license |

Notes

- The JLPT stopped publishing official kanji lists in 2010. The levels in this app come from an
  unofficial list and can differ from other sources; the app labels them that way.
- Nothing derived from WaniKani is read or shipped. The kanji-data file contains WaniKani fields;
  the build reads only `jlpt_new` and ignores the rest.
- Spanish example sentences for the first N5 kanji and the everyday first meanings of the N5 kanji
  are our own work (`scripts/build-data/overrides.json`) and follow the license of the generated data.
- Sentences from Tatoeba carry the names of their contributors on https://tatoeba.org; the credits
  page links there.
- Pinned versions and checksums are in `scripts/build-data/sources.json`.
