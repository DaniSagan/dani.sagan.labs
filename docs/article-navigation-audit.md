# Cobertura del menú lateral de artículos

Revisión del 18 de octubre de 2026.

Se contrastan las rutas efectivas (incluidas las rutas diferidas de trigonometría y las tres páginas de integración), los componentes de artículos con ruta propia y los enlaces recursivos del menú.

Antes: **434 rutas y 423 enlaces**, con 11 artículos ausentes. Después: **434 rutas, 434 componentes y 434 enlaces únicos**, sin destinos inexistentes ni artículos sin registrar. La página de prueba ya existente sigue en «Otros».

## Artículos recuperados

| Artículo | Ruta | Ubicación en el menú |
| --- | --- | --- |
| Función de Cantor y distribuciones singulares | /articles/cantor-function | Fractales → Medida y dimensión |
| Tamiz de Apolonio | /articles/apollonian-sieve | Fractales → Autosimilitud y conjuntos geométricos |
| Muestreo estratificado y estimadores ponderados | /articles/stratified-sampling | Probabilidad → Muestreo y estimación |
| Causalidad, confusión y experimentos aleatorizados | /articles/causal-inference | Probabilidad → Estadística descriptiva y dependencia |
| Bootstrap y estimación por remuestreo | /articles/bootstrap | Probabilidad → Muestreo y estimación |
| Potencia estadística y errores de contraste | /articles/statistical-power | Probabilidad → Inferencia y contrastes |
| Intervalos para proporciones: Wilson y métodos exactos | /articles/proportion-intervals | Probabilidad → Muestreo y estimación |
| Distribuciones t de Student y chi-cuadrado | /articles/student-chi-square | Probabilidad → Variables aleatorias y distribuciones |
| Covarianza, dependencia y varianza de una suma | /articles/covariance | Probabilidad → Estadística descriptiva y dependencia |
| Desigualdades de Markov y Chebyshev | /articles/probability-inequalities | Probabilidad → Fundamentos y probabilidad condicionada |
| Ley de los grandes números | /articles/large-numbers-law | Probabilidad → Fundamentos y probabilidad condicionada |

## Prevención

El proveedor del menú obtiene todas sus colecciones de los mismos catálogos que utiliza ArticlesRoutingModule. Se eliminan las listas manuales duplicadas de probabilidad, fractales, curvas, polígonos y sólidos platónicos. La agrupación temática se conserva; un artículo aún sin clasificar aparece en «Otros temas» de su categoría.

Covarianza aparece en **Probabilidad → Estadística descriptiva y dependencia**. Probabilidad distingue ahora descripción y dependencia, muestreo y estimación, e inferencia y contrastes.

## Validación

- npm run test:article-navigation: compara las rutas reales, los componentes y el menú; comprueba destinos, duplicados, títulos y ubicación de covarianza.
- Pruebas Angular del proveedor: igualdad entre ROUTES y el menú, y ubicación de covarianza.
- npm run test:article-navigation:browser, después de compilar: comprueba todos los enlaces del menú, recorre los 11 artículos recuperados, busca covarianza y verifica el panel móvil y el enlace activo.
- Compilación de desarrollo.
