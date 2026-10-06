# Catálogo de curvas implícitas

La galería contiene 848 ejemplos en 30 categorías, ampliados el 6 de octubre de 2026. La cantidad cuenta ejemplos seleccionables: curvas clásicas, variantes de familias y composiciones originales. No representa 848 familias diferentes ni un récord mundial comprobado.

## Investigación

Se revisaron los índices de [MathCurve](https://mathcurve.com/courbes2d/courbes2d.shtml), [MacTutor de la Universidad de St Andrews](https://mathshistory.st-andrews.ac.uk/Curves/) y las familias [cuárticas](https://mathworld.wolfram.com/QuarticCurve.html) y [séxticas](https://mathworld.wolfram.com/SexticCurve.html) de MathWorld. Se consultaron las páginas específicas para contrastar ecuaciones, dominios, parametrizaciones y singularidades.

Las referencias de cada nueva curva histórica y familia documentada están en su campo `source`, accesible al seleccionar el ejemplo. Entre ellas:

- [Bicorne](https://mathworld.wolfram.com/Bicorn.html), [ampersand](https://mathworld.wolfram.com/AmpersandCurve.html), [judía](https://mathworld.wolfram.com/BeanCurve.html), [mariposa séxtica](https://mathworld.wolfram.com/ButterflyCurve.html), [piriforme](https://mathworld.wolfram.com/PiriformCurve.html), [mancuerna](https://mathworld.wolfram.com/DumbbellCurve.html), [curva del diablo](https://mathworld.wolfram.com/DevilsCurve.html).
- [Deltoide](https://mathworld.wolfram.com/Deltoid.html), [nefroide](https://mathworld.wolfram.com/Nephroid.html), [cardioide](https://mathworld.wolfram.com/Cardioid.html), [evoluta de la elipse](https://mathworld.wolfram.com/EllipseEvolute.html), [evoluta de la parábola](https://mathworld.wolfram.com/ParabolaEvolute.html).
- [Kepler](https://mathworld.wolfram.com/KeplersFolium.html), [bifolium](https://mathworld.wolfram.com/Bifolium.html), [kappa](https://mathworld.wolfram.com/KappaCurve.html), [campila](https://mathworld.wolfram.com/KampyleofEudoxus.html), [cisoide](https://mathworld.wolfram.com/CissoidofDiocles.html), [estrofoide](https://mathworld.wolfram.com/Strophoid.html), [tractriz](https://mathworld.wolfram.com/Tractrix.html).
- [Cayley](https://mathshistory.st-andrews.ac.uk/Curves/Cayleys/), [Maclaurin](https://mathshistory.st-andrews.ac.uk/Curves/Trisectrix/), [Tschirnhausen](https://mathworld.wolfram.com/TschirnhausenCubic.html), [Neile](https://mathshistory.st-andrews.ac.uk/Curves/Neiles/), [tridente de Newton](https://mathshistory.st-andrews.ac.uk/Curves/Trident/), [cúbicas de Newton](https://mathshistory.st-andrews.ac.uk/Curves/Newtons/).
- [Nicomedes](https://mathworld.wolfram.com/ConchoidofNicomedes.html), [Sluze](https://mathshistory.st-andrews.ac.uk/Curves/Conchoidsl/), [Dürer](https://mathshistory.st-andrews.ac.uk/Curves/Durers/), [Watt](https://mathshistory.st-andrews.ac.uk/Curves/Watts/), [Perseo](https://mathshistory.st-andrews.ac.uk/Curves/Spiric/).
- [Cassini](https://mathworld.wolfram.com/CassiniOvals.html), [Cassini multifocal](https://mathcurve.com/courbes2d/cassinienne/cassinienne.shtml), [Descartes](https://mathshistory.st-andrews.ac.uk/Curves/Cartesian/), [hipopeda](https://mathworld.wolfram.com/Hippopede.html).
- [Lamé y Gielis](https://mathworld.wolfram.com/Superellipse.html), [rosas de Grandi](https://mathworld.wolfram.com/RoseCurve.html), [Lissajous](https://mathshistory.st-andrews.ac.uk/Curves/Lissajous/), [perlas de Sluze](https://mathshistory.st-andrews.ac.uk/Curves/Pearls/), [simetrías de Goursat](https://mathcurve.com/courbes2d/goursat/goursat.shtml).
- [Lemniscatas de Mandelbrot](https://mathworld.wolfram.com/MandelbrotSetLemniscate.html). Las variantes Multibrot generalizan la iteración a potencias enteras.

Los textos y las composiciones son propios; los enlaces de variantes describen la familia matemática, no la selección particular de parámetros. Las miniaturas se calculan con las ecuaciones y encuadres del graficador.

## Diseño y mantenimiento

`curve-examples.ts` conserva los 124 ejemplos anteriores y añade `extended-curve-examples.ts`. Las familias se generan con listas finitas de parámetros y con identificadores estables. Se evitan lotes de traslaciones o rotaciones destinados únicamente a incrementar la cantidad. Cada ejemplo indica su tipo: clásica, variante o composición.

La galería muestra páginas de 48 tarjetas. La búsqueda recorre todos los ejemplos, acepta varias palabras e ignora las tildes; incluye los nombres de familia. Cambiar búsqueda, categoría o tipo vuelve a la primera página. Las imágenes se cargan de forma diferida.

Funciones nuevas del teclado:

- `superformula(t,m,n1,n2,n3,a=1,b=1)`: radio de la superfórmula de Gielis, con dominio y periodicidad explicados en la ayuda. Los ejemplos con m impar usan a=b y n2=n3 para cerrar el contorno en una vuelta.
- `mandelbrotRadius(x,y,n=3,p=2)`: módulo de una iteración compleja finita, con límites de orden y potencia para mantener el coste acotado. Los niveles |zₙ|=2 son aproximaciones finitas, no la frontera fractal exacta.

Las expresiones polares expanden radio y ángulo a `hypot(x,y)` y `atan2(y,x)`. Las curvas históricas de múltiples ramas usan ecuaciones cartesianas para conservarlas. Los detalles menores que una celda y los puntos aislados no se garantizan con marching squares; el ejemplo con punto aislado lo explica.

## Validación

`npm run generate:curve-previews` reconstruye todos los SVG y rechaza ejemplos sin suficientes contornos a resolución 96×96. Las pruebas de `curve-examples.spec.ts` comprueban identificadores, tipos, encuadres y contornos finitos en todo el catálogo, además de comparar bicorne, deltoide, nefroide y Cayley con sus parametrizaciones. Las pruebas del catálogo comprueban identidades y dominios de las funciones nuevas; las del componente verifican búsqueda, tipo y paginación.

La ampliación pasó 37 pruebas del graficador y del catálogo en ChromeHeadless. La comprobación del navegador incluye paginación, búsqueda sin tildes, filtros por tipo y categoría, estados vacíos, enlaces de fuentes, dibujo de Gielis y Multibrot, encuadre y foco, miniaturas y ausencia de desbordamiento a 1440, 390 y 320 píxeles.
