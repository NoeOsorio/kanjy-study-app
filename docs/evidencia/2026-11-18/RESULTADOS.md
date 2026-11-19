# Resultados de los escenarios de quickstart.md (T031)

Fecha: 2026-11-18. Compilación de producción servida con `vite preview` en el puerto 4180. Navegador Chromium headless con Playwright 1.49.1, un contexto limpio por escenario, a 375x812 (móvil, con pantalla táctil) y a 1280x900. Todo se hizo tocando la interfaz como un estudiante (primer día, Empezar, trazos con el mouse, índice, búsqueda tecleando, repasos con el reloj adelantado con `clock.fastForward`, examen completo). Sin cambios de código. Las capturas están en esta carpeta con el nombre `<escenario>-<paso>-<375|1280>.png` (e1 es el escenario 1, e2 el 2, etc.).

El escenario 9 (cuenta) queda fuera por indicación. En el escenario 8 el sonido no se puede oír sin interfaz gráfica, solo se comprobó cuándo aparecen los botones de reproducir.

Resumen

| Escenario | 375 | 1280 |
| --- | --- | --- |
| 1 Visitante nuevo | pasa | pasa |
| 2 Contenido | pasa | pasa |
| 3 Búsqueda | pasa | pasa |
| 4 Ciclo de repaso | pasa, con una diferencia de texto | pasa, con una diferencia de texto y un fallo de diseño en la escritura |
| 5 Nota | pasa | pasa |
| 6 Examen | pasa | pasa |
| 7 Frases | falla en un punto (sin entrada desde la interfaz), el contenido pasa | igual |
| 8 Sonido | pasa | pasa |

## 1 Visitante nuevo

Pasa en los dos tamaños. En `/` con perfil limpio aparece «Tus primeros kanji», la lección 1 con 日 y el botón «Empezar con 日». Medido en red local sin límite:

- Primer contenido en pantalla: 444 ms a 375 y 453 ms a 1280.
- Escribir 日 con cuatro trazos del mouse y ver el sello: 6,1 s a 375 y 6,3 s a 1280 desde que se abre la página (el límite era 60 s).
- Primera carga de `/` con la red limitada a Fast 4G (9 Mbps de bajada, 1,5 Mbps de subida, 170 ms de latencia, caché vacía), tres corridas por tamaño: el título y el botón aparecen a los 0,89, 0,84 y 0,82 s a 375, y a los 0,80, 0,78 y 0,78 s a 1280. Primer pintado de contenido entre 0,83 y 1,02 s a 375 y entre 0,55 y 0,62 s a 1280. Se transfieren 206 KB en 5 recursos. Captura: `e1-carga-fast4g-375.png` y `e1-carga-fast4g-1280.png`.

Capturas: `e1-primer-dia`, `e1-kanji-nuevo`, `e1-escribir-vacio`, `e1-escribir-hecho`, `e1-siguiente`.

## 2 Contenido

Pasa en los dos tamaños. Se abrió N1 desde el selector de nivel y se bajó hasta el final (123 lecciones, 21.220 px de alto en el móvil).

- Tiempo total del recorrido hasta el fondo: 1,44 s a 375 y 1,47 s a 1280.
- Tareas largas (PerformanceObserver longtask) de más de 100 ms: ninguna. A 375 no hubo tareas largas; a 1280 hubo una de 54 ms.
- Fotograma más lento durante el recorrido: 24 ms a 375 y 21 ms a 1280, ninguno mayor a 100 ms.
- Se abrió el último kanji de la última lección (麟, lección 123): muestran significado («unicornio chino»), lectura china, 24 trazos, palabra, frase y el orden de los trazos. A 1280 el orden de trazos sale desplegado en una tira de 24 casillas. A 375 hay que tocar el botón de reproducir de la casilla grande, y se dibuja trazo por trazo (`e2-trazos-animando-375.png`).

Capturas: `e2-n1-arriba`, `e2-n1-abajo`, `e2-ultimo-kanji`, `e2-trazos-animando`.

## 3 Búsqueda

Pasa en los dos tamaños. Tecleando letra por letra en N1:

