import { DISTRIBUTIONS } from './distributions';
export type Mode='distribution'|'experiment'|'data'|'inference'|'bayes'|'widget';
export interface ProbabilityExample {id:string;name:string;category:string;mode:Mode;model:string;values:Record<string,number>;description:string;challenge:string;source:string;featured?:boolean;}
export const PROBABILITY_SOURCES={nist:'https://www.itl.nist.gov/div898/handbook/eda/section3/eda366.htm',seeing:'https://seeing-theory.brown.edu/',bertrand:'https://www.randomservices.org/random/buffon/Bertrand.html',coupon:'https://www.randomservices.org/random/urn/Coupon.html',benford:'https://www.randomservices.org/random/special/Benford.html',secretary:'https://www.randomservices.org/random/urn/Secretary.html',walk:'https://www.randomservices.org/random/bernoulli/Walk.html',datasaurus:'https://www.openintro.org/data/index.php?data=datasaurus',anscombe:'https://www.itl.nist.gov/div898/handbook/eda/section1/eda16.htm',bootstrap:'https://www.stat.cmu.edu/~cshalizi/dst/18/lectures/18/lecture-18.html',simpson:'https://mathcircle.berkeley.edu/sites/default/files/handouts/2019/Simpson%20Paradox%20-%20Lisa%20Goldberg%20BMC%20Dec%2015%202019_0.pdf',urn:'https://www.randomservices.org/random/urn/index.html',arcsine:'https://www.randomservices.org/random/special/Arcsine.html'};
const examples:ProbabilityExample[]=[];
function add(id:string,name:string,category:string,mode:Mode,model:string,values:Record<string,number>,description:string,challenge:string,source=PROBABILITY_SOURCES.seeing,featured=false):void{examples.push({id,name,category,mode,model,values,description,challenge,source,featured});}
for(const law of DISTRIBUTIONS)add(law.id,law.name,law.discrete?'Distribuciones discretas':'Distribuciones continuas','distribution',law.id,{},law.note,`Relaciona la forma de ${law.name} con sus parámetros y compara una muestra con la teoría.`,PROBABILITY_SOURCES.nist,['normal','mixture','arcsine','cauchy'].includes(law.id));
const variants:[string,string,string,Record<string,number>,string][]=[
 ['beta-u','Beta en forma de U','beta',{a:0.5,b:0.5},'Los extremos son más probables que el centro: una distribución de arcoseno.'],
 ['beta-skew','Proporciones cerca de cero','beta',{a:2,b:12},'Una densidad muy asimétrica en el intervalo unidad.'],
 ['beta-spike','Proporciones muy concentradas','beta',{a:25,b:25},'Aumentar ambas formas concentra la incertidumbre cerca de 1/2.'],
 ['gamma-singular','Gamma con pico en el origen','gamma',{a:0.3,s:2},'La densidad tiende a infinito cerca de cero, pero el área es finita.'],
 ['gamma-wait','Esperar veinte sucesos','gamma',{a:20,s:1},'Una suma de tiempos exponenciales se vuelve más simétrica.'],
 ['normal-narrow','Campana estrecha','normal',{mu:2,s:0.3},'Una densidad puede superar uno: lo que mide probabilidad es su área.'],
 ['normal-wide','Campana dispersa','normal',{mu:0,s:4},'La misma probabilidad total repartida en un intervalo mayor.'],
 ['rare-events','Sucesos raros en muchos ensayos','binomial',{n:200,p:0.02},'Una binomial se aproxima a Poisson cuando n crece y np permanece moderado.'],
 ['binomial-skew','Binomial muy asimétrica','binomial',{n:20,p:0.08},'La aproximación normal puede ser mala en las colas.'],
 ['binomial-normal','De barras a campana','binomial',{n:100,p:0.5},'Muchos ensayos equilibrados dibujan una campana discreta.'],
 ['poisson-small','Casi ningún suceso','poisson',{lambda:0.4},'El cero domina cuando la intensidad es pequeña.'],
 ['poisson-large','Poisson casi gaussiana','poisson',{lambda:60},'Una intensidad grande suaviza el conteo.'],
 ['geometric-long','Una espera muy larga','geometric',{p:0.03},'El éxito es poco frecuente y la espera conserva falta de memoria.'],
 ['student-cauchy','Student con un grado','student',{nu:1},'La t con ν = 1 coincide con Cauchy: su media no existe.'],
 ['student-normal','Student se acerca a la normal','student',{nu:100},'Las colas de Student se afinan al crecer los grados de libertad.'],
 ['pareto-infinite','Pareto sin media finita','pareto',{a:0.7,s:1},'Valores raros y enormes impiden una media teórica finita.'],
 ['pareto-variance','Media finita, varianza infinita','pareto',{a:1.5,s:1},'Tener media no implica tener varianza.'],
 ['weibull-decreasing','Fallos con riesgo decreciente','weibull',{a:0.6,s:2},'La tasa de fallo decrece con el tiempo.'],
 ['weibull-increasing','Fallos por envejecimiento','weibull',{a:4,s:2},'La tasa de fallo aumenta con el tiempo.'],
 ['mixture-separated','Dos campanas separadas','mixture',{a:5,s:0.6,p:0.5},'La media está en una zona donde casi no hay observaciones.'],
 ['mixture-hidden','Una minoría escondida','mixture',{a:3,s:1,p:0.9},'Una población minoritaria deja un segundo pico discreto.'],
 ['lognormal-long','Crecimiento multiplicativo','lognormal',{mu:0,s:1.5},'La media se desplaza por una cola larga hacia la derecha.'],
 ['hypergeom-large','Extraer casi toda la población','hypergeometric',{N:40,K:12,n:35},'Sin reemplazo, la variabilidad disminuye al acercarse a un censo.'],
 ['f-heavy','F con colas extremas','f',{d1:2,d2:2},'Un cociente de varianzas cuya media no es finita.']
];
for(const [id,name,model,values,description] of variants)add(id,name,'Formas sorprendentes','distribution',model,values,description,'Predice qué momentos existen y qué ocurrirá al aumentar el tamaño de muestra.',PROBABILITY_SOURCES.nist,['beta-u','pareto-infinite','mixture-separated'].includes(id));
const experiments:[string,string,string,string,string?][]=[
 ['bertrand-angle','Bertrand: extremos uniformes','Cuerdas elegidas con extremos uniformes dan probabilidad 1/3.','¿Qué significa elegir una cuerda al azar?',PROBABILITY_SOURCES.bertrand],
 ['bertrand-radius','Bertrand: distancia uniforme','Una distancia uniforme al centro da probabilidad 1/2.','Compara este modelo con los otros dos.',PROBABILITY_SOURCES.bertrand],
 ['bertrand-area','Bertrand: punto medio uniforme','Un punto medio uniforme en el disco da probabilidad 1/4.','Explica la diferencia entre radio uniforme y área uniforme.',PROBABILITY_SOURCES.bertrand],
 ['pi','Dibujar π con azar','Puntos dentro de un círculo permiten aproximar π.','¿Por qué el error no decrece proporcionalmente al número de puntos?'],
 ['birthday','Cumpleaños y colisiones','Con 23 personas, la coincidencia supera el 50 %.','Compara una coincidencia cualquiera con una fecha concreta.',PROBABILITY_SOURCES.urn],
 ['monty','Cambiar de puerta','Cambiar gana dos de cada tres veces bajo las reglas clásicas.','Explica por qué la información del presentador no es una apertura aleatoria.'],
 ['coupons','El último cromo','Completar una colección tarda mucho más que recoger los primeros cromos.','Deriva n Hₙ sumando tiempos de espera.',PROBABILITY_SOURCES.coupon],
 ['matching','Sombreros equivocados','La probabilidad de que nadie reciba su sombrero se aproxima a 1/e.','Usa inclusión-exclusión para explicar el límite.',PROBABILITY_SOURCES.urn],
 ['secretary','La regla del 37 %','Rechaza una primera fracción y elige el siguiente récord.','Busca el mejor umbral, sin confundir éxito con calidad promedio.',PROBABILITY_SOURCES.secretary],
 ['walk','Un bosque de paseos','Trayectorias independientes se abren en abanico.','Relaciona dispersión con √n.',PROBABILITY_SOURCES.walk],
 ['arcsine-walk','Pasar casi todo el tiempo a un lado','Un paseo simétrico puede pasar mucho tiempo por encima o por debajo de cero.','¿Por qué no se concentra el tiempo positivo en 1/2?',PROBABILITY_SOURCES.arcsine],
 ['ruin','Ruina con barreras','Una pequeña ventaja cambia la probabilidad de alcanzar la meta.','Compara capital inicial, meta y sesgo de cada paso.',PROBABILITY_SOURCES.walk],
 ['benford','El uno aparece más','Mantisas logarítmicas uniformes producen dígitos de Benford.','¿Por qué no debe aplicarse esta ley a cualquier conjunto de números?',PROBABILITY_SOURCES.benford],
 ['uniform-digits','Cuando Benford no se aplica','Dígitos uniformes contradicen la falsa idea de que todo sigue Benford.','Compara el mecanismo generador con el modelo logarítmico.',PROBABILITY_SOURCES.benford],
 ['dice','Sumar dados','La suma de dados se vuelve acampanada.','Calcula su media y varianza antes de simular.'],
 ['streak','Rachas que parecen imposibles','Largas rachas aparecen incluso con monedas independientes.','¿Una racha modifica la probabilidad del siguiente lanzamiento?']
];
for(const [id,name,description,challenge,source] of experiments)add(`experiment-${id}`,name,'Experimentos y paradojas','experiment',id,{n:id==='birthday'?23:id==='coupons'?30:id==='matching'?20:id==='ruin'?30:100,p:id==='secretary'?0.37:0.5},description,challenge,source||PROBABILITY_SOURCES.seeing,['bertrand-angle','pi','arcsine-walk','secretary','benford'].includes(id));
const datasaurusNames:Record<string,string>={dino:'El dinosaurio',away:'Nube dispersa',h_lines:'Líneas horizontales',v_lines:'Líneas verticales',x_shape:'Una X',star:'Estrella',high_lines:'Líneas superiores',dots:'Grupos de puntos',circle:'Circunferencia',bullseye:'Diana',slant_up:'Bandas ascendentes',slant_down:'Bandas descendentes',wide_lines:'Bandas amplias'};
for(const [id,name] of Object.entries(datasaurusNames))add(`datasaurus-${id}`,`Datasaurus: ${name}`,'Datos que sorprenden','data',`datasaurus-${id}`,{},'Datos originales: casi las mismas medias, desviaciones y correlación, pero un dibujo diferente.','Compara este conjunto con los demás sin cambiar las estadísticas resumidas.',PROBABILITY_SOURCES.datasaurus,['dino','star','circle'].includes(id));
for(let i=1;i<=4;i++)add(`anscombe-${i}`,`Anscombe ${i}`,'Datos que sorprenden','data',`anscombe-${i}`,{},'Uno de los cuatro conjuntos clásicos con resúmenes casi iguales.','¿Es apropiada una recta? Examina los residuos y los puntos influyentes.',PROBABILITY_SOURCES.anscombe,i===1);
for(const [id,name] of [['simpson','Paradoja de Simpson'],['circle','Correlación cero, relación perfecta'],['spiral','Espiral en el diagrama'],['parabola','La correlación no ve la parábola'],['sine','Una onda escondida'],['heteroscedastic','Un abanico de residuos'],['outlier','Un punto cambia la recta'],['clusters','Mezclar poblaciones'],['independent','Nube independiente'],['linear','Relación lineal con ruido']])add(`data-${id}`,name,'Regresión y diagnóstico','data',id,{},id==='simpson'?'Datos sintéticos: asociación positiva en ambos grupos y negativa al agregarlos.':'Datos sintéticos para explorar asociación, forma y diagnóstico.', 'Mueve un punto, compara Pearson y Spearman y examina residuos.',id==='simpson'?PROBABILITY_SOURCES.simpson:PROBABILITY_SOURCES.seeing,id==='simpson');
for(const [id,name,model,values,description] of [
 ['normal','Intervalos que contienen μ','normal',{n:20},'Los intervalos varían entre muestras; μ permanece fijo.'],
 ['small','Student con muestras pequeñas','normal',{n:5},'Estimar σ exige Student, no tratarla como conocida.'],
 ['skew','Inferencia con asimetría','exponential',{n:10},'La cobertura nominal puede fallar con muestras pequeñas y asimétricas.'],
 ['large','El límite central en acción','exponential',{n:100},'Las medias son más simétricas que la población original.'],
 ['bimodal','Promediar dos poblaciones','mixture',{n:30,a:3},'Las medias pueden parecer normales aunque los datos sean bimodales.'],
 ['cauchy','Cuando el límite central falla','cauchy',{n:30},'Cauchy no tiene media ni varianza: no hay μ que cubrir.'],
 ['bernoulli','Medias de sucesos raros','bernoulli',{n:20,p:0.05},'Una muestra puede no registrar ningún éxito.'],
 ['uniform','Medias de uniformes','uniform',{n:30},'El promedio concentra una distribución originalmente plana.']
 ] as [string,string,string,Record<string,number>,string][])add(`inference-${id}`,name,'Muestreo e inferencia','inference',model,values,description,'Repite muestras y compara cobertura observada con el nivel nominal.',PROBABILITY_SOURCES.seeing,['normal','cauchy'].includes(id));
