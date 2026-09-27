import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

export const DIVISIBILITY_EXERCISES: readonly ExerciseDefinition[] = [
  {
    title: 'Nivel 1 · Una suma que decide', question: '¿Es 12348 divisible por 9?', choices: ['Sí.', 'No.'], answer: 'Sí.',
    hints: ['Suma sus cifras.', '1 + 2 + 3 + 4 + 8 = 18.'],
    solution: 'Sí: 12348 ≡ 18 ≡ 0 (mod 9). La justificación es que cada potencia de 10 es congruente con 1 módulo 9.'
  },
  {
    title: 'Nivel 1 · Últimas cifras', question: '12100 termina en 00. ¿Es divisible por 8?', choices: ['Sí.', 'No.'], answer: 'No.',
    hints: ['Para 8 hacen falta las tres últimas cifras.', '100 = 8·12 + 4.'],
    solution: 'No: 12100 ≡ 100 ≡ 4 (mod 8). Terminar en 00 garantiza divisibilidad por 4 y 25, pero no por 8.'
  },
  {
    title: 'Nivel 2 · Completar una cifra para el 3', question: 'Encuentra todas las cifras a para que 47a32 sea divisible por 3.',
    choices: ['0, 3, 6, 9.', '2, 5, 8.', 'Solo 2.'], answer: '2, 5, 8.',
    hints: ['La suma de las cifras conocidas es 16.', 'Resuelve 16 + a ≡ 0 (mod 3) con 0 ≤ a ≤ 9.'],
    solution: 'a ≡ 2 (mod 3), de modo que a = 2, 5 u 8. Los números son 47232, 47532 y 47832. También son divisibles por 6 porque terminan en cifra par.'
  },
  {
    title: 'Nivel 2 · La misma cifra para el 9', question: '¿Qué cifra a hace que 47a32 sea divisible por 9?', answer: '2',
    hints: ['Ahora exigimos que 16 + a sea múltiplo de 9.', 'El intervalo posible es de 16 a 25.'],
    solution: 'El único múltiplo de 9 entre 16 y 25 es 18; por tanto a = 2. Como 47232 es par, también es divisible por 18.'
  },
  {
    title: 'Nivel 2 · Alternar para el 11', question: '¿Qué cifra a hace que 47a32 sea divisible por 11?', answer: '4',
    hints: ['Empieza con signo positivo en las unidades.', '2 − 3 + a − 7 + 4 = a − 4.'],
    solution: 'a − 4 está entre −4 y 5. El único múltiplo de 11 en ese intervalo es 0, así que a = 4. El número es 47432.'
  },
  {
    title: 'Nivel 3 · Condiciones simultáneas', question: '¿Puede 47a32 ser divisible a la vez por 3 y por 11?', choices: ['Sí.', 'No.'], answer: 'No.',
    hints: ['Para 3, las cifras posibles son 2, 5 y 8.', 'Para 11, la única posibilidad es 4.'],
    solution: 'No hay una cifra común a ambos conjuntos. Como 3 y 11 son coprimos, esto equivale a afirmar que ninguno de esos diez números es divisible por 33.'
  },
  {
    title: 'Nivel 2 · Ejecutar un criterio iterativo', question: 'Para comprobar 1001 con el criterio del 13, ¿qué número queda tras DOS transformaciones a + 4b?', answer: '26',
    hints: ['Primero separa 1001 = 10·100 + 1.', 'La primera transformación produce 104; vuelve a separar su última cifra.'],
    solution: '1001 → 100 + 4·1 = 104 → 10 + 4·4 = 26. Como 26 = 2·13, 1001 es divisible por 13. No debes multiplicar por 4 todo el número: solo la última cifra.'
  },
  {
    title: 'Nivel 3 · Corregir una prueba falsa', question: 'Alguien afirma: «Si 4 y 6 dividen a N, entonces 24 divide a N». Da un contraejemplo y formula la conclusión correcta.',
    hints: ['Prueba N = 12.', 'El mínimo común múltiplo de 4 y 6 es 12.'],
    solution: '12 es divisible por 4 y por 6, pero no por 24. La conclusión correcta es mcm(4,6) = 12 divide a N. Para decidir divisibilidad por 24, sí podemos combinar 3 y 8, que son coprimos.'
  },
  {
    title: 'Nivel 3 · Deducir un criterio nuevo', question: 'Deduce un criterio por bloques para 27 y aplícalo a 123201.',
    hints: ['1000 − 1 = 999 = 27·37.', 'Agrupa 123 | 201 y suma los bloques.'],
    solution: 'Como 1000 ≡ 1 (mod 27), N es congruente con la suma de sus bloques de tres cifras, agrupados desde la derecha. Para 123201, la suma es 324 = 27·12, luego sí es divisible por 27.'
  },
  {
    title: 'Nivel 3 · Otra base', question: 'El número (77)₈ tiene dos cifras de valor 7. ¿Es divisible por 7 y por 9?', choices: ['Por ambos.', 'Solo por 7.', 'Por ninguno.'], answer: 'Por ambos.',
    hints: ['En base 8, la suma de cifras sirve para 7 y la alternada para 9.', '7 + 7 = 14 y 7 − 7 = 0.'],
    solution: 'Por ambos: 14 es múltiplo de 7 y 0 es múltiplo de 9. Además, (77)₈ = 7·8 + 7 = 63 en decimal. No hay que confundirlo con el entero decimal 77.'
  },
  {
    title: 'Nivel 3 · Demostrar las dos implicaciones', question: 'Para N = 10a + b, demuestra que 17 divide a N si y solo si divide a a − 5b.',
    hints: ['Calcula N − 10(a − 5b).', 'El resultado es 51b = 3·17b y gcd(10,17) = 1.'],
    solution: 'N ≡ 10(a − 5b) (mod 17). Por tanto 17 | N equivale a 17 | 10(a − 5b). Como 10 y 17 son coprimos, podemos cancelar 10 y obtener 17 | (a − 5b). El argumento es reversible; no afirma que N y a − 5b tengan el mismo resto.'
  },
  {
    title: 'Nivel 2 · Cero y signo', question: '¿Cuál de estas afirmaciones es correcta?', choices: ['0 es divisible por 7 y −104 es divisible por 8.', '0 no tiene divisores positivos.', 'Ningún negativo es divisible por 8.'], answer: '0 es divisible por 7 y −104 es divisible por 8.',
    hints: ['Usa la definición N = mk con k entero.', '0 = 7·0 y −104 = 8·(−13).'],
    solution: 'Todo entero positivo divide a 0. Cambiar el signo de un entero tampoco cambia sus divisores. Los criterios con cifras se aplican al valor absoluto.'
  }
];
