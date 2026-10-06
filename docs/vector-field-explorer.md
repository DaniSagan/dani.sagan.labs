# Explorador de campos vectoriales y sistemas dinámicos

Ruta: `/tools/vector-field`. Componente independiente con carga diferida desde la navegación de Herramientas.

## Interacción

Dos expresiones numéricas con sintaxis JavaScript definen dx/dt y dy/dt. Se permiten operaciones aritméticas, comparaciones, condicionales y llamadas al catálogo; se rechazan accesos a propiedades, cadenas, asignaciones, declaraciones y nombres globales del navegador. Esta restricción también se aplica al recuperar enlaces. Se admiten x, y, t, el catálogo matemático del graficador implícito y parámetros de una letra con subíndices como a_1. Los parámetros se detectan automáticamente. Cada familia de la galería carga sus valores, intervalos y pasos; los exponentes que requieren enteros se validan.

Pulsa el lienzo o introduce coordenadas para añadir condiciones iniciales, hasta 32. La malla añade 25 puntos. Se pueden deshacer puntos, borrar trayectorias y comparar órbitas hacia adelante y atrás. Arrastre, zoom centrado en el cursor, Ctrl + rueda y pellizco permiten explorar el encuadre. Los cambios de parámetros conservan el encuadre. El modo de zoom táctil se activa con su control para mantener el desplazamiento habitual de la página.

Las partículas se integran en tiempo físico: sus desplazamientos no están normalizados por velocidad. El plano muestra flechas normalizadas en longitud y coloreadas por rapidez, dirección, divergencia o vorticidad. Hay resplandor, cuadrícula y nulclinas. La animación respeta inicialmente la preferencia de movimiento reducido, se detiene en pestañas ocultas y cancela su bucle al salir del componente. La resolución se adapta al tamaño y a la densidad de píxeles del dispositivo.

## Motor y análisis

Dormand–Prince 5(4) con estimación de error local, tolerancia relativa/absoluta combinada y rechazo de pasos acotado. La integración usa el tiempo de cada etapa; no congela los campos no autónomos. Cada órbita tiene un presupuesto de 2500 pasos aceptados y termina al completar el tiempo, salir del encuadre o encontrar dificultades numéricas. No es un integrador especializado en sistemas rígidos: el modelo de Rosenbrock puede consumir el presupuesto de pasos.

Las nulclinas se obtienen con el trazador de contornos del graficador implícito. En sistemas dependientes del tiempo se muestran en el instante indicado. La búsqueda de equilibrios emplea Newton amortiguado desde una malla de puntos, Jacobiano por diferencias centrales y deduplicación. Es aproximada, puede omitir raíces y no demuestra estabilidad no lineal en casos no hiperbólicos. No clasifica los ceros instantáneos de campos temporales como equilibrios autónomos.

Las series temporales muestran x(t) e y(t) de la última trayectoria. El muestreo estroboscópico marca t₀+kT mediante interpolación sobre los pasos aceptados. En sistemas periódicamente forzados debe elegirse el periodo de la fuerza. No equivale a una sección espacial de Poincaré, ni calcula exponentes de Lyapunov o estructuras coherentes lagrangianas.

## Galería y fuentes

49 familias en 11 categorías, cada una con una miniatura calculada desde su ecuación. Las variantes numéricas se exploran con parámetros y no duplican tarjetas. Búsqueda sin tildes, filtros y paginación de 12 tarjetas. Las composiciones originales y las extensiones se describen explícitamente.

Referencias consultadas el 7 de octubre de 2026:

- [MathWorld: Lotka–Volterra](https://mathworld.wolfram.com/Lotka-VolterraEquations.html), [péndulo](https://mathworld.wolfram.com/Pendulum.html), [Rayleigh](https://mathworld.wolfram.com/RayleighDifferentialEquation.html), [Mathieu](https://mathworld.wolfram.com/MathieuDifferentialEquation.html), [SIR](https://mathworld.wolfram.com/SIRModel.html), [Rosenbrock](https://mathworld.wolfram.com/RosenbrockFunction.html).
- [Scholarpedia: Van der Pol](https://www.scholarpedia.org/article/Van_der_Pol_model), [Duffing](https://www.scholarpedia.org/article/Duffing_oscillator), [FitzHugh–Nagumo](https://www.scholarpedia.org/article/FitzHugh-Nagumo), [Morris–Lecar](https://www.scholarpedia.org/article/Morris-Lecar), [Hopf](https://www.scholarpedia.org/article/Andronov-Hopf), [Bogdanov–Takens](https://www.scholarpedia.org/article/Bogdanov-Takens_bifurcation), [Brusselator en Rank One Chaos](https://www.scholarpedia.org/article/Rank_One_Chaos).
- [Shadden Lab, UC Berkeley: doble giro dependiente del tiempo](https://shaddenlab.berkeley.edu/uploads/LCS-tutorial/examples.html). Se reproduce su campo de velocidades, no su análisis FTLE.

En SIR, x e y son fracciones de susceptibles e infectados; la región física satisface x≥0, y≥0, x+y≤1. El resto del plano es la extensión matemática de las ecuaciones. En Morris–Lecar, x es voltaje e y activación del canal de potasio. Los parámetros de conductancia fijados en la ecuación son una selección del modelo, no datos de un paciente.

## Exportación y mantenimiento

PNG guarda el plano con sus capas. CSV incluye el identificador de trayectoria, dirección, tiempo, x e y en cada paso aceptado. Los enlaces compartidos contienen ecuaciones, parámetros, encuadre, duración y condiciones iniciales con sus tiempos de lanzamiento. El portapapeles necesita un contexto compatible con la API del navegador.

`npm run generate:vector-previews` regenera las 49 miniaturas. Las pruebas verifican conservación de energía, integración temporal y hacia atrás, terminaciones, clasificación local, validez de todos los modelos, parámetros y comportamientos del componente. La auditoría de navegador recorre los modelos y comprueba animación, pausa, clics, controles, errores y anchos de 1440, 390 y 320 píxeles.
