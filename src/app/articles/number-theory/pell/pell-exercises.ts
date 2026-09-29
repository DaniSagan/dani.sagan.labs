import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

export const PELL_EXERCISES: readonly ExerciseDefinition[] = [
  {
    title: 'Básico · Reconocer el dominio',
    question: '¿Cuál es un caso clásico no trivial de Pell?',
    choices: ['x² − 12y² = 1', 'x² − 9y² = 1', 'x² + 2y² = 1'],
    answer: 'x² − 12y² = 1',
    hints: [
      'D debe ser positivo.',
      'D no puede ser cuadrado perfecto.',
      'Estrategia: distingue no cuadrado de libre de cuadrados.',
      'Desarrollo: 12 no es cuadrado, aunque contenga el factor 4.',
    ],
    solution:
      'D = 12 es válido. Para D = 9, factorizar da solo (±1,0). El signo positivo ante 2y² corresponde a D = −2, fuera del caso clásico.',
  },
  {
    title: 'Básico · Verificar exactamente',
    question: 'Calcula 99² − 2·70².',
    answer: '1',
    hints: [
      'Calcula ambos cuadrados como enteros.',
      '99² = 9801.',
      'Estrategia: compara con 2·4900.',
      'Desarrollo: 9801 − 9800 = 1.',
    ],
    solution:
      '(99,70) es una solución positiva de D = 2. No es la fundamental: (3,2) y (17,12) son menores.',
  },
  {
    title: 'Básico · La primera solución',
    question: 'En x² − 3y² = 1, toma y = 1. ¿Qué x positivo obtienes?',
    answer: '2',
    hints: [
      'Despeja x².',
      'x² = 1 + 3.',
      'Estrategia: elige la raíz positiva.',
      'Desarrollo: x² = 4 da x = 2.',
    ],
    solution:
      '(2,1) es fundamental: toda solución positiva tiene y ≥ 1 y x crece con y. También lo demuestra el convergente p₁/q₁ = 2/1.',
  },
  {
    title: 'Básico · Contar desde cero',
    question: 'Para √2 = [1;2,2,…], ¿cuál es q₂?',
    answer: '5',
    hints: [
      'q₋₂ = 1 y q₋₁ = 0.',
      'q₀ = 1 y q₁ = 2.',
      'Estrategia: q₂ = a₂q₁ + q₀.',
      'Desarrollo: q₂ = 2·2 + 1.',
    ],
    solution:
      'q₂ = 5 y p₂ = 7. Su norma es 49 − 2·25 = −1: este convergente resuelve la ecuación negativa.',
  },
  {
    title: 'Intermedio · Calcular un período',
    question: 'Calcula la longitud del período de √7 con el algoritmo (m,d,a).',
    answer: '4',
    hints: [
      'Parte de (0,1,2).',
      'Siguen (2,3,1) y (1,2,1).',
      'Estrategia: continúa hasta m = 2, d = 1.',
      'Desarrollo: siguen (1,3,1) y (2,1,4).',
    ],
    solution:
      'El bloque es 1,1,1,4 y L = 4. La fundamental aparece en n = 3: (8,3), porque 64 − 7·9 = 1.',
  },
  {
    title: 'Intermedio · Un período impar',
    question:
      'Para D = 5, √5 = [2; período 4]. ¿Cuál es x₁ de la fundamental positiva?',
    answer: '9',
    hints: [
      'L = 1 es impar.',
      '2/1 tiene norma −1.',
      'Estrategia: usa n = 2L − 1 = 1.',
      'Desarrollo: [2;4] = 9/4.',
    ],
    solution:
      '(9,4) es la fundamental: 81 − 5·16 = 1. También se obtiene de (2 + √5)² = 9 + 4√5.',
  },
  {
    title: 'Intermedio · Cinco soluciones',
    question:
      'Genera las cinco primeras soluciones positivas para D = 2. ¿Cuál es la quinta x?',
    answer: '3363',
    hints: [
      'Empieza en (3,2).',
      'x′ = 3x + 4y, y′ = 2x + 3y.',
      'Estrategia: guarda ambas coordenadas antes de actualizar.',
      'Desarrollo: siguen (17,12), (99,70), (577,408); calcula 3·577 + 4·408.',
    ],
    solution:
      'Las cinco parejas son (3,2), (17,12), (99,70), (577,408), (3363,2378). La última verifica 11309769 − 2·5654884 = 1.',
  },
  {
    title: 'Intermedio · Pell negativa',
    question: '¿Para cuáles de D = 2,3,5,7,13 existe solución de norma −1?',
    choices: ['2, 5 y 13', '3 y 7', 'Todos'],
    answer: '2, 5 y 13',
    hints: [
      'La negativa exige período impar.',
      'Las longitudes son 1,2,1,4,5.',
      'Estrategia: selecciona las impares.',
      'Desarrollo: para 2,5,13 aparecen (1,1), (2,1), (18,5).',
    ],
    solution:
      'Exactamente 2,5 y 13. Para 3 y 7 el período par prueba imposibilidad; no se trata de haber buscado poco.',
  },
  {
    title: 'Intermedio · D = 13 sin tantear',
    question: 'En D = 13, L = 5. ¿Qué índice n da la fundamental de norma +1?',
    answer: '9',
    hints: [
      'Contamos desde n = 0.',
      'n = 4 tiene norma −1.',
      'Estrategia: recorre dos períodos.',
      'Desarrollo: n = 2L − 1 = 9.',
    ],
    solution:
      'n = 9 da 649/180 y 421201 − 421200 = 1. Una búsqueda en y ≤ 100 no encuentra ninguna solución positiva.',
  },
  {
    title: 'Avanzado · Probar el cierre',
    question:
      'Demuestra que el producto de dos expresiones de norma 1 tiene norma 1.',
    hints: [
      'Desarrolla (x + y√D)(u + v√D).',
      'Obtienes xu + Dyv y xv + yu.',
      'Estrategia: calcula la norma del producto.',
      'Desarrollo: los términos cruzados 2Dxuyv se cancelan.',
    ],
    solution:
      '(xu + Dyv)² − D(xv + yu)² = (x² − Dy²)(u² − Dv²) = 1. Los coeficientes siguen siendo enteros y positivos. La exhaustividad exige otro argumento.',
  },
  {
    title: 'Avanzado · No omitir soluciones',
    question:
      'Justifica que toda solución positiva es una potencia de la fundamental ε.',
    hints: [
      'Elige k con εᵏ ≤ α < εᵏ⁺¹.',
      'β = αε⁻ᵏ conserva integridad y norma 1.',
      'Estrategia: usa 1 ≤ β < ε.',
      'Desarrollo: si β > 1, u = (β + β⁻¹)/2 y v = (β − β⁻¹)/(2√D) son positivos.',
    ],
    solution:
      'Si β > 1, la monotonía de t + 1/t para t > 1 da 1 < u < x₁, contradiciendo la minimalidad. Luego β = 1 y α = εᵏ. El inverso ε⁻¹ = x₁ − y₁√D garantiza coeficientes enteros.',
  },
  {
    title: 'Avanzado · Cuantificar el error',
    question:
      'Demuestra que norma +1 y x,y > 0 implican 0 < x/y − √D < 1/(2√D·y²).',
    hints: [
      'x²/y² = D + 1/y² da el signo.',
      'Racionaliza la diferencia.',
      'Estrategia: multiplica los dos factores conjugados.',
      'Desarrollo: x/y + √D > 2√D.',
    ],
    solution:
      'El error es 1/[y²(x/y + √D)], positivo y menor que 1/(2√D·y²). También es menor que 1/(2y²); la coprimalidad de x,y y Legendre muestran que x/y es convergente.',
  },
  {
    title: 'Avanzado · Una recurrencia escalar',
    question: 'Para D = 2, ¿cuál es A en xₖ₊₂ = A xₖ₊₁ − xₖ?',
    answer: '6',
    hints: [
      'ε = 3 + 2√2.',
      'ε + ε⁻¹ = 6.',
      'Estrategia: ambas raíces satisfacen z² − 6z + 1 = 0.',
      'Desarrollo: multiplica por zᵏ y suma para ε y ε⁻¹.',
    ],
    solution:
      'A = 6. Con x₀ = 1 y x₁ = 3 resulta x₂ = 17 y x₃ = 99. La misma recurrencia sirve para y₀ = 0, y₁ = 2.',
  },
  {
    title: 'Avanzado · Cuadrados triangulares',
    question:
      'Después de 1, ¿cuál es el siguiente número triangular y cuadrado?',
    answer: '36',
    hints: [
      'Completa (2n + 1)² − 8m² = 1.',
      'La fundamental de D = 8 es (3,1).',
      'Estrategia: calcula (3 + √8)².',
      'Desarrollo: (X,Y) = (17,6), luego n = 8 y m = 6.',
    ],
    solution:
      '36 = 8·9/2 = 6². La generación completa por potencias garantiza que no hay otro positivo entre 1 y 36.',
  },
  {
    title: 'Avanzado · Una geometría escondida',
    question:
      'Para catetos consecutivos r,r+1, la transformación da (X,Y) = (41,29). ¿Cuál es r?',
    answer: '20',
    hints: [
      'Parte de r² + (r + 1)² = h².',
      'X = 2r + 1 e Y = h.',
      'Estrategia: despeja r.',
      'Desarrollo: r = (41 − 1)/2.',
    ],
    solution:
      'r = 20: 20² + 21² = 29². La ecuación X² − 2Y² = −1 obliga a X impar, de modo que la transformación inversa conserva integridad.',
  },
  {
    title: 'Avanzado · Demostrar imposibilidad',
    question: '¿Tiene soluciones enteras n(n + 1) = 2m² + 1?',
    choices: ['No', 'Sí'],
    answer: 'No',
    hints: [
      'Multiplica por 4 y completa el cuadrado.',
      'Obtienes (2n + 1)² − 8m² = 5.',
      'Estrategia: reduce módulo 8.',
      'Desarrollo: los cuadrados módulo 8 son 0,1,4.',
    ],
    solution:
      'No: exigiría un cuadrado congruente con 5 módulo 8. El teorema de existencia para norma 1 no se aplica a una ecuación de norma 5.',
  },
];
