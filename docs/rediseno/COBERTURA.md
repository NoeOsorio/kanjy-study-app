# Cobertura de funciones del rediseño (Camino)

Regla (constitución XIV): ninguna función actual se pierde. Inventario leído del código el 2026-11-14 y
revisado por un revisor independiente contra las maquetas. Las pantallas están en Paper, página
«Camino celular», y exportadas en `docs/rediseno/camino/`.

## Inicio

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Estudiar lecciones | Hoy (camino de lecciones), Kanji, Detalle de lección | cubierta |
| Hacer quizzes (lecciones y modo) | Quiz: elegir lecciones, Quiz: elegir modo | cubierta |
| Quiz rápido (todos los tipos) | Quiz: elegir lecciones, banner «Quiz rápido» | cubierta |
| Animación al presionar | Todos los botones gruesos (DESIGN.md, movimiento) | cubierta |
| Texto «¿Cómo funciona?» | Hoy primer día y su hoja «¿Cómo funciona?» | cubierta |

## Lecciones

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Lista de lecciones | Kanji (agrupada por lección, cabecera tocable) | cubierta |
| Filtro por nivel N5 a N1 | Kanji (selector de nivel) y Hoy (selector N5) | cubierta |
| Título y descripción | Detalle de lección | cubierta |
| Dificultad, tiempo estimado, número de kanji | Cabecera de cada lección en Kanji y Detalle de lección | cubierta |
| Estado y progreso | Detalle de lección (barra y «3 de 10 aprendidos»), lección actual marcada en Kanji | cubierta |
| Estado de carga | Cargando | cubierta |

## Detalle de lección

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Progreso de la lección | Detalle de lección | cubierta |
| Modo estudio con tarjetas | Detalle de lección, «Estudiar con tarjetas» | cubierta |
| Kanji con significado, lecturas y trazos | Detalle de lección (ambas lecturas con etiqueta) | cubierta |
| Entrada escalonada | DESIGN.md, movimiento | cubierta en especificación |
| Quiz de la lección (nuevo) | Detalle de lección | cubierta |

## Modo estudio con tarjetas

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Mazo de frases de ejemplo | Tarjetas de ejemplos (frente) | cubierta |
| Voltear: frase y romaji, luego traducción | Tarjetas frente y reverso | cubierta |
| Anterior y siguiente, deslizar, flechas, espacio, Esc | Tarjetas (botones; atajos en tooltip de escritorio) | cubierta |
| Progreso del mazo | Tarjetas, barra | cubierta |
| Dificultad de cada frase | Tarjetas frente | cubierta |
| Sin ejemplos | Lección sin frases | cubierta |
| Practicar las frases de un solo kanji | Ficha de kanji, «Practicar con tarjetas» | cubierta |

## Ficha de kanji

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Kanji grande, significado, nivel, trazos | Ficha de kanji | cubierta |
| Todas las lecturas chinas y japonesas | Ficha de kanji (fichas de lectura que se acomodan) | cubierta |
| Trazos, frecuencia, grado escolar | Ficha de kanji, «Información» | cubierta |
| Dificultad del kanji | Ficha de kanji, junto a N5 | cubierta |
| Práctica de escritura con guía, deshacer y limpiar | Práctica de trazo | cubierta |
| Frases de ejemplo con kanji resaltado, romaji, traducción y dificultad | Ficha de kanji | cubierta |
| Kanji no encontrado | Kanji no encontrado | cubierta |
| Orden de trazos, palabras, estado de repaso (nuevos) | Ficha de kanji, Práctica de trazo | cubierta |

## Quiz

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Elegir una o varias lecciones, seleccionar todas, descripción | Quiz: elegir lecciones | cubierta |
| Seis modos | Quiz: elegir modo | cubierta |
| Consejo de qué modo usar | Quiz: elegir modo (una línea con la mascota) | cubierta |
| Pregunta con 4 opciones, en cada tipo de modo | Quiz: pregunta (significado), pregunta (lectura), pregunta (significado a kanji) | cubierta |
| Teclas 1 a 4, espacio, Esc | Tooltips en escritorio (nombres de capa) | cubierta en especificación |
| Acierto y error con la respuesta correcta | Quiz: acierto, Quiz: error | cubierta |
| Progreso y cerrar | Quiz: pregunta | cubierta |
| Tiempo por pregunta | Quiz: resultados | cubierta |
| Sin preguntas para el modo | Quiz sin preguntas | cubierta |

## Resultados del quiz

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Porcentaje con color por nivel, modo del quiz | Quiz: resultados | cubierta |
| Aciertos de N, tiempo promedio | Quiz: resultados | cubierta |
| Resumen por pregunta con tu respuesta | Quiz: resultados | cubierta |
| Intentar de nuevo (mismas lecciones y modo), volver | Quiz: resultados | cubierta |
| Mensaje de ánimo según el resultado | Quiz: resultados, Repaso terminado | cubierta |

## Piezas que no se usaban

| Pieza | Pantalla nueva | Estado |
|---|---|---|
| Mascota con 4 ánimos | Componentes; Hoy, quiz, tarjetas, estados vacíos, cuenta | cubierta (Noe eligió el concepto con mascota) |
| Tarjeta de kanji que se voltea | Detalle de lección (toca y abre la ficha) | cubierta |
| Perfil sin ruta | Cuenta (invitado y con sesión) | cubierta |

## Nuevas por la spec

| Función | Pantalla |
|---|---|
| Repaso diario con camino y racha | Hoy, Repaso terminado |
| Primer día y nada por repasar | Hoy primer día |
| Cuenta, sincronización, borrar cuenta | Cuenta (invitado), Cuenta (con sesión) |
| Créditos de los datos | De dónde salen los kanji |
| Escritorio | Hoy (escritorio) |