- «agua»: 水 es el primer resultado.
- «みず»: 水 es el primer resultado.
- «mizu»: 水 es el primer resultado.
- «水»: 水 es el único resultado. Tocar el resultado abre `/kanji/水`.
- En N5, «gato»: aparece «No está en N5, pero sí en N3.» con 猫, significado, lecturas, frase con furigana y el botón «Agregar 猫 a mis repasos». Al tocarlo cambia a «Está en tus repasos».

Capturas: `e3-n1-agua`, `e3-n1-kana`, `e3-n1-mizu`, `e3-n1-kanji`, `e3-n1-abrir-agua`, `e3-n5-gato`, `e3-n5-gato-agregado`.

Detalle menor (no bloquea): en la pantalla de búsqueda a 375, el botón del nivel lleva al índice pero no abre el selector de niveles, hay que tocar otra vez. A 1280 el selector sí se abre. Captura: `e3-buscar-cambiar-nivel-375.png`.

## 4 Ciclo de repaso

Pasa en los dos tamaños. Se aprendió la lección 1 completa (10 kanji, 日 a 中) escribiéndolos con trazos del mouse desde «Empezar con 日», sin navegar por URL dentro de la lección.

- Después de escribir los 10, «Tu próximo repaso es hoy a las 20:12» (10 minutos después). Con el reloj adelantado 20 minutos empieza el repaso con las 10 tarjetas.
- Se respondió «Otra vez» a 日 y 一. Reaparecieron en la misma sesión tres tarjetas más adelante. Orden visto: 日, 一, 国, 人, 日, 一, 年, 大, 十, 二, 本, 中.
- Un día después (reloj +24 h): vuelven primero y solos 日 y 一 (los que fallaron), las otras 8 no vencen todavía.
- Cuatro días después de eso (reloj +4 días): en la variante donde ese día sí se repasó, 日 y 一 salen al final (los otros 8 primero), porque ya se habían repasado y vencen más tarde. En la variante donde no se repasó el día 1, 日 y 一 salen primero. Es el orden esperado de FSRS (por fecha de vencimiento), pero si el texto del spec «los fallados vuelven primero» se leyera para el día 5, no se cumple en la primera variante. Capturas: `e4-dia1-*`, `e4-dia5-*` y `e4b-dia5B-*`.
- La pantalla final muestra la cantidad (10), los minutos («1 minuto»), «2 te costaron», la semana de stickers y los kanji de mañana («2 repasos», 一 y 日).

Diferencia de texto con el spec: el spec dice «Repaso terminado», la pantalla dice «Listo por hoy». Captura: `e4-listo-375.png` y `e4-listo-1280.png`.

Fallo de diseño a 1280x900: la pizarra de escritura es cuadrada y ocupa todo el ancho del panel (unos 840 px de alto), así que debajo de la altura de la ventana quedan la mitad inferior de la pizarra, los botones de deshacer, borrar y guía, y «Siguiente». Hay que desplazar el panel mientras se escribe. Ruta `/kanji/日/escribir`. Captura: `e4-escribir-tablero-desborda-1280.png`. Para poder completar el escenario, los trazos a 1280 se dibujaron en la parte visible de la pizarra.

Capturas: `e4-escribiendo-人`, `e4-leccion-terminada`, `e4-hoy-despues`, `e4-primer-repaso-frente`, `e4-primer-repaso-reverso`, `e4-otra-vez-segunda`, `e4-listo`.

## 5 Nota

Pasa en los dos tamaños. Desde el índice se abrió 国, se escribió una nota con el teclado y se guardó al tocar fuera. La nota se ve en: la página del kanji, la pantalla de escribir de memoria, la página del kanji tras recargarla (a 1280 es la página de escritorio) y el reverso de la tarjeta de repaso cuando 国 vence.

Capturas: `e5-kanji-sin-nota`, `e5-escribiendo-nota`, `e5-kanji-con-nota`, `e5-escribir-con-nota`, `e5-kanji-tras-recargar`, `e5-repaso-reverso`.

## 6 Examen

Pasa en los dos tamaños.

