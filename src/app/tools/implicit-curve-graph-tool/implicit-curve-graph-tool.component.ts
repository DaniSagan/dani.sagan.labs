import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { EXTRA_CONSTANTS, EXTRA_FUNCTIONS, mathCategory } from './math-catalog';
import { CURVE_EXAMPLES, CurveExample, FEATURED_EXAMPLE_IDS } from './curve-examples';
import { GraphableFunction, ImplicitCurveGraphComponent } from '../../widgets/implicit-curve-graph/implicit-curve-graph.component';

@Component({
  selector: 'app-implicit-curve-graph-tool',
  standalone: true,
  imports: [CommonModule, ImplicitCurveGraphComponent, FormsModule, MatTabsModule],
  templateUrl: './implicit-curve-graph-tool.component.html',
  styleUrl: './implicit-curve-graph-tool.component.css'
})
export class ImplicitCurveGraphToolComponent implements AfterViewInit {
  constructor(private readonly changeDetector: ChangeDetectorRef) {}
  @ViewChild('curveGraph', { static: true }) curveGraph!: ImplicitCurveGraphComponent;
  @ViewChild('graphResult', { static: true }) graphResult!: ElementRef<HTMLElement>;
  formula = 'x*x + y*y - 1';
  xMin = -3; xMax = 3; yMin = -3; yMax = 3;
  error = '';
  buttonDescription = 'Pasa el cursor, enfoca o toca un botón para consultar su descripción.';
  describedButton = '';
  catalogSearch = '';
  readonly examples = CURVE_EXAMPLES;
  readonly exampleCategories = ['Destacados', 'Todos', ...new Set(CURVE_EXAMPLES.map(example => example.category))];
  exampleSearch = '';
  exampleCategory = 'Destacados';
  selectedExample: CurveExample | null = null;
  readonly examplePageSize = 48;
  examplePage = 0;
  exampleKind = 'Todos';
  readonly exampleKinds = ['Todos', 'Clásica', 'Variante', 'Composición'];

  get visibleExamples(): CurveExample[] {
    const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const words = normalize(this.exampleSearch.trim()).split(/\s+/).filter(Boolean);
    return this.examples.filter(example =>
      (this.exampleCategory === 'Todos' ||
        (this.exampleCategory === 'Destacados' ? FEATURED_EXAMPLE_IDS.has(example.id) : example.category === this.exampleCategory)) &&
      (this.exampleKind === 'Todos' || example.kind === this.exampleKind) &&
      words.every(word => normalize(`${example.name} ${example.category} ${example.family ?? ''} ${example.description} ${example.formula}`).includes(word)));
  }

  get examplePageCount(): number { return Math.max(1, Math.ceil(this.visibleExamples.length / this.examplePageSize)); }
  get currentExamplePage(): number { return Math.min(this.examplePage, this.examplePageCount - 1); }
  get pagedExamples(): CurveExample[] {
    const start = this.currentExamplePage * this.examplePageSize;
    return this.visibleExamples.slice(start, start + this.examplePageSize);
  }
  resetExamplePage(): void { this.examplePage = 0; }
  changeExamplePage(delta: number): void {
    this.examplePage = Math.max(0, Math.min(this.examplePageCount - 1, this.currentExamplePage + delta));
    const gallery = this.graphResult.nativeElement.parentElement?.querySelector('.example-gallery');
    if (gallery) gallery.scrollTop = 0;
  }
  trackExample(_index: number, example: CurveExample): string { return example.id; }

