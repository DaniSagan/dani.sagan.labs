import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

export const MODULAR_EXERCISES: readonly ExerciseDefinition[] = [
  {
    title: 'Nivel 1 · Decidir una congruencia', question: '¿Son congruentes 17 y −4 módulo 7?',
    choices: ['Sí.', 'No.'], answer: 'Sí.',
    hints: ['Calcula la diferencia, no el cociente de los dos números.', '17 − (−4) = 21.'],
    solution: 'Sí: 21 = 7·3. Equivalentemente, 17 = 7·2 + 3 y −4 = 7·(−1) + 3; ambos tienen resto canónico 3.'
  },
  {
    title: 'Nivel 1 · Un entero negativo', question: '¿Cuál es el representante canónico de [−17]₅?', answer: '3',
    hints: ['El representante debe estar entre 0 y 4.', 'Escribe −17 = 5q + r con 0 ≤ r < 5.'],
    solution: '−17 = 5·(−4) + 3, por lo que el representante es 3. El entero 3 no es toda la clase: [−17]₅ = [3]₅ contiene infinitos enteros.'
  },
  {
    title: 'Nivel 2 · Una potencia grande', question: 'Calcula el resto canónico de 2¹⁰⁰ al dividir entre 7.', answer: '2',
    hints: ['Las potencias empiezan 1, 2, 4, 1, … desde el exponente 0.', '100 = 3·33 + 1.'],
    solution: 'Como 2³ ≡ 1 (mod 7), 2¹⁰⁰ = (2³)³³·2 ≡ 2. También se obtiene por cuadrados sucesivos, sin invocar Fermat.'
  },
  {
    title: 'Nivel 2 · Invertir una base negativa', question: 'Halla el inverso de −3 módulo 11, entre 0 y 10.', answer: '7',
    hints: ['MCD(−3,11) = 1 garantiza la existencia.', 'Busca x e y con (−3)x + 11y = 1.'],
    solution: '(−3)·7 + 11·2 = 1. Por tanto el inverso canónico es 7; −21 = 11·(−2) + 1.'
  },
  {
    title: 'Nivel 2 · Cancelar con cuidado', question: 'De 2x ≡ 2y (mod 6), ¿qué conclusión equivalente es válida para todos los enteros x e y?',
    choices: ['x ≡ y (mod 6).', 'x ≡ y (mod 3).', 'x = y.'], answer: 'x ≡ y (mod 3).',
    hints: ['El factor 2 no es coprimo con 6.', '6 divide a 2(x−y) si y solo si 3 divide a x−y.'],
    solution: 'La conclusión es x ≡ y (mod 3). No podemos conservar el módulo 6: x = 1 e y = 4 satisfacen 2x ≡ 2y (mod 6), pero 1 no es congruente con 4 módulo 6.'
  },
  {
    title: 'Nivel 2 · Divisores de cero', question: '¿Cuál de estas clases es divisor de cero módulo 8?',
    choices: ['[2]₈.', '[3]₈.', '[0]₈.'], answer: '[2]₈.',
    hints: ['Buscamos una clase no nula que anule a otra clase no nula.', '2·4 = 8.'],
    solution: '[2]₈·[4]₈ = [0]₈ y ninguno de los factores es cero. [3]₈ es unidad, pues 3·3 ≡ 1. Excluimos [0]₈ de la definición de divisor de cero.'
  },
  {
    title: 'Nivel 3 · Separar cola y período', question: 'Desde k = 0, la sucesión 2ᵏ mod 8 es 1, 2, 4, 0, 0, … ¿Cuántos términos hay antes del ciclo?', answer: '3',
    hints: ['El ciclo comienza en la primera aparición del 0.', 'El término de índice k = 3 ya pertenece al ciclo.'],
    solution: 'Hay tres términos de cola: los de índices 0, 1 y 2. El ciclo constante 0 comienza en k = 3 y tiene período mínimo 1. Reducir cualquier exponente módulo 1 daría k = 0 y un resultado incorrecto: hay que respetar la cola.'
  },
  {
    title: 'Nivel 2 · Últimas cifras', question: '¿Cuáles son las últimas dos cifras de 7²²²? Escribe el resto entre 0 y 99.', answer: '49',
    hints: ['7² ≡ 49 (mod 100) y 7⁴ ≡ 1 (mod 100).', '222 = 4·55 + 2.'],
    solution: '7²²² ≡ (7⁴)⁵⁵·7² ≡ 49 (mod 100). Un resto como 3 se escribiría 03 al pedir dos cifras; aquí obtenemos 49.'
  },
  {
    title: 'Nivel 2 · Una sola cifra', question: '¿Cuál es la última cifra de 7²⁰²⁵?', answer: '7',
    hints: ['Mira las potencias módulo 10: 7, 9, 3, 1.', '2025 deja resto 1 al dividir entre 4.'],
    solution: '7⁴ ≡ 1 (mod 10) y 2025 = 4·506 + 1. La última cifra es 7.'
  },
  {
    title: 'Nivel 3 · Una ecuación imposible', question: '¿Tiene solución entera 6x ≡ 5 (mod 9)?', choices: ['Sí.', 'No.'], answer: 'No.',
    hints: ['Si hay solución, 6x − 5 debe ser múltiplo de 9.', 'Todo múltiplo de 6 y de 9 es divisible por 3.'],
    solution: 'No. La ecuación 6x − 9t = 5 obligaría a que 3 dividiera a 5. En general, MCD(a,n) debe dividir al término independiente de ax ≡ b (mod n).'
  },
  {
    title: 'Nivel 3 · Probar que el producto está bien definido', question: 'Si a ≡ b (mod n) y c ≡ d (mod n), demuestra ac ≡ bd (mod n) sin usar esa misma regla como justificación.',
    hints: ['Escribe a − b = nu y c − d = nv.', 'Usa ac − bd = c(a − b) + b(c − d).'],
    solution: 'ac − bd = cnu + bnv = n(cu + bv). Como cu + bv es entero, n divide la diferencia. Así, cambiar los representantes de dos clases no altera la clase de su producto.'
  }
];
