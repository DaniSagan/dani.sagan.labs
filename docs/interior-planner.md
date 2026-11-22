# Editor de interiores 2D

Ruta: `/tools/interior-planner`. Se registra en el enrutador diferido, el menú de herramientas, la portada de herramientas y el manifiesto generado de descubrimiento aleatorio. No necesita backend ni nuevas dependencias.

## Uso

Para invertir una puerta, selecciónala y cambia **Sentido de apertura** (interior/exterior) o **Lado de las bisagras** en el inspector. Pulsa **Aplicar cambios**. La orientación se conserva al guardar y exportar el plano; las puertas anteriores mantienen su apertura hacia el interior y sus bisagras hacia el inicio de la pared.

En **Habitaciones**, selecciona el espacio y pulsa **Eliminar habitación activa**. Tras confirmar, se borran también sus muebles, elementos de pared y anotaciones; las definiciones de la biblioteca se conservan. **Deshacer** recupera la habitación y su contenido. El botón se desactiva cuando solo queda una habitación, porque el proyecto necesita al menos una.

1. El proyecto inicial tiene una habitación de 327 × 266 cm. Añade habitaciones rectangulares, en L o pentagonales, dibuja vértices o introduce pares `x,y; x,y` con punto decimal en la unidad seleccionada.
2. En modo Seleccionar, cada pared desbloqueada muestra un rombo con «+» en su punto medio. Púlsalo (o enfócalo y usa Enter/Espacio) para insertar un vértice y dividirla en dos tramos iguales. La operación se puede deshacer; si un elemento cruza el punto de división, se conserva el estado anterior y aparece un aviso. Selecciona una pared. Introduce longitud, ángulo, espesor y alturas de ambos extremos. **Aplicar pared** conserva el vértice inicial y mueve el final; la pared siguiente se adapta para cerrar el contorno. Las paredes bloqueadas impiden mover sus extremos. Los cruces se rechazan y se recupera el estado anterior. Las cotas son medidas de referencia, no restricciones persistentes.
3. Arrastra un mueble desde la biblioteca, o pulsa para situarlo alrededor del centroide. Ajusta posición, dimensiones, giro y color en el inspector. Arrastra vértices para modificar la habitación. La rueda amplía respecto al cursor; los botones permiten ampliar en tablet. Desplazar arrastra el plano con ratón o un dedo. La herramienta Medir calcula la distancia entre dos puntos.
4. En el inspector de la pared, usa **Añadir puerta** o **Añadir ventana** para colocarlas en un tramo libre: la puerta parte de la distancia predeterminada al inicio y la ventana busca el centro. Selecciona el hueco o su botón en Objetos y anotaciones para editar su posición, anchura, altura y altura al suelo (antepecho). El formulario **Puertas, ventanas e instalaciones** permite introducir estas medidas antes de añadirlo. Los huecos deben caber en la pared, incluidas sus alturas bajo un techo inclinado; las paredes bloqueadas impiden añadirlos o modificarlos. En planta se interrumpe el rayado y las caras de la pared: las puertas muestran hoja y arco hacia el interior, y las ventanas muestran jambas y líneas de vidrio. Esta representación también se exporta. Abre el alzado de la pared elegida. Sus coordenadas son X horizontal y Z vertical, con origen en el inicio de la pared a nivel del suelo. Alturas distintas generan una pendiente recta. Añade puertas, ventanas o instalaciones con anchura, altura, distancia al inicio y altura al suelo. Los cuatro anclajes son: inicio, final, centro y fracción de longitud. El inicio sigue el orden de vértices del contorno, visible por la numeración de paredes en planta.
5. Diseña un mueble en **Diseñar un mueble**. Sus dimensiones se introducen explícitamente en mm. Rectángulos, elipses, formas en L, chaise longue y polígonos normalizados producen geometría, no imágenes. El radio redondea las esquinas poligonales mediante arcos circulares SVG y se limita localmente para que las aristas vecinas no se inviertan. Reflejar cambia la orientación de la chaise. Guarda la definición y pulsa su botón en la biblioteca personal para colocarla en cualquier proyecto.
6. El guardado automático espera 600 ms y confirma la transacción IndexedDB antes de mostrar «Guardado». Guarda también con Ctrl+S. Descarga JSON como copia de seguridad. Importar crea un proyecto con identificador nuevo, preservando las relaciones internas. La biblioteca personal se importa/exporta por separado.
7. Exporta la vista activa a SVG o PNG. Para PDF usa la previsualización y el diálogo de impresión del navegador. Selecciona A4/A3, orientación y escala. Desactiva ajustar al papel y utiliza 100 % para conservar la escala: una longitud de 1000 mm ocupa 20 mm a 1:50. La vista impresa incluye título, habitación y escala. Comprueba el encaje: los planos grandes pueden superar una hoja; no se teselan automáticamente.