  selectExample(example: CurveExample): void {
    this.selectedExample = example;
    this.formula = example.formula;
    [this.xMin, this.xMax, this.yMin, this.yMax] = example.bounds;
    this.onRedraw();
    this.graphResult.nativeElement.focus({ preventScroll: true });
    this.graphResult.nativeElement.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  private readonly expressionFunctions: Record<string, (...args: number[]) => number> =
    { ...Object.fromEntries(
      Object.getOwnPropertyNames(Math)
        .filter(name => typeof Math[name as keyof Math] === 'function')
        .map(name => [name, (Math[name as keyof Math] as (...args: number[]) => number).bind(Math)])
    ), ...Object.fromEntries(EXTRA_FUNCTIONS.map(entry => [entry.name, entry.fn])) };

  readonly names = Object.keys(this.expressionFunctions).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  private readonly expressionConstants: Record<string, number> = { ...Object.fromEntries(
    Object.getOwnPropertyNames(Math)
      .filter(name => typeof Math[name as keyof Math] === 'number')
      .map(name => [name, Math[name as keyof Math] as number])
  ), ...Object.fromEntries(EXTRA_CONSTANTS.map(entry => [entry.name, entry.value])) };
  readonly constantNames = Object.keys(this.expressionConstants).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
  readonly constantDescriptions: Record<string, string> = {
    ...Object.fromEntries(EXTRA_CONSTANTS.map(entry => [entry.name, entry.description])),
    E: 'E ≈ 2,71828: número de Euler, base de los logaritmos naturales.',
    PI: 'PI ≈ 3,14159: razón entre la longitud de una circunferencia y su diámetro.',
    LN2: 'LN2 ≈ 0,69315: logaritmo natural de 2.',
    LN10: 'LN10 ≈ 2,30259: logaritmo natural de 10.',
    LOG2E: 'LOG2E ≈ 1,44270: logaritmo en base 2 de E.',
    LOG10E: 'LOG10E ≈ 0,43429: logaritmo en base 10 de E.',
    SQRT1_2: 'SQRT1_2 ≈ 0,70711: raíz cuadrada de 1/2.',
    SQRT2: 'SQRT2 ≈ 1,41421: raíz cuadrada de 2.',
  };
  readonly functionDescriptions: Record<string, string> = {
    ...Object.fromEntries(EXTRA_FUNCTIONS.map(entry => [entry.name, entry.description])),
    abs: 'abs(x): valor absoluto de x.',
    acos: 'acos(x): arco coseno en radianes; x debe estar entre -1 y 1.',
    acosh: 'acosh(x): arco coseno hiperbólico; x debe ser mayor o igual que 1.',
    asin: 'asin(x): arco seno en radianes; x debe estar entre -1 y 1.',
    asinh: 'asinh(x): arco seno hiperbólico.',
    atan: 'atan(x): arco tangente en radianes.',
    atan2: 'atan2(y, x): ángulo en radianes del punto (x, y), teniendo en cuenta el cuadrante.',
    atanh: 'atanh(x): arco tangente hiperbólico; para un resultado finito, -1 < x < 1.',
    cbrt: 'cbrt(x): raíz cúbica de x, incluidos los valores negativos.',
    ceil: 'ceil(x): redondea al entero mayor o igual que x más próximo.',
    clz32: 'clz32(x): número de ceros iniciales de x como entero sin signo de 32 bits.',
    cos: 'cos(x): coseno de un ángulo en radianes.',
    cosh: 'cosh(x): coseno hiperbólico.',
    exp: 'exp(x): e elevado a x.',
    expm1: 'expm1(x): e elevado a x menos 1, con mayor precisión cerca de cero.',
    floor: 'floor(x): redondea al entero menor o igual que x más próximo.',
    fround: 'fround(x): aproxima x a un número de coma flotante de 32 bits.',
    f16round: 'f16round(x): aproxima x a un número de coma flotante de 16 bits.',
    hypot: 'hypot(x, y, …): raíz cuadrada de la suma de los cuadrados de los argumentos.',
    imul: 'imul(a, b): multiplicación de enteros de 32 bits, con resultado de 32 bits con signo.',
    log: 'log(x): logaritmo natural (base e); x debe ser positivo.',
    log10: 'log10(x): logaritmo en base 10; x debe ser positivo.',
    log1p: 'log1p(x): logaritmo natural de 1 + x, con mayor precisión cerca de cero.',
    log2: 'log2(x): logaritmo en base 2; x debe ser positivo.',
    max: 'max(a, b, …): devuelve el mayor de los argumentos.',
    min: 'min(a, b, …): devuelve el menor de los argumentos.',
    pow: 'pow(base, exponente): eleva la base al exponente.',
    random: 'random(): número aleatorio entre 0 (incluido) y 1 (excluido); cambia en cada evaluación.',
    round: 'round(x): redondea al entero más próximo; los empates se resuelven hacia +∞.',
    sign: 'sign(x): devuelve 1 si x es positivo, -1 si es negativo y conserva el cero.',
    sin: 'sin(x): seno de un ángulo en radianes.',
    sinh: 'sinh(x): seno hiperbólico.',
    sqrt: 'sqrt(x): raíz cuadrada; x debe ser mayor o igual que cero.',
    tan: 'tan(x): tangente de un ángulo en radianes.',
    tanh: 'tanh(x): tangente hiperbólica.',
    trunc: 'trunc(x): elimina la parte decimal, truncando hacia cero.',
  };

  private readonly functionCategories = Object.fromEntries(EXTRA_FUNCTIONS.map(entry => [entry.name, entry.category]));
  readonly functionGroups = [...new Set([
    'Álgebra', 'Trigonometría', 'Hiperbólicas', 'Geometría', 'Enteros', 'Ondas y ajustes', 'Estadística', 'Especiales',
    ...EXTRA_FUNCTIONS.map(entry => entry.category)
  ])].map(label => ({
    label,
    names: this.names.filter(name =>
      (this.functionCategories[name] ?? mathCategory(name)) === label)
  }));

  private matchesSearch(text: string): boolean {
    const normalize = (value: string): string => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return normalize(text).includes(normalize(this.catalogSearch.trim()));
  }

  get visibleFunctionGroups(): { label: string; names: string[] }[] {
    return this.functionGroups.map(group => ({
      label: group.label,
      names: group.names.filter(name => this.matchesSearch(`${name} ${group.label} ${this.functionDescriptions[name]}`))
    })).filter(group => group.names.length > 0);
  }

  get visibleConstantNames(): string[] {
    return this.constantNames.filter(name => this.matchesSearch(`${name} constantes ${this.constantDescriptions[name]}`));
  }

  trackGroup(_index: number, group: { label: string }): string { return group.label; }

  showDescription(name: string, constant = false): void {
    this.describedButton = constant ? name : `${name}()`;
    const descriptions = constant ? this.constantDescriptions : this.functionDescriptions;
    this.buttonDescription = descriptions[name] ?? `${constant ? 'Constante' : 'Función'} matemática ${name}.`;
  }

  resetDescription(): void {
    this.describedButton = '';
    this.buttonDescription = 'Pasa el cursor, enfoca o toca un botón para consultar su descripción.';
  }

  insertFunction(input: HTMLInputElement, name: string): void {
    this.showDescription(name);
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    const selectedText = input.value.slice(start, end);
    const insertion = `${name}(${selectedText})`;
    input.setRangeText(insertion, start, end, 'end');
    this.formula = input.value;
    this.error = '';
    input.focus();
    const cursor = start + name.length + 1;
    input.setSelectionRange(cursor, cursor);
  }

  insertConstant(input: HTMLInputElement, name: string): void {
    this.showDescription(name, true);
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.setRangeText(name, start, end, 'end');
    this.formula = input.value;
    this.error = '';
    input.focus();
    const cursor = start + name.length;
    input.setSelectionRange(cursor, cursor);
  }

  ngAfterViewInit(): void {
    this.onRedraw();
    // The initial framing changes the child's axis labels after its first check.
    this.changeDetector.detectChanges();
  }
  onBoundsChange(bounds: [number, number, number, number]): void {
    [this.xMin, this.xMax, this.yMin, this.yMax] = bounds;
  }
  onRedraw(): void {
    this.error = '';
    try {
      if (!this.formula.trim()) throw new Error('Introduce una expresión.');
      const functions = this.names.map(name => this.expressionFunctions[name]);
      const createFunction = new Function(
        ...this.names,
        ...this.constantNames,
        `"use strict"; return (x, y) => (${this.formula});`
      );
      const constants = this.constantNames.map(name => this.expressionConstants[name]);
      const fn = createFunction(...functions, ...constants) as (x: number, y: number) => number;
      if (typeof fn(0.123, 0.456) !== 'number') throw new Error('La expresión debe devolver un número.');
      this.curveGraph.setBounds(this.xMin, this.xMax, this.yMin, this.yMax);
      this.curveGraph.functions = [new GraphableFunction(fn, '#ff785e')];
      this.curveGraph.drawGraph();
    } catch (error) {
      this.error = error instanceof SyntaxError ? 'La expresión no es válida. Usa sintaxis JavaScript, por ejemplo x*x + y*y - 1.'
        : error instanceof Error ? error.message : 'No se pudo dibujar la expresión.';
    }
  }
  example(formula: string): void { this.formula = formula; this.onRedraw(); }
}
