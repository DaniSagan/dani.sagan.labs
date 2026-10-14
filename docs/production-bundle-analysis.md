# Análisis del paquete de producción — 14 de octubre de 2026

## Resultado y corrección de la medición anterior

La compilación con los valores predeterminados del Angular CLI y el presupuesto original de 1 MB produce **492,96 KB de descarga inicial sin comprimir**, con una transferencia estimada de **116,17 KB**. No necesita ampliar el presupuesto por tamaño.

La cifra anterior de 1,60 MB procedía del script auxiliar que instanciaba Architect sin registrar `json.schema.transforms.addUndefinedDefaults`. Angular CLI sí registra esa transformación. Al faltar el valor predeterminado `aot: true`, el builder usaba JIT (`jit: !aot`); el compilador de Angular aparecía dos veces, aportando unos 945 KB. Esa prueba no representaba la compilación de GitHub Actions.

La comprobación reproduce producción con los valores del CLI y los presupuestos existentes. Solo desactiva la inserción de Google Fonts durante la compilación, por la restricción de red local; los enlaces externos se conservan. No verifica un despliegue remoto ni garantiza acceso a fuentes externas desde GitHub Actions. No se han cambiado rutas, funcionalidades ni presupuestos del proyecto.

## Desglose inicial

| Archivo o grupo | Tamaño aproximado sin comprimir |
| --- | ---: |
| JavaScript inicial total | 382,34 KB |
| CSS global | 110,62 KB |
| Total inicial | 492,96 KB |
| Tema Material, incluido en CSS global | 84,35 KB |
| CSS Leaflet, incluido en CSS global | 10,81 KB |
| Angular Forms, incluido en JavaScript inicial | 34,46 KB |

Los tamaños de bibliotecas son atribuciones de esbuild y no suman exactamente el tamaño de los archivos por el código de enlace. El presupuesto mide archivos sin comprimir; la transferencia estimada no es una medición real del servidor. Fuentes, imágenes y descargas posteriores no se incluyen en ese total inicial.

## Oportunidades, ordenadas por impacto

1. **Separar los artículos por ruta.** El archivo de artículos pesa 5,47 MB y su grafo JavaScript estático añade aproximadamente 6,18 MB respecto al arranque. Las rutas usan referencias `component` y los catálogos importan las clases, por lo que abrir un artículo carga el conjunto. Convertir rutas a `loadComponent` y catálogos a metadatos independientes permitiría conservar todo el contenido y descargar cada artículo al abrirlo. Es la mejora más relevante para la navegación; no reduce directamente el presupuesto inicial.
2. **Revisar la precarga especulativa.** `IdlePreloadingStrategy` programa todas las secciones aproximadamente 1,2 segundos después y al quedar libre el navegador. Ahorra esperas al navegar, pero puede descargar los grandes paquetes de artículos, juegos y herramientas aunque el visitante permanezca en la portada. Mantiene excepciones para ahorro de datos y 2G. Priorizar intención de navegación y recursos pequeños reduciría consumo sin eliminar herramientas.
3. **Cargar el tema Material solo donde se usa o crear un tema limitado.** El tema global aporta unos 84 KB; portada, cabecera, menú y pie no utilizan componentes Material en sus fuentes. Hay que validar todas las pantallas Material antes de retirarlo o dividirlo. Es un ahorro potencial, no una reducción medida tras un cambio.
4. **Cargar CSS Leaflet con sus herramientas.** Aproximadamente 11 KB iniciales evitables en páginas sin mapas, verificando marcadores, controles y rutas de recursos de GitHub Pages.
5. **Revisar FormsModule en AppModule.** La plantilla raíz no necesita formularios; los consumidores ya tienen importaciones locales. Parte del código de Forms podría desplazarse a rutas diferidas. Los aproximadamente 34 KB atribuidos son un techo orientativo, no un ahorro garantizado.

La portada añade unos 27,64 KB de JavaScript estático al paquete inicial. Mandelbrot no forma parte del arranque: sus módulos aportan unos 42,28 KB en el paquete diferido de artículos y su trabajador unos 8,04 KB independientes. Sus mejoras no justifican ampliar el presupuesto inicial.

## Publicación y recomendación

`.github/workflows/main.yaml` solicita `build_configuration: production` y publica `dist/dani.sagan.labs/browser` con base `/dani.sagan.labs/`. El presupuesto inicial actual pasa en la comprobación equivalente al CLI. Persisten avisos de estilos y de dependencias CommonJS; no impiden esta compilación.

Conservar el límite de 1 MB. Priorizar rutas individuales de artículos y precarga por intención; después reducir CSS global. No es necesario recortar contenido ni calidad de las visualizaciones.

## Evidencia local

- `tmp/bundle-analysis-cli/stats.json`: compilación con valores del CLI y presupuesto original.
- `tmp/bundle-analysis-aot/stats.json`: contraste con AOT explícito, 495,75 KB iniciales; la diferencia menor procede de otros valores predeterminados del CLI.
- `tmp/bundle-analysis/stats.json`: reproducción de la medición auxiliar JIT incorrecta.
- `tmp/build-bundle-analysis-cli.cjs`: script de reproducción con valores predeterminados del CLI.
- `tmp/analyze-bundle.cjs`: atribuciones de bibliotecas y grafos de carga estáticos.

