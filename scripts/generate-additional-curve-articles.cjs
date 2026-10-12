/* Authoring tool only: emits independent Angular components, never a shared article component. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const curves = [];
const W = page => `https://mathworld.wolfram.com/${page}.html`;
const M = page => `https://mathshistory.st-andrews.ac.uk/Curves/${page}/`;
let group;
function add(slug, title, type, equation, code, bounds, source, intro, properties, analysis, activity, answer, options = {}) {
  curves.push({ slug, title, group, type, equation, code, bounds, source, intro, properties, analysis, activity, answer,
    parameter: { label: 'Escala (p)', min: 0.5, max: 1.5, step: 0.05, value: 1 }, ranges: [[-Math.PI, Math.PI]], ...options });
}
function generate() {
  if (curves.length !== 100 || new Set(curves.map(c => c.slug)).size !== 100) throw Error(`Expected 100 distinct curves, received ${curves.length}`);
  const base = path.join(root, 'src/app/articles/curves');
  for (const c of curves) {
    c.className = c.slug.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join('') + (c.slug.endsWith('-curve') ? 'ArticleComponent' : 'CurveArticleComponent');
    const folder = path.join(base, `${c.slug}-article`);
    fs.mkdirSync(folder, { recursive: true });
    const file = `${c.slug}-article.component`;
    const implicit = c.type === 'implicit';
    const equation = c.equation + (implicit ? String.raw`\quad u=x/p,\ v=y/p,\ p>0` : '');
    const method = implicit
      ? `  evaluateImplicit(x: number, y: number): number {\n    const p = this.parameter, u = x / p, v = y / p;\n    ${c.code}\n  }`
      : `  point(t: number): [number, number] {\n    const p = this.parameter;\n    ${c.code}\n  }`;
    const draw = implicit
      ? `    this.curveGraph.functions = [new GraphableFunction((x: number, y: number) => this.evaluateImplicit(x, y), '#ef6b5b')];\n    this.curveGraph.drawGraph();`
      : `    this.curveGraph.clear();\n    this.curveGraph.drawAxes();\n    this.curveGraph.draw((ctx: CanvasRenderingContext2D) => {\n      ctx.beginPath();\n      ctx.strokeStyle = '#ef6b5b';\n      ctx.lineWidth = 2;\n      for (const [start, end] of this.ranges) {\n        let previous: { x: number; y: number } | null = null;\n        for (let i = 0; i <= 1600; i++) {\n          const t = start + (end - start) * i / 1600;\n          const [x, y] = this.point(t);\n          if (!Number.isFinite(x) || !Number.isFinite(y)) { previous = null; continue; }\n          const pixel = { x: this.curveGraph.xToPixel(x), y: this.curveGraph.yToPixel(y) };\n          const limit = this.curveGraph.canvas.nativeElement.width;\n          if (pixel.x < -limit || pixel.x > 2 * limit || pixel.y < -limit || pixel.y > 2 * limit) { previous = null; continue; }\n          if (!previous || Math.hypot(pixel.x - previous.x, pixel.y - previous.y) > limit / 4) ctx.moveTo(pixel.x, pixel.y);\n          else ctx.lineTo(pixel.x, pixel.y);\n          previous = pixel;\n        }\n      }\n      ctx.stroke();\n    });`;
    const ts = `import { AfterViewInit, Component, ViewChild } from '@angular/core';\nimport { FormsModule } from '@angular/forms';\nimport { RouterLink } from '@angular/router';\nimport { FormulaComponent } from 'src/app/shared/math/formula/formula.component';\nimport { ${implicit ? 'GraphableFunction, ' : ''}ImplicitCurveGraphComponent } from 'src/app/widgets/implicit-curve-graph/implicit-curve-graph.component';\n${c.imports || ''}\n@Component({\n  selector: 'app-${c.slug}-article',\n  standalone: true,\n  imports: [FormsModule, RouterLink, FormulaComponent, ImplicitCurveGraphComponent],\n  templateUrl: './${file}.html',\n  styleUrls: ['./${file}.css', '../curve-widget.css'],\n})\nexport class ${c.className} implements AfterViewInit {\n  static readonly title = ${JSON.stringify(c.title)};\n  static readonly route = ${JSON.stringify(c.slug)};\n  readonly title = ${c.className}.title;\n  readonly generalEquation = ${JSON.stringify(equation)};\n  readonly parameterDefinition = ${JSON.stringify(c.parameter)};\n  parameter = this.parameterDefinition.value;\n  readonly bounds: [number, number, number, number] = ${JSON.stringify(c.bounds)};\n${implicit ? '' : `  readonly ranges: [number, number][] = ${JSON.stringify(c.ranges)};\n`}  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;\n\n  ngAfterViewInit(): void { this.onDraw(); }\n\n  onParameterChanged(value: number): void {\n    if (value === null || !Number.isFinite(value)) return;\n    const { min, max, step } = this.parameterDefinition;\n    const bounded = Math.max(min, Math.min(max, value));\n    this.parameter = Number((min + Math.round((bounded - min) / step) * step).toPrecision(12));\n    this.onDraw();\n  }\n\n  reset(): void { this.parameter = this.parameterDefinition.value; this.onDraw(); }\n\n  getEquation(): string { return this.generalEquation + '\\\\quad p=' + this.parameter; }\n\n${method}\n${c.methods || ''}\n  onDraw(): void {\n    if (!this.curveGraph) return;\n    this.curveGraph.setBounds(...this.bounds);\n${draw}\n  }\n}\n`;
    const h = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const html = `<h2>${h(c.title)}</h2>\n<p class="dropcap">${h(c.intro)}</p>\n\n<h3>Definición y ecuación</h3>\n<app-formula [expression]="generalEquation"></app-formula>\n<p>${h(c.domain || (implicit ? 'La ecuación define el conjunto de puntos reales que anulan la expresión. Las coordenadas u y v corresponden a la curva de escala unidad; p dilata ambas coordenadas sin modificar su forma. El gráfico muestra una ventana finita del conjunto.' : 'La parametrización describe el recorrido al variar t. El explorador dibuja los intervalos indicados a continuación; los extremos abiertos y las ramas infinitas se representan mediante un tramo finito.'))}</p>\n${implicit ? '' : `<p class="curve-domain">Intervalos representados: ${h(c.ranges.map(([a,b]) => `[${Number(a.toFixed(3))}, ${Number(b.toFixed(3))}]`).join(' y '))}.</p>\n`}\n<h3>Propiedades geométricas</h3>\n<p>${h(c.properties)}</p>\n\n<h3>Análisis y construcción</h3>\n<p>${h(c.analysis)}</p>\n\n<div class="widget-container curve-widget">\n  <div class="widget-title">{{ title }}</div>\n  <p>${h(c.explorer || (implicit ? 'Cambia la escala y compara las intersecciones con los ejes. La forma se conserva, mientras que las distancias se multiplican por p. Puedes ampliar el gráfico desde sus controles para inspeccionar los puntos singulares.' : 'Modifica el parámetro y comprueba en el gráfico qué cambia en el recorrido. Utiliza los controles de la gráfica para explorar las tangentes y las intersecciones.'))}</p>\n  <div class="curve-parameters"><div class="curve-parameter">\n    <label for="${c.slug}-parameter">${h(c.parameter.label)}</label>\n    <input id="${c.slug}-parameter" type="number" [ngModel]="parameter" (ngModelChange)="onParameterChanged($event)" [min]="parameterDefinition.min" [max]="parameterDefinition.max" [step]="parameterDefinition.step" />\n    <input type="range" aria-label="${h(c.parameter.label)}" [ngModel]="parameter" (ngModelChange)="onParameterChanged($event)" [min]="parameterDefinition.min" [max]="parameterDefinition.max" [step]="parameterDefinition.step" />\n  </div></div>\n  <button type="button" class="curve-reset" (click)="reset()">Restablecer parámetros</button>\n  <div class="curve-current-equation"><p>Ecuación con el parámetro seleccionado</p><app-formula [expression]="getEquation()"></app-formula></div>\n  <app-implicit-curve-graph #curveGraph></app-implicit-curve-graph>\n</div>\n\n<div class="article-activities">\n  <h3>Practica y experimenta</h3>\n  <p>${h(c.activity)}</p>\n  <details><summary>Ver comprobación</summary><p>${h(c.answer)}</p></details>\n  <ul>\n    <li><a routerLink="/tools/${implicit ? 'implicit-curve-graph' : 'graph-plotter'}">${implicit ? 'Explorador de curvas implícitas' : 'Representador de funciones'}</a>. ${h(c.toolActivity || (implicit ? 'Introduce la ecuación de escala unidad y compara el resultado con el dibujo del artículo.' : 'Representa las funciones coordenadas por separado para estudiar sus ceros y sus extremos.'))}</li>\n    <li><a routerLink="/articles/${c.related || (implicit ? 'cissoid' : 'lissajous')}">${h(c.relatedTitle || (implicit ? 'Cisoide de Diocles' : 'Curva de Lissajous'))}</a>. ${h(c.relatedActivity || (implicit ? 'Compara sus ramas y distingue una cúspide de un cruce entre dos tangentes.' : 'Compara el periodo de las coordenadas y el cierre del recorrido.'))}</li>\n  </ul>\n</div>\n\n<h3>Referencias</h3>\n<p><a href="${h(c.source)}" target="_blank" rel="noopener noreferrer">${h(c.sourceTitle || (c.source.includes('math/0702005') ? 'Nie, Parrilo y Sturmfels: k-ellipse' : c.source.includes('cubic.org') ? 'Nils Pipenbrinck: Hermite Curve Interpolation' : c.source.includes('10.1147') ? 'Farouki y Sakkalis: Pythagorean hodographs' : c.source.includes('st-andrews') ? 'MacTutor · Universidad de St Andrews' : c.source.includes('nist') ? 'NIST · Digital Library of Mathematical Functions' : 'Wolfram MathWorld'))}</a>. ${h(c.referenceNote || 'Consulta la definición y las relaciones de esta curva. Las constantes del explorador fijan una configuración concreta de la familia.')}</p>\n`;
    fs.writeFileSync(path.join(folder, file + '.ts'), ts);
    fs.writeFileSync(path.join(folder, file + '.html'), html);
    fs.writeFileSync(path.join(folder, file + '.css'), ':host { display: block; min-width: 0; }\n.curve-domain { color: var(--ink-dim); font-size: 0.9rem; }\n.curve-reset { padding: 0.55rem 0.85rem; border: 1px solid var(--rule); border-radius: 6px; background: var(--bg); color: var(--ink); cursor: pointer; }\n.curve-reset:focus-visible, summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }\ndetails { margin: 1rem 0; padding: 0.8rem; border-left: 3px solid var(--accent); background: var(--bg2); }\nsummary { cursor: pointer; color: var(--accent); }\n');
  }
  console.log(`Generated ${curves.length} independent article components.`);
}

// Content and mathematical models below are authoring inputs, not runtime article data.
group = 'Cúbicas y curvas racionales';
add('descartes-folium', 'Folium de Descartes', 'implicit', String.raw`u^3+v^3=3uv`, 'return u ** 3 + v ** 3 - 3 * u * v;', [-4, 4, -4, 4], W('FoliumofDescartes'),
  'El folium de Descartes combina un lazo en el primer cuadrante con dos ramas abiertas. Es una cúbica que permite estudiar un punto doble sin confundirlo con una cúspide.',
  'El intercambio de las coordenadas conserva la ecuación: la diagonal es un eje de simetría. En el origen se cruzan dos ramas con tangentes distintas, los propios ejes coordenados.',
  'Tomando v=tu se obtiene u=3t/(1+t³) y v=3t²/(1+t³). El valor t=−1 queda excluido; al aproximarse a él aparece la asíntota u+v+1=0.',
  'Encuentra el punto del lazo donde las dos coordenadas son iguales y distintas de cero.',
  'Al sustituir u=v, resulta 2u³=3u². Además del origen, aparece (3/2,3/2); con escala p, el punto es (3p/2,3p/2).');
add('neile-semicubical', 'Parábola semicúbica de Neile', 'parametric', String.raw`x=pt^2,\quad y=pt^3`, 'return [p * t * t, p * t ** 3];', [-1, 5, -4, 4], M('Neiles'),
  'La parábola semicúbica abre dos brazos desde una cúspide. Su nombre alude a la relación entre una potencia cuadrada y una potencia cúbica; no es una parábola cónica.',
  'La curva queda en el semiplano x≥0 y es simétrica respecto del eje horizontal. En t=0 se anulan ambas derivadas, por lo que esa parametrización no es regular en la cúspide.',
  'Al eliminar t se obtiene y²=x³/p. Para t distinto de cero, la pendiente es 3t/2; al acercarse al origen tiende a cero por ambos lados, aunque las ramas comparten un mismo semieje tangente.',
  'Comprueba qué valores de t dan los puntos con x=p y explica su simetría.',
  't=1 y t=−1 producen (p,p) y (p,−p). La parametrización distingue las dos ramas aunque coincida su coordenada horizontal.', { ranges: [[-1.6, 1.6]] });
add('right-strophoid', 'Estrofoide recta', 'implicit', String.raw`v^2(1+u)=u^2(1-u)`, 'return v * v * (1 + u) - u * u * (1 - u);', [-3, 3, -3, 3], W('Strophoid'),
  'La estrofoide recta tiene un lazo y dos ramas no acotadas. Su construcción geométrica está asociada a una recta y a distancias medidas desde un punto fijo.',
  'La ecuación es par en v, de modo que el eje horizontal es una simetría. En el origen las tangentes son v=u y v=−u. La recta u=−1 es una asíntota vertical.',
  'Despejando v² se obtiene u²(1−u)/(1+u). Para que haya puntos reales se necesita −1<u≤1, además del origen. Cerca de u=0 el cociente tiende a uno y aparecen las dos tangentes.',
  'Localiza las intersecciones con el eje horizontal y la posición de la asíntota después de cambiar p.',
  'Las intersecciones son (0,0) y (p,0); la asíntota es x=−p. El lazo se sitúa entre esas dos intersecciones.');
add('maclaurin-trisectrix', 'Trisectriz de Maclaurin', 'implicit', String.raw`v^2(1+u)=u^2(3-u)`, 'return v * v * (1 + u) - u * u * (3 - u);', [-4, 4, -4, 4], M('Trisectrix'),
  'La trisectriz de Maclaurin es una cúbica con un lazo amplio y una rama abierta. Se estudia por su relación con construcciones que dividen un ángulo en tres partes.',
  'El eje horizontal refleja la curva en sí misma. El origen es un nodo, con tangentes v=±√3·u, y el lazo vuelve al eje en u=3. La asíntota vertical está en u=−1.',
  'La parte de menor grado de la ecuación cerca del origen es v²−3u². Factorizarla proporciona las dos direcciones tangentes. Despejar v² permite separar el tramo del lazo de las ramas infinitas.',
  'Compara la abertura de las tangentes del nodo con las de la estrofoide recta.',
  'Sus pendientes son ±√3, frente a ±1 en la estrofoide de escala unidad. Una dilatación uniforme no modifica esas pendientes.');
add('tschirnhausen-cubic', 'Cúbica de Tschirnhausen', 'parametric', String.raw`x=p(1-3t^2),\quad y=pt(3-t^2)`, 'return [p * (1 - 3 * t * t), p * t * (3 - t * t)];', [-10, 2, -6, 6], W('TschirnhausenCubic'),
  'La cúbica de Tschirnhausen, también llamada trisectriz de Catalan, posee un lazo y dos brazos que se alejan. Una parametrización polinómica evita denominadores y permite seguir todo el recorrido.',
  'Cambiar t por −t refleja el punto respecto del eje horizontal. Los valores t=±√3 llegan al mismo punto (−8p,0), formando un cruce. El punto t=0 es (p,0).',
  'Eliminar el parámetro conduce a 27py²=(p−x)(x+8p)². El factor cuadrado en x+8p anuncia el nodo. Derivar las coordenadas muestra que sus dos velocidades no son paralelas allí.',
  'Calcula las pendientes en los dos pasos por el punto doble.',
  'x′=−6pt e y′=p(3−3t²). Para t=±√3, las pendientes son ±1/√3; cada valor recorre una rama diferente.', { ranges: [[-2.1, 2.1]] });
add('newton-serpentine', 'Serpentina de Newton', 'implicit', String.raw`v(1+u^2)=2u`, 'return v * (1 + u * u) - 2 * u;', [-4, 4, -2, 2], W('SerpentineCurve'),
  'La serpentina de Newton es una onda racional con una elevación positiva y otra negativa. Sus colas se acercan al eje horizontal sin presentar polos reales.',
  'La función v=2u/(1+u²) es impar y tiene simetría central. Sus extremos están en u=±1, con valores v=±1. La asíntota horizontal es v=0.',
  'La derivada es 2(1−u²)/(1+u²)². El denominador siempre es positivo: el signo depende solamente de si |u| es menor o mayor que uno. Esta separación hace sencillo su estudio de crecimiento.',
  'Comprueba si un mismo valor positivo de v puede corresponder a dos coordenadas horizontales.',
  'Sí: para 0<v<1, la ecuación vu²−2u+v=0 tiene dos raíces positivas. Su producto es uno, de modo que son recíprocas.');
add('newton-trident', 'Tridente de Newton', 'implicit', String.raw`uv=u^3-2u^2+1`, 'return u * v - u ** 3 + 2 * u * u - 1;', [-4, 4, -4, 6], M('Trident'),
  'El tridente de Newton es una cúbica que puede escribirse como una función racional. La presencia de un término inverso crea dos ramas separadas por una asíntota vertical.',
  'Para u distinto de cero, v=u²−2u+1/u. El origen no pertenece a la curva: sustituir u=0 contradice la ecuación. Cerca del eje vertical las ramas se alejan en sentidos opuestos.',
  'La diferencia entre v y la parábola u²−2u es 1/u, que tiende a cero en ambos extremos. Por tanto, la curva tiene una asíntota parabólica y no una recta oblicua.',
  'Evalúa la curva en u=1 y calcula su pendiente en ese punto.',
  'v(1)=0. La derivada 2u−2−1/u² vale −1 en u=1. La escala uniforme conserva esa pendiente.');
add('sluze-conchoid', 'Concoide de Sluze', 'implicit', String.raw`(u+1)(u^2+v^2)=5u^2`, 'return (u + 1) * (u * u + v * v) - 5 * u * u;', [-2, 4, -3, 3], M('Conchoidsl'),
  'La concoide de Sluze pertenece a una familia de cúbicas obtenidas mediante construcciones radiales. Esta configuración presenta un lazo y dos ramas abiertas simétricas.',
  'La ecuación es invariante al cambiar el signo de v. El lazo corta el eje horizontal en el origen y en u=4. La recta u=−1 es una asíntota de las ramas abiertas.',
  'Aislando v² se llega a u²(3−u)/(1+u). Para u=0 el primer término de la ecuación local es v²−3u², lo que permite encontrar las dos tangentes del nodo.',
  'Busca todos los puntos de la curva que cumplen u=1.',
  'Al sustituir u=1, 2(1+v²)=4. Por tanto v=±1, y los puntos físicos son (p,p) y (p,−p).');
add('newton-divergent-parabola', 'Parábolas divergentes de Newton', 'implicit', String.raw`v^2=u^3-u+1`, 'return v * v - u ** 3 + u - 1;', [-2, 3, -4, 4], M('Newtons'),
  'Newton clasificó curvas cúbicas con formas que llamó parábolas divergentes. El modelo de este artículo representa una cúbica suave cuya coordenada vertical aparece al cuadrado.',
  'La reflexión respecto del eje horizontal preserva la curva. El número de componentes reales depende de las raíces del polinomio cúbico. Este ejemplo tiene una única raíz real y una rama conectada.',
  'Un punto singular necesitaría simultáneamente v=0, 3u²−1=0 y u³−u+1=0. Esas condiciones no coinciden aquí. El criterio general para v²=u³+Au+B es que 4A³+27B² no sea cero.',
  'Encuentra los dos puntos situados sobre el eje vertical y comprueba si son singulares.',
  'En u=0 se obtiene v=±1. La derivada parcial respecto de v es 2v y no se anula: ambos puntos son regulares.');

group = 'Cuárticas históricas';
add('sylvester-bicorn', 'Bicorne de Sylvester', 'implicit', String.raw`v^2(1-u^2)=(u^2+2v-1)^2`, 'return v * v * (1 - u * u) - (u * u + 2 * v - 1) ** 2;', [-1.5, 1.5, -0.4, 1.4], W('Bicorn'),
  'El bicorne de Sylvester es una cuártica que recuerda al perfil de un sombrero de dos puntas. Sus dos extremos singulares ofrecen un ejemplo visual de cúspides en una curva cerrada.',
  'La curva es simétrica respecto del eje vertical. Si |u|>1, el miembro izquierdo es negativo salvo casos imposibles para la igualdad: el contorno queda contenido entre u=−1 y u=1.',
  'Sobre el eje vertical la ecuación se reduce a v²=(2v−1)², con soluciones v=1 y v=1/3. Sobre el eje horizontal aparecen u=±1, las dos puntas de la silueta.',
  'Calcula la separación vertical entre las dos intersecciones con el eje de simetría.',
  'En escala unidad la separación es 1−1/3=2/3. Con escala p se convierte en 2p/3.');
add('algebraic-bean', 'Curva de la judía', 'implicit', String.raw`u^4+u^2v^2+v^4=u(u^2+v^2)`, 'return u ** 4 + u * u * v * v + v ** 4 - u * (u * u + v * v);', [-0.3, 1.4, -0.9, 0.9], W('BeanCurve'),
  'La curva de la judía es un contorno algebraico de cuarto grado con una hendidura. Su ecuación mezcla una parte cuártica positiva con un término cúbico orientado hacia la derecha.',
  'La reflexión v→−v conserva la curva. No hay puntos no nulos con u<0: el miembro derecho sería negativo y el izquierdo positivo. El contorno se concentra en el semiplano derecho.',
  'Para estudiar los puntos del eje horizontal se sustituye v=0: queda u³(u−1)=0. En coordenadas polares, la ecuación permite despejar el radio cuando se fija una dirección.',
  'Justifica por qué la curva no puede cruzar el eje vertical fuera del origen.',
  'Si u=0, la ecuación exige v⁴=0; necesariamente v=0. El eje vertical solo toca la curva en el origen.');
add('longchamps-piriform', 'Piriforme de Longchamps', 'implicit', String.raw`v^2=u^3(2-u)`, 'return v * v - u ** 3 * (2 - u);', [-0.3, 2.5, -1.6, 1.6], W('PiriformCurve'),
  'La piriforme de Longchamps es una cuártica con forma de pera. En un extremo presenta una cúspide y en el otro un borde redondeado.',
  'El dominio horizontal real es 0≤u≤2. La curva es simétrica respecto del eje horizontal y pasa por (0,0) y (2,0). Cerca del origen, v² se comporta como 2u³.',
  'La altura al cuadrado es f(u)=2u³−u⁴. Derivando se obtiene f′(u)=2u²(3−2u): su máximo interior se alcanza en u=3/2. Esa abscisa determina la parte más ancha de la pera.',
  'Encuentra la altura máxima de la mitad superior en escala unidad.',
  'Para u=3/2, v²=27/16 y v=3√3/4. La mitad inferior tiene el valor opuesto.');
add('devils-curve', 'Curva del diablo', 'implicit', String.raw`v^2(v^2-1)=u^2(u^2-0.64)`, 'return v * v * (v * v - 1) - u * u * (u * u - 0.64);', [-2.4, 2.4, -2.4, 2.4], W('DevilsCurve'),
  'La curva del diablo combina un lazo central con ramas abiertas. Su nombre describe una silueta de diábolo, mientras que su estructura procede de una igualdad entre dos polinomios pares.',
  'Los dos ejes coordenados son ejes de simetría. Cerca del origen, los términos dominantes dan v²=0.64u²: las tangentes tienen pendientes ±0.8. Las ramas lejanas se orientan hacia las diagonales.',
  'Escribir U=u² y V=v² transforma la ecuación en V²−V=U²−0.64U. Esta sustitución reduce el problema a una relación cuadrática, aunque después deben conservarse las raíces no negativas.',
  'Determina todas las intersecciones con los ejes.',
  'En el eje horizontal aparecen u=0 y u=±0.8. En el eje vertical aparecen v=0 y v=±1; el origen se cuenta una sola vez.');
add('gutschoven-kappa', 'Curva kappa de Gutschoven', 'implicit', String.raw`v^2(u^2+v^2)=u^2`, 'return v * v * (u * u + v * v) - u * u;', [-4, 4, -1.5, 1.5], W('KappaCurve'),
  'La curva kappa de Gutschoven es una cuártica con ramas que se acercan a dos rectas horizontales. Su contorno recuerda a la letra griega que le da nombre.',
  'La ecuación es par en ambas coordenadas. Despejar u² muestra que u²=v⁴/(1−v²), por lo que los puntos no nulos satisfacen |v|<1. Las asíntotas son v=±1.',
  'Cerca del origen se cumple aproximadamente u²=v⁴. Las dos ramas comparten la tangente vertical, aunque no forman un cruce transversal. La parametrización local distingue los signos de u.',
  'Calcula |u| cuando v=1/√2.',
  'v⁴=1/4 y 1−v²=1/2. Así, u²=1/2 y |u|=1/√2.');
add('eudoxus-kampyle', 'Campila de Eudoxo', 'implicit', String.raw`u^4=u^2+v^2`, 'return u ** 4 - u * u - v * v;', [-2.4, 2.4, -4, 4], W('KampyleofEudoxus'),
  'La campila de Eudoxo tiene dos ramas separadas y, en esta forma algebraica, un punto aislado en el origen. El análisis del dominio es esencial para interpretar correctamente su dibujo.',
  'La ecuación v²=u²(u²−1) exige |u|≥1 para los puntos de las ramas. El origen también la satisface, pero ningún punto no nulo de la curva se aproxima a él.',
  'Las ramas pueden parametrizarse con u=±sec t y v=sec t·tan t. El punto aislado no se obtiene mediante esa parametrización. Un trazador de contornos puede omitirlo porque allí no cambia el signo de la expresión.',
  'Explica por qué (0,0) es un punto aislado y encuentra los vértices de las ramas.',
  'Para 0<|u|<1, v² sería negativo. Las ramas comienzan en (±1,0). El origen debe comprobarse por sustitución, aunque no aparezca como contorno continuo.');
add('bullet-nose-curve', 'Curva nariz de bala', 'implicit', String.raw`v^2-u^2-u^2v^2=0`, 'return v * v - u * u - u * u * v * v;', [-1.4, 1.4, -4, 4], W('BulletNose'),
  'La curva nariz de bala es una cuártica cuyas ramas quedan entre dos asíntotas verticales. Su nodo central permite observar cómo una curva puede ser acotada en una coordenada e infinita en la otra.',
  'Al despejar v² se obtiene u²/(1−u²), por lo que −1<u<1. Tiene simetría respecto de ambos ejes y dos tangentes diagonales en el origen.',
  'La parametrización u=sin t, v=tan t satisface la ecuación. Cuando t se acerca a ±π/2, la coordenada horizontal tiende a ±1 y la vertical diverge; esto explica las dos asíntotas.',
  'Obtén la altura de las ramas para u=1/2.',
  'v²=(1/4)/(3/4)=1/3. Por tanto, v=±1/√3 y las coordenadas del gráfico se multiplican por p.');
add('proclus-hippopede', 'Hipopeda de Proclo', 'implicit', String.raw`(u^2+v^2)^2=6(u^2+v^2)-9v^2`, 'return (u * u + v * v) ** 2 - 6 * (u * u + v * v) + 9 * v * v;', [-3, 3, -2, 2], W('Hippopede'),
  'La hipopeda de Proclo es una familia de cuárticas conocida por su forma de lazo o de óvalo. Este ejemplo representa el régimen de dos lóbulos que se encuentran en el origen.',
  'Su ecuación polar es r²=6−9sin²θ. Solo hay puntos reales en direcciones donde el miembro derecho es no negativo. Ambas reflexiones coordenadas son simetrías.',
  'El término de menor grado en el origen es −6u²+3v², que da tangentes v=±√2·u. Sobre el eje horizontal el radio máximo es √6; no se trata de la lemniscata de Bernoulli.',
  'Determina las direcciones límite de los lóbulos usando la ecuación polar.',
  'Se necesita sin²θ≤2/3. En las direcciones límite el radio es cero: los lóbulos llegan al nodo central.');
add('ampersand-curve', 'Curva ampersand', 'implicit', String.raw`(v^2-u^2)(u-1)(2u-3)=4(u^2+v^2-2u)^2`, 'return (v * v - u * u) * (u - 1) * (2 * u - 3) - 4 * (u * u + v * v - 2 * u) ** 2;', [-0.6, 2.5, -1.8, 1.8], W('AmpersandCurve'),
  'La curva ampersand es una cuártica que evoca el signo tipográfico & mediante varios cruces. La figura muestra que una ecuación polinómica relativamente corta puede producir un contorno complejo.',
  'La coordenada vertical solo aparece al cuadrado, de modo que el eje horizontal es una simetría exacta. Los puntos del dibujo no forman necesariamente la gráfica de una función de u.',
  'Para encontrar tangentes en un punto regular se deriva implícitamente F(u,v)=0. En un cruce, ambas derivadas parciales pueden anularse y es necesario estudiar los primeros términos no nulos de F.',
  'Comprueba si el punto (1,1) pertenece a la curva y encuentra los puntos con u=1.',
  'Con u=1, el miembro izquierdo se anula y se exige (v²−1)²=0. Los puntos son (1,1) y (1,−1).');
add('bow-curve', 'Cuártica del arco', 'implicit', String.raw`u^4=u^2v-v^3`, 'return u ** 4 - u * u * v + v ** 3;', [-0.7, 0.7, -0.5, 0.5], W('Bow'),
  'La cuártica del arco dibuja dos pequeños lazos que se unen en un punto singular. A diferencia de los infinitos clásicos, su ecuación no es simétrica respecto del eje horizontal.',
  'El cambio u→−u conserva la curva. Cerca del origen el término cúbico es v(v²−u²), que proporciona tres direcciones tangentes posibles: el eje horizontal y las dos diagonales.',
  'La sustitución v=tu permite extraer el factor u³. Para los puntos no nulos se obtiene u=t−t³ y v=t²−t⁴, una parametrización polinómica que ayuda a seguir los lazos.',
  'Usa t=1/2 en la parametrización y verifica la ecuación implícita.',
  'Se obtiene u=3/8 y v=3/16. Sustituir ambas fracciones confirma u⁴=u²v−v³.');

group = 'Séxticas y construcciones algebraicas';
add('cayley-sextic', 'Séxtica de Cayley', 'parametric', String.raw`r=4p\cos^3(t/3),\quad x=r\cos t,\ y=r\sin t`, 'const r = 4 * p * Math.cos(t / 3) ** 3; return [r * Math.cos(t), r * Math.sin(t)];', [-1.5, 5, -3.5, 3.5], W('CayleysSextic'),
  'La séxtica de Cayley une un contorno exterior con un lazo interior muy pequeño. La expresión polar usa un ángulo dividido por tres, por lo que una vuelta angular ordinaria no describe toda la curva.',
  'Una parametrización completa se obtiene dejando variar t entre 0 y 3π. Los valores de radio negativos se interpretan como puntos en la dirección opuesta, no se eliminan del recorrido.',
  'En t=3π/2, el coseno de t/3 se anula: la curva llega al origen. En t=0 y t=3π se obtiene el mismo punto (4p,0), lo que permite cerrar el recorrido completo.',
  'Comprueba que los extremos del intervalo dan el mismo punto aunque el radio cambie de signo.',
  'Para t=0, r=4p. Para t=3π, r=−4p y cos(3π)=−1, por lo que x vuelve a ser 4p e y=0.', { ranges: [[0, 3 * Math.PI]] });
add('dumbbell-curve', 'Curva de la mancuerna', 'implicit', String.raw`v^2=u^4(1-u^2)`, 'return v * v - u ** 4 * (1 - u * u);', [-1.4, 1.4, -0.8, 0.8], W('DumbbellCurve'),
  'La curva de la mancuerna tiene dos lóbulos que se tocan en una cintura central. Su ecuación de grado seis crea un contacto tangente en lugar del cruce transversal de una lemniscata ordinaria.',
  'El dominio horizontal es −1≤u≤1. Ambas reflexiones coordenadas preservan el dibujo. Cerca del origen, v≈±u²: las dos ramas tienen la misma tangente horizontal.',
  'La altura al cuadrado es f(u)=u⁴−u⁶. Sus extremos no nulos satisfacen 4u³−6u⁵=0, es decir u²=2/3. La altura máxima es 2/(3√3).',
  'Explica por qué el origen no tiene tangentes diagonales como la lemniscata de Bernoulli.',
  'El término dominante es v²−u⁴. Así, v/u tiende a cero al acercarse al origen: ambas tangentes son horizontales.');
add('algebraic-butterfly', 'Mariposa algebraica', 'implicit', String.raw`u^6+v^6=u^2`, 'return u ** 6 + v ** 6 - u * u;', [-1.4, 1.4, -1.2, 1.2], W('ButterflyCurve'),
  'La mariposa algebraica forma dos alas mediante una ecuación de sexto grado. Es un objeto diferente de la mariposa trascendente de Fay, cuyo radio utiliza exponenciales y funciones trigonométricas.',
  'La curva es simétrica respecto de ambos ejes y cumple |u|≤1. Cerca del origen, u²≈v⁶, por lo que las alas llegan con tangente vertical compartida.',
  'Despejar v⁶=u²(1−u⁴) permite conocer el dominio sin trazar el gráfico. Para hallar la mayor altura se maximiza la expresión de la derecha como función de u.',
  'Encuentra las intersecciones con el eje horizontal y decide si hay puntos no nulos en el eje vertical.',
  'En v=0, u²(u⁴−1)=0 y aparecen u=0,±1. En u=0 necesariamente v=0.');
add('algebraic-heart', 'Corazón algebraico', 'implicit', String.raw`(u^2+v^2-1)^3=u^2v^3`, 'return (u * u + v * v - 1) ** 3 - u * u * v ** 3;', [-1.6, 1.6, -1.5, 1.7], W('HeartCurve'),
  'El corazón algebraico es un contorno de grado seis que usa un término cúbico vertical para romper la simetría entre arriba y abajo. Su silueta resulta reconocible sin recurrir a segmentos unidos a mano.',
  'El eje vertical es una simetría. La ecuación contiene los puntos (±1,0) y (0,±1). La parte superior y la inferior tienen comportamientos locales diferentes pese a compartir ese eje.',
  'Al tomar raíces cúbicas reales se obtiene u²+v²−1=|u|^(2/3)v. Esta forma facilita analizar la curva, pero el valor absoluto es imprescindible: u² no permite elegir libremente un signo.',
  'Verifica las cuatro intersecciones con los ejes y explica la simetría izquierda-derecha.',
  'Con u=0 resulta (v²−1)³=0; con v=0, (u²−1)³=0. Cambiar u por −u no altera ningún término.');
add('watt-linkage-curve', 'Curva del mecanismo de Watt', 'implicit', String.raw`[R(R-1.25)+v^2-u^2]^2=4v^2(R-u^2),\quad R=u^2+v^2`, 'const r = u * u + v * v; return (r * (r - 1.25) + v * v - u * u) ** 2 - 4 * v * v * (r - u * u);', [-2.5, 2.5, -2.5, 2.5], W('WattsCurve'),
  'La curva de Watt describe el movimiento del punto medio de una biela en un mecanismo articulado. Su interés práctico reside en que ciertos tramos se aproximan a una línea recta.',
  'La ecuación utilizada corresponde a una separación de pivotes 2, brazos de radio 1.5 y semibiela 1, en unidades normalizadas. Es simétrica respecto de ambos ejes y puede contener contactos entre ramas.',
  'La forma polar general contiene una raíz cuadrada y dos signos de ensamblaje. Al eliminar las raíces se obtiene una ecuación algebraica; para un mecanismo físico concreto hay que seleccionar además el modo de ensamblaje.',
  'Encuentra los puntos del conjunto algebraico situados en el eje horizontal.',
  'Con v=0 queda [u²(u²−2.25)]²=0. Las soluciones son u=0 y u=±1.5. El contorno algebraico reúne los modos de ensamblaje.', { domain: 'El gráfico representa el conjunto algebraico del mecanismo con a=c=1 y b=1.5. Una rama mecánica concreta exige fijar cómo se articulan las barras; la escala p multiplica todas las longitudes.' });
add('cornoid-curve', 'Cornoide', 'parametric', String.raw`x=p\cos t(1-2\sin^2t),\quad y=p\sin t(1+2\cos^2t)`, 'return [p * Math.cos(t) * (1 - 2 * Math.sin(t) ** 2), p * Math.sin(t) * (1 + 2 * Math.cos(t) ** 2)];', [-1.5, 1.5, -2, 2], W('Cornoid'),
  'La cornoide es una séxtica que puede representarse con productos trigonométricos sencillos. Su recorrido forma pequeños lazos y un contorno exterior simétrico.',
  'El cambio t→−t conserva x y cambia el signo de y; t→π−t cambia el signo de x. Ambas reflexiones son, por tanto, simetrías. Un periodo de 2π describe el recorrido.',
  'La coordenada horizontal puede escribirse como p cos t cos(2t). Sus ceros incluyen t=π/2 y t=π/4, pero las correspondientes coordenadas verticales son distintas: varios puntos del recorrido comparten el eje vertical.',
  'Compara los puntos obtenidos con t=π/2 y t=π/4.',
  'El primero es (0,p). El segundo es (0,√2·p), de modo que el eje vertical corta distintas partes del contorno.', { ranges: [[0, 2 * Math.PI]] });
add('durer-conchoid', 'Concoide de Dürer', 'implicit', String.raw`(u^2+uv+u-4)^2=(4-u^2)(u-v+1)^2`, 'return (u * u + u * v + u - 4) ** 2 - (4 - u * u) * (u - v + 1) ** 2;', [-3, 3, -5, 5], M('Durers'),
  'La concoide de Dürer procede de una construcción geométrica ligada al trabajo de Albrecht Dürer. Su expresión implícita permite estudiar la figura sin reproducir cada paso de regla y compás.',
  'En esta configuración la ecuación es de grado cuatro y no presenta las simetrías coordenadas de una cónica centrada. El factor 4−u² impone restricciones fuertes al dominio horizontal.',
  'Si |u|>2, el miembro derecho no es positivo. Para que la igualdad se cumpla ambos cuadrados deberían anularse, condiciones incompatibles en ese intervalo. Las ramas quedan entre las rectas u=±2.',
  'Calcula las intersecciones de la curva con el eje vertical.',
  'Con u=0, 16=4(1−v)². Resulta v=−1 o v=3, dos alturas distintas y no simétricas.');
add('sluze-pearls', 'Perlas de Sluze', 'implicit', String.raw`v^2=u^3(1-u)^2`, 'return v * v - u ** 3 * (1 - u) ** 2;', [-0.3, 2.4, -2, 2], M('Pearls'),
  'Las perlas de Sluze son curvas algebraicas construidas con productos de potencias. El ejemplo elegido posee un pequeño lóbulo cerrado y ramas que continúan después de un punto doble.',
  'La ecuación exige u≥0. Cerca de u=0 presenta comportamiento semicúbico; cerca de u=1, v²≈(u−1)², lo que produce dos tangentes distintas.',
  'En 0≤u≤1 las ramas v=±u^(3/2)(1−u) cierran un lóbulo. Maximizar la altura de ese tramo equivale a derivar u^(3/2)(1−u), cuyo máximo interior está en u=3/5.',
  'Distingue los tipos de singularidad en (0,0) y (1,0).',
  'En el origen las dos ramas comparten la tangente horizontal; en (1,0) las pendientes límite son ±1. El primer punto es una cúspide y el segundo un nodo.', { referenceNote: 'La referencia describe la familia de productos de potencias. Aquí se fija la configuración v²=u³(1−u)² para comparar sus dos singularidades.' });

group = 'Distancias, óvalos y contornos';
add('circle-curve', 'Circunferencia', 'implicit', String.raw`u^2+v^2=1`, 'return u * u + v * v - 1;', [-2, 2, -2, 2], W('Circle'),
  'La circunferencia es el lugar geométrico de los puntos que están a una distancia fija de un centro. Es una curva plana; el círculo designa también la región interior que delimita.',
  'Todas las rotaciones alrededor del centro conservan la curva. Su curvatura es constante e igual al inverso del radio. Cada punto tiene una tangente perpendicular al segmento que lo une al centro.',
  'La parametrización x=p cos t, y=p sin t satisface x²+y²=p² gracias a la identidad trigonométrica fundamental. La velocidad tiene módulo p si t varía a velocidad unidad.',
  'Calcula la longitud y el área encerrada cuando p=1.5.',
  'La longitud es 2πp=3π y el área es πp²=2.25π. La escala multiplica longitudes por p y áreas por p².');
add('cartesian-oval', 'Óvalo cartesiano de Descartes', 'implicit', String.raw`\sqrt{(u+1)^2+v^2}+2\sqrt{(u-1)^2+v^2}=4`, 'return Math.hypot(u + 1, v) + 2 * Math.hypot(u - 1, v) - 4;', [-2.5, 2.5, -2.5, 2.5], W('CartesianOvals'),
  'Un óvalo cartesiano fija una suma ponderada de distancias a dos focos. Su relación con la refracción permite diseñar superficies que conducen rayos entre puntos determinados.',
  'Los focos de este ejemplo son (−1,0) y (1,0), con pesos uno y dos. La reflexión horizontal preserva la curva, pero intercambiar los focos no conserva los pesos.',
  'La ecuación se puede convertir en una cuártica elevando al cuadrado dos veces. Ese procedimiento puede introducir soluciones ajenas a la ecuación de distancias; el explorador evalúa directamente las raíces originales.',
  'Encuentra las intersecciones del óvalo con el eje horizontal usando valores absolutos.',
  'Resolver |u+1|+2|u−1|=4 da u=−1 y u=5/3. Son los extremos horizontales de esta configuración.');
add('perseus-spiric', 'Secciones espíricas de Perseo', 'implicit', String.raw`(u^2+v^2+3+c^2)^2=16(u^2+c^2),\quad c=1.5`, 'return (u * u + v * v + 5.25) ** 2 - 16 * (u * u + 2.25);', [-3.5, 3.5, -2, 2], W('SpiricSection'),
  'Las secciones espíricas aparecen al cortar un toro con un plano en una orientación determinada. Amplían la idea de sección cónica a una superficie con forma de anillo.',
  'El modelo fija radio mayor 2, radio del tubo 1 y distancia del plano de corte 1.5. La ecuación es par en ambas coordenadas y sus componentes cambian al desplazar el plano.',
  'La ecuación sin elevar al cuadrado es (2−√(u²+c²))²+v²=1. Como el término que se eleva al cuadrado es positivo en este ejemplo, la ecuación polinómica mantiene la sección real correcta.',
  'Decide si el eje vertical corta esta sección y calcula sus alturas.',
  'Con u=0, la ecuación original queda (2−1.5)²+v²=1. Por tanto v=±√3/2.');
add('reuleaux-triangle-curve', 'Curva del triángulo de Reuleaux', 'implicit', String.raw`\max\{d_1,d_2,d_3\}=\sqrt3`, 'return Math.max(Math.hypot(u, v - 1), Math.hypot(u - Math.sqrt(3) / 2, v + 0.5), Math.hypot(u + Math.sqrt(3) / 2, v + 0.5)) - Math.sqrt(3);', [-1.7, 1.7, -1.7, 1.7], W('ReuleauxTriangle'),
  'El contorno del triángulo de Reuleaux está formado por tres arcos circulares. Es un ejemplo de anchura constante que no es una circunferencia.',
  'Los centros de los arcos son los vértices de un triángulo equilátero de lado √3. El conjunto interior es la intersección de tres discos; por eso el máximo de las tres distancias caracteriza su frontera.',
  'Cada arco tiene radio igual al lado del triángulo. Dos rectas paralelas de apoyo mantienen la misma separación al girar. Los vértices son esquinas, de modo que la curva no es suave en todo su recorrido.',
  'Calcula la longitud total del contorno y compárala con la de una circunferencia de la misma anchura.',
  'Los tres arcos tienen ángulo π/3. La longitud total es π√3 en escala unidad; una circunferencia de diámetro √3 tiene la misma longitud.', { domain: 'd₁, d₂ y d₃ son las distancias a (0,1), (√3/2,−1/2) y (−√3/2,−1/2), respectivamente. Las coordenadas se normalizan con u=x/p y v=y/p.' });
add('stadium-curve', 'Curva del estadio', 'implicit', String.raw`\sqrt{\max(|u|-1,0)^2+v^2}=0.6`, 'return Math.hypot(Math.max(Math.abs(u) - 1, 0), v) - 0.6;', [-2.2, 2.2, -1.2, 1.2], W('Stadium'),
  'La curva del estadio une dos segmentos paralelos con dos semicírculos. Puede entenderse como el contorno de los puntos situados a una distancia fija de un segmento.',
  'El segmento central va de (−1,0) a (1,0); el radio de redondeo es 0.6. Las uniones tienen tangente continua, pero la curvatura cambia de cero en los segmentos a 1/0.6 en los arcos.',
  'La distancia a un segmento horizontal se obtiene anulando la parte horizontal cuando |u|≤1. Fuera de ese intervalo se mide la distancia al extremo más cercano, lo que explica el máximo de la ecuación.',
  'Calcula el perímetro y el área del estadio de escala unidad.',
  'El perímetro es 4+1.2π. El área es la del rectángulo 2×1.2 más la de un círculo de radio 0.6: 2.4+0.36π.');
add('lame-superellipse', 'Superelipse de Lamé', 'parametric', String.raw`x=2\operatorname{sgn}(\cos t)|\cos t|^{2/p},\quad y=\operatorname{sgn}(\sin t)|\sin t|^{2/p}`, 'const c = Math.cos(t), s = Math.sin(t); return [2 * Math.sign(c) * Math.abs(c) ** (2 / p), Math.sign(s) * Math.abs(s) ** (2 / p)];', [-2.7, 2.7, -1.7, 1.7], W('Superellipse'),
  'La superelipse de Lamé generaliza la elipse mediante un exponente. A medida que ese exponente aumenta, los lados se aplanan y la figura se aproxima a un rectángulo.',
  'El modelo cumple |x/2|^p+|y|^p=1. Para p=2 es una elipse; para p=1 es un rombo. Si p>1, la curva es convexa y conserva las reflexiones respecto de ambos ejes.',
  'Elevar las coordenadas normalizadas a la potencia p deja cos²t y sin²t. Su suma es uno, lo que verifica exactamente la parametrización y explica por qué deben conservarse los signos.',
  'Compara el punto del primer cuadrante correspondiente a t=π/4 para p=2 y p=4.',
  'Para p=2 es (√2,1/√2). Para p=4 es (2·2^(−1/4),2^(−1/4)); se acerca a la esquina del rectángulo.', { parameter: { label: 'Exponente (p)', min: 1, max: 8, step: 0.1, value: 4 }, ranges: [[0, 2 * Math.PI]], explorer: 'Cambia el exponente entre el rombo, la elipse y los contornos rectangulares redondeados. Los semiejes permanecen fijos.' });
add('fernandez-guasti-squircle', 'Squircle de Fernández-Guasti', 'implicit', String.raw`u^2+v^2-0.8u^2v^2=1,\quad |u|,|v|\le1`, 'if (Math.abs(u) > 1 || Math.abs(v) > 1) return NaN; return u * u + v * v - 0.8 * u * u * v * v - 1;', [-1.5, 1.5, -1.5, 1.5], W('Squircle'),
  'El squircle de Fernández-Guasti es una interpolación algebraica entre la circunferencia y el cuadrado. Es diferente de la superelipse: utiliza un producto de cuadrados en lugar de una suma de potencias.',
  'La ecuación general es u²+v²−s²u²v²=1; aquí s²=0.8. Se selecciona el contorno central dentro del cuadrado |u|≤1, |v|≤1, excluyendo posibles ramas exteriores del polinomio.',
  'En los ejes, los puntos permanecen en ±1. En las diagonales se resuelve una ecuación cuadrática en u². Cuando s tiende a uno, la ecuación se factoriza y el contorno central tiende a los lados del cuadrado.',
  'Explica por qué es necesario indicar el dominio además de la ecuación.',
  'La ecuación polinómica puede tener otras componentes fuera del cuadrado. El squircle designa su contorno central; evaluar únicamente el polinomio mostraría puntos que no pertenecen a ese contorno.', { domain: 'Se representa exclusivamente la componente central, con |u|≤1 y |v|≤1. El evaluador devuelve un valor no definido fuera de este dominio para no dibujar las ramas exteriores.' });
add('three-focus-ellipse', 'Elipse de tres focos', 'implicit', String.raw`\sqrt{(u+1)^2+v^2}+\sqrt{(u-1)^2+v^2}+\sqrt{u^2+(v-1)^2}=5`, 'return Math.hypot(u + 1, v) + Math.hypot(u - 1, v) + Math.hypot(u, v - 1) - 5;', [-2.5, 2.5, -2.5, 2.5], 'https://arxiv.org/abs/math/0702005',
  'La elipse de tres focos fija la suma de distancias a tres puntos. Generaliza la definición focal de la elipse ordinaria y permite estudiar curvas convexas sin una ecuación cuadrática.',
  'Los focos elegidos son (−1,0), (1,0) y (0,1). La simetría vertical permanece, pero no la horizontal. La suma de distancias es una función convexa, por lo que su subnivel forma una región convexa.',
  'El nivel debe superar el mínimo de la suma de distancias para producir un contorno no degenerado. El explorador usa el nivel cinco y evalúa las distancias directamente, sin introducir soluciones por elevaciones al cuadrado.',
  'Comprueba si (0,2) está dentro o fuera del contorno.',
  'La suma vale 2√5+1, aproximadamente 5.472, mayor que cinco. El punto está fuera de la región encerrada.');

group = 'Espirales y recorridos angulares';
add('fermat-spiral', 'Espiral de Fermat', 'parametric', String.raw`r=p\sqrt t,\quad x=r\cos t,\ y=r\sin t,\quad t\ge0`, 'const r = p * Math.sqrt(t); return [r * Math.cos(t), r * Math.sin(t)];', [-6, 6, -6, 6], M('Fermats'),
  'La espiral de Fermat hace crecer el cuadrado del radio linealmente con el ángulo. Su separación entre vueltas disminuye, a diferencia de la espiral de Arquímedes.',
  'El modelo representa una de las dos ramas habituales, con radio no negativo. La rama opuesta se obtiene cambiando el signo del radio. El origen es el punto inicial del recorrido.',
  'La distancia radial entre vueltas es p(√(t+2π)−√t), que decrece cuando t aumenta. En cambio, r² aumenta siempre en 2πp² por vuelta; esto explica su interés en patrones de distribución radial.',
  'Calcula los radios al completar una vuelta y cuatro vueltas.',
  'Son p√(2π) y p√(8π)=2p√(2π). Cuadruplicar el ángulo duplica el radio.', { ranges: [[0, 8 * Math.PI]] });
add('hyperbolic-spiral', 'Espiral hiperbólica', 'parametric', String.raw`r=p/t,\quad x=r\cos t,\ y=r\sin t,\quad t>0`, 'const r = p / t; return [r * Math.cos(t), r * Math.sin(t)];', [-3.5, 3.5, -2, 2], M('Hyperbolic'),
  'La espiral hiperbólica reduce el radio de forma inversamente proporcional al ángulo. Al avanzar, da vueltas cada vez más pequeñas alrededor del origen.',
  'El origen es un punto límite cuando t tiende a infinito, no un punto alcanzado con un parámetro finito. Para t próximo a cero, la coordenada x diverge y la coordenada y tiende a p.',
  'El límite sin t/t=1 muestra que y=p es una asíntota cuando t→0 por la derecha. Esta asíntota surge de la parametrización y no de fijar arbitrariamente una ventana de dibujo.',
  'Compara los puntos t=π y t=2π y explica por qué el radio se reduce a la mitad.',
  'Son (−p/π,0) y (p/(2π),0). Sus radios son p/π y p/(2π), conforme a la ley inversa.', { ranges: [[0.3, 10 * Math.PI]] });
add('lituus-spiral', 'Lituus', 'parametric', String.raw`r=p/\sqrt t,\quad x=r\cos t,\ y=r\sin t,\quad t>0`, 'const r = p / Math.sqrt(t); return [r * Math.cos(t), r * Math.sin(t)];', [-3.5, 3.5, -3.5, 3.5], M('Lituus'),
  'El lituus es una espiral cuyo radio al cuadrado es inversamente proporcional al ángulo. Su nombre se relaciona con la forma de un antiguo bastón curvado.',
  'Cumple r²t=p². El radio diverge cuando t tiende a cero y se aproxima a cero cuando t crece. La reducción radial es más lenta que en la espiral hiperbólica.',
  'Cerca de t=0, x se comporta como p/√t e y como p√t. Por tanto el eje horizontal es una asíntota de su extremo abierto. El producto aproximado xy tiende a p².',
  '¿Qué factor debe aplicarse al ángulo para reducir el radio a la mitad?',
  'Se necesita multiplicar t por cuatro, porque p/√(4t)=r/2. En una espiral hiperbólica basta duplicarlo.', { ranges: [[0.12, 10 * Math.PI]] });
add('euler-clothoid', 'Clotoide de Euler', 'parametric', String.raw`x=p\int_0^t\cos(s^2)\,ds,\quad y=p\int_0^t\sin(s^2)\,ds`, 'let x = 0, y = 0; const n = Math.max(32, Math.ceil(Math.abs(t) * 80)), h = t / n; for (let i = 0; i < n; i++) { const s = (i + 0.5) * h; x += Math.cos(s * s) * h; y += Math.sin(s * s) * h; } return [p * x, p * y];', [-1.8, 1.8, -1.8, 1.8], W('EulersSpiral'),
  'La clotoide de Euler es una curva de transición cuya curvatura crece linealmente con la longitud recorrida. Se utiliza para introducir giros progresivos en trazados de carreteras y vías.',
  'Las derivadas son x′=p cos(t²) e y′=p sin(t²), de modo que la rapidez es constante p. La curva tiene simetría central y una tangente horizontal en el origen.',
  'El ángulo tangente es t². Como la longitud de arco orientada es pt, la curvatura firmada resulta 2t/p. El explorador aproxima las integrales con una regla compuesta de puntos medios; el dibujo es numérico.',
  'Compara la curvatura en t=0, t=1 y t=2 con p=1.',
  'Los valores son 0, 2 y 4. La variación es lineal en t y, en esta parametrización, también en la longitud de arco.', { ranges: [[-4, 4]], domain: 'Las integrales están definidas para todo t real. Se dibuja el tramo −4≤t≤4 mediante integración numérica, manteniendo la misma convención s² en las dos coordenadas.' });
add('epispiral-curve', 'Epiespiral', 'parametric', String.raw`r=p\sec(3t),\quad x=r\cos t,\ y=r\sin t`, 'const d = Math.cos(3 * t); if (Math.abs(d) < 1e-7) return [NaN, NaN]; const r = p / d; return [r * Math.cos(t), r * Math.sin(t)];', [-4, 4, -4, 4], W('Epispiral'),
  'La epiespiral utiliza una secante en su ecuación polar. Sus ramas abiertas se separan por valores angulares donde el denominador se anula.',
  'El modelo r=p sec(3t) produce tres secciones geométricas. El radio puede ser negativo y representa entonces el punto en la dirección opuesta. Sustituirlo por su valor absoluto cambiaría la curva.',
  'Los polos aparecen cuando cos(3t)=0. El trazador separa el recorrido ante valores no finitos o saltos grandes y evita unir artificialmente ramas a través de una asíntota.',
  'Localiza los primeros dos ángulos positivos excluidos de la ecuación.',
  '3t=π/2 y 3t=3π/2 dan t=π/6 y t=π/2. En ambos el radio diverge.', { ranges: [[0, 2 * Math.PI]], domain: 'Se excluyen todos los valores donde cos(3t)=0. El intervalo dibujado comprende varias ramas; los segmentos del trazado se interrumpen al aproximarse a los polos.' });
add('poinsot-spiral', 'Espiral de Poinsot', 'parametric', String.raw`r=p\operatorname{csch}(t),\quad x=r\cos t,\ y=r\sin t,\quad t>0`, 'const r = p / Math.sinh(t); return [r * Math.cos(t), r * Math.sin(t)];', [-3.5, 3.5, -2, 2], W('PoinsotsSpirals'),
  'La espiral de Poinsot aquí representada usa la cosecante hiperbólica. Combina un extremo no acotado con vueltas cuyo radio decrece casi exponencialmente.',
  'Para t pequeño, sinh t≈t y el radio se parece al de una espiral hiperbólica. Para t grande, sinh t≈e^t/2, por lo que r≈2p e^(−t).',
  'La expresión log r=log p−log(sinh t) tiene derivada −coth t. Esa tasa se aproxima a −1, aunque no es constante: la curva no es exactamente una espiral logarítmica.',
  'Comprueba el límite de y cuando t tiende a cero por la derecha.',
  'y=p sin t/sinh t tiende a p, porque tanto sin t como sinh t se comportan como t. La asíntota de ese extremo es y=p.', { ranges: [[0.3, 10]], referenceNote: 'Se representa la variante cosecante hiperbólica de las dos ecuaciones de Poinsot descritas en la referencia.' });
add('cochleoid-curve', 'Cocleoide', 'parametric', String.raw`r=p\,\frac{\sin t}{t},\quad x=r\cos t,\ y=r\sin t`, 'const r = Math.abs(t) < 1e-8 ? p : p * Math.sin(t) / t; return [r * Math.cos(t), r * Math.sin(t)];', [-1.8, 1.8, -1.8, 1.8], M('Cochleoid'),
  'La cocleoide produce una sucesión de lazos cada vez más pequeños mediante el cociente sin t/t. El valor aparentemente indeterminado en t=0 tiene un límite finito.',
  'La función radial es par; x es par e y impar. La curva pasa por el origen cuando t es un múltiplo no nulo de π, y por (p,0) cuando t=0.',
  'La prolongación continua del cociente en cero vale uno. Las amplitudes de los lazos decrecen como 1/|t|; por ello una ventana finita del parámetro solo muestra un número finito de ellos.',
  'Distingue el punto asociado a t=0 del asociado a t=π.',
  'En t=0 se usa el límite r=p y aparece (p,0). En t=π el numerador es cero y se obtiene el origen.', { ranges: [[-6 * Math.PI, 6 * Math.PI]] });
add('theodorus-spiral', 'Espiral de Teodoro', 'parametric', String.raw`r_n=\sqrt n,\quad \theta_{n+1}=\theta_n+\arctan(1/\sqrt n),\quad \theta_1=0`, 'const n = Math.max(1, Math.floor(t)); let angle = 0; for (let k = 1; k < n; k++) angle += Math.atan(1 / Math.sqrt(k)); const next = angle + Math.atan(1 / Math.sqrt(n)), f = t - n; return [p * ((1 - f) * Math.sqrt(n) * Math.cos(angle) + f * Math.sqrt(n + 1) * Math.cos(next)), p * ((1 - f) * Math.sqrt(n) * Math.sin(angle) + f * Math.sqrt(n + 1) * Math.sin(next))];', [-9, 9, -9, 9], W('TheodorusSpiral'),
  'La espiral de Teodoro es un recorrido poligonal construido con triángulos rectángulos consecutivos. Cada nuevo triángulo añade un cateto de longitud uno a la hipotenusa anterior.',
  'Las distancias al origen son √1, √2, √3 y así sucesivamente. Los segmentos exteriores tienen longitud uno; con escala p, tanto radios como segmentos se multiplican por p.',
  'Pitágoras da r_(n+1)²=r_n²+1. El incremento angular se obtiene con tan Δθ=1/√n. El explorador une linealmente los vértices: muestra la espiral discreta, no una suavización continua.',
  'Calcula el radio del vértice número 16 y la longitud de cada segmento para p=1.5.',
  'El radio es 1.5√16=6 y cada segmento mide 1.5. Los ángulos se mantienen porque la dilatación es uniforme.', { ranges: [[1, 50]], domain: 'Se representan los primeros 50 vértices y los segmentos que los conectan. t interpola entre índices enteros; las esquinas forman parte del modelo.' });

group = 'Rodaduras y curvas de movimiento';
add('trochoid-curve', 'Trocoide', 'parametric', String.raw`x=t-p\sin t,\quad y=1-p\cos t`, 'return [t - p * Math.sin(t), 1 - p * Math.cos(t)];', [-1, 14, -2, 4], W('Trochoid'),
  'Una trocoide es el recorrido de un punto ligado a un círculo que rueda sobre una recta. La distancia del punto al centro puede ser distinta del radio del círculo.',
  'El círculo rodante tiene radio uno y el punto está a distancia p. Si p<1, el recorrido es acortado; si p=1, se obtiene la cicloide; si p>1 aparecen lazos.',
  'La velocidad horizontal es 1−p cos t. Para p<1 nunca se anula. Para p>1 cambia de signo en parte de cada vuelta, lo que permite que el punto retroceda y forme un lazo.',
  'Identifica el valor de p para el que aparecen cúspides y calcula la separación horizontal entre ellas.',
  'En p=1 se anulan simultáneamente las dos derivadas en t=2kπ. Las cúspides consecutivas están separadas por 2π.', { parameter: { label: 'Distancia al centro (p)', min: 0.2, max: 2, step: 0.05, value: 1.4 }, ranges: [[0, 4 * Math.PI]], related: 'cycloid', relatedTitle: 'Cicloide', relatedActivity: 'Comprueba que p=1 recupera exactamente la curva del artículo de la cicloide.' });
add('epitrochoid-curve', 'Epitrocoide', 'parametric', String.raw`x=4\cos t-p\cos(4t),\quad y=4\sin t-p\sin(4t)`, 'return [4 * Math.cos(t) - p * Math.cos(4 * t), 4 * Math.sin(t) - p * Math.sin(4 * t)];', [-7, 7, -7, 7], W('Epitrochoid'),
  'La epitrocoide sigue un punto ligado a un círculo que rueda por fuera de otro círculo. Generaliza la epicicloide permitiendo que el punto no esté sobre la circunferencia rodante.',
  'El modelo usa radio fijo tres y radio rodante uno. El centro describe una circunferencia de radio cuatro; el punto móvil gira cuatro veces durante cada vuelta del centro.',
  'La coordenada compleja es 4e^(it)−p e^(4it). Las frecuencias enteras aseguran el cierre en 2π. El valor p=1 recupera la epicicloide correspondiente y puede generar cúspides.',
  'Calcula el punto inicial y comprueba el cierre tras una vuelta completa.',
  'En t=0 y t=2π se obtiene (4−p,0). Las dos coordenadas tienen periodos compatibles con 2π.', { parameter: { label: 'Distancia al centro móvil (p)', min: 0.2, max: 2.5, step: 0.05, value: 1.6 }, ranges: [[0, 2 * Math.PI]], related: 'epicycloid', relatedTitle: 'Epicicloide', relatedActivity: 'Compara la curva para p=1 y para un punto situado fuera del círculo rodante.' });
add('hypotrochoid-curve', 'Hipotrocoide', 'parametric', String.raw`x=3\cos t+p\cos(3t),\quad y=3\sin t-p\sin(3t)`, 'return [3 * Math.cos(t) + p * Math.cos(3 * t), 3 * Math.sin(t) - p * Math.sin(3 * t)];', [-6, 6, -6, 6], W('Hypotrochoid'),
  'La hipotrocoide aparece cuando un círculo rueda por dentro de otro. Los dibujos de espirógrafo se obtienen eligiendo radios y distancias al centro en esta familia.',
  'Se fijan radio exterior cuatro y radio interior uno. El parámetro p es la distancia del punto dibujante al centro móvil. Cuando p=1 se obtiene una hipocicloide de cuatro cúspides.',
  'La rotación del punto relativo al centro tiene sentido contrario al giro de este. Por eso el segundo seno lleva signo negativo. La relación entera entre radios asegura un recorrido cerrado.',
  'Comprueba qué curva conocida se obtiene con p=1.',
  'Las identidades 3cos t+cos 3t=4cos³t y 3sin t−sin 3t=4sin³t muestran que es un astroide de tamaño cuatro.', { parameter: { label: 'Distancia al centro móvil (p)', min: 0.2, max: 2, step: 0.05, value: 1.5 }, ranges: [[0, 2 * Math.PI]], related: 'astroid', relatedTitle: 'Astroide', relatedActivity: 'Usa p=1 y verifica la parametrización cúbica del astroide.' });
add('nephroid-curve', 'Nefroide', 'parametric', String.raw`x=p(3\cos t-\cos3t),\quad y=p(3\sin t-\sin3t)`, 'return [p * (3 * Math.cos(t) - Math.cos(3 * t)), p * (3 * Math.sin(t) - Math.sin(3 * t))];', [-5.5, 5.5, -5.5, 5.5], W('Nephroid'),
  'La nefroide es una epicicloide de dos cúspides. También aparece como una cáustica de reflexión bajo ciertas condiciones de iluminación de una circunferencia.',
  'La curva tiene cúspides en (±2p,0). La coordenada vertical puede simplificarse a 4p sin³t. Las reflexiones respecto de ambos ejes conservan su forma de riñón.',
  'Al derivar las coordenadas se comprueba que ambas velocidades se anulan en t=0 y t=π. La longitud total del recorrido es 24p y el área encerrada 12πp².',
  'Encuentra las alturas máxima y mínima y compara su separación con la distancia entre cúspides.',
  'Las alturas son ±4p, separadas por 8p. Las cúspides están separadas por 4p, exactamente la mitad.', { ranges: [[0, 2 * Math.PI]], related: 'epicycloid', relatedTitle: 'Epicicloide', relatedActivity: 'Compara las dos cúspides de la nefroide con otras relaciones de radios.' });
add('freeth-nephroid', 'Nefroide de Freeth', 'parametric', String.raw`r=p(1+2\sin(t/2)),\quad x=r\cos t,\ y=r\sin t`, 'const r = p * (1 + 2 * Math.sin(t / 2)); return [r * Math.cos(t), r * Math.sin(t)];', [-4.5, 4.5, -4.5, 4.5], W('FreethsNephroid'),
  'La nefroide de Freeth es una curva polar distinta de la nefroide de rodadura. La mitad del ángulo en su ecuación produce un recorrido que necesita dos vueltas angulares para repetirse.',
  'Su radio oscila entre −p y 3p. Los valores negativos representan puntos en direcciones opuestas. El periodo de la parametrización completa es 4π.',
  'El radio se anula cuando sin(t/2)=−1/2. Estos pasos por el origen generan lazos en la parte del recorrido con radio negativo. Utilizar solamente el intervalo 0≤t≤2π omitiría esa parte.',
  'Localiza los dos valores de t entre 2π y 4π que llevan al origen.',
  't/2=7π/6 y 11π/6 dan t=7π/3 y 11π/3. En ambos r=0.', { ranges: [[0, 4 * Math.PI]] });
add('ceva-cycloid', 'Cicloide de Ceva', 'parametric', String.raw`r=p(1+2\cos2t),\quad x=r\cos t,\ y=r\sin t`, 'const r = p * (1 + 2 * Math.cos(2 * t)); return [r * Math.cos(t), r * Math.sin(t)];', [-4.5, 4.5, -3, 3], W('CycloidofCeva'),
  'La cicloide de Ceva es una curva polar ligada a problemas de trisección angular. Pese a su nombre histórico, su ecuación no es la de un círculo rodando sobre una recta.',
  'El radio cambia de signo y puede anularse varias veces durante una vuelta. La curva cumple (x²+y²)³=p²(3x²−y²)² y tiene simetría respecto de ambos ejes.',
  'La identidad 1+2cos2t=4cos²t−1 permite escribir las coordenadas como polinomios en seno y coseno. En t=0 aparece (3p,0); en t=π/2, el radio negativo da (0,−p).',
  'Encuentra el primer ángulo positivo donde la curva llega al origen.',
  '1+2cos2t=0 exige cos2t=−1/2. El primer valor es t=π/3.', { ranges: [[0, 2 * Math.PI]] });
add('pascal-limacon', 'Limaçón de Pascal', 'parametric', String.raw`r=p+\cos t,\quad x=r\cos t,\ y=r\sin t`, 'const r = p + Math.cos(t); return [r * Math.cos(t), r * Math.sin(t)];', [-3.5, 3.5, -3.5, 3.5], W('Limacon'),
  'El limaçón de Pascal reúne formas con lazo, con cúspide y ovaladas en una sola familia polar. La relación entre sus dos constantes controla la transición entre esas formas.',
  'El coeficiente del coseno está fijado en uno y p varía. Para p<1 existe un lazo interior; p=1 produce una cardioide. Para 1<p<2 aparece una hendidura y para p≥2 el contorno es convexo.',
  'Los pasos por el origen satisfacen cos t=−p, de modo que solo existen si p≤1. En el caso límite p=1 las dos soluciones se juntan en t=π y forman la cúspide.',
  'Comprueba qué cambia al pasar de p=0.7 a p=1.3.',
  'Para p=0.7 hay dos ángulos con radio cero y un lazo interior. Para p=1.3 el radio siempre es positivo y el lazo desaparece.', { parameter: { label: 'Radio constante (p)', min: 0.2, max: 2.5, step: 0.05, value: 0.7 }, ranges: [[0, 2 * Math.PI]], related: 'cardioid', relatedTitle: 'Cardioide', relatedActivity: 'Selecciona p=1 para recuperar el caso límite con una cúspide.' });
add('talbot-curve', 'Curva de Talbot', 'parametric', String.raw`x=\frac{(4+3\sin^2t)\cos t}{2}p,\quad y=(-2+3\sin^2t)\sin t\,p`, 'const s = Math.sin(t), c = Math.cos(t); return [p * (4 + 3 * s * s) * c / 2, p * (-2 + 3 * s * s) * s];', [-4, 4, -2.5, 2.5], W('TalbotsCurve'),
  'La curva de Talbot se construye como una pedal negativa de una elipse. Esta configuración utiliza una elipse de semiejes dos y uno y produce cúspides junto a puntos dobles.',
  'Las dos reflexiones coordenadas son simetrías. El recorrido completo tiene periodo 2π. La relación de semiejes da una excentricidad al cuadrado de 3/4, dentro del régimen con cúspides.',
  'Las fórmulas se obtienen de la envolvente de rectas perpendiculares a los radios de la elipse. No debe confundirse la construcción pedal negativa con tomar los centros de curvatura, que produce la evoluta.',
  'Calcula los puntos correspondientes a t=0 y t=π/2.',
  'Se obtiene (2p,0) y (0,p). Estos valores verifican las intersecciones principales, aunque otras partes del recorrido pueden volver a cortar los ejes.', { ranges: [[0, 2 * Math.PI]] });

group = 'Geometría diferencial y equilibrio';
add('circle-involute', 'Involuta de una circunferencia', 'parametric', String.raw`x=p(\cos t+t\sin t),\quad y=p(\sin t-t\cos t)`, 'return [p * (Math.cos(t) + t * Math.sin(t)), p * (Math.sin(t) - t * Math.cos(t))];', [-8, 8, -8, 8], W('CircleInvolute'),
  'La involuta de una circunferencia es el recorrido del extremo de una cuerda tensa que se desenrolla de ella. Esta construcción interviene en el diseño de perfiles de dientes de engranajes.',
  'El punto inicial es (p,0) y la distancia al centro es p√(1+t²). En t=0 se anulan las dos derivadas; para t>0 el recorrido es regular y se aleja progresivamente.',
  'El vector tangente a la circunferencia es (−sin t,cos t). Restarle una longitud pt al punto de contacto produce la fórmula de la involuta. Su rapidez es pt para t≥0.',
  'Calcula la longitud recorrida desde t=0 hasta t=2 con p=1.',
  'La longitud es la integral de t entre cero y dos, igual a dos. En general, el tramo hasta T mide pT²/2.', { ranges: [[0, 2 * Math.PI]] });
add('ellipse-evolute-curve', 'Evoluta de una elipse', 'parametric', String.raw`x=\frac{4-p^2}{2}\cos^3t,\quad y=\frac{p^2-4}{p}\sin^3t`, 'return [(4 - p * p) * Math.cos(t) ** 3 / 2, (p * p - 4) * Math.sin(t) ** 3 / p];', [-4, 4, -4, 4], W('EllipseEvolute'),
  'La evoluta de una elipse reúne los centros de sus círculos osculadores. El resultado tiene cuatro cúspides y explica por qué una elipse no posee un único centro de curvatura.',
  'La elipse original tiene semiejes dos y p. Si ambos coinciden, la evoluta se reduce al centro. Para valores distintos aparece un astroide escalado de manera diferente en cada coordenada.',
  'La fórmula se obtiene desplazando cada punto de la elipse una distancia igual al radio de curvatura en la dirección normal. Las cúspides corresponden a los extremos de curvatura de la elipse.',
  'Calcula los extremos de la evoluta para p=1 y compara sus distancias al origen.',
  'Los extremos horizontales están en ±3/2 y los verticales en ±3. Los centros de curvatura pueden quedar fuera de la elipse original.', { parameter: { label: 'Semieje menor de la elipse (p)', min: 0.7, max: 1.9, step: 0.05, value: 1 }, ranges: [[0, 2 * Math.PI]], related: 'ellipse', relatedTitle: 'Elipse', relatedActivity: 'Relaciona los vértices de la elipse original con las cúspides de su evoluta.' });
add('catenary-curve', 'Catenaria', 'parametric', String.raw`x=t,\quad y=p\cosh(t/p)`, 'return [t, p * Math.cosh(t / p)];', [-3.5, 3.5, -0.5, 6.5], M('Catenary'),
  'La catenaria describe una cadena flexible y homogénea suspendida bajo su propio peso. Se parece a una parábola cerca del mínimo, pero ambas curvas difieren fuera de ese entorno.',
  'La función es par, tiene mínimo (0,p) y crece en ambas direcciones. El parámetro p relaciona la tensión horizontal con el peso por unidad de longitud.',
  'La expansión cosh z=1+z²/2+… da y≈p+x²/(2p) cerca del mínimo. La curvatura es 1/[p cosh²(x/p)], de modo que disminuye hacia los extremos.',
  'Compara la altura exacta y la aproximación parabólica cuando x=p.',
  'La altura exacta es p cosh 1, aproximadamente 1.543p. La aproximación es 1.5p; el error aumenta al alejarse del mínimo.', { parameter: { label: 'Parámetro de tensión (p)', min: 0.7, max: 2, step: 0.05, value: 1 }, ranges: [[-2.5, 2.5]], related: 'parabola', relatedTitle: 'Parábola', relatedActivity: 'Compara ambas curvas cerca del vértice y observa cómo se separan lejos de él.' });
add('tractrix-curve', 'Tractriz', 'parametric', String.raw`x=p(t-\tanh t),\quad y=p\operatorname{sech}t`, 'return [p * (t - Math.tanh(t)), p / Math.cosh(t)];', [-5, 5, -0.3, 2], M('Tractrix'),
  'La tractriz es el recorrido de un objeto arrastrado con una cuerda de longitud constante mientras el extremo tractor avanza por una recta. La condición se expresa mediante segmentos tangentes.',
  'La curva permanece sobre el eje horizontal y se aproxima a él al crecer |t|. El punto t=0 es (0,p), donde esta parametrización tiene velocidad nula y se encuentran las dos ramas.',
  'La pendiente para t distinto de cero es −sech t/tanh t. El segmento de la tangente entre el punto y el eje horizontal mide p: el cateto vertical es p sech t y el horizontal p tanh t.',
  'Verifica que el segmento tangente mantiene la misma longitud usando las identidades hiperbólicas.',
  'Su longitud al cuadrado es p²(sech²t+tanh²t)=p². Por eso mide p para cualquier punto regular.', { ranges: [[-4, 4]] });
add('catenary-evolute', 'Evoluta de la catenaria', 'parametric', String.raw`x=p(t-\sinh t\cosh t),\quad y=2p\cosh t`, 'return [p * (t - Math.sinh(t) * Math.cosh(t)), 2 * p * Math.cosh(t)];', [-8, 8, -1, 8], W('CatenaryEvolute'),
  'La evoluta de la catenaria se obtiene siguiendo los centros de curvatura de una cadena suspendida. Tiene una cúspide sobre el mínimo de la catenaria original.',
  'La coordenada horizontal es impar y la vertical par. El punto t=0 es (0,2p). En él se anulan ambas derivadas y nace la cúspide de la envolvente de normales.',
  'Para la catenaria (pt,p cosh t), el radio de curvatura es p cosh²t y la normal unitaria es (−tanh t,sech t). Al sumar ese desplazamiento se obtienen las dos coordenadas de la evoluta.',
  'Calcula el radio de curvatura de la catenaria en su mínimo y localiza el centro correspondiente.',
  'En t=0 el radio vale p. Desde (0,p), el desplazamiento normal vertical lleva al centro (0,2p), la cúspide de la evoluta.', { ranges: [[-1.5, 1.5]], related: 'catenary-curve', relatedTitle: 'Catenaria', relatedActivity: 'Compara el mínimo de la cadena con el punto singular de su evoluta.' });
add('euler-elastica', 'Elástica de Euler', 'parametric', String.raw`x=p(t-2\tanh t),\quad y=2p\operatorname{sech}t`, 'return [p * (t - 2 * Math.tanh(t)), 2 * p / Math.cosh(t)];', [-5, 5, -0.5, 3.5], W('Elastica'),
  'Las elásticas de Euler son curvas de equilibrio de varillas flexibles bajo restricciones. El modelo aquí elegido es una solución especial con un lazo, no la familia completa de todas las elásticas.',
  'La curva es simétrica respecto del eje vertical y se aproxima al eje horizontal en sus dos extremos. Su rapidez es constante p aunque las coordenadas contienen funciones hiperbólicas.',
  'La identidad (1−2sech²t)²+4sech²t tanh²t=1 verifica la rapidez. En escala unidad, la curvatura firmada tiene módulo 2sech t y satisface una ecuación de equilibrio de la energía de flexión.',
  'Comprueba que el punto de altura máxima no es una cúspide.',
  'En t=0 el punto es (0,2p) y la velocidad (−p,0), que no se anula. La tangente es horizontal y el recorrido es regular.', { ranges: [[-5, 5]], referenceNote: 'La referencia define la energía y ecuación de las elásticas. El explorador muestra la solución especial x=t−2tanh t, y=2sech t, con dilatación p.' });

group = 'Interpolación y diseño geométrico';
const engineering = { parameter: { label: 'Altura de control (p)', min: 0.2, max: 3, step: 0.1, value: 1.5 }, ranges: [[0, 1]], related: 'polynomial-interpolation', relatedTitle: 'Interpolación polinómica', relatedActivity: 'Compara el control mediante puntos con el control mediante valores y pendientes.' };
add('quadratic-bezier-curve', 'Curva de Bézier cuadrática', 'parametric', String.raw`B(t)=(1-t)^2P_0+2t(1-t)P_1+t^2P_2,\quad P_0=(-2,0),\ P_1=(0,p),\ P_2=(2,0)`, 'return [-2 + 4 * t, 2 * p * t * (1 - t)];', [-3, 3, -1, 3], W('BezierCurve'),
  'La curva de Bézier cuadrática define un arco mediante tres puntos de control. Su importancia está en la construcción y el control geométrico de la forma, incluso cuando el arco pertenece a una parábola.',
  'La curva pasa por los puntos extremos P₀ y P₂. El punto central P₁ controla las tangentes, pero normalmente no está sobre el arco. Las combinaciones convexas mantienen el recorrido dentro del triángulo de control.',
  'Los pesos de Bernstein suman uno y son no negativos para 0≤t≤1. En esta configuración simétrica, x=−2+4t e y=2pt(1−t), de modo que la altura máxima es p/2.',
  'Decide si el arco pasa por el punto de control (0,p).',
  'No: cuando x=0, t=1/2 y la altura es p/2. El punto de control determina la forma sin ser interpolado.', engineering);
add('cubic-bezier-curve', 'Curva de Bézier cúbica', 'parametric', String.raw`B(t)=(1-t)^3P_0+3t(1-t)^2P_1+3t^2(1-t)P_2+t^3P_3`, 'const s = 1 - t; return [-2 * s ** 3 - 3 * t * s * s + 3 * t * t * s + 2 * t ** 3, 3 * p * t * s * (1 - 2 * t)];', [-3, 3, -2, 2], W('BezierCurve'),
  'La curva de Bézier cúbica usa cuatro puntos de control y permite introducir inflexiones. Es una herramienta habitual para dibujar contornos y trayectorias en gráficos vectoriales.',
  'Se usan P₀=(−2,0), P₁=(−1,p), P₂=(1,−p) y P₃=(2,0). Los extremos se interpolan y los dos puntos interiores fijan las direcciones tangentes de entrada y salida.',
  'La simetría B(1−t)=−B(t) fuerza el paso por el origen. Las derivadas inicial y final se obtienen multiplicando por tres la diferencia entre los respectivos puntos de control vecinos.',
  'Calcula las velocidades en los extremos y el punto central del arco.',
  'B′(0)=(3,3p) y B′(1)=(3,3p). En t=1/2, B=(0,0); la curva cruza el centro con una dirección diferente.', { ...engineering, domain: 'P₀=(−2,0), P₁=(−1,p), P₂=(1,−p), P₃=(2,0), con 0≤t≤1. Cambiar p desplaza verticalmente los dos puntos interiores.' });
add('rational-bezier-curve', 'Curva de Bézier racional', 'parametric', String.raw`B(t)=\frac{(1-t)^2P_0+2pt(1-t)P_1+t^2P_2}{(1-t)^2+2pt(1-t)+t^2}`, 'const s = 1 - t, d = s * s + 2 * p * t * s + t * t; return [(t * t - s * s) / d, 4 * p * t * s / d];', [-1.8, 1.8, -0.5, 2.5], W('BezierCurve'),
  'Una Bézier racional añade pesos a los puntos de control. Esta extensión puede representar arcos de cónicas exactamente, mientras que una Bézier polinómica no representa exactamente una circunferencia completa.',
  'Los controles son P₀=(−1,0), P₁=(0,2), P₂=(1,0) y los pesos (1,p,1). Como p es positivo, el denominador nunca se anula en el intervalo.',
  'El peso central cambia la influencia de P₁ sin desplazarlo. En t=1/2, la altura es 2p/(1+p): al aumentar p, el punto medio se acerca al control superior.',
  'Calcula la altura central para p=0.5, p=1 y p=2.',
  'Las alturas son 2/3, 1 y 4/3. Los extremos permanecen fijos aunque cambie el peso.', { ...engineering, parameter: { label: 'Peso central (p)', min: 0.2, max: 3, step: 0.1, value: 1 }, domain: 'P₀=(−1,0), P₁=(0,2), P₂=(1,0), con pesos positivos (1,p,1) y 0≤t≤1.' });
add('cubic-hermite-curve', 'Curva cúbica de Hermite', 'parametric', String.raw`H(t)=(2t^3-3t^2+1)P_0+(t^3-2t^2+t)T_0+(-2t^3+3t^2)P_1+(t^3-t^2)T_1`, 'const h00 = 2 * t ** 3 - 3 * t * t + 1, h10 = t ** 3 - 2 * t * t + t, h01 = -2 * t ** 3 + 3 * t * t, h11 = t ** 3 - t * t; return [-2 * h00 + 3 * h10 + 2 * h01 + 3 * h11, p * h10 - p * h11];', [-3, 3, -1, 2], 'https://www.cubic.org/docs/hermite.htm',
  'La curva cúbica de Hermite interpola dos puntos y dos vectores tangentes. Permite diseñar un tramo especificando directamente cómo debe entrar y salir de sus extremos.',
  'El ejemplo utiliza P₀=(−2,0), P₁=(2,0), T₀=(3,p) y T₁=(3,−p). La altura varía con p, mientras los extremos y la componente horizontal de las tangentes permanecen fijos.',
  'Las cuatro funciones base cumplen condiciones de valor y derivada en t=0 y t=1. Esto garantiza H(0)=P₀, H(1)=P₁, H′(0)=T₀ y H′(1)=T₁ sin resolver un sistema en cada dibujo.',
  'Comprueba que la altura central es p/4 y que las pendientes extremas tienen signos opuestos.',
  'En t=1/2, h₁₀=1/8 y h₁₁=−1/8, luego y=p/4. Las pendientes son p/3 y −p/3.', { ...engineering, domain: 'P₀=(−2,0), P₁=(2,0), T₀=(3,p), T₁=(3,−p), con 0≤t≤1.' });
add('catmull-rom-curve', 'Spline de Catmull–Rom', 'parametric', String.raw`C(t)=\tfrac12[2P_1+(-P_0+P_2)t+(2P_0-5P_1+4P_2-P_3)t^2+(-P_0+3P_1-3P_2+P_3)t^3]`, 'const pts = [[-3, 0], [-1, p], [1, -p], [3, 0]]; return [0, 1].map(k => 0.5 * (2 * pts[1][k] + (-pts[0][k] + pts[2][k]) * t + (2 * pts[0][k] - 5 * pts[1][k] + 4 * pts[2][k] - pts[3][k]) * t * t + (-pts[0][k] + 3 * pts[1][k] - 3 * pts[2][k] + pts[3][k]) * t ** 3)) as [number, number];', [-2, 2, -2.5, 2.5], W('Catmull-RomSpline'),
  'El spline de Catmull–Rom construye tramos que pasan por puntos de una secuencia. Las tangentes se estiman a partir de los puntos vecinos, lo que facilita definir trayectorias sin introducir controles adicionales.',
  'Se muestra el tramo entre P₁=(−1,p) y P₂=(1,−p), con vecinos P₀=(−3,0) y P₃=(3,0). Es la variante uniforme; otras parametrizaciones cambian las tangentes.',
  'El tramo se puede expresar como una Hermite con tangentes (P₂−P₀)/2 y (P₃−P₁)/2. Al unir tramos de una secuencia uniforme, sus velocidades coinciden en los puntos comunes.',
  'Calcula las dos tangentes del tramo y comprueba sus extremos.',
  'C(0)=P₁, C(1)=P₂ y ambas tangentes son (2,−p/2). Aunque sean iguales, el tramo puede cambiar de curvatura entre ellas.', { ...engineering, domain: 'Se representa un tramo de Catmull–Rom uniforme con los cuatro puntos indicados. El modelo no aplica la parametrización centrípeta.' });
add('uniform-cubic-bspline', 'B-spline cúbico uniforme', 'parametric', String.raw`B(t)=\tfrac16[(1-t)^3P_0+(3t^3-6t^2+4)P_1+(-3t^3+3t^2+3t+1)P_2+t^3P_3]`, 'const pts = [[-3, 0], [-1, p], [1, -p], [3, 0]], w = [(1 - t) ** 3, 3 * t ** 3 - 6 * t * t + 4, -3 * t ** 3 + 3 * t * t + 3 * t + 1, t ** 3]; return [0, 1].map(k => w.reduce((sum, value, i) => sum + value * pts[i][k] / 6, 0)) as [number, number];', [-2, 2, -2, 2], W('B-Spline'),
  'El B-spline cúbico uniforme construye un tramo mediante cuatro puntos de control. A diferencia de un spline interpolador, el recorrido generalmente no pasa por esos controles.',
  'Se utilizan los controles (−3,0), (−1,p), (1,−p), (3,0). Los pesos no negativos suman uno en el intervalo, de modo que el tramo queda en la envolvente convexa de los controles.',
  'La base cúbica uniforme permite unir tramos con continuidad de dos derivadas en los nudos simples. Cada control solo influye en un número limitado de tramos, propiedad valiosa para la edición local.',
  'Calcula los puntos inicial y final del tramo y decide si coinciden con P₁ y P₂.',
  'Los extremos son (−1,p/2) y (1,−p/2). Sus alturas no coinciden con las de P₁ y P₂: los controles no se interpolan.', { ...engineering, domain: 'Se muestra un tramo interior de B-spline cúbico uniforme, no una curva con extremos sujetos por nudos repetidos.' });
add('natural-cubic-spline', 'Spline cúbico natural', 'parametric', String.raw`x=t,\quad y=p\left(1-\tfrac32t^2+\tfrac12|t|^3\right),\quad -1\le t\le1`, 'return [t, p * (1 - 1.5 * t * t + 0.5 * Math.abs(t) ** 3)];', [-1.6, 1.6, -0.5, 3.5], W('CubicSpline'),
  'Un spline cúbico natural interpola datos mediante polinomios de grado tres por tramos. Las condiciones naturales hacen que la segunda derivada se anule en los extremos.',
  'Este ejemplo interpola (−1,0), (0,p) y (1,0). El valor, la pendiente y la segunda derivada son continuos en t=0, mientras la tercera derivada cambia entre los dos tramos.',
  'Para t≥0, y=p(1−3t²/2+t³/2). Reflejar esa fórmula produce el tramo izquierdo. Su segunda derivada es p(−3+3|t|), que se anula en ±1.',
  'Comprueba la condición natural y calcula la curvatura en el punto central.',
  'En t=±1 la segunda derivada vale cero. En t=0 la pendiente es cero y y″=−3p, por lo que la curvatura tiene módulo 3p.', { ...engineering, ranges: [[-1, 1]], domain: 'La fórmula vale únicamente en el intervalo interpolado −1≤t≤1. El valor absoluto reúne los dos polinomios cúbicos.' });
add('lagrange-interpolation-curve', 'Curva interpoladora de Lagrange', 'parametric', String.raw`y=\sum_{i=0}^4 y_i\prod_{j\ne i}\frac{x-x_j}{x_i-x_j},\quad (x_i,y_i)=(-2,0),(-1,p),(0,0),(1,-1),(2,1)`, 'const xs = [-2, -1, 0, 1, 2], ys = [0, p, 0, -1, 1]; let y = 0; for (let i = 0; i < 5; i++) { let b = 1; for (let j = 0; j < 5; j++) if (i !== j) b *= (t - xs[j]) / (xs[i] - xs[j]); y += ys[i] * b; } return [t, y];', [-2.5, 2.5, -3, 4], W('LagrangeInterpolatingPolynomial'),
  'La curva interpoladora de Lagrange pasa por una colección de datos mediante un único polinomio. El ejemplo utiliza cinco nodos, por lo que el grado es como máximo cuatro.',
  'Cada función base vale uno en su propio nodo y cero en los demás. Modificar una ordenada conserva todos los otros datos, aunque altera el polinomio en casi todo el intervalo.',
  'La interpolación global difiere del control local de los B-splines. Entre nodos pueden aparecer oscilaciones; pasar exactamente por los datos no garantiza que el perfil sea adecuado para extrapolar.',
  'Cambia p y comprueba qué nodos permanecen fijos.',
  'Solo cambia la ordenada en x=−1. Los valores en x=−2,0,1,2 siguen siendo 0,0,−1,1 porque sus bases anulan la contribución modificada.', { ...engineering, ranges: [[-2, 2]], domain: 'Los cinco nodos son distintos y el recorrido se limita al intervalo [−2,2]. El explorador modifica solamente la ordenada del nodo x=−1.' });
add('pythagorean-hodograph-quintic', 'Quíntica de hodógrafa pitagórica', 'parametric', String.raw`x=t-\frac{p^2t^5}{5},\quad y=\frac{2pt^3}{3}`, 'return [t - p * p * t ** 5 / 5, 2 * p * t ** 3 / 3];', [-2, 2, -2, 2], 'https://doi.org/10.1147/rd.345.0736',
  'Una curva de hodógrafa pitagórica tiene una rapidez que puede expresarse mediante un polinomio. Esta propiedad simplifica el cálculo exacto de longitud de arco y el diseño de trayectorias.',
  'Las derivadas del modelo son x′=1−p²t⁴ e y′=2pt². Forman una terna pitagórica: x′²+y′²=(1+p²t⁴)². La curva es regular porque su rapidez nunca se anula.',
  'La construcción parte de elevar al cuadrado el polinomio complejo 1+ipt². Integrar sus partes real e imaginaria da la parametrización de grado cinco. La longitud entre cero y T es T+p²T⁵/5.',
  'Calcula la longitud exacta del tramo 0≤t≤1 con p=1.',
  'La integral de la rapidez 1+t⁴ da 1+1/5=6/5. No es necesario aproximar una integral con una raíz cuadrada.', { ...engineering, parameter: { label: 'Coeficiente de la hodógrafa (p)', min: 0.2, max: 1.5, step: 0.05, value: 1 }, ranges: [[-1, 1]] });
add('nurbs-curve', 'Curva NURBS', 'parametric', String.raw`C(t)=\frac{\sum_i w_iN_{i,2}(t)P_i}{\sum_i w_iN_{i,2}(t)}`, 'if (t >= 1) return [2, 0]; const pts = [[-2, 0], [-1, 2], [1, -1], [2, 0]], weights = [1, p, 1, 1]; let x = 0, y = 0, d = 0; for (let i = 0; i < 4; i++) { const b = weights[i] * this.basis(i, 2, t); x += b * pts[i][0]; y += b * pts[i][1]; d += b; } return [x / d, y / d];', [-3, 3, -2, 3], W('NURBSCurve'),
  'Las NURBS combinan bases B-spline no uniformes con pesos racionales. Permiten representar curvas de diseño y arcos de cónicas en una misma formulación.',
  'El ejemplo tiene grado dos, controles (−2,0), (−1,2), (1,−1), (2,0), nudos [0,0,0,0.5,1,1,1] y pesos [1,p,1,1]. Los extremos se interpolan gracias a los nudos repetidos.',
  'Las bases se calculan con la recurrencia de Cox–de Boor. Los términos con denominador cero se toman como cero. El peso p atrae el recorrido hacia el segundo control sin desplazar los demás.',
  'Explica por qué aumentar p conserva los puntos extremos.',
  'En los extremos solo queda la base asociada al primer o último control. Numerador y denominador comparten su peso, que se cancela.', { ...engineering, parameter: { label: 'Peso del segundo control (p)', min: 0.2, max: 3, step: 0.1, value: 1.5 }, domain: 'Grado dos y vector de nudos [0,0,0,0.5,1,1,1]. Los pesos son positivos. Se utiliza la convención cerrada en t=1 para incluir el último control.', methods: `\n  private basis(i: number, degree: number, t: number): number {\n    const knots = [0, 0, 0, 0.5, 1, 1, 1];\n    if (degree === 0) return knots[i] <= t && t < knots[i + 1] ? 1 : 0;\n    const left = knots[i + degree] - knots[i], right = knots[i + degree + 1] - knots[i + 1];\n    return (left ? (t - knots[i]) / left * this.basis(i, degree - 1, t) : 0) + (right ? (knots[i + degree + 1] - t) / right * this.basis(i + 1, degree - 1, t) : 0);\n  }\n` });

group = 'Gráficas trascendentes y señales';
const graphOptions = { ranges: [[-4, 4]], related: 'function-analysis', relatedTitle: 'Estudio de funciones', relatedActivity: 'Contrasta crecimiento, extremos e inflexiones con la forma del gráfico.' };
add('sinusoidal-curve', 'Curva sinusoidal', 'parametric', String.raw`x=t,\quad y=\sin(pt)`, 'return [t, Math.sin(p * t)];', [-7, 7, -1.7, 1.7], W('Sine'),
  'La curva sinusoidal representa una oscilación periódica de amplitud constante. Conecta geometría circular, ondas y movimientos armónicos mediante una función elemental.',
  'La amplitud es uno y el periodo es 2π/p. La función es impar, con simetría central. Sus ceros están en t=kπ/p y los extremos alternan entre uno y menos uno.',
  'La segunda derivada es y″=−p²y. Esa ecuación caracteriza un oscilador armónico sin amortiguamiento. Aumentar p incrementa la frecuencia sin cambiar la altura de los extremos.',
  'Determina el periodo y la separación entre ceros consecutivos cuando p=2.',
  'El periodo es π y la separación entre ceros es π/2. Un periodo contiene dos intervalos entre ceros consecutivos.', { ...graphOptions, ranges: [[-2 * Math.PI, 2 * Math.PI]], parameter: { label: 'Frecuencia angular (p)', min: 0.5, max: 4, step: 0.1, value: 1 } });
add('damped-sinusoid', 'Sinusoide amortiguada', 'parametric', String.raw`x=t,\quad y=e^{-pt}\sin(4t),\quad t\ge0`, 'return [t, Math.exp(-p * t) * Math.sin(4 * t)];', [-0.5, 10.5, -1.5, 1.5], W('DampedSimpleHarmonicMotion'),
  'La sinusoide amortiguada modela una oscilación que pierde amplitud. Mantiene una frecuencia constante mientras sus extremos quedan limitados por una envolvente exponencial decreciente.',
  'Las envolventes son y=±e^(−pt). Los ceros siguen en t=kπ/4 y no dependen de p, pero los máximos se desplazan respecto de los de una sinusoide sin amortiguar.',
  'La derivada se anula cuando 4cos4t−p sin4t=0. La función satisface y″+2py′+(p²+16)y=0, una ecuación lineal de oscilación amortiguada.',
  'Calcula en qué tiempo la envolvente se reduce a la mitad de su valor inicial.',
  'e^(−pt)=1/2 implica t=log 2/p. Aumentar el amortiguamiento reduce ese tiempo.', { ...graphOptions, ranges: [[0, 10]], parameter: { label: 'Amortiguamiento (p)', min: 0.1, max: 1.5, step: 0.05, value: 0.35 } });
add('exponential-curve', 'Curva exponencial', 'parametric', String.raw`x=t,\quad y=e^{pt}`, 'return [t, Math.exp(p * t)];', [-4.5, 4.5, -0.5, 8], W('ExponentialFunction'),
  'La curva exponencial expresa una tasa de variación proporcional al valor actual. Aparece en modelos de crecimiento continuo y, al cambiar el signo del coeficiente, de decaimiento.',
  'En este explorador p es positivo: la función es estrictamente creciente y convexa. Pasa siempre por (0,1) y tiene el eje horizontal como asíntota hacia la izquierda.',
  'La derivada es p e^(pt), por lo que la razón y′/y es constante. La propiedad y(t+s)=y(t)y(s) permite relacionar avances iguales del argumento con factores multiplicativos iguales.',
  'Calcula el intervalo necesario para duplicar el valor cuando p=0.5.',
  'La condición e^(0.5Δt)=2 da Δt=2log 2. Este intervalo no depende del punto de partida.', { ...graphOptions, parameter: { label: 'Tasa de crecimiento (p)', min: 0.2, max: 1.5, step: 0.05, value: 0.5 }, related: 'exponentials-logarithms', relatedTitle: 'Exponenciales y logaritmos' });
add('logarithmic-curve', 'Curva logarítmica', 'parametric', String.raw`x=t,\quad y=\log_p t=\frac{\ln t}{\ln p},\quad t>0`, 'return [t, Math.log(t) / Math.log(p)];', [-0.5, 6.5, -4, 4], W('Logarithm'),
  'La curva logarítmica convierte productos en sumas e invierte un crecimiento exponencial. Su dominio positivo y su asíntota vertical son partes esenciales de su geometría.',
  'El explorador usa bases p>1. La función pasa por (1,0), es creciente y cóncava. La derivada es 1/(t ln p) y el eje vertical es una asíntota.',
  'La identidad log_p(ab)=log_p a+log_p b explica su utilidad para comparar escalas multiplicativas. Cambiar la base solo multiplica todas las alturas por una constante.',
  'Localiza el punto de altura uno y explica qué ocurre al cambiar la base.',
  'log_p p=1: el punto es (p,1). La intersección (1,0) permanece fija para cualquier base válida.', { ...graphOptions, ranges: [[0.05, 6]], parameter: { label: 'Base del logaritmo (p)', min: 1.2, max: 5, step: 0.1, value: 2 }, related: 'exponentials-logarithms', relatedTitle: 'Exponenciales y logaritmos' });
add('logistic-curve', 'Curva logística', 'parametric', String.raw`x=t,\quad y=\frac1{1+e^{-pt}}`, 'return [t, 1 / (1 + Math.exp(-p * t))];', [-6, 6, -0.2, 1.2], W('LogisticFunction'),
  'La curva logística describe una transición suave entre dos niveles. Es un modelo de crecimiento limitado y una transformación utilizada para expresar probabilidades.',
  'Sus valores están entre cero y uno. Tiene asíntotas horizontales en esos niveles y un punto de inflexión en (0,1/2). La simetría central se expresa como y(−t)=1−y(t).',
  'La derivada cumple y′=py(1−y). Por tanto, el crecimiento es más rápido cuando y=1/2, con pendiente p/4. Cerca de los niveles límite la tasa se reduce.',
  'Calcula los argumentos correspondientes a las alturas 1/4 y 3/4.',
  'Invertir la expresión da t=log[y/(1−y)]/p. Las alturas indicadas corresponden a −log 3/p y log 3/p.', { ...graphOptions, ranges: [[-5, 5]], parameter: { label: 'Tasa logística (p)', min: 0.3, max: 3, step: 0.1, value: 1 } });
add('gompertz-curve', 'Curva de Gompertz', 'parametric', String.raw`x=t,\quad y=\exp(-e^{-pt})`, 'return [t, Math.exp(-Math.exp(-p * t))];', [-5, 5, -0.2, 1.2], W('GompertzCurve'),
  'La curva de Gompertz representa un crecimiento limitado y asimétrico. A diferencia de la logística, no reparte la transición de la misma manera alrededor de su punto de inflexión.',
  'La función es creciente y tiene límites cero y uno en los dos extremos. En t=0 vale 1/e, que es también la altura del punto de inflexión.',
  'Su derivada puede escribirse y′=−py log y. La segunda derivada cambia de signo cuando e^(−pt)=1. Esa condición sitúa la inflexión en t=0 y muestra la asimetría de sus dos colas.',
  'Compara la altura y la pendiente centrales de Gompertz y de la logística con p=1.',
  'Gompertz tiene altura 1/e y pendiente 1/e; la logística tiene altura 1/2 y pendiente 1/4. No son la misma sigmoide.', { ...graphOptions, parameter: { label: 'Tasa de crecimiento (p)', min: 0.3, max: 2.5, step: 0.1, value: 1 } });
add('hyperbolic-tangent-curve', 'Curva tangente hiperbólica', 'parametric', String.raw`x=t,\quad y=\tanh(pt)`, 'return [t, Math.tanh(p * t)];', [-5, 5, -1.5, 1.5], W('HyperbolicTangent'),
  'La tangente hiperbólica produce una transición impar entre dos niveles opuestos. Está relacionada con la logística mediante un cambio de escala y una traslación vertical.',
  'Su imagen es (−1,1). Tiene asíntotas horizontales ±1, pasa por el origen y su pendiente central es p. La función es creciente para p>0.',
  'La identidad tanh z=(e^(2z)−1)/(e^(2z)+1) demuestra que tanh(pt)=2L(2pt)−1, donde L es la logística de tasa unidad. Su derivada es p sech²(pt).',
  'Encuentra el argumento donde la altura es 1/2.',
  'La inversa da t=atanh(1/2)/p=log 3/(2p). La altura −1/2 se alcanza en el argumento opuesto.', { ...graphOptions, parameter: { label: 'Pendiente central (p)', min: 0.3, max: 3, step: 0.1, value: 1 } });
add('sinc-curve', 'Curva sinc', 'parametric', String.raw`x=t,\quad y=\frac{\sin(pt)}{pt},\quad y(0)=1`, 'const z = p * t; return [t, Math.abs(z) < 1e-8 ? 1 : Math.sin(z) / z];', [-11, 11, -0.5, 1.5], W('SincFunction'),
  'La curva sinc combina una elevación central con oscilaciones que disminuyen. Es fundamental en análisis de señales y en fórmulas de reconstrucción a partir de muestras.',
  'Se utiliza la convención no normalizada sin z/z, prolongada con valor uno en cero. La función es par y sus ceros no centrales están en t=kπ/p.',
  'Los extremos fuera del origen satisfacen z cos z−sin z=0. Las envolventes ±1/|z| acotan la amplitud lejos del centro, pero no describen las posiciones exactas de los máximos.',
  'Calcula la anchura del lóbulo central entre sus dos primeros ceros.',
  'Los ceros son −π/p y π/p, de modo que la anchura es 2π/p. Aumentar p estrecha el lóbulo.', { ...graphOptions, ranges: [[-10, 10]], parameter: { label: 'Escala horizontal (p)', min: 0.5, max: 3, step: 0.1, value: 1 }, domain: 'La convención usada es sinc(z)=sin z/z, sin incluir un factor π en su argumento. El valor en cero se define por continuidad.' });
add('error-function-curve', 'Curva de la función error', 'parametric', String.raw`x=t,\quad y=\operatorname{erf}(pt)=\frac2{\sqrt\pi}\int_0^{pt}e^{-s^2}\,ds`, 'const z = p * t, n = 160, h = z / n; let sum = 1 + Math.exp(-z * z); for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * Math.exp(-((i * h) ** 2)); return [t, 2 * h * sum / (3 * Math.sqrt(Math.PI))];', [-4, 4, -1.5, 1.5], 'https://dlmf.nist.gov/7.2',
  'La función error es una integral acumulada de una campana gaussiana. Su gráfica es una transición suave ligada a la difusión y a probabilidades de la distribución normal.',
  'Es impar, creciente y tiene límites ±1. La pendiente en el origen es 2p/√π. Su derivada es una gaussiana, lo que permite relacionar la forma sigmoide con una campana.',
  'La integral se aproxima en el explorador mediante Simpson compuesto. La relación con la normal estándar es Φ(x)=[1+erf(x/√2)]/2; las distintas escalas del argumento importan.',
  'Explica por qué la función error tiene un punto de inflexión en el origen.',
  'La segunda derivada es −4p³t e^(−p²t²)/√π y cambia de signo al cruzar t=0.', { ...graphOptions, ranges: [[-3, 3]], parameter: { label: 'Escala del argumento (p)', min: 0.5, max: 2, step: 0.1, value: 1 }, domain: 'La función está definida para todo argumento real. El gráfico emplea una cuadratura de Simpson con 160 subintervalos por punto.' });
add('gudermannian-curve', 'Curva gudermanniana', 'parametric', String.raw`x=t,\quad y=2\arctan\!\left(\tanh\frac{pt}{2}\right)`, 'return [t, 2 * Math.atan(Math.tanh(p * t / 2))];', [-6, 6, -2, 2], W('Gudermannian'),
  'La gudermanniana conecta funciones trigonométricas e hiperbólicas sin introducir números complejos. Su gráfica transforma toda la recta en un intervalo angular finito.',
  'Es impar y creciente, con límites ±π/2. Su derivada es p sech(pt) y la pendiente central p. Las identidades sin(gd z)=tanh z y tan(gd z)=sinh z expresan su papel de puente.',
  'La forma 2atan(tanh(z/2)) evita invertir funciones con valores fuera de su dominio. Al crecer z, la tangente hiperbólica tiende a uno y la imagen se aproxima a π/2.',
  'Encuentra el argumento para el que la altura es π/4.',
  'tan(π/4)=1=sinh(pt), luego t=asinh(1)/p=log(1+√2)/p.', { ...graphOptions, ranges: [[-5, 5]], parameter: { label: 'Escala del argumento (p)', min: 0.5, max: 2, step: 0.1, value: 1 } });

group = 'Polinomios, funciones especiales y densidades';
const polynomialOptions = { parameter: { label: 'Grado entero (p)', min: 1, max: 10, step: 1, value: 5 }, ranges: [[-1, 1]], related: 'polynomial-interpolation', relatedTitle: 'Interpolación polinómica', relatedActivity: 'Compara la distribución de ceros y la oscilación de cada base polinómica.' };
add('chebyshev-curve', 'Curva de Chebyshev', 'parametric', String.raw`x=t,\quad y=T_p(t),\quad T_0=1,\ T_1=t,\ T_{n+1}=2tT_n-T_{n-1}`, 'let previous = 1, current = t; for (let n = 1; n < p; n++) { const next = 2 * t * current - previous; previous = current; current = next; } return [t, current];', [-1.3, 1.3, -1.5, 1.5], 'https://dlmf.nist.gov/18.5',
  'La gráfica de un polinomio de Chebyshev oscila de forma controlada entre menos uno y uno. Estos polinomios son importantes en aproximación y elección de nodos de interpolación.',
  'En [−1,1] se cumple T_n(cos θ)=cos(nθ). El polinomio de grado n tiene n ceros interiores y n+1 extremos alternantes de módulo uno.',
  'La recurrencia evita calcular explícitamente todos los coeficientes. Los ceros son cos[(2k−1)π/(2n)], concentrados cerca de los extremos del intervalo; esa distribución ayuda a reducir oscilaciones de interpolación.',
  'Calcula T₃(t) a partir de la recurrencia y encuentra sus ceros.',
  'T₂=2t²−1 y T₃=4t³−3t. Sus ceros son 0 y ±√3/2.', polynomialOptions);
add('legendre-curve', 'Curva de Legendre', 'parametric', String.raw`x=t,\quad y=P_p(t),\quad (n+1)P_{n+1}=(2n+1)tP_n-nP_{n-1}`, 'let previous = 1, current = t; for (let n = 1; n < p; n++) { const next = ((2 * n + 1) * t * current - n * previous) / (n + 1); previous = current; current = next; } return [t, current];', [-1.3, 1.3, -1.5, 1.5], 'https://dlmf.nist.gov/18.9',
  'Los polinomios de Legendre forman una base ortogonal en el intervalo [−1,1]. Sus gráficas permiten estudiar oscilaciones y construir fórmulas de cuadratura de Gauss.',
  'P_n(1)=1 y P_n(−1)=(−1)^n. Los n ceros son reales, simples e interiores al intervalo. La paridad de la función coincide con la paridad del grado.',
  'La ortogonalidad usa peso constante uno: la integral del producto de grados distintos se anula. A diferencia de Chebyshev, los extremos interiores no tienen todos la misma altura.',
  'Obtén P₂(t) y calcula la integral de ese polinomio entre −1 y uno.',
  'P₂=(3t²−1)/2. Su integral es cero, como exige la ortogonalidad con P₀=1.', polynomialOptions);
add('hermite-probabilist-curve', 'Curva de Hermite probabilista', 'parametric', String.raw`x=t,\quad y=\operatorname{He}_p(t),\quad \operatorname{He}_{n+1}=t\operatorname{He}_n-n\operatorname{He}_{n-1}`, 'let previous = 1, current = t; for (let n = 1; n < p; n++) { const next = t * current - n * previous; previous = current; current = next; } return [t, current];', [-3.5, 3.5, -25, 25], 'https://dlmf.nist.gov/18.3',
  'Los polinomios de Hermite probabilistas están asociados al peso gaussiano. Conviene indicar la convención porque los polinomios de Hermite usados en física tienen coeficientes y escalas diferentes.',
  'He₀=1 y He₁=t. Los polinomios tienen paridad alternante y todos sus ceros son reales. Su ortogonalidad se define sobre toda la recta con peso e^(−t²/2).',
  'La recurrencia genera He₂=t²−1, He₃=t³−3t y He₄=t⁴−6t²+3. El crecimiento lejos del origen es polinómico; la gráfica mostrada no incluye el peso gaussiano.',
  'Calcula el valor en el origen para grados dos, tres y cuatro.',
  'Los valores son −1, 0 y 3. Los grados impares se anulan en cero por su simetría impar.', { ...polynomialOptions, parameter: { label: 'Grado entero (p)', min: 1, max: 6, step: 1, value: 4 }, ranges: [[-3, 3]], domain: 'Se utiliza la convención probabilista Heₙ, no Hₙ. El intervalo dibujado es [−3,3]; los polinomios están definidos en toda la recta.' });
add('laguerre-curve', 'Curva de Laguerre', 'parametric', String.raw`x=t,\quad y=L_p(t),\quad (n+1)L_{n+1}=(2n+1-t)L_n-nL_{n-1}`, 'let previous = 1, current = 1 - t; for (let n = 1; n < p; n++) { const next = ((2 * n + 1 - t) * current - n * previous) / (n + 1); previous = current; current = next; } return [t, current];', [-0.5, 9, -6, 6], 'https://dlmf.nist.gov/18.9',
  'Los polinomios de Laguerre forman una familia ortogonal en la semirrecta positiva con peso exponencial. Aparecen en cuadratura y en problemas físicos con coordenadas radiales.',
  'L_n(0)=1 para todos los grados de la convención ordinaria. Sus ceros son positivos y simples. El polinomio está definido para todo argumento real, aunque la ortogonalidad usa [0,∞).',
  'La recurrencia parte de L₀=1 y L₁=1−t. El peso e^(−t) hace converger las integrales de productos, pese al crecimiento polinómico de las funciones.',
  'Obtén L₂(t) y sus dos ceros.',
  'L₂=1−2t+t²/2. Sus raíces son 2−√2 y 2+√2, ambas positivas.', { ...polynomialOptions, parameter: { label: 'Grado entero (p)', min: 1, max: 8, step: 1, value: 3 }, ranges: [[0, 8]], domain: 'Se representa Laguerre ordinario, con parámetro α=0. El tramo [0,8] puede omitir los ceros más alejados de los grados altos.' });
add('bessel-j0-curve', 'Curva de Bessel J₀', 'parametric', String.raw`x=t,\quad y=pJ_0(t),\quad J_0(t)=\sum_{k=0}^{\infty}\frac{(-1)^k(t^2/4)^k}{(k!)^2}`, 'let term = 1, sum = 1; for (let k = 1; k <= 70; k++) { term *= -(t * t / 4) / (k * k); sum += term; if (Math.abs(term) < 1e-14) break; } return [t, p * sum];', [-13, 13, -1.5, 2], 'https://dlmf.nist.gov/10.2',
  'La función de Bessel J₀ describe oscilaciones con simetría cilíndrica. Su gráfica tiene una elevación central y oscilaciones cuya amplitud disminuye al alejarse del origen.',
  'J₀ es par y vale uno en cero. Satisface t²y″+ty′+t²y=0. Sus ceros no están uniformemente espaciados, aunque la separación se aproxima a π lejos del origen.',
  'El explorador evalúa la serie de potencias mediante una recurrencia entre términos. El intervalo se limita a |t|≤12 para controlar la cancelación numérica de esa evaluación directa.',
  'Obtén los primeros tres términos de la expansión cerca del origen.',
  'J₀(t)=1−t²/4+t⁴/64+… . La pendiente inicial es cero y la curvatura de la gráfica depende de su segunda derivada.', { ...graphOptions, ranges: [[-12, 12]], domain: 'J₀ se aproxima con su serie de potencias en |t|≤12. p multiplica la amplitud, sin cambiar los ceros ni la ecuación diferencial homogénea.' });
add('airy-ai-curve', 'Curva de Airy Ai', 'parametric', String.raw`x=t,\quad y=p\operatorname{Ai}(t),\quad \operatorname{Ai}''(t)=t\operatorname{Ai}(t)`, 'const n = Math.max(1, Math.ceil(Math.abs(t) / 0.008)), h = t / n; let x = 0, y = 0.3550280538878172, v = -0.2588194037928068; for (let i = 0; i < n; i++) { const k1y = v, k1v = x * y, k2y = v + h * k1v / 2, k2v = (x + h / 2) * (y + h * k1y / 2), k3y = v + h * k2v / 2, k3v = (x + h / 2) * (y + h * k2y / 2), k4y = v + h * k3v, k4v = (x + h) * (y + h * k3y); y += h * (k1y + 2 * k2y + 2 * k3y + k4y) / 6; v += h * (k1v + 2 * k2v + 2 * k3v + k4v) / 6; x += h; } return [t, p * y];', [-8.5, 4.5, -0.8, 1], 'https://dlmf.nist.gov/9.2',
  'La función de Airy Ai cambia de un régimen oscilatorio a uno de decaimiento al cruzar una región de transición. Aparece en problemas de ondas y aproximaciones cerca de puntos de retorno.',
  'Ai satisface y″=ty. La solución Ai decae hacia la derecha, mientras que la otra solución independiente Bi crece. Hacia los argumentos negativos, Ai presenta oscilaciones.',
  'El modelo integra numéricamente la ecuación mediante Runge–Kutta de cuarto orden, partiendo de Ai(0)≈0.3550280539 y Ai′(0)≈−0.2588194038. El intervalo positivo se limita para evitar amplificar errores de la solución creciente.',
  'Explica por qué t=0 es un punto de inflexión de la gráfica.',
  'La ecuación da Ai″(0)=0. Como Ai es positiva cerca del origen, el signo de Ai″ coincide allí con el de t y cambia al cruzar cero.', { ...graphOptions, ranges: [[-8, 4]], domain: 'Se muestra una aproximación numérica en [−8,4] mediante RK4 con paso máximo 0.008. p multiplica la amplitud. No se extrapola este integrador al régimen positivo lejano.' });
add('dawson-curve', 'Curva de Dawson', 'parametric', String.raw`x=t,\quad y=p\,e^{-t^2}\int_0^t e^{s^2}\,ds`, 'const n = 240, h = t / n; let sum = 1 + Math.exp(t * t); for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * Math.exp((i * h) ** 2); return [t, p * Math.exp(-t * t) * h * sum / 3];', [-4.5, 4.5, -1, 1], 'https://dlmf.nist.gov/7.2',
  'La integral de Dawson combina una exponencial decreciente con una integral de exponenciales crecientes. El resultado tiene dos elevaciones opuestas y colas que se acercan al eje.',
  'La función es impar y se anula en el origen. Satisface F′(t)=1−2tF(t). Para argumentos grandes, su primer comportamiento asintótico es F(t)≈1/(2t).',
  'La ecuación diferencial se obtiene derivando el producto de la definición. El explorador usa Simpson compuesto en |t|≤4; la expresión directa no es adecuada para argumentos enormes por riesgo de desbordamiento.',
  'Calcula la pendiente de la gráfica en el origen y la condición de sus extremos.',
  'F′(0)=1, por lo que la pendiente dibujada es p. Fuera del origen los extremos cumplen F(t)=1/(2t).', { ...graphOptions, ranges: [[-4, 4]], domain: 'Se utiliza cuadratura de Simpson con 240 subintervalos en [−4,4]. La función de Dawson se evalúa antes de aplicar la amplitud p.' });
const gammaImport = "import { gamma } from 'src/app/shared/math/gamma';\n";
add('beta-density-curve', 'Curva de densidad beta', 'parametric', String.raw`x=t,\quad y=\frac{\Gamma(p+3)}{\Gamma(p)\Gamma(3)}t^{p-1}(1-t)^2,\quad 0\le t\le1`, 'return [t, gamma(p + 3) / (gamma(p) * gamma(3)) * t ** (p - 1) * (1 - t) ** 2];', [-0.1, 1.1, -0.5, 4], 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda366h.htm',
  'La densidad beta describe perfiles probabilísticos sobre un intervalo limitado. Sus dos parámetros permiten representar formas simétricas o inclinadas; este explorador fija el segundo en tres.',
  'El primer parámetro es p≥1. La integral de la densidad es uno y el soporte es [0,1]. Para p>1 se anula en los dos extremos; para p=1 toma valor tres en el extremo izquierdo.',
  'El factor de normalización se obtiene mediante la función beta, B(p,3)=Γ(p)Γ(3)/Γ(p+3). Para p>1, el máximo interior se sitúa en (p−1)/(p+1).',
  'Encuentra la posición del máximo para p=3 y decide si la densidad es simétrica.',
  'El máximo está en 1/2. Ambos parámetros son tres, por lo que la densidad es simétrica respecto de x=1/2.', { imports: gammaImport, ranges: [[0, 1]], parameter: { label: 'Primer parámetro de forma (p)', min: 1, max: 6, step: 0.1, value: 3 }, domain: 'Densidad beta con parámetros (p,3), p≥1. Fuera de [0,1] la densidad es cero; el explorador dibuja solamente su soporte.', sourceTitle: 'NIST · Engineering Statistics Handbook', related: 'continuous-random-variables', relatedTitle: 'Variables aleatorias continuas', relatedActivity: 'Recuerda que las probabilidades son áreas bajo la densidad, no alturas.' });
add('gamma-density-curve', 'Curva de densidad gamma', 'parametric', String.raw`x=t,\quad y=\frac{t^{p-1}e^{-t}}{\Gamma(p)},\quad t\ge0`, 'return [t, t ** (p - 1) * Math.exp(-t) / gamma(p)];', [-0.5, 12.5, -0.1, 1.2], 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda366b.htm',
  'La densidad gamma modela cantidades positivas, como tiempos de espera acumulados. El parámetro de forma desplaza el máximo y cambia la asimetría del perfil.',
  'Se fija la escala en uno y se usa p≥1. La integral total es uno. Para p=1 se recupera la densidad exponencial e^(−t); para p>1 aparece un máximo interior.',
  'La derivada logarítmica es (p−1)/t−1. Su cero sitúa el máximo en t=p−1. La media es p y la varianza p para la escala unitaria utilizada.',
  'Para p=4, compara la posición del máximo con la media.',
  'El máximo está en t=3 y la media en t=4. Su diferencia refleja la cola extendida hacia valores positivos grandes.', { imports: gammaImport, ranges: [[0, 12]], parameter: { label: 'Forma (p)', min: 1, max: 8, step: 0.1, value: 3 }, domain: 'Densidad gamma de forma p≥1 y escala uno. Se representa [0,12]; la cola continúa hasta infinito.', sourceTitle: 'NIST · Engineering Statistics Handbook', related: 'continuous-random-variables', relatedTitle: 'Variables aleatorias continuas', relatedActivity: 'Relaciona el perfil positivo con su media, su varianza y el área total.' });
add('student-density-curve', 'Curva t de Student', 'parametric', String.raw`x=t,\quad y=\frac{\Gamma((p+1)/2)}{\sqrt{p\pi}\Gamma(p/2)}\left(1+\frac{t^2}{p}\right)^{-(p+1)/2}`, 'return [t, gamma((p + 1) / 2) / (Math.sqrt(p * Math.PI) * gamma(p / 2)) * (1 + t * t / p) ** (-(p + 1) / 2)];', [-6, 6, -0.1, 0.6], 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda3664.htm',
  'La curva t de Student es una campana simétrica con colas más pesadas que la normal. Su forma depende de los grados de libertad y aparece en inferencia con varianza desconocida.',
  'El parámetro p es el número de grados de libertad. La densidad es par y alcanza el máximo en cero. Al aumentar p, su perfil se aproxima al de la normal estándar.',
  'Para p=1 se obtiene la densidad de Cauchy 1/[π(1+t²)]. La media solo existe si p>1 y la varianza solo si p>2: la simetría visual no garantiza que existan esos momentos.',
  'Comprueba la densidad central para p=1 y decide si existe su media.',
  'El valor en cero es 1/π. Es la distribución de Cauchy, cuya media no existe, pese a tener simetría alrededor de cero.', { imports: gammaImport, ranges: [[-5, 5]], parameter: { label: 'Grados de libertad (p)', min: 1, max: 30, step: 1, value: 4 }, sourceTitle: 'NIST · Engineering Statistics Handbook', domain: 'Densidad estándar t con p grados de libertad, ubicación cero y escala uno. La ventana [−5,5] muestra solo parte de sus colas.', related: 'normal-distribution', relatedTitle: 'Distribución normal', relatedActivity: 'Compara el centro y las colas cuando aumenta el número de grados de libertad.' });

group = 'Lazos, perfiles y curvas ornamentales';
add('gerono-lemniscate', 'Lemniscata de Gerono', 'parametric', String.raw`x=p\cos t,\quad y=p\sin t\cos t`, 'return [p * Math.cos(t), p * Math.sin(t) * Math.cos(t)];', [-2, 2, -1.2, 1.2], W('EightCurve'),
  'La lemniscata de Gerono forma un ocho mediante productos trigonométricos. Es distinta de la lemniscata de Bernoulli, aunque ambas compartan una apariencia de dos lóbulos.',
  'La ecuación cartesiana es x⁴=p²(x²−y²). La curva es simétrica respecto de ambos ejes y tiene un nodo en el origen. Sus alturas extremas son ±p/2.',
  'En t=π/2 y t=3π/2, el recorrido pasa dos veces por el origen. Las velocidades tienen direcciones distintas, de modo que el ocho tiene un cruce transversal, no una cúspide.',
  'Calcula las pendientes de las dos tangentes en el punto doble.',
  'x′=−p sin t e y′=p cos2t. En los dos pasos por el origen, las pendientes son uno y menos uno.', { ranges: [[0, 2 * Math.PI]], related: 'lemniscate', relatedTitle: 'Lemniscata de Bernoulli', relatedActivity: 'Compara las ecuaciones y las alturas de dos curvas distintas con forma de ocho.' });
add('bifolium-curve', 'Bifolium', 'implicit', String.raw`(u^2+v^2)^2=4uv^2`, 'return (u * u + v * v) ** 2 - 4 * u * v * v;', [-0.5, 2.2, -1.8, 1.8], W('Bifolium'),
  'El bifolium tiene dos hojas que comparten el origen. Su ecuación cuártica permite generar un contorno de aspecto vegetal mediante una sola relación algebraica.',
  'La curva queda en el semiplano u≥0 y es simétrica respecto del eje horizontal. En coordenadas polares se expresa como r=4cosθ sin²θ.',
  'La ecuación polar se obtiene sustituyendo u=r cosθ y v=r sinθ y cancelando r³ fuera del origen. Los ceros radiales explican por qué las dos hojas se encuentran en un mismo punto.',
  'Encuentra las intersecciones de las hojas con las rectas v=u y v=−u.',
  'Al sustituir v²=u² resulta 4u⁴=4u³. Además del origen, se obtienen (1,1) y (1,−1).');
add('kepler-folium-curve', 'Folium de Kepler', 'implicit', String.raw`(u^2+v^2)(u^2+v^2+2u)=4uv^2`, 'return (u * u + v * v) * (u * u + v * v + 2 * u) - 4 * u * v * v;', [-3, 2, -2, 2], W('KeplersFolium'),
  'El folium de Kepler es una cuártica con una hoja central y pequeños lóbulos laterales. No debe confundirse con el folium de Descartes, que es una cúbica con una asíntota.',
  'La ecuación es par en v. En coordenadas polares, fuera del origen, se obtiene r=−2cosθ cos2θ. El signo del radio es necesario para reconstruir correctamente los lóbulos.',
  'Al sustituir las coordenadas polares, el término cúbico contiene 2cosθ−4cosθ sin²θ=2cosθ cos2θ. Esta identidad permite reducir la relación cuártica a una expresión radial sencilla.',
  'Calcula las intersecciones con el eje horizontal y compáralas con el folium de Descartes.',
  'Con v=0 queda u³(u+2)=0. Aparecen el origen y (−2,0); no se obtiene el punto diagonal del lazo de Descartes.');
add('cruciform-curve', 'Curva cruciforme', 'implicit', String.raw`u^2v^2=u^2+v^2`, 'return u * u * v * v - u * u - v * v;', [-4, 4, -4, 4], W('Cruciform'),
  'La curva cruciforme es una cuártica con cuatro ramas abiertas. Su forma se explica mediante una ecuación recíproca, que revela las asíntotas con facilidad.',
  'Fuera de los ejes cumple 1/u²+1/v²=1. Las ramas satisfacen |u|>1 y |v|>1 y se acercan a las rectas u=±1 y v=±1. El origen es un punto aislado del conjunto polinómico.',
  'La parametrización u=sec t y v=csc t verifica la ecuación. Esa forma solo describe las ramas regulares y no el origen. El trazador de contornos puede omitir el punto aislado, que se comprueba algebraicamente.',
  'Encuentra los puntos de las ramas que tienen coordenadas de igual módulo.',
  'Si u²=v², la ecuación recíproca da 2/u²=1. Los cuatro puntos tienen coordenadas ±√2, con signos independientes.', { domain: 'Se muestra el conjunto real del polinomio. Sus ramas regulares quedan fuera de las bandas |u|≤1 y |v|≤1; el origen es una solución aislada que puede no verse en el trazado de contornos.' });
add('fay-butterfly', 'Mariposa trascendente de Fay', 'parametric', String.raw`q=e^{\cos t}-2\cos4t+\sin^5(t/12),\quad x=pq\sin t,\ y=pq\cos t`, 'const q = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.sin(t / 12) ** 5; return [p * q * Math.sin(t), p * q * Math.cos(t)];', [-6, 6, -6, 6], W('ButterflyCurve'),
  'La mariposa trascendente de Fay combina una exponencial con oscilaciones rápidas y una modulación lenta. Es diferente de la mariposa algebraica descrita por potencias de las coordenadas.',
  'La modulación sin⁵(t/12) necesita un periodo 24π. El intervalo completo permite cerrar exactamente el recorrido elegido. La frecuencia cuatro produce los pliegues principales de las alas.',
  'Las coordenadas usan seno para x y coseno para y, por lo que el dibujo equivale a una convención polar girada. La suma radial puede cambiar de signo y esos valores no se descartan.',
  'Comprueba el cierre en t=0 y t=24π y calcula el punto inicial.',
  'En ambos extremos q=e−2, sin t=0 y cos t=1. El punto es (0,p(e−2)).', { ranges: [[0, 24 * Math.PI]], domain: 'Se usa la variante con +sin⁵(t/12) recogida en la referencia. El periodo completo de la parametrización es 24π; otras variantes cambian el signo o la orientación.' });
add('gielis-superformula', 'Curva de la superfórmula de Gielis', 'parametric', String.raw`r=\left(|\cos(3t)|^p+|\sin(3t)|^p\right)^{-1/p},\quad x=r\cos t,\ y=r\sin t`, 'const r = (Math.abs(Math.cos(3 * t)) ** p + Math.abs(Math.sin(3 * t)) ** p) ** (-1 / p); return [r * Math.cos(t), r * Math.sin(t)];', [-2, 2, -2, 2], W('Superformula'),
  'La superfórmula de Gielis generaliza perfiles radiales mediante exponentes. Este explorador elige una configuración de doce sectores para mostrar cómo cambia la forma sin modificar su periodicidad.',
  'Se fijan m=12, a=b=1 y n₁=n₂=n₃=p. Para p=2 se obtiene una circunferencia. Otros exponentes producen bordes ondulados o angulosos según el régimen.',
  'El argumento mθ/4 se convierte aquí en 3t. Los valores absolutos garantizan radios reales para exponentes no enteros. Seno y coseno no se anulan a la vez, por lo que el radio está definido.',
  'Calcula el radio en t=0 y t=π/12 para p=4.',
  'En cero el radio es uno. En π/12, las dos potencias suman 1/2, de modo que r=2^(1/4).', { ranges: [[0, 2 * Math.PI]], parameter: { label: 'Exponente común (p)', min: 0.5, max: 6, step: 0.1, value: 4 }, referenceNote: 'Se fija una configuración concreta de la superfórmula general: m=12, a=b=1 y n₁=n₂=n₃=p.' });
add('teardrop-curve', 'Curva de la lágrima', 'parametric', String.raw`x=\cos t,\quad y=\sin t\,\sin^p(t/2)`, 'return [Math.cos(t), Math.sin(t) * Math.max(0, Math.sin(t / 2)) ** p];', [-1.5, 1.5, -1.5, 1.5], W('TeardropCurve'),
  'La curva de la lágrima estrecha uno de los extremos de un contorno ovalado. Un exponente controla el grado de concentración del perfil sin mover sus extremos horizontales.',
  'El recorrido se define en 0≤t≤2π, donde sin(t/2) es no negativo. Tiene simetría respecto del eje horizontal. Para p>0, el extremo (1,0) se afila al aumentar el exponente.',
  'La ecuación implícita es y²=(1−x²)[(1−x)/2]^p. La identidad sin²(t/2)=(1−cos t)/2 permite eliminar el parámetro y delimita el dominio −1≤x≤1.',
  'Calcula las dos alturas donde x=0 y observa cómo varían con p.',
  't=π/2 y 3π/2 dan y=±2^(−p/2). Aumentar p reduce esas alturas, manteniendo los extremos en ±1.', { ranges: [[0, 2 * Math.PI]], parameter: { label: 'Exponente de estrechamiento (p)', min: 0.5, max: 6, step: 0.1, value: 3 } });
add('trigonometric-egg-curve', 'Óvalo ovoide trigonométrico', 'parametric', String.raw`x=\cos t,\quad y=(1+p\cos t)\sin t,\quad 0<p<1`, 'return [Math.cos(t), (1 + p * Math.cos(t)) * Math.sin(t)];', [-1.5, 1.5, -1.8, 1.8], W('Egg'),
  'Un contorno ovoide tiene un extremo más estrecho que el otro. Este artículo construye un modelo trigonométrico explícito, sin atribuirle una ecuación universal a todos los perfiles con forma de huevo.',
  'La curva cumple y²=(1−x²)(1+px)². Es simétrica respecto del eje horizontal, pero no del vertical si p es distinto de cero. Para 0<p<1 el factor 1+px permanece positivo.',
  'La parametrización de una circunferencia se deforma multiplicando su altura por 1+px. Como ese factor no se anula, el contorno es simple y cerrado. Para p=0 se recupera la circunferencia.',
  'Compara el factor vertical cerca del extremo derecho y del izquierdo.',
  'En x=1 el factor es 1+p; en x=−1 es 1−p. La diferencia produce extremos de anchura local distinta.', { ranges: [[0, 2 * Math.PI]], parameter: { label: 'Asimetría (p)', min: 0.1, max: 0.8, step: 0.05, value: 0.35 }, referenceNote: 'La referencia define el concepto geométrico de ovoide. La ecuación trigonométrica del artículo es el modelo explícito seleccionado aquí.' });
add('plateau-curve', 'Curva de Plateau', 'parametric', String.raw`x=2p\cos2t,\quad y=p\frac{\sin3t}{\cos t}`, 'const d = Math.cos(t); if (Math.abs(d) < 1e-7) return [NaN, NaN]; return [2 * p * Math.cos(2 * t), p * Math.sin(3 * t) / d];', [-3.5, 3.5, -5, 5], W('PlateauCurves'),
  'Las curvas de Plateau se construyen mediante cocientes trigonométricos. Su geometría combina lazos y ramas abiertas dependiendo de dos frecuencias enteras.',
  'El ejemplo utiliza m=3 y n=1 en la familia histórica. La coordenada x permanece acotada, mientras y diverge cuando cos t=0. Ambas reflexiones coordenadas conservan el conjunto.',
  'Las fórmulas generales x=p sin[(m+n)t]/sin[(m−n)t] e y=2p sin(mt)sin(nt)/sin[(m−n)t] se simplifican en este caso. Se prolongan las singularidades removibles, pero se conservan los polos reales.',
  'Distingue qué ocurre en t=0 y en t=π/2.',
  'En t=0 la expresión general tiene una indeterminación removible: el punto es (2p,0). En π/2, y diverge y no existe un punto finito.', { ranges: [[0, 2 * Math.PI]], domain: 'Configuración m=3 y n=1. La fórmula simplificada incluye los puntos de continuidad donde la expresión original era 0/0 y excluye los polos de cos t.' });
add('gear-profile-curve', 'Curva de perfil de engranaje', 'parametric', String.raw`r=1+\frac{\tanh(6\sin(pt))}{6},\quad x=r\cos t,\ y=r\sin t`, 'const r = 1 + Math.tanh(6 * Math.sin(p * t)) / 6; return [r * Math.cos(t), r * Math.sin(t)];', [-1.6, 1.6, -1.6, 1.6], W('GearCurve'),
  'La curva de perfil de engranaje dibuja dientes radiales mediante una tangente hiperbólica. Es un modelo visual periódico, no un perfil mecánico de involuta listo para fabricar.',
  'El número entero p controla los dientes. El radio queda entre 5/6 y 7/6, por lo que el contorno no pasa por el origen. La función hiperbólica aplana las partes altas y bajas del perfil.',
  'La frecuencia entera hace que el radio coincida al completar una vuelta. Utilizar un valor no entero podría crear una discontinuidad al cerrar el dibujo; por eso el control se ajusta a enteros.',
  'Calcula el ángulo que separa dos dientes consecutivos cuando p=12.',
  'La separación es 2π/12=π/6, equivalente a 30 grados. El diámetro permanece aproximadamente constante al cambiar el número de dientes.', { ranges: [[0, 2 * Math.PI]], parameter: { label: 'Número entero de dientes (p)', min: 3, max: 20, step: 1, value: 12 }, related: 'circle-involute', relatedTitle: 'Involuta de una circunferencia', relatedActivity: 'Distingue un perfil ornamental de un perfil basado en una construcción mecánica.' });

group = 'Curvas espaciales y sus proyecciones';
const projectionNote = 'El gráfico muestra una proyección ortográfica fija: X=(x−y)/√2 e Y=√(2/3)z−(x+y)/√6. Los ejes de la gráfica corresponden a X e Y; una intersección proyectada no demuestra una intersección en el espacio.';
const projectionCode = 'return [(x - y) / Math.sqrt(2), Math.sqrt(2 / 3) * z - (x + y) / Math.sqrt(6)];';
add('circular-helix-curve', 'Hélice circular', 'parametric', String.raw`x=\cos t,\quad y=\sin t,\quad z=pt`, 'const [x, y, z] = this.spacePoint(t); ' + projectionCode, [-3, 3, -8, 8], W('Helix'),
  'La hélice circular gira alrededor de un cilindro mientras avanza a lo largo de su eje. Añade una tercera coordenada a un movimiento circular y permite estudiar curvatura y torsión constantes.',
  'El radio es uno y el paso vertical por vuelta es 2πp. La rapidez es √(1+p²). Su curvatura vale 1/(1+p²) y su torsión p/(1+p²).',
  'La coordenada vertical crece linealmente, por lo que los puntos de vueltas distintas no coinciden aunque tengan las mismas coordenadas x e y. Una proyección plana puede ocultar esa separación.',
  'Calcula la longitud de una vuelta y el avance vertical para p=0.5.',
  'La longitud es 2π√1.25=π√5 y el avance vertical π. Son magnitudes espaciales, no longitudes medidas en la proyección.', { ranges: [[-3 * Math.PI, 3 * Math.PI]], parameter: { label: 'Avance vertical por radián (p)', min: 0.1, max: 0.7, step: 0.05, value: 0.3 }, domain: projectionNote, explorer: 'Modifica el paso y observa la separación proyectada entre vueltas. La ecuación describe la curva espacial; el dibujo es su proyección ortográfica.', methods: '\n  spacePoint(t: number): [number, number, number] { return [Math.cos(t), Math.sin(t), this.parameter * t]; }\n' });
add('conical-helix-curve', 'Hélice cónica', 'parametric', String.raw`x=t\cos t,\quad y=t\sin t,\quad z=pt,\quad t\ge0`, 'const [x, y, z] = this.spacePoint(t); ' + projectionCode, [-14, 14, -10, 14], W('ConicalSpiral'),
  'La hélice cónica aumenta su radio mientras asciende sobre un cono. Su proyección horizontal es una espiral de Arquímedes, pero el recorrido completo es espacial.',
  'Se cumple x²+y²=t² y z=pt, luego z=p√(x²+y²) para t≥0. El parámetro p cambia la apertura del cono, no la frecuencia angular.',
  'La rapidez es √(1+p²+t²): el recorrido no tiene velocidad constante con este parámetro. Al aumentar t crece tanto el radio como la distancia recorrida durante cada vuelta.',
  'Calcula el radio y la altura al completar dos vueltas con p=0.5.',
  'En t=4π, el radio es 4π y la altura 2π. La relación altura/radio permanece igual a p.', { ranges: [[0, 4 * Math.PI]], parameter: { label: 'Relación altura/radio (p)', min: 0.2, max: 1, step: 0.05, value: 0.5 }, domain: projectionNote, explorer: 'Cambia la apertura del cono mediante p. El gráfico usa una proyección fija y no representa la distancia espacial entre puntos.', methods: '\n  spacePoint(t: number): [number, number, number] { return [t * Math.cos(t), t * Math.sin(t), this.parameter * t]; }\n', related: 'archimedean-spiral', relatedTitle: 'Espiral de Arquímedes', relatedActivity: 'Compara la proyección sobre el plano horizontal con el recorrido espacial.' });
add('viviani-curve', 'Curva de Viviani', 'parametric', String.raw`x=p(1+\cos t),\quad y=p\sin t,\quad z=2p\sin(t/2)`, 'const [x, y, z] = this.spacePoint(t); ' + projectionCode, [-3, 4, -4, 3], W('VivianisCurve'),
  'La curva de Viviani es la intersección de una esfera con un cilindro tangente a ella. Sus dos lóbulos pertenecen al espacio y pueden verse de formas muy diferentes según la proyección.',
  'La esfera cumple x²+y²+z²=4p² y el cilindro (x−p)²+y²=p². La parametrización tiene periodo 4π y pasa dos veces por (2p,0,0), formando un punto doble.',
  'La identidad 1−cos t=2sin²(t/2) verifica la ecuación de la esfera. La coordenada z conserva el signo durante cada lóbulo y separa las partes superior e inferior.',
  'Verifica las dos ecuaciones de las superficies en t=π.',
  'El punto es (0,0,2p). En la esfera da 4p²; en el cilindro, p². Pertenece simultáneamente a ambas superficies.', { ranges: [[0, 4 * Math.PI]], domain: projectionNote, explorer: 'Cambia la escala de la esfera y del cilindro juntos. El dibujo muestra una proyección fija del recorrido tridimensional.', methods: '\n  spacePoint(t: number): [number, number, number] { const p = this.parameter; return [p * (1 + Math.cos(t)), p * Math.sin(t), 2 * p * Math.sin(t / 2)]; }\n' });

module.exports = { curves, generate };
if (require.main === module) generate();
