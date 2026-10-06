import type { CurveExample } from './curve-examples';

type MakeExample = (id: string, name: string, category: string, description: string,
  formula: string, radius?: number, bounds?: CurveExample['bounds']) => CurveExample;
const wolfram = (page: string): string => `https://mathworld.wolfram.com/${page}.html`;
const macTutor = (page: string): string => `https://mathshistory.st-andrews.ac.uk/Curves/${page}/`;

/** Finite, reproducible selections of families, rather than random formula permutations.
 * Sources describe the underlying family; parameters and compositions are our selections.
 * Polar formulas use integer harmonics to agree across atan2's branch cut. */
export function createExtendedExamples(make: MakeExample): CurveExample[] {
  const curves: CurveExample[] = [];
  const add = (id: string, name: string, category: string, description: string, formula: string,
    radius: number, source?: string, kind: CurveExample['kind'] = 'Clásica',
    family = name, bounds?: CurveExample['bounds']): void => {
    const assetId = id.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    curves.push({ ...make(assetId, name, category, description, formula, radius, bounds), source, kind, family });
  };

  // Each historical name is paired with its equation reference, including scaled cases.
  add('bicorn', 'Bicorne de Sylvester', 'Históricas', 'Un sombrero de dos puntas con un borde hundido entre ellas.',
    'y*y*(1-x*x)-(x*x+2*y-1)**2', 1.3, wolfram('Bicorn'));
  add('nephroid', 'Nefroide', 'Rodaduras y cáusticas', 'Dos cúspides: la curva de luz que aparece en una taza de café.',
    '(x*x+y*y-1)**3-6.75*y*y', 2.3, wolfram('Nephroid'));
  add('deltoid', 'Deltoide de Steiner', 'Rodaduras y cáusticas', 'Un triángulo de lados cóncavos trazado por un círculo rodante.',
    '(x*x+y*y)**2+18*(x*x+y*y)-8*(x**3-3*x*y*y)-27', 3.5, wolfram('Deltoid'));
  add('ampersand', 'Ampersand algebraico', 'Históricas', 'Una cuártica con tres cruces que recuerda al signo &.',
    '(y*y-x*x)*(x-1)*(2*x-3)-4*(x*x+y*y-2*x)**2', 2, wolfram('AmpersandCurve'), 'Clásica', undefined, [-0.5, 2, -1.5, 1.5]);
  add('bean', 'Judía algebraica', 'Históricas', 'Un grano curvado descrito por una ecuación de cuarto grado.',
    'x**4+x*x*y*y+y**4-x*(x*x+y*y)', 1, wolfram('BeanCurve'), 'Clásica', undefined, [-0.2, 1.2, -0.9, 0.9]);
  add('butterfly-algebraic', 'Mariposa séxtica', 'Históricas', 'Dos alas de bordes redondeados se tocan en el centro.',
    'x**6+y**6-x*x', 1.3, wolfram('ButterflyCurve'));
  add('piriform', 'Piriforme de Longchamps', 'Históricas', 'Una pera con una cúspide en su extremo estrecho.',
    'y*y-x**3*(2-x)', 2, wolfram('PiriformCurve'), 'Clásica', undefined, [-0.4, 2.4, -1.6, 1.6]);
  add('dumbbell', 'Mancuerna séxtica', 'Históricas', 'Dos lóbulos unidos por una cintura tangente y muy fina.',
    'y*y-x**4*(1-x*x)', 1.3, wolfram('DumbbellCurve'));
  add('devil', 'Curva del diablo', 'Históricas', 'Un ocho central y ramas abiertas componen un diabolo.',
    'y*y*(y*y-1)-x*x*(x*x-0.64)', 1.9, wolfram('DevilsCurve'));
  add('bifolium', 'Bifolium', 'Históricas', 'Dos hojas comparten una punta, como unas alas inclinadas.',
    '(x*x+y*y)**2-4*x*y*y', 2, wolfram('Bifolium'));
  add('kepler-folium', 'Folium de Kepler', 'Históricas', 'Una hoja central ancha y dos pequeños lóbulos laterales.',
    '(x*x+y*y)*(x*(x+2)+y*y)-4*x*y*y', 2.6, wolfram('KeplersFolium'));
  add('kappa', 'Curva kappa de Gutschoven', 'Históricas', 'Cuatro ramas se cruzan antes de acercarse a dos horizontales.',
    '(x*x+y*y)*y*y-x*x', 3, wolfram('KappaCurve'));
  add('bullet-nose', 'Nariz de bala', 'Históricas', 'Ramas puntiagudas limitadas por dos asíntotas verticales.',
    'y*y-x*x-x*x*y*y', 2.6, wolfram('BulletNose'));
  add('kampyle', 'Campila de Eudoxo', 'Históricas', 'Dos ramas separadas, con hombros curvos y extremos que se abren.',
    'x**4-x*x-y*y', 2.2, wolfram('KampyleofEudoxus'));
  add('cissoid', 'Cisoide de Diocles', 'Históricas', 'Una cúspide se abre hacia una asíntota vertical.',
    'y*y*(2-x)-x**3', 3, wolfram('CissoidofDiocles'), 'Clásica', undefined, [-0.5, 2.5, -3, 3]);
  add('strophoid', 'Estrofoide recta', 'Históricas', 'Un lazo redondo acompañado por dos ramas infinitas.',
    'y*y*(1+x)-x*x*(1-x)', 3, wolfram('Strophoid'));
  add('trisectrix', 'Trisectriz de Maclaurin', 'Históricas', 'Un lazo grande que permite dividir un ángulo en tres partes.',
    'y*y*(1+x)-x*x*(3-x)', 4, macTutor('Trisectrix'));
  add('tschirnhausen', 'Cúbica de Tschirnhausen', 'Históricas', 'Una curva con lazo, también llamada trisectriz de Catalan.',
    '27*y*y-x*x*(x+9)', 10, wolfram('TschirnhausenCubic'), 'Clásica', undefined, [-11, 3, -5, 5]);
  add('serpentine', 'Serpentina de Newton', 'Históricas', 'Una onda racional con dos colinas que se acercan al eje.',
    'y*(1+x*x)-2*x', 3.5, wolfram('SerpentineCurve'));
  add('newton-trident', 'Tridente de Newton', 'Históricas', 'Una cúbica de cuatro extremos con una asíntota vertical.',
    'x*y-x**3+2*x*x-1', 4, macTutor('Trident'));
  add('semicubical', 'Parábola semicúbica de Neile', 'Históricas', 'Dos brazos simétricos nacen de una cúspide aguda.',
    'y*y-x**3', 2.5, macTutor('Neiles'));
  add('cayley-sextic', 'Séxtica de Cayley', 'Históricas', 'Un gran óvalo guarda un diminuto lazo en su interior.',
    '4*(x*x+y*y-x)**3-27*(x*x+y*y)**2', 5, macTutor('Cayleys'), 'Clásica', undefined, [-1.5, 4.5, -3, 3]);
  add('cardioid', 'Cardioide', 'Rodaduras y cáusticas', 'Un corazón de rodadura con una única cúspide.',
    '(x*x+y*y-x)**2-x*x-y*y', 2.4, wolfram('Cardioid'));
  add('tractrix', 'Tractriz', 'Históricas', 'El rastro de un objeto arrastrado con una cuerda de longitud fija.',
    'abs(x)-acosh(1/y)+sqrt(1-y*y)', 2, wolfram('Tractrix'), 'Clásica', undefined, [-3, 3, 0.02, 1.2]);
  add('ellipse-evolute', 'Evoluta de una elipse', 'Rodaduras y cáusticas', 'Los centros de curvatura forman un astroide alargado.',
    'abs(x/1.5)**(2/3)+abs(y/3)**(2/3)-1', 3.5, wolfram('EllipseEvolute'));
  add('parabola-evolute', 'Evoluta de una parábola', 'Rodaduras y cáusticas', 'Una cúspide semicúbica reúne los centros de sus círculos osculadores.',
    '27*x*x-16*(y-0.5)**3', 3, wolfram('ParabolaEvolute'));
  add('agnesi-twin', 'Doble campana de Agnesi', 'Composiciones', 'Dos campanas racionales se reflejan a ambos lados del eje.',
    'y*y*(1+x*x)**2-1', 3, wolfram('WitchofAgnesi'), 'Composición', 'Agnesi');
  add('catenary-lens', 'Lente de catenarias', 'Composiciones', 'Dos cadenas invertidas cierran una lente y se cruzan en los extremos.',
    'y*y-(1.7-cosh(x))**2', 2, macTutor('Catenary'), 'Composición', 'Catenarias');
  add('reuleaux', 'Triángulo de Reuleaux', 'Geometría de distancias', 'Tres arcos circulares delimitan una figura de anchura constante.',
    'max(hypot(x,y-1),hypot(x-sqrt(3)/2,y+0.5),hypot(x+sqrt(3)/2,y+0.5))-sqrt(3)', 1.5, wolfram('ReuleauxTriangle'));
  add('stadium', 'Estadio', 'Geometría de distancias', 'Dos semicírculos conectados por dos segmentos rectos.',
    'hypot(max(abs(x)-1,0),y)-0.65', 2, wolfram('Stadium'));
  add('rounded-box', 'Rectángulo de esquinas circulares', 'Geometría de distancias', 'Una caja redondeada definida mediante distancias a sus lados.',
    'hypot(max(abs(x)-1,0),max(abs(y)-0.55,0))-0.3', 1.6, undefined, 'Composición');
  add('apollonius', 'Círculo de Apolonio', 'Geometría de distancias', 'El cociente de distancias a dos puntos permanece constante.',
    'hypot(x-1,y)-2*hypot(x+1,y)', 4, wolfram('ApolloniusCircle'));
  add('bernoulli-lemniscate-distance', 'Lemniscata por distancias', 'Geometría de distancias', 'El producto de las distancias a dos focos vale uno.',
    'hypot(x-1,y)*hypot(x+1,y)-1', 1.8, wolfram('CassiniOvals'), 'Variante', 'Cassini');

  add('durer-shell', 'Concha de Dürer', 'Históricas', 'Dos ramas de una cuártica nacida de construcciones con regla y compás.',
    '(x*x+x*y+x-4)**2-(4-x*x)*(x-y+1)**2', 4, macTutor('Durers'));
  add('sluze-conchoid', 'Concoide de Sluze', 'Históricas', 'Una cúbica con un lazo redondeado y una rama que escapa.',
    '(x+1)*(x*x+y*y)-4*x*x', 4, macTutor('Conchoidsl'));
  add('quartic-windmill', 'Molino cuártico', 'Históricas', 'Cuatro brazos girados se abren desde un cruce central.',
    'y**4-x**4-x*y', 2, wolfram('SwastikaCurve'));
  add('newton-bell-oval', 'Campana y óvalo de Newton', 'Históricas', 'Una pequeña isla acompaña a una rama abierta de una cúbica.',
    'y*y-x*(x-1)*(x-2)', 3, macTutor('Newtons'));
  add('newton-node', 'Cúbica nodal de Newton', 'Históricas', 'Un óvalo se une a una rama mediante un punto doble.',
    'y*y-x*(x-1)**2', 2.5, macTutor('Newtons'));
  add('newton-punctate', 'Cúbica con punto aislado', 'Históricas', 'Una rama abierta y un punto aislado en el origen; la miniatura muestra la rama.',
    'y*y-x*x*(x-1)', 2.5, macTutor('Newtons'));
  // One representative per family; the controls expose the former numeric variants.
  const param = (name: string, value: number, min: number, max: number, step = 0.1, integer = false) =>
    ({ name, value, min, max, step, integer });
  const family = (id: string, name: string, category: string, description: string, formula: string,
    radius: number, parameters: NonNullable<CurveExample['parameters']>, source?: string,
    kind: CurveExample['kind'] = 'Variante', bounds?: CurveExample['bounds']) => {
    add(id, name, category, description, formula, radius, source, kind, name, bounds);
    curves[curves.length - 1].parameters = parameters;
  };
  family('teardrop', 'Lágrimas', 'Folios y lazos', 'El orden m estrecha la punta y cambia el perfil de la gota.',
    'y*y-(1-x*x)*((1-x)/2)**m', 1.3, [param('m',3,1,7,1,true)], wolfram('TeardropCurve'));
  family('spiric', 'Secciones espíricas de Perseo', 'Secciones del toro', 'El desplazamiento c del plano de corte transforma dos óvalos en una sola figura.',
    '(x*x+y*y+2.25-0.64+c*c)**2-9*(x*x+c*c)', 2.7, [param('c',1.3,0.3,2.2)], macTutor('Spiric'));
  family('watt', 'Mecanismo de Watt', 'Mecanismos', 'La longitud c modifica cinturas, cruces y componentes del recorrido de una biela.',
    '((x*x+y*y)*(x*x+y*y-2.25+c*c)+y*y-x*x)**2-4*y*y*(c*c*(x*x+y*y)-x*x)', 2, [param('c',1,0.6,1.4)], macTutor('Watts'));
  family('multibrot', 'Lemniscatas Multibrot', 'Lemniscatas fractales', 'Ajusta las iteraciones n y la potencia p de z→z^p+c. Nivel |zₙ|=2: aproximación finita, no la frontera fractal exacta.',
    'mandelbrotRadius(x,y,n,p)-2', 2.2, [param('n',4,2,8,1,true),param('p',2,2,6,1,true)], wolfram('MandelbrotSetLemniscate'));
  family('nicomedes', 'Concoide de Nicomedes', 'Concoides', 'b<1 separa las ramas; b=1 produce una cúspide y b>1 abre un lazo.',
    '(x-1)**2*(x*x+y*y)-b*b*x*x', 4.5, [param('b',1.4,0.4,2.8)], wolfram('ConchoidofNicomedes'));
  family('pascal', 'Limaçon de Pascal', 'Concoides', 'Varía b para explorar el lazo interior, la cardioide b=1, la hendidura y el óvalo convexo.',
    '(x*x+y*y-x)**2-b*b*(x*x+y*y)', 4.4, [param('b',1.25,0.35,3,0.05)], wolfram('Limacon'));
  family('kepler', 'Hojas de Kepler', 'Folios y lazos', 'b modifica las proporciones de las hojas de una misma cuártica.',
    '(x*x+y*y)*(x*(x+b)+y*y)-4*x*y*y', 5, [param('b',1.5,0.2,4.5)], wolfram('KeplersFolium'));
  family('cassini', 'óvalos de Cassini', 'Óvalos y multifocales', 'b<1 crea dos islas, b=1 la lemniscata de Bernoulli y b>1 un óvalo unido.',
    '((x-1)**2+y*y)*((x+1)**2+y*y)-b**4', 2.6, [param('b',1.2,0.35,2,0.05)], wolfram('CassiniOvals'));
  family('hippopede', 'Hipopeda de Proclo', 'Folios y lazos', 'El parámetro b transforma el óvalo en dos lóbulos con un cruce central.',
    '(x*x+y*y)**2-4*b*(x*x+y*y)+4*b*b*y*y', 4.4, [param('b',1.7,0.3,4)], wolfram('Hippopede'));
  family('cartesian', 'óvalos de Descartes', 'Óvalos y multifocales', 'm regula el peso de la distancia a uno de los dos focos del óvalo óptico.',
    'hypot(x+0.8,y)+m*hypot(x-0.8,y)-(1.6*m+1.2)', 3.5, [param('m',1.5,0.5,3,0.05)], macTutor('Cartesian'));
  family('multifocal-5-estrella', 'Cassini multifocal', 'Óvalos y multifocales', 'n focos en un polígono regular: b cambia las islas, el collar, la estrella y el óvalo.',
    'r**(2*n)-2*r**n*cos(n*t)+1-b*b', 1.5, [param('n',5,3,12,1,true),param('b',1.08,0.55,1.65,0.01)], 'https://mathcurve.com/courbes2d/cassinienne/cassinienne.shtml');
  family('lame', 'Superelipses de Lamé', 'Superelipses', 'p y q regulan los exponentes de cada eje; a y b sus semianchos. Incluye las superelipses mixtas.',
    'abs(x/a)**p+abs(y/b)**q-1', 2.3, [param('a',1.5,0.5,2),param('p',3,0.35,12,0.05),param('b',1,0.5,2),param('q',3,0.35,12,0.05)], wolfram('Superellipse'));
  family('rose12', 'Rosas de Grandi', 'Rosáceas', 'La frecuencia entera n da n pétalos si es impar y 2n si es par.',
    'r-(n%2 ? cos(n*t) : abs(cos(n*t)))', 1.3, [param('n',6,2,24,1,true)], wolfram('RoseCurve'));
  family('rose-power', 'Rosas de potencia', 'Rosáceas', 'n regula el número de hojas y p abre o afila su perfil.',
    'r-abs(cos(n*t))**p', 1.2, [param('n',5,2,24,1,true),param('p',2,0.5,4)], wolfram('RoseCurve'), 'Composición');
  family('gielis-6-petalo', 'Superfórmula de Gielis', 'Superfórmula de Gielis', 'Explora pétalo, estrella, polígono, trébol, aguja, almohadilla, corola y escudo con m, n_1 y n_2. Exponentes iguales en ambos términos garantizan el cierre.',
    'r-superformula(t,m,n_1,n_2,n_2)', 1.6, [param('m',6,3,20,1,true),param('n_1',0.35,0.15,8,0.05),param('n_2',1.7,0.5,8)], wolfram('Superellipse'));
  family('lissajous57', 'Lazos de Chebyshev', 'Lazos polinómicos', 'p y q ajustan los grados de la malla algebraica. Los grados coprimos producen lazos de Lissajous.',
    'chebyshevT(p,x)-chebyshevT(q,y)', 1.1, [param('p',5,2,12,1,true),param('q',7,3,15,1,true)], macTutor('Lissajous'));
  for (const [name, fn] of [['Legendre','legendre'], ['Chebyshev U','chebyshevU'], ['Gegenbauer','gegenbauer']] as const) {
    family(`orthogonal-${fn}`, `Tapiz de ${name}`, 'Lazos polinómicos', 'n ajusta el primer grado; el segundo siempre es n+1.',
      `${fn}(n,x)-${fn}(n+1,y)`, 1.1, [param('n',5,3,10,1,true)], undefined, 'Composición');
  }
  family('sluze', 'Perlas de Sluze', 'Perlas de Sluze', 'El exponente de y es 2n; m y p cambian el perfil. El arco entre 0 y 1 está normalizado a altura 1.',
    'y**(2*n)-((m+p)**(m+p)/(m**m*p**p))*x**m*(1-x)**p', 1.3,
    [param('n',2,1,3,1,true),param('m',3,1,5,1,true),param('p',3,1,5,1,true)], macTutor('Pearls'), 'Variante', [-0.15,1.15,-1.2,1.2]);
  family('elliptic', 'Cúbicas elípticas', 'Cúbicas elípticas', 'Los coeficientes a y b de Weierstrass cambian el número de componentes reales.',
    'y*y-(x**3+a*x+b)', 3, [param('a',-0.5,-1.5,2.5),param('b',0.3,-1,1)], wolfram('EllipticCurve'));
  family('goursat', 'Cuárticas de Goursat', 'Cuárticas simétricas', 'a y b cambian los óvalos, cruces e islas de esta familia de simetría cuadrada.',
    'x**4+y**4+a*(x*x+y*y)**2+b*(x*x+y*y)-1', 2.5, [param('a',-0.5,-0.8,1.5),param('b',0.3,-0.8,0.8)], 'https://mathcurve.com/courbes2d/goursat/goursat.shtml');
  family('lace-mandala', 'Encajes polares', 'Mandalas', 'n controla los radios de pequeños lazos ordenados en coronas.',
    'sin(8*r)*cos(n*t)-0.28', 2.4, [param('n',8,3,16,1,true)], undefined, 'Composición');
  family('braided-mandala', 'Mandalas trenzados', 'Mandalas', 'n controla las hebras de dos fases contrapuestas que dibujan rombos curvos.',
    'sin(6*r+n*t)*sin(6*r-n*t)-0.3', 2.4, [param('n',8,3,16,1,true)], undefined, 'Composición');
  family('petal-crown', 'Coronas florales', 'Flores', 'n controla los lóbulos de tres bordes florales anidados.',
    '(r-0.45-0.1*cos(n*t))*(r-0.9-0.2*cos(n*t))*(r-1.35+0.18*cos(n*t))', 1.8, [param('n',8,3,16,1,true)], undefined, 'Composición');
  family('spiral-lace', 'Remolinos de encaje', 'Espirales', 'n controla los brazos de una fase espiral modulada por una onda angular.',
    'sin(5*r-n*t+0.65*sin(2*n*t))', 3, [param('n',8,3,16,1,true)], undefined, 'Composición');
  family('wave-crystal', 'Cristales de ondas', 'Interferencias', 'n direcciones equiespaciadas de ondas planas; f controla la frecuencia.',
    'waveCrystal(x,y,n,f)-0.5', 3, [param('n',7,3,16,1,true),param('f',4,1,8)], undefined, 'Composición');
  family('circular-sources', 'Emisores circulares', 'Interferencias', 'n focos en un polígono generan interferencias; f controla la frecuencia.',
    'circularWaves(x,y,n,f)', 3, [param('n',5,3,12,1,true),param('f',5,3,8)], undefined, 'Composición');
  family('mandala-pearl', 'Burbujas radiales', 'Mandalas', 'n controla los sectores del collar de perlas y b conecta o separa las burbujas.',
    'sin(7*r)**2+sin(n*t)**2-b', 2.5, [param('n',6,3,12,1,true),param('b',0.35,0.12,0.55,0.01)], undefined, 'Composición');
  family('clover', 'Tréboles y estrellas polares', 'Estrellas', 'n regula las hojas o puntas; a cambia la profundidad de sus valles.',
    'r-1-a*cos(n*t)', 1.9, [param('a',0.55,0.1,0.8,0.05),param('n',5,3,16,1,true)], undefined, 'Composición');
  family('galaxy', 'Galaxia y espirales de fase', 'Espirales', 'n controla los brazos y f la separación entre vueltas. Incluye las variantes simple, doble y triple.',
    'sin(f*r-n*t)', 3.5, [param('f',2.6,1,8),param('n',5,1,16,1,true)], undefined, 'Composición');
  return curves;
}
