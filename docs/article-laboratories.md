# Laboratorios interactivos de artículos

Cada artículo es responsable de su configuración, textos, cálculos y pruebas, ubicados junto a su componente. `MathLabComponent` recibe una definición del artículo y solo presenta controles, gráficas y resultados; no conoce temas ni rutas.

Cada artículo tiene un componente standalone propio, siete secciones de desarrollo, un laboratorio de dos controles y tres ejercicios con soluciones desplegables. Comparten la tipografía, paleta, contenedores y gráficos de los artículos existentes.

| Artículo | Ruta | Problemas |
| --- | --- | --- |
| [Distribuciones de Bernoulli y binomial](../src/app/articles/probability/bernoulli-binomial/bernoulli-binomial-article.component.html) | /articles/bernoulli-binomial | 076 |
| [Distribución normal y tipificación](../src/app/articles/probability/normal-distribution/normal-distribution-article.component.html) | /articles/normal-distribution | 087, 088, 089 |
| [Transformaciones de variables y de sus momentos](../src/app/articles/probability/moment-transformations/moment-transformations-article.component.html) | /articles/moment-transformations | 082, 086 |
| [Probabilidad en espacios finitos: sucesos y regla de Laplace](../src/app/articles/probability/finite-probability/finite-probability-article.component.html) | /articles/finite-probability | 005, 071, 074 |
| [Derivadas: definición, interpretación y reglas](../src/app/articles/calculus/derivative-foundations/derivative-foundations-article.component.html) | /articles/derivative-foundations | 048, 049, 051, 052, 053, 054, 055, 056, 057, 058 |
| [Exponenciales y logaritmos: propiedades y ecuaciones](../src/app/articles/analysis/exponentials-logarithms/exponentials-logarithms-article.component.html) | /articles/exponentials-logarithms | 042, 051, 052, 053, 059 |
| [Geometría analítica de la recta y la circunferencia](../src/app/articles/geometry/line-circle/line-circle-article.component.html) | /articles/line-circle | 026, 037 |
| [Rectas y planos en el espacio: posiciones relativas](../src/app/articles/geometry/lines-planes/lines-planes-article.component.html) | /articles/lines-planes | 019, 028, 029, 030 |
| [Sistemas diferenciales lineales y exponencial de matrices](../src/app/articles/calculus/linear-ode-systems/linear-ode-systems-article.component.html) | /articles/linear-ode-systems | 060, 017, 020 |
| [Integrales primeras y cantidades conservadas](../src/app/articles/dynamical-systems/first-integrals/first-integrals-article.component.html) | /articles/first-integrals | 060, 097 |
| [Medida cero y dimensión fractal](../src/app/articles/fractals/zero-measure-dimension/zero-measure-dimension-article.component.html) | /articles/zero-measure-dimension | 100 |

Se añadieron 36 referencias distribuidas entre 32 problemas. Todos los artículos incluyen enlaces de vuelta a esos problemas, artículos relacionados, una herramienta y un juego con una actividad contextualizada.

Los laboratorios calculan probabilidades, áreas, momentos, secantes, inversas, intersecciones, proyecciones, flujos, energías y etapas de Cantor. Las vistas geométricas preservan la proporción de los ejes; la proyección espacial se identifica como perspectiva, y los valores métricos se calculan en 3D. Se distinguen cálculos exactos del modelo, aproximaciones numéricas y propiedades de conjuntos límite.

Validación de la separación: 36 pruebas automatizadas de modelos locales, integración por artículo y comportamiento del componente genérico; comprobación con Chrome de las once rutas, fórmulas MathJax, extremos de controles, restablecimiento, navegación por secciones y anchos de 390, 768 y 1440 píxeles; comprobación de enlaces de los 32 problemas y auditoría de referencias de los 100 problemas.

La compilación de producción también pasa. Angular emite avisos de presupuestos de tamaño y dependencias CommonJS; no hay errores de compilación.