Atajos cuando el foco está en el editor, fuera de formularios: Ctrl+Z, Ctrl+Y o Ctrl+Mayús+Z, Ctrl+D, Ctrl+C/V, Supr y Escape. Flechas desplazan 10 mm; Mayús+flecha desplaza 100 mm. Los campos y las listas de objetos ofrecen edición sin arrastre. En móvil los paneles se apilan; en tablet el inspector se sitúa debajo del plano.

Después de añadir una puerta, ventana o instalación, selecciónala en el dibujo o en **Objetos y anotaciones**. El editor del elemento aparece al principio del inspector; **Editar elemento seleccionado** lleva hasta él. Puedes cambiar posición, referencia de anclaje, altura al suelo, anchura y altura, y confirmar conjuntamente con **Aplicar cambios**. **Descartar cambios** recupera las propiedades guardadas. Los cambios pendientes del formulario no alteran el plano ni se guardan automáticamente hasta aplicarlos. Cambiar la referencia de posición conserva la posición física actual.

También puedes arrastrar elementos de pared: en planta el movimiento se proyecta sobre la dirección de la pared, incluidas las oblicuas; en alzado modifica la posición horizontal y la altura respecto al suelo. El arrastre conserva el tipo de anclaje y se registra como una sola operación de deshacer. Los valores inválidos restauran el estado anterior y dejan un aviso; una pared bloqueada impide editar o arrastrar sus elementos. La cuadrícula se utiliza cuando está activado el ajuste.

Los vértices de la planta se pueden seleccionar con ratón, Enter/Espacio sobre su control o mediante **Seleccionar vértice** en el inspector. El punto seleccionado se resalta y muestra sus coordenadas X e Y en la unidad actual. Las coordenadas válidas se aplican automáticamente tras 300 ms sin escribir; Enter o **Aplicar coordenadas** las confirman inmediatamente. Cada actualización valida el contorno y actualiza paredes, cotas y superficie como una operación de deshacer. Los campos vacíos o no numéricos no se interpretan como cero; un cambio inválido conserva la última geometría válida y muestra el error. **Descartar coordenadas** cancela el cambio que aún esté pendiente; para revertir una actualización ya aplicada utiliza Deshacer. Un vértice unido a una pared bloqueada se puede inspeccionar, pero no mover. La selección se limpia al cambiar de habitación o elegir otro tipo de elemento y las actualizaciones pendientes no se aplican a otra selección.

Los controles de vértices se representan sobre las esquinas de la cara interior, calculadas con el espesor de las dos paredes adyacentes. En uniones biseladas o transiciones colineales de espesor se sitúan en el centro del segmento de unión interior. Las coordenadas numéricas, el desplegable, la cuadrícula y el arrastre corresponden a ese punto visible: introducir (0,0) coloca la esquina interior en el origen. Para conservar el formato existente de los proyectos, `moveInteriorVertex` calcula el vértice interno de referencia mediante el contorno desplazado hacia fuera y, para uniones especiales, una corrección iterativa con Newton amortiguado; comprueba una tolerancia de 0,0000001 mm y valida el contorno antes de confirmar. Los demás vértices visibles se mantienen fijos; los ejes internos se reconstruyen para respetar el espesor. Un fallo de convergencia, bloqueo o geometría inválida conserva el estado anterior. La selección no modifica el documento y los cambios siguen formando una sola operación de deshacer.

