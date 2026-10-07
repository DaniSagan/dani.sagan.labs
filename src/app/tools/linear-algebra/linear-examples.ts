export interface LinearExample {id:string;name:string;category:string;matrix:string;view:'system'|'transform';description:string;challenge:string;t:string;critical:string[];source:string;}
export const SOURCES = {
  geometry:'https://textbooks.math.gatech.edu/ila/systems-of-eqns.html',
  transform:'https://textbooks.math.gatech.edu/ila/linear-transformations.html',
  spectrum:'https://textbooks.math.gatech.edu/ila/eigenvectors.html',
  markov:'https://textbooks.math.gatech.edu/ila/stochastic-matrices.html',
  least:'https://interactivetextbooks.tudelft.nl/linear-algebra/Chapter7/LeastSquares.html',
  svd:'https://math.mit.edu/~gs/linearalgebra/ila5/SVD_Slides.pdf',
  hilbert:'https://mathworld.wolfram.com/HilbertMatrix.html',
  cat:'https://mathworld.wolfram.com/ArnoldsCatMap.html'
};
const examples:LinearExample[]=[];
function add(id:string,name:string,category:string,matrix:string,description:string,challenge:string,view:'system'|'transform'='system',t='1',critical:string[]=[],source=SOURCES.geometry):void{
  examples.push({id,name,category,matrix,description,challenge,view,t,critical,source});
}
add('three-planes','Tres planos, un punto','Geometría espacial','1 1 1 2;1 -1 0 0;0 1 -1 1','Tres láminas de colores se encuentran en un punto.','Justifica por qué los tres normales son independientes.');
add('pencil','Haz de planos','Parámetros','1 1 1 1;1 t 1 1;1 1 t t','El rango salta al atravesar t = 1.','Discute t = 1 antes de dividir por t − 1.','system','2',['1']);
add('bifurcation','De un punto a ningún punto','Parámetros','1 1 1 1;1 t 1 2;1 1 t 3','Los planos pierden su intersección cuando t = 1.','Explica la diferencia entre rango de A y rango ampliado.','system','2',['1']);
add('two-critical','Dos valores excepcionales','Parámetros','t 1 0 1;1 t 0 1;0 0 t-2 1','Singularidades en −1, 1 y 2 con comportamientos distintos.','Clasifica cada valor excepcional.','system','0',['-1','1','2']);
add('line-space','Una recta de soluciones','Geometría espacial','1 1 1 2;2 2 2 4;1 -1 0 0','Dos restricciones independientes dejan un grado de libertad.','Encuentra un punto y un vector director de la recta.');
add('plane-space','Un plano de soluciones','Geometría espacial','1 2 -1 1;2 4 -2 2;-1 -2 1 -1','Tres ecuaciones describen el mismo plano.','Construye una base de dos vectores para el núcleo.');
add('parallel-space','Planos paralelos','Geometría espacial','1 1 1 1;1 1 1 3','Normales iguales, términos independientes distintos.','Identifica la contradicción obtenida por Gauss.');
add('triangle-space','Intersecciones por parejas','Geometría espacial','1 0 0 0;0 1 0 0;1 1 0 2','Cada pareja se corta, pero los tres planos no comparten punto.','¿Por qué intersección por parejas no implica intersección común?');
add('all-space','Todo el espacio','Geometría espacial','0 0 0 0;0 0 0 0','Ninguna restricción: cualquier vector es solución.','Relaciona rango cero y dimensión del núcleo.');
add('impossible','La ecuación imposible','Geometría espacial','0 0 0 1;1 0 0 0','Una fila 0 = 1 basta para hacer incompatible el sistema.','¿Puede arreglarlo otra ecuación?');
add('crossing','Dos rectas secantes','Geometría plana','1 1 2;1 -1 0','Las rectas se cruzan en (1, 1).','Interpreta el determinante como área.');
add('coincident','Rectas coincidentes','Geometría plana','1 2 3;2 4 6','Una sola restricción expresada dos veces.','Da la solución como punto más parámetro por dirección.');
add('parallel','Rectas paralelas','Geometría plana','1 2 3;2 4 7','La separación persiste aunque sus normales sean proporcionales.','Calcula la distancia entre ambas rectas.');
add('near-parallel','Casi paralelas','Parámetros','1 1 1;1 1+t 2','Al acercarse t a cero la solución se aleja del encuadre.','Explica por qué una pequeña perturbación puede mover mucho la solución.','system','1/10',['0']);
add('rank-zero','Rango que cae a cero','Parámetros','t 0 t;0 t t','En t = 0 desaparecen todas las restricciones.','Explica por qué se pasa de un punto a todo el plano.','system','1',['0']);
add('origin-pencil','Haz por el origen','Parámetros','1 t 0;t 1 0','Dos rectas giran y coinciden en t = ±1.','Encuentra las direcciones libres en ambos casos.','system','0',['-1','1']);
add('rational-pole','Un coeficiente con polo','Parámetros','1/(t-1) 1 2;1 -1 0','La familia no está definida en t = 1.','Distingue singularidad del sistema y coeficiente no definido.','system','2',['1']);
add('overdetermined','Tres rectas concurrentes','Geometría plana','1 0 1;0 1 1;1 1 2','Más ecuaciones que incógnitas puede dar una solución exacta.','¿Qué ecuación es redundante?');
add('fit-line','Ajuste de una recta','Mínimos cuadrados','1 -2 -1;1 -1 0;1 0 2;1 1 2;1 2 5','Datos ruidosos: el sistema es incompatible y las ecuaciones normales dan el ajuste.','Comprueba que Aᵀ(Ax − b) = 0.','system','1',[],SOURCES.least);
add('fit-parabola','Ajuste de una parábola','Mínimos cuadrados','1 -2 4 5;1 -1 1 2;1 0 0 1;1 1 1 1;1 2 4 6','Tres coeficientes aproximan cinco observaciones.','Interpreta el residuo como vector ortogonal a la imagen de A.','system','1',[],SOURCES.least);
add('inconsistent-fit','El compromiso geométrico','Mínimos cuadrados','1 0 1;0 1 1;1 1 0','No existe intersección común; el ajuste minimiza la suma de residuos al cuadrado.','Obtén el punto de compromiso y su residuo.','system','1',[],SOURCES.least);
add('rank-deficient-fit','Ajuste no único','Mínimos cuadrados','1 2 1;2 4 1;3 6 2','Columnas dependientes: los mínimos cuadrados tampoco son únicos.','Describe todas las soluciones de las ecuaciones normales.','system','1',[],SOURCES.least);
const transforms: [string,string,string,string,string,string[]?][] = [
 ['identity','Identidad','1 0 0;0 1 0','La cuadrícula y el círculo permanecen fijos.','¿Qué vectores son autovectores?'],
 ['quarter-turn','Cuarto de vuelta','0 -1 0;1 0 0','Rotación de 90°: no hay direcciones propias reales.','Justifica por qué los autovalores son ±i.'],
 ['half-turn','Media vuelta','-1 0 0;0 -1 0','Todos los vectores invierten su sentido.','¿Cuántas direcciones propias existen?'],
 ['rational-rotation','Rotación racional','(1-t^2)/(1+t^2) -2*t/(1+t^2) 0;2*t/(1+t^2) (1-t^2)/(1+t^2) 0','La parametrización racional del círculo produce rotaciones exactas.','Comprueba AᵀA = I y det A = 1.'],
 ['reflection-x','Reflexión horizontal','1 0 0;0 -1 0','Una simetría invierte la orientación.','Identifica los autoespacios de 1 y −1.'],
 ['reflection-diagonal','Espejo diagonal','0 1 0;1 0 0','La recta y = x permanece fija.','Descompón un vector en componentes paralela y perpendicular.'],
 ['reflection-rational','Espejo que gira','(1-t^2)/(1+t^2) 2*t/(1+t^2) 0;2*t/(1+t^2) (t^2-1)/(1+t^2) 0','Una familia de reflexiones con eje móvil.','Encuentra el eje fijo para cada t.'],
 ['shear','Cizallamiento horizontal','1 t 0;0 1 0','Los cuadrados se convierten en paralelogramos de igual área.','Explica por qué preserva área y no longitudes.'],
 ['shear-y','Cizallamiento vertical','1 0 0;t 1 0','La otra cizalla elemental del plano.','Compara el producto de las dos cizallas en ambos órdenes.'],
 ['stretch','Estiramiento anisótropo','3 0 0;0 1/2 0','El círculo se convierte en una elipse.','Relaciona los semiejes con los valores singulares.'],
 ['squeeze','Compresión que conserva área','t 0 0;0 1/t 0','Un eje crece mientras el otro se contrae.','¿Qué ocurre al aproximarse a t = 0?',['0']],
 ['collapse','Colapso a una recta','1 t 0;0 0 0','El plano pierde una dimensión.','Encuentra núcleo e imagen.'],
 ['projection-diagonal','Proyección ortogonal diagonal','1/2 1/2 0;1/2 1/2 0','Todos los puntos caen perpendicularmente sobre y = x.','Demuestra que A² = A y Aᵀ = A.'],
 ['projection-oblique','Proyección oblicua','1 2 0;0 0 0','Proyecta sobre el eje x en una dirección inclinada.','¿Por qué sus valores singulares no son sus autovalores?'],
 ['zero-map','Transformación nula','0 0 0;0 0 0','Todo el plano se concentra en el origen.','Comprueba rango más nulidad igual a dos.'],
 ['jordan','Bloque de Jordan','1 1 0;0 1 0','Un autovalor doble y una única dirección propia.','Calcula Aⁿ sin diagonalizar.'],
 ['nilpotent','Nilpotente de índice dos','0 1 0;0 0 0','Una aplicación colapsa a una recta; dos colapsan a cero.','Comprueba A² = 0.'],
 ['fibonacci','La matriz de Fibonacci','1 1 0;1 0 0','Las iteraciones generan Fibonacci y señalan la razón áurea.','Relaciona la dirección dominante con φ.'],
 ['pell','La matriz de Pell','2 1 0;1 0 0','Otra recurrencia conduce a la razón plateada.','Encuentra el autovalor 1 + √2.'],
 ['cat','El gato de Arnold','2 1 0;1 1 0','Activa módulo 1 para ver estiramiento y plegado sobre el toro.','¿Por qué el determinante 1 permite invertir el mapa?'],
 ['cat-alternate','Dos cizallas y caos','1 1 0;1 2 0','El otro orden de las cizallas también mezcla el cuadrado.','Compara su espectro con el gato de Arnold.'],
 ['markov','Dos estados de Markov','9/10 1/5 0;1/10 4/5 0','Las columnas suman uno y las iteraciones convergen a una proporción estable.','Busca un autovector de λ = 1 con suma de componentes igual a uno.'],
 ['markov-periodic','Markov periódico','0 1 0;1 0 0','La población alterna: no toda cadena converge.','Relaciona la oscilación con λ = −1.'],
 ['spiral-in','Espiral contractiva','3/5 -2/5 0;2/5 3/5 0','Rotación y contracción combinadas.','Calcula el módulo de los autovalores complejos.'],
 ['spiral-out','Espiral expansiva','1 -1 0;1 1 0','Cada iteración rota y amplifica.','¿En cuánto se multiplica el área?'],
 ['saddle','Silla hiperbólica','2 0 0;0 1/2 0','Una dirección se expande y otra se contrae.','Interpreta las variedades estable e inestable.'],
 ['nonnormal','Crecimiento transitorio','1/2 4 0;0 1/2 0','Autovalores pequeños no impiden una amplificación inicial.','Compara radio espectral y norma singular.'],
 ['ill-conditioned','Casi singular','1 1 0;1 1+t 0','La elipse se aplana y el condicionamiento empeora.','Explica la diferencia entre singular y mal condicionada.',['0']],
 ['symmetric','Ejes principales inclinados','2 1 0;1 2 0','Una matriz simétrica tiene direcciones propias ortogonales.','Dibuja la elipse en su base propia.'],
 ['orientation','Cambio de orientación','1 1 0;1 t 0','En t = 1 el paralelogramo cambia de orientación pasando por área cero.','Relaciona el signo de det A y la orientación.',['1']],
 ['involution','Involución oblicua','1 3 0;0 -1 0','Aplicar dos veces devuelve el punto original, pero no es una reflexión ortogonal.','Comprueba A² = I sin confundir involución e isometría.'],
 ['complex-structure','Estructura compleja oblicua','1 -2 0;1 -1 0','A² = −I: cuatro iteraciones devuelven cada punto.','¿Por qué la norma puede cambiar si A⁴ = I?'],
 ['hyperbolic','Rotación hiperbólica','(1+t^2)/(1-t^2) 2*t/(1-t^2) 0;2*t/(1-t^2) (1+t^2)/(1-t^2) 0','Preserva x² − y² en vez de la distancia euclídea.','Comprueba la invariancia de la forma cuadrática.',['-1','1']],
 ['rank-transition','Dos dimensiones, una, ninguna','t 0 0;0 t^2 0','En cero ambos ejes desaparecen a velocidades diferentes.','Compara los valores singulares para |t| < 1.',['0']]
];
for(const [id,name,matrix,description,challenge,critical] of transforms)add(id,name,['fibonacci','pell','cat','cat-alternate','markov','markov-periodic','spiral-in','spiral-out','saddle','nonnormal'].includes(id)?'Iteraciones y aplicaciones':'Transformaciones',matrix,description,challenge,'transform',id==='hyperbolic'?'1/2':id==='ill-conditioned'?'1/10':'1',critical||[],id.startsWith('cat')?SOURCES.cat:id.startsWith('markov')?SOURCES.markov:id==='stretch'?SOURCES.svd:SOURCES.transform);
for(let n=2;n<=5;n++){
  const matrix=Array.from({length:n},(_,i)=>[...Array.from({length:n},(_,j)=>`1/${i+j+1}`),'1'].join(' ')).join(';');
  add(`hilbert-${n}`,`Hilbert de orden ${n}`,'Matrices especiales',matrix,'Fracciones pequeñas producen una matriz invertible con gran sensibilidad numérica.','Compara la solución exacta con una aproximación redondeada.','system','1',[],SOURCES.hilbert);
}
add('vandermonde','Interpolación de Vandermonde','Matrices especiales','1 -1 1 1;1 0 0 0;1 1 1 1','Tres puntos determinan un polinomio cuadrático.','Interpreta cada incógnita como coeficiente de un polinomio.');
add('vandermonde-parameter','Nodos que se juntan','Parámetros','1 0 0 0;1 1 1 1;1 t t^2 t','La interpolación pierde unicidad cuando coinciden nodos.','Factoriza el determinante como t(t − 1).','system','2',['0','1']);
add('laplacian','Laplaciano de un triángulo','Matrices especiales','2 -1 -1 0;-1 2 -1 0;-1 -1 2 0','El núcleo recoge potenciales constantes en un grafo conectado.','Explica por qué cada fila suma cero.');
add('magic','Cuadrado mágico de Lo Shu','Matrices especiales','8 1 6 15;3 5 7 15;4 9 2 15','Una matriz cuyo vector (1,1,1) tiene autovalor 15.','Comprueba las sumas de filas, columnas y diagonales.');
add('pascal','Matriz de Pascal','Matrices especiales','1 0 0 1;1 1 0 2;1 2 1 4','Una matriz triangular organiza coeficientes binomiales.','Calcula su inversa y observa el patrón de signos.');
add('difference','Diferencias discretas','Matrices especiales','1 -1 0 1;0 1 -1 1','Las diferencias determinan una sucesión salvo una constante.','Relaciona el núcleo con la invariancia por traslación.');
export const LINEAR_EXAMPLES:readonly LinearExample[]=examples;
