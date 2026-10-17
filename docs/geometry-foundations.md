# Conceptos de geometría para leer los sólidos platónicos

Se añaden 17 artículos independientes a la colección de Geometría. Cada componente tiene su plantilla, definición, deducción, ejemplo, laboratorio SVG manipulable, advertencias sobre confusiones frecuentes, ejercicio con solución y referencias.

| Grupo | Rutas bajo /articles/ |
| --- | --- |
| Vectores y planos | vector-norm, dot-product, cross-product, scalar-triple-product, plane-normal |
| Ángulos y unidades | complementary-supplementary-angles, radians, steradians, dihedral-angle |
| Transformaciones y centros | homothety, convex-hull, barycenter |
| Regularidad y dualidad | schlafli-symbol, polyhedral-duality, apothem |
| Figuras inscritas y circunscritas | incircles-circumcircles, inspheres-circumspheres |

Los productos escalar, vectorial y mixto tienen artículos separados. Radianes y estereorradianes se explican por separado, igual que las circunferencias planas y las esferas espaciales. El artículo anterior vector-products conserva sus aplicaciones y enlaza las nuevas definiciones.

## Organización e integración

- geometry/foundations/geometry-foundations-articles.ts recoge los componentes, incluidos desde GEOMETRY_ARTICLES. Las rutas, el módulo y el proveedor del menú consumen esa colección.
- Los grupos del menú se curan en shared/content/article-navigation-groups.ts.
- Cada artículo posee su estado y sus cálculos. geometry-lab.ts comparte únicamente operaciones matemáticas y proyección de diagramas; foundation-article.css comparte presentación.
- Las referencias se enlazan dentro de la prosa, sin alterar fórmulas ni anidar enlaces. Se distingue el contexto: la norma algebraica de Pell no es la euclídea, el complemento de un grafo no es un ángulo complementario y la dualidad proyectiva enlaza su apartado específico.
- Las proyecciones oblicuas y las vistas normalizadas se identifican en los pies de figura para evitar interpretar las longitudes de pantalla como medidas geométricas.
- Las fuentes se incluyen en cada artículo: OpenStax, BIPM y MathWorld. Las derivaciones y ejemplos se han escrito para esta web.

## Validación

```sh
npm run test:geometry-foundations
node node_modules/@angular/cli/bin/ng.js build --configuration=development
npm run test:geometry-foundations:browser
```

La prueba matemática cubre los 17 modelos, incluidos casos degenerados y cambios de signo. Contrasta centros de circunferencias mediante distancias y la identidad de Euler, comprueba duales polares con sus desigualdades de apoyo y renderiza las 70 fórmulas con MathJax local. Audita destinos de enlaces, referencias entrantes y algunos contextos que no deben enlazarse.

La auditoría de Chrome comprueba los 17 artículos a 1440, 390 y 320 píxeles: controles reales en sus extremos, actualización de resultados y SVG, ejercicios desplegables, fórmulas renderizadas y navegación. También sigue referencias desde los cinco sólidos platónicos y desde artículos de determinantes, pentágonos, Brianchon y Cauchy–Schwarz.

El servidor de pruebas responde a las peticiones del CDN de MathJax 3.2.2 con los archivos de la dependencia local. La configuración de la aplicación no cambia; las pruebas no dependen de la disponibilidad de ese CDN. Las capturas se guardan en tmp/geometry-foundations-audit.