Las longitudes y los ángulos de pared se calculan entre los vértices interiores visibles. `setInteriorWall` conserva la esquina inicial y coloca la final a la distancia y al ángulo solicitados, con validación antes de confirmar. Planta, inspector, alzado y exportaciones usan la misma distancia; el origen de los anclajes de puertas e instalaciones corresponde al inicio de ese segmento interior. El formato JSON mantiene los ejes como representación interna. Las mediciones de área y perímetro del contorno de referencia conservan su criterio anterior, descrito más adelante.

## Arquitectura

| Archivo en `src/app/tools/interior-planner` | Responsabilidad |
| --- | --- |
| `cad-model.ts` | Dominio persistente, unidades, factorías e identificadores UUID |
| `cad-geometry.ts` | Predicados, medidas, transformaciones, contornos, arcos, anclajes y edición dirigida |
| `cad-document.ts` | Validación del formato y transacciones de historial |
| `cad-storage.ts` | IndexedDB, proyectos y biblioteca independientes |
| `cad-export.ts` | Escena SVG independiente del DOM, PNG y descargas |
| `interior-planner.component.*` | Controlador de interacción, estado de viewport y paneles Angular |

Se ha elegido SVG nativo por la edición vectorial, hit testing de elementos, transformación de coordenadas mediante CTM y exportación sin rasterizar. No se añade un motor 3D ni otra librería gráfica. Angular 17, FormsModule y CommonModule ya existen en el repositorio. La inspección de LaTeX Studio encontró persistencia en cookies con validación y confirmación; sus límites no son adecuados para CAD. No hay un servicio compartido general de persistencia ni un sistema global de traducciones que reutilizar. Los textos de interfaz están concentrados en la plantilla; tipos y almacenamiento no dependen del idioma. Algunas etiquetas y estados se definen en el controlador siguiendo el patrón del proyecto.

### Geometría y coordenadas

La unidad canónica es mm. Los factores de presentación son 1, 10, 1000 y 25,4 para mm, cm, m y pulgadas. El zoom nunca modifica el documento. La planta usa X hacia la derecha e Y hacia abajo; el alzado almacena Z positiva y lo representa mediante Y SVG negativa. Las instancias usan coordenadas locales con origen en la esquina superior izquierda del mueble antes del giro. Las coordenadas poligonales de definiciones se normalizan entre 0 y 1 y se multiplican por anchura y profundidad.

El SVG mantiene proporciones mediante `xMidYMid meet`. `cad-viewport.ts` calcula la extensión realmente visible cuando la proporción del visor difiere de la del `viewBox`: cuadrícula, fondo y máscara de huecos cubren también ese espacio adicional. Un `ResizeObserver` actualiza sus dimensiones al cambiar el ancho del panel, el tamaño de pantalla o la vista ampliada. El cálculo no modifica la cámara ni las coordenadas del documento; el zoom y el puntero conservan la transformación SVG existente.

La cuadrícula se dibuja como una capa final sobre paredes, muebles y controles, con `pointer-events="none"` para conservar todas las interacciones. Las líneas cada 1000 mm se distinguen de la retícula base y los ejes X=0 e Y=0 tienen mayor contraste. Cuando una celda de 10 mm ocupa al menos 5 píxeles aparece la subcuadrícula de 1 cm; mientras está visible y el ajuste está activado, los arrastres de vértices, muebles e instalaciones, así como dibujo y medición, utilizan pasos de 10 mm. El espaciado base configurado se recupera al alejar el zoom. Las medidas numéricas siguen admitiendo valores exactos independientes de la retícula. El estado inferior indica la resolución activa; las exportaciones mantienen su presentación sin cuadrícula.

