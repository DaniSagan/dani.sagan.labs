# LaTeX Studio

Ruta: `/tools/latex-editor`, accesible desde el catálogo y el menú de herramientas.

MathLive 0.109.2 proporciona selección, edición visual, entrada táctil y huecos. El catálogo incluye 493 símbolos de sus definiciones y plantillas adicionales. LaTeX es extensible: no existe un catálogo finito de todos los comandos de todos los paquetes. Las macros y los paquetes compatibles dependen del motor. Los caracteres de fuentes privadas sin equivalente Unicode se excluyen del catálogo de botones.

La navegación estructural usa rangos del texto original, conservando entradas incompletas. Reconoce argumentos, fracciones, exponentes, raíces, sumandos y celdas de matrices/sistemas. La selección visual utiliza las APIs públicas de MathLive. Fragmentos parciales de comandos, macros personalizadas y algunas estructuras avanzadas pueden no corresponder a un rango visual completo; se conserva su selección en el código.

El teclado tiene familias, búsqueda y páginas de 12 teclas. El modo de pantalla completa compacta las dos vistas en móvil para mantener accesibles la fórmula, los controles y las teclas. La vista visual admite desplazamiento horizontal para fórmulas largas.

## Persistencia

Una cookie por documento, más una cookie con el documento activo; prefijo `dsl_formula_v1_`, ruta relativa a la base de despliegue, SameSite=Strict y Secure en HTTPS. Caducidad: un año desde la última modificación. Máximo: 16 documentos, 3800 bytes codificados por documento y 7000 bytes totales para evitar cabeceras HTTP excesivas. Los errores de capacidad/cookies bloqueadas se muestran al usuario; nunca se trunca el LaTeX. JSON permite conservar fórmulas mayores. Cambiar de documento cuando no se ha podido guardar requiere confirmar la pérdida de cambios. La biblioteca elimina individualmente con confirmación y Privacidad elimina todas las cookies del editor.

El JSON versionado incluye expresión, nombre, colores, tamaño, transparencia y escala. Importar crea una identidad nueva y no sobrescribe documentos existentes. Se valida el formato y se limita el tamaño del archivo.

## Exportación

MathJax SVG se carga al exportar, en un bloque separado. El SVG contiene los glifos como trazados y es independiente de fuentes y servidores externos. PNG rasteriza esos trazados a escala 1–4. Las imágenes tienen margen; se rechazan tamaños superiores a 32 millones de píxeles o 16000 píxeles por lado.

## Verificación

```sh
npm run build -- --configuration development
npm run test:latex-editor:browser
```

El script utiliza Chrome y CDP, comprueba navegación, selecciones repetidas, clics reales del teclado, envolver expresiones, deshacer/rehacer, entrada incompleta, cookies/recarga, biblioteca, exportaciones, tacto y pantalla completa. Capturas: `tmp/latex-audit`; descargas: `tmp/latex-downloads`. Se comprueban anchos de 1440, 768, 390 y 320 píxeles.

La compilación optimizada se puede comprobar con `optimization.fonts=false` cuando la red impide descargar Google Fonts; esto mantiene las optimizaciones de scripts/estilos y los límites de presupuesto. La configuración habitual no se modifica.

Para regenerar el catálogo tras actualizar MathLive: `npm run generate:latex-keyboard`.
