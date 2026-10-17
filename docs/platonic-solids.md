# Sólidos platónicos

Los cinco artículos mantienen sus rutas `/articles/{tetrahedron,hexahedron,octahedron,dodecahedron,icosahedron}-viewer` y sus componentes independientes. Cada plantilla contiene su construcción cartesiana, derivación de radios, ángulos, área y volumen, dualidad, ejercicios y referencias.

`polyhedron-model.ts` calcula la envolvente convexa de conjuntos pequeños de vértices centrados. Agrupa puntos coplanarios en caras poligonales: un pentágono es una cara, no tres triángulos con falsas diagonales. Las coordenadas de `platonic-models.ts` se normalizan a **arista unitaria**. Se calculan las áreas por triangulación, el volumen mediante productos mixtos y los radios y ángulos desde las coordenadas.

`PolyhedronLabComponent` recibe un modelo geométrico; no decide el contenido de los artículos. Muestra materiales físicos, luces de entorno, contornos poligonales, selección de caras, etiquetas de vértices, dual por centros de caras, radios, esferas, separación de caras y el diedro interior en una sección perpendicular a la arista. Incluye órbita táctil, vistas desde los ejes, giro opcional, tabla de coordenadas y PNG. La representación se normaliza a R = 1; las medidas y coordenadas de la tabla usan la arista seleccionada. La separación de caras no modifica las medidas del sólido original.

El bucle de dibujo trabaja fuera de Angular y omite el renderizado fuera de pantalla. Se respeta la preferencia de movimiento reducido. Al abandonar la ruta se cancelan la animación, observadores y eventos, y se liberan geometrías, materiales, entorno, controles y contexto del renderer. Si WebGL falla, las medidas y coordenadas siguen accesibles.

## Comprobaciones

```sh
node scripts/test-platonic-solids.cjs
node node_modules/@angular/cli/bin/ng.js build --configuration=development
node scripts/check-platonic-pages.cjs
```

La prueba matemática contrasta los cinco modelos con fórmulas cerradas independientes: incidencias, Euler, convexidad, longitud de cada arista, coplanaridad, dual, áreas, volúmenes, radios y ángulos. También renderiza las 70 fórmulas de los artículos y ejercicios con MathJax local.

La auditoría de Chrome comprueba geometría dibujada, capas, selección, órbita, tablas, exportación y anchos de 1440, 768, 390 y 320 píxeles. Intercepta las peticiones al CDN de MathJax 3.2.2 y sirve los mismos módulos desde la dependencia instalada para validar sin red externa; la configuración de carga de la aplicación no cambia. También verifica la liberación del renderer al navegar entre artículos. Capturas en `tmp/platonic-audit`; imágenes exportadas en `tmp/platonic-downloads`.