El contorno de una habitación es implícitamente cerrado. La pared `walls[i]` conecta `vertices[i]` con el vértice siguiente. Sus identificadores permanecen al editar. Insertar un vértice por división crea una nueva pared, interpola la altura y redistribuye los elementos según sus posiciones físicas; rechaza la división que atraviesa un hueco. Los espesores están centrados sobre el eje y se dibujan con remates redondeados: no se resuelven uniones físicas por inglete. El área y el perímetro se refieren al contorno de ejes, **no a superficie útil descontando espesores**.

Tolerancia base: 1e-6 mm, con escala de longitud en el test de pertenencia a segmento. La longitud mínima de arista es 0,1 mm; el área mínima, 1 mm². Se comprueban finitud, límites, cruces, coincidencias y retrocesos colineales. El máximo es 200 vértices por contorno. Los cambios inválidos restauran el documento completo anterior. El cálculo del centroide usa el área firmada, por lo que admite ambas orientaciones.

La edición dirigida de longitud y ángulo es un subconjunto explícito de restricciones. No se implementa un solucionador de sistemas de restricciones ni se anuncian estados de sub/sobrerrestricción. La pared siguiente cambia al mover el extremo; un bloqueo adyacente impide esa edición. Las operaciones se confirman como transacciones completas, incluidas las relaciones. El historial conserva hasta 80 documentos en memoria y no se serializa.

Los contornos de colisión son exactos para polígonos sin redondear y simplificados para curvas. Los redondeos se comprueban mediante el polígono original, por lo que puede haber falsos positivos; las elipses se muestrean en 96 segmentos y pueden omitir contactos muy pequeños. Se detectan cruces de aristas y concavidades incluso cuando todos los vértices del mueble están dentro. Los avisos comparan con el contorno de referencia, no con la cara interior del espesor. No son un informe constructivo ni normativo.

### Relaciones de mobiliario

Una definición contiene geometría paramétrica, dimensiones, color y nombre. Varias instancias referencian esa definición. La posición, giro, bloqueo y visibilidad pertenecen a la instancia. Editar tamaño o color desde el inspector crea una definición independiente para preservar las otras instancias. Editar y guardar una definición de biblioteca actualiza todas sus instancias todavía vinculadas **del proyecto actual**; otros proyectos conservan su copia. Las dimensiones parciales del brazo y cuerpo deben ser menores que el tamaño total. Los alzados no inventan una representación de muebles a partir de la planta: esta versión solo muestra arquitectura e instalaciones.

### Persistencia y esquema JSON

Base IndexedDB `dsl-interior-cad`, versión 1. Almacenes `projects` y `library`, ambos con clave `id`. Cada proyecto es una instantánea autocontenida: sus entidades tienen identificadores estables pero no se descomponen en registros independientes. La biblioteca personal se almacena separadamente y se incorpora al proyecto al utilizar una definición. Las transacciones de escritura se resuelven en `oncomplete`; fallos de cuota o acceso dejan un mensaje de error y permiten descargar JSON. Las escrituras se encolan para impedir que una instantánea antigua sobrescriba otra reciente. Un guardado durante arrastre utiliza el último documento confirmado. Al salir de la ruta se intenta guardar inmediatamente, pero el cierre abrupto de la pestaña antes del debounce puede perder el último cambio. No hay sincronización entre pestañas; evita editar el mismo proyecto simultáneamente.

El formato de proyecto es el tipo `CadDocument`:

```text
schemaVersion: 1
id, name, updated (ISO), unit (mm|cm|m|in), precision (0..4)
rooms[]: id, name, vertices[{x,y}], walls[]
walls[]: id, name, thickness, height, endHeight, color, locked
definitions[]: id, name, category, shape, width, depth, height,
               armWidth, bodyDepth, radius, mirrored, color, points[{x,y}]
instances[]: id, definitionId, roomId, x, y, rotation, locked, hidden
fixtures[]: id, roomId, wallId, kind, name, offset, z, width, height, anchor, color
annotations[]: id, roomId, x, y, text
```

