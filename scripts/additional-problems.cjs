// Original, individually authored exercises 101–200. Run generate-additional-problems.cjs to materialize Angular components.
const groups = [];
let entries;
function group(folder) { entries = []; groups.push({folder, entries}); }
function p(title, article, statement, steps, answer, pitfall) { entries.push({title, article, statement, steps, answer, pitfall}); }
group('number-theory');
p('Un resto con dividendo negativo','division-algorithm', 'Divide −47 entre 6 usando un resto no negativo. Explica por qué el cociente no es −7.', [
'La división euclídea busca enteros q y r tales que −47=6q+r y 0≤r<6. El resto representa lo que falta tras retirar un múltiplo del divisor; esta condición fija una única respuesta.',
'El múltiplo 6·(−7)=−42 queda por encima de −47. Si lo usamos, r=−47−(−42)=−5, que incumple la condición de no negatividad.',
'Bajamos un múltiplo: 6·(−8)=−48. Ahora r=−47−(−48)=1, comprendido entre 0 y 5.',
'Comprobamos la igualdad: 6·(−8)+1=−48+1=−47. Otro cociente cambiaría el resto en un múltiplo de 6 y lo sacaría del intervalo permitido.'
], 'Cociente −8 y resto 1.', 'Truncar una división decimal hacia cero no siempre produce el cociente euclídeo.');
p('Ceros al final de un factorial','prime-valuations','¿Cuántos ceros tiene al final 25! en base diez? Justifica cómo cuentas los factores.',[
'El símbolo 25! significa el producto 1·2·…·25. Cada cero final corresponde a un factor 10=2·5. Debemos contar cuántas parejas de factores 2 y 5 podemos formar.',
'Hay más doses que cincos: ya los doce números pares aportan al menos doce doses. Por tanto, los cincos son el recurso que limita las parejas.',
'Los múltiplos de 5 son 5, 10, 15, 20 y 25. Cada uno aporta al menos un factor 5: contamos cinco.',
'El número 25=5·5 aporta un segundo cinco. No hay múltiplos de 125, así que no hay contribuciones adicionales. Obtenemos 5+1=6 cincos y al menos seis doses.',
'Podemos extraer exactamente seis factores 10; después ya no queda ningún cinco para construir otro. Esto prueba tanto la existencia como la maximalidad del número de ceros.'
], '25! termina en 6 ceros.', 'Contar únicamente los múltiplos de 5 olvida los factores repetidos de 25.');
p('Un inverso para descifrar','bezout-identity','Encuentra el inverso de 7 módulo 26 y resuelve 7x≡9 (módulo 26).',[
'Decir que dos enteros son congruentes módulo 26 significa que su diferencia es múltiplo de 26. Un inverso de 7 es un entero u con 7u≡1; permite deshacer la multiplicación.',
'Aplicamos divisiones sucesivas: 26=3·7+5, 7=1·5+2 y 5=2·2+1. El último resto no nulo es 1, así que los números son coprimos y existe inverso.',
'Deshacemos las divisiones: 1=5−2·2=5−2(7−5)=3·5−2·7. Sustituyendo 5=26−3·7 resulta 1=3·26−11·7.',
'Por ello −11 es un inverso de 7; sumando 26 obtenemos el representante 15. Multiplicamos la congruencia por 15: x≡135≡5, porque 135=5·26+5.',
'Verificamos: 7·5=35=26+9. Todas las soluciones enteras son 5+26k: sumar 26 a x cambia 7x en un múltiplo de 26.'
], 'Inverso 15; x=5+26k, con k entero.', 'Dividir una congruencia requiere un inverso; no es una división ordinaria.');
p('Divisores que son cubos','divisor-sum-theorem','Calcula cuántos divisores positivos de 3600 son cubos perfectos y enuméralos.',[
'Descomponemos 3600=36·100=2⁴·3²·5². Todo divisor positivo tiene la forma 2ᵃ3ᵇ5ᶜ, con 0≤a≤4, 0≤b≤2 y 0≤c≤2.',
'Un cubo perfecto es el cubo de un entero. Al elevar un producto de primos al cubo, todos sus exponentes se multiplican por tres; por unicidad de la factorización, también es una condición necesaria.',
'Para a podemos elegir 0 o 3. Para b y c solo podemos elegir 0, pues el siguiente múltiplo de tres sería 3 y superaría sus cotas.',
'Hay 2·1·1=2 elecciones independientes: 2⁰3⁰5⁰=1 y 2³3⁰5⁰=8. Ambos dividen 3600 y son 1³ y 2³.'
], 'Dos divisores: 1 y 8.', 'El número 1 también es un cubo perfecto y un divisor positivo.');
p('Una potencia enorme módulo siete','fermats-little-theorem','Calcula el resto de 3²⁰²⁶ al dividir por 7 sin calcular la potencia completa.',[
'Solo necesitamos el resto. En aritmética modular podemos sustituir un factor por otro con el mismo resto, porque sus diferencias siguen siendo múltiplos de 7 después de multiplicar.',
'Calculamos 3²=9≡2 y 3³≡2·3=6≡−1. Al cuadrar esta última relación obtenemos 3⁶≡1.',
'Dividimos el exponente: 2026=6·337+4. Entonces 3²⁰²⁶=(3⁶)³³⁷·3⁴≡1·3⁴.',
'Como 3⁴=(3²)²≡2²=4, ese es el resto. Está entre 0 y 6, por lo que ya es el representante euclídeo buscado.'
], 'El resto es 4.', 'Reducir el exponente módulo 7 no está justificado; aquí se reduce por el período 6.');
p('Un número con dos condiciones','chinese-remainder-theorem','Busca el menor entero positivo que deja resto 2 al dividir por 5 y resto 4 al dividir por 7.',[
'La primera condición significa n=2+5k, con k entero. Escribir todos los candidatos de esta manera asegura que no perdamos ninguna solución.',
'Sustituimos en la segunda: 2+5k≡4 módulo 7, de donde 5k≡2. Como 5·3=15≡1, multiplicamos por 3 y obtenemos k≡6.',
'Todos los valores son k=6+7t. Por tanto n=2+5(6+7t)=32+35t, con t entero.',
'Con t=0 sale 32; con t=−1 sale −3. Los valores crecen de 35 en 35, así que 32 es el menor positivo. Comprobamos 32=6·5+2=4·7+4.'
], 'El menor es 32; todas las soluciones son 32+35t.', 'Comprobar un candidato no demuestra que sea el menor; hace falta describir la familia.');
p('Un decimal periódico como fracción','geometric-series','Convierte 0,272727… en una fracción irreducible y explica por qué el procedimiento es exacto.',[
'Llamamos x al decimal infinito. Su bloque repetido tiene dos cifras; multiplicar por 100 desplaza la coma dos lugares y deja exactamente la misma cola periódica.',
'Así, 100x=27,272727… y x=0,272727…. Al restar, las colas coinciden y se cancelan: 99x=27.',
'Dividimos por 99: x=27/99. Numerador y denominador tienen un factor 9 común, de modo que x=3/11.',
'La cancelación puede justificarse con aproximaciones finitas: la cola que queda después de m bloques es menor que 100⁻ᵐ, que tiende a cero. Por tanto la igualdad no es un redondeo.',
'Como 3 y 11 son primos distintos, no tienen divisor común mayor que 1. La fracción obtenida ya es irreducible.'
], '0,272727…=3/11.', 'El decimal infinito no es igual a una versión truncada como 0,27.');
p('Dos cuadrados y una imposibilidad','sum-of-two-squares','Demuestra que ningún entero de la forma 4k+3 puede escribirse como suma de dos cuadrados de enteros.',[
'Basta estudiar los restos al dividir por 4. Todo entero es par, n=2a, o impar, n=2a+1; estas posibilidades cubren también los enteros negativos.',
'Si es par, n²=4a² deja resto 0. Si es impar, n²=4a²+4a+1 deja resto 1.',
'Al sumar dos cuadrados solo podemos sumar los restos 0+0, 0+1, 1+0 o 1+1. Los restos resultantes son 0, 1 o 2.',
'Un número 4k+3 deja resto 3. Como ese resto no aparece en la lista exhaustiva anterior, no puede ser una suma de dos cuadrados enteros.'
], 'Es imposible para todo entero k.', 'Que un número no tenga resto 3 es necesario, pero por sí solo no garantiza una representación.');
p('Una fracción continua corta','continued-fractions','Escribe 43/19 como fracción continua simple y reconstruye la fracción desde ella.',[
'En una fracción continua simple se separa la parte entera y se invierte el resto positivo. Empezamos con 43=2·19+5: 43/19=2+5/19=2+1/(19/5).',
'Repetimos: 19=3·5+4, así que 19/5=3+1/(5/4). Después 5=1·4+1 da 5/4=1+1/4.',
'La notación compacta es [2;3,1,4], que significa 2+1/(3+1/(1+1/4)). Cada denominador se interpreta desde dentro hacia fuera.',
'Reconstruimos: 1+1/4=5/4; luego 3+1/(5/4)=3+4/5=19/5; finalmente 2+1/(19/5)=2+5/19=43/19. Recuperamos el dato inicial.'
], '43/19=[2;3,1,4].', 'No se suman las entradas: representan divisiones anidadas.');
p('Por qué raíz de tres es irracional','fundamental-theorem-arithmetic','Demuestra que √3 no es una fracción de enteros.',[
'Suponemos lo contrario: √3=a/b, con a y b enteros positivos sin divisores comunes y b≠0. Cualquier fracción positiva puede simplificarse hasta cumplir esta condición.',
'Al elevar al cuadrado y multiplicar por b² resulta a²=3b². Esto implica que 3 divide a². En la factorización de a² los exponentes son dobles de los de a, por lo que 3 también divide a.',
'Escribimos a=3c. Sustituyendo obtenemos 9c²=3b²; al dividir por 3 queda b²=3c². El mismo razonamiento implica que 3 divide b.',
'Así, 3 divide tanto a como b, contradiciendo que la fracción estaba simplificada. La suposición inicial es falsa y √3 es irracional.'
], '√3 es irracional.', 'No basta con observar muchas cifras decimales: una prueba debe excluir todas las fracciones.');
group('algebra');
p('Una ecuación con denominadores','sign-charts','Resuelve (x+1)/(x−2)=3 e indica qué valor está prohibido.',[
'Una fracción solo está definida cuando su denominador no vale cero. Aquí x−2≠0, así que trabajamos con x≠2.',
'Multiplicamos ambos miembros por x−2. Es una transformación reversible dentro del dominio permitido: x+1=3(x−2).',
'Distribuimos el 3: x+1=3x−6. Sumamos 6 y restamos x en ambos lados: 7=2x. Dividimos por 2 y obtenemos x=7/2.',
'La solución no es 2. Sustituimos: (7/2+1)/(7/2−2)=(9/2)/(3/2)=3. Por tanto satisface la ecuación original.'
], 'x=7/2; x=2 está excluido del dominio.', 'Multiplicar por un denominador no permite reincorporar los puntos donde la expresión no existe.');
p('Un polinomio por agrupación','rational-root-theorem','Factoriza x³−2x²−x+2 y resuelve x³−2x²−x+2=0 en los reales.',[
'Factorizar significa escribir una suma como producto. Agrupamos los dos primeros términos y los dos últimos: x²(x−2)−(x−2).',
'Los dos sumandos contienen x−2. Lo extraemos: (x−2)(x²−1). Al multiplicar este producto se recupera exactamente el polinomio.',
'La diferencia de cuadrados satisface a²−b²=(a−b)(a+b). Con a=x y b=1 resulta (x−2)(x−1)(x+1).',
'Un producto de números reales vale cero si al menos uno de los factores vale cero. Resolvemos x−2=0, x−1=0 y x+1=0; salen 2, 1 y −1, respectivamente.'
], 'Factorización (x−2)(x−1)(x+1); raíces −1, 1 y 2.', 'El factor −(x−2) tiene signo negativo en ambos términos de su expansión.');
p('Una desigualdad racional','sign-charts','Resuelve (x−1)/(x+2)≥0 en los números reales.',[
'El denominador se anula en x=−2; ese punto queda prohibido. El numerador se anula en x=1; ahí la fracción sí existe y vale cero.',
'Los puntos −2 y 1 separan la recta en tres intervalos. En x<−2 ambos factores son negativos: su cociente es positivo.',
'Si −2<x<1, el numerador es negativo y el denominador positivo: el cociente es negativo. Si x>1, ambos son positivos y el cociente también.',
'La desigualdad admite los valores positivos y el cero. Reunimos x<−2 y x≥1, incluyendo 1 y excluyendo −2. Los signos no cambian dentro de cada intervalo porque ningún factor se anula allí.'
], 'Solución: (−∞,−2) ∪ [1,∞).', 'Multiplicar directamente por x+2 exige separar su signo, pues podría invertir la desigualdad.');
p('Completar un cuadrado','quadratic-equations','Encuentra el mínimo de x²−6x+13 y los valores de x para los que vale 8.',[
'Buscamos un cuadrado con los términos x²−6x. Como (x−3)²=x²−6x+9, añadimos y restamos 9: x²−6x+13=(x−3)²+4.',
'Todo cuadrado real es no negativo. Por ello la expresión es al menos 4 y alcanza ese valor cuando x−3=0, es decir, en x=3.',
'Para que valga 8, imponemos (x−3)²+4=8. Restar 4 da (x−3)²=4.',
'Los números cuyo cuadrado es 4 son 2 y −2. Así, x−3=2 o x−3=−2, que dan x=5 o x=1. Al sustituir en el polinomio ambos producen 8.'
], 'Mínimo 4 en x=3; el valor 8 se alcanza en x=1 y x=5.', 'Tomar solo la raíz positiva perdería una de las dos soluciones.');
p('Una identidad que acota un producto','quadratic-equations','Si a y b son reales con a+b=10, demuestra que ab≤25 y determina cuándo hay igualdad.',[
'El cuadrado de cualquier número real es no negativo. Aplicamos esta propiedad a la diferencia: (a−b)²≥0.',
'Desarrollamos: a²−2ab+b²≥0. Como (a+b)²=a²+2ab+b², podemos reescribir lo anterior como (a+b)²−4ab≥0.',
'Sustituimos la suma conocida: 100−4ab≥0. Sumamos 4ab y dividimos por 4, que es positivo: ab≤25.',
'La igualdad exige (a−b)²=0, por tanto a=b. Junto con a+b=10 obtenemos a=b=5; su producto es efectivamente 25. No hemos supuesto que a y b fueran positivos.'
], 'ab≤25, con igualdad únicamente si a=b=5.', 'La condición de igualdad debe verificarse también con la restricción original.');
p('Coordenadas en una base oblicua','vector-spaces','Expresa v=(5,1) en la base u=(1,1), w=(1,−1). Explica la diferencia entre coordenadas y componentes habituales.',[
'Buscamos coeficientes a y b que cumplan v=au+bw. No estamos pidiendo las coordenadas habituales (5,1), sino cuánto aporta cada vector de la nueva base.',
'Al sumar por componentes, au+bw=(a+b,a−b). Igualando con (5,1) obtenemos a+b=5 y a−b=1.',
'Sumamos las ecuaciones: 2a=6, de donde a=3. Sustituimos en a+b=5: b=2.',
'Verificamos 3(1,1)+2(1,−1)=(3,3)+(2,−2)=(5,1). Además, el sistema homogéneo a+b=0, a−b=0 solo tiene a=b=0; los vectores son independientes y estas coordenadas son únicas.'
], 'Las coordenadas en la base (u,w) son (3,2).', 'Los coeficientes de una base dependen de la base elegida.');
p('Núcleo e imagen de una aplicación','vector-spaces','Para T(x,y,z)=(x+y,y+z), describe el núcleo y la imagen y comprueba rango más nulidad.',[
'El núcleo contiene las entradas que producen el vector cero. Imponemos x+y=0 e y+z=0.',
'De la primera ecuación x=−y y de la segunda z=−y. Si llamamos t a y, toda solución es (−t,t,−t)=t(−1,1,−1). El núcleo tiene una dirección libre: dimensión 1.',
'La imagen contiene las salidas posibles. Dado cualquier par (a,b), la entrada (a,0,b) produce T(a,0,b)=(a,b). Por tanto la imagen es todo el plano real, de dimensión 2.',
'El rango es la dimensión de la imagen, 2; la nulidad es la dimensión del núcleo, 1. Su suma 2+1=3 coincide con la dimensión del espacio de entrada.'
], 'Núcleo generado por (−1,1,−1); imagen igual a ℝ²; rango 2 y nulidad 1.', 'La imagen vive en el espacio de salida y el núcleo en el de entrada.');
p('Dos vectores ortonormales','gram-schmidt','Aplica Gram–Schmidt a u=(1,1,0) y v=(1,0,1), y da una base ortonormal del plano que generan.',[
'Ortonormal significa que los vectores son perpendiculares y tienen longitud 1. La longitud de u es √(1²+1²)=√2, de modo que e₁=(1,1,0)/√2.',
'Para quitar la parte paralela buscamos w=v−αu perpendicular a u. Imponemos w·u=0: v·u−α(u·u)=0. Despejando obtenemos α=(v·u)/(u·u); podemos dividir porque u no es cero y u·u es su longitud al cuadrado.',
'El producto escalar suma productos de componentes. Calculamos v·u=1 y u·u=2. La parte de v paralela a u es ((v·u)/(u·u))u=(1/2,1/2,0).',
'Restamos esa parte: w=v−u/2=(1/2,−1/2,1). Comprobamos u·w=1/2−1/2=0; el nuevo vector es perpendicular al primero.',
'La norma de w es √(1/4+1/4+1)=√(3/2)=√6/2. Al dividir w por ella obtenemos e₂=(1,−1,2)/√6.',
'Los numeradores tienen producto escalar 1−1+0=0 y cuadrados de normas 2 y 6. Los denominadores los convierten en unitarios. Como solo restamos un múltiplo de u y escalamos, el plano generado no cambia.'
], 'e₁=(1,1,0)/√2 y e₂=(1,−1,2)/√6.', 'Normalizar sin restar la proyección no elimina la componente paralela.');
p('Un ajuste constante por mínimos cuadrados','projection-least-squares','Aproxima las mediciones 2, 4 y 9 por una sola constante c minimizando la suma de errores cuadrados.',[
'La función que queremos minimizar es S(c)=(2−c)²+(4−c)²+(9−c)². El cuadrado impide que errores de signos contrarios se cancelen.',
'Desarrollamos cada término y agrupamos: S(c)=3c²−30c+101. El coeficiente lineal es −2(2+4+9)=−30 y el constante es 4+16+81=101.',
'Completamos el cuadrado: 3c²−30c+101=3(c−5)²+26. La primera parte es no negativa y se anula exactamente cuando c=5.',
'Los residuos son 2−5=−3, 4−5=−1 y 9−5=4. Su suma es cero y la suma de cuadrados es 9+1+16=26, lo que comprueba el mínimo calculado.'
], 'La mejor constante es c=5 y el error cuadrático mínimo es 26.', 'Minimizar cuadrados no es lo mismo que minimizar valores absolutos.');
p('Una matriz que deshace otra','matrix-determinant','Encuentra la inversa de la matriz con filas (2,1) y (1,1), y úsala para resolver 2x+y=7, x+y=4.',[
'Una matriz inversa deshace la transformación original: su producto con ella debe ser la identidad, que deja cualquier vector igual. El determinante es 2·1−1·1=1, distinto de cero.',
'Para una matriz de filas (a,b),(c,d), la inversa tiene filas (d,−b),(−c,a), divididas por ad−bc. En este caso las filas son (1,−1),(−1,2).',
'Comprobamos el producto: la primera fila produce (2−1,−2+2)=(1,0) y la segunda (1−1,−1+2)=(0,1). Por tanto la fórmula sí da una inversa.',
'Multiplicamos la inversa por el vector de términos independientes (7,4): x=7−4=3, y=−7+8=1. Sustituir da 2·3+1=7 y 3+1=4.'
], 'Inversa de filas (1,−1),(−1,2); solución (x,y)=(3,1).', 'El inverso de una matriz no se obtiene invirtiendo cada entrada.');
group('geometry');
p('Una altura por semejanza','triangle-similarity','Una vara vertical de 1,5 m proyecta una sombra de 2 m. Un árbol proyecta al mismo tiempo una sombra de 12 m sobre el mismo suelo horizontal. Halla su altura.',[
'Idealizamos los rayos solares como paralelos y el árbol y la vara como verticales. Cada objeto y su sombra forman un triángulo rectángulo con un rayo solar como hipotenusa.',
'Ambos triángulos tienen un ángulo recto y el mismo ángulo con los rayos. Son semejantes: sus longitudes correspondientes guardan la misma proporción.',
'Si h es la altura del árbol, h/12=1,5/2. Multiplicamos ambos lados por 12: h=12·1,5/2.',
'Calculamos 12/2=6 y 6·1,5=9. La sombra del árbol es seis veces mayor y su altura también; esto comprueba la proporción y las unidades.'
], 'El árbol mide 9 m bajo las hipótesis indicadas.', 'La comparación exige el mismo ángulo solar y pendientes de suelo compatibles.');
p('El radio de un triángulo rectángulo','incircles-circumcircles','Calcula el inradio y el circunradio de un triángulo rectángulo con catetos 6 y 8.',[
'La hipotenusa se obtiene por Pitágoras: c²=6²+8²=36+64=100, así que c=10. El área es la mitad del producto de los catetos: A=6·8/2=24.',
'El semiperímetro es la mitad de la suma de lados: s=(6+8+10)/2=12. Unir el incentro con los tres vértices divide el triángulo en tres triángulos de altura r, el inradio.',
'La suma de sus áreas es (6r+8r+10r)/2=sr. Por tanto r=A/s=24/12=2.',
'En un triángulo rectángulo el punto medio de la hipotenusa está a igual distancia de los tres vértices. Es el circuncentro y su radio es la mitad de la hipotenusa: R=10/2=5.'
], 'Inradio 2 y circunradio 5, en las unidades de los lados.', 'El inradio mide distancia a los lados; el circunradio mide distancia a los vértices.');
p('Un hexágono a partir de su apotema','apothem','Un hexágono regular tiene apotema 3√3 cm. Calcula su lado, perímetro y área.',[
'Unimos el centro con los seis vértices. Se forman seis triángulos isósceles con ángulo central 360°/6=60°; sus otros dos ángulos también son 60°, por lo que son equiláteros.',
'Si el lado es l, la apotema es la altura de uno de esos triángulos. Al dividirlo por la mitad, Pitágoras da a²=l²−(l/2)²=3l²/4.',
'Como las longitudes son positivas, a=√3·l/2. Sustituimos 3√3=√3·l/2 y dividimos por √3: l=6 cm.',
'El perímetro es P=6l=36 cm. Sumando las seis áreas triangulares obtenemos A=Pa/2=36·3√3/2=54√3 cm².'
], 'Lado 6 cm, perímetro 36 cm y área 54√3 cm².', 'La apotema llega al punto medio de un lado, no a un vértice.');
p('Escalar longitudes, áreas y volúmenes','homothety','Un modelo sólido tiene arista característica 4 cm, área total 60 cm² y volumen 20 cm³. Se amplía por semejanza hasta una arista de 10 cm. Halla área y volumen nuevos.',[
'La razón de semejanza es la longitud nueva dividida por la original: k=10/4=5/2. Todas las longitudes se multiplican por ese mismo factor.',
'Un área combina dos dimensiones. Si ambas se multiplican por k, el área se multiplica por k²=25/4.',
'Un volumen combina tres dimensiones, así que su factor es k³=125/8. Esta regla vale para sólidos semejantes, aunque no sean cubos.',
'El área nueva es 60·25/4=375 cm². El volumen nuevo es 20·125/8=625/2=312,5 cm³. Ambos crecen más que una longitud porque intervienen más dimensiones.'
], 'Área 375 cm² y volumen 312,5 cm³.', 'Aplicar el factor 2,5 directamente al volumen ignora dos dimensiones.');
p('El centro de masas de tres puntos','barycenter','Sitúa masas 1, 2 y 3 en A=(0,0), B=(6,0) y C=(0,4). Encuentra su centro de masas.',[
'El centro de masas es un promedio de posiciones ponderado por las masas. La masa total es M=1+2+3=6; dividir por M convierte las masas en pesos que suman uno.',
'Para la coordenada horizontal sumamos masa por posición horizontal: 1·0+2·6+3·0=12. Por ello x=12/6=2.',
'Para la vertical sumamos 1·0+2·0+3·4=12, por lo que y=12/6=2. El centro es G=(2,2).',
'Comprobamos el equilibrio de desplazamientos: horizontalmente 1(0−2)+2(6−2)+3(0−2)=−2+8−6=0; verticalmente 1(0−2)+2(0−2)+3(4−2)=−2−4+6=0.'
], 'Centro de masas G=(2,2).', 'Promediar los vértices sin ponderar solo sirve cuando las masas son iguales.');
p('Una esfera inscrita en un cubo','inspheres-circumspheres','Un cubo tiene arista 6. Calcula los radios de sus esferas inscrita y circunscrita y su cociente.',[
'Las dos esferas tienen centro en el centro del cubo. La inscrita toca cada cara, así que su radio es la distancia del centro a una cara: r=6/2=3.',
'Para la circunscrita necesitamos la distancia del centro a un vértice. Tomando el centro como origen, un vértice tiene coordenadas (3,3,3).',
'Aplicamos Pitágoras en tres dimensiones: R²=3²+3²+3²=27. Como el radio es positivo, R=√27=3√3.',
'El cociente R/r=(3√3)/3=√3. La esfera circunscrita pasa por los vértices; la inscrita toca los centros de las caras, que están más cerca del centro.'
], 'r=3, R=3√3 y R/r=√3.', 'La diagonal de una cara no es la diagonal espacial que conecta vértices opuestos.');
p('Una normal a partir de dos direcciones','cross-product','El plano pasa por el origen y contiene u=(1,0,1) y v=(0,1,1). Encuentra una ecuación del plano.',[
'Una normal es un vector perpendicular a todas las direcciones del plano. El producto vectorial de dos direcciones independientes permite construirla.',
'Para u y v, el producto vectorial es (u₂v₃−u₃v₂, u₃v₁−u₁v₃, u₁v₂−u₂v₁). Sustituimos y obtenemos n=(−1,−1,1).',
'Comprobamos n·u=−1+1=0 y n·v=−1+1=0. Además n no es cero, de modo que sí determina una dirección normal.',
'Como el plano pasa por el origen, sus puntos X=(x,y,z) cumplen n·X=0. Así, −x−y+z=0, o equivalentemente z=x+y. Los vectores u y v satisfacen esta ecuación.'
], 'El plano es z=x+y.', 'Un vector contenido en el plano no puede usarse como normal sin comprobar perpendicularidad.');
p('Una sección triangular de un cubo','pythagorean-distance','En un cubo de arista 2 considera A=(2,0,0), B=(0,2,0), C=(0,0,2). Calcula el perímetro y el área del triángulo ABC.',[
'Para medir AB restamos coordenadas: B−A=(−2,2,0). Su longitud es √(4+4)=2√2. Las otras dos diferencias tienen las mismas componentes salvo orden y signo.',
'Por tanto AB=BC=CA=2√2. El triángulo es equilátero y su perímetro es 3·2√2=6√2.',
'La altura de un equilátero de lado l divide la base en dos mitades. Por Pitágoras h²=l²−l²/4=3l²/4, de donde h=√3·l/2.',
'Su área es lh/2=√3·l²/4. Con l²=8 obtenemos A=2√3. Las distancias se expresan en unidades y el área en unidades cuadradas.'
], 'Perímetro 6√2 y área 2√3.', 'Los lados del triángulo son diagonales de caras, no aristas del cubo.');
p('Contar aristas de un octaedro','euler-polyhedron-formula','Un octaedro tiene ocho caras triangulares. Deduce cuántas aristas y vértices tiene.',[
'Cada una de las ocho caras tiene tres lados. Al contar por caras obtenemos 8·3=24 incidencias de lado con cara.',
'En un poliedro cerrado cada arista pertenece a dos caras. La cuenta anterior duplica cada arista: 2E=24 y E=12.',
'Para un poliedro convexo, la fórmula de Euler dice V−E+F=2. Aquí F=8 y E=12; sustituimos V−12+8=2.',
'Simplificando V−4=2 obtenemos V=6. La cuenta es coherente con dos pirámides de base cuadrada unidas: cuatro vértices ecuatoriales y dos extremos.'
], '12 aristas y 6 vértices.', 'Contar tres lados por cara sin dividir entre dos duplica las aristas.');
p('Una tangente desde un punto exterior','chords-secants-tangents','Una circunferencia tiene centro O y radio 5. P está a distancia 13 de O. Calcula la longitud del segmento tangente PT.',[
'El punto de tangencia T pertenece a la circunferencia, por lo que OT=5. El radio al punto de tangencia es perpendicular a la recta tangente.',
'Así, el triángulo OTP es rectángulo en T. Su hipotenusa es OP=13, no el segmento tangente.',
'Pitágoras da OP²=OT²+PT². Despejamos PT²=13²−5²=169−25=144.',
'La longitud es positiva: PT=√144=12. Al comprobar 5²+12²=25+144=169=13² recuperamos el triángulo rectángulo requerido.'
], 'El segmento tangente mide 12.', 'La resta se hace entre cuadrados de longitudes, no entre las longitudes 13 y 5.');
group('trigonometry-complex-numbers');
p('Una vuelta expresada en radianes','radians','Una rueda de radio 30 cm gira 150°. Calcula el ángulo en radianes y la longitud del arco recorrido por un punto del borde.',[
'Un radián es el ángulo que abarca un arco de longitud igual al radio. Una vuelta completa abarca 2π radianes y también 360°, por lo que 180° equivalen a π radianes.',
'Convertimos 150° multiplicando por π/180: θ=150π/180=5π/6. El ángulo representa cinco doceavos de una vuelta.',
'Por la definición de radián, la longitud del arco es s=rθ cuando θ está en radianes. Sustituimos r=30 cm: s=30·5π/6=25π cm.',
'Comprobamos con la proporción de vuelta: la circunferencia mide 2π·30=60π cm y cinco doceavos son 60π·5/12=25π cm.'
], 'Ángulo 5π/6 rad y arco 25π cm.', 'La fórmula s=rθ no admite introducir grados directamente.');
p('Una ecuación de coseno doble','trigonometric-equations','Resuelve cos(2x)=1/2 para 0≤x<2π.',[
'Llamamos t=2x. Como x recorre [0,2π), el nuevo ángulo recorre [0,4π); debemos buscar soluciones durante dos vueltas completas.',
'En la circunferencia unidad, cos t=1/2 corresponde a t=π/3 y t=5π/3 en la primera vuelta. En la segunda sumamos 2π: t=7π/3 y t=11π/3.',
'Dividimos cada valor por 2 para volver a x: π/6, 5π/6, 7π/6 y 11π/6. Todos pertenecen al intervalo pedido.',
'Al duplicar cada candidato se recuperan los cuatro ángulos anteriores. No hay más porque en cada vuelta el coseno toma 1/2 solo en esas dos posiciones.'
], 'x=π/6, 5π/6, 7π/6 o 11π/6.', 'Al sustituir t=2x también cambia el intervalo de búsqueda.');
p('Un seno inverso fuera de su rama','trig-inverse-trig-composition','Calcula arcsen(sen(5π/6)) y explica por qué no devuelve 5π/6.',[
'La función seno repite valores y por eso no puede tener una inversa sobre todos los reales. Para definir arcsen se restringe el ángulo de salida al intervalo [−π/2,π/2].',
'El ángulo 5π/6 equivale a 150°. Su seno es el de π−π/6, que coincide con sen(π/6)=1/2.',
'Buscamos ahora el ángulo de la rama principal cuyo seno es 1/2. Ese ángulo es π/6, y sí pertenece a [−π/2,π/2].',
'El ángulo 5π/6 no pertenece a dicha rama. Por tanto arcsen(sen x)=x solo puede usarse sin corrección cuando x ya está en el intervalo principal.'
], 'arcsen(sen(5π/6))=π/6.', 'Una función trigonométrica inversa devuelve un representante fijado, no todos los ángulos posibles.');
p('Un lado por el coseno incluido','law-of-cosines','Dos lados de un triángulo miden 5 y 7 y forman un ángulo de 60°. Halla el tercer lado y el área.',[
'El ángulo dado está entre los dos lados conocidos. La ley de cosenos relaciona el lado opuesto c con ellos: c²=5²+7²−2·5·7·cos 60°.',
'Usamos cos 60°=1/2. Entonces c²=25+49−70/2=74−35=39. Como es una longitud, c=√39.',
'Para el área tomamos base 7. La altura del otro lado sobre esa base es 5·sen 60°=5√3/2, porque la altura es la componente perpendicular.',
'El área es base por altura entre dos: A=7·(5√3/2)/2=35√3/4. El lado √39 está entre 2 y 12, coherentemente con la desigualdad triangular.'
], 'Tercer lado √39 y área 35√3/4.', 'La ley de cosenos usa el ángulo comprendido entre los dos lados que aparecen en el producto.');
p('Un triángulo por la ley de senos','sine-law','En un triángulo A=30°, B=45° y el lado opuesto a A mide 6. Halla C y el lado opuesto a B.',[
'Los ángulos interiores de un triángulo plano suman 180°. Por ello C=180°−30°−45°=105°, que es positivo.',
'Denotamos a=6 y b al lado buscado. La ley de senos afirma a/sen A=b/sen B; cada lado se empareja con su ángulo opuesto.',
'Despejamos b=a·sen B/sen A. Sustituimos sen 45°=√2/2 y sen 30°=1/2: b=6·(√2/2)/(1/2)=6√2.',
'El lado b es mayor que a, como debe ocurrir porque su ángulo opuesto 45° es mayor que 30°. Esta comparación comprueba que no intercambiamos los lados.'
], 'C=105° y b=6√2.', 'Los lados y ángulos de la ley de senos se emparejan por oposición.');
p('Multiplicar dos números imaginarios compuestos','complex-numbers','Calcula (2+3i)(1−2i), su módulo y su conjugado.',[
'La unidad imaginaria cumple i²=−1. Multiplicamos distribuyendo todos los términos: 2·1+2·(−2i)+3i·1+3i·(−2i).',
'Obtenemos 2−4i+3i−6i². Como −6i²=6, la parte real es 2+6=8 y la imaginaria −4i+3i=−i.',
'El producto es z=8−i. Su módulo es la distancia al origen del punto (8,−1): |z|=√(8²+(−1)²)=√65.',
'El conjugado cambia solo el signo de la parte imaginaria: z̄=8+i. Comprobamos zz̄=(8−i)(8+i)=64−i²=65=|z|².'
], 'Producto 8−i, módulo √65 y conjugado 8+i.', 'El producto de dos términos imaginarios contribuye a la parte real porque i²=−1.');
p('Una división por conjugación','complex-numbers','Expresa (3+i)/(1−i) en la forma a+bi.',[
'Para eliminar la parte imaginaria del denominador multiplicamos numerador y denominador por el conjugado de 1−i, que es 1+i. Este factor no es cero.',
'El denominador se convierte en (1−i)(1+i)=1−i²=2. El numerador es (3+i)(1+i)=3+3i+i+i².',
'Sustituimos i²=−1: el numerador es 2+4i. Al dividir cada término por 2 resulta 1+2i.',
'Comprobamos multiplicando por el divisor original: (1+2i)(1−i)=1−i+2i−2i²=3+i. Así recuperamos el numerador.'
], '(3+i)/(1−i)=1+2i.', 'Hay que multiplicar por el conjugado tanto arriba como abajo.');
p('Las raíces cúbicas de ocho','complex-numbers','Encuentra todas las soluciones complejas de z³=8 y comprueba que no falta ninguna.',[
'El módulo de z³ es |z|³. Por tanto |z|³=8 y |z|=2. Escribimos z=2(cos θ+i sen θ).',
'Al elevar al cubo, el ángulo se triplica. Para obtener el número real positivo 8 necesitamos 3θ=2πk, con k entero.',
'Así θ=2πk/3. Los valores k=0,1,2 dan tres direcciones distintas; k=3 repite la primera, de modo que todos los demás solo repiten estas.',
'Para k=0 obtenemos 2. Para k=1, cos(2π/3)=−1/2 y sen(2π/3)=√3/2, dando −1+i√3. Para k=2 resulta −1−i√3.',
'Cada candidato tiene módulo 2 y al triplicar su ángulo da una vuelta entera. Su cubo es 8; la ecuación de grado tres ya tiene tres raíces distintas.'
], 'Raíces 2, −1+i√3 y −1−i√3.', 'La raíz cúbica real es solo una de las raíces complejas.');
p('Una rotación en el plano complejo','complex-numbers','Interpreta la transformación z↦iz y aplícala al punto 3−2i cuatro veces.',[
'Si z=x+yi, entonces iz=xi+yi²=−y+xi. En coordenadas, la transformación es (x,y)↦(−y,x).',
'Este cambio conserva x²+y², por lo que mantiene la distancia al origen. Además envía (1,0) a (0,1): es una rotación de 90° en sentido antihorario.',
'Partiendo de 3−2i, obtenemos primero 2+3i; después −3+2i; después −2−3i; por último 3−2i.',
'La cuarta aplicación regresa al origen de la secuencia porque i⁴=(i²)²=(−1)²=1. Los cuatro puntos tienen módulo √13.'
], 'Rotación antihoraria de 90°; órbita 3−2i → 2+3i → −3+2i → −2−3i → 3−2i.', 'Multiplicar por i gira en torno al origen, no en torno al punto inicial.');
p('Un círculo definido por módulos','complex-numbers','Describe geométricamente los complejos z que cumplen |z−(2−i)|=3 y halla sus intersecciones con el eje real.',[
'Escribimos z=x+yi. Entonces z−(2−i)=(x−2)+(y+1)i. Su módulo es la distancia entre el punto (x,y) y el punto fijo (2,−1).',
'La condición impone distancia 3, de modo que es una circunferencia de centro (2,−1) y radio 3. En coordenadas: (x−2)²+(y+1)²=9.',
'En el eje real la parte imaginaria es cero: y=0. Sustituimos y obtenemos (x−2)²+1=9, luego (x−2)²=8.',
'Por tanto x−2=±√8=±2√2. Las intersecciones son los números reales 2−2√2 y 2+2√2. Ambos distan 3 del centro al incluir la separación vertical de 1.'
], 'Circunferencia de centro 2−i y radio 3; cortes reales 2±2√2.', 'El centro tiene parte imaginaria −1, porque dentro del módulo se resta 2−i.');
group('sequences-limits');
p('Una suma de potencias de dos','geometric-series','Calcula 1+2+4+…+2¹⁰ sin sumar los once términos uno a uno.',[
'Llamamos S a la suma. Cada término se obtiene multiplicando el anterior por 2: es una progresión geométrica finita.',
'Multiplicamos toda la suma por 2: 2S=2+4+8+…+2¹¹. Ambas expresiones tienen en común los términos desde 2 hasta 2¹⁰.',
'Restamos S de 2S. Todos los términos comunes se cancelan y queda S=2¹¹−1.',
'Como 2¹⁰=1024, 2¹¹=2048. La suma vale 2047. La cuenta incluye once términos, ya que los exponentes van de 0 a 10, ambos incluidos.'
], 'La suma es 2047.', 'El último exponente no coincide con el número de términos cuando se empieza en cero.');
p('Un límite por grados','asymptotic-limits','Calcula el límite de (3n²−n+4)/(2n²+5) cuando n tiende a infinito.',[
'Numerador y denominador crecen sin cota, así que no podemos sustituir infinito como si fuera un número. Dividimos ambos por la mayor potencia presente, n².',
'La fracción queda (3−1/n+4/n²)/(2+5/n²). Esta igualdad vale para todo entero positivo n.',
'Cuando n crece, 1/n y 1/n² tienden a cero. Por tanto el numerador transformado tiende a 3 y el denominador a 2.',
'Como el límite del denominador es distinto de cero, podemos tomar el cociente de los límites: 3/2. Los términos de menor grado no alteran ese valor.'
], 'El límite es 3/2.', 'El símbolo ∞/∞ señala una indeterminación, no un resultado.');
p('Una sucesión alternante que se estrecha','squeeze-oscillation','Demuestra que aₙ=(−1)ⁿ/(n+1) converge y encuentra su límite.',[
'El factor (−1)ⁿ alterna entre 1 y −1, así que el signo cambia. Pero el tamaño es |aₙ|=1/(n+1), que disminuye hacia cero.',
'Tenemos −1/(n+1)≤aₙ≤1/(n+1). Los extremos tienden a cero, y el teorema del encaje obliga a que aₙ tenga el mismo límite.',
'Podemos cuantificarlo: dado ε>0, basta elegir un entero N mayor que 1/ε. Para n≥N, 1/(n+1)<ε.',
'Así |aₙ−0|<ε a partir de ese índice. Esto prueba convergencia aunque los términos no sean monótonos: sus oscilaciones se hacen arbitrariamente pequeñas.'
], 'La sucesión converge a 0.', 'Cambiar de signo no impide converger si la amplitud de la oscilación tiende a cero.');
p('Un ahorro con aportaciones regulares','recurrent-sequences','Una cuenta empieza con 100 euros. Cada mes se multiplica el saldo por 1,01 y después se ingresan 20 euros. Obtén el saldo tras n meses.',[
'Si aₙ es el saldo después de n meses, el orden indicado da aₙ₊₁=1,01aₙ+20 y a₀=100. El ingreso del mes no recibe intereses hasta el mes siguiente.',
'Buscamos una constante c que elimine el término independiente. Si bₙ=aₙ+2000, entonces bₙ₊₁=1,01aₙ+2020=1,01(aₙ+2000)=1,01bₙ.',
'La nueva sucesión es geométrica: bₙ=b₀·1,01ⁿ. Como b₀=100+2000=2100, obtenemos bₙ=2100·1,01ⁿ.',
'Restamos 2000: aₙ=2100·1,01ⁿ−2000. Para n=0 produce 100 y para n=1 produce 121, igual que 100·1,01+20. La fórmula describe saldos teóricos antes de redondeos bancarios.'
], 'aₙ=2100·1,01ⁿ−2000 euros, sin redondeos intermedios.', 'Cambiar el orden de ingreso e interés cambia la recurrencia.');
p('Una cola de serie telescópica','telescoping-series','Calcula la suma desde n=1 hasta infinito de 1/((n+1)(n+2)) y el error tras N términos.',[
'Separamos cada término: 1/((n+1)(n+2))=1/(n+1)−1/(n+2). Al reunir estas fracciones el numerador es (n+2)−(n+1)=1.',
'La suma parcial es Sₙ=(1/2−1/3)+(1/3−1/4)+…+(1/(N+1)−1/(N+2)). Los términos interiores se cancelan.',
'Queda Sₙ=1/2−1/(N+2). Cuando N crece, el último término tiende a cero, por lo que la suma infinita es 1/2.',
'El error es la suma total menos la parcial: 1/2−Sₙ=1/(N+2). Es positivo porque todos los términos omitidos son positivos.'
], 'Suma 1/2; error después de N términos: 1/(N+2).', 'Una suma infinita se define mediante el límite de sumas parciales.');
p('Racionalizar cerca de cero','asymptotic-limits','Calcula el límite de (√(1+x)−1)/x cuando x tiende a cero.',[
'La expresión está definida cerca de cero para x≥−1, salvo en x=0. Sustituir cero da 0/0, por lo que necesitamos transformar la expresión.',
'Multiplicamos numerador y denominador por √(1+x)+1. Usamos la identidad (a−b)(a+b)=a²−b².',
'El numerador queda (1+x)−1=x. Para x≠0 se cancela con el factor x del denominador y resulta 1/(√(1+x)+1).',
'Esta nueva expresión sí es continua en cero y su denominador allí vale 2. Su límite es 1/2. Cancelar para x≠0 es suficiente porque el límite estudia valores próximos, no el valor en el punto.'
], 'El límite es 1/2.', 'La cancelación no define la fracción original en x=0, aunque sí permite calcular su límite.');
p('Tapar un agujero en una función','continuity-differentiability','Sea f(x)=(x²−9)/(x−3) para x≠3 y f(3)=k. Determina k para que sea continua en 3.',[
'Continuidad en 3 significa que el límite al acercarnos a 3 coincide con el valor asignado f(3). Primero calculamos el límite sin usar k.',
'El numerador es una diferencia de cuadrados: x²−9=(x−3)(x+3). Para x≠3 podemos cancelar x−3 y queda f(x)=x+3.',
'Cuando x tiende a 3, x+3 tiende a 6. Por ello necesitamos f(3)=k=6 para que límite y valor coincidan.',
'Con esa elección la función es x+3 para todo x, incluido 3. Cualquier otro k dejaría el mismo límite 6 pero un valor diferente, impidiendo continuidad.'
], 'k=6.', 'La definición separada de f(3) no modifica el límite de los valores vecinos.');
p('Una raíz garantizada sin resolverla','bolzano-theorem','Demuestra que x³+x−1=0 tiene exactamente una raíz en (0,1).',[
'La función f(x)=x³+x−1 es un polinomio y, por tanto, continua en [0,1]. En los extremos f(0)=−1 y f(1)=1.',
'Al tener signos opuestos, el teorema de Bolzano garantiza al menos un punto c entre 0 y 1 con f(c)=0. La continuidad es la hipótesis que impide saltarse el cero.',
'Para la unicidad tomamos b>a. La diferencia f(b)−f(a)=(b−a)(b²+ab+a²+1). El primer factor es positivo.',
'El segundo también es positivo porque b²+ab+a²=(b+a/2)²+3a²/4≥0. Así f(b)>f(a): la función es estrictamente creciente y no puede tomar cero dos veces.'
], 'Existe exactamente una raíz en (0,1).', 'Bolzano garantiza existencia; la unicidad requiere un argumento adicional.');
p('Comparar una serie sin sumarla','positive-series-tests','Decide si la serie desde n=1 hasta infinito de 1/(n²+n+1) converge.',[
'Los términos son positivos. Como n²+n+1≥n² para n≥1, al invertir se obtiene 0<1/(n²+n+1)≤1/n².',
'La serie de 1/n² converge. Podemos justificarlo sin conocer su suma: para n≥2, 1/n²≤1/(n(n−1))=1/(n−1)−1/n.',
'La suma de estas cotas desde 2 hasta N se telescopa y vale 1−1/N<1. Añadiendo el término n=1, las sumas de 1/n² están acotadas por 2.',
'Las sumas parciales de la serie pedida son crecientes por positividad y están acotadas por las de 1/n². Toda sucesión creciente acotada tiene límite; por ello la serie converge.'
], 'La serie converge por comparación con una serie convergente.', 'Que los términos tiendan a cero es necesario, pero no basta para garantizar convergencia.');
p('Una iteración contractiva elemental','banach-fixed-point','Con x₀=0 y xₙ₊₁=(xₙ+6)/4, encuentra el límite y un índice que asegure error menor que 0,001.',[
'Si la sucesión tiene límite L, la recurrencia exige L=(L+6)/4. Resolver 4L=L+6 da L=2. Todavía debemos demostrar que realmente se aproxima a él.',
'Restamos 2 a ambos lados: xₙ₊₁−2=(xₙ−2)/4. Cada paso reduce el error por un factor 4.',
'Como x₀−2=−2, se deduce xₙ−2=−2/4ⁿ. Por tanto xₙ=2−2/4ⁿ y el error absoluto es 2/4ⁿ, que tiende a cero.',
'Queremos 2/4ⁿ<0,001, o 4ⁿ>2000. Como 4⁵=1024 y 4⁶=4096, n=6 basta; el error es 2/4096≈0,000488.'
], 'Límite 2; desde n=6 el error es menor que 0,001.', 'Encontrar un posible punto fijo no demuestra por sí solo convergencia.');
group('differential-calculus');
p('Una derivada desde su definición','derivative-foundations','Calcula la derivada de f(x)=x²+3x usando el cociente incremental, sin aplicar una tabla de derivadas.',[
'La derivada mide el límite de la pendiente entre dos puntos próximos. En x se define como el límite de (f(x+h)−f(x))/h cuando h tiende a cero y h≠0.',
'Desarrollamos f(x+h)=(x+h)²+3(x+h)=x²+2xh+h²+3x+3h. Al restar f(x)=x²+3x quedan 2xh+h²+3h.',
'Dividimos por h, que todavía es distinto de cero: el cociente es 2x+h+3. Esta simplificación evita sustituir en una expresión 0/0.',
'Al hacer h→0 obtenemos f′(x)=2x+3. Por ejemplo, en x=1 la pendiente es 5, y el cociente incremental es 5+h, que efectivamente se aproxima a 5.'
], 'f′(x)=2x+3 para todo x real.', 'No se sustituye h=0 antes de simplificar el cociente.');
p('La tangente a una raíz','linear-approximation','Encuentra la recta tangente a f(x)=√x en x=4 y úsala para aproximar √4,1.',[
'La recta tangente pasa por (4,f(4))=(4,2). Su pendiente es la derivada f′(x)=1/(2√x), que en x=4 vale 1/4.',
'La ecuación de una recta de pendiente m que pasa por (a,b) es y=b+m(x−a). Aquí resulta y=2+(x−4)/4.',
'Para x=4,1, el incremento es 0,1. La aproximación lineal da √4,1≈2+0,1/4=2,025.',
'Para x>0 la segunda derivada es −1/(4x^(3/2)), negativa. La gráfica se curva hacia abajo y queda bajo su tangente: la aproximación es una sobreestimación. No es una igualdad exacta.'
], 'Tangente y=2+(x−4)/4; √4,1≈2,025 por exceso.', 'La aproximación lineal pierde precisión al alejarnos del punto de tangencia.');
p('Una derivada por la regla de la cadena','derivative-foundations','Deriva g(x)=(3x²+1)⁴ y calcula g′(1).',[
'La expresión es una composición: primero u(x)=3x²+1 y después se eleva u a la cuarta potencia. La regla de la cadena multiplica las tasas de cambio de ambas operaciones.',
'La derivada de u⁴ respecto de u es 4u³. La derivada de u respecto de x es u′(x)=6x.',
'Multiplicamos y sustituimos u: g′(x)=4(3x²+1)³·6x=24x(3x²+1)³.',
'En x=1, la expresión interior vale 3+1=4. Por tanto g′(1)=24·4³=24·64=1536. El factor 6x recoge cuánto cambia la expresión interior.'
], 'g′(x)=24x(3x²+1)³ y g′(1)=1536.', 'Derivar solo la potencia exterior omite el factor de la función interior.');
p('Un mínimo con dominio abierto','derivative-optimization','Encuentra el mínimo global de f(x)=x+9/x para x>0.',[
'El dominio x>0 es esencial: el término 9/x está definido y es positivo. Derivamos término a término: f′(x)=1−9/x².',
'Los puntos críticos satisfacen 1−9/x²=0, es decir x²=9. En el dominio positivo solo queda x=3.',
'Si 0<x<3, x²<9 y f′(x)<0; si x>3, f′(x)>0. Así la función decrece hasta 3 y crece después: es un mínimo global.',
'Evaluamos f(3)=3+9/3=6. También podemos comprobarlo con f(x)−6=(x²−6x+9)/x=(x−3)²/x≥0, con igualdad únicamente en 3.'
], 'Mínimo global 6 en x=3.', 'Un punto crítico fuera del dominio no es candidato.');
p('Velocidad y cambio de sentido','derivative-foundations','La posición de una partícula es s(t)=t³−6t²+9t metros para 0≤t≤4 segundos. Determina cuándo cambia de sentido.',[
'La velocidad es la derivada de la posición: v(t)=3t²−12t+9=3(t−1)(t−3). Su signo indica el sentido del movimiento.',
'Los instantes de reposo son t=1 y t=3. Para 0<t<1, ambos factores son negativos y v>0; la partícula avanza en sentido positivo.',
'Para 1<t<3, t−1>0 y t−3<0, de modo que v<0. Para 3<t<4 ambos son positivos, así que v>0 otra vez.',
'La velocidad cambia de signo en los dos instantes: de positivo a negativo en 1 y de negativo a positivo en 3. Por eso ambos son cambios de sentido, no simples paradas sin inversión.'
], 'Cambia de sentido en t=1 s y t=3 s.', 'Que la velocidad sea cero no garantiza por sí solo un cambio de sentido.');
p('Un punto del teorema del valor medio','mean-value-theorems','Aplica el teorema del valor medio a f(x)=x² en [1,3] y encuentra el punto que garantiza.',[
'El teorema exige continuidad en el intervalo cerrado y derivabilidad en el abierto. Un polinomio cumple ambas hipótesis, así que puede aplicarse.',
'La pendiente media entre los extremos es (f(3)−f(1))/(3−1)=(9−1)/2=4.',
'El teorema afirma que existe c en (1,3) con f′(c)=4. Como f′(x)=2x, resolvemos 2c=4 y obtenemos c=2.',
'El valor 2 está dentro del intervalo abierto. La tangente allí tiene pendiente 4, igual a la secante entre (1,1) y (3,9). Esta es la interpretación geométrica de la igualdad.'
], 'El punto garantizado es c=2.', 'Las hipótesis se comprueban antes de resolver la ecuación de pendientes.');
p('Un paso de Newton para una raíz cúbica','newton-raphson','Usa dos pasos de Newton desde x₀=2 para aproximar la solución positiva de x³=10.',[
'Reescribimos la ecuación como f(x)=x³−10=0. Newton sustituye la curva por su tangente y usa el corte de esa recta con el eje: xₙ₊₁=xₙ−f(xₙ)/f′(xₙ).',
'Como f′(x)=3x², la fórmula es xₙ₊₁=xₙ−(xₙ³−10)/(3xₙ²). En x₀=2, f(2)=−2 y f′(2)=12.',
'El primer paso da x₁=2−(−2)/12=13/6. Para el segundo, x₁³−10=2197/216−2160/216=37/216 y 3x₁²=169/12.',
'Por tanto x₂=13/6−(37/216)/(169/12)=13/6−37/3042=3277/1521≈2,15450. Son aproximaciones; no hemos obtenido una expresión exacta de la raíz.'
], 'x₁=13/6 y x₂=3277/1521≈2,15450.', 'En cada paso hay que reevaluar tanto la función como la derivada en el nuevo punto.');
p('Un crecimiento exponencial con dato inicial','first-order-odes','Una población idealizada satisface P′(t)=0,2P(t) y P(0)=500. Halla P(t) y el tiempo de duplicación.',[
'La ecuación dice que la tasa de crecimiento es proporcional a la población presente. La función exponencial P(t)=Ce^(0,2t) cumple esta relación porque su derivada es 0,2Ce^(0,2t).',
'La condición inicial fija C: en t=0, e⁰=1 y P(0)=C=500. Así P(t)=500e^(0,2t).',
'Para duplicar pedimos P(t)=1000. Al dividir por 500 queda e^(0,2t)=2. El logaritmo natural deshace la exponencial: 0,2t=ln 2.',
'Despejamos t=ln 2/0,2=5 ln 2≈3,466 unidades de tiempo. El resultado supone que la tasa proporcional permanece constante durante todo el proceso.'
], 'P(t)=500e^(0,2t); duplicación en 5 ln 2≈3,466 unidades.', 'Una tasa proporcional constante produce crecimiento exponencial, no un aumento absoluto constante.');
p('Una aproximación cuadrática con cota','taylor-series','Aproxima e^0,1 con su Taylor de grado dos en cero y acota el error usando e^0,1<1,11.',[
'Las derivadas de eˣ son todas eˣ y en cero valen 1. El polinomio de Taylor de grado dos es 1+x+x²/2.',
'Sustituimos x=0,1: 1+0,1+0,01/2=1,105. Esto es una aproximación, porque hemos omitido términos de grado tres en adelante.',
'El resto de Taylor es e^ξ·x³/6 para algún ξ entre 0 y x. Como la exponencial crece, 1≤e^ξ<1,11 en ese intervalo.',
'Así 0<e^0,1−1,105<1,11·0,001/6=0,000185. La aproximación queda por debajo del valor exacto y el error es menor que esa cota.'
], 'e^0,1≈1,105 con error positivo menor que 0,000185.', 'El primer término omitido orienta el error, pero una cota rigurosa requiere controlar la derivada del resto.');
p('Una función con esquina','continuity-differentiability','Estudia la continuidad y derivabilidad en cero de f(x)=|x|.',[
'El valor absoluto cumple |x|=x si x≥0 y |x|=−x si x<0. Ambas expresiones se aproximan a 0 cuando x tiende a 0; además f(0)=0.',
'Por tanto el límite coincide con el valor y la función es continua en cero. Para la derivada debemos estudiar (f(h)−f(0))/h=|h|/h.',
'Si h>0, el cociente vale h/h=1. Si h<0, vale −h/h=−1. Las pendientes laterales son distintas.',
'Un límite bilateral solo existe si los dos laterales coinciden. Por eso f no es derivable en cero, aunque no tenga salto ni agujero allí.'
], 'Continua en cero, pero no derivable: derivadas laterales −1 y 1.', 'La continuidad es necesaria para derivar, pero no suficiente.');
group('integral-calculus');
p('Una primitiva con condición inicial','derivative-foundations','Encuentra F si F′(x)=6x²−4x+1 y F(0)=7.',[
'Una primitiva es una función cuya derivada coincide con la dada. Para una potencia xⁿ con n≠−1, una primitiva es x^(n+1)/(n+1), como se comprueba derivando.',
'Integramos cada término: 6x² produce 2x³, −4x produce −2x² y 1 produce x. Añadimos una constante C porque su derivada es cero.',
'La familia es F(x)=2x³−2x²+x+C. Aplicamos F(0)=7: todos los términos con x se anulan y queda C=7.',
'Verificamos derivando: F′(x)=6x²−4x+1. Además F(0)=7, de modo que cumple tanto la ecuación como el dato inicial.'
], 'F(x)=2x³−2x²+x+7.', 'La constante de integración solo queda fijada después de usar el dato adicional.');
p('Una integral como área firmada','areas-revolution','Calcula la integral de x−1 entre 0 y 3 y compárala con el área geométrica entre la recta y el eje horizontal.',[
'La recta y=x−1 corta el eje en x=1. Está por debajo para 0≤x<1 y por encima para 1<x≤3. La integral cuenta con signo esas dos regiones.',
'Una primitiva es x²/2−x. Evaluamos en los extremos: (9/2−3)−0=3/2.',
'El área inferior es un triángulo de base 1 y altura 1, por tanto 1/2. El área superior tiene base 2 y altura 2: su área es 2.',
'La integral es 2−1/2=3/2, mientras que el área geométrica suma ambas magnitudes: 2+1/2=5/2. Esta cuenta independiente comprueba el signo de cada contribución.'
], 'Integral 3/2; área geométrica 5/2.', 'La integral de una función que cambia de signo no es automáticamente el área total.');
p('Un cambio de variable con extremos','derivative-foundations','Calcula la integral de 2x(x²+1)³ entre x=0 y x=1.',[
'La expresión interior x²+1 tiene derivada 2x, presente como factor. Elegimos u=x²+1 y entonces du=2x dx.',
'También cambiamos los extremos: cuando x=0, u=1; cuando x=1, u=2. La integral se transforma en la de u³ desde 1 hasta 2.',
'Una primitiva de u³ es u⁴/4. Evaluamos: (2⁴−1⁴)/4=(16−1)/4=15/4.',
'Para comprobar el cambio podemos derivar (x²+1)⁴/4: la regla de la cadena produce (x²+1)³·2x, exactamente el integrando original.'
], 'La integral vale 15/4.', 'Los extremos originales pertenecen a x; no se usan sin convertirlos en una integral respecto de u.');
p('Una integración por partes completa','derivative-foundations','Calcula la integral de x eˣ entre 0 y 1 justificando la fórmula usada.',[
'La regla del producto dice (uv)′=u′v+uv′. Al integrar y despejar obtenemos la fórmula por partes: integral de u v′ = uv menos integral de u′v.',
'Elegimos u=x y v′=eˣ. Entonces u′=1 y podemos tomar v=eˣ, porque su derivada vuelve a ser eˣ.',
'Una primitiva de xeˣ es xeˣ−eˣ=(x−1)eˣ. Evaluamos en 1: (1−1)e=0; en 0: (0−1)·1=−1.',
'La integral definida es valor superior menos inferior: 0−(−1)=1. Al derivar (x−1)eˣ obtenemos eˣ+(x−1)eˣ=xeˣ, confirmando la primitiva.'
], 'La integral vale 1.', 'La evaluación del extremo inferior se resta entera, incluido su signo negativo.');
p('Una integral impropia que sí converge','positive-series-tests','Calcula la integral de 1/x² desde 1 hasta infinito y la cola desde R hasta infinito, con R≥1.',[
'El extremo infinito exige una definición por límite. Primero integramos hasta un número finito B>1 y después hacemos B→∞.',
'Una primitiva de x⁻² es −1/x. Por tanto la integral de 1 a B es −1/B−(−1)=1−1/B.',
'Como 1/B tiende a cero, el límite existe y vale 1. Esto significa que el área total es finita aunque el intervalo no esté acotado.',
'Desde R hasta B, la integral es 1/R−1/B. Al tomar B→∞ queda 1/R. Esa es también la cantidad que se omite al truncar la integral en R.'
], 'Integral total 1; cola desde R igual a 1/R.', 'No se trata infinito como un extremo numérico: se toma un límite de integrales finitas.');
p('Un sólido al girar una recta','areas-revolution','Gira la región bajo y=x, entre x=0 y x=2, alrededor del eje horizontal y calcula su volumen.',[
'Una sección perpendicular al eje en la posición x es un disco de radio y=x. El área del disco es πx².',
'El volumen se obtiene sumando las áreas de las secciones por su espesor: V es la integral de πx² entre 0 y 2.',
'Una primitiva es πx³/3. Evaluamos: V=π·2³/3−0=8π/3.',
'La figura es también un cono de altura 2 y radio de base 2. Su volumen πr²h/3=π·4·2/3 coincide con la integral, lo que proporciona una comprobación geométrica.'
], 'Volumen 8π/3 unidades cúbicas.', 'El área de cada sección usa el radio al cuadrado; integrar solo πx daría otra magnitud.');
p('La longitud exacta de una recta','arc-length','Calcula mediante una integral la longitud de y=3x+1 entre x=0 y x=2 y compárala con la distancia entre extremos.',[
'Para una gráfica derivable, un pequeño desplazamiento horizontal dx produce un desplazamiento vertical aproximadamente y′ dx. Pitágoras lleva al factor √(1+(y′)²).',
'Aquí y′=3 es constante. La longitud es la integral de √(1+9)=√10 desde 0 hasta 2.',
'Como el integrando es constante, la integral vale 2√10. El término independiente 1 cambia la altura de la recta pero no su longitud entre esos valores de x.',
'Los extremos son (0,1) y (2,7). Su diferencia es (2,6), cuya norma es √(2²+6²)=√40=2√10, igual a la integral.'
], 'Longitud 2√10.', 'Integrar y da área firmada, no longitud de arco.');
p('Un valor medio que no es el punto medio','mean-value-theorems','Calcula el valor medio de f(x)=x² en [0,3] y encuentra c con f(c) igual a ese promedio.',[
'El valor medio de una función continua en [a,b] es su integral dividida por la longitud b−a. Representa la altura constante que produce la misma área.',
'Integramos x² de 0 a 3: [x³/3] da 27/3=9. La longitud del intervalo es 3, así que el promedio es 9/3=3.',
'Buscamos c en [0,3] con c²=3. Las soluciones algebraicas son ±√3, pero solo la positiva pertenece al intervalo.',
'Así c=√3. El punto medio del intervalo es 1,5 y su valor f(1,5)=2,25 no coincide con el promedio; una función no lineal no tiene por qué promediarse en el centro.'
], 'Valor medio 3; se alcanza en c=√3.', 'El promedio de valores de una función no es, en general, su valor en el promedio de los extremos.');
p('Trapecios para una función convexa','convexity-tangents','Aproxima la integral de x² entre 0 y 2 con dos trapecios de igual anchura y compara con el valor exacto.',[
'Dividimos [0,2] en [0,1] y [1,2], ambos de anchura h=1. Los valores de la función en los nodos son f(0)=0, f(1)=1 y f(2)=4.',
'El área de un trapecio de anchura h y alturas a,b es h(a+b)/2. El primero aporta (0+1)/2=1/2; el segundo, (1+4)/2=5/2.',
'La aproximación total es 1/2+5/2=3. La integral exacta es [x³/3] entre 0 y 2, igual a 8/3.',
'La diferencia es 3−8/3=1/3. Como x² es convexa, cada segmento entre nodos queda por encima de la curva; eso explica que los trapecios sobreestimen el área.'
], 'Aproximación 3; valor exacto 8/3; exceso 1/3.', 'La forma de la curva determina el sentido del error; no todos los trapecios sobreestiman.');
p('Un paso de Euler y su error','ode-numerical-integration','Para y′=y, y(0)=1, aplica Euler con paso 0,5 hasta t=1 y compara con y(1)=e.',[
'Euler aproxima la solución durante cada paso por una recta con la pendiente al comienzo. La regla es yₙ₊₁=yₙ+h f(tₙ,yₙ). Aquí f(t,y)=y y h=0,5.',
'Partimos de (t₀,y₀)=(0,1). El primer paso da y₁=1+0,5·1=1,5, correspondiente a t₁=0,5.',
'El segundo usa la nueva pendiente y₁: y₂=1,5+0,5·1,5=2,25, en t₂=1. No usamos de nuevo la pendiente inicial.',
'La solución exacta es eᵗ, por lo que y(1)=e≈2,71828. El error absoluto es e−2,25≈0,46828. La aproximación queda por debajo porque la pendiente real aumenta dentro de cada paso.'
], 'Euler da y(1)≈2,25; error absoluto aproximado 0,46828.', 'Cada paso se construye con el valor aproximado recién calculado.');
group('probability');
p('Dos extracciones con reposición','finite-probability','Una urna contiene 3 bolas rojas y 2 azules. Se extraen dos bolas, devolviendo la primera antes de extraer la segunda. Calcula la probabilidad de obtener colores distintos.',[
'Al devolver la bola, la urna recupera su composición. Cada extracción tiene probabilidad 3/5 de roja y 2/5 de azul; suponiendo mezcla aleatoria, las extracciones son independientes.',
'Los colores distintos pueden aparecer en dos órdenes: roja y después azul, o azul y después roja. Estos casos no pueden ocurrir simultáneamente.',
'Por independencia, la probabilidad de roja-azul es (3/5)(2/5)=6/25. La de azul-roja es (2/5)(3/5)=6/25.',
'Sumamos los casos disjuntos: 12/25. Comprobamos con el complemento: mismo color tiene probabilidad 9/25+4/25=13/25, que junto con 12/25 suma uno.'
], 'Probabilidad 12/25=0,48.', 'Sin reposición cambiarían las probabilidades de la segunda extracción.');
p('Un falso positivo en una población','bayes-theorem','Una condición aparece en el 2% de una población. Una prueba detecta el 90% de los casos y da positivo en el 5% de quienes no la tienen. Calcula la probabilidad de tener la condición dado un positivo.',[
'Usamos una población hipotética de 10000 personas para convertir proporciones en frecuencias. Hay 200 con la condición y 9800 sin ella.',
'Entre las 200 con la condición, el 90% da positivo: 180. Entre las 9800 restantes, el 5% también da positivo: 490.',
'En total hay 180+490=670 positivos. Al condicionar a positivo, ese es el nuevo grupo de referencia; solo 180 tienen la condición.',
'La probabilidad buscada es 180/670=18/67≈0,2687. La prueba detecta muchos casos, pero la condición poco frecuente permite que los falsos positivos sean numerosos.'
], '18/67≈26,87%, bajo las proporciones del modelo.', 'La sensibilidad del 90% no es la probabilidad de tener la condición después de un positivo.');
p('Al menos un seis en tres tiradas','bernoulli-binomial','Se lanza un dado equilibrado tres veces de forma independiente. Calcula la probabilidad de obtener al menos un seis.',[
'Al menos un seis incluye uno, dos o tres seises. Es más sencillo calcular el caso contrario: que no aparezca ningún seis.',
'En una tirada hay cinco resultados distintos de seis entre seis equiprobables. La probabilidad de no obtener seis es 5/6.',
'Por independencia, no obtener seis en las tres tiradas tiene probabilidad (5/6)³=125/216.',
'Un suceso y su contrario suman probabilidad uno. Restamos: 1−125/216=91/216≈0,4213. Esto cuenta todos los casos deseados sin duplicaciones.'
], '91/216≈42,13%.', 'Sumar tres veces 1/6 cuenta varias veces los resultados con más de un seis.');
p('Exactamente dos aciertos en cuatro intentos','bernoulli-binomial','Cada intento independiente tiene probabilidad 1/3 de éxito. ¿Cuál es la probabilidad de exactamente dos éxitos en cuatro intentos?',[
'Un patrón concreto con dos éxitos y dos fallos, por ejemplo E-E-F-F, tiene probabilidad (1/3)²(2/3)²=4/81.',
'Debemos contar las posiciones de los éxitos. Elegir dos lugares entre cuatro puede hacerse de 4·3/2=6 maneras; dividimos por dos porque elegir primero un lugar u otro no cambia el par.',
'Los seis patrones son disjuntos y tienen la misma probabilidad. Sumamos sus probabilidades multiplicando: 6·4/81=24/81.',
'Simplificamos por 3: 8/27≈0,2963. El factor seis es imprescindible porque el enunciado no fija el orden de los éxitos.'
], '8/27≈29,63%.', 'La probabilidad de un orden concreto no es la de todos los órdenes con dos éxitos.');
p('Un lote con dos piezas defectuosas','hypergeometric-distribution','Un lote de 8 piezas contiene 2 defectuosas. Se eligen 3 sin reposición, uniformemente entre todos los subconjuntos. Calcula la probabilidad de exactamente una defectuosa.',[
'Como no importa el orden, contamos subconjuntos. El total de elecciones es C(8,3)=8·7·6/(3·2·1)=56.',
'Para tener exactamente una defectuosa elegimos una de las dos defectuosas: C(2,1)=2 opciones. Las otras dos piezas deben salir de las seis buenas.',
'Elegir dos buenas tiene C(6,2)=6·5/2=15 posibilidades. Cada elección de defectuosa se combina con cada par bueno: 2·15=30 casos favorables.',
'La probabilidad es 30/56=15/28≈0,5357. La cuenta no supone independencia: la ausencia de reposición se incorpora al elegir subconjuntos del lote.'
], '15/28≈53,57%.', 'Usar probabilidades constantes en tres ensayos independientes modelaría una extracción con reposición.');
p('Esperar hasta una primera cara','geometric-distribution','Se lanza una moneda equilibrada e independiente hasta la primera cara. Calcula la probabilidad de necesitar exactamente cuatro lanzamientos y la de necesitar más de cuatro.',[
'Necesitar exactamente cuatro significa obtener cruz en los tres primeros y cara en el cuarto. No hay otros órdenes posibles porque una cara anterior habría detenido el proceso.',
'Cada resultado tiene probabilidad 1/2 y los lanzamientos son independientes. Así P(N=4)=(1/2)³·(1/2)=1/16.',
'Necesitar más de cuatro significa que los cuatro primeros fueron cruces. No impone qué ocurre en el quinto ni después; su probabilidad es también (1/2)⁴=1/16.',
'La igualdad numérica es propia de esta moneda: en general, con probabilidad de cara p, los valores serían (1−p)³p y (1−p)⁴, respectivamente.'
], 'P(N=4)=1/16 y P(N>4)=1/16.', 'Más de cuatro no incluye el caso de detenerse exactamente en el cuarto.');
p('El premio esperado de una rifa','discrete-expectation','Una rifa tiene 100 boletos equiprobables: uno paga 50 euros, cuatro pagan 10 euros y los demás cero. Un boleto cuesta 2 euros. Calcula la ganancia neta esperada.',[
'El valor esperado es el promedio ponderado por las probabilidades. El pago bruto toma 50 con probabilidad 1/100, 10 con probabilidad 4/100 y 0 con probabilidad 95/100.',
'El pago esperado es 50·1/100+10·4/100+0·95/100=(50+40)/100=0,90 euros.',
'El coste de 2 euros se paga siempre. La ganancia neta esperada es pago esperado menos coste: 0,90−2=−1,10 euros.',
'También se puede usar directamente la ganancia neta: 48 para el premio mayor, 8 para los cuatro pequeños y −2 en los demás; (48+32−190)/100=−1,10. Coinciden ambos métodos.'
], 'Ganancia neta esperada −1,10 euros por boleto.', 'Una esperanza negativa es un promedio teórico, no el resultado concreto de cada compra.');
p('Una densidad triangular y su media','continuous-random-variables','Sea f(x)=2x en [0,1] y cero fuera. Comprueba que es una densidad, calcula P(X≤1/2) y la media.',[
'Una densidad debe ser no negativa y tener integral total uno. Aquí 2x≥0 en [0,1] y su integral es [x²] de 0 a 1, igual a 1.',
'La probabilidad de X≤1/2 es el área bajo la densidad desde 0 hasta 1/2: [x²] da 1/4.',
'La media de una variable continua se calcula integrando x por su densidad. Aquí E(X) es la integral de 2x² entre 0 y 1.',
'Una primitiva es 2x³/3, de modo que E(X)=2/3. El promedio supera 1/2 porque la densidad da más peso a los valores grandes del intervalo.'
], 'Es una densidad; P(X≤1/2)=1/4 y E(X)=2/3.', 'El valor f(x) no es la probabilidad de ese punto: las probabilidades son áreas.');
p('Estandarizar una medida normal','normal-distribution','Una variable normal tiene media 100 y desviación típica 15. Expresa P(85≤X≤130) mediante la normal estándar y usa Φ(2)=0,97725, Φ(−1)=0,15866.',[
'La normal estándar tiene media cero y desviación típica uno. Para pasar a ella restamos la media y dividimos por la desviación: Z=(X−100)/15.',
'El extremo inferior 85 se transforma en (85−100)/15=−1. El superior 130 se transforma en (130−100)/15=2.',
'Como dividimos por una cantidad positiva, las desigualdades mantienen su sentido. Por tanto la probabilidad es P(−1≤Z≤2)=Φ(2)−Φ(−1).',
'Con los valores facilitados resulta 0,97725−0,15866=0,81859. La normal es continua, por lo que incluir o excluir los extremos no cambia esta probabilidad.'
], 'Probabilidad aproximada 0,81859, es decir, 81,859%.', 'Se divide por la desviación típica 15, no por la varianza 225.');
p('Dos pasos de una cadena de estados','markov-chains','Un sistema está en A o B. Desde A permanece en A con probabilidad 0,8; desde B pasa a A con probabilidad 0,3. Si empieza en A, calcula la probabilidad de estar en A tras dos pasos.',[
'Completamos las transiciones: desde A se va a B con probabilidad 0,2, y desde B se permanece en B con 0,7. Cada fila de probabilidades suma uno.',
'Tras el primer paso, P(A)=0,8 y P(B)=0,2. Para terminar en A en el segundo paso hay dos caminos: A→A→A o A→B→A.',
'La propiedad de Markov dice que la transición siguiente depende del estado actual. El primer camino tiene probabilidad 0,8·0,8=0,64; el segundo, 0,2·0,3=0,06.',
'Son caminos disjuntos, por lo que sumamos: 0,64+0,06=0,70. Como comprobación, terminar en B tiene probabilidad 0,8·0,2+0,2·0,7=0,30.'
], 'Probabilidad 0,70 de estar en A tras dos pasos.', 'No basta con elevar 0,8 al cuadrado: también se puede salir de A y regresar.');
group('statistics');
p('Media y mediana ante un dato extremo','descriptive-statistics','Calcula media y mediana de 2, 3, 3, 4, 18. Repite al sustituir 18 por 48 y compara.',[
'La media es la suma dividida por el número de datos. La suma inicial es 2+3+3+4+18=30; como hay cinco datos, la media es 30/5=6.',
'Para la mediana ordenamos los datos, que ya están ordenados. Con cinco observaciones, la posición central es la tercera: la mediana es 3.',
'Al sustituir 18 por 48, la suma aumenta 30 unidades y pasa a 60. La nueva media es 60/5=12. La lista sigue ordenada y el tercer dato sigue siendo 3.',
'La media se duplica porque incorpora la magnitud de cada dato. La mediana no cambia porque depende de la posición central. Esto muestra distinta sensibilidad a un valor extremo.'
], 'Media 6→12; mediana 3→3.', 'La mediana requiere ordenar, y no se calcula promediando todos los valores.');
p('Varianza de una población pequeña','descriptive-statistics','Los cuatro valores 1, 3, 5, 7 constituyen toda una población. Calcula su varianza y desviación típica.',[
'La media poblacional es (1+3+5+7)/4=16/4=4. Las desviaciones respecto de ella son −3, −1, 1 y 3.',
'Elevamos las desviaciones al cuadrado: 9, 1, 1 y 9. Su suma es 20; los signos ya no pueden cancelarse.',
'Como los datos son toda la población, la varianza es el promedio de esos cuadrados: 20/4=5. No usamos la corrección muestral.',
'La desviación típica es la raíz positiva de la varianza: √5≈2,236. Vuelve a las mismas unidades de los datos; la varianza tiene unidades al cuadrado.'
], 'Varianza poblacional 5 y desviación típica √5.', 'El divisor n−1 corresponde a otro objetivo: estimar una varianza poblacional desde una muestra.');
p('Por qué cambia el divisor muestral','bessel-correction','Para la muestra 2, 4, 6 calcula la media, la varianza con divisor n y la varianza muestral corregida.',[
'La media es (2+4+6)/3=4. Las desviaciones son −2, 0 y 2, que suman cero porque usamos la propia media muestral.',
'La suma de cuadrados de las desviaciones es 4+0+4=8. Si solo describimos esta lista con divisor n=3 obtenemos 8/3.',
'Para estimar sin sesgo la varianza de una población a partir de una muestra aleatoria independiente, se usa n−1. Aquí el estimador corregido es s²=8/2=4.',
'La pérdida de un grado de libertad se ve en que, una vez fijadas dos desviaciones, la tercera está obligada a completar suma cero. La corrección no garantiza acertar la varianza en cada muestra.'
], 'Media 4; varianza descriptiva 8/3; varianza corregida 4.', 'Dividir por n o por n−1 responde a objetivos diferentes y debe indicarse.');
p('Cambiar las unidades de unos datos','moment-transformations','Unos datos en Celsius tienen media 20 y desviación típica 3. Al convertirlos con F=1,8C+32, calcula media, varianza y desviación en Fahrenheit.',[
'La conversión aplica la misma transformación a cada dato. La media transforma linealmente: media de F=1,8·20+32=68.',
'Para una desviación respecto de la media, F−68=1,8(C−20). La suma de 32 desaparece al restar la media; desplazar una lista no cambia su dispersión.',
'Al elevar las desviaciones al cuadrado, el factor pasa a ser 1,8². La varianza original es 3²=9, por lo que la nueva vale 1,8²·9=29,16.',
'La desviación típica es √29,16=5,4, que también se obtiene como 1,8·3. La media y desviación quedan en °F y la varianza en °F².'
], 'Media 68 °F, varianza 29,16 °F² y desviación 5,4 °F.', 'La constante 32 se suma a la media, pero no a la desviación típica.');
p('Covarianza de tres pares','covariance','Para los pares (1,2), (2,4), (3,3), calcula la covarianza usando divisor 3 y explica su signo.',[
'La media de x es (1+2+3)/3=2 y la de y es (2+4+3)/3=3. Restamos estas medias en cada coordenada.',
'Las desviaciones de x son −1, 0, 1; las de y son −1, 1, 0. Multiplicamos las desviaciones emparejadas: 1, 0 y 0.',
'La covarianza con el divisor pedido es (1+0+0)/3=1/3. Un producto positivo indica desviaciones del mismo signo y uno negativo indicaría signos opuestos.',
'El balance positivo sugiere asociación lineal positiva en esta lista, pero no una relación perfecta. Tampoco demuestra que variar x cause cambios en y.'
], 'Covarianza descriptiva 1/3, positiva.', 'Hay que respetar los pares: reordenar una variable por separado altera la covarianza.');
p('Una predicción por regresión y sus residuos','linear-regression','Para (0,1), (1,2), (2,2), encuentra la recta de mínimos cuadrados y predice el valor en x=3.',[
'Minimizamos S(a,b)=Σ(yᵢ−a−bxᵢ)², donde Σ significa sumar los tres datos. Derivar respecto de a e igualar a cero exige que los residuos sumen cero, lo que da a=ȳ−bx̄. Al sustituir, cada residuo queda (yᵢ−ȳ)−b(xᵢ−x̄). Derivar ahora respecto de b da b·Σ(xᵢ−x̄)²=Σ(xᵢ−x̄)(yᵢ−ȳ). Como la suma de cuadrados de x es positiva, esta función cuadrática tiene allí su mínimo único.',
'La recta es y=a+bx. Las medias son x̄=1 e ȳ=5/3. La pendiente de mínimos cuadrados es la suma de productos de desviaciones dividida por la suma de cuadrados de las desviaciones de x.',
'Las desviaciones de x son −1,0,1 y las de y son −2/3,1/3,1/3. La suma de productos es 2/3+0+1/3=1; la suma de cuadrados de x es 1+0+1=2.',
'Por tanto b=1/2. La recta pasa por las medias, así que a=5/3−(1/2)·1=7/6. Los residuos son −1/6,1/3,−1/6 y suman cero.',
'En x=3, la predicción es 7/6+3/2=16/6=8/3. Es una extrapolación fuera del rango observado [0,2]; la recta calcula ese valor, pero los datos no garantizan que describa el fenómeno allí.'
], 'Recta y=7/6+x/2; predicción en 3: 8/3.', 'Una predicción calculable fuera de los datos no tiene automáticamente la misma fiabilidad.');
p('El error estándar de un promedio','sampling-distributions','Se promedian 64 mediciones independientes de una población con media 10 y desviación típica 4. Calcula la media y desviación típica del promedio.',[
'Llamamos X̄=(X₁+…+X₆₄)/64. Cada medición tiene esperanza 10, así que la esperanza de la suma es 64·10 y E(X̄)=10.',
'Cada medición tiene varianza 4²=16. La independencia permite sumar varianzas: la suma tiene varianza 64·16.',
'Dividir una variable por 64 divide su varianza por 64². Por ello Var(X̄)=64·16/64²=16/64=1/4.',
'La desviación típica del promedio, llamada error estándar, es √(1/4)=1/2. La media del promedio no cambia, pero su dispersión es menor que la de una observación individual.'
], 'Media 10; varianza 1/4; error estándar 0,5.', 'La independencia es necesaria para sumar varianzas sin términos de covarianza.');
p('Una muestra proporcional por estratos','stratified-sampling','Una población tiene tres grupos de 600, 300 y 100 personas. Distribuye una muestra de tamaño 80 proporcionalmente y explica cómo seleccionarla.',[
'El total poblacional es 600+300+100=1000. Los pesos de los grupos son 0,6, 0,3 y 0,1, respectivamente.',
'La asignación proporcional multiplica el tamaño muestral por cada peso: 80·0,6=48; 80·0,3=24; 80·0,1=8.',
'La suma 48+24+8=80 comprueba que se respeta el tamaño pedido. Aquí no aparecen fracciones de personas, por lo que no hace falta una regla de redondeo.',
'Dentro de cada grupo se eligen las personas aleatoriamente desde un listado completo. Cada persona tiene probabilidad 48/600=24/300=8/100=0,08 de entrar. Elegir solo voluntarios no mantendría esta garantía.'
], 'Seleccionar aleatoriamente 48, 24 y 8 personas en los tres estratos.', 'Las cuotas proporcionales no eliminan el sesgo si la selección dentro de cada grupo no es adecuada.');
p('Un intervalo aproximado para una proporción','proportion-intervals','En una muestra aleatoria de 400 respuestas independientes, 240 son favorables. Construye el intervalo normal aproximado del 95% usando 1,96 y comenta su interpretación.',[
'La proporción observada es p̂=240/400=0,6. Para esta aproximación estimamos su error estándar por √(p̂(1−p̂)/n).',
'Sustituimos: √(0,6·0,4/400)=√0,0006≈0,024495. Hay 240 éxitos y 160 fallos, cantidades suficientemente grandes para usar esta aproximación habitual.',
'El margen es 1,96·0,024495≈0,04801. Restamos y sumamos a 0,6: obtenemos aproximadamente [0,55199,0,64801].',
'La cobertura del 95% se refiere al procedimiento repetido en muchas muestras bajo el modelo. No significa que el 95% de las personas esté dentro de un intervalo ni corrige un muestreo sesgado. La aproximación normal puede fallar cerca de 0 o 1 o con muestras pequeñas.'
], 'Intervalo aproximado [0,5520,0,6480], o 55,20%–64,80%.', 'El nivel de confianza no es una proporción de observaciones individuales.');
p('Una paradoja al mezclar grupos','simpson-paradox','El método A logra 81/90 éxitos en casos fáciles y 2/10 en difíciles. B logra 19/20 y 24/80, respectivamente. Compara por grupo y en conjunto.',[
'En casos fáciles, A tiene 81/90=90% y B 19/20=95%; B supera a A. En difíciles, A tiene 2/10=20% y B 24/80=30%; B también supera a A.',
'Al reunir grupos, A suma 83 éxitos entre 100 casos: 83%. B suma 43 entre 100: 43%. La comparación agregada se invierte.',
'La razón está en los pesos: A atiende 90% de casos fáciles, mientras B solo 20%. El promedio global combina porcentajes con pesos diferentes, no con una mitad para cada grupo.',
'Estos datos no prueban que A sea mejor causalmente. El tipo de caso está relacionado tanto con el método aplicado como con la posibilidad de éxito; para comparar métodos hay que considerar esa composición.'
], 'B mejora a A en ambos grupos, pero A obtiene 83% global frente a 43%.', 'Los porcentajes globales pueden ocultar distribuciones muy diferentes de la dificultad.');
group('models-games');
p('Contraseñas con una restricción','counting-principles','Cuenta las claves de cuatro cifras que empiezan por una cifra no nula y no repiten ninguna cifra.',[
'Las cifras disponibles son 0,1,…,9. En el primer puesto no se permite cero, por lo que hay 9 opciones.',
'Una vez elegida la primera, quedan 9 cifras para el segundo puesto: ahora cero sí se permite, pero la cifra usada no.',
'Para el tercer puesto quedan 8 opciones y para el cuarto 7. Cada elección puede continuarse con cualquiera de las opciones disponibles en el siguiente puesto.',
'Aplicamos el principio multiplicativo: 9·9·8·7=4536. No dividimos por permutaciones, porque cambiar el orden cambia la clave.'
], 'Hay 4536 claves.', 'Excluir el cero de todos los puestos eliminaría claves válidas.');
p('Caminos mínimos en una cuadrícula','grid-counting','Cuenta los caminos desde (0,0) hasta (4,3) que solo avanzan una unidad a la derecha o una hacia arriba.',[
'Para llegar al destino debemos dar exactamente cuatro pasos a la derecha y tres hacia arriba. Cualquier camino válido tiene siete pasos.',
'Un camino queda determinado al elegir qué tres de las siete posiciones contienen subidas; las cuatro restantes serán pasos a la derecha.',
'Elegimos esas posiciones con C(7,3)=7·6·5/(3·2·1)=35. Dividimos por 3! porque el orden en que seleccionamos las tres posiciones no cambia el conjunto.',
'No hay restricciones de obstáculos ni de cruzar una diagonal, de modo que cada elección de posiciones produce un camino válido y distinto. Por eso el recuento no requiere descontar casos.'
], 'Hay 35 caminos.', 'Los siete pasos no son todos distintos: permutar dos subidas entre sí no crea un camino nuevo.');
p('Elegir asignaturas sin contar dos veces','inclusion-exclusion','De 60 estudiantes, 35 cursan álgebra, 28 geometría y 12 ambas. ¿Cuántos cursan al menos una y cuántos ninguna?',[
'Al sumar 35+28 contamos una vez a quienes cursan solo una asignatura, pero dos veces a los 12 que cursan ambas.',
'Restamos una de esas copias: quienes cursan al menos una son 35+28−12=51. Esta es la fórmula de inclusión-exclusión para dos conjuntos.',
'Los 60 estudiantes se reparten entre quienes cursan alguna y quienes ninguna. Por complemento, ninguna son 60−51=9.',
'Podemos comprobarlo separando casos: solo álgebra 35−12=23; solo geometría 28−12=16; ambas 12; ninguna 9. La suma 23+16+12+9=60 recupera el total.'
], '51 cursan al menos una; 9 no cursan ninguna.', 'Al menos una incluye a quienes cursan las dos.');
p('Un coeficiente sin expandir todo','binomial-theorem','Halla el coeficiente de x³ en (1+2x)⁵.',[
'El producto contiene cinco factores iguales a (1+2x). Para obtener un término x³ hay que elegir 2x en exactamente tres factores y 1 en los otros dos.',
'Las posiciones de los tres factores que aportan x se eligen de C(5,3)=5·4·3/(3·2·1)=10 maneras.',
'En cada elección el producto aporta (2x)³=8x³. Al sumar las diez contribuciones, el coeficiente es 10·8=80.',
'No pueden contribuir otras elecciones: elegir dos factores produce grado dos y elegir cuatro produce grado cuatro. Por ello el recuento cubre exactamente el término solicitado.'
], 'El coeficiente es 80.', 'El factor 2 también se eleva al cubo al escoger tres veces 2x.');
p('Una ruta que usa cada arista','euler-hamilton','Un grafo tiene vértices A,B,C,D y aristas AB, BC, CD, DA y AC. Decide si existe un recorrido que use cada arista exactamente una vez y construye uno.',[
'El grado es el número de aristas incidentes en un vértice. A y C tienen grado 3; B y D, grado 2. El grafo es conexo porque el ciclo exterior conecta sus vértices.',
'En un recorrido que usa cada arista una vez, cada visita interior empareja una entrada con una salida. Solo inicio y final pueden tener grado impar.',
'Hay exactamente dos vértices impares, A y C, así que un recorrido euleriano debe comenzar en uno y terminar en el otro. No puede ser cerrado.',
'Construimos A→B→C→D→A→C. Usa, en orden, AB, BC, CD, DA y AC: todas las aristas de la lista, sin repetir ninguna. Así queda demostrada la existencia.'
], 'Sí: A→B→C→D→A→C; no existe un circuito euleriano cerrado.', 'Un recorrido euleriano controla aristas; uno hamiltoniano controla vértices.');
p('Collares de cuatro cuentas bajo rotaciones','burnside-lemma','Cada vértice de un cuadrado se colorea de blanco o negro. Cuenta los diseños distintos si solo identificamos rotaciones, sin identificar reflexiones.',[
'Con posiciones etiquetadas hay 2⁴=16 coloraciones. No basta dividir por cuatro: algunos diseños quedan iguales al rotar y tienen menos copias distintas.',
'El lema de Burnside promedia las coloraciones fijas por cada rotación. La identidad fija las 16. Un cuarto de vuelta obliga a que los cuatro colores sean iguales, por lo que fija 2.',
'La media vuelta empareja vértices opuestos. Elegimos independientemente un color por pareja: 2²=4 coloraciones fijas. Tres cuartos de vuelta, igual que un cuarto, fija 2.',
'Promediamos sobre las cuatro rotaciones: (16+2+4+2)/4=24/4=6. No añadimos reflexiones al promedio porque el enunciado solo identifica rotaciones.',
'La razón del promedio puede verse contando parejas de diseño y rotación que lo deja fijo. Si un diseño tiene m versiones distintas al girar, cada versión es fijada por 4/m rotaciones: las cuatro rotaciones se reparten por igual entre sus m imágenes. Sus m versiones aportan m·(4/m)=4 parejas. Por ello cada diseño distinto contribuye exactamente cuatro a la suma de fijos, y dividir por cuatro cuenta los diseños.'
], 'Hay 6 diseños distintos bajo rotaciones.', 'Dividir 16 entre 4 supone que todas las órbitas tienen cuatro elementos, lo que es falso.');
p('Paréntesis que nunca quedan sin abrir','catalan-numbers','Enumera las cadenas correctas de tres pares de paréntesis y explica por qué hay cinco.',[
'Una cadena correcta tiene tantos cierres como aperturas y en ningún prefijo aparecen más cierres que aperturas. El primer paréntesis necesariamente es una apertura.',
'Emparejamos esa apertura con su cierre correspondiente. Dentro puede haber cero, uno o dos pares; lo restante queda después del cierre.',
'Si dentro no hay pares, quedan dos fuera: ()(()) y ()()(). Si dentro hay uno y fuera otro, solo aparece (())().',
'Si dentro hay dos y fuera ninguno, las dos posibilidades interiores son (()) y ()(), que producen ((())) y (()()). Estos casos no se solapan porque el cierre emparejado con el primero está en posiciones distintas.',
'Sumamos 2+1+2=5 cadenas. Todas cumplen la condición de prefijos y contienen exactamente tres aperturas y tres cierres.'
], 'Cinco: ((())), (()()), (())(), ()(()), ()()().', 'Elegir tres posiciones de apertura no garantiza que los cierres aparezcan después de sus aperturas.');
p('Un nacimiento y una supervivencia en Vida','life-patterns','En el Juego de la Vida, solo están vivas las celdas (−1,0), (0,0), (1,0) de una cuadrícula infinita. Calcula la generación siguiente con la regla B3/S23.',[
'La regla usa las ocho celdas vecinas, sin contar la propia. Una muerta nace con exactamente tres vecinas vivas; una viva sobrevive con dos o tres.',
'La celda central (0,0) tiene dos vecinas vivas, los extremos, y sobrevive. Cada extremo tiene solo una vecina viva y muere.',
'Las celdas (0,1) y (0,−1) ven las tres celdas originales, de modo que nacen. Cualquier otra celda muerta ve como máximo dos: para ver los tres extremos debe tener coordenada horizontal cero.',
'Actualizamos todas simultáneamente usando la generación original. Queda la línea vertical (0,−1),(0,0),(0,1). Por simetría, un paso más devuelve la línea horizontal: es un oscilador de período dos.'
], 'Nueva generación: (0,−1), (0,0), (0,1).', 'Actualizar celdas una tras otra usando resultados recién cambiados rompe la regla simultánea.');
p('Una restricción de unidades físicas','dimensional-analysis','Suponiendo que el período T depende solo de una longitud L y una aceleración g como T=C Lᵃgᵇ, determina los exponentes y qué queda sin saber.',[
'Las dimensiones son [T]=tiempo, [L]=longitud y [g]=longitud/tiempo². La constante C se supone adimensional.',
'El miembro derecho tiene dimensión longitud^(a+b)·tiempo^(−2b). Para igualar un tiempo, el exponente de longitud debe ser cero y el de tiempo uno.',
'Resolvemos a+b=0 y −2b=1. La segunda da b=−1/2 y la primera a=1/2. Por tanto T=C√(L/g).',
'El análisis dimensional no determina C ni demuestra que el fenómeno dependa exclusivamente de L y g. Si se aplica al péndulo simple de pequeña amplitud, otra teoría establece C=2π; esa información no procede de las unidades.'
], 'a=1/2, b=−1/2; T=C√(L/g), con C indeterminado.', 'Las unidades restringen una fórmula, pero no fijan constantes adimensionales ni validan todas las hipótesis físicas.');
p('Comparar dos órbitas por su escala','dimensional-analysis','Dos satélites en órbitas circulares alrededor de la misma masa tienen radios r y 4r. Usando v²=GM/r y T=2πr/v, compara sus velocidades y períodos.',[
'G es la constante gravitatoria y M la masa central, igual para ambos. Despejando la velocidad positiva, v=√(GM/r). Aquí r es distancia al centro, no altura sobre la superficie.',
'Al pasar de r a 4r, la velocidad es √(GM/(4r))=(1/2)√(GM/r). Por tanto el segundo satélite se mueve a la mitad de velocidad.',
'El período es longitud de la órbita dividida por velocidad. La circunferencia se multiplica por cuatro y la velocidad se divide por dos, de modo que el tiempo se multiplica por 4/(1/2)=8.',
'También podemos sustituir v: T=2π√(r³/(GM)). Al multiplicar r por cuatro, el período cambia por 4^(3/2)=8, en acuerdo con la comparación anterior.'
], 'La velocidad se reduce a la mitad y el período se multiplica por 8.', 'Una órbita más grande tiene más recorrido y también una velocidad diferente.');

module.exports = groups;
