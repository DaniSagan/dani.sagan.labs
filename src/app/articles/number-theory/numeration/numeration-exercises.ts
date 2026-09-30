import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

export const NUMERATION_EXERCISES: readonly ExerciseDefinition[] = [
  {
    title: 'Básico · Leer pesos',
    question: '¿Qué entero decimal representa (101101)₂?',
    answer: '45',
    hints: [
      'Numera las posiciones desde la derecha, empezando en cero.',
      'Los unos ocupan las posiciones 5,3,2,0.',
      'Estrategia: suma sus potencias de 2.',
      'Desarrollo: 32 + 8 + 4 + 1.',
    ],
    solution:
      '45. No se lee ciento un mil ciento uno: esa lectura usaría pesos decimales y representaría otro entero.',
  },
  {
    title: 'Básico · Cifras válidas',
    question: '¿Cuál es una escritura válida en base 5?',
    choices: ['2431', '152', '5A'],
    answer: '2431',
    hints: [
      'Las cifras tienen valores menores que la base.',
      'En base 5 se permiten 0,1,2,3,4.',
      'Estrategia: revisa cada símbolo.',
      'Desarrollo: tanto 152 como 5A contienen una cifra 5.',
    ],
    solution:
      '2431 es válida y vale 2·125 + 4·25 + 3·5 + 1 = 366. El hecho de que 152 sea una cadena decimal válida no la hace válida en base 5.',
  },
  {
    title: 'Básico · Divisiones sucesivas',
    question: 'Escribe 156 en base 5, sin subíndice.',
    answer: '1111',
    hints: [
      'Divide repetidamente entre 5.',
      'Los cocientes son 31,6,1,0.',
      'Estrategia: conserva los restos y léelos desde el último.',
      'Desarrollo: los cuatro restos son 1.',
    ],
    solution:
      '(1111)₅ = 125 + 25 + 5 + 1 = 156. El último cociente cero indica que no quedan cifras por extraer.',
  },
  {
    title: 'Básico · Horner',
    question: 'Evalúa (7A3)₁₆ en decimal.',
    answer: '1955',
    hints: [
      'A representa diez.',
      'Primero 7·16 + 10 = 122.',
      'Estrategia: multiplica otra vez por 16 y añade la última cifra.',
      'Desarrollo: 122·16 + 3.',
    ],
    solution:
      '1955. El desarrollo equivalente es 7·256 + 10·16 + 3; Horner evita calcular explícitamente todas las potencias.',
  },
  {
    title: 'Intermedio · Agrupar bits',
    question: 'Convierte (10011100)₂ a octal. Escribe solo las cifras.',
    answer: '234',
    hints: [
      'Cada cifra octal corresponde a tres bits.',
      'Agrupa desde la derecha.',
      'Estrategia: completa solo el primer bloque con un cero.',
      'Desarrollo: 010 | 011 | 100.',
    ],
    solution:
      '(234)₈: los bloques valen 2,3,4. Al expandir, 2·64 + 3·8 + 4 = 156, el mismo valor del numeral binario.',
  },
  {
    title: 'Intermedio · Acarreos',
    question: 'Suma (243)₅ + (134)₅. Escribe el resultado en base 5.',
    answer: '432',
    hints: [
      'Unidades: 3 + 4 = 7.',
      'Escribe 2 y lleva 1 porque 7 = 5 + 2.',
      'Estrategia: repite con el acarreo entrante.',
      'Desarrollo: 4 + 3 + 1 = 8 deja 3 y lleva 1; después 2 + 1 + 1 = 4.',
    ],
    solution:
      '(432)₅. La comprobación decimal es 73 + 44 = 117 = 4·25 + 3·5 + 2. Cada acarreo conserva el valor.',
  },
  {
    title: 'Intermedio · Préstamos y productos',
    question: 'Calcula (302)₅ − (134)₅. Escribe el resultado en base 5.',
    answer: '113',
    hints: [
      'No basta prestar desde la columna de cincos: contiene cero.',
      'Cambia un veinticinco por cinco cincos.',
      'Estrategia: cambia después un cinco por cinco unidades.',
      'Desarrollo: quedan 2 veinticincos, 4 cincos y 7 unidades; resta 1,3,4.',
    ],
    solution:
      '(113)₅ = 33, pues 77 − 44 = 33. Como ampliación, (23)₅·(14)₅ = (202)₅ + (230)₅ = (432)₅.',
  },
  {
    title: 'Intermedio · Contar cifras',
    question: '¿Cuántas cifras binarias tiene 156?',
    answer: '8',
    hints: [
      'Busca dos potencias consecutivas de 2 que lo encierren.',
      '2⁷ = 128 y 2⁸ = 256.',
      'Estrategia: si 2ᵏ ≤ n < 2ᵏ⁺¹, la longitud es k + 1.',
      'Desarrollo: k = 7, así que hacen falta ocho cifras.',
    ],
    solution:
      '8. La cifra superior ocupa la posición 7 y la inferior la posición 0. Contar posiciones desde cero no significa que haya siete cifras.',
  },
  {
    title: 'Intermedio · Divisibilidad en otra base',
    question: '¿Es (77)₈ divisible por 7?',
    choices: ['Sí', 'No'],
    answer: 'Sí',
    hints: [
      '8 ≡ 1 (mod 7).',
      'Todas las potencias de 8 son congruentes con 1.',
      'Estrategia: suma las cifras.',
      'Desarrollo: 7 + 7 = 14 es múltiplo de 7.',
    ],
    solution:
      'Sí: (77)₈ = 63 = 7·9. La suma de cifras funciona aquí para 7 porque divide a 8 − 1; no es la regla decimal del 9.',
  },
  {
    title: 'Intermedio · Una base desconocida',
    question: 'Determina b si (132)ᵦ = 56 en decimal.',
    answer: '6',
    hints: [
      'La cifra 3 exige b ≥ 4.',
      'b² + 3b + 2 = 56.',
      'Estrategia: factoriza b² + 3b − 54.',
      'Desarrollo: (b − 6)(b + 9) = 0.',
    ],
    solution:
      'b = 6. La otra raíz, −9, no es una base positiva del sistema estudiado. Comprobación: 36 + 18 + 2 = 56.',
  },
  {
    title: 'Avanzado · Cuando no existe una base',
    question: '¿Existe una base entera b ≥ 2 tal que (132)ᵦ = 47?',
    choices: ['No existe', 'b = 5', 'b = 6'],
    answer: 'No existe',
    hints: [
      'Debes exigir b > 3.',
      'La función b² + 3b + 2 crece para b ≥ 4.',
      'Estrategia: compara los valores consecutivos b = 5 y b = 6.',
      'Desarrollo: dan 42 y 56; 47 está estrictamente entre ambos.',
    ],
    solution:
      'No existe base entera. Resolver sobre los reales daría (−3 + √189)/2, entre 5 y 6, pero esa raíz no es una base admitida. El ejercicio exige comprobar el dominio.',
  },
  {
    title: 'Avanzado · Reconstruir la unicidad',
    question:
      'Demuestra la unicidad de la escritura canónica en base b y explica por qué se excluyen ceros iniciales.',
    hints: [
      'Compara dos expansiones módulo b.',
      'Sus cifras finales tienen el mismo resto y pertenecen a 0,…,b − 1.',
      'Estrategia: iguala las cifras finales, réstalas y divide entre b.',
      'Desarrollo: repite hasta las posiciones superiores, completando temporalmente con ceros.',
    ],
    solution:
      'La congruencia fuerza igualdad de las unidades; la repetición fuerza igualdad de todas las cifras. Si las longitudes canónicas difiriesen, la cifra superior no nula coincidiría con un cero, contradicción. Sin normalización, 1 y 01 serían escrituras distintas.',
  },
  {
    title: 'Avanzado · El mayor número de k cifras',
    question:
      'Demuestra que bᵏ − 1 tiene exactamente k cifras en base b, todas iguales a b − 1, para k ≥ 1.',
    hints: [
      'Suma (b − 1)(1 + b + ⋯ + bᵏ⁻¹).',
      'Usa la suma geométrica.',
      'Estrategia: comprueba que cada coeficiente es una cifra válida.',
      'Desarrollo: la suma vale bᵏ − 1 y su cifra superior no es cero.',
    ],
    solution:
      'La suma geométrica da bᵏ − 1. Es una escritura canónica válida de k cifras y la unicidad impide otra distinta. Esto explica que añadir uno a una cadena de cifras máximas produzca 1 seguido de k ceros.',
  },
  {
    title: 'Avanzado · Todas las bases posibles',
    question: '¿Para qué bases b ≥ 2 es (111)ᵦ divisible por b − 1?',
    choices: ['b = 2 y b = 4', 'Solo b = 10', 'Para toda base'],
    answer: 'b = 2 y b = 4',
    hints: [
      'Reduce b² + b + 1 módulo b − 1.',
      'b ≡ 1, así que el resto equivale a 3.',
      'Estrategia: exige que b − 1 divida 3.',
      'Desarrollo: sus divisores positivos son 1 y 3.',
    ],
    solution:
      'Exactamente b = 2 y b = 4. En base 2 el divisor es 1 y la condición es trivial; en base 4, (111)₄ = 21 es múltiplo de 3. No es necesario probar infinitas bases.',
  },
  {
    title: 'Avanzado · Signo e interpretación',
    question: '¿Qué entero representa 11110011 en complemento a dos de 8 bits?',
    answer: '-13',
    hints: [
      'Primero calcula su valor sin signo.',
      'Ese valor es 243.',
      'Estrategia: como el bit superior es 1, resta 2⁸.',
      'Desarrollo: 243 − 256.',
    ],
    solution:
      '−13. Sin signo, la misma cadena vale 243. El ancho y la convención forman parte del significado; no basta conocer los bits.',
  },
  {
    title: 'Avanzado · Una prueba de Horner',
    question:
      'Demuestra por inducción que Horner evalúa correctamente cualquier numeral válido.',
    hints: [
      'Empieza con el acumulador cero.',
      'Tras la primera cifra, el valor es esa cifra.',
      'Estrategia: formula como invariante que el acumulador vale el prefijo ya leído.',
      'Desarrollo: multiplicar por b desplaza cada potencia un orden; sumar la cifra nueva introduce el término constante.',
    ],
    solution:
      'El invariante vale al inicio. Si vale para un prefijo, r ← br + a conserva su interpretación al añadir a. Por inducción, al terminar se obtiene la suma de todas las cifras por sus pesos. Para negativos se aplica al valor absoluto y después se recupera el signo.',
  },
];
