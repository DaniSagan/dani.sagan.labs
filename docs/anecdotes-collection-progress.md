# Colección de anécdotas matemáticas: informe de implementación

Fecha: 2026-10-19.

38 candidatas revisadas, 38 relatos implementados, ninguna omitida por duplicación. Los dos relatos anteriores (Gauss y Hardy-Ramanujan) se conservan sin cambios. La sección tiene 40 relatos y el catálogo completo, 547 artículos.

Cada relato tiene componente, plantilla y estilos propios. Solo reutiliza convenciones generales y estilos generales ya existentes. No se ha creado un componente base, servicio, plantilla ni renderizador compartido exclusivo de la colección. Los metadatos de auditoría son documentación y no generan las páginas en tiempo de ejecución.

## Inventario completo y rutas

Todas las entradas siguientes pasan revisión estática y navegador a 1440, 390 y 320 px. El recuento excluye título, imagen, créditos, fuentes y enlaces relacionados.

| ID | Ruta | Palabras narrativas | Imagen |
|---|---|---:|---|
| A01 | /articles/tartaglia-cardano-secret | 252 | cardano |
| A02 | /articles/galois-last-letter | 256 | galois |
| A03 | /articles/newton-leibniz-priority | 256 | newton |
| A04 | /articles/perelman-prize-refusal | 260 | perelman |
| A05 | /articles/dantzig-homework | 263 | Sin imagen |
| A06 | /articles/hardy-riemann-postcard | 252 | hardy |
| A07 | /articles/hamilton-broom-bridge | 256 | hamilton |
| A08 | /articles/fermat-margin | 265 | fermat |
| A09 | /articles/archimedes-last-circles | 272 | archimedes |
| A10 | /articles/germain-leblanc | 264 | germain |
| A11 | /articles/godel-citizenship | 271 | Sin imagen |
| A12 | /articles/euler-conjecture-counterexample | 256 | lander-parkin |
| A13 | /articles/newton-lion-claw | 257 | newton |
| A14 | /articles/turing-paper-chess | 260 | turing |
| A15 | /articles/abel-late-appointment | 260 | abel |
| A16 | /articles/poincare-omnibus | 251 | poincare |
| A17 | /articles/euler-diderot-legend | 258 | euler |
| A18 | /articles/de-moivre-last-sleep | 258 | de-moivre |
| A19 | /articles/hippasus-irrational-legend | 248 | pythagoras |
| A20 | /articles/shanks-pi-error | 258 | Sin imagen |
| B01 | /articles/eratosthenes-shadows | 249 | Sin imagen |
| B02 | /articles/archimedes-tomb | 254 | archimedes |
| B03 | /articles/euclid-royal-road | 249 | Sin imagen |
| B04 | /articles/von-neumann-fly | 255 | Sin imagen |
| B05 | /articles/erdos-book | 258 | erdos |
| B06 | /articles/lovelace-unbuilt-machine | 249 | lovelace |
| B07 | /articles/mirzakhani-paper | 260 | mirzakhani |
| B08 | /articles/cantor-infinity-dispute | 263 | Sin imagen |
| B09 | /articles/turing-1936-paper | 257 | turing |
| B10 | /articles/mobius-listing-strip | 258 | Sin imagen |
| B11 | /articles/bayes-price-manuscript | 251 | Sin imagen |
| B12 | /articles/napier-briggs-meeting | 256 | Sin imagen |
| B13 | /articles/fourier-heat-prize | 258 | fourier |
| B14 | /articles/ulam-spiral-doodle | 261 | ulam |
| B15 | /articles/mandelbrot-coastline | 255 | Sin imagen |
| B16 | /articles/hilbert-hotel | 399 | hilbert |
| B17 | /articles/banach-tarski-sphere | 263 | Sin imagen |
| B18 | /articles/zeno-achilles-tortoise | 263 | zeno |

## Imágenes descargadas e incorporadas

