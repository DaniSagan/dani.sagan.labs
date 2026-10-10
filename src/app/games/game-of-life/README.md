# Juego de la vida

Simulación de Conway B3/S23 sobre un plano sin bordes, con edición y navegación mediante un canvas. El tamaño visible no limita la evolución ni reserva memoria para cada casilla vacía.

## Estructura

- `game-of-life.component.*`: controles, selector de patrones, importación/exportación y gestos de cámara.
- `game-of-life.model.ts`: catálogo tipado, búsqueda y transformaciones de la cámara.
- `src/assets/game-of-life/life-worker.js`: simulación y renderizado fuera del hilo de Angular; envía imágenes transferibles del estado visible.
- `src/assets/game-of-life/life-engine-adapter.js`: adapta la carga masiva del motor a coordenadas de más de 32 bits y evita el redondeo de logaritmos en los límites de potencias de dos.
- `src/assets/game-of-life/life-io.js`: validación RLE y macrocell. Rechaza reglas diferentes, dimensiones incoherentes y referencias inválidas antes de sustituir el universo.
- `catalog.json` y `patterns/*.json`: índice y paquetes de patrones cargados a demanda.

El motor HashLife utiliza un quadtree compartido y resultados memorizados. El renderizador recorre únicamente los nodos visibles, omite regiones vacías y agrega los detalles menores que un píxel. El hilo principal conserva los controles disponibles; «Interrumpir y volver al inicio» permite terminar el worker y recuperar la semilla si un cálculo resulta demasiado costoso.

HashLife funciona especialmente bien con regiones repetitivas. Una semilla caótica puede requerir mucho más tiempo y memoria; no se promete un ritmo fijo para cualquier patrón.

## Catálogo y créditos

El catálogo incluye **4.009 patrones**, de los cuales **60** tienen una presentación propia en español. Los RLE originales y sus comentarios de autoría se conservan en los paquetes. Los nombres y comentarios originales se muestran en el archivo completo. La selección está en `scripts/data/life-curated.tsv`.

Fuentes:

- LifeWiki: <https://conwaylife.com/wiki/Main_Page>.
- Copia archivada de la colección, publicada en 2023: <https://github.com/cobyj33/llcacodec-test-data>, directorio `lifewiki`.
- Ejemplos adicionales y motor: <https://github.com/copy/life> y <https://copy.sh/life/examples/>.
- Documentación de HashLife: <https://golly.sourceforge.io/Help/Algorithms/HashLife.html>.

La copia archivada no representa todos los descubrimientos posteriores. `catalog-report.json` registra los archivos excluidos por formato o incompatibilidad. El motor de Fabian Hemmer se distribuye bajo BSD-2-Clause; su texto íntegro está en `vendor/LICENSE`. Los créditos propios de cada patrón permanecen en sus cabeceras originales.

## Límites prácticos

- No existe una matriz de filas × columnas ni un borde donde desaparezcan las células.
- Las coordenadas de entrada y las dimensiones visibles admiten enteros de hasta ±2⁵⁰ y 2⁵⁰, respectivamente; los cálculos utilizan números de JavaScript.
- Los saltos son potencias de dos, hasta 2³⁰ generaciones por paso. La generación total debe mantenerse dentro de los enteros seguros de JavaScript.
- La población se señala como aproximada cuando supera los enteros seguros.
- La siembra aleatoria admite un millón de casillas iniciales. Esta restricción afecta a la generación aleatoria, no al tamaño del universo.
- La importación RLE expande como máximo dos millones de células; macrocell mantiene regiones repetidas comprimidas. RLE exporta hasta 500.000 células y conserva posición y generación. Para poblaciones superiores se ofrece macrocell.
- Los archivos de importación admiten hasta 32 MB. El tiempo y la memoria disponibles siguen dependiendo del dispositivo y de la estructura del patrón.

## Validación y regeneración

```powershell
npm run test:life-engine
node node_modules/@angular/cli/bin/ng.js test --watch=false --browsers=ChromeHeadless --include=src/app/games/game-of-life/*.spec.ts
```

La prueba del motor compara cien generaciones de una semilla aleatoria con una implementación independiente, comprueba un salto de un millón de generaciones de un planeador, prueba posiciones lejanas y los límites de precisión, y verifica las conversiones RLE/macrocell y todos los archivos del catálogo.

Para regenerar el archivo, descarga las copias ZIP de los dos repositorios indicados como `tmp/lifewiki-catalog.zip` y `tmp/life-patterns.zip`, conserva la selección comentada y ejecuta:

```powershell
npm run generate:life-catalog
npm run test:life-engine
```

El generador lee directamente los ZIP y escribe los paquetes JSON; no necesita extraer miles de archivos ni instalar dependencias adicionales.
