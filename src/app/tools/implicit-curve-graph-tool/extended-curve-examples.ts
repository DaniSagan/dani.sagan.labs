import type { CurveExample } from './curve-examples';

type MakeExample = (id: string, name: string, category: string, description: string,
  formula: string, radius?: number, bounds?: CurveExample['bounds']) => CurveExample;
const wolfram = (page: string): string => `https://mathworld.wolfram.com/${page}.html`;
const macTutor = (page: string): string => `https://mathshistory.st-andrews.ac.uk/Curves/${page}/`;
const label = (n: number): string => String(n).replace('.', ',');
const key = (n: number): string => String(n).replace('.', '-');

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
  for (let m = 1; m <= 7; m++) {
    add(`teardrop-${m}`, `Lágrima · orden ${m}`, 'Folios y lazos',
      'Una gota de extremo estrecho: ecuación cartesiana obtenida de la parametrización trigonométrica.',
      `y*y-(1-x*x)*((1-x)/2)**${m}`, 1.3, wolfram('TeardropCurve'), 'Variante', 'Lágrimas');
  }
  for (const c of [0.3,0.8,1.3,1.5,1.8,2.2]) {
    add(`spiric-${key(c)}`, `Sección espírica de Perseo · corte ${label(c)}`, 'Secciones del toro',
      'La sección de un toro pasa de dos óvalos a una sola figura al desplazar el plano de corte.',
      `(x*x+y*y+${2.25-0.64+c*c})**2-9*(x*x+${c*c})`, 2.7, macTutor('Spiric'), 'Variante', 'Secciones espíricas');
  }
  for (const c of [0.6,0.8,1,1.2,1.4]) {
    // Eliminate the two signs of the polar square root; no lost angular branches.
    add(`watt-${key(c)}`, `Mecanismo de Watt · c=${label(c)}`, 'Mecanismos',
      'El punto medio de una biela dibuja la curva; aparecen cinturas, cruces y componentes separados.',
      `((x*x+y*y)*(x*x+y*y-2.25+${c*c})+y*y-x*x)**2-4*y*y*(${c*c}*(x*x+y*y)-x*x)`,
      2, macTutor('Watts'), 'Variante', 'Curva de Watt');
  }
  for (const n of [2,3,4,5,6,7,8]) {
    for (const power of [2,3,4,5,6]) {
      add(`multibrot-${power}-${n}`, `Lemniscata Multibrot · potencia ${power} · iteración ${n}`, 'Lemniscatas fractales',
        `Nivel |zₙ|=2 de z→z^${power}+c, empezando en cero. Es una aproximación finita por curvas de nivel, no la frontera fractal exacta.`,
        `mandelbrotRadius(x,y,${n},${power})-2`, 2.2, wolfram('MandelbrotSetLemniscate'), 'Variante', 'Lemniscatas Multibrot');
    }
  }

  for (const b of [0.4, 0.7, 1, 1.4, 2, 2.8]) {
    add(`nicomedes-${key(b)}`, `Concoide de Nicomedes · b=${label(b)}`, 'Concoides',
      b > 1 ? 'Un lazo aparece al superar la distancia a la recta base.' : b === 1 ? 'El caso límite presenta una cúspide en el origen.' : 'Dos ramas onduladas a ambos lados de la recta base.',
      `(x-1)**2*(x*x+y*y)-${b*b}*x*x`, 4.5, wolfram('ConchoidofNicomedes'), 'Variante', 'Concoide de Nicomedes');
  }
  for (const b of [0.35, 0.65, 1.25, 1.6, 2.2, 3]) {
    add(`pascal-${key(b)}`, `Limaçon de Pascal · a=${label(b)}`, 'Concoides',
      b < 1 ? 'Un caracol con lazo interior: una concoide del círculo.' : b < 2 ? 'Un óvalo con una hendidura que se suaviza al crecer a.' : 'Un óvalo convexo de la familia del caracol de Pascal.',
      `(x*x+y*y-x)**2-${b*b}*(x*x+y*y)`, b+1.4, wolfram('Limacon'), 'Variante', 'Limaçon de Pascal');
  }
  for (const b of [0.2, 0.5, 1.5, 2.5, 3, 3.8, 4.5]) {
    add(`kepler-${key(b)}`, `Hojas de Kepler · b=${label(b)}`, 'Folios y lazos',
      'El parámetro modifica las proporciones de las hojas de una misma cuártica.',
      `(x*x+y*y)*(x*(x+${b})+y*y)-4*x*y*y`, Math.max(2, b+0.5), wolfram('KeplersFolium'), 'Variante', 'Folium de Kepler');
  }
  for (const b of [0.35, 0.65, 0.9, 1.05, 1.2, 1.6, 2]) {
    add(`cassini-${key(b)}`, `Cassini · producto=${label(b*b)}`, 'Óvalos y multifocales',
      b < 1 ? 'Dos islas separadas por el origen: el producto de distancias es pequeño.' : 'Un solo óvalo: los dos componentes de Cassini ya se han unido.',
      `((x-1)**2+y*y)*((x+1)**2+y*y)-${b**4}`, Math.sqrt(1+b*b)+0.3, wolfram('CassiniOvals'), 'Variante', 'Cassini');
  }
  for (const b of [0.3, 0.7, 1.1, 1.7, 2.5, 4]) {
    add(`hippopede-${key(b)}`, `Hipopeda de Proclo · b=${label(b)}`, 'Folios y lazos',
      b < 1 ? 'Una sección esférica de contorno ovalado.' : 'La sección adquiere dos lóbulos y un cruce central.',
      `(x*x+y*y)**2-4*${b}*(x*x+y*y)+4*${b*b}*y*y`, Math.sqrt(4*b)+0.4, wolfram('Hippopede'), 'Variante', 'Hipopeda');
  }
  for (const m of [0.5, 0.75, 1.25, 1.5, 2, 3]) {
    add(`cartesian-${key(m)}`, `Óvalo de Descartes · peso=${label(m)}`, 'Óvalos y multifocales',
      'Un óvalo óptico: la suma ponderada de las distancias a dos focos es constante.',
      `hypot(x+0.8,y)+${m}*hypot(x-0.8,y)-${1.6*m+1.2}`, 3.5, macTutor('Cartesian'), 'Variante', 'Óvalo de Descartes');
  }
  // Product of distances to n roots of unity: |z^n-1| = level.
  for (let n = 3; n <= 12; n++) {
    for (const [level, shape] of [[0.55, 'islas'], [0.92, 'collar'], [1.08, 'estrella'], [1.65, 'óvalo']] as const) {
      add(`multifocal-${n}-${shape}`, `Cassini multifocal · ${n} focos · ${shape}`, 'Óvalos y multifocales',
        `Producto constante de distancias a ${n} focos situados en un polígono regular; nivel ${label(level)}.`,
        `r**${2*n}-2*r**${n}*cos(${n}*t)+1-${level*level}`, 1.5,
        'https://mathcurve.com/courbes2d/cassinienne/cassinienne.shtml', 'Variante', 'Cassini multifocal');
    }
  }
  // Genuine changes of exponent/aspect, not translations or recolourings.
  for (const p of [0.35, 0.5, 0.75, 1.25, 1.5, 2.5, 3, 5, 8, 12]) {
    for (const a of [1, 1.5, 2]) {
      add(`lame-${key(p)}-${key(a)}`, `Lamé · exponente ${label(p)} · ancho ${label(a)}`, 'Superelipses',
        p < 1 ? 'Cuatro puntas y lados hundidos; la concavidad crece al reducir el exponente.' : 'Del óvalo al rectángulo: el exponente regula cómo se redondean los lados.',
        `abs(x/${a})**${p}+abs(y)**${p}-1`, a+0.3, wolfram('Superellipse'), 'Variante', 'Superelipse de Lamé');
    }
  }
  for (const p of [0.5, 0.75, 1, 1.5, 2, 3, 4, 6]) {
    for (const q of [0.5, 0.75, 1, 1.5, 2, 3, 4, 6]) {
      if (p >= q) continue;
      add(`mixed-lame-${key(p)}-${key(q)}`, `Superelipse mixta · ${label(p)} / ${label(q)}`, 'Superelipses',
        'Los ejes tienen exponentes distintos: puntas, laterales planos y extremos redondos se combinan.',
        `abs(x)**${p}+abs(y)**${q}-1`, 1.3, wolfram('Superellipse'), 'Variante', 'Superelipse mixta');
    }
  }
  for (let n = 2; n <= 24; n++) {
    const petals = n % 2 ? n : 2*n;
    if (![2, 3, 4, 5, 6].includes(n)) {
      add(`rhodonea-${n}`, `Rodonea · ${petals} pétalos`, 'Rosáceas',
        `Rosa de Grandi de frecuencia ${n}; todos sus pétalos se reúnen en el origen.`,
        n % 2 ? `r-cos(${n}*t)` : `r-abs(cos(${n}*t))`, 1.2, wolfram('RoseCurve'), 'Variante', 'Rodonea');
    }
    for (const power of [0.5, 2, 4]) {
      add(`rose-power-${n}-${key(power)}`, `Rosa de ${2*n} hojas · perfil ${label(power)}`, 'Rosáceas',
        'Composición polar: el exponente abre o afila las hojas de una rosa de valor absoluto.',
        `r-abs(cos(${n}*t))**${power}`, 1.2, wolfram('RoseCurve'), 'Composición', 'Rosas de potencia');
    }
  }
  const profiles: [string, number, number, number][] = [
    ['pétalo', 0.35, 1.7, 1.7], ['estrella', 0.25, 0.7, 0.7],
    ['polígono', 8, 8, 8], ['trébol', 1, 3, 3], ['aguja', 0.18, 0.5, 0.5],
    ['almohadilla', 3, 2, 2], ['corola', 0.6, 4, 4], ['escudo', 1.5, 0.8, 0.8]
  ];
  for (const m of [3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]) {
    for (const [shape, n1, n2, n3] of profiles) {
      // n2=n3 makes the radius 2π-periodic even for odd m.
      add(`gielis-${m}-${shape.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`, `Gielis · ${m} sectores · ${shape}`, 'Superfórmula de Gielis',
        `Superfórmula con m=${m}, n₁=${label(n1)} y n₂=n₃=${label(n2)}: un contorno de simetría radial.`,
        `r-superformula(t,${m},${n1},${n2},${n3})`, shape === 'polígono' ? 1.6 : 1.35,
        wolfram('Superellipse'), 'Variante', 'Superfórmula de Gielis');
    }
  }
  const gcd = (a: number, b: number): number => b ? gcd(b, a%b) : a;
  for (let p = 2; p <= 12; p++) {
    for (let q = p+1; q <= 15; q++) {
      if (gcd(p,q) !== 1 || (p===3 && [4,5].includes(q)) || (p===5 && q===7)) continue;
      add(`chebyshev-${p}-${q}`, `Lazos de Chebyshev · ${p}:${q}`, 'Lazos polinómicos',
        `Una malla algebraica de frecuencias coprimas ${p} y ${q}, emparentada con las figuras de Lissajous.`,
        `chebyshevT(${p},x)-chebyshevT(${q},y)`, 1.08, macTutor('Lissajous'), 'Variante', 'Lazos de Chebyshev');
    }
  }
  for (let n = 3; n <= 10; n++) {
    for (const [family, fn] of [['Legendre','legendre'], ['Chebyshev U','chebyshevU'], ['Gegenbauer','gegenbauer']] as const) {
      add(`orthogonal-${fn}-${n}`, `Tapiz de ${family} · ${n}:${n+1}`, 'Lazos polinómicos',
        'Curva de igualdad de dos polinomios ortogonales de grados consecutivos.',
        `${fn}(${n},x)-${fn}(${n+1},y)`, 1.1, undefined, 'Composición', `Tapices de ${family}`);
    }
  }
  for (const n of [2,4,6]) {
    for (const m of [1,2,3,4,5]) {
      for (const p of [1,2,3,4,5]) {
        add(`sluze-${n}-${m}-${p}`, `Perla de Sluze · ${n}/${m}/${p}`, 'Perlas de Sluze',
          `Familia histórica yⁿ=k(1−x)ᵖxᵐ; n=${n}, m=${m}, p=${p}. El arco entre 0 y 1 está normalizado a altura 1.`,
          `y**${n}-${(m+p)**(m+p)/(m**m*p**p)}*x**${m}*(1-x)**${p}`, 1.3,
          macTutor('Pearls'), 'Variante', 'Perlas de Sluze', [-0.15,1.15,-1.2,1.2]);
      }
    }
  }
  for (const a of [-1.5,-0.5,0.5,1.5,2.5]) {
    for (const b of [-1,-0.3,0.3,1]) {
      add(`elliptic-${key(a).replace('-', 'n')}-${key(b).replace('-', 'n')}`, `Cúbica elíptica · a=${label(a)}, b=${label(b)}`, 'Cúbicas elípticas',
        'Una cúbica de Weierstrass: los parámetros cambian el número de componentes reales.',
        `y*y-(x**3+(${a})*x+(${b}))`, 3, wolfram('EllipticCurve'), 'Variante', 'Cúbicas de Weierstrass');
    }
  }
  for (const a of [-0.8,-0.5,0,0.5,1.5]) {
    for (const b of [-0.8,-0.3,0.3,0.8]) {
      add(`goursat-${key(a).replace('-', 'n')}-${key(b).replace('-', 'n')}`, `Cuártica de Goursat · a=${label(a)}, b=${label(b)}`, 'Cuárticas simétricas',
        'Una familia de simetría cuadrada que alterna óvalos, cruces e islas.',
        `x**4+y**4+(${a})*(x*x+y*y)**2+(${b})*(x*x+y*y)-1`, 2.5,
        'https://mathcurve.com/courbes2d/goursat/goursat.shtml', 'Variante', 'Cuárticas de Goursat');
    }
  }
  // Original artistic presets: explicitly marked as compositions.
  for (let n = 3; n <= 16; n++) {
    add(`lace-mandala-${n}`, `Encaje polar · ${n} radios`, 'Mandalas',
      'Composición de ondas radiales y angulares: pequeños lazos se ordenan en coronas.',
      `sin(8*r)*cos(${n}*t)-0.28`, 2.4, undefined, 'Composición', 'Encajes polares');
    add(`braided-mandala-${n}`, `Mandala trenzado · ${n} hebras`, 'Mandalas',
      'Dos fases polares contrapuestas producen una trama de rombos curvos.',
      `sin(6*r+${n}*t)*sin(6*r-${n}*t)-0.3`, 2.4, undefined, 'Composición', 'Mandalas trenzados');
    add(`petal-crown-${n}`, `Corona floral · ${n} lóbulos`, 'Flores',
      'Tres bordes florales anidados alternan sus valles y sus cimas.',
      `(r-0.45-0.1*cos(${n}*t))*(r-0.9-0.2*cos(${n}*t))*(r-1.35+0.18*cos(${n}*t))`, 1.8, undefined, 'Composición', 'Coronas florales');
    add(`spiral-lace-${n}`, `Remolino de encaje · ${n} brazos`, 'Espirales',
      'Familia de niveles de una fase espiral modulada con una onda angular.',
      `sin(5*r-${n}*t+0.65*sin(${2*n}*t))`, 3, undefined, 'Composición', 'Remolinos de encaje');
    const waves = Array.from({length:n}, (_, k) => {
      const angle = Math.PI*k/n;
      return `cos(4*(${Number(Math.cos(angle).toFixed(8))}*x+(${Number(Math.sin(angle).toFixed(8))})*y))`;
    }).join('+');
    add(`wave-crystal-${n}`, `Cristal de ondas · ${n} direcciones`, 'Interferencias',
      `Superposición de ${n} ondas planas equiespaciadas. Las curvas de nivel revelan su simetría.`,
      waves+'-0.5', 3, undefined, 'Composición', 'Cristales de ondas');
  }
  for (const frequency of [3,5,8]) {
    for (const n of [3,4,5,6,7,8,10,12]) {
      const sources = Array.from({length:n}, (_, k) => {
        const angle = 2*Math.PI*k/n;
        return `cos(${frequency}*hypot(x-(${Number(Math.cos(angle).toFixed(8))}),y-(${Number(Math.sin(angle).toFixed(8))})))`;
      }).join('+');
      add(`circular-sources-${n}-${frequency}`, `${n} emisores · frecuencia ${frequency}`, 'Interferencias',
        'Focos circulares en un polígono crean islas de interferencia y corredores ondulados.',
        sources, 3, undefined, 'Composición', 'Emisores circulares');
    }
  }
  for (const n of [3,4,5,6,8,10,12]) {
    for (const thickness of [0.12,0.3,0.55]) {
      add(`radial-bubbles-${n}-${key(thickness)}`, `Burbujas radiales · ${n} sectores · ${label(thickness)}`, 'Mandalas',
        'Una red de burbujas polares cambia de islas separadas a corredores conectados.',
        `sin(7*r)**2+sin(${n}*t)**2-${thickness}`, 2.5, undefined, 'Composición', 'Burbujas radiales');
    }
  }
  return curves;
}
