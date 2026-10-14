# Reconocimiento de las 88 constelaciones

El juego `/games/constellations` incluye las 88 constelaciones de la UAI, tanto en las preguntas como en el atlas. Permite rondas de 10 figuras o de todas las figuras del grupo elegido:

- Norte: 43, incluidas las que cruzan el ecuador celeste.
- Sur: 60, incluidas las que cruzan el ecuador celeste.
- Todo el cielo: 88, sin duplicados.

Hay 15 regiones compartidas por los grupos norte y sur. La clasificación se calcula con los extremos de declinación de los límites de cada región, no con una lista arbitraria de figuras ni con la visibilidad desde una ubicación terrestre. Los trazados de estrellas son ayudas tradicionales; las constelaciones oficiales son regiones del cielo.

Serpens conserva la cabeza y la cola como dos trazados desconectados de una sola constelación. No se añade una línea entre ambas partes. Canis Minor y Canes Venatici tienen trazados de dos estrellas: son figuras válidas y no se excluyen por tener menos de tres puntos.

Se mantiene la versión 1 del progreso local, las figuras dominadas y los récords anteriores de 10/17 preguntas. Los récords de las nuevas rondas completas usan su propio número de preguntas, evitando comparar puntuaciones de rondas de distinta duración.

## Datos y regeneración

Fuente: [d3-celestial](https://github.com/ofrohn/d3-celestial), bajo BSD-3-Clause; licencia en `src/assets/licenses/d3-celestial.txt`. Lista y nombres oficiales: [UAI](https://www.iau.org/IAU/IAU/Astronomy-FAQs/Constellations.aspx).

`node scripts/build-constellation-catalog.cjs <directorio>` necesita estos archivos de la carpeta `data` de d3-celestial, renombrados así:

| Archivo de entrada | Archivo de d3-celestial |
| --- | --- |
| lines.json | constellations.lines.json |
| stars.json | stars.8.json |
| names.json | starnames.json |
| boundaries.json | constellations.bounds.json |
| constellations.json | constellations.json |
| dsos-all.json | dsos.14.json |
| messier.json | messier.json |
| dsonames.json | dsonames.json |
| LICENSE | LICENSE del repositorio |

Se necesitan estrellas hasta magnitud 8 para incluir todos los puntos de los trazados. El generador comprueba las coincidencias de coordenadas y las etiquetas, agrupa los dos registros de Serpens y conserva las pistas originales de `constellation-curation.txt`. Las 55 pistas adicionales y las correcciones de nombres están en `constellation-extra-tips.json`.

El catálogo generado es local: el navegador no necesita descargar estos datos al jugar. Las cartas mantienen la proyección gnomónica y el ajuste de escala propios del juego.

## Verificación

El catálogo incluye 97 objetos de cielo profundo representativos en 52 constelaciones. La selección está en `scripts/constellation-deep-sky.json`; el generador verifica sus posiciones contra los límites de la constelación y ajusta el encuadre para incluirlos. Galaxias, nebulosas, nebulosas planetarias, cúmulos abiertos y globulares tienen símbolos distintos. Sus centros tienen posiciones reales, pero el tamaño y la forma de los símbolos son esquemáticos.

Los objetos aparecen en el atlas y en el nivel Explorador. En los niveles superiores se revelan con la ayuda de nombres o después de responder. El control de objetos permite ocultarlos; la lista indica sus nombres y tipos. Muchos requieren prismáticos o telescopio.

```sh
npm run test:constellations
npm run build -- --configuration development
npm run test:constellations:browser
```

Las pruebas comprueban los 88 identificadores oficiales, los grupos, las dos partes de Serpens, las coordenadas y segmentos, las rondas sin repeticiones, la puntuación y la compatibilidad del progreso. La auditoría de Chrome recorre las nueve combinaciones de grupo/nivel y el atlas completo, con tamaños de ordenador, tableta y móvil.
