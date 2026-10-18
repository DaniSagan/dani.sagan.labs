// Authoring only. Each generated article owns its state, calculations and HTML.
const fs=require('node:fs'),path=require('node:path');
const directory=path.join(__dirname,'article-foundations');
const articles=fs.readdirSync(directory).filter(f=>/^\d.*\.json$/.test(f)).flatMap(f=>JSON.parse(fs.readFileSync(path.join(directory,f),'utf8')));
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/{/g,'&#123;').replace(/}/g,'&#125;');
const className=slug=>slug.split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join('')+'ArticleComponent';
const references={
 analysis:['https://ocw.mit.edu/courses/18-100b-real-analysis-spring-2025/resources/lecture-notes/','MIT OpenCourseWare · Análisis real'],
 calculus:['https://openstax.org/books/calculus-volume-3/pages/1-introduction','OpenStax · Cálculo de varias variables'],
 algebra:['https://shoup.net/ntb/','Victor Shoup · Teoría de números y álgebra'],
 'complex-numbers':['https://ocw.mit.edu/courses/18-04-complex-variables-with-applications-spring-2018/pages/lecture-notes/','MIT OpenCourseWare · Variable compleja'],
 'number-theory':['https://shoup.net/ntb/','Victor Shoup · Teoría de números y álgebra'],
 geometry:['https://openstax.org/books/calculus-volume-3/pages/1-introduction','OpenStax · Geometría y cálculo'],
 'dynamical-systems':['https://www.chaosbook.org/','ChaosBook · Sistemas dinámicos'],
 combinatorics:['https://discrete.openmathbooks.org/dmoi4.html','Oscar Levin · Matemática discreta'],
 probability:['https://www.probabilitycourse.com/','Hossein Pishro-Nik · Probabilidad y procesos aleatorios'],
 topology:['https://pi.math.cornell.edu/~hatcher/AT/AT.pdf','Allen Hatcher · Topología algebraica']
};
function generate(){
 const labels={'analysis':'Análisis','algebra':'Álgebra','calculus':'Cálculo','complex-numbers':'Números complejos','number-theory':'Teoría de números','geometry':'Geometría','dynamical-systems':'Sistemas dinámicos','combinatorics':'Combinatoria','probability':'Probabilidad','topology':'Topología'};
 const titles=new Map(require('./test-article-navigation.cjs').inventory().links.map(a=>[a.route,a.name]));for(const a of articles)titles.set(a.slug,a.title);
 for(const a of articles) {
  const dir='src/app/articles/'+a.area+'/'+a.slug;fs.mkdirSync(dir,{recursive:true});
  const cls=className(a.slug),base=dir+'/'+a.slug+'-article.component';
  const n=a.n||['Tamaño n',1,20,1,5],t=a.t||['Parámetro t',0,1,.05,.5];
  const source="import { Component } from '@angular/core';\nimport { LEARNING_IMPORTS } from '../../shared/learning-imports';\nimport { PlotSeries } from '../../shared/learning-plot.component';\nimport { TextLink } from '../../../shared/content/linked-text.component';\n\n"+
  "@Component({ selector: 'app-"+a.slug+"-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './"+a.slug+"-article.component.html', styleUrls: ['../../shared/learning-article.css', './"+a.slug+"-article.component.css'] })\n"+
  "export class "+cls+" {\n  static readonly title = "+JSON.stringify(a.title)+";\n  static readonly route = '"+a.slug+"';\n  n = "+n[4]+";\n  t = "+t[4]+";\n  result = this.calculate();\n  // concept-links:start\n  readonly conceptLinks: readonly TextLink[] = [];\n  // concept-links:end\n\n"+
  "  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {\n    const n = this.n, t = this.t;\n    const rows: [string, number | string][] = [];\n    const points: [number, number][] = [];\n    let note = '';\n    "+a.code+"\n    return { rows, points, note };\n  }\n"+
  "  update(): void { this.result = this.calculate(); }\n  reset(): void { this.n = "+n[4]+"; this.t = "+t[4]+"; this.update(); }\n"+
  "  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }\n"+
  "  get series(): PlotSeries[] { return [{ label: "+JSON.stringify(a.lab)+", points: this.result.points, kind: '" + (a.slug === 'iterated-function-systems' ? 'scatter' : 'line') + "' }]; }\n"+
  "  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {\n    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);\n    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);\n    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;\n    " + (['singular-values-operator-norms','constructible-numbers','curvature-frenet','curve-singularities','affine-transformations','envelopes-evolutes','homeomorphisms-homotopy','schoenflies-winding-number'].includes(a.slug) ? "const cx=(xmin+xmax)/2, cy=(ymin+ymax)/2, w=Math.max(xmax-xmin,(ymax-ymin)*624/284)*1.15,h=w*284/624; return {xmin:cx-w/2,xmax:cx+w/2,ymin:cy-h/2,ymax:cy+h/2};" : "") + "\n    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };\n  }\n}\n";
  fs.writeFileSync(base+'.ts',source);
  const ref=a.reference||references[a.area];
  const html='<span class="article-kicker">Fundamentos / '+esc(labels[a.area])+'</span>\n<h2>'+esc(a.title)+'</h2>\n'+
  '<nav class="article-outline" aria-label="Contenido"><a [routerLink]="[]" fragment="definition">Definición</a> · <a [routerLink]="[]" fragment="reasoning">Justificación</a> · <a [routerLink]="[]" fragment="example">Ejemplo</a> · <a [routerLink]="[]" fragment="lab">Explorar</a> · <a [routerLink]="[]" fragment="exercise">Ejercicio</a></nav>\n'+
  '<h3 id="definition">Definiciones y alcance</h3><p class="dropcap">'+esc(a.definition)+'</p>\n<app-formula expression="'+esc(a.formula)+'" />\n'+
  '<h3 id="reasoning">Por qué funciona y qué exige</h3><p>'+esc(a.argument)+'</p>\n<h3 id="example">Un ejemplo desarrollado</h3><p>'+esc(a.example)+'</p>\n'+
  '<aside class="note"><strong>Hipótesis y errores frecuentes.</strong> '+esc(a.caution)+'</aside>\n'+
  '<section class="math-lab" aria-labelledby="lab"><h4 id="lab">'+esc(a.lab)+'</h4><div class="controls">'+
  '<label><span>'+esc(n[0])+' <output>{{ n }}</output></span><input type="range" min="'+n[1]+'" max="'+n[2]+'" step="'+n[3]+'" [(ngModel)]="n" (ngModelChange)="update()" /></label>'+
  '<label><span>'+esc(t[0])+' <output>{{ t }}</output></span><input type="range" min="'+t[1]+'" max="'+t[2]+'" step="'+t[3]+'" [(ngModel)]="t" (ngModelChange)="update()" /></label></div>'+
  '<div class="table-scroll" aria-live="polite"><table><caption>Resultados del modelo</caption><tbody>@for (row of result.rows; track $index) {<tr><th scope="row">{{ row[0] }}</th><td>{{ format(row[1]) }}</td></tr>}</tbody></table></div>'+
  '@if (result.points.length) {<app-learning-plot description="'+esc(a.lab)+'" [series]="series" [xmin]="bounds.xmin" [xmax]="bounds.xmax" [ymin]="bounds.ymin" [ymax]="bounds.ymax" />}'+
  '<p class="model-note"><app-linked-text [text]="result.note" [links]="conceptLinks" /></p><button type="button" (click)="reset()">Restablecer</button></section>\n'+
  '<h3 id="exercise">Comprueba tu comprensión</h3><p>'+esc(a.question)+'</p><details class="note"><summary>Ver solución razonada</summary><p>'+esc(a.answer)+'</p></details>\n'+
  '<section class="article-activities"><h3>Conexiones para continuar</h3><ul>'+a.related.map(slug=>'<li><a routerLink="/articles/'+slug+'">'+esc(titles.get(slug)||slug)+'</a></li>').join('')+'</ul></section>\n'+
  '<section class="references"><h3>Lectura de referencia</h3><p><a href="'+ref[0]+'" target="_blank" rel="noopener noreferrer">'+esc(ref[1])+'</a>. Referencia para ampliar los enunciados y sus demostraciones.</p></section>\n';
  fs.writeFileSync(base+'.html',html);
  fs.writeFileSync(base+'.css',":host { display: block; min-width: 0; }\n.controls { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; }\n.controls label { min-width: 0; }\n.controls label span { display: block; }\nth { overflow-wrap: anywhere; }\ntd { font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }\n.model-note { font-size: .9rem; }\n@media (max-width: 600px) { .math-lab { padding: 12px; } th, td { padding: .4rem; font-size: .8rem; } }\n");
  const catalog='src/app/articles/'+a.area+'/'+a.area+'-articles.ts';
  let s=fs.readFileSync(catalog,'utf8');
  if(!s.includes("import { "+cls+" }"))s="import { "+cls+" } from './"+a.slug+"/"+a.slug+"-article.component';\n"+s;
  const name=a.area.toUpperCase().replaceAll('-','_')+'_ARTICLES';
  if(!s.includes('  '+cls+','))s=s.replace(new RegExp('(export const '+name+'(?:[^=]*)=\\s*\\[)'), '$1\n  '+cls+',');
  fs.writeFileSync(catalog,s);
 }
 console.log('Created '+articles.length+' independent support articles.');
}
module.exports={articles,generate};
if(require.main===module)generate();
