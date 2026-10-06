import type { CurveParameterPreset } from '../implicit-curve-graph-tool/curve-parameters';
import type { Bounds, Point } from './vector-math';
export interface VectorExample {
  id: string; name: string; category: string; description: string;
  dx: string; dy: string; bounds: Bounds; parameters: CurveParameterPreset[];
  seeds: Point[]; source?: string;
}
const p = (name: string, value: number, min: number, max: number, step = 0.1): CurveParameterPreset => ({name,value,min,max,step});
const scholar = (s: string) => `https://www.scholarpedia.org/article/${s}`;
const world = (s: string) => `https://mathworld.wolfram.com/${s}.html`;
function e(id: string, name: string, category: string, description: string, dx: string, dy: string,
  radius = 3, parameters: CurveParameterPreset[] = [], source?: string, bounds?: Bounds, seeds?: Point[]): VectorExample {
  return { id,name,category,description,dx,dy,bounds: bounds ?? [-radius,radius,-radius,radius], parameters,source,
    seeds: seeds ?? [[radius*0.65,0.2],[0.3,radius*0.7],[-radius*0.6,-0.4],[radius*0.25,-radius*0.55]] };
}
export const VECTOR_EXAMPLES: VectorExample[] = [
  e('harmonic','Órbitas armónicas','Osciladores','Elipses cerradas: energía conservada y frecuencia ajustable.','y','-a*x',3,[p('a',1,0.1,4)],world('SimpleHarmonicMotion')),
  e('damped','Oscilador amortiguado','Osciladores','El rozamiento transforma las órbitas en espirales hacia el reposo.','y','-x-a*y',3,[p('a',0.35,0,3)],world('DampedSimpleHarmonicMotion')),
  e('pendulum','Péndulo','Osciladores','Libraciones, rotaciones y separatrices alrededor de posiciones invertidas.','y','-sin(x)-a*y',4,[p('a',0,0,1)],world('Pendulum')),
  e('vanderpol','Van der Pol','Osciladores','Un ciclo límite atrae trayectorias interiores y exteriores; aumenta a para ver relajación.','y','a*(1-x*x)*y-x',3.5,[p('a',1,0.1,5)],scholar('Van_der_Pol_model')),
  e('rayleigh','Rayleigh','Osciladores','Amortiguamiento no lineal dependiente de la velocidad.','y','a*(1-y*y/3)*y-x',3.5,[p('a',1,0.1,4)],world('RayleighDifferentialEquation')),
  e('duffing','Duffing: doble pozo','Osciladores','Dos centros potenciales y una silla separan las cuencas de atracción.','y','x-x**3-a*y',2.5,[p('a',0.2,0,1)],scholar('Duffing_oscillator')),
  e('duffing-forced','Duffing forzado','Forzados','Forzamiento periódico: puede mostrar dinámica caótica. El campo depende del tiempo.','y','x-x**3-a*y+b*cos(c*t)',2.5,[p('a',0.2,0,1),p('b',0.3,0,0.8,0.01),p('c',1.2,0.2,3)],scholar('Duffing_oscillator')),
  e('pendulum-forced','Péndulo impulsado','Forzados','Un motor periódico compite con gravedad y rozamiento.','y','-sin(x)-a*y+b*cos(t)',5,[p('a',0.3,0,1),p('b',1.2,0,2)],world('Pendulum')),
  e('vdp-forced','Van der Pol forzado','Forzados','Dos escalas temporales y una fuerza periódica deforman el ciclo de relajación.','y','a*(1-x*x)*y-x+b*cos(c*t)',4,[p('a',1,0.1,4),p('b',0.6,0,2),p('c',1.3,0.2,3)],scholar('Van_der_Pol_model')),
  e('mathieu','Mathieu: resonancia','Forzados','La rigidez cambia periódicamente: explora regiones de resonancia paramétrica.','y','-(a+b*cos(2*t))*x',3,[p('a',1,0,4),p('b',0.6,0,2)],world('MathieuDifferentialEquation')),
  e('lotka','Lotka–Volterra','Biología','Presas y depredadores recorren ciclos alrededor del equilibrio de coexistencia.','a*x-b*x*y','c*x*y-d*y',3,[p('a',1,0.1,3),p('b',1,0.1,3),p('c',1,0.1,3),p('d',1,0.1,3)],world('Lotka-VolterraEquations'),[0,3.5,0,3.5],[[0.5,0.5],[1.5,1],[2,1.5],[0.7,2]]),
  e('competition','Competencia de especies','Biología','Dos poblaciones compiten por recursos: coexistencia o exclusión.','x*(1-x-a*y)','y*(1-y-b*x)',2,[p('a',0.7,0,2),p('b',0.8,0,2)],world('Lotka-VolterraEquations'),[0,2,0,2],[[0.2,0.7],[1.5,0.3],[0.3,1.5],[1.2,1.2]]),
  e('logistic-predator','Depredación con recursos limitados','Biología','Extensión logística de Lotka–Volterra: el alimento disponible limita las presas.','x*(1-x/a)-x*y','y*(x-b)',3,[p('a',2.5,0.5,5),p('b',0.8,0.1,2)],world('Lotka-VolterraEquations'),[0,3,0,2],[[0.3,0.3],[2.5,0.5],[1.8,1.5],[0.8,1]]),
  e('fhn','FitzHugh–Nagumo','Neurociencia','Voltaje y recuperación: excitabilidad, umbral y disparos repetidos.','x-x**3/3-y+a','c*(x+b-d*y)',3,[p('a',0.5,-0.5,1.5),p('b',0.7,0,1.5),p('c',0.08,0.02,0.3,0.01),p('d',0.8,0.1,2)],scholar('FitzHugh-Nagumo')),
  e('brusselator','Brusselator','Química','Reacción autocatalítica: al aumentar b aparecen oscilaciones químicas.','a-(b+1)*x+x*x*y','b*x-x*x*y',4,[p('a',1,0.2,2),p('b',3,0.5,5)],scholar('Rank_One_Chaos'),[0,4,0,5],[[0.8,1],[1.5,3],[0.2,2],[2.5,0.5]]),
  e('hopf','Bifurcación de Hopf','Bifurcaciones','a cruza cero: el foco cambia de estabilidad y nace un ciclo límite.','a*x-y-x*(x*x+y*y)','x+a*y-y*(x*x+y*y)',2.3,[p('a',1,-1,2)],scholar('Andronov-Hopf_bifurcation')),
  e('subcritical-hopf','Hopf subcrítica estabilizada','Bifurcaciones','Dos ciclos pueden coexistir: explora la histéresis de una forma normal con término quíntico.','-y+x*(a+x*x+y*y-(x*x+y*y)**2)','x+y*(a+x*x+y*y-(x*x+y*y)**2)',2,[p('a',-0.15,-0.4,0.4,0.01)],scholar('Andronov-Hopf_bifurcation')),
  e('saddle-node','Silla–nodo','Bifurcaciones','Al cruzar a=0 se crean o desaparecen dos equilibrios.','a-x*x','-y',2.5,[p('a',0.6,-1,2)],scholar('Saddle-node_bifurcation')),
  e('pitchfork','Bifurcación de horquilla','Bifurcaciones','Un equilibrio simétrico da paso a dos estados estables.','a*x-x**3','-y',2.5,[p('a',1,-1,2)],scholar('Pitchfork_bifurcation')),
  e('transcritical','Bifurcación transcrítica','Bifurcaciones','Dos ramas de equilibrios intercambian estabilidad.','a*x-x*x','-y',2,[p('a',0.8,-1,2)],scholar('Transcritical_bifurcation')),
  e('bogdanov','Bogdanov–Takens','Bifurcaciones','Una forma normal organiza sillas, focos y ciclos cerca de un doble valor propio nulo.','y','a+b*y+x*x+x*y',2,[p('a',-0.3,-1,0.5),p('b',-0.5,-2,1)],scholar('Bogdanov-Takens_bifurcation')),
  e('linear','Sistema lineal general','Lineales','La matriz controla nodos, focos, centros y sillas. Ajusta sus cuatro entradas.','a*x+b*y','c*x+d*y',3,[p('a',-0.25,-2,2),p('b',-1,-2,2),p('c',1,-2,2),p('d',-0.25,-2,2)],world('PhasePortrait')),
  e('shear','Cizallamiento','Lineales','La velocidad horizontal depende de la altura; líneas paralelas se deslizan.','a*y','0',3,[p('a',1,-2,2)]),
  e('uniform','Flujo uniforme','Lineales','Todas las partículas comparten dirección y velocidad.','a','b',3,[p('a',1,-2,2),p('b',0.4,-2,2)]),
  e('hamiltonian','Hamiltoniano de cuatro pozos','Hamiltonianos','Los contornos de una energía cuártica forman órbitas y separatrices.','y*(y*y-1)','-x*(x*x-1)',2),
  e('henon-heiles-slice','Potencial cúbico en el plano','Hamiltonianos','Campo hamiltoniano construido con H=y²/2+x²/2−x³/3. Sus separatrices forman un lazo.','y','-x+x*x',2),
  e('nonlinear-center','Centro de rigidez cúbica','Hamiltonianos','El periodo depende de la amplitud: las órbitas dejan de ser elipses.','y','-x-a*x**3',2.5,[p('a',1,0,3)]),
  e('magnetic','Vórtice suave','Fluidos','Rotación de un vórtice regularizado: la velocidad cambia con la distancia.','-y/(a+x*x+y*y)','x/(a+x*x+y*y)',3,[p('a',0.3,0.05,2,0.05)]),
  e('double-vortex','Dos vórtices','Fluidos','Dos remolinos del mismo signo crean órbitas alrededor de cada centro y del conjunto.','-y/(a+(x-1)**2+y*y)-y/(a+(x+1)**2+y*y)','(x-1)/(a+(x-1)**2+y*y)+(x+1)/(a+(x+1)**2+y*y)',3,[p('a',0.15,0.05,1,0.05)]),
  e('vortex-dipole','Dipolo de vórtices','Fluidos','Remolinos de signos opuestos producen corredores y curvas de retorno.','-y/(a+(x-1)**2+y*y)+y/(a+(x+1)**2+y*y)','(x-1)/(a+(x-1)**2+y*y)-(x+1)/(a+(x+1)**2+y*y)',3,[p('a',0.15,0.05,1,0.05)]),
  e('cellular','Flujo celular','Fluidos','Una función de corriente periódica crea un mosaico de celdas cerradas.','sin(a*x)*cos(a*y)','-cos(a*x)*sin(a*y)',4,[p('a',1,0.5,3)]),
  e('rotating-cells','Celdas agitadas','Forzados','Composición de un flujo celular con una perturbación periódica.','sin(x+b*sin(t))*cos(y)','-cos(x+b*sin(t))*sin(y)',4,[p('b',0.5,0,2)]),
  e('source-vortex','Fuente en rotación','Fluidos','a transforma una fuente espiral en un sumidero sin cambiar el giro.','a*x-y','x+a*y',3,[p('a',0.2,-1,1)]),
  e('electric-dipole','Dipolo regularizado','Gradientes','Líneas de una fuente y un sumidero; a suaviza las singularidades.','(x+1)/(a+(x+1)**2+y*y)**1.5-(x-1)/(a+(x-1)**2+y*y)**1.5','y/(a+(x+1)**2+y*y)**1.5-y/(a+(x-1)**2+y*y)**1.5',3,[p('a',0.2,0.05,1,0.05)]),
  e('gradient-wells','Descenso a dos pozos','Gradientes','Descenso de V=(x²−1)²/4+y²/2: dos mínimos y una frontera entre cuencas.','x-x**3','-y',2),
  e('gradient-egg','Paisaje de hueveras','Gradientes','Un paisaje periódico de mínimos y máximos produce una red de cuencas.','-sin(a*x)','-sin(a*y)',5,[p('a',1,0.5,3)]),
  e('rosenbrock','Valle de Rosenbrock','Gradientes','Descenso de un valle curvo; una dinámica rígida exige pasos pequeños.','2*(1-x)+4*a*x*(y-x*x)','-2*a*(y-x*x)',2,[p('a',5,1,30,1)],world('RosenbrockFunction'),[-2,2,-1,3]),
  e('spiral-garden','Jardín de espirales','Composiciones','Una retícula de remolinos con atracción local y simetría periódica.','sin(y)-a*sin(x)','-sin(x)-a*sin(y)',6,[p('a',0.15,-0.5,0.5,0.05)]),
  e('flower-flow','Flor dinámica','Composiciones','La modulación angular de un campo radial dibuja una corona floral.','-y+x*(1-x*x-y*y+b*cos(n*atan2(y,x)))','x+y*(1-x*x-y*y+b*cos(n*atan2(y,x)))',2,[p('b',0.4,0,0.8),{...p('n',6,2,12,1),integer:true}]),
  e('twisted-ring','Anillo con giro variable','Composiciones','El radio busca un anillo mientras la rotación depende de la posición.','x*(1-x*x-y*y)-y*(a+b*x)','y*(1-x*x-y*y)+x*(a+b*x)',2,[p('a',1,0.2,2),p('b',0.6,0,2)]),
  e('double-ring','Dos coronas y una frontera','Composiciones','Dos ciclos atractores separados por un ciclo repulsor.','-y-x*(x*x+y*y-0.25)*(x*x+y*y-1)*(x*x+y*y-2.25)','x-y*(x*x+y*y-0.25)*(x*x+y*y-1)*(x*x+y*y-2.25)',2),
  e('lissajous-time','Lissajous impulsado','Forzados','Campo temporal uniforme: cada trayectoria dibuja una figura de frecuencias n:m.','n*cos(n*t)','m*cos(m*t)',3,[{...p('n',3,1,8,1),integer:true},{...p('m',4,1,9,1),integer:true}]),
  e('swirling-wave','Oleaje giratorio','Forzados','Una rotación armónica y una corriente viajera producen cintas animadas.','-y+a*sin(t+y)','x+a*cos(t+x)',4,[p('a',0.8,0,2)]),
  e('cubic-grid','Retícula cúbica','Composiciones','Un campo separable con nueve equilibrios: nodos, sillas y un repulsor.','x-x**3','y-y**3',2),
  e('sine-hamiltonian','Laberinto hamiltoniano','Hamiltonianos','Un potencial ondulado curva canales y separatrices sin disipar energía.','y','-sin(x)-a*sin(2*x)',5,[p('a',0.7,0,2)]),
  e('quasiperiodic','Impulso cuasiperiódico','Forzados','Dos frecuencias inconmensurables impulsan el oscilador.','y','-x-a*y+b*(cos(t)+cos(SQRT2*t))',4,[p('a',0.1,0,1),p('b',0.7,0,2)]),
  e('double-gyre','Doble giro pulsante','Forzados','Dos remolinos se ensanchan y contraen: un ejemplo clásico de transporte y mezcla lagrangiana.',
    '-PI*a*sin(PI*(b*sin(c*t)*x*x+(1-2*b*sin(c*t))*x))*cos(PI*y)',
    'PI*a*cos(PI*(b*sin(c*t)*x*x+(1-2*b*sin(c*t))*x))*sin(PI*y)*(2*b*sin(c*t)*x+1-2*b*sin(c*t))',
    2,[p('a',0.1,0.05,0.3,0.01),p('b',0.25,0,0.4,0.01),p('c',2*Math.PI/10,0.2,2,0.01)],
    'https://shaddenlab.berkeley.edu/uploads/LCS-tutorial/examples.html',[0,2,0,1],[[0.2,0.2],[0.8,0.6],[1.2,0.4],[1.8,0.8]]),
  e('morris-lecar','Morris–Lecar','Neurociencia','Modelo de conductancias: x es voltaje e y la activación del potasio. a regula la corriente aplicada.',
    '(a-4.4*(1+tanh((x+1.2)/18))/2*(x-120)-8*y*(x+84)-2*(x+60))/20',
    'b*((1+tanh((x-2)/30))/2-y)*cosh((x-2)/60)',80,[p('a',90,0,150,1),p('b',0.04,0.01,0.1,0.01)],
    scholar('Morris-Lecar'),[-80,60,0,1],[[-60,0.1],[-20,0.3],[10,0.5],[-40,0.2]]),
  e('sir','Epidemia SIR','Biología','x son susceptibles, y infectados; recuperados = 1−x−y. Los puntos físicamente válidos cumplen x+y≤1.',
    '-a*x*y','a*x*y-b*y',1,[p('a',2,0.1,5),p('b',0.5,0.1,2)],world('SIRModel'),[0,1,0,1],[[0.95,0.02],[0.75,0.1],[0.5,0.2],[0.3,0.4]]),
];