`offset` se expresa en mm salvo para anclaje proporcional (fracción de longitud). El centro representa el desplazamiento del centro del elemento respecto al centro de la pared. SVG y PNG no constituyen formatos de documento editable. El JSON no incluye selección, herramienta, cursor, historial, viewport ni referencias DOM. La validación comprueba tipos, límites, ids únicos, referencias, colores y contornos antes de aceptar un proyecto; el importador limita el archivo a 8 MB. `parseDocument` es el punto de entrada para futuras migraciones: al no existir un formato anterior, ahora rechaza versiones distintas de 1 en lugar de inventar una migración. La importación de biblioteca valida toda la lista antes de escribir, aunque un fallo de cuota a mitad de las escrituras puede dejar algunas definiciones importadas.

Los datos no salen del navegador. La página de privacidad describe este almacenamiento y permite borrar expresamente la base CAD sin afectar a datos ajenos del origen.

## Pruebas

```text
npm run test:interior-planner
npx ng build --configuration development
npm run test:interior-planner:browser
npm run test:budgets
node scripts/generate-random-pages.cjs --check
```

El test de navegador sirve `dist/dani.sagan.labs/browser` en un puerto efímero e inicia Chrome headless con perfil aislado. Usa CDP ya disponible en el repositorio, sin dependencias adicionales; `CHROME_BIN` permite cambiar la ruta. Comprueba interfaz real con ratón, campos, Ctrl+Z, importación File, recarga/IndexedDB y touch. Incluye reutilización de muebles entre habitaciones, una pentagonal con edición de longitud y ángulo, chaise reflejada y alineada con pared oblicua, descargas reales JSON/SVG/PNG (comprobando la anchura PNG en su cabecera) y un fallo simulado de almacenamiento que no debe aparecer como guardado. Guarda capturas en `tmp/interior-planner-audit` y descargas en un directorio temporal distinto en cada ejecución. El build de desarrollo es necesario para las aserciones que inspeccionan estado mediante la API de depuración Angular. Los tests del núcleo transpilan los módulos TypeScript y comprueban geometría y serialización; el build AOT verifica tipos y plantillas.

Validación de esta entrega: compilación de desarrollo y TypeScript, tests geométricos, test de navegador y compilación de producción con los presupuestos existentes cumplidos. La prueba de presupuestos desactiva solo la descarga de fuentes externas en una configuración temporal, sin modificar `angular.json`. Los seis tests de privacidad pasan con un launcher temporal de Chrome que añade `--no-sandbox --disable-gpu --remote-debugging-port=0`; el launcher predeterminado no arrancó en este entorno por el proceso GPU. No se ha ejecutado la suite completa de tests de todos los artículos y juegos. No se han certificado escalas mediante una impresora física ni generado un PDF automáticamente en las pruebas.

## Alcance y próximas fases

El encargo completo describe un producto CAD amplio. Esta entrega implementa un subconjunto funcional; **no equivale a todos sus requisitos**. Quedan pendientes: primitivas de construcción libre con arcos/Bézier, booleanas y polígonos con huecos, grupos y componentes jerárquicos, selección múltiple, snapping a paredes/aristas, restricciones persistentes generales, paredes compartidas, unión física de espesores, perfiles de alzado con varios segmentos y alzados independientes, cotas angulares/radiales/conductoras, bibliotecas arquitectónicas exhaustivas, apertura doble/corredera, barrido de puerta y detección de bloqueo de instalaciones, área libre por unión exacta, distancias mínimas entre objetos, capas, calibración de imágenes, variantes, DXF y exportador PDF autónomo. La búsqueda actual filtra por nombre. No hay reglas de paso ni recomendaciones normativas.

Para ampliar mobiliario: añade una factoría en `cad-model.ts`; para una forma nueva, amplía `Shape`, validación, `outline` y `furniturePath` antes del selector de UI. Un nuevo elemento de pared requiere ampliar `FixtureKind`, validador, etiqueta, opciones y su representación en ambas escenas. Las operaciones booleanas deberán incorporarse con una librería robusta y sus tests, sin tratarlas como concatenación de trazados SVG. El render interactivo y el exportador comparten geometría, pero tienen capas de presentación distintas: cualquier símbolo nuevo necesita pruebas en los dos.
