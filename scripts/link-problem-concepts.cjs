// Authoring tool: materialize curated prerequisites as static links in independent pages.
const fs = require('node:fs'), path = require('node:path');
const { concepts, problems: assignments } = require('./problem-concepts.json');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const read = f => fs.readFileSync(f, 'utf8');
const write = (f, s) => { if (!fs.existsSync(f) || read(f) !== s) fs.writeFileSync(f, s); };
const attributes = c => 'routerLink="' + c.route + '"' + (c.fragment ? ' fragment="' + c.fragment + '"' : '');
const link = (c, label = c.label) => '<a ' + attributes(c) + '>' + escape(label) + '</a>';
const marker = 'problem-prerequisites';
const reverseMarker = 'prerequisite-problems';
const pattern = name => new RegExp('\\n?<!-- ' + name + ':start -->[\\s\\S]*?<!-- ' + name + ':end -->\\n?', 'g');
function articleDestinations() {
  const routes = new Map();
  for (const file of walk('src/app/articles').filter(f => f.endsWith('.ts'))) {
    const source = read(file), template = source.match(/templateUrl:\s*['"]([^'"]+)/)?.[1];
    if (!template) continue;
    for (const match of source.matchAll(/static (?:readonly )?route(?:\s*:\s*string)?\s*=\s*['"]([^'"]+)/g)) {
      routes.set('/articles/' + match[1], path.join(path.dirname(file), template));
    }
  }
  for (const name of ['classical', 'advanced', 'numerical']) routes.set('/articles/integration-' + name, 'src/app/articles/calculus/integration/integration-article.component.html');
  return routes;
}
function inlineLinks(html, selected) {
  html = html.replace(/<a data-prerequisite="[^"]+"[^>]*>([^<]*)<\/a>/g, '$1');
  const start = html.indexOf('<section id="problem-solution"');
  const end = html.indexOf('<section class="resources"');
  if (start < 0 || end < start) throw Error('Unknown problem structure');
  const before = html.slice(0, start), after = html.slice(end);
  const used = new Set();
  const terms = selected.flatMap(c => c.terms.map(term => ({ term, c }))).sort((a, b) => b.term.length - a.term.length);
  const byTerm = new Map(terms.map(t => [t.term.toLocaleLowerCase('es'), t]));
  const quote = s => s.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
  const re = new RegExp('(?<![\\p{L}\\p{N}])(?:' + terms.map(t => quote(t.term)).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
  let protectedDepth = 0;
  const body = html.slice(start, end).split(/(<[^>]+>)/g).map(token => {
    if (token.startsWith('<')) {
      if (/^<\/(?:a|app-formula|code|script)\b/i.test(token)) protectedDepth = Math.max(0, protectedDepth - 1);
      else if (/^<(?:a|app-formula|code|script)\b/i.test(token) && !/\/>$/.test(token)) protectedDepth++;
      return token;
    }
    if (protectedDepth || !terms.length) return token;
    return token.replace(re, match => {
      const item = byTerm.get(match.toLocaleLowerCase('es'));
      const key = item.c.route + '#' + (item.c.fragment || '') + ':' + item.term.toLocaleLowerCase('es');
      if (used.has(key)) return match;
      used.add(key);
      return '<a data-prerequisite="' + item.c.id + '" ' + attributes(item.c) + '>' + match + '</a>';
    });
  }).join('');
  return before + body + after;
}
function synchronize() {
  const destinations = articleDestinations(), incoming = new Map(), rows = [];
  let inlineCount = 0;
  for (const file of walk('src/app/problems').filter(f => f.endsWith('problem.component.ts'))) {
    let source = read(file);
    const json = source.match(/problem: PracticeProblem = ([\s\S]*?);\s*}/);
    const problem = JSON.parse(json[1]);
    const keys = assignments[problem.number];
    if (!keys?.length) throw Error('Missing editorial review: ' + problem.number);
    const selected = keys.map(id => ({ id, ...concepts[id] }));
    const htmlFile = file.replace(/\.ts$/, '.html');
    let html = read(htmlFile).replace(pattern(marker), '\n');
    const relevant = new Set(selected.map(c => c.route));
    const removed = problem.resources.filter(r => /^\/(?:tools|games)\//.test(r.route) && !relevant.has(r.route));
    problem.resources = problem.resources.filter(r => !removed.includes(r));
    html = html.replace(/<div class="resource">[\s\S]*?<\/div>/g, block => removed.some(r => block.includes('routerLink="' + r.route + '"')) ? '' : block);
    for (const c of selected) {
      if (!problem.resources.some(r => r.route === c.route)) {
        problem.resources.push({ label: c.label, route: c.route, ...(c.fragment ? { fragment: c.fragment } : {}), activity: c.help });
      }
      if (c.route.startsWith('/articles/')) {
        if (!destinations.has(c.route)) throw Error('Unknown article: ' + c.route);
        if (!incoming.has(c.route)) incoming.set(c.route, []);
        if (!incoming.get(c.route).some(p => p.number === problem.number)) incoming.get(c.route).push(problem);
      } else if (!html.includes('routerLink="' + c.route + '"')) {
        html = html.replace('  <app-problem-navigation', '  <div class="resource prerequisite-practice">' + link(c) + '<p>' + escape(c.help) + '</p></div>\n  <app-problem-navigation');
      }
    }
    const articles = selected.filter(c => c.route.startsWith('/articles/'));
    const section = '\n<!-- ' + marker + ':start -->\n  <section class="prerequisites" aria-label="Conceptos para resolver el problema"><details><summary>Conceptos que puedes repasar</summary><ul>\n' +
      articles.map(c => '    <li>' + link(c) + '. ' + escape(c.help) + '</li>').join('\n') +
      '\n  </ul></details></section>\n<!-- ' + marker + ':end -->\n';
    html = inlineLinks(html, selected);
    html = html.replace(/\s*(<section id="problem-solution")/, section + '  $1');
    html = html.replace(/(\s*<\/section>)\s*(<div class="resource prerequisite-practice">[\s\S]*?<\/div>)(\s*<app-problem-navigation)/, '$2$1$3');
    inlineCount += (html.match(/data-prerequisite=/g) || []).length;
    source = source.replace(json[1], JSON.stringify(problem, null, 2));
    write(file, source);
    write(htmlFile, html.replace(/[ \t]+$/gm, ''));
    rows.push({ number: problem.number, title: problem.title, route: problem.route, concepts: keys });
  }
  for (const file of new Set(destinations.values())) {
    let html = read(file).replace(pattern(reverseMarker), '\n').trimEnd();
    const groups = [...incoming].filter(([route]) => destinations.get(route) === file).sort(([a], [b]) => a.localeCompare(b));
    if (!groups.length) continue;
    const parts = groups.map(([route, problems]) => {
      const body = '<section class="article-activities prerequisite-problems"><details><summary>Problemas que utilizan estos conceptos (' + problems.length + ')</summary><ul>\n' +
        problems.sort((a, b) => a.number - b.number).map(p => '<li><a routerLink="/problems/' + p.route + '">' + p.number + ' · ' + escape(p.title) + '</a></li>').join('\n') +
        '\n</ul></details></section>';
      return route.startsWith('/articles/integration-') ? "@if (chapter.route === '" + route.slice('/articles/'.length) + "') {\n" + body + '\n}' : body;
    });
    write(file, html + '\n<!-- ' + reverseMarker + ':start -->\n' + parts.join('\n') + '\n<!-- ' + reverseMarker + ':end -->\n');
  }
  rows.sort((a, b) => a.number - b.number);
  const used = new Set(rows.flatMap(r => r.concepts));
  const report = '# Auditoría de conceptos previos en los 200 problemas\n\nRevisión editorial del 18 de octubre de 2026. Los identificadores y las rutas descriptivas de los problemas se conservan.\n\n' +
    'Se han seleccionado los fundamentos de cada enunciado y solución, además de enlazar su primera mención textual cuando existe. La ausencia de un término literal no impide que sea un requisito: también se indican las reglas empleadas en las fórmulas. No se insertan enlaces dentro de fórmulas, atributos ni enlaces existentes.\n\n' +
    '**Cobertura:** ' + rows.length + ' problemas, ' + used.size + ' entradas de conceptos y recursos, ' + incoming.size + ' artículos de destino y ' + inlineCount + ' enlaces en los pasos. Los conceptos afines comparten artículo cuando allí ya se explican; las secciones relevantes usan fragmentos.\n\n' +
    '**Huecos resueltos:** artículos independientes polynomial-foundations (grado, coeficientes, mónico, raíces y multiplicidad) y equation-equivalence (dominio, cancelación, signos y soluciones extrañas). Se amplía polynomial-division con Ruffini paso a paso, tabla interactiva y comprobación; se anclan teorema del factor, discriminante y Viète en los artículos existentes.\n\n' +
    'Las herramientas y juegos se eligen según la tarea concreta; se retiran los enlaces prácticos heredados que correspondían a otros ejercicios del mismo bloque. El simulador y la gráfica sirven para explorar y contrastar, no sustituyen una demostración.\n\n' +
    '## Inventario por problema\n\n| Problema | Conceptos y recursos seleccionados |\n| --- | --- |\n' +
    rows.map(r => '| [' + String(r.number).padStart(3, '0') + ' · ' + r.title + '](/problems/' + r.route + ') | ' + r.concepts.map(id => { const c = concepts[id]; return '[' + c.label + '](' + c.route + (c.fragment ? '#' + c.fragment : '') + ')'; }).join(' · ') + ' |').join('\n') +
    '\n\n## Mantenimiento y validación\n\nLa selección explícita está en scripts/problem-concepts.json; node scripts/link-problem-concepts.cjs materializa los enlaces y este informe. No existe un registro de conceptos en ejecución. El generador vuelve a aplicar esta revisión después de regenerar el contenido.\n\nEjecutar npm run test:problem-concepts, npm run test:additional-problems, npm run test:problem-support-articles, la compilación de desarrollo y npm run test:problem-concepts:browser después de compilar.\n';
  write('docs/problem-concepts-audit.md', report);
  console.log('Linked ' + rows.length + ' problems, ' + incoming.size + ' articles, ' + inlineCount + ' inline concept references.');
}
module.exports = { synchronize, articleDestinations };
if (require.main === module) synchronize();