- Sin lección seleccionada el botón está deshabilitado y dice «Elige al menos una lección» (`e6-sin-seleccion`).
- Con las lecciones 1 y 2 («Empezar con 20 kanji»), se corrieron los seis modos completos: Significado, Kanji, Lectura, Por lectura, Palabras y Mezcla. En todos: 20 preguntas, ninguna repetida, 20 kanji distintos en la hoja de respuestas, ninguna opción repetida dentro de una pregunta, y el aviso coincide con lo que se muestra y con las opciones (por ejemplo, «¿Cómo se lee esta palabra?» con una palabra escrita y opciones en kana). En Mezcla aparecen los cinco avisos.
- El resultado muestra el puntaje, el tiempo medio por pregunta en la barra (1 s, respondiendo rápido) y el tiempo de cada fallada. «+ Repasar» agrega el kanji fallado: la cantidad de botones baja en uno y esa fila cambia a «En tus repasos».

Capturas: `e6-preparar-inicial`, `e6-dos-lecciones`, `e6-pregunta-*`, `e6-respuesta-*`, `e6-resultado-significado`, `e6-resultado-repasar`, `e6-resultado-mezcla`.

## 7 Frases

El contenido pasa pero el escenario falla por la entrada: no hay ningún enlace ni botón en el índice ni en la página de un kanji que lleve a `/frases/:lección`. Se llegó escribiendo la URL.

- N5 lección 1 (`/frases/1`): 30 tarjetas distintas, cada frase con el kanji resaltado en amarillo, furigana, lectura, palabras y «Significa». «Terminar» lleva a `/indice`.
- N1, kanji 拡 (lección 8, sin frases): la tarjeta vacía dice «Todavía no hay frases con este kanji.», muestra «Lo ves en estas palabras» con tres palabras y el enlace de práctica de escritura («Escribir el kanji»), que abre `/kanji/拡/escribir`.
- Sin voz japonesa no aparecen los botones de escuchar.

Capturas: `e7-n5-frase`, `e7-n5-ultima-tarjeta`, `e7-n1-kanji-sin-frase`, `e7-n1-tarjeta-vacia`.

## 8 Sonido

Pasa en los dos tamaños, solo la parte de botones. Esta Mac sí tiene voces japonesas, así que se simuló un dispositivo sin ninguna voz.

- Sin voz: cero botones «Escuchar» en la página del kanji y en las frases; en Cuenta el interruptor de sonido sale deshabilitado con «Este dispositivo no tiene voz en japonés.».
- Con voz japonesa: la página de 日 muestra 4 botones de escuchar (tres palabras y una frase).
- Con el sonido apagado en Cuenta: vuelven a ser cero.

Capturas: `e8-kanji-sin-voz`, `e8-cuenta-sin-voz`, `e8-kanji-con-voz`, `e8-cuenta-sonido-apagado`, `e8-kanji-sonido-apagado`.

## Cosas que confunden a un estudiante

- En el móvil, la pantalla del primer día no tiene ruta al índice, hay que tocar «Empezar con 日» y luego «Índice». Después de la lección no hay manera de volver a Hoy o a los repasos desde el índice sin reabrir la aplicación (se probó con `/`). `e1-primer-dia-375.png`, `e4-leccion-terminada-375.png`.
- Después de escribir los 10 kanji de la lección 1, el índice dice «0 de 10» (los kanji cuentan como aprendidos solo cuando pasan sus repasos). `e4-leccion-terminada-375.png`.
- A 1280 el primer día repite la lección 1 dos veces en la misma pantalla (índice a la izquierda y panel de hoy a la derecha). `e1-primer-dia-1280.png`.
- En las frases, el kanji aparece tres veces (barra de arriba, ficha grande y palabras). `e7-n5-frase-375.png`.
- El texto del spec «Repaso terminado» no coincide con la pantalla «Listo por hoy».
- Mazo de frases sin entrada desde la interfaz (escenario 7).
- Pizarra de escritura demasiado alta a 1280x900 (escenario 4).

## Correcciones

Después de la corrida se corrigieron cuatro hallazgos. Se verificaron en `vite` (puerto 5193) con Playwright a 375x812 y 1280x900, escribiendo con el mouse las diez tarjetas de la lección 1. Capturas `fix-<qué>-<375|1280>.png` en esta carpeta.

