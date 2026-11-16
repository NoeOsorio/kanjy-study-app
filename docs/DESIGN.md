# Kanjy: sistema de diseño

Dirección aprobada en noviembre de 2026: una libreta de kanji (la 漢字ドリル con la que aprenden en Japón)
con el estilo visual de Essay Studio y papelería que cumple una función. Las maquetas viven en Paper,
archivo «Kanjy rediseño», página «Doriru», en los tableros que terminan en «(estilo Essay Studio)» y en
los de repaso, examen, estados, cuenta y créditos. Exportes en `docs/rediseno/doriru/es-*.png`.

## Reglas que mandan

1. **La interfaz es la libreta, a pantalla completa.** Nada de escritorio alrededor, marcos ni objetos
   flotando. La metáfora vive en los materiales: papel, hoja blanca, cuadrícula de práctica, sellos.
2. **Papelería solo si sirve para aprender.** Cada pieza tiene un trabajo (ver tabla). Si no ayuda a
   aprender o a orientarse, no va.
3. **Sin plantilla.** Sin barra de pestañas, sin encabezado con título repetido, sin pilas de tarjetas.
4. **Nada repetido en una pantalla, poco texto, sin numeración de adorno, sin punto medio «·».**
5. **Pensado para 2.211 kanji.** Lo terminado se pliega, lo no empezado se resume en una fila.
6. **Ninguna función actual se pierde** (constitución XIV). Ver `docs/rediseno/COBERTURA.md`.

## Colores

| Token | Valor | Uso |
|---|---|---|
| papel | `#FAF8F3` | fondo de la app |
| hoja | `#FFFFFF` | superficie principal (hoja con radio 14 arriba) |
| sombra | `#F1EEE6` | bandejas, chips neutros, paneles secundarios |
| tinta | `#1D1B18` | texto principal y único acento de acción (botón principal negro) |
| tinta 2 | `#4A463F` | texto secundario |
| tinta 3 | `#6B665C` | etiquetas pequeñas |
| sakura | `#FDF0F3` fondo, `#FBE4EA` chip, `#C2456A` y `#9E2A44` tinta | color de Kanjy: kanji grande, repaso, «Otra vez», frases |
| lectura china | `#CADDFF` / `#234A9C` | etiqueta «china» |
| lectura japonesa | `#BDEBD6` / `#0D5E46` | etiqueta «japonesa» |
| marcatextos | `#FFE08A` | resaltar el kanji dentro de una frase; nota propia |
| pluma roja | `#C8402F` | solo correcciones y 花丸 |
| niveles (solo selector y escritorio) | N4 `#FFE08A`, N3 `#BDEBD6`, N2 `#CADDFF`, N1 `#E3D5FF` | |

El color siempre significa algo. No se usa verde para «correcto»: lo correcto se marca con tinta y el
círculo rojo del maestro.

## Tipografía

- **Geist** para la interfaz (botones, etiquetas, números).
- **Newsreader** para el español con voz (significados, frases traducidas, mensajes).
- **Klee One** para todo kanji y kana grande, con aspecto de libro de texto.
- Tres familias con papeles fijos; ninguna otra.

## Formas y sombras

Radios 6, 8, 10, 12, 14 y 20 (tarjetas de repaso). Sombra de hoja:
`0 0 0 1px rgba(29,27,24,0.08), 0 18px 40px -12px rgba(60,45,10,0.16)`. Sin bordes finos como estructura:
las secciones se separan con espacio y superficies.

## Componentes (pocos y reutilizados)

- **Hoja:** superficie blanca bajo la barra, margen 8.
- **Bandeja:** fondo sombra, radio 14, contiene casillas blancas de radio 8.
- **Casilla de kanji:** aprendido en tinta, de hoy con anillo negro de 2 px, por aprender desvanecido.
- **Botón principal:** negro, radio 10 a 12, alto 52 a 54. Uno por pantalla.
- **Botón secundario:** blanco con anillo de 1 px.
- **Etiqueta:** pastel con tinta del mismo tono, radio 6.
- **Barra:** botón de volver o cerrar a la izquierda, contexto mínimo a la derecha.

## Papelería con función

| Pieza | Función |
|---|---|
| Stickers sakura | progreso del día y días de la semana, sin rachas que castigan |
| Nota propia (sticky) | mnemotecnia del estudiante, una por kanji, se puede mover |
| Marcatextos | el kanji estudiado dentro de una frase |
| 花丸 y círculo rojo | acierto y calificación del examen |
| Sello 済 | lecciones terminadas en el índice |
| Washi «Hoy» | la lección actual en el índice |
| Pestañas al borde (solo escritorio) | escribir, repasar (con pendientes), examen y notas |

## Pantallas

Celular: página de hoy, escribir, 花丸, índice (漢字表), selector de nivel, repaso frente y reverso,
repaso terminado, tarjetas de frases, examen preparar, examen pregunta, resultado, cuenta, créditos,
primer día, búsqueda fuera de nivel y cargando. Escritorio: índice a la izquierda y libreta a doble página.

## Movimiento

Antes de escribir cualquier animación se carga la skill de Emil. Pendiente de especificar: voltear la
tarjeta, 花丸 que se dibuja, sticker que cae en su lugar, presión de botones (escala 0.97).
