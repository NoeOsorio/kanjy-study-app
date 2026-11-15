# Cobertura de funciones del rediseño

Regla (constitución XIV): ninguna función actual se pierde. Cada fila dice dónde vive en el rediseño.
Inventario leído del código el 2026-11-14. Estado: **cubierta**, **falta maquetar** o **pide decisión de Noe**.

## Inicio

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Estudiar lecciones | Hoy, «Empezar lección», y pestaña Kanji | cubierta |
| Hacer quizzes (lecciones y modo) | Pestaña Quiz | falta maquetar |
| Quiz rápido (todos los tipos) | Pestaña Quiz, botón principal | falta maquetar |
| Animación al presionar tarjetas | Todos los botones (escala 0.97) | cubierta en DESIGN.md |
| Texto «¿Cómo funciona?» | Primer uso de Hoy (estado del día 1) | falta maquetar |

## Lecciones

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Lista de lecciones | Kanji, agrupada por lección | cubierta |
| Filtro por nivel N5 a N1 | Kanji, selector de nivel | cubierta |
| Tarjeta con título y descripción | Detalle de lección | falta maquetar |
| Dificultad, tiempo estimado, número de kanji | Detalle de lección | falta maquetar |
| Estado completada o pendiente, progreso | Detalle de lección y etiqueta de lección en Kanji | falta maquetar |
| Estado de carga | Esqueleto de la cuadrícula | falta maquetar |

## Detalle de lección

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Progreso de la lección (barra y contador) | Detalle de lección | falta maquetar |
| Modo estudio con tarjetas (botón) | Detalle de lección | falta maquetar |
| Cuadrícula de kanji con significado, lectura y trazos | Detalle de lección | falta maquetar |
| Entrada escalonada de los kanji | Detalle de lección (animación) | falta maquetar |

## Modo estudio con tarjetas (ejemplos)

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Mazo de frases de ejemplo de la lección | Tarjetas de ejemplos | falta maquetar |
| Tarjeta que se voltea: frase y romaji, luego traducción | Tarjetas de ejemplos | falta maquetar |
| Anterior y siguiente, deslizar, flechas, espacio, Esc | Tarjetas de ejemplos (atajos en tooltip) | falta maquetar |
| Progreso del mazo | Tarjetas de ejemplos | falta maquetar |
| Dificultad de cada frase | Tarjetas de ejemplos | falta maquetar |
| Sin ejemplos: aviso y volver | Estado vacío de tarjetas | falta maquetar |

## Ficha de kanji

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Kanji grande, significado, nivel y trazos | Ficha | cubierta |
| Todas las lecturas chinas y japonesas (pestañas) | Ficha, con todas las lecturas | falta (hoy solo una de cada) |
| Información: trazos, frecuencia, grado escolar | Ficha | falta maquetar |
| Práctica de escritura con guía, cuadrícula, deshacer y limpiar | Práctica de trazo | falta maquetar |
| Frases de ejemplo con el kanji resaltado y traducción | Ficha | falta maquetar |
| Botón Practicar (tarjetas de este kanji) | Ficha | falta maquetar |
| Kanji no encontrado | Estado vacío de ficha | falta maquetar |
| Orden de trazos (nuevo) | Ficha | cubierta |
| Palabras con este kanji (nuevo) | Ficha | cubierta |

## Quiz

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Elegir una o varias lecciones, seleccionar todas | Quiz, paso 1 | falta maquetar |
| Seis modos: kanji a significado, kanji a lectura china, significado a kanji, lectura china a kanji, lectura japonesa a kanji, mixto | Quiz, paso 2 | falta maquetar |
| Consejo de qué modo usar | Quiz, paso 2 | falta maquetar |
| Pregunta con 4 opciones | Repaso: pregunta | cubierta (falta mostrar cada modo) |
| Teclas 1 a 4, espacio, Esc | Repaso (en tooltip, escritorio) | falta indicarlo |
| Acierto e error con la respuesta correcta | Repaso: acierto y error | cubierta |
| Progreso «pregunta i de N» | Repaso, barra | cubierta |
| Cerrar el quiz | Repaso, botón cerrar | cubierta |
| Tiempo por pregunta | Resultados | falta maquetar |

## Resultados del quiz

| Función actual | Pantalla nueva | Estado |
|---|---|---|
| Porcentaje con color por nivel y aciertos de N | Resultados | falta maquetar |
| Tiempo promedio y precisión | Resultados | falta maquetar |
| Resumen por pregunta | Resultados (con la pregunta y tu respuesta) | falta maquetar |
| Intentar de nuevo, volver a práctica | Resultados | falta maquetar |

## Piezas en el código que no se usaban

| Pieza | Propuesta | Estado |
|---|---|---|
| Mascota con 4 ánimos (feliz, emocionada, pensando, celebrando) | Traerla de vuelta como personaje de Kanjy (estilo Duolingo o Finch) | pide decisión de Noe |
| Mensajes de ánimo según el resultado | Resultados y Repaso terminado | falta maquetar |
| Tarjeta de kanji que se voltea | Detalle de lección | falta maquetar |
| Perfil (sin ruta) | Cuenta | cubierta |
