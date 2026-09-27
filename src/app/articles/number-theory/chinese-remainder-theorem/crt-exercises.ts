import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

export const CRT_EXERCISES: readonly ExerciseDefinition[] = [
  {
    title: 'Inicio · Dos progresiones',
    question:
      'Halla el menor entero no negativo con x ≡ 1 (mod 4) y x ≡ 2 (mod 5). Describe después todas las soluciones.',
    answer: '17',
    hints: [
      'Escribe x = 1 + 4k.',
      'Módulo 5: 4k ≡ 1. El inverso de 4 es 4.',
      'Desarrollo: k ≡ 4 (mod 5), luego x = 1 + 4(4 + 5t).',
    ],
    solution:
      'x = 17 + 20t, t entero. El representante canónico es 17; 17 deja restos 1 y 2. No es un único entero, sino una clase módulo 20.',
  },
  {
    title: 'Cálculo · Tres condiciones',
    question:
      'Resuelve x ≡ 1 (mod 4), x ≡ 2 (mod 5), x ≡ 3 (mod 7). Introduce el representante entre 0 y 139.',
    answer: '17',
    hints: [
      'Fusiona primero las dos primeras: x = 17 + 20t.',
      'Módulo 7, 3 + 6t ≡ 3.',
      'Desarrollo: 6t ≡ 0 (mod 7), así que t ≡ 0 (mod 7).',
    ],
    solution:
      'x ≡ 17 (mod 140). Los restos de 17 son 1, 2 y 3. Al ser coprimos dos a dos, el período mínimo es 4·5·7 = 140.',
  },
  {
    title: 'Concepto · Compatible no significa coprimo',
    question: '¿Cuál es el conjunto solución de x ≡ 2 (mod 6), x ≡ 5 (mod 9)?',
    choices: ['x ≡ 14 (mod 18)', 'No hay solución', 'x ≡ 14 (mod 54)'],
    answer: 'x ≡ 14 (mod 18)',
    hints: [
      'El MCD es 3; la diferencia de residuos es 3.',
      'Escribe x = 2 + 6k y divide 6k ≡ 3 (mod 9) entre 3.',
      'Desarrollo: 2k ≡ 1 (mod 3), de donde k ≡ 2 (mod 3).',
    ],
    solution:
      'x = 14 + 18t. La condición módulo 54 solo describe parte de las soluciones: omite, por ejemplo, 32.',
  },
  {
    title: 'Diagnóstico · Una contradicción',
    question: '¿Es compatible x ≡ 1 (mod 6), x ≡ 2 (mod 8)?',
    choices: [
      'Sí, porque los módulos son distintos',
      'No, porque exige paridad distinta',
    ],
    answer: 'No, porque exige paridad distinta',
    hints: [
      'gcd(6,8) = 2.',
      'La diferencia es 2 − 1 = 1.',
      'Desarrollo: una solución sería impar por la primera fila y par por la segunda.',
    ],
    solution:
      'No hay solución: 2 no divide 1. Los módulos no coprimos pueden ser compatibles, pero estos residuos contradicen la condición necesaria.',
  },
  {
    title: 'Normalización · Una fila redundante',
    question:
      'Para x ≡ −1 (mod 4), x ≡ 13 (mod 6), x ≡ 7 (mod 12), ¿cuál es el período positivo mínimo?',
    answer: '12',
    hints: [
      'Normaliza los residuos: 3, 1, 7.',
      'Todo x ≡ 7 (mod 12) cumple las otras dos filas.',
      'Desarrollo: las dos primeras dan x ≡ 7 (mod 12), y la tercera repite esa clase.',
    ],
    solution:
      'El conjunto es 7 + 12Z y su período mínimo es 12. El producto 288 no es el módulo que describe todas las soluciones en una única clase.',
  },
  {
    title: 'Construcción · Un selector',
    question:
      'Para los módulos 3, 5 y 7, usa el inverso canónico de M₂ = 21 módulo 5. ¿Qué valor toma e₂ = M₂y₂?',
    answer: '21',
    hints: [
      '21 ≡ 1 (mod 5).',
      'Su inverso canónico es 1.',
      'Desarrollo: 21·1 = 21; comprueba los restos respecto a los otros módulos.',
    ],
    solution:
      'e₂ = 21: vale 1 módulo 5 y 0 módulo 3 y 7. Multiplicarlo por el residuo deseado en la segunda fila afecta solo a esa coordenada.',
  },
  {
    title: 'Aplicación · Señales periódicas',
    question:
      'Una señal aparece en t = 2 + 6k minutos y otra en t = 5 + 9j minutos (k,j ≥ 0). ¿Cuándo coinciden por primera vez?',
    answer: '14',
    hints: [
      'Traduce las dos condiciones a congruencias.',
      'El sistema es el compatible de módulos 6 y 9.',
      'Desarrollo: las coincidencias enteras son t = 14 + 18s; aplica la restricción temporal.',
    ],
    solution:
      'En el minuto 14, y luego cada 18 minutos. Los índices son k = 2 y j = 1. Las soluciones negativas de las congruencias se descartan por el contexto.',
  },
  {
    title: 'Reconstrucción · Añadir una cota',
    question:
      'N deja restos 2, 3 y 2 al dividirlo por 3, 5 y 7. Si 200 ≤ N < 300, ¿cuánto vale N?',
    answer: '233',
    hints: [
      'Todas las soluciones son 23 + 105t.',
      'Busca los enteros t que respetan las dos cotas.',
      'Desarrollo: 177 ≤ 105t < 277; solo cabe t = 2.',
    ],
    solution:
      'N = 233. Los restos solos no determinan un entero único; en este intervalo la cota sí lo hace.',
  },
  {
    title: 'Demostración · Por qué basta el MCD',
    question:
      'Demuestra que x ≡ a (mod m), x ≡ b (mod n) es compatible exactamente cuando gcd(m,n) divide b − a.',
    hints: [
      'Necesidad: resta x − a y x − b.',
      'Suficiencia: escribe x = a + mk y divide la congruencia en k por d = gcd(m,n).',
      'Desarrollo: m/d y n/d son coprimos. Bézout proporciona u con u(m/d) ≡ 1 (mod n/d).',
    ],
    solution:
      'Toda solución obliga a d | (b−a). A la inversa, si b−a = dc, toma k ≡ uc (mod n/d) y x = a + mk. Entonces x cumple ambas filas. Las soluciones difieren en m(n/d) = mcm(m,n). Si n/d = 1, cualquier k sirve.',
  },
  {
    title: 'Detectar un error · Coprimos en conjunto',
    question:
      'Alguien afirma que gcd(6,10,15) = 1 permite aplicar siempre el TCR clásico a esos tres módulos. Refuta la afirmación.',
    hints: [
      'Ser coprimos en conjunto no implica ser coprimos dos a dos.',
      'Prueba residuos 0 módulo 6 y 1 módulo 10.',
      'Desarrollo: esas dos filas exigen simultáneamente paridad par e impar.',
    ],
    solution:
      'El MCD global es 1, pero gcd(6,10) = 2. Las filas x ≡ 0 (mod 6), x ≡ 1 (mod 10) ya son incompatibles, cualquiera que sea la tercera. La hipótesis clásica exige coprimalidad de cada par.',
  },
  {
    title: 'Últimas cifras · Separar el módulo',
    question:
      '¿Cuáles son las últimas dos cifras de 3²⁰? Introduce un entero entre 0 y 99.',
    answer: '1',
    hints: [
      '100 = 4·25, con factores coprimos.',
      '3²⁰ ≡ 1 (mod 4) y, por Euler, 3²⁰ ≡ 1 (mod 25).',
      'Desarrollo: la única clase que da resto 1 en ambos módulos es 1 módulo 100.',
    ],
    solution:
      'El resto es 1, así que las últimas dos cifras son 01. Euler se aplica porque gcd(3,25) = 1 y φ(25) = 20.',
  },
  {
    title: 'Casos límite · Una condición vacía',
    question: '¿Qué aporta añadir x ≡ 100 (mod 1) a un sistema?',
    choices: [
      'Nada: todos los enteros la cumplen',
      'Obliga a x = 100',
      'Hace incompatible el sistema',
    ],
    answer: 'Nada: todos los enteros la cumplen',
    hints: [
      '1 divide cualquier diferencia.',
      '100 mod 1 = 0.',
      'Desarrollo: la clase 0 módulo 1 es todo Z y el MCM no cambia al añadir 1.',
    ],
    solution:
      'No cambia el conjunto de soluciones. Si todas las filas tienen módulo 1, el conjunto solución es Z = 0 + 1Z.',
  },
];
