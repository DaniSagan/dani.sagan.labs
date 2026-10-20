# Veinte nuevas anécdotas matemáticas

Fecha: 20 de octubre de 2026.

La sección pasa de 40 a 60 anécdotas. Se revisó el catálogo actual y las 40 historias previas, no solo sus títulos: ninguna de las veinte propuestas estaba implementada como relato equivalente. El catálogo total pasa de 548 a 570 artículos con los veinte relatos y dos explicaciones adicionales. No se ha desplegado el sitio.

## Artículos implementados

| ID | Título definitivo | Ruta | Palabras narrativas | Imagen |
|---|---|---|---:|---|
| C01 | Katherine Johnson: la comprobación que pidió John Glenn | `/articles/johnson-glenn-check` | 247 | johnson |
| C02 | Los siete puentes: un paseo condenado al fracaso | `/articles/euler-seven-bridges-walk` | 247 | euler |
| C03 | Joan Clarke: una lingüista sin idiomas en la cabaña 8 | `/articles/joan-clarke-hut-eight` | 247 | Sin imagen |
| C04 | John Nash: el reconocimiento que llegó cuatro décadas después | `/articles/nash-return-recognition` | 260 | nash |
| C05 | Wolfskehl: una herencia que esperó a Andrew Wiles | `/articles/wolfskehl-fermat-prize` | 256 | Sin imagen |
| C06 | Alan Turing y la taza que no debía desaparecer | `/articles/turing-chained-mug` | 249 | turing |
| C07 | Grothendieck: el presupuesto que le hizo abandonar el IHÉS | `/articles/grothendieck-ihes-departure` | 253 | grothendieck |
| C08 | Nightingale: el gráfico que llevó el hospital a los despachos | `/articles/nightingale-statistical-campaign` | 253 | nightingale-diagram |
| C09 | Turing y Wittgenstein: una discusión con un puente en medio | `/articles/turing-wittgenstein-bridge` | 259 | turing |
| C10 | Julia Robinson y la última pieza de un problema de Hilbert | `/articles/robinson-matiyasevich-hilbert` | 260 | robinson |
| C11 | Pascal: una máquina para las cuentas de su padre | `/articles/pascal-fathers-calculator` | 263 | pascaline |
| C12 | Emmy Noether: la profesora cuyo curso anunciaba Hilbert | `/articles/noether-gottingen-lectures` | 267 | noether |
| C13 | André Weil: una carta matemática desde la prisión | `/articles/weil-rouen-prison` | 258 | weil |
| C14 | Hurwitz: cincuenta minutos para un primo de 1332 cifras | `/articles/hurwitz-mersenne-computer` | 264 | ibm7090 |
| C15 | Cuatro colores: cuando la demostración llegó con un programa | `/articles/appel-haken-computer-proof` | 253 | Sin imagen |
| C16 | Lepaute: seis meses de cuentas para esperar a un cometa | `/articles/lepaute-halleys-return` | 255 | lepaute |
| C17 | La carta de Ramanujan que Hardy no pudo apartar | `/articles/ramanujan-first-letter` | 255 | hardy |
| C18 | Émilie du Châtelet: Newton contra el reloj | `/articles/chatelet-newton-translation` | 260 | chatelet |
| C19 | Conway: el pequeño mundo que Gardner puso en circulación | `/articles/conway-gardner-life` | 254 | conway |
| C20 | Pascal y Fermat: repartir una apuesta que nadie había ganado | `/articles/pascal-fermat-interrupted-game` | 260 | fermat |

Cada relato tiene sus propios archivos `.component.ts`, `.component.html` y `.component.css`, con el mismo patrón standalone y RouterLink de los relatos existentes. Se reutiliza únicamente la hoja general learning-article.css. No hay servicios, renderizadores, interfaces ni estilos compartidos exclusivos del lote. Las plantillas anteriores no se modifican. El catálogo existente alimenta router, módulo y proveedor de navegación sin añadir registros paralelos.

## Duplicados y alcance editorial

Ninguna candidata se omite. El relato de los puentes enlaza la explicación existente; el de cuatro colores cuenta la discusión sobre la verificación; el de Conway enlaza la explicación y el juego ya implementados. La carta de 1913 no repite el taxi 1729. Wolfskehl cuenta la historia del premio, no vuelve a narrar la nota marginal. Las dos nuevas historias de Turing se distinguen de sus relatos existentes sobre ajedrez y computabilidad.

## Imágenes y licencias

