const fs = require('node:fs'), path = require('node:path');
const groups = require('./additional-problems.cjs');
const { problemNames } = require('./problem-names.cjs');
const root = path.resolve(__dirname, '../src/app');
const esc = text => text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]); }
const articles = new Map();
for(const file of walk(path.join(root,'articles')).filter(f=>f.endsWith('.ts'))) {
  const source=fs.readFileSync(file,'utf8');
  const route=source.match(/static (?:readonly )?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/)?.[1];
  const title=source.match(/static (?:readonly )?title(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/)?.[1];
  const template=source.match(/templateUrl:\s*['"]([^'"]+)/)?.[1];
  if(route&&title&&template) articles.set(route,{title,file:path.resolve(path.dirname(file),template)});
}
articles.set('integration-classical',{title:'Integrales I: técnicas clásicas',file:path.join(root,'articles/calculus/integration/integration-article.component.html')});
const formulas = String.raw`
-47=6(-8)+1
v_5(25!)=\lfloor25/5\rfloor+\lfloor25/25\rfloor=6
7^{-1}\equiv15\pmod{26},\quad x\equiv5\pmod{26}
3600=2^4 3^2 5^2,\quad d\in\{1,8\}
3^{2026}\equiv4\pmod7
n=32+35t,\quad t\in\mathbb Z
0.\overline{27}=\frac3{11}
a^2+b^2\not\equiv3\pmod4
\frac{43}{19}=2+\cfrac1{3+\cfrac1{1+\cfrac14}}
\sqrt3\notin\mathbb Q
x=\frac72,\quad x\ne2
x^3-2x^2-x+2=(x-2)(x-1)(x+1)
x\in(-\infty,-2)\cup[1,\infty)
x^2-6x+13=(x-3)^2+4
ab\le25,\quad a+b=10
(5,1)=3(1,1)+2(1,-1)
\ker T=\operatorname{span}\{(-1,1,-1)\},\quad\operatorname{im}T=\mathbb R^2
e_1=\frac{(1,1,0)}{\sqrt2},\quad e_2=\frac{(1,-1,2)}{\sqrt6}
S(c)=3(c-5)^2+26
\begin{pmatrix}2&1\\1&1\end{pmatrix}^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}
h=12\frac{1.5}{2}=9\ \mathrm m
r=2,\quad R=5
l=6\ \mathrm{cm},\quad A=54\sqrt3\ \mathrm{cm}^2
A'=375\ \mathrm{cm}^2,\quad V'=312.5\ \mathrm{cm}^3
G=\frac{1(0,0)+2(6,0)+3(0,4)}6=(2,2)
r=3,\quad R=3\sqrt3
u\times v=(-1,-1,1),\quad z=x+y
P=6\sqrt2,\quad A=2\sqrt3
E=12,\quad V=6,\quad V-E+F=2
PT=\sqrt{13^2-5^2}=12
\theta=\frac{5\pi}6,\quad s=25\pi\ \mathrm{cm}
x\in\left\{\frac\pi6,\frac{5\pi}6,\frac{7\pi}6,\frac{11\pi}6\right\}
\arcsin\left(\sin\frac{5\pi}6\right)=\frac\pi6
c=\sqrt{39},\quad A=\frac{35\sqrt3}4
C=105^\circ,\quad b=6\sqrt2
(2+3i)(1-2i)=8-i,\quad |8-i|=\sqrt{65}
\frac{3+i}{1-i}=1+2i
z\in\{2,-1+i\sqrt3,-1-i\sqrt3\}
z\mapsto iz,\quad i^4=1
(x-2)^2+(y+1)^2=9,\quad x=2\pm2\sqrt2\text{ si }y=0
\sum_{k=0}^{10}2^k=2^{11}-1=2047
\lim_{n\to\infty}\frac{3n^2-n+4}{2n^2+5}=\frac32
\left|\frac{(-1)^n}{n+1}\right|\longrightarrow0
a_n=2100(1.01)^n-2000
\sum_{n=1}^\infty\frac1{(n+1)(n+2)}=\frac12,\quad R_N=\frac1{N+2}
\lim_{x\to0}\frac{\sqrt{1+x}-1}{x}=\frac12
\lim_{x\to3}\frac{x^2-9}{x-3}=6=k
\exists!c\in(0,1):c^3+c-1=0
\sum_{n=1}^\infty\frac1{n^2+n+1}<\infty
x_n=2-\frac2{4^n},\quad |x_n-2|=\frac2{4^n}
f'(x)=\lim_{h\to0}(2x+h+3)=2x+3
y=2+\frac{x-4}4,\quad\sqrt{4.1}\approx2.025
g'(x)=24x(3x^2+1)^3,\quad g'(1)=1536
x+\frac9x-6=\frac{(x-3)^2}x\ge0\quad(x>0)
v(t)=3(t-1)(t-3)
f'(2)=4=\frac{f(3)-f(1)}{3-1}
x_1=\frac{13}6,\quad x_2=\frac{3277}{1521}\approx2.15450
P(t)=500e^{0.2t},\quad T=5\ln2
0<e^{0.1}-1.105<0.000185
f'_-(0)=-1\ne1=f'_+(0)
F(x)=2x^3-2x^2+x+7
\int_0^3(x-1)\,dx=\frac32,\quad\int_0^3|x-1|\,dx=\frac52
\int_0^1 2x(x^2+1)^3\,dx=\frac{15}4
\int_0^1 xe^x\,dx=1
\int_1^\infty\frac{dx}{x^2}=1,\quad\int_R^\infty\frac{dx}{x^2}=\frac1R
V=\pi\int_0^2x^2\,dx=\frac{8\pi}3
L=\int_0^2\sqrt{1+3^2}\,dx=2\sqrt{10}
\overline f=\frac13\int_0^3x^2\,dx=3,\quad c=\sqrt3
T_2=3,\quad I=\frac83,\quad T_2-I=\frac13
y_2=(1+0.5)^2=2.25<e
P(\text{distintos})=\frac{12}{25}
P(\text{condición}\mid+) =\frac{18}{67}
P(\text{al menos un seis})=1-\left(\frac56\right)^3=\frac{91}{216}
P(X=2)=\binom42\left(\frac13\right)^2\left(\frac23\right)^2=\frac8{27}
P(X=1)=\frac{\binom21\binom62}{\binom83}=\frac{15}{28}
P(N=4)=P(N>4)=\frac1{16}
E(G)=\frac{50+4\cdot10}{100}-2=-1.10\text{ euros}
P(X\le1/2)=\frac14,\quad E(X)=\frac23
P(85\le X\le130)=\Phi(2)-\Phi(-1)=0.81859
P(X_2=A\mid X_0=A)=0.8^2+0.2\cdot0.3=0.70
\overline x:6\longrightarrow12,\quad\operatorname{mediana}:3\longrightarrow3
\sigma^2=5,\quad\sigma=\sqrt5
\overline x=4,\quad\frac1n\sum(x_i-\overline x)^2=\frac83,\quad s^2=4
\mu_F=68,\quad\sigma_F^2=29.16,\quad\sigma_F=5.4
\operatorname{Cov}(X,Y)=\frac13
\widehat y=\frac76+\frac x2,\quad\widehat y(3)=\frac83
E(\overline X)=10,\quad\operatorname{Var}(\overline X)=\frac14
(n_1,n_2,n_3)=(48,24,8)
\widehat p\pm1.96\sqrt{\frac{\widehat p(1-\widehat p)}n}\approx[0.5520,0.6480]
\frac{81+2}{90+10}=0.83>0.43=\frac{19+24}{20+80}
9\cdot9\cdot8\cdot7=4536
\binom73=35
|A\cup B|=35+28-12=51
[x^3](1+2x)^5=\binom53 2^3=80
A\to B\to C\to D\to A\to C
\frac{16+2+4+2}4=6
C_3=2+1+2=5
\{(-1,0),(0,0),(1,0)\}\mapsto\{(0,-1),(0,0),(0,1)\}
T=C\sqrt{L/g}
\frac{v_2}{v_1}=\frac12,\quad\frac{T_2}{T_1}=8
`.trim().split('\n');
if(formulas.length!==100 || groups.reduce((n,g)=>n+g.entries.length,0)!==100) throw Error('Expected 100 authored exercises and formulas');
let index=0;
const incoming = new Map();
for(const g of groups) {
  const catalog=path.join(root,'problems',g.folder,`${g.folder}-problems.ts`);
  let source=fs.readFileSync(catalog,'utf8');
  // Idempotently remove only imports/list entries produced by this generator.
  for (const entry of g.entries) {
    const { className } = problemNames(entry.title);
    source=source.replace(new RegExp(`^import \\{ ${className} \\}[^\\n]*\\n`, 'gm'), '')
      .replace(new RegExp(`^  ${className},\\r?\\n`, 'gm'), '');
  }
  const oldFiles=walk(path.join(root,'problems',g.folder)).filter(f=>f.endsWith('component.ts')&&Number(fs.readFileSync(f,'utf8').match(/"number":\s*(\d+)/)?.[1])<=100);
  const category=JSON.parse(fs.readFileSync(oldFiles[0],'utf8').match(/"category":\s*("[^"]+")/)[1]);
  // Use the actual catalogue's thematic order, independently of filesystem ordering.
  const blockSource=fs.readFileSync(path.join(root,'problems/problems.data.ts'),'utf8');
  const blockLine=blockSource.split('\n').find(line=>line.includes(JSON.stringify(category)));
  const orderedTopics=JSON.parse(blockLine.match(/topics:\s*(\[[^\]]+\])/)[1]);
  let imports='', names='';
  g.entries.forEach((e,i)=>{
    const number=101+index, id=`problema-${number}`;
    const { slug, className: cls } = problemNames(e.title);
    // Use integration's dedicated chapter for basic antiderivatives and techniques.
    if(g.folder==='integral-calculus' && e.article==='derivative-foundations') e.article='integration-classical';
    if(e.article==='complex-numbers') e.article=[137,138].includes(number)?'de-moivre':'complex-arithmetic';
    const a=articles.get(e.article); if(!a) throw Error('Unknown article '+e.article);
    const activity=`Practica ${e.title.charAt(0).toLowerCase()+e.title.slice(1)}. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada.`;
    const level=(number===118||number===188||number===190||number===196)?'Oposición':'Repaso';
    let topicIndex=i<5?0:1;
    if(g.folder==='statistics') topicIndex=i<6?0:1;
    if(g.folder==='models-games') topicIndex=i<7?0:1;
    if(g.folder==='differential-calculus') topicIndex=[3,6,7].includes(i)?1:0;
    if(g.folder==='integral-calculus') topicIndex=[0,2,3,4].includes(i)?0:1;
    if(g.folder==='number-theory') topicIndex=[5,6,7,8,9].includes(i)?1:0;
    const problem={id,number,title:e.title,category,topic:orderedTopics[topicIndex],level,statement:e.statement,resources:[{label:a.title,route:'/articles/'+e.article,activity}]};
    const dir=path.join(root,'problems',g.folder,slug); fs.mkdirSync(dir,{recursive:true});
    const existingFile=path.join(dir,`${slug}-problem.component.ts`);
    if(fs.existsSync(existingFile)) {
      const existing=fs.readFileSync(existingFile,'utf8').match(/problem: PracticeProblem = ([\s\S]*?);\s*}/);
      if(existing)for(const resource of JSON.parse(existing[1]).resources) {
        if(!problem.resources.some(current=>current.route===resource.route))problem.resources.push(resource);
      }
    }
    fs.writeFileSync(path.join(dir,`${slug}-problem.component.ts`),`import { Component } from '@angular/core';\nimport { RouterLink } from '@angular/router';\nimport { FormulaComponent } from 'src/app/shared/math/formula/formula.component';\nimport { PracticeProblem } from '../../problem-catalog';\nimport { ProblemNavigationComponent } from '../../shared/problem-navigation.component';\n\n@Component({\n  selector: 'app-${slug}-problem', standalone: true,\n  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],\n  templateUrl: './${slug}-problem.component.html',\n  styleUrl: '../../shared/problem.css',\n})\nexport class ${cls} {\n  static readonly title = ${JSON.stringify(e.title)};\n  static readonly route = '${id}';\n  static readonly problem: PracticeProblem = ${JSON.stringify(problem,null,2)};\n}\n`);
    fs.writeFileSync(path.join(dir,`${slug}-problem.component.html`),`<article class="problem-detail" aria-labelledby="problem-title">\n  <nav class="problem-actions" aria-label="Navegación de problemas"><a routerLink="/problems">← Colección completa</a></nav>\n  <span class="eyebrow">${level==='Oposición'?'Profundización':level}</span>\n  <h2 id="problem-title">${esc(e.title)}</h2>\n  <p class="topic">${esc(category)} · ${esc(problem.topic)}</p>\n  <section class="statement" aria-labelledby="statement-title">\n    <h3 id="statement-title">Enunciado</h3><p>${esc(e.statement)}</p>\n  </section>\n  <section id="problem-solution" class="solution" aria-labelledby="solution-title">\n    <h3 id="solution-title">Solución paso a paso</h3>\n    <ol>\n${e.steps.map(s=>'      <li>'+esc(s)+'</li>').join('\n')}\n    </ol>\n    <p class="answer"><strong>Resultado.</strong> ${esc(e.answer)}</p>\n    <app-formula expression="${esc(formulas[index])}" [showCodeButton]="false" />\n    <aside class="pitfall"><strong>Error frecuente.</strong> ${esc(e.pitfall)}</aside>\n  </section>\n  <section class="resources" aria-labelledby="resources-title">\n    <h3 id="resources-title">Para repasar y ampliar</h3>\n    ${problem.resources.map(resource => `<div class="resource"><a routerLink="${esc(resource.route)}">${esc(resource.label)} ↗</a><p>${esc(resource.activity)}</p></div>`).join("\n    ")}\n  </section>\n  <app-problem-navigation currentId="${id}" />\n</article>\n`);
    imports+=`import { ${cls} } from './${slug}/${slug}-problem.component';\n`; names+=`  ${cls},\n`;
    const key=a.file+'|'+e.article; if(!incoming.has(key)) incoming.set(key,[]);
    incoming.get(key).push(`<li><a routerLink="/problems/${id}">${number} · ${esc(e.title)}</a>. ${esc(e.statement)}</li>`);
    index++;
  });
  source=imports+source.replace(/\] as const;/,names+'] as const;');fs.writeFileSync(catalog,source);
}
for(const [key,links] of incoming) {
  const [file,route]=key.split('|');let source=fs.readFileSync(file,'utf8');
  const marker=`additional-problems:${route}`;
  source=source.replace(new RegExp(`\\n?<!-- ${marker}:start -->[\\s\\S]*?<!-- ${marker}:end -->\\n?`),'');
  const section=`\n<!-- ${marker}:start -->\n${route==='integration-classical'?"@if (chapter.route === 'integration-classical') {\n":''}<section class="article-activities" aria-label="Más problemas resueltos"><h3>Más problemas resueltos</h3><p>Practica estas ideas con soluciones explicadas desde los fundamentos.</p><ul>\n${links.join('\n')}\n</ul></section>${route==='integration-classical'?'\n}':''}\n<!-- ${marker}:end -->\n`;
  fs.writeFileSync(file,source+section);
}
console.log(`Generated ${index} independent problems and ${[...incoming.values()].flat().length} incoming article references in ${incoming.size} articles.`);
