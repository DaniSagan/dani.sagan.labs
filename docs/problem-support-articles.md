# Fundamentos para resolver problemas

Diez artículos independientes, integrados en sus catálogos temáticos, rutas y menú. Cada componente conserva su propio estado, cálculos y plantilla. Reutilizan los elementos generales existentes `FormulaComponent`, `LearningPlotComponent`, `LEARNING_IMPORTS` y los estilos de artículos de aprendizaje; no introducen un componente, modelo o registro de ejecución exclusivo para este conjunto.

| Artículo y ruta | Exploración propia |
| --- | --- |
| Identidades algebraicas y técnicas de factorización · `/articles/algebraic-identities-factorization` | Completar cuadrados y desplazar el vértice de una parábola. |
| Valor absoluto: distancias y funciones a trozos · `/articles/absolute-value-distance` | Centro, radio y región permitida por una desigualdad de distancia. |
| Cómo demostrar: implicaciones, contradicción y contraposición · `/articles/proof-strategies` | Tabla lógica que distingue implicación, contraposición y recíproco. |
| Árboles de probabilidad y experimentos por etapas · `/articles/probability-trees` | Extracciones con y sin reposición, probabilidades de ramas y caminos. |
| Extremos globales y teorema de Weierstrass · `/articles/global-extrema-weierstrass` | Extremos alcanzados frente a cotas, bordes excluidos y discontinuidades. |
| Derivadas parciales y minimización en varias variables · `/articles/partial-derivatives-minimization` | Ajuste de dos parámetros con residuos, pérdida y gradiente. |
| Cambios de base y matrices de una transformación · `/articles/change-of-basis` | Coordenadas, reconstrucción y pérdida de independencia. |
| Grafos desde cero: grados, caminos y conectividad · `/articles/graph-foundations` | Grafo editable, grados, componentes, adyacencia y criterio euleriano. |
| Factoriales, exponentes primos y fórmula de Legendre · `/articles/factorials-legendre` | Contribuciones por potencias primas y ceros finales. |
| Función de distribución, colas y probabilidades acumuladas · `/articles/distribution-functions-tails` | Distribución geométrica y densidad triangular, acumuladas, colas y masas. |

Los artículos incluyen ejemplos desarrollados, ejercicios con solución y 45 referencias recíprocas con problemas. Otros 28 artículos existentes enlazan a los nuevos fundamentos.

## Validación

- `npm run test:problem-support-articles`: modelos matemáticos, casos límite y degenerados, enumeraciones de urnas y grafos, factoriales exactos, fórmulas, enlaces y sintaxis Angular.
- `npm run test:problem-support-articles:browser`: ejecutar después de compilar en desarrollo. Comprueba las diez páginas en Chrome, fórmulas, controles, reinicio, ejercicios, enlaces de ida y vuelta y anchos de 1440, 390 y 320 píxeles. Sirve localmente los archivos instalados de MathJax para que la auditoría no dependa del CDN.
- `npm run test:additional-problems`: integridad de los problemas y sus referencias.
- `npx ng build --configuration development`: compilación Angular/AOT.

El generador de problemas conserva las referencias adicionales que ya existan en los metadatos de cada componente y las vuelve a incluir en su plantilla.

## Revisión de conceptos en todos los problemas

La auditoría del 18 de octubre de 2026 amplía este trabajo a los 200 problemas. Consulta el [inventario completo de conceptos y recursos](problem-concepts-audit.md). Añade dos artículos de fundamentos algebraicos y amplía Ruffini en la página de división polinómica. Los enlaces aparecen en las soluciones y en un panel desplegable de repaso; se mantienen referencias de vuelta desde los artículos.