Se descargaron doce archivos nuevos (todos por debajo de 200 kB) y se reutilizan cuatro archivos anteriores en cinco relatos. Diecisiete de las veinte páginas llevan imagen. Se inspeccionaron visualmente dos hojas de contacto locales. Dimensiones intrínsecas, proporciones, textos alternativos y carga diferida están incluidos. No hay imágenes remotas en producción.

| Archivo nuevo | Autor o crédito | Licencia | Procedencia |
|---|---|---|---|
| johnson.jpg | NASA; restauración de Adam Cuerden | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Katherine_Johnson_at_NASA%2C_in_1966.jpg) |
| nash.jpg | Peter Badge / Typos1 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:John_Forbes_Nash%2C_Jr._by_Peter_Badge.jpg) |
| grothendieck.jpg | Konrad Jacobs; copyright MFO | [CC BY-SA 2.0 DE](https://creativecommons.org/licenses/by-sa/2.0/de/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Alexander_Grothendieck.jpg) |
| nightingale-diagram.jpg | Florence Nightingale | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Nightingale-mortality.jpg) |
| robinson.jpg | George M. Bergman; digitalización de George Ho | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Julia_Robinson_1975_%28re-scanned%29.jpg) |
| pascaline.jpg | Rama | [CC BY-SA 3.0 FR](https://creativecommons.org/licenses/by-sa/3.0/fr/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Pascaline-CnAM_823-1-IMG_1506-black.jpg) |
| noether.jpg | Autor desconocido | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Noether.jpg) |
| weil.jpg | Konrad Jacobs / MFO | [CC BY-SA 2.0 DE](https://creativecommons.org/licenses/by-sa/2.0/de/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Weil.jpg) |
| ibm7090.jpg | U. S. Weather Bureau / colección histórica NOAA | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:IBM_7090_console_used_by_a_meteorologist%2C_1965.jpg) |
| lepaute.jpg | Autor desconocido | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Nicole-Reine_Lepaute.jpg) |
| chatelet.jpg | Maurice Quentin de La Tour | [Public domain](https://creativecommons.org/publicdomain/mark/1.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:Emilie_Chatelet_portrait_by_Latour.jpg) |
| conway.jpg | Thane Plambeck; recortes de Commons | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | [Ficha individual](https://commons.wikimedia.org/wiki/File:John_H_Conway_2005_%28cropped%29_%282%29.jpg) |

SOURCES.json conserva URL original y de descarga, título, crédito, licencia, cambios, dimensiones, bytes y SHA-256. Los pies indican los recortes heredados de Commons y el redimensionado sin recorte adicional. La consola IBM ilustra el modelo de ordenador en otro contexto, no se atribuye a UCLA. Los retratos posteriores no se presentan como fotografías de los acontecimientos.

- **Joan Clarke: una lingüista sin idiomas en la cabaña 8**: no se seleccionó un retrato auténtico con licencia individual verificada; la búsqueda devolvió además un aviso de eliminación de un retrato en Commons.
- **Wolfskehl: una herencia que esperó a Andrew Wiles**: se localizó y verificó un retrato de dominio público, pero Wikimedia devolvió HTTP 429 en las descargas; se publica sin dependencia remota.
- **Cuatro colores: cuando la demostración llegó con un programa**: no se seleccionó una fotografía histórica pertinente con licencia individual suficientemente comprobada.

## Referencias históricas incorporadas

Las referencias se presentan en un desplegable por relato. Se consultaron fuentes institucionales, biografías académicas, artículos originales y reconstrucciones identificadas. No se usa Wikipedia como fuente histórica única.

- **Katherine Johnson: la comprobación que pidió John Glenn**: [NASA: Johnson y la comprobación](https://www.nasa.gov/news-release/katherine-johnsons-continuing-legacy-at-ivv-beyond-2/); [NASA: el vuelo de Glenn](https://www.nasa.gov/missions/glenn-orbits-the-earth/).
- **Los siete puentes: un paseo condenado al fracaso**: [MacTutor: Euler](https://mathshistory.st-andrews.ac.uk/Biographies/Euler/).
- **Joan Clarke: una lingüista sin idiomas en la cabaña 8**: [MacTutor: Clarke_Joan](https://mathshistory.st-andrews.ac.uk/Biographies/Clarke_Joan/).
- **John Nash: el reconocimiento que llegó cuatro décadas después**: [MacTutor: Nash](https://mathshistory.st-andrews.ac.uk/Biographies/Nash/); [Fundación Nobel: Nash](https://www.nobelprize.org/prizes/economic-sciences/1994/nash/facts/).
- **Wolfskehl: una herencia que esperó a Andrew Wiles**: [Simon Singh: historia del premio y revisión de la leyenda](https://simonsingh.net/media/articles/maths-and-science/the-wolfskehl-prize/); [MacTutor: Wiles](https://mathshistory.st-andrews.ac.uk/Biographies/Wiles/).
- **Alan Turing y la taza que no debía desaparecer**: [Bletchley Park: materiales educativos que recogen la taza](https://bletchleypark.org.uk/wp-content/uploads/2021/10/teachers-notes-ks2-2019.pdf); [Open University: Alan Turing, una retrospectiva](https://media-podcast.open.ac.uk/feeds/Alan-Turing/transcript/alan_turing_code_breaker_02071_20403.pdf).
- **Grothendieck: el presupuesto que le hizo abandonar el IHÉS**: [MacTutor: Grothendieck](https://mathshistory.st-andrews.ac.uk/Biographies/Grothendieck/).
- **Nightingale: el gráfico que llevó el hospital a los despachos**: [MacTutor: Nightingale](https://mathshistory.st-andrews.ac.uk/Biographies/Nightingale/).
- **Turing y Wittgenstein: una discusión con un puente en medio**: [British Wittgenstein Society: intercambio y notas de la lección XXII](https://www.britishwittgensteinsociety.org/wp-content/uploads/documents/lectures/Turing-and-Wittgenstein-on-Logic-and-Mathematics.pdf); [Estudio de la objeción del puente, Universidad de St Andrews](https://research-repository.st-andrews.ac.uk/handle/10023/25131).
- **Julia Robinson y la última pieza de un problema de Hilbert**: [MacTutor: Robinson_Julia](https://mathshistory.st-andrews.ac.uk/Biographies/Robinson_Julia/).
- **Pascal: una máquina para las cuentas de su padre**: [MacTutor: Pascal](https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/).
- **Emmy Noether: la profesora cuyo curso anunciaba Hilbert**: [MacTutor: Noether_Emmy](https://mathshistory.st-andrews.ac.uk/Biographies/Noether_Emmy/).
- **André Weil: una carta matemática desde la prisión**: [MacTutor: Weil](https://mathshistory.st-andrews.ac.uk/Biographies/Weil/).
- **Hurwitz: cincuenta minutos para un primo de 1332 cifras**: [Alexander Hurwitz: New Mersenne Primes, artículo original reproducido](https://t5k.org/mersenne/literature/hurwitz.html); [PrimePages: historia de los récords y orden de lectura](https://t5k.org/notes/by_year.html); [GIMPS: registro histórico de primos de Mersenne](https://www.mersenne.org/primes/).
- **Cuatro colores: cuando la demostración llegó con un programa**: [Universidad de Illinois: bibliografía de la demostración](https://www.library.illinois.edu/mtx/four-color-theorem-resources/); [Illinois: Appel, Haken y Koch, publicaciones y archivos](https://guides.library.illinois.edu/c.php?g=647135&p=4537089).
- **Lepaute: seis meses de cuentas para esperar a un cometa**: [MacTutor: Lepaute](https://mathshistory.st-andrews.ac.uk/Biographies/Lepaute/); [Académie des sciences: colaboración y perihelio del 13 de marzo](https://www.academie-sciences.fr/pdf/dossiers/ama/P23.htm).
- **La carta de Ramanujan que Hardy no pudo apartar**: [MacTutor: Ramanujan](https://mathshistory.st-andrews.ac.uk/Biographies/Ramanujan/); [AMS: correspondencia de Ramanujan y fecha de la carta](https://www.ams.org/books/hmath/009/hmath009-endmatter.pdf); [Universidad de Cambridge: el primer contacto](https://www.cam.ac.uk/research/news/opinion-the-man-who-taught-infinity-how-gh-hardy-tamed-srinivasa-ramanujans-genius).
- **Émilie du Châtelet: Newton contra el reloj**: [MacTutor: Chatelet](https://mathshistory.st-andrews.ac.uk/Biographies/Chatelet/).
- **Conway: el pequeño mundo que Gardner puso en circulación**: [Martin Gardner: columna original de octubre de 1970](https://ibiblio.org/lifepatterns/october1970.html); [Scientific American: registro de publicación](https://www.scientificamerican.com/article/mathematical-games-1970-10/).
- **Pascal y Fermat: repartir una apuesta que nadie había ganado**: [MacTutor: Pascal](https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/); [Universidad de York: Fermat y Pascal sobre probabilidad](https://www.york.ac.uk/depts/maths/histstat/pascal.htm).

La consulta directa de algunos originales quedó limitada: la página de la autobiografía de Nash en NobelPrize.org y el PDF original de Barner en AMS devolvieron 403; la página de York sobre Pascal tampoco pudo extraerse. Para los hechos utilizados se contrastaron la biografía de Nash y su ficha Nobel, la revisión explícita de Simon Singh sobre Barner, y MacTutor sobre Pascal. Las referencias originales permanecen como orientación bibliográfica, sin afirmar lectura completa. Las notas de Wittgenstein se consultaron mediante la exposición de la British Wittgenstein Society, que reproduce el intercambio de la lección XXII, junto al registro académico de St Andrews.

## Cobertura matemática auditada

| Tema | Destino comprobado / decisión |
|---|---|
| Grafos y puentes | graph-foundations, konigsberg-bridges; se conservan |
| Cuatro colores | four-color-theorem; se conserva |
| Criptografía clásica | RSA existía, pero no desarrolla sustituciones clásicas: nuevo classical-cryptography |
| Teoría de juegos y Nash | Sin artículo específico encontrado: nuevo nash-equilibrium |
| Estadística y gráficos | descriptive-statistics; se conserva |
| Noether y conservación | variations-noether y first-integrals; se conservan |
| Computabilidad y decidibilidad | computability-formal-languages; se conserva |
| Mersenne y primalidad | perfect-numbers y herramienta prime-decomposition, con Lucas-Lehmer ya explicado; no se duplica |
| Mecánica orbital | kepler-orbits; se conserva |
| Autómatas y Vida | cellular-automata, life-patterns y /games/game-of-life; se conservan |
| Probabilidad | finite-probability y discrete-expectation; se conservan |

Los dos artículos nuevos contienen definiciones, hipótesis, ejemplos calculados, justificaciones, límites del modelo, errores frecuentes, un ejercicio resuelto y referencias académicas. No se añaden laboratorios por obligación. Ambos enlazan de vuelta a su anécdota. Nash se registra en Combinatoria > Teoría de juegos y criptografía en Teoría de números > Métodos aritméticos y criptografía. Se actualiza la clasificación general para que ninguno termine en Otros temas.

## Enlaces internos

- `/articles/johnson-glenn-check` → `/articles/kepler-orbits`.
- `/articles/euler-seven-bridges-walk` → `/articles/konigsberg-bridges`, `/articles/graph-foundations`.
- `/articles/joan-clarke-hut-eight` → `/articles/classical-cryptography`.
- `/articles/nash-return-recognition` → `/articles/nash-equilibrium`.
- `/articles/wolfskehl-fermat-prize` → `/articles/fermat-wiles-theorem`, `/articles/fermat-margin`.
- `/articles/turing-chained-mug` → `/articles/joan-clarke-hut-eight`, `/articles/turing-paper-chess`.
- `/articles/grothendieck-ihes-departure` → `/articles/galois-solvability`.
- `/articles/nightingale-statistical-campaign` → `/articles/descriptive-statistics`.
- `/articles/turing-wittgenstein-bridge` → `/articles/proof-strategies`, `/articles/computability-formal-languages`.
- `/articles/robinson-matiyasevich-hilbert` → `/articles/computability-formal-languages`.
- `/articles/pascal-fathers-calculator` → `/articles/numeral-systems`.
- `/articles/noether-gottingen-lectures` → `/articles/variations-noether`, `/articles/first-integrals`.
- `/articles/weil-rouen-prison` → `/articles/riemann-zeta`.
- `/articles/hurwitz-mersenne-computer` → `/articles/perfect-numbers`, `/articles/euclid-infinitely-many-primes`.
- `/articles/appel-haken-computer-proof` → `/articles/four-color-theorem`.
- `/articles/lepaute-halleys-return` → `/articles/kepler-orbits`.
- `/articles/ramanujan-first-letter` → `/articles/riemann-zeta`.
- `/articles/chatelet-newton-translation` → `/articles/kepler-orbits`, `/articles/derivative-foundations`.
- `/articles/conway-gardner-life` → `/articles/life-patterns`, `/articles/cellular-automata`, `/games/game-of-life`.
- `/articles/pascal-fermat-interrupted-game` → `/articles/finite-probability`, `/articles/discrete-expectation`.

## Correcciones históricas

- Johnson: se parafrasea la petición de Glenn; no se inventa una conversación ni se presenta como una carrera contra el ordenador.
- Wolfskehl: la motivación suicida es una tradición oral tardía, no un hecho acreditado. Se distinguen anuncio de Wiles, reparación con Taylor, publicación y entrega del premio.
- Turing y la taza: relato atribuido a la tradición biográfica y museística; ninguna fotografía moderna se declara objeto original.
- Grothendieck: se separa la marcha del IHÉS en 1970 de la retirada de 1991.
- Nightingale: no se le atribuye la invención de todos los diagramas ni una reforma sanitaria en solitario.
- Turing y Wittgenstein: puente hipotético; paráfrasis de notas de clase, sin diálogos inventados.
- Robinson: resultado colectivo de Davis, Putnam, Robinson y Matiyasevich; no se atribuye todo a una persona.
- Pascalina: desarrollo desde 1642, múltiples prototipos y privilegio de 1649, sin prioridad absoluta de la calculadora.
- Noether: invariancia y conservación en el contexto de Hilbert y Klein; no se afirma que corrigiera una errata de Einstein.
- Weil: trabajo y anuncio de 1940 frente a fundamentos completos posteriores; no resuelve la hipótesis de Riemann clásica ni un supuesto problema de 150 años.
- Hurwitz: búsqueda programada y deliberada, no error informático. Se distingue el orden de cálculo del orden de lectura de resultados.
- Cuatro colores: se reconoce a John Koch y se distinguen anuncio de 1976 y publicaciones de 1977.
- Lepaute: reaparición visible en diciembre de 1758 y perihelio el 13 de marzo de 1759. La biografía de MacTutor confunde ese último dato con abril: se contrastó con la Académie des sciences y bibliografía astronómica. No se atribuye una motivación privada a la omisión de su nombre.
- Du Châtelet: traducción comentada propia, revisión de Clairaut y publicación completa póstuma de 1759; no se reduce a su relación con Voltaire.
- Pascal y Fermat: la correspondencia de 1654 tiene antecedentes; no se declara origen absoluto de la probabilidad.

## Validación

- `npx ng build --configuration development`: correcto, compilación AOT; se repitió tras incorporar las imágenes.
- `npm run test:budgets`: producción y presupuestos correctos. El verificador existente desactiva solo el inlining de fuentes externas; no se modifica angular.json. Persisten avisos de Browserslist y dependencias CommonJS del proyecto.
- `npm run test:anecdotes`: 58 relatos auditados, incluidos los veinte nuevos; 60 entradas en el catálogo. Recuento, independencia, ausencia de widgets, rutas, fuentes, imágenes, enlaces y plantillas correctos. También verifica las dos páginas matemáticas nuevas.
- `node scripts/check-anecdotes-collection.cjs`: 58 relatos a 1440, 390 y 320 px, carga de imágenes, ausencia de desbordamientos, fuentes desplegables y teclado. Los dos artículos de apoyo pasan en los tres anchos con ejercicio desplegable y navegación recíproca real.
- `npm run test:anecdotes:math`: correctos los modelos, fórmulas y plantillas de los cinco artículos de apoyo anteriores.
- Auditoría de navegación ejecutada por los verificadores: 570 rutas y 570 entradas únicas, sin omisiones, duplicados ni destinos obsoletos.
- Se inspeccionaron capturas de Johnson en móvil, Turing/Wittgenstein en escritorio y Nash a 320 px. Los registros y las capturas están en tmp, fuera de los recursos de producción.
- Integridad SHA-256 de los doce archivos descargados: correcta.
- `git diff --check`: correcto.
- Suite general Karma: el primer intento no arrancó ChromeHeadless por un fallo de GPU del entorno. Con configuración temporal sin GPU se ejecutaron **1049 pruebas: 1026 correctas y 23 fallidas**. No se modifica karma.conf.js. No se presenta la suite general como aprobada.
- Veinte fallos corresponden a fixtures anteriores sin proveedores de ActivatedRoute (8) o RootMathjaxConfig (12). Los componentes y sus specs no se modificaron.
- Tres fallos corresponden a expectativas anteriores sobre navegación: dos specs solo inspeccionan items planos aunque el menú tiene subgrupos; otro exige ausencia de Otros temas, donde ya quedan rutas anteriores como frobenius-coins y dimensional-analysis. Se cargaron en memoria las versiones HEAD de los catálogos y grupos modificados, sin alterar archivos de trabajo, y se reprodujeron esas tres deficiencias de navegación. La evidencia está en tmp/anecdotes20-baseline-navigation.json.
- La prueba focalizada de SectionNavbar, repetida tras clasificar los dos nuevos artículos, da 6 correctas y 1 fallida: persiste únicamente su expectativa sobre los grupos anteriores sin clasificar. La auditoría específica de las nuevas rutas confirma su submenú y pasa.

## Incidencias

El retrato de Wolfskehl no pudo descargarse por el límite HTTP 429 de Wikimedia. Tres relatos quedan sin imagen conforme al criterio editorial permitido. La suite general conserva los 23 fallos de pruebas anteriores descritos arriba; las verificaciones específicas de esta ampliación, el navegador y la compilación pasan. No se ha publicado ni desplegado el sitio.