23 archivos locales utilizados en 26 relatos, 4.15 MB en total. Cada archivo tiene como máximo 450 kB. Se conservan proporciones, dimensiones intrínsecas y carga diferida. Cada pie identifica autor o crédito disponible, fuente, licencia y redimensionado sin recorte adicional. SOURCES.json conserva las URL de descarga, autoría, licencia, dimensiones y SHA-256.

| Archivo | Licencia | Fuente y autoría |
|---|---|---|
| cardano.jpg | Public domain | [Miscellaneous Items in High Demand, PPOC, Library of Congress](https://commons.wikimedia.org/wiki/File:Mathematician_Girolamo_Cardano,_half-length_portrait_in_oval,_facing_right,_with_text_below_LCCN92518239.jpg) |
| galois.jpg | Public domain | [Unknown author Unknown author](https://commons.wikimedia.org/wiki/File:Evariste_Galois.jpg) |
| newton.jpg | Public domain | [Godfrey Kneller](https://commons.wikimedia.org/wiki/File:Portrait_of_Sir_Isaac_Newton,_1689.jpg) |
| perelman.jpg | CC BY-SA 4.0 | [George Bergman](https://commons.wikimedia.org/wiki/File:Grigori_Perelman,_1993_(re-scanned).jpg) |
| hardy.jpg | Public domain | [Unknown author Unknown author](https://commons.wikimedia.org/wiki/File:Godfrey_Harold_Hardy_1.jpg) |
| hamilton.jpg | Public domain | [Wisher  at  English Wikipedia](https://commons.wikimedia.org/wiki/File:Broom_bridge_plaque.jpg) |
| fermat.jpg | Public domain | [Rolland Lefebvre](https://commons.wikimedia.org/wiki/File:Pierre_de_Fermat3.jpg) |
| archimedes.jpg | Public domain | [Domenico Fetti](https://commons.wikimedia.org/wiki/File:Retrato_de_un_erudito_(%C2%BFArqu%C3%ADmedes%3F),_por_Domenico_Fetti.jpg) |
| germain.jpg | Public domain | [Berthe Chégaray née Becher et J. Poinsot](https://commons.wikimedia.org/wiki/File:Ch%C3%A9garay,_Poinsot_-_Sophie_Germain.jpg) |
| euler.jpg | Public domain | [Jakob Emanuel Handmann](https://commons.wikimedia.org/wiki/File:Leonhard_Euler_-_Jakob_Emanuel_Handmann_(Kunstmuseum_Basel).jpg) |
| turing.jpg | Public domain | [Elliott & Fry](https://commons.wikimedia.org/wiki/File:Alan_Turing_(1951).jpg) |
| abel.jpg | Public domain | [Johan Gørbitz](https://commons.wikimedia.org/wiki/File:Johan_G%C3%B8rbitz_-_Niels_Henrik_Abel_-_Norsk_portrettarkiv_-_Riksantikvaren_-_A000005.jpg) |
| poincare.jpg | Public domain | [Manuel (artist) (designer)](https://commons.wikimedia.org/wiki/File:Henri_Poincar%C3%A9,_PA03199.jpg) |
| de-moivre.jpg | Public domain | [Joseph Highmore](https://commons.wikimedia.org/wiki/File:Abraham_de_Moivre_by_Joseph_Highmore.jpg) |
| pythagoras.jpg | CC BY-SA 4.0 | [Cmick25](https://commons.wikimedia.org/wiki/File:Bust_of_Pythagoras_at_the_Capitoline_Museum.jpg) |
| erdos.jpg | CC BY 3.0 | [Che Graham](https://commons.wikimedia.org/wiki/File:Ronald_graham_couple_with_erdos_1986.jpg) |
| lovelace.jpg | Public domain | [Alfred Edward Chalon](https://commons.wikimedia.org/wiki/File:Ada_Lovelace_Chalon_portrait.jpg) |
| mirzakhani.jpg | CC BY-SA 2.0 de | [Gert-Martin Greuel](https://commons.wikimedia.org/wiki/File:Maryam_Mirzakhani_in_Seoul_2014.jpg) |
| fourier.jpg | Public domain | [Amédée Félix Barthélemy Geille    /  After   Julien-Léopold Boilly](https://commons.wikimedia.org/wiki/File:Joseph_Fourier.jpg) |
| ulam.jpg | Public domain | [Federal Government of the United States](https://commons.wikimedia.org/wiki/File:Stanislaw_M._Ulam_Los_Alamos_ID.png) |
| hilbert.jpg | Public domain | [Unknown author Unknown author](https://commons.wikimedia.org/wiki/File:Hilbert.jpg) |
| zeno.jpg | CC BY-SA 4.0 | [S. Perquin](https://commons.wikimedia.org/wiki/File:Zeno_of_Elea_(transparent).png) |

No todos los relatos necesitan una ilustración. Los doce restantes se publican sin imagen porque no se obtuvo una candidata adecuada con atribución suficientemente clara. El registro de búsqueda y descarte es [anecdotes-image-research.json](anecdotes-image-research.json). Se descartaron, entre otros, un retrato del pintor William Somerville Shanks, Euclides de Megara, un retrato de Shakespeare atribuido a Napier y una fotografía de von Neumann con procedencia insuficiente. Ninguno se distribuye como imagen del personaje equivocado. Las representaciones de personajes antiguos se identifican como tradicionales, no como retratos contemporáneos; la placa de Hamilton se identifica como conmemorativa.

## Cobertura matemática y enlaces

Se revisaron los catálogos reales, rutas, reexportaciones y plantillas de los 504 artículos originales. Se reutilizan los contenidos existentes sobre cúbicas, grupos, permutaciones, números complejos, derivadas, integrales, braquistócrona, computabilidad, cardinalidad, Bayes, logaritmos, Fourier, Ulam, fractales, Möbius, superficies y series geométricas. Una coincidencia de palabras no se tomó como cobertura suficiente.

Cinco carencias justificaron artículos independientes:

- /articles/quaternions-rotations: Cuaterniones y rotaciones.
- /articles/galois-solvability: Teoría de Galois y radicales.
- /articles/fermat-wiles-theorem: Fermat-Wiles: hipótesis y alcance.
- /articles/archimedes-sphere-cylinder: Esfera y cilindro: secciones, volumen y área.
- /articles/banach-tarski-paradox: Banach-Tarski y los conjuntos no medibles.

Cada uno contiene definiciones, hipótesis, ejemplos, advertencias, un laboratorio acotado y enlaces de vuelta al relato. Los experimentos distinguen comprobación finita y teorema: ni buscar ternas demuestra Fermat ni cancelar palabras construye las piezas de Banach-Tarski. Se amplió /articles/proof-strategies con una demostración completa de la irracionalidad de √2 y un enlace a Hipaso, reutilizando la explicación de contradicción existente. No se duplicó el artículo de Cavalieri: el nuevo artículo desarrolla la comparación específica esfera/cilindro y distingue superficie lateral y total.

Las 43 páginas nuevas contienen 60 enlaces internos a artículos. El JSON de auditoría enumera los destinos de cada relato. Los catálogos registran las 43 nuevas rutas y entradas de menú; router, módulo y proveedor existentes ya consumen esos catálogos.

## Cautelas históricas

- Galois: la carta no inventó toda su teoría en una noche; se distinguen la carta del 29 de mayo, el duelo y su muerte en 1832.
- Newton y Leibniz: descubrimientos independientes y participación de Newton en la documentación de la disputa; no se presenta el informe de la Royal Society como juicio neutral.
- Tartaglia y Cardano: prioridad de Del Ferro, promesa y reconocimiento de Tartaglia en Ars Magna, sin convertir la disputa en plagio indiscutible.
- Hardy y la postal, De Moivre, Hipaso, Euclides y la mosca de von Neumann: tradición o recuerdo atribuido, sin diálogos inventados.
- Euler y Diderot: leyenda sometida a crítica, no demostración de Dios ni evidencia de ignorancia matemática de Diderot.
- Arquímedes: las versiones antiguas de su muerte no acreditan literalmente su última frase; el relato de la tumba se apoya en Cicerón. La verificación por integrales del artículo de apoyo se identifica como moderna.
- Gödel: cronología archivística de 1947 frente a errores de fecha de recuerdos posteriores; no se inventa el supuesto fallo constitucional.
- Dantzig: problemas de estadística de Neyman, no invención de la programación lineal durante una clase.
- Shanks: primeras 527 cifras correctas y error a partir de la 528; no se usa el retrato de su homónimo pintor.
- Lovelace: notas de 1843 y máquina no construida, sin afirmar una prioridad absoluta de programación sin matices.
- Cantor y Perelmán: no se diagnostica ni se convierte una controversia científica en una causa médica o una motivación privada demostrada.
- Hilbert, Zenón y Banach-Tarski: relatos de ideas o argumentos; no escenas biográficas inventadas ni duplicación física de materia.

Las fuentes están enlazadas en cada relato. El registro original de Banach-Tarski y el de Mandelbrot se consultaron a nivel bibliográfico, sin afirmar lectura completa del original; para el contenido se consultaron también la exposición de Tao y MacTutor, respectivamente. La reproducción de la carta de Galois se abrió, pero no pudo extraerse su texto con la herramienta; la cronología se contrastó con la biografía. Las pruebas avanzadas citadas no se presentan como demostradas por nuestros laboratorios.

## Validación ejecutada

- Compilación Angular de desarrollo: correcta (AOT).
- npm run test:budgets: compilación de producción y presupuestos correctos, sin elevar ningún umbral. Solo se desactiva la descarga externa de fuentes en el verificador existente; no se cambia angular.json ni el despliegue. Persisten avisos de dependencias CommonJS y Browserslist del proyecto.
- npm run test:anecdotes: 38 relatos independientes, 242–272 palabras, enlaces reales, fuentes, plantillas, imágenes locales y metadatos correctos.
- npm run test:anecdotes:math: modelos de los cinco artículos, búsqueda entera exacta con BigInt, invariantes, cancelaciones, fórmulas TeX y plantillas correctos.
- npm run test:article-navigation: 547 rutas y 547 entradas únicas, sin omisiones ni enlaces obsoletos (también ejecutado por las auditorías anteriores).
- npm run test:gauss-school-sum y npm run test:taxicab: regresiones correctas; sus componentes no se modifican.
- npm run test:anecdotes:browser: los 38 relatos a 1440/390/320 px, títulos, imágenes cargadas, fuentes desplegables, teclado y ausencia de desbordamientos.
- npm run test:anecdotes:math:browser: las cinco explicaciones en esos tres anchos; controles con eventos reales de ratón/tacto/teclado, renderizado TeX y navegación recíproca entre relato y explicación.

Las pruebas de navegador emplean Chrome instalado y el bundle local de MathJax disponible para evitar depender de su CDN. Se inspeccionaron también las miniaturas y capturas representativas. Los logs y capturas de esta ejecución están en tmp; no son activos de producción.

## Pendiente

Ninguna candidata pendiente de implementar. No se ha publicado ni desplegado el sitio.

## Actualización de imágenes aportadas por el usuario

Tras confirmar el usuario la licencia libre de las fuentes, el relato A12 incorpora el facsímil de Lander y Parkin en lugar del retrato genérico de Euler. El artículo explicativo de números taxicab incorpora un montaje de Futurama optimizado y enlaza su original. La modalidad concreta de licencia no se ha inventado: se documenta la confirmación del usuario en assets/img/SOURCES.json. Véase también unused-assets-review.md.
