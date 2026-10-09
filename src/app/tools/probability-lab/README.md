# Laboratorio de probabilidad y estadística

Ruta: `/tools/probability-lab`. Componente standalone con carga diferida.
Mantiene los estilos de controles del laboratorio de sistemas dinámicos.

## Contenido

- 24 familias de distribuciones y una galería de variantes y aplicaciones.
- Densidad o masa, CDF, cuantiles, selección de intervalos, comparación con otra
  familia, muestreo y suavizado KDE. En las leyes discretas cada barra representa
  la frecuencia de un entero, independientemente del número de bins.
- 16 experimentos: tres mecanismos de Bertrand, Monte Carlo para π, cumpleaños,
  Monty Hall, coleccionista, desarreglos, selección óptima, paseos aleatorios,
  tiempo de ocupación, ruina, Benford, dígitos uniformes, dados y rachas.
- Los 13 conjuntos originales Datasaurus se distribuyen como un recurso local;
  cuatro conjuntos Anscombe y diez escenarios sintéticos completan la galería.
- Dispersión con edición de puntos, regresiones por grupo y agregadas, Pearson,
  Spearman con rangos empatados, residuos, histogramas, caja y Q–Q.
- Muestreo repetido con intervalos t o Z, bootstrap percentil de media/mediana,
  permutación bilateral Monte Carlo y actualización bayesiana Beta–Bernoulli.
- Visualizadores existentes de Galton, Buffon, cumpleaños, Monty Hall, Bayes y
  límite central integrados mediante sus componentes originales.
- Modo práctica, CSV, PNG y enlaces con ejemplo, parámetros, semilla y datos.

## Cálculo y límites

Se reutilizan la semilla del límite central, la CDF normal de Galton, las
funciones de cumpleaños y Monty Hall, Bayes y logGamma del graficador.
Gamma y beta incompletas se evalúan mediante series/fracciones continuas;
los cuantiles continuos mediante acotación y bisección. Las curvas son una
representación numérica, no un sistema de álgebra simbólica.

La ventana inicial cubre cuantiles 0,005–0,995. Se muestran singularidades de
densidad con muestras interiores a la ventana, sin asignar masa puntual.
Una media/varianza inexistente o infinita se señala sin sustituirla por cero.
CDF(−∞)=0 y CDF(+∞)=1 también para Fisher y las distribuciones de cola pesada.

Hasta 10000 resultados por simulación y 2000 observaciones propias. Las
trayectorias conservan 60 realizaciones (hasta 10000 puntos de π/dígitos),
1500 puntos por camino y límites explícitos para procesos de duración aleatoria.
Las simulaciones se ejecutan por lotes cancelables para conservar la interacción.
KDE usa como máximo 2000 observaciones. Los widgets tienen sus controles propios.

Los intervalos paramétricos requieren sus hipótesis; Cauchy no tiene una media
poblacional que cubrir. Bootstrap percentil no garantiza buena cobertura.
La permutación compara exclusivamente los grupos 0 y 1 y requiere
intercambiabilidad. El intervalo posterior bayesiano es creíble, no frecuentista.
Los bigotes de la caja llegan al mínimo y máximo, y se identifican como tales.

Las fuentes de cada ejemplo están en `probability-examples.ts`; la atribución y
licencia de Datasaurus están en `src/assets/probability-lab/README.md`.

## Validación

Las pruebas cubren CDF/cuántiles/muestreo de cada familia, parámetros de todos
los presets, valores de referencia, Anscombe, Simpson, remuestreo reproducible,
convergencia de ocho experimentos y estados de entrada inválida del componente.
La comprobación de navegador recorre las áreas, los recursos locales, un widget
integrado y la vista móvil sin desbordamiento horizontal.
