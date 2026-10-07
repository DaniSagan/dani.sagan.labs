# Laboratorio de álgebra lineal

Ruta: `/tools/linear-algebra`. Componente independiente cargado bajo demanda.

El laboratorio combina sistemas de hasta seis incógnitas, Gauss–Jordan guiado y manual, transformaciones 2D, vistas espaciales giratorias, formas cuadráticas, iteraciones discretas y mínimos cuadrados. La galería incluye referencias a Georgia Tech, TU Delft, MIT y Wolfram MathWorld, consultadas durante su desarrollo. Los ejemplos y sus descripciones son variantes didácticas originales.

## Convenciones

El editor de matrices es un componente compartido (`app-matrix-editor`) con una celda por coeficiente, columnas alineadas y separación visual para b. Los selectores permiten cambiar el número de ecuaciones e incógnitas preservando el término independiente de cada fila. Intro avanza a la siguiente celda y las flechas verticales cambian de fila. También admite pegar matrices completas y ofrece un campo de importación como texto.

En el formato de texto, cada fila contiene los coeficientes de A seguidos del término independiente b. Separadores: espacios, tabulaciones o comas; filas separadas por saltos de línea o punto y coma. No usar espacios dentro de un coeficiente compuesto en el formato de texto. Las celdas individuales permiten espacios dentro de expresiones, que se eliminan al serializar. Ejemplo:

```text
1 t 0
t 1 0
```

Las expresiones admiten números decimales, fracciones, `t`, paréntesis, operadores aritméticos y potencias enteras de 0 a 8. Un analizador sintáctico evalúa las expresiones sin ejecutar código. Las fracciones usan bigint con simplificación por máximo común divisor y un límite de 600 cifras. Las entradas se limitan a 7000 caracteres, seis filas, seis incógnitas y 160 caracteres por coeficiente.

Gauss, rangos, determinantes, inversas, soluciones particulares, bases del núcleo y ecuaciones normales son exactos. En mínimos cuadrados deficientes de rango se ofrece una solución particular y se explica la no unicidad; no se afirma que sea la pseudoinversa ni el representante de norma mínima.

## Parámetros

Para A cuadrada con entradas polinómicas se calcula det A(t) simbólicamente, con grado limitado a 32. Las raíces reales se localizan numéricamente mediante puntos críticos y bisección. Las candidatas racionales con denominador hasta 1000 se verifican exactamente antes de clasificarlas. Una raíz no certificada se muestra aproximada y no se clasifica sustituyendo su decimal. El cálculo de raíces aproximadas no es una certificación formal de todas las raíces, especialmente en polinomios mal condicionados. Los ejemplos también aportan valores excepcionales analizados explícitamente. Los coeficientes racionales con denominadores variables requieren discusión manual; sus polos se distinguen de sistemas incompatibles.

El barrido de parámetros es discreto, no una discusión simbólica exhaustiva. Para matrices rectangulares o determinantes idénticamente nulos debe recurrirse a menores y rangos.

## Visualización e integración

El canvas representa rectas en dos dimensiones y secciones de planos con el cubo [−E, E]³ en tres, con arrastre para girar la cámara. La vista espacial usa perspectiva: la profundidad en coordenadas de cámara modifica la escala aparente. Un deslizador permite reducirla hasta la proyección ortogonal. Las doce aristas del cubo delimitan el encuadre. Las secciones se calculan cortando las aristas con cada plano y ordenando los vértices del polígono convexo. Las rectas de intersección se recortan contra las mismas seis caras. Los planos se ordenan según su profundidad de cámara y las intersecciones se dibujan encima con líneas discontinuas. Las geometrías fuera del encuadre o detrás de la cámara pueden quedar ocultas. Las transformaciones 2 × 2 incluyen círculo unidad, cuadrícula, figura radial, área unidad, direcciones propias y órbitas discretas. Los autovalores y valores singulares son aproximados; el menor valor singular usa el producto de valores singulares para evitar cancelación en matrices casi singulares. Se reutilizan `axisTicks`, `niceStep` y `traceContours` del graficador implícito para cuadrículas y formas cuadráticas.

La interpolación lineal entre I y A puede pasar por matrices singulares incluso si A es ortogonal. El modo módulo 1 solo define una aplicación del toro independiente del representante para matrices enteras. La conexión con sistemas dinámicos transfiere la matriz actual como x′ = Ax a través del formato compartido ya existente; esta dinámica continua se distingue de las iteraciones discretas del laboratorio.

El modo práctica oculta diagnóstico, soluciones guiadas y puntos solución. Ofrece pistas a demanda. Se exportan imágenes PNG e informes JSON con la solución guiada y el historial manual. Los enlaces recuperan matriz, parámetro y tipo de vista.

## Validación

`linear-math.spec.ts` verifica seguridad del analizador, clasificación de rangos, inversas, raíces de parámetros, estabilidad del valor singular pequeño y, para toda la galería, las identidades Ax = b, Av = 0 y Aᵀr = 0.

