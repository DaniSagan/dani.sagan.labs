import { PlotMarker, PlotSeries } from './learning-plot.component';
import { curve, choose } from './learning-math';

export interface TopicControl { options?: string[]; label: string; min: number; max: number; step: number; value: number; }
export interface TopicConfig { title: string; prompt: string; controls: TopicControl[]; xLabel?: string; yLabel?: string; }
export interface LabResult { series: PlotSeries[]; markers: PlotMarker[]; readouts: [string,string][]; bounds: [number,number,number,number]; cells?: [number,number][]; table?: string[][]; }
const control=(label:string,min:number,max:number,step:number,value:number):TopicControl=>({label,min,max,step,value});
export const TOPIC_CONFIGS: Record<string,TopicConfig> = {
 'jordan-form':{title:'Escalado y cizalla',prompt:'Cambia λ y compara la primera y segunda coordenada de Jⁿ(0,1). ¿Puede crecer una potencia con valor propio uno?',controls:[control('Valor propio λ',-.9,1.2,.1,1),control('Exponente n',0,16,1,4)],xLabel:'n',yLabel:'coordenada'},
 'cayley-hamilton':{title:'Una potencia, dos matrices base',prompt:'Compara la recurrencia con la potencia de A = ((2,1),(1,2)). La tabla muestra αA + βI.',controls:[control('Exponente n',0,12,1,3)],xLabel:'n',yLabel:'entrada de Aⁿ'},
 'mean-inequalities':{title:'Una suma fija, tres medias',prompt:'Mueve a manteniendo a + b = 10. Predice dónde coinciden las medias.',controls:[control('Primer valor a',.1,9.9,.1,2)]},
 'prime-valuations':{title:'Los exponentes deciden',prompt:'Factoriza el entero y busca los exponentes pares admisibles de un divisor cuadrado.',controls:[control('Entero positivo',2,720,1,360)],xLabel:'primo',yLabel:'exponente'},
 'frobenius-coins':{title:'Mapa de cantidades alcanzables',prompt:'Usamos monedas de 7 y 11. Las barras doradas marcan cantidades representables; la tabla enumera las representaciones de N.',controls:[control('Cantidad N',0,120,1,100)],xLabel:'cantidad',yLabel:'representable'},
 'permutation-symmetries':{title:'Seguir los ciclos',prompt:'La permutación (1 2 3)(4 5 6 7) tiene orden doce. Avanza y comprueba cuándo vuelve cada posición.',controls:[control('Aplicaciones',0,24,1,1)],xLabel:'posición inicial',yLabel:'imagen'},
 'apollonius-circles':{title:'De una circunferencia a la mediatriz',prompt:'Compara k y 1/k. En k = 1 dibujamos la recta x = 0. Las distancias se miden a −1 y 1.',controls:[control('Razón k',.2,3,.05,2)],xLabel:'parte real',yLabel:'parte imaginaria'},
 'quadratic-conics':{title:'Rotar los ejes principales',prompt:'Rota u²/9 − v²/4 = 1. Los vértices y las asíntotas giran junto con la hipérbola.',controls:[control('Rotación en grados',0,180,1,0)],xLabel:'x',yLabel:'y'},
 'vector-products':{title:'Base, altura y orientación',prompt:'La base tiene aristas (2,0,0) y (0,3,0). Cambia la altura de la tercera arista (1,1,h).',controls:[control('Altura firmada h',-5,5,.25,4)]},
 'triangle-metrics':{title:'Del lado al área y al inradio',prompt:'Dos lados miden 7 y 5. Varía el tercero dentro del intervalo que permite un triángulo.',controls:[control('Tercer lado a',2.1,11.9,.1,6)]},
 'height-surveying':{title:'Triangular una altura',prompt:'Desde la primera posición la elevación es 30°. Tras acercarse 20 m, observamos β. ¿Qué ocurre si los ángulos son casi iguales?',controls:[control('Segunda elevación β (grados)',31,85,1,60)]},
 'de-moivre':{title:'Un polígono de raíces',prompt:'Dibuja las n raíces de eⁱθ. Cada raíz se verifica multiplicando su argumento por n.',controls:[control('Número de raíces n',2,12,1,4),control('Argumento θ (grados)',0,360,5,180)],xLabel:'parte real',yLabel:'parte imaginaria'},
 'phasor-superposition':{title:'Interferencia de dos ondas',prompt:'Superponemos cos t y cos(t + φ). Busca refuerzo, cancelación y la fase de la suma.',controls:[control('Diferencia de fase φ (grados)',0,360,5,90)],xLabel:'t (radianes)',yLabel:'amplitud'},
 'trigonometric-equations':{title:'Intersecciones y ceros',prompt:'Compara sin x y cos(2x + φ). En φ = 0 recuperas el problema resuelto. La diferencia se dibuja en azul.',controls:[control('Fase φ (grados)',0,180,5,0)],xLabel:'x (radianes)',yLabel:'valor'},
 'asymptotic-limits':{title:'La escala de una cancelación',prompt:'Reduce la ventana alrededor de cero. El cociente (sin 3x − 3x)/x³ se acerca a −4,5; el punto central muestra su extensión por continuidad.',controls:[control('Semiancho de ventana',.01,1,.01,.5)]},
 'squeeze-oscillation':{title:'Oscilación dentro de una envolvente',prompt:'Cambia α en |x|ᵅ sin(1/x). La gráfica tiene muestreo finito: las envolventes, y no cada oscilación, justifican el límite.',controls:[control('Exponente α',.25,3,.25,1)]},
 'monotone-convergence':{title:'Una recurrencia y su punto fijo',prompt:'Iteramos aₙ₊₁ = √(c + aₙ) desde a₁ = 1. Compara la sucesión con el punto fijo positivo.',controls:[control('Constante c',.5,6,.25,2)],xLabel:'iteración',yLabel:'valor'},
 'mean-value-theorems':{title:'Secante y tangente paralelas',prompt:'En f(x) = x² sobre [0,b], el punto c = b/2 cumple el teorema del valor medio.',controls:[control('Extremo b',.5,5,.25,2)]},
 'convexity-tangents':{title:'Una tangente por encima del logaritmo',prompt:'Mueve el punto de contacto a. La concavidad garantiza la cota sobre todo x positivo.',controls:[control('Contacto a',.25,4,.25,1)]},
 'function-analysis':{title:'Función y derivadas',prompt:'Compara x exp(−ax), su derivada y su segunda derivada. El máximo y la inflexión responden a condiciones diferentes.',controls:[control('Parámetro a',.5,2,.1,1)]},
 'harmonic-oscillator':{title:'Una órbita y su reloj',prompt:'Mueve la fase temporal para recorrer la circunferencia. Cambiar ω modifica el período, pero conserva el radio.',controls:[control('Frecuencia angular ω',.5,3,.25,1),control('Tiempo t',0,12,.1,0)],xLabel:'x',yLabel:'y'},
 'arc-length':{title:'Cuerdas frente a arco',prompt:'Aumenta el número de segmentos en y = (2/3)x³ᐟ². La poligonal se aproxima a la longitud 14/3.',controls:[control('Segmentos n',1,40,1,4)]},
 'areas-revolution':{title:'Una franja y una sección de giro',prompt:'Compara y = x e y = xᵖ en [0,1]. Las lecturas muestran el área y el volumen de arandelas alrededor del eje x.',controls:[control('Exponente p',1.1,5,.1,2)]},
 'conditional-independence':{title:'Marginales fijas, dependencia variable',prompt:'Fijamos P(A)=0,5 y P(B)=0,4. Cambia la intersección y observa P(A|B).',controls:[control('P(A ∩ B)',0,.4,.01,.2)],xLabel:'celda',yLabel:'probabilidad'},
 'discrete-expectation':{title:'Premio bruto y ganancia neta',prompt:'El dado paga 10 si sale 6, 5 si sale 5 y cero en los demás casos. Cambia el coste, sin alterar las probabilidades.',controls:[control('Entrada (€)',0,8,.25,4)],xLabel:'resultado del dado',yLabel:'ganancia (€)'},
 'descriptive-statistics':{title:'La influencia de un extremo',prompt:'Modifica el último dato de [2,4,4,6]. Compara la sensibilidad de media y mediana.',controls:[control('Última observación',0,30,1,6)],xLabel:'observación',yLabel:'valor'},
 'bessel-correction':{title:'Divisor n o n − 1',prompt:'Para una población de varianza 9, comparamos las expectativas teóricas de los estimadores. La insesgadez se refiere a muestras repetidas.',controls:[control('Tamaño n',2,50,1,4)],xLabel:'n',yLabel:'esperanza de la varianza'},
 'sampling-distributions':{title:'La distribución de la media se estrecha',prompt:'Población normal con μ=0 y σ=6. Comparamos medias de tamaño n con observaciones individuales.',controls:[control('Tamaño n',1,200,1,36)],xLabel:'media',yLabel:'densidad'},
 'graphical-diagnostics':{title:'Una recta puede ocultar una curva',prompt:'Usamos y = x + cx². La pendiente ajustada sigue siendo uno, pero los residuos revelan la curvatura.',controls:[control('Curvatura c',0,1,.05,.5)]},
 'grid-counting':{title:'Segmentos en un tablero',prompt:'Tablero de seis filas y siete columnas. Cambia k y compara las cuatro orientaciones; el dibujo muestra los segmentos horizontales.',controls:[control('Casillas consecutivas k',2,8,1,4)]},
 'reflection-principle':{title:'Todos, buenos y reflejados',prompt:'Cuenta caminos a (n,n). La curva mostrada nunca cruza por encima de y = x.',controls:[control('Tamaño n',1,10,1,4)],xLabel:'pasos derecha',yLabel:'pasos arriba'},
 'life-patterns':{title:'Actualización simultánea',prompt:'Elige patrón y generación. Se cuentan las ocho vecinas del estado anterior, sin envolver el tablero.',controls:[control('Generación',0,20,1,0),{...control('Patrón inicial',0,2,1,0),options:['Parpadeador','Bloque','Deslizador']}]},
 'fractal-measure-dimension':{title:'Las etapas de Cantor',prompt:'Cada intervalo produce dos copias a escala un tercio. Compara longitud restante y dimensión.',controls:[control('Etapas n',0,7,1,4)]},
 'solar-geometry':{title:'Un día solar ideal en Oviedo',prompt:'Fijamos latitud 43,36° y movemos la declinación. La curva muestra altura geométrica; las partes negativas quedan bajo el horizonte.',controls:[control('Declinación δ (grados)',-23.44,23.44,.01,0)],xLabel:'ángulo horario (grados)',yLabel:'altura (grados)'},
 'utc-date-arithmetic':{title:'Dos relojes, un intervalo',prompt:'Salida: 10 de enero, 22:30, UTC+1. Llegada: 11 de enero, 06:15. Cambia solo el offset de llegada.',controls:[control('Offset del destino (horas)',-12,14,.5,3)],xLabel:'horas desde 10 enero 00:00 UTC',yLabel:'evento'}
};
export function lifeStep(alive: Set<string>): Set<string> {
 const counts=new Map<string,number>();
 alive.forEach(key=>{const [x,y]=key.split(',').map(Number);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){if(!dx&&!dy)continue;const k=(x+dx)+','+(y+dy);counts.set(k,(counts.get(k)||0)+1);}});
 return new Set([...counts].filter(([k,n])=>n===3||(n===2&&alive.has(k))).map(([k])=>k));
}
export function cantorIntervals(n:number):[number,number][] {
 let intervals:[number,number][]=[[0,1]];
 for(let i=0;i<n;i++)intervals=intervals.flatMap(([a,b])=>[[a,a+(b-a)/3],[b-(b-a)/3,b]] as [number,number][]);
 return intervals;
}
const fmt=(x:number)=>Number.isFinite(x)?Number(x.toPrecision(6)).toString():'No definido';
const gold='#e8c777',blue='#4a9eff',red='#e8643a';
export function computeTopic(topic:string,values:number[]):LabResult {
 const a=values[0],b=values[1]||0;
 const r:LabResult={series:[],markers:[],readouts:[],bounds:[-5,5,-5,5]};
 const add=(label:string,fn:(x:number)=>number,lo:number,hi:number,color=gold)=>r.series.push(curve(label,fn,lo,hi,color,301));
 const read=(label:string,value:number|string)=>r.readouts.push([label,typeof value==='number'?fmt(value):value]);
 const dots=(label:string,points:[number,number][],color=gold)=>{points.forEach(([x,y],i)=>r.markers.push({x,y,label:label+' '+(i+1),color}));};
 switch(topic){
 case 'jordan-form': {
  const n=Math.round(b),p=(k:number)=>k===0?0:k*a**(k-1);
  r.bounds=[0,16,Math.min(-20,...Array.from({length:17},(_,i)=>p(i)))*1.1,Math.max(60,...Array.from({length:17},(_,i)=>p(i)))*1.1];dots('Estado seleccionado',[[n,p(n)],[n,a**n]],blue);add('Primera coordenada',x=>p(Math.round(x)),0,16);add('Segunda coordenada',x=>a**Math.round(x),0,16,blue);
  read('Jⁿ(0,1)', '('+fmt(p(n))+', '+fmt(a**n)+')');read('N²','Matriz cero');r.table=[['λⁿ',fmt(a**n)],['n λⁿ⁻¹',fmt(p(n))]];break;
 }
 case 'cayley-hamilton':{
  let alpha=0,beta=1;for(let i=0;i<a;i++)[alpha,beta]=[4*alpha+beta,-3*alpha];
  r.bounds=[0,12,0,600000];add('Diagonal',x=>(3**Math.round(x)+1)/2,0,12);add('Fuera de diagonal',x=>(3**Math.round(x)-1)/2,0,12,blue);
  read('α',alpha);read('β',beta);dots('Potencia seleccionada',[[a,2*alpha+beta],[a,alpha]],red);read('Aⁿ[1,1]',2*alpha+beta);r.table=[[fmt(2*alpha+beta),fmt(alpha)],[fmt(alpha),fmt(2*alpha+beta)]];break;
 }
 case 'mean-inequalities':{
  r.bounds=[0,10,0,6];add('A',()=>5,.1,9.9);add('G',x=>Math.sqrt(x*(10-x)),.1,9.9,blue);add('H',x=>x*(10-x)/5,.1,9.9,red);
  dots('Medias seleccionadas',[[a,5],[a,Math.sqrt(a*(10-a))],[a,a*(10-a)/5]]);read('a + b',10);read('Media geométrica',Math.sqrt(a*(10-a)));read('Media armónica',a*(10-a)/5);break;
 }
 case 'prime-valuations':{
  let n=Math.round(a);const factors:[number,number][]=[];for(let p=2;p*p<=n;p++){let e=0;while(n%p===0){n/=p;e++;}if(e)factors.push([p,e]);}if(n>1)factors.push([n,1]);
  r.series=[{label:'Exponentes primos',kind:'bars',points:factors}];r.bounds=[0,Math.max(7,...factors.map(x=>x[0]))+1,0,10];
  read('Factorización',factors.map(([p,e])=>p+'^'+e).join(' · '));read('Divisores cuadrados',factors.reduce((n,[,e])=>n*(Math.floor(e/2)+1),1));read('Es cuadrado',factors.every(([,e])=>e%2===0)?'Sí':'No');break;
 }
 case 'frobenius-coins':{
  const pairs:string[][]=[];for(let y=0;11*y<=a;y++)if((a-11*y)%7===0)pairs.push([String((a-11*y)/7),String(y)]);
  const can=(n:number)=>{for(let y=0;11*y<=n;y++)if((n-11*y)%7===0)return 1;return 0;};
  r.series=[{label:'Alcanzable con 7 y 11',kind:'bars',points:Array.from({length:121},(_,i)=>[i,can(i)])}];r.bounds=[0,120,0,1.2];dots('Cantidad seleccionada',[[a,can(a)]],blue);read('Último hueco',59);read('Representaciones de N',pairs.length);r.table=[['Monedas de 7','Monedas de 11'],...pairs];break;
 }
 case 'permutation-symmetries':{
  const image=(x:number)=>x<4?1+(x-1+a)%3:4+(x-4+a)%4;
  r.bounds=[0,8,0,8];dots('Imagen',Array.from({length:7},(_,i)=>[i+1,image(i+1)]));read('Orden',12);read('Identidad',a%12===0?'Sí':'No');r.table=Array.from({length:7},(_,i)=>[String(i+1),String(image(i+1))]);break;
 }
 case 'apollonius-circles':{
  if(Math.abs(a-1)<1e-9){r.series=[{label:'Mediatriz',points:[[0,-4],[0,4]]}];r.bounds=[-4,4,-4,4];read('Lugar','Recta x = 0');}
  else{const c=(1+a*a)/(1-a*a),rad=2*a/Math.abs(1-a*a),extent=Math.max(3,Math.abs(c)+rad+1);r.bounds=[-extent,extent,-extent,extent];r.series=[{label:'Razón de distancias',points:Array.from({length:361},(_,i)=>[c+rad*Math.cos(i*Math.PI/180),rad*Math.sin(i*Math.PI/180)])}];read('Centro',c);read('Radio',rad);}
  dots('Foco',[[-1,0],[1,0]],blue);break;
 }
 case 'quadratic-conics':{
  const t=a*Math.PI/180,rotate=(x:number,y:number):[number,number]=>[x*Math.cos(t)-y*Math.sin(t),x*Math.sin(t)+y*Math.cos(t)];
  r.bounds=[-9,9,-9,9];for(const sign of [-1,1])r.series.push({label:sign===1?'Rama derecha':'Rama izquierda',points:Array.from({length:201},(_,i)=>{const u=(i/200*3.4)-1.7;return rotate(sign*3*Math.cosh(u),2*Math.sinh(u));})});
  for(const sign of [-1,1])r.series.push({label:'Asíntota',color:blue,dashed:true,points:[rotate(-12,sign*-8),rotate(12,sign*8)]});
  dots('Vértice',[rotate(-3,0),rotate(3,0)]);read('Valores propios de Q','1/9 y −1/4');read('Centro','(0,0)');break;
 }
 case 'vector-products':{
  r.bounds=[-5,5,-6,6];add('Volumen firmado del tetraedro',x=>x,-5,5);add('Volumen absoluto',x=>Math.abs(x),-5,5,blue);
  read('Área de la base',6);read('Producto mixto',6*a);read('Volumen tetraedro',Math.abs(a));r.markers=[{x:a,y:a,label:'Volumen firmado'}];break;
 }
 case 'triangle-metrics':{
  const s=(a+12)/2,area=Math.sqrt(s*(s-a)*(s-7)*(s-5)),x=(49+a*a-25)/(2*a),y=2*area/a;
  r.bounds=[0,12,0,8];r.series=[{label:'Triángulo de lados 7,5,a',points:[[0,0],[a,0],[x,y],[0,0]]}];
  read('Área',area);read('Inradio',area/s);read('Mediana sobre a',Math.sqrt(148-a*a)/2);read('Altura sobre a',y);break;
 }
 case 'height-surveying':{
  const ta=Math.tan(Math.PI/6),tb=Math.tan(a*Math.PI/180),d=20*tb/(tb-ta),h=d*ta;r.bounds=[0,d*1.1,0,h*1.1];
  r.series=[{label:'Primera visual',points:[[0,0],[d,h]]},{label:'Segunda visual',color:blue,points:[[20,0],[d,h]]},{label:'Torre',points:[[d,0],[d,h]]}];read('Altura relativa (m)',h);read('Distancia inicial (m)',d);break;
 }
 case 'de-moivre':{
  const n=Math.round(a),theta=b*Math.PI/180;r.bounds=[-1.4,1.4,-1.4,1.4];
  const pts:[number,number][]=Array.from({length:n},(_,k)=>[Math.cos((theta+2*Math.PI*k)/n),Math.sin((theta+2*Math.PI*k)/n)]);
  r.series=[{label:'Polígono de raíces',points:[...pts,pts[0]]}];dots('Raíz',pts);dots('z',[[Math.cos(theta),Math.sin(theta)]],blue);read('Número de raíces',n);read('Módulo de cada raíz',1);break;
 }
 case 'phasor-superposition':{
  const phi=a*Math.PI/180,x=1+Math.cos(phi),y=Math.sin(phi);r.bounds=[0,2*Math.PI,-2.2,2.2];
  add('cos t',Math.cos,0,2*Math.PI);add('cos(t + φ)',t=>Math.cos(t+phi),0,2*Math.PI,blue);add('Suma',t=>Math.cos(t)+Math.cos(t+phi),0,2*Math.PI,red);
  read('Amplitud resultante',Math.hypot(x,y));read('Fase (radianes)',Math.hypot(x,y)<1e-10?'Indeterminada':Math.atan2(y,x));break;
 }
 case 'trigonometric-equations':{
  const phi=a*Math.PI/180;r.bounds=[0,2*Math.PI,-2.2,2.2];add('sin x',Math.sin,0,2*Math.PI);add('cos(2x + φ)',x=>Math.cos(2*x+phi),0,2*Math.PI,red);add('Diferencia',x=>Math.sin(x)-Math.cos(2*x+phi),0,2*Math.PI,blue);
  read('Soluciones exactas para φ=0','π/6, 5π/6, 3π/2');if(a===0)dots('Solución',[[Math.PI/6,.5],[5*Math.PI/6,.5],[3*Math.PI/2,-1]]);break;
 }
 case 'asymptotic-limits':{
  const f=(x:number)=>Math.abs(x)<.001?-4.5+2.025*x*x:(Math.sin(3*x)-3*x)/(x*x*x);r.bounds=[-a,a,-5,-2];
  add('Cociente extendido en cero',f,-a,a);add('Límite',()=>-4.5,-a,a,blue);read('Límite exacto',-4.5);read('Valor en el extremo',f(a));break;
 }
 case 'squeeze-oscillation':{
  r.bounds=[-1,1,-1.1,1.1];add('Función oscilante',x=>x===0?0:Math.abs(x)**a*Math.sin(1/x),-1,1);
  add('Envolvente superior',x=>Math.abs(x)**a,-1,1,blue);add('Envolvente inferior',x=>-(Math.abs(x)**a),-1,1,red);
  read('Continua en cero','Sí, α > 0');read('Derivada en cero',a>1?'0':'No existe');break;
 }
 case 'monotone-convergence':{
  const L=(1+Math.sqrt(1+4*a))/2;let v=1;const pts:[number,number][]=[];for(let i=1;i<=20;i++){pts.push([i,v]);v=Math.sqrt(a+v);}
  r.bounds=[1,20,0,Math.max(3,L+.5)];r.series=[{label:'Sucesión radical',points:pts}];add('Punto fijo',()=>L,1,20,blue);read('Límite',L);read('Error en a₂₀',Math.abs(pts[19][1]-L));break;
 }
 case 'mean-value-theorems':{
  r.bounds=[0,a,0,a*a*1.1];add('x²',x=>x*x,0,a);add('Secante',x=>a*x,0,a,blue);add('Tangente en c',x=>a*x-a*a/4,0,a,red);
  r.markers=[{x:a/2,y:a*a/4,label:'Punto c'}];read('c',a/2);read('Pendiente común',a);break;
 }
 case 'convexity-tangents':{
  r.bounds=[.05,5,-3.2,6];add('log x',Math.log,.05,5);add('Tangente',x=>Math.log(a)+(x-a)/a,.05,5,blue);r.markers=[{x:a,y:Math.log(a),label:'Contacto'}];read('Pendiente',1/a);read('Concavidad','f″(x) < 0');break;
 }
 case 'function-analysis':{
  r.bounds=[-.5,8,-2,2.5];add('f',x=>x*Math.exp(-a*x),-.5,8);add('f′',x=>Math.exp(-a*x)*(1-a*x),-.5,8,blue);add('f″',x=>a*Math.exp(-a*x)*(a*x-2),-.5,8,red);
  dots('Máximo',[[1/a,1/(a*Math.E)]]);dots('Inflexión',[[2/a,2/(a*Math.E**2)]],blue);read('Máximo en x',1/a);read('Inflexión en x',2/a);break;
 }
 case 'harmonic-oscillator':{
  r.bounds=[-2.5,2.5,-2.5,2.5];r.series=[{label:'Órbita exacta',points:Array.from({length:361},(_,i)=>[2*Math.cos(i*Math.PI/180),2*Math.sin(i*Math.PI/180)])}];
  dots('Estado',[[2*Math.cos(a*b),2*Math.sin(a*b)]],blue);read('Período',2*Math.PI/a);read('x² + y²',4);read('Tiempo',b);break;
 }
 case 'arc-length':{
  const f=(x:number)=>2/3*x**1.5,n=Math.round(a),pts:[number,number][]=Array.from({length:n+1},(_,i)=>[3*i/n,f(3*i/n)]);let length=0;for(let i=1;i<pts.length;i++)length+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
  r.bounds=[0,3,0,4];add('Arco',f,0,3);r.series.push({label:'Poligonal',points:pts,color:blue});dots('Partición',pts,blue);read('Longitud poligonal',length);read('Longitud exacta',14/3);read('Error',14/3-length);break;
 }
 case 'areas-revolution':{
  r.bounds=[0,1,0,1.1];add('y = x',x=>x,0,1);add('y = xᵖ',x=>x**a,0,1,blue);
  read('Área',.5-1/(a+1));read('Volumen de arandelas',Math.PI*(1/3-1/(2*a+1)));read('Radio exterior en x=0,5',.5);read('Radio interior en x=0,5',.5**a);break;
 }
 case 'conditional-independence':{
  const cells:[number,number][]=[[1,a],[2,.5-a],[3,.4-a],[4,.1+a]];r.bounds=[0,5,0,.65];r.series=[{label:'Celdas conjuntas',kind:'bars',points:cells}];r.table=[['A ∩ B',fmt(a)],['A ∩ no B',fmt(.5-a)],['no A ∩ B',fmt(.4-a)],['no A ∩ no B',fmt(.1+a)]];
  read('P(A|B)',a/.4);read('P(A)',.5);read('Independencia',Math.abs(a-.2)<1e-9?'Sí':'No');break;
 }
 case 'discrete-expectation':{
  r.bounds=[0,7,-8,11];r.series=[{label:'Ganancia por resultado',kind:'bars',points:Array.from({length:6},(_,i)=>[i+1,(i===5?10:i===4?5:0)-a])}];
  read('Ganancia esperada',2.5-a);read('Varianza',175/12);read('Entrada justa',2.5);read('Probabilidad de pérdida',((a>0?4:0)+(a>5?1:0)+(a>10?1:0))/6);break;
 }
 case 'descriptive-statistics':{
  const data=[2,4,4,a],sorted=[...data].sort((x,y)=>x-y),mean=(10+a)/4,median=(sorted[1]+sorted[2])/2,variance=data.reduce((s,x)=>s+(x-mean)**2,0)/4;
  r.bounds=[0,5,0,Math.max(8,a+1)];dots('Dato',data.map((y,i)=>[i+1,y]));add('Media',()=>mean,0,5,blue);add('Mediana',()=>median,0,5,red);
  read('Media',mean);read('Mediana',median);read('Varianza descriptiva',variance);read('Desviación típica',Math.sqrt(variance));break;
 }
 case 'bessel-correction':{
  r.bounds=[2,50,0,10];add('E(varianza con divisor n)',x=>9*(Math.round(x)-1)/Math.round(x),2,50);add('E(S² corregida)',()=>9,2,50,blue);
  dots('Tamaño seleccionado',[[a,9*(a-1)/a],[a,9]],red);read('Sesgo divisor n',-9/a);read('Esperanza corregida',9);read('Grados de libertad',a-1);break;
 }
 case 'sampling-distributions':{
  const sd=6/Math.sqrt(a),pdf=(x:number,s:number)=>Math.exp(-x*x/(2*s*s))/(s*Math.sqrt(2*Math.PI));r.bounds=[-18,18,0,1.05*pdf(0,sd)];
  add('Observaciones',x=>pdf(x,6),-18,18);add('Media muestral',x=>pdf(x,sd),-18,18,blue);read('Error estándar',sd);read('Varianza de la media',36/a);read('Media poblacional',0);break;
 }
 case 'graphical-diagnostics':{
  const pts:[number,number][]=Array.from({length:7},(_,i)=>{const x=i-3;return[x,x+a*x*x];});r.bounds=[-3.5,3.5,-5,13];dots('Dato',pts);add('Ajuste lineal',x=>x+4*a,-3,3,blue);add('Residuos',x=>a*(x*x-4),-3,3,red);
  read('Pendiente',1);read('Intercepto',4*a);read('Suma de residuos',0);r.table=pts.map(([x,y])=>[fmt(x),fmt(y),fmt(a*(x*x-4))]);break;
 }
 case 'grid-counting':{
  const k=Math.round(a),h=6*Math.max(8-k,0),v=7*Math.max(7-k,0),d=Math.max(8-k,0)*Math.max(7-k,0);r.bounds=[0,8,0,7];
  for(let y=1;y<=6;y++)for(let x=1;x<=8-k;x++)r.series.push({label:'Fila '+y+', inicio '+x,points:[[x,y],[x+k-1,y]],color:gold});
  dots('Casilla',Array.from({length:42},(_,i)=>[i%7+1,Math.floor(i/7)+1]),blue);read('Horizontales',h);read('Verticales',v);read('Cada diagonal',d);read('Total',h+v+2*d);break;
 }
 case 'reflection-principle':{
  const n=Math.round(a),total=choose(2*n,n),bad=choose(2*n,n-1),pts:[number,number][]=[[0,0]];for(let i=0;i<n;i++){pts.push([i+1,i],[i+1,i+1]);}
  r.bounds=[0,n+1,0,n+1];r.series=[{label:'Camino admisible',points:pts}];add('Frontera',x=>x,0,n,blue);read('Todos',total);read('Malos reflejados',bad);read('Buenos (Catalan)',total-bad);break;
 }
 case 'life-patterns':{
  const seeds=[['-1,0','0,0','1,0'],['0,0','1,0','0,1','1,1'],['1,0','2,1','0,2','1,2','2,2']];let alive=new Set(seeds[Math.round(b)]);
  for(let i=0;i<a;i++)alive=lifeStep(alive);
  r.cells=[...alive].map(k=>k.split(',').map(Number) as [number,number]);r.bounds=[-4,12,-4,12];dots('Viva',r.cells);read('Generación',a);read('Células vivas',alive.size);read('Patrón inicial',['Parpadeador','Bloque','Deslizador'][Math.round(b)]);break;
 }
 case 'fractal-measure-dimension':{
  const n=Math.round(a);r.bounds=[0,1,-.5,n+1];for(let level=0;level<=n;level++)for(const [lo,hi] of cantorIntervals(level))r.series.push({label:'Etapa '+level,points:[[lo,level],[hi,level]],color:level===n?gold:blue});
  read('Intervalos',2**n);read('Longitud restante',(2/3)**n);read('Longitud eliminada',1-(2/3)**n);read('Dimensión',Math.log(2)/Math.log(3));break;
 }
 case 'solar-geometry':{
  const rad=Math.PI/180,lat=43.36*rad,dec=a*rad,alt=(H:number)=>Math.asin(Math.max(-1,Math.min(1,Math.sin(lat)*Math.sin(dec)+Math.cos(lat)*Math.cos(dec)*Math.cos(H*rad))))/rad;
  r.bounds=[-180,180,-90,90];add('Altura solar ideal',alt,-180,180);add('Horizonte',()=>0,-180,180,blue);read('Altura al mediodía',90-Math.abs(43.36-a));read('Latitud',43.36);break;
 }
 case 'utc-date-arithmetic':{
  const departure=21.5,arrival=30.25-a,duration=arrival-departure;r.bounds=[15,45,0,3];r.series=[{label:'Intervalo en UTC',points:[[departure,1],[arrival,1]]}];dots('Salida UTC',[[departure,1]],blue);dots('Llegada UTC',[[arrival,1]],red);
  read('Duración (horas)',duration);read('Duración en minutos',duration*60);read('Orden de los instantes',duration>=0?'Llegada posterior':'Llegada anterior: revisa fecha');r.table=[['Salida UTC',fmt(departure)+' h desde origen'],['Llegada UTC',fmt(arrival)+' h desde origen']];break;
 }
 default:throw new Error('Unknown topic: '+topic);
 }
 return r;
}
