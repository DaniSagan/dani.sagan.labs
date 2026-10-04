import { ExerciseDefinition } from '../../../widgets/self-assessment/self-assessment.component';

const exercise = (
  title: string,
  question: string,
  hints: string[],
  solution: string,
): ExerciseDefinition => ({ title, question, hints, solution });
export const DIAGONALIZATION_EXERCISES = {
  basic: [
    exercise(
      '1. Comprobar una dirección',
      'Para A = ((2,1),(1,2)), comprueba si (1,1) y (1,0) son autovectores y encuentra el autovalor cuando exista.',
      [
        'Calcula Av para cada vector.',
        'Compara las dos coordenadas con un mismo múltiplo de v.',
        'Estrategia: exige un único λ en ambas coordenadas.',
        'Desarrollo: A(1,1)=(3,3); A(1,0)=(2,1).',
      ],
      '(1,1) es autovector de λ=3. (1,0) no lo es: λ(1,0) siempre tiene segunda coordenada cero, pero su imagen tiene segunda coordenada 1.',
    ),
    exercise(
      '2. Polinomio y raíces',
      'Calcula pA(t)=det(A−tI) para A=((2,1),(0,1)) y sus autovalores.',
      [
        'Resta t solo en la diagonal.',
        'La matriz es triangular.',
        'Estrategia: multiplica las dos entradas diagonales.',
        'Desarrollo: (2−t)(1−t)=t²−3t+2.',
      ],
      'pA(t)=t²−3t+2=(t−2)(t−1). Los autovalores son 2 y 1, ambos simples.',
    ),
    exercise(
      '3. Calcular autoespacios',
      'Para A=((2,1),(0,1)), determina E₂ y E₁ y decide si A es diagonalizable.',
      [
        'Resuelve (A−λI)v=0 para cada raíz.',
        'Para λ=2 se impone y=0; para λ=1, x+y=0.',
        'Estrategia: parametriza cada núcleo.',
        'Desarrollo: v=s(1,0) o v=s(1,−1), respectivamente.',
      ],
      'E₂=span{(1,0)} y E₁=span{(1,−1)}. Ambas dimensiones son uno. Los vectores son independientes y A es diagonalizable sobre ℝ.',
    ),
    exercise(
      '4. El autovalor cero',
      'Para A=((1,0),(0,0)), encuentra ker A e interpreta geométricamente sus dos autovalores.',
      [
        'A(x,y)=(x,0).',
        '¿Qué vectores van al origen?',
        'Estrategia: separa el eje horizontal del vertical.',
        'Desarrollo: A(1,0)=(1,0) y A(0,1)=0.',
      ],
      'ker A=span{(0,1)}=E₀. El eje vertical colapsa; el horizontal es E₁ y queda fijo. La matriz es una proyección diagonalizable, aunque singular.',
    ),
    exercise(
      '5. Muchos representantes',
      'Explica por qué (2,2) y (−1,−1) son propios de la misma raíz que (1,1), y por qué el cero no es un autovector.',
      [
        'Usa la linealidad.',
        'A(αv)=αAv.',
        'Estrategia: sustituye Av=λv.',
        'Desarrollo: A(αv)=λ(αv); exige α≠0 si v≠0.',
      ],
      'Todos los múltiplos no nulos de un autovector son autovectores del mismo λ. El cero cumple A0=λ0 para cualquier λ y se excluye por definición; sí pertenece a todo autoespacio.',
    ),
  ],
  intermediate: [
    exercise(
      '6. Mismas raíces, respuestas distintas',
      'Construye dos matrices con p(t)=(t−2)², una diagonalizable y otra no. Calcula ambas multiplicidades.',
      [
        'Compara una matriz escalar con un bloque de Jordan.',
        'Prueba 2I₂ y ((2,1),(0,2)).',
        'Estrategia: calcula el núcleo de A−2I.',
        'Desarrollo: el primer núcleo es ℝ²; el segundo exige y=0.',
      ],
      '2I₂ tiene mₐ(2)=mᵍ(2)=2 y es diagonalizable. ((2,1),(0,2)) tiene mₐ(2)=2 pero mᵍ(2)=1 y no lo es. El polinomio por sí solo no decide.',
    ),
    exercise(
      '7. Construir y verificar',
      'Diagonaliza A=((2,1),(0,1)), construye P y D y comprueba AP=PD y P⁻¹AP=D.',
      [
        'Utiliza los autoespacios del ejercicio 3.',
        'Pon (1,0) y (1,−1) como columnas.',
        'Estrategia: conserva el orden 2,1 en D.',
        'Desarrollo: P=((1,1),(0,−1)), P⁻¹=P y AP=((2,1),(0,−1)).',
      ],
      'P=((1,1),(0,−1)) y D=diag(2,1). det P=−1, P²=I, AP=PD=((2,1),(0,−1)), y P⁻¹AP=D. Intercambiar columnas exige intercambiar la diagonal.',
    ),
    exercise(
      '8. A elevado a cien',
      'Para A=((2,1),(1,2)), calcula A¹⁰⁰ sin realizar cien productos. Comprueba tu fórmula para n=0 y n=1.',
      [
        'Sus autovalores son 3 y 1.',
        'Utiliza P=((1,1),(1,−1)).',
        'Estrategia: calcula PDⁿP⁻¹.',
        'Desarrollo: la entrada diagonal es (3ⁿ+1)/2 y la no diagonal (3ⁿ−1)/2.',
      ],
      'A¹⁰⁰=½((3¹⁰⁰+1,3¹⁰⁰−1),(3¹⁰⁰−1,3¹⁰⁰+1)). Para n=0 se obtiene I y para n=1 se obtiene A. La fórmula se deduce de la base propia, con P⁻¹=P/2.',
    ),
    exercise(
      '9. ¿Real o complejo?',
      'Estudia R=((0,−1),(1,0)) sobre ℝ y sobre ℂ; proporciona una base propia si existe.',
      [
        'pR(t)=t²+1.',
        'Sobre ℂ las raíces son i y −i.',
        'Estrategia: resuelve Rv=±iv.',
        'Desarrollo: (1,−i) es propio de i y (1,i) es propio de −i.',
      ],
      'No hay autovalores ni autovectores reales. Sobre ℂ, P=((1,1),(−i,i)) tiene det P=2i≠0 y P⁻¹RP=diag(i,−i). Es diagonalizable sobre ℂ.',
    ),
    exercise(
      '10. Una dimensión que falta',
      'Compara diag(2,2,−1) con A=((2,1,0),(0,2,0),(0,0,−1)). Calcula E₂, E₋₁ y sus multiplicidades.',
      [
        'Ambas matrices son triangulares y tienen el mismo polinomio.',
        'Resuelve los núcleos para 2 y −1.',
        'Estrategia: cuenta variables libres.',
        'Desarrollo: en la segunda, (A−2I)v=0 obliga a y=z=0.',
      ],
      'En la primera E₂=span{e₁,e₂}, E₋₁=span{e₃}: dimensiones 2 y 1, iguales a las multiplicidades algebraicas. En la segunda E₂=span{e₁}, E₋₁=span{e₃}: dimensiones 1 y 1. Solo la primera es diagonalizable.',
    ),
  ],
  advanced: [
    exercise(
      '11. Una familia con parámetro',
      'Determina para qué a∈ℝ es diagonalizable A(a)=((1,a),(0,1)). Demuestra la respuesta.',
      [
        'El polinomio es (1−t)² para todo a.',
        'A(a)−I=((0,a),(0,0)).',
        'Estrategia: separa a=0 de a≠0.',
        'Desarrollo: si a≠0 se impone y=0; si a=0 cualquier vector resuelve el sistema.',
      ],
      'Es diagonalizable exactamente para a=0, cuando A=I y dim E₁=2. Si a≠0, dim E₁=1<2=mₐ(1); no hay base propia, ni siquiera sobre ℂ.',
    ),
    exercise(
      '12. Un cruce de raíces',
      'Estudia A(a)=((a,1),(0,2)) y construye una diagonalización cuando sea posible.',
      [
        'Las raíces son a y 2.',
        'La excepción posible es a=2.',
        'Estrategia: para a≠2 elige v₁=(1,0), v₂=(1,2−a).',
        'Desarrollo: Av₂=(2,2(2−a)) y det(v₁,v₂)=2−a.',
      ],
      'Si a≠2, P=((1,1),(0,2−a)) es invertible, D=diag(a,2) y AP=PD. Si a=2, el autoespacio de la raíz doble 2 tiene dimensión uno: no es diagonalizable.',
    ),
    exercise(
      '13. Diagonalización ortogonal',
      'Diagonaliza ortogonalmente S=((4,2),(2,1)). Interpreta su núcleo y la forma cuadrática xᵀSx.',
      [
        'pS(t)=t²−5t.',
        'Vectores propios: (2,1) y (1,−2).',
        'Estrategia: normaliza ambos por √5.',
        'Desarrollo: son perpendiculares; S(2,1)=5(2,1), S(1,−2)=0.',
      ],
      'Q=1/√5 ((2,1),(1,−2)) es ortogonal y QᵀSQ=diag(5,0). ker S=span{(1,−2)}. En coordenadas propias la forma es 5u², semidefinida positiva, sin término en v.',
    ),
    exercise(
      '14. Recurrencia desacoplada',
      'Resuelve uₙ₊₂=3uₙ₊₁−2uₙ, con u₀=0 y u₁=1, usando una matriz y su diagonalización.',
      [
        'Guarda (uₙ₊₁,uₙ).',
        'La matriz es B=((3,−2),(1,0)).',
        'Estrategia: sus raíces son 2 y 1, con vectores (2,1) y (1,1).',
        'Desarrollo: (1,0)=(2,1)−(1,1). Tras n pasos, el estado es 2ⁿ(2,1)−(1,1).',
      ],
      'P=((2,1),(1,1)), D=diag(2,1) y B=PDP⁻¹. El estado es (2ⁿ⁺¹−1,2ⁿ−1), luego uₙ=2ⁿ−1. Se verifican u₀=0, u₁=1 y la recurrencia al sustituir la fórmula.',
    ),
    exercise(
      '15. Una órbita y un modo dominante',
      'Para A=((2,1),(1,2)), calcula Aⁿx₀ con x₀=(2,0) y con x₀=(1,−1). Explica por qué no todas las órbitas crecen.',
      [
        'Escribe x₀ en la base (1,1),(1,−1).',
        '(2,0)=(1,1)+(1,−1).',
        'Estrategia: eleva 3 y 1 en cada componente.',
        'Desarrollo: la primera órbita es 3ⁿ(1,1)+(1,−1); la segunda solo contiene el modo λ=1.',
      ],
      'Aⁿ(2,0)=(3ⁿ+1,3ⁿ−1), cuya dirección se aproxima a (1,1). Aⁿ(1,−1)=(1,−1) permanece fija. El autovalor dominante solo influye si su componente inicial es no nula.',
    ),
    exercise(
      '16. Demostrar la ortogonalidad',
      'Prueba que dos autovectores de autovalores distintos de una matriz real simétrica son ortogonales. ¿Sirve para cualquier matriz?',
      [
        'Compara ⟨Au,v⟩ y ⟨u,Av⟩.',
        'Aᵀ=A permite igualarlos.',
        'Estrategia: sustituye Au=λu y Av=μv.',
        'Desarrollo: (λ−μ)⟨u,v⟩=0.',
      ],
      'Como λ≠μ, ⟨u,v⟩=0. La simetría es esencial: para ((2,1),(0,1)), los autovectores (1,0) y (1,−1) tienen producto escalar 1 y no son ortogonales.',
    ),
    exercise(
      '17. Demostrar el criterio',
      'Demuestra las dos implicaciones: A es diagonalizable si y solo si existe una base de autovectores.',
      [
        'Escribe las columnas de P como vᵢ.',
        'La columna i de AP=PD es Avᵢ=dᵢᵢvᵢ.',
        'Estrategia: usa invertibilidad en un sentido e independencia en el otro.',
        'Desarrollo: si P⁻¹AP=D, sus columnas dan la base; si tienes la base, construyes P y D.',
      ],
      'Desde P⁻¹AP=D obtenemos AP=PD y Avᵢ=λᵢvᵢ; P invertible garantiza que sus columnas forman una base no nula. Desde una base propia construimos P=(v₁,…,vₙ), D=diag(λ₁,…,λₙ); la igualdad por columnas AP=PD y la inversa de P dan la diagonalización.',
    ),
    exercise(
      '18. Controlar las multiplicidades',
      'Justifica mᵍ(λ)≤mₐ(λ) y deduce el criterio general de diagonalización sobre un cuerpo 𝕂.',
      [
        'Completa una base de Eλ a una base del espacio.',
        'La matriz resultante contiene el bloque λIᵣ, con r=dim Eλ.',
        'Estrategia: factoriza el determinante por bloques y usa la suma directa de autoespacios.',
        'Desarrollo: (λ−t)ʳ divide pA(t); si las raíces están en 𝕂 y mᵍ=mₐ, la suma de dimensiones es n.',
      ],
      'En la base extendida, B=((λIᵣ,C),(0,H)), luego pA(t)=(λ−t)ʳdet(H−tI) y r≤mₐ. Si el polinomio se descompone sobre 𝕂 y todas las multiplicidades coinciden, las bases de autoespacios forman n vectores independientes. Recíprocamente una matriz diagonal tiene tantas coordenadas libres en Eλ como repeticiones de λ, y la semejanza conserva esa dimensión.',
    ),
  ],
} satisfies Record<string, ExerciseDefinition[]>;
