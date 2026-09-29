import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

export const DIOPHANTINE_EXERCISES: readonly ExerciseDefinition[] = [
  {
    title: 'Básico · ¿Existe algún punto entero?',
    question: '¿Tiene soluciones enteras 14x + 21y = 10?',
    choices: ['No', 'Sí'],
    answer: 'No',
    hints: [
      'Calcula el MCD de los coeficientes.',
      'gcd(14,21) = 7.',
      'Estrategia: una combinación de múltiplos de 7 sigue siendo múltiplo de 7.',
      'Desarrollo: 10 = 7·1 + 3, así que 7 no divide 10.',
    ],
    solution:
      'No existe solución entera. Sí existen soluciones racionales, como (5/7,0), y toda una recta de soluciones reales.',
  },
  {
    title: 'Básico · Una solución particular',
    question: 'En 2x + 3y = 7, fija y = 1. ¿Qué valor de x obtienes?',
    answer: '2',
    hints: [
      'Sustituye y antes de despejar.',
      '2x + 3 = 7.',
      'Estrategia: resta 3 a ambos miembros.',
      'Desarrollo: 2x = 4, luego x = 2.',
    ],
    solution:
      '(2,1) es una solución particular. La familia completa es x = 2 + 3t, y = 1 − 2t, t entero.',
  },
  {
    title: 'Básico · El salto correcto',
    question:
      'A partir de (−1,3), ¿qué familia resuelve completamente 84x + 30y = 6?',
    choices: [
      'x = −1 + 5t, y = 3 − 14t',
      'x = −1 + 30t, y = 3 − 84t',
      'x = −1 + 5t, y = 3 + 14t',
    ],
    answer: 'x = −1 + 5t, y = 3 − 14t',
    hints: [
      'El MCD es 6.',
      'Divide ambos coeficientes por 6 para obtener el vector primitivo.',
      'Estrategia: usa (b/d,−a/d).',
      'Desarrollo: 30/6 = 5 y −84/6 = −14.',
    ],
    solution:
      'La primera familia es completa. La segunda produce solo los parámetros múltiplos de 6 de la primera; la tercera ni siquiera conserva la ecuación.',
  },
  {
    title: 'Básico · Comprobar no es adivinar',
    question: '¿Resuelve (x,y) = (4,−11) la ecuación 84x + 30y = 6?',
    choices: ['Sí', 'No'],
    answer: 'Sí',
    hints: [
      'Calcula las dos contribuciones por separado.',
      '84·4 = 336.',
      'Estrategia: conserva el signo de y.',
      'Desarrollo: 30·(−11) = −330; suma 336 − 330.',
    ],
    solution:
      'Sí: 336 − 330 = 6. Corresponde a t = 1 en la familia (−1 + 5t, 3 − 14t).',
  },
  {
    title: 'Intermedio · Euclides y un factor',
    question:
      'Alguien presenta 35·2 + 22·(−3) = 4 como una identidad para el MCD. Explica el error y halla x₀ para 35x + 22y = 3 usando el Bézout correcto 35u + 22v = 1 con u = −5.',
    answer: '-15',
    hints: [
      'La igualdad 70 − 66 = 4 es cierta, pero 4 no es gcd(35,22).',
      '35·(−5) + 22·8 = 1.',
      'Estrategia: multiplica una identidad para el MCD por c/d = 3.',
      'Desarrollo: x₀ = 3·(−5), y₀ = 3·8.',
    ],
    solution:
      'x₀ = −15, y₀ = 24: −525 + 528 = 3. Todas las soluciones son x = −15 + 22t, y = 24 − 35t.',
  },
  {
    title: 'Intermedio · No negativas y positivas',
    question: '¿Cuántas soluciones con x,y ≥ 0 tiene 3x + 5y = 30?',
    answer: '3',
    hints: [
      'Una familia cómoda es x = 5t, y = 6 − 3t.',
      'x ≥ 0 implica t ≥ 0.',
      'Estrategia: intersecta esa condición con y ≥ 0.',
      'Desarrollo: 6 − 3t ≥ 0 equivale a t ≤ 2.',
    ],
    solution:
      't = 0,1,2: (0,6), (5,3), (10,0). Hay tres no negativas, pero solo (5,3) es estrictamente positiva.',
  },
  {
    title: 'Intermedio · Una ventana finita',
    question:
      '¿Cuántas soluciones de 84x + 30y = 6 cumplen −6 ≤ x ≤ 9 y −25 ≤ y ≤ 17?',
    answer: '4',
    hints: [
      'Usa x = −1 + 5t, y = 3 − 14t.',
      'La primera cota equivale a −1 ≤ t ≤ 2.',
      'Estrategia: resuelve también la doble desigualdad de y, invirtiendo los signos al dividir por −14.',
      'Desarrollo: −25 ≤ 3 − 14t ≤ 17 da otra vez −1 ≤ t ≤ 2.',
    ],
    solution:
      'Los cuatro valores t = −1,0,1,2 dan (−6,17), (−1,3), (4,−11), (9,−25).',
  },
  {
    title: 'Intermedio · De recta a congruencia',
    question: '¿Qué clase describe las coordenadas x de 6x + 15y = 9?',
    choices: ['x ≡ 4 (mod 5)', 'x ≡ 4 (mod 15)', 'x ≡ 3 (mod 5)'],
    answer: 'x ≡ 4 (mod 5)',
    hints: [
      'Reduce la ecuación módulo 15.',
      '6x ≡ 9 (mod 15) se divide entre 3 reduciendo también el módulo.',
      'Estrategia: resuelve 2x ≡ 3 (mod 5).',
      'Desarrollo: el inverso de 2 es 3; x ≡ 9 ≡ 4.',
    ],
    solution:
      'x = 4 + 5t y y = (9 − 6x)/15 = −1 − 2t. Módulo 15, x ocupa las tres clases 4, 9 y 14.',
  },
  {
    title: 'Intermedio · Encontrar la solución perdida',
    question:
      'Se propone x = 1 + 6t, y = −1 − 4t como solución general de 4x + 6y = −2. ¿Es completa?',
    choices: ['No: omite (4,−3)', 'Sí: siempre satisface la ecuación'],
    answer: 'No: omite (4,−3)',
    hints: [
      'Comprueba primero que (1,−1) es una solución.',
      'El MCD es 2; el salto primitivo es (3,−2).',
      'Estrategia: compara ambos vectores de desplazamiento.',
      'Desarrollo: la propuesta solo toma uno de cada dos puntos de (1 + 3s,−1 − 2s).',
    ],
    solution:
      'No es completa. (4,−3) satisface 16 − 18 = −2, pero exigiría t = 1/2 en la propuesta. Generar soluciones no demuestra generarlas todas.',
  },
  {
    title: 'Avanzado · Necesidad y suficiencia',
    question:
      'Para (a,b) ≠ (0,0), demuestra que ax + by = c tiene solución entera si y solo si gcd(a,b) divide c.',
    hints: [
      'Necesidad: todo divisor común divide cada combinación entera.',
      'Suficiencia: parte de au + bv = d.',
      'Estrategia: escribe c = kd y escala los coeficientes de Bézout.',
      'Desarrollo: a(ku) + b(kv) = kd = c.',
    ],
    solution:
      'Si hay solución, d | a y d | b implican d | ax + by = c. Si d | c, Bézout y el factor k = c/d construyen (ku,kv). Se han demostrado ambas implicaciones. El caso a = b = 0 se estudia aparte.',
  },
  {
    title: 'Avanzado · No falta ningún punto',
    question:
      'Demuestra la parametrización completa a partir de una solución (x₀,y₀). Distingue los coeficientes nulos.',
    hints: [
      'La sustitución directa prueba que cada parámetro entero produce solución.',
      'Resta otra solución: AΔx = −BΔy con A = a/d, B = b/d.',
      'Estrategia: si B ≠ 0, gcd(A,B) = 1 permite deducir B | Δx mediante Bézout.',
      'Desarrollo: Δx = Bt; sustituyendo y cancelando B resulta Δy = −At.',
    ],
    solution:
      'La familia es (x₀ + Bt,y₀ − At). Si b = 0 y a ≠ 0, x = c/a es fijo y y es libre; −a/d = ±1 recorre todos los enteros. Si a = 0, b ≠ 0, ocurre lo simétrico. Para a = b = 0 no se divide por d.',
  },
  {
    title: 'Avanzado · Un parámetro en el término',
    question: '¿Para qué enteros k admite soluciones 18x + 30y = k + 4?',
    choices: ['k ≡ 2 (mod 6)', 'k ≡ 4 (mod 6)', 'Para todo k'],
    answer: 'k ≡ 2 (mod 6)',
    hints: [
      'gcd(18,30) = 6.',
      'Debe cumplirse 6 | (k + 4).',
      'Estrategia: despeja la clase de k.',
      'Desarrollo: k ≡ −4 ≡ 2 (mod 6).',
    ],
    solution:
      'Exactamente k = 2 + 6s, s entero. El criterio es suficiente además de necesario, por Bézout.',
  },
  {
    title: 'Avanzado · Plantear antes de calcular',
    question:
      'Se compran cuadernos de 3 € y carpetas de 5 € por 31 €, al menos uno de cada tipo. ¿Cuántas compras distintas son posibles?',
    answer: '2',
    hints: [
      'Si x cuenta cuadernos e y carpetas, plantea 3x + 5y = 31.',
      'Módulo 3, 2y ≡ 1, así que y ≡ 2 (mod 3).',
      'Estrategia: escribe y = 2 + 3t y despeja x.',
      'Desarrollo: x = 7 − 5t; x ≥ 1 e y ≥ 1 dan t = 0 o 1.',
    ],
    solution:
      'Dos compras: (x,y) = (7,2) y (2,5). Ambas suman 31 €. Las cotas del contexto descartan el resto de la familia entera.',
  },
  {
    title: 'Avanzado · Tres variables',
    question:
      'Demuestra que 6x + 10y + 15z = c tiene solución entera para todo c y construye una.',
    hints: [
      'El MCD de los tres coeficientes es 1, aunque ningún par sea coprimo.',
      'Busca una combinación que produzca 1.',
      'Estrategia: observa 6 + 10 − 15.',
      'Desarrollo: 6·1 + 10·1 + 15·(−1) = 1; multiplica por c.',
    ],
    solution:
      '(x,y,z) = (c,c,−c) resuelve la ecuación para cualquier entero c. No se afirma que sea una solución no negativa ni que esta sea la parametrización completa.',
  },
  {
    title: 'Avanzado · Dos filas, ninguna pareja entera',
    question:
      '¿Cuántas soluciones enteras tiene el sistema x + y = 1, x − y = 0?',
    answer: '0',
    hints: [
      'Cada fila por separado tiene infinitas soluciones enteras.',
      'La segunda exige x = y.',
      'Estrategia: sustituye en la primera.',
      'Desarrollo: 2x = 1 tiene solución real y racional, pero no entera.',
    ],
    solution:
      'Ninguna. La única solución sobre R o Q es (1/2,1/2). La compatibilidad de cada ecuación por separado no garantiza la del sistema en Z².',
  },
  {
    title: 'Casos límite · Dos ceros',
    question:
      '¿Cuántas soluciones de 0x + 0y = 0 cumplen 0 ≤ x ≤ 2 y −1 ≤ y ≤ 1?',
    answer: '9',
    hints: [
      'La igualdad 0 = 0 no impone relación entre x e y.',
      'Hay tres valores enteros posibles de x.',
      'Estrategia: cuenta por separado los valores de y.',
      'Desarrollo: hay tres valores de y por cada uno de los tres de x.',
    ],
    solution:
      'Hay 3·3 = 9 pares. Sin cotas, todas las parejas de Z² serían soluciones. Para 0x + 0y = 1 no habría ninguna.',
  },
];