add('bootstrap','Bootstrap: aprender remuestreando','Muestreo e inferencia','inference','bootstrap',{n:30},'Remuestrea los datos con reemplazo y estima incertidumbre de media o mediana.','Compara el intervalo percentil con un intervalo paramétrico.',PROBABILITY_SOURCES.bootstrap,true);
add('permutation','Permutar grupos bajo la hipótesis nula','Muestreo e inferencia','inference','permutation',{n:30},'Redistribuye etiquetas para generar diferencias de medias bajo intercambiabilidad.','¿Por qué un p-valor no es la probabilidad de que la hipótesis sea verdadera?',PROBABILITY_SOURCES.seeing,true);
for(const [id,name,values] of [['rare','La trampa de la tasa base',{prior:0.01,sens:0.95,fp:0.05}],['balanced','Una población equilibrada',{prior:0.5,sens:0.9,fp:0.1}],['accurate','Una alarma muy precisa',{prior:0.01,sens:0.99,fp:0.001}],['common','La condición frecuente',{prior:0.8,sens:0.9,fp:0.1}]] as [string,string,Record<string,number>][])add(`bayes-${id}`,name,'Bayes e información','bayes','test',values,'Una tabla de frecuencias naturales aclara qué significa un resultado positivo.','Distingue P(positivo | condición) de P(condición | positivo).',PROBABILITY_SOURCES.seeing,id==='rare');
for(const [id,name,values] of [['uniform','De ignorancia a evidencia',{a:1,b:1,successes:8,failures:2}],['jeffreys','Una previa de Jeffreys',{a:0.5,b:0.5,successes:2,failures:0}],['strong','Una previa informativa',{a:20,b:20,successes:8,failures:2}]] as [string,string,Record<string,number>][])add(`beta-bayes-${id}`,name,'Bayes e información','bayes','beta',values,'Actualización conjugada: Beta(α,β) → Beta(α+éxitos,β+fracasos).','¿Cuándo domina la evidencia y cuándo domina la distribución previa?',PROBABILITY_SOURCES.seeing);
for(const [id,name] of [['galton','Máquina de Galton'],['buffon','Agujas de Buffon'],['birthday','Cumpleaños: calendario interactivo'],['monty','Monty Hall: juega una partida'],['bayes','Bayes: visualizador de frecuencias'],['central','Límite central: laboratorio clásico']])add(`widget-${id}`,name,'Visualizadores de la aplicación','widget',id,{},'Abre el visualizador existente dentro del laboratorio y experimenta con sus controles.','Relaciona la simulación con la teoría de las demás pestañas.',id==='buffon'?PROBABILITY_SOURCES.bertrand:PROBABILITY_SOURCES.seeing,id==='galton');
export const PROBABILITY_EXAMPLES:readonly ProbabilityExample[]=examples;
