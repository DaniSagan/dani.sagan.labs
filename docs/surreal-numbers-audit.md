# Auditoría del artículo de números surreales

Ruta: `/articles/surreal-numbers`. Catálogo y menú: Topología. Fecha: 2026-10-20.

## Contenido y alcance

Introducción progresiva con catorce secciones: construcción por cortes, cumpleaños, diádicos, simplicidad, orden, operaciones, signos, reales, infinitos e infinitesimales, diferencias entre aritméticas, Hackenbush, estructura algebraica, historia y autoevaluación. Las ampliaciones técnicas se ofrecen en desplegables.

Ocho laboratorios independientes: árbol/recta de nacimientos, cortes racionales, operaciones de Conway, caminos de signos, aproximaciones diádicas a reales, escalas infinitas simbólicas, Hackenbush azul-rojo y cuestionario. Los cálculos decisivos usan fracciones BigInt. Las coordenadas gráficas usan aproximaciones numéricas. El comparador infinito está limitado a polinomios de Laurent finitos en omega, y el deslizador finito se identifica expresamente como analogía.

Hackenbush permite jugar entre dos personas y analizar tallos finitos; pierde quien no puede mover. No implementa árboles generales, aristas verdes ni juegos infinitos. Los controles tienen etiquetas, foco visible, alternativa nativa a los SVG y botones táctiles; no hay animación automática.

## Fuentes y revisión audiovisual

Fuentes principales enlazadas en el artículo: página de Donald Knuth en Stanford; On Numbers and Games (Conway); An Introduction to the Theory of Surreal Numbers (Gonshor); suplemento de Stanford Encyclopedia of Philosophy; Demaine y Hearn, Playing Games with Algorithms; Mantova y Matusinski, arXiv:1608.03413; Kuhlmann y Matusinski, arXiv:1203.4538.

Se recuperaron metadatos públicos, descripciones y capítulos disponibles de los cuatro vídeos solicitados. Las pistas de subtítulos devolvieron respuestas vacías; no se obtuvo transcripción ni se visionó el contenido audiovisual completo. No se atribuyen afirmaciones matemáticas a pasajes no comprobados.

- fSmauDxTMeQ, Mates Mike: ampliación de sistemas numéricos, surreales, infinitos e infinitesimales. Inspiró el contraste entre ampliaciones ordenadas y complejas.
- elVQtF6T5Zk, StuffXplained: descripción introductoria breve. Se incorpora como segunda puerta de entrada, sin afirmar una revisión detallada.
- mPn2AdMH7UQ, Numberphile: Donald Knuth y el primer libro. La historia se contrastó con la página del propio Knuth.
- ZYj4NkeGPdM, Owen Maitzen: capítulos sobre tallos binarios, verde, infinito y juegos. Inspiró el laboratorio jugable y la distinción entre número y juego; se acota explícitamente lo implementado.

Los cuatro enlaces aparecen individualmente al final del artículo, sin reproductor incrustado.

## Imágenes y conexiones

Dos retratos locales: Conway, Thane Plambeck, CC BY 2.0; Knuth, David Monniaux, CC BY-SA 3.0. Atribución visible junto a cada imagen. Archivos, fuentes, modificaciones, dimensiones y huellas SHA256 en `src/assets/images/surreal-numbers/SOURCES.json`. Los diagramas interactivos son SVG propios.

Dieciséis conexiones recíprocas verificadas: transfinite-numbers, ordinals-growth, cardinality-diagonal, supremum-real-completeness, algebraic-transcendental-numbers, rings-finite-fields, numeral-systems, geometric-series, mathematical-induction, proof-strategies, complex-arithmetic, quaternions-rotations, nash-equilibrium, exponentials-logarithms, computability-formal-languages y conway-gardner-life.

## Validación

`npm run test:surreal`: cumpleaños finitos, 1953 intervalos exactos, 162 operaciones recursivas, 511 tallos con ambos jugadores iniciales, cotas reales, entradas inválidas, reinicios, deshacer, cuestionario y escalas. Plantillas Angular, ocho laboratorios, cuatro vídeos, enlaces recíprocos y catálogo de 571 rutas.

`npm run test:transfinite` y `npm run test:anecdotes`: regresiones satisfactorias.

Las comprobaciones de navegador y presupuestos de producción se registran al terminar la validación.

`npm run test:surreal:browser`: ocho laboratorios comprobados a 1440, 768, 390 y 320 px, con teclado, rat?n y eventos t?ctiles reales de Chrome; entradas inv?lidas, operaciones, juego legal, victoria, deshacer, reinicios, cuestionario, im?genes, trece f?rmulas y ausencia de desbordamiento horizontal. Capturas inspeccionadas en escritorio y m?vil. MathJax se sirve desde una copia local 3.2.2 durante la prueba por las restricciones de red.

El nuevo CSS del laboratorio produce un aviso de 4,26 kB frente al umbral de aviso de 4 kB, dentro del l?mite de error de 6 kB. No se han elevado los presupuestos.

Los diecis?is recorridos rec?procos se comprobaron adicionalmente en Chrome, activando los enlaces por teclado y verificando el componente de destino. Sin errores de ejecuci?n. El modo `SURREAL_JOURNEYS_ONLY=1` permite repetir ?nicamente esta parte; la ejecuci?n normal incluye tambi?n los cuatro tama?os de pantalla.