- «0 de 10» tras escribir toda la lección 1: un kanji escrito una vez queda en Learning y el índice solo contaba Review o Relearning. Ahora hay una sola función `isStudied` en `src/store/repo.ts` (la tarjeta existe y no está en New) que usan el índice, la cuenta («kanji aprendidos»), el examen y el plan de hoy. Resultado: tras escribir los 10 kanji, la lección 1 queda plegada con el sello 済 y la lección 2 pasa a ser la actual (`fix-indice-leccion1-hecha`). También se corrigió que el índice de escritorio no se actualizaba al navegar: ahora vuelve a leer el avance en cada pantalla.
- Frases sin entrada: la tarjeta «En una frase» (celular) y «En frases, con cada lectura» (escritorio) de la página del kanji abre `/frases/<lección>?k=<kanji>` y el mazo empieza en ese kanji (probado con 国: abre en 国, `fix-frases-en-kanji`, `fix-kanji-frase-tarjeta`). La fila de la lección actual del índice tiene el botón «Frases» junto a «Examen»; caben en 375 px y en la columna de 330 px.
- Repasos desde el índice en celular: con repasos vencidos aparece, bajo la búsqueda, una fila con «N repasos» y el botón vino «Repasar» que abre `/repaso` (`fix-repasos-fila`, `fix-repasar-abre`; con 10 tarjetas vencidas dice «10 repasos»). En escritorio la fila no se muestra porque el panel de hoy ya tiene «Repasar». La página del primer día tiene arriba a la izquierda el botón «N5» que lleva a `/indice` (`fix-primer-dia`).
- Pizarra de escritura en escritorio: ahora mide lo que quepa entre el tope de la ventana, las casillas y las herramientas (máximo 520 px). A 1280x900 y a 1440x900 el borde de abajo de la pizarra queda en 709 px, las herramientas en 773 y «Siguiente» en 839, todo dentro de los 900 px sin desplazar (`fix-escribir-hecho-1280`, `fix-escribir-hecho-1440`). El celular no cambia.

## Ronda 2

Se corrigieron los hallazgos de la revisión independiente. Verificado con `npm run build` (pasa) y con Playwright en `vite` (puerto 5194), a 375x812 y 1280x900. Capturas `r2-<qué>-<375|1280>.png` en esta carpeta.

- Pestañas al borde (solo escritorio): columna a la derecha de la libreta con Escribir, Repasar (con círculo vino con el número de repasos vencidos), Examen y Notas; título en tooltip; la pestaña de la ruta activa va en blanco. Con una tarjeta vencida el círculo muestra «1» (`r2-kanji-pestanas-1280`). En celular no se ven.
- Progreso del examen: con más de 10 preguntas las casillas miden 18 px y la fila no se parte; con 20 queda en una sola fila que se desplaza sin barra y mantiene visible la casilla actual. Tras responder salen el círculo rojo en la correcta, el tachón en la errónea y la pista con el botón «Siguiente» (`r2-examen-20-error-375`, `r2-examen-1280`).
- Furigana en el examen: la pista de la palabra usa `Furigana` cuando el nivel de la palabra está por encima del nivel del estudiante. No se pone en la pregunta de «¿Cómo se lee esta palabra?» porque regalaría la respuesta. La pantalla de resultado solo muestra el kanji estudiado y significados, no hay palabras ni frases ahí.
- Botón principal deshabilitado: texto en ink-3 sobre el fondo rail.
- Textos: «No tienes más repasos hoy», «En mis repasos» (página del kanji y resultado del examen), «Ir al inicio», «Tu dispositivo no tiene voz en japonés.».
- Botón de nivel en Buscar: abre el índice con el selector de nivel abierto (`r2-nivel-buscar-375`).
- Pantallas que no tenían captura: `r2-creditos-375`, `r2-creditos-1280`, `r2-no-encontrada-375`, `r2-cargando-375` (con `/data` retrasado 4 s) y `r2-nivel-indice-375`.
- Pendiente visto, sin tocar: a 1280 `/creditos` dibuja la hoja dentro de la libreta, con doble marco.
