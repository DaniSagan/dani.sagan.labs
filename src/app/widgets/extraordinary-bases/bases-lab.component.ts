import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  convert,
  goldenExpansion,
  integerRepresentation,
  parseSystem,
  rational,
  Representation,
  valueText,
} from './bases.math';

@Component({
  selector: 'app-bases-lab',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bases-lab.component.html',
  styleUrls: ['../modular/modular-widgets.css', './bases-lab.component.css'],
})
export class BasesLabComponent {
  @Input() mode: 'converter' | 'negative' | 'golden' | 'complex' | 'compare' =
    'converter';
  input = '42';
  source = '10';
  target = '-2';
  precision = 20;
  family = 'Bases negativas';
  error = '';
  result: Representation = convert(parseSystem('42', '10'), '-2', 20);
  decoded = '42';
  comparisonInput = '42';
  comparisonError = '';
  comparison: { name: string; result: Representation }[] = [];
  fraction = '1/3';
  fractionError = '';
  fractions: { name: string; result: Representation }[] = [];
  negativeInput = '42';
  negativeError = '';
  negative = integerRepresentation(42n, -2);
  bits = Array.from({ length: 10 }, (_, k) => ({
    k: 9 - k,
    on: false,
    weight: (-2) ** (9 - k),
  }));
  goldenInput = '2';
  goldenError = '';
  golden = goldenExpansion({ a: 2n, b: 0n, d: 1n }, 20);
  goldenIdentity = false;
  sqrtPosition = 2;
  readonly sqrtPositions = Array.from({ length: 8 }, (_, k) => ({
    k,
    coefficient: 2 ** Math.floor(k / 2),
    odd: k % 2 !== 0,
  }));
  complexInput = '3+2i';
  complexError = '';
  complex = convert(parseSystem('3+2i', '10'), '2i', 20);
  complexValue = '3 + 2i';
  complexDigits: { k: number; digit: number }[] = [];
  vectors: { x1: number; y1: number; x2: number; y2: number; label: string }[] =
    [];
  endpoint = '';
  extent = 4;
  powerBase = '2i';
  powerCount = 5;
  powers: { k: number; x: number; y: number; label: string }[] = [];
  powerExtent = 16;
  readonly bases = Array.from({ length: 35 }, (_, k) => k + 2);
  readonly families: Record<string, { id: string; name: string }[]> = {
    'Bases enteras positivas': [2, 3, 10, 12, 16, 36].map((b) => ({
      id: String(b),
      name: String(b),
    })),
    'Bases negativas': [-2, -3, -10].map((b) => ({
      id: String(b),
      name: String(b),
    })),
    'Bases balanceadas': [{ id: 'balanced', name: 'Ternario balanceado' }],
    'Bases racionales': ['3/2', '4/3', '5/2'].map((id) => ({
      id,
      name: id + ' · convención AFS',
    })),
    'Bases irracionales': [
      { id: 'phi', name: 'φ · exacta' },
      { id: 'sqrt2', name: '√2' },
      { id: 'e', name: 'e' },
      { id: 'pi', name: 'π' },
    ],
    'Bases complejas': [{ id: '2i', name: '2i · quater-imaginary' }],
    'Otros sistemas': [
      { id: 'factorial', name: 'Factorial' },
      { id: 'zeckendorf', name: 'Zeckendorf' },
    ],
  };
  readonly familyNames = Object.keys(this.families);
  get targetLabel(): string {
    return (
      this.families[this.family].find((s) => s.id === this.target)?.name ||
      this.target
    );
  }
  readonly specialSources = [
    { id: 'balanced', name: 'Ternario balanceado' },
    { id: '2i', name: '2i' },
    { id: '3/2', name: '3/2 · AFS' },
    { id: '4/3', name: '4/3 · AFS' },
    { id: '5/2', name: '5/2 · AFS' },
    { id: 'factorial', name: 'Factorial' },
    { id: 'zeckendorf', name: 'Zeckendorf' },
  ];
  constructor() {
    this.updateNegative();
    this.updateComparison();
    this.updateFractions();
    this.updateComplex();
    this.updatePowers();
  }
  changeFamily(): void {
    this.target = this.families[this.family][0].id;
    this.update();
  }
  update(): void {
    try {
      const v = parseSystem(this.input, this.source);
      this.result = convert(v, this.target, this.precision);
      this.decoded = valueText(v);
      this.error = '';
    } catch (e) {
      this.error = (e as Error).message;
    }
  }
  preset(input: string, target: string, source = '10'): void {
    this.family =
      this.familyNames.find((f) =>
        this.families[f].some((p) => p.id === target),
      ) || 'Bases enteras positivas';
    this.input = input;
    this.target = target;
    this.source = source;
    this.update();
  }
  updateNegative(): void {
    try {
      const v = parseSystem(this.negativeInput, '10');
      if (v.re.d !== 1n || v.im.n) throw Error('Introduce un entero decimal.');
      this.negative = integerRepresentation(v.re.n, -2);
      this.bits = Array.from(
        { length: Math.max(10, this.negative.text.length) },
        (_, index) => {
          const k = Math.max(10, this.negative.text.length) - index - 1;
          return {
            k,
            on: this.negative.text[this.negative.text.length - k - 1] === '1',
            weight: (-2) ** k,
          };
        },
      );
      this.negativeError = '';
    } catch (e) {
      this.negativeError = (e as Error).message;
    }
  }
  toggleBit(index: number): void {
    this.bits[index].on = !this.bits[index].on;
    const n = this.bits.reduce(
      (sum, bit) => sum + (bit.on ? (-2n) ** BigInt(bit.k) : 0n),
      0n,
    );
    this.negativeInput = String(n);
    this.negative = integerRepresentation(n, -2);
    this.negativeError = '';
  }
  updateGolden(): void {
    try {
      const v = parseSystem(this.goldenInput, '10');
      if (v.im.n) throw Error('Introduce un número real.');
      this.golden = goldenExpansion(
        { a: v.re.n, b: 0n, d: v.re.d },
        this.precision,
      );
      this.goldenError = '';
    } catch (e) {
      this.goldenError = (e as Error).message;
    }
  }
  phiPreset(): void {
    this.goldenInput = 'φ';
    this.golden = goldenExpansion({ a: 0n, b: 1n, d: 1n }, this.precision);
    this.goldenError = '';
  }
  updateComparison(): void {
    try {
      const v = parseSystem(this.comparisonInput, '10');
      if (v.im.n || v.re.d !== 1n || v.re.n < 0n)
        throw Error('Compara un entero no negativo.');
      this.comparison = [
        ['10', 'Decimal'],
        ['2', 'Binario'],
        ['3', 'Ternario'],
        ['12', 'Duodecimal'],
        ['16', 'Hexadecimal'],
        ['-2', 'Negabinario'],
        ['balanced', 'Ternario balanceado'],
        ['phi', 'Base φ'],
        ['factorial', 'Factorial'],
        ['zeckendorf', 'Zeckendorf'],
      ].map(([id, name]) => ({ name, result: convert(v, id, this.precision) }));
      this.comparisonError = '';
    } catch (e) {
      this.comparisonError = (e as Error).message;
    }
  }
  updateFractions(): void {
    try {
      const v = parseSystem(this.fraction, '10');
      this.fractions = [2, 3, 10, 12, 16].map((b) => ({
        name: `Base ${b}`,
        result: convert(v, String(b), this.precision),
      }));
      this.fractionError = '';
    } catch (e) {
      this.fractionError = (e as Error).message;
    }
  }
  updateComplex(): void {
    try {
      const v = parseSystem(this.complexInput, '10');
      if (
        v.re.n > 1000000n ||
        v.re.n < -1000000n ||
        v.im.n > 1000000n ||
        v.im.n < -1000000n
      )
        throw Error('El plano interactivo admite partes entre −10⁶ y 10⁶.');
      this.complex = convert(v, '2i', 20);
      this.complexValue = valueText(v);
      const parts = this.complex.text.split('.'),
        count = parts[0].length;
      this.complexDigits = Array.from(parts.join('')).map((digit, k) => ({
        k: count - k - 1,
        digit: Number(digit),
      }));
      this.drawComplex();
      this.complexError = '';
    } catch (e) {
      this.complexError = (e as Error).message;
    }
  }
  changeDigit(index: number): void {
    this.complexDigits[index].digit = (this.complexDigits[index].digit + 1) % 4;
    const whole = this.complexDigits
      .filter((t) => t.k >= 0)
      .map((t) => t.digit)
      .join('');
    const frac = this.complexDigits
      .filter((t) => t.k < 0)
      .map((t) => t.digit)
      .join('');
    this.complex = { ...this.complex, text: whole + (frac ? '.' + frac : '') };
    const value = parseSystem(this.complex.text, '2i');
    this.complexValue = valueText(value);
    this.complexInput = this.complexValue;
    this.complex.steps = convert(value, '2i', 20).steps;
    this.drawComplex();
  }
  drawComplex(): void {
    let x = 0,
      y = 0;
    this.vectors = this.complexDigits.map(({ k, digit }) => {
      const x1 = x,
        y1 = y,
        w = digit * (k % 2 ? 2 : 1) * (-4) ** Math.floor(k / 2);
      if (k % 2) y += w;
      else x += w;
      return { x1, y1, x2: x, y2: y, label: `${digit} · (2i)^${k}` };
    });
    this.extent =
      Math.max(
        4,
        ...this.vectors.flatMap((v) => [
          Math.abs(v.x1),
          Math.abs(v.x2),
          Math.abs(v.y1),
          Math.abs(v.y2),
        ]),
      ) * 1.15;
    this.endpoint = `${x} ${y < 0 ? '−' : '+'} ${Math.abs(y)}i`;
  }
  updatePowers(): void {
    const [r, angle] =
      this.powerBase === '2i'
        ? [2, Math.PI / 2]
        : this.powerBase === '-1+i'
          ? [Math.SQRT2, (3 * Math.PI) / 4]
          : this.powerBase === 'i'
            ? [1, Math.PI / 2]
            : [0.8, Math.PI / 3];
    this.powers = Array.from({ length: this.powerCount }, (_, k) => ({
      k,
      x: r ** k * Math.cos(k * angle),
      y: r ** k * Math.sin(k * angle),
      label: `β^${k}`,
    }));
    this.powerExtent =
      Math.max(
        1,
        ...this.powers.flatMap((p) => [Math.abs(p.x), Math.abs(p.y)]),
      ) * 1.15;
  }
  coordinate(n: number, extent: number): number {
    return 180 + (n / extent) * 145;
  }
}
