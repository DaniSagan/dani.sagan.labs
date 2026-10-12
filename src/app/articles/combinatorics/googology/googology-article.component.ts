import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import {
  CHALLENGES, GROWTH_FUNCTIONS, MACHINES, MILESTONES, TREE_EXAMPLES,
  Challenge, GrowthId, LabelledTree, NumberResult, badSequence, embedding,
  factory, fastGrowth, growth, initialMachine, lastDigits, logInteger,
  scientific, stepMachine, tower, towerTex, writingEstimate, ordinaryPower,
} from './googology.model';

@Component({
  selector: 'app-googology-article',
  standalone: true,
  imports: [FormsModule, RouterLink, FormulaComponent],
  templateUrl: './googology-article.component.html',
  styleUrl: './googology-article.component.css',
})
export class GoogologyArticleComponent {
  static readonly title = 'Googología: más allá de los números inimaginables';
  static readonly route = 'googology';
  panels: Record<string, boolean> = {};
  setPanel(event: Event, key: string): void { this.panels[key] = (event.target as HTMLDetailsElement).open; }
  functionLabel(id: GrowthId): string { return this.growthFunctions.find(f => f.id === id)!.label; }
  readonly milestones = MILESTONES;
  selectedMilestone = 1;
  get milestone() { return this.milestones[this.selectedMilestone]; }
  readonly operationNames = ['Suma', 'Multiplicación', 'Potencia', 'Tetración', 'Pentación', 'Hexación'];
  base = 3; operand = 3; rank = 3; iterations = 1;
  representation = 'auto';
  factoryResult = factory(3, 3, 3, 1);
  factorySteps: { step: number; result: NumberResult }[] = [{ step: 1, result: this.factoryResult }];
  factoryError = '';
  readonly recursionTex = String.raw`H_1(a,b)=a+b,\quad H_2(a,b)=ab,\quad H_3(a,b)=a^b`;
  readonly arrowsTex = String.raw`a\uparrow^r0=1,\quad a\uparrow^r(b+1)=a\uparrow^{r-1}(a\uparrow^r b)\quad(r>1)`;
  readonly iterateTex = String.raw`x_0=b,\quad x_{j+1}=H_r(a,x_j)`;
  updateFactory(): void {
    try {
      this.factorySteps = Array.from({ length: Math.min(6, Math.max(1, this.iterations || 1)) }, (_, i) => ({ step: i + 1, result: factory(this.base, this.operand, this.rank, i + 1) }));
      this.factoryResult = factory(this.base, this.operand, this.rank, this.iterations);
      this.factoryError = '';
    } catch (error) { this.factoryError = (error as Error).message; }
  }
  resetFactory(): void { this.base = 3; this.operand = 3; this.rank = 3; this.iterations = 1; this.representation = 'auto'; this.updateFactory(); }
  get factoryExpression(): string {
    return this.representation === 'tower' && this.rank === 4 && this.iterations === 1
      ? towerTex(this.base, this.operand) : this.factoryResult.tex;
  }
  towerBase = 3; towerHeight = 3;
  towerResult = tower(3, 3);
  towerComparisons: { name: string; result: NumberResult }[] = [];
  towerError = '';
  updateTower(): void {
    try {
      this.towerResult = tower(this.towerBase, this.towerHeight);
      this.towerComparisons = [
        { name: 'Una base mayor (hasta 10)', result: tower(Math.min(10, this.towerBase + 1), this.towerHeight) },
        { name: 'Un exponente mayor: a^(h+1)', result: ordinaryPower(this.towerBase, this.towerHeight + 1) },
        { name: 'Un piso más', result: tower(this.towerBase, Math.min(12, this.towerHeight + 1)) },
      ];
      this.towerError = '';
    } catch (error) { this.towerError = (error as Error).message; }
  }
  readonly growthFunctions = GROWTH_FUNCTIONS;
  selectedFunctions: GrowthId[] = ['linear', 'square', 'exp', 'factorial', 'self'];
  growthN = 6; growthScale = 'log';
  growthError = '';
  growthRows: { n: number; values: { id: GrowthId; result: NumberResult }[] }[] = [];
  growthPaths: { label: string; color: string; points: string }[] = [];
  chartMax = 1;
  readonly chartTicks = [0, 0.25, 0.5, 0.75, 1];
  constructor() { this.updateTower(); this.updateGrowth(); this.updateWriting(); this.updateModular(); this.updateTrees(); }
  toggleFunction(id: GrowthId): void {
    if (this.selectedFunctions.includes(id)) {
      if (this.selectedFunctions.length === 1) return;
      this.selectedFunctions = this.selectedFunctions.filter(f => f !== id);
    } else this.selectedFunctions = [...this.selectedFunctions, id];
    this.updateGrowth();
  }
  updateGrowth(): void {
    if (!Number.isInteger(this.growthN) || this.growthN < 2 || this.growthN > 12) { this.growthError = 'Elige n entre 2 y 12.'; return; }
    this.growthError = '';
    this.growthRows = Array.from({ length: this.growthN }, (_, i) => ({ n: i + 1, values: this.selectedFunctions.map(id => ({ id, result: growth(id, i + 1) })) }));
    const metric = (result: NumberResult) => result.value === null ? null : this.growthScale === 'log' ? logInteger(result.value) : Number(result.value);
    this.chartMax = Math.max(1, ...this.growthRows.flatMap(row => row.values.map(v => metric(v.result) || 0)));
    this.growthPaths = this.selectedFunctions.map(id => {
      const definition = this.growthFunctions.find(f => f.id === id)!;
      const points = this.growthRows.map(row => {
        const y = metric(row.values.find(v => v.id === id)!.result);
        return y === null ? '' : `${60 + (row.n - 1) * 500 / (this.growthN - 1)},${260 - y / this.chartMax * 220}`;
      }).filter(Boolean).join(' ');
      return { label: definition.label, color: definition.color, points };
    });
  }
  formatTick(ratio: number): string {
    const value = this.chartMax * ratio;
    return value === 0 ? '0' : value >= 10000 ? value.toExponential(1) : String(Number(value.toPrecision(3)));
  }
  fLevel = 2; fInput = 3; fResult = fastGrowth(2, 3); fError = '';
  updateHierarchy(): void { try { this.fResult = fastGrowth(this.fLevel, this.fInput); this.fError = ''; } catch (e) { this.fError = (e as Error).message; } }
  writingDigits = '101'; writingMm = 1; writingRate = 10;
  writingError = ''; writingResults: { label: string; value: string }[] = [];
  writingPreset(name: string): void {
    this.writingDigits = name === 'googolplex' ? String(10n ** 100n + 1n) : name === 'million' ? '1000000' : '101';
    this.updateWriting();
  }
  updateWriting(): void {
    try {
      const r = writingEstimate(this.writingDigits, this.writingMm, this.writingRate);
      this.writingResults = [{ label: 'Longitud de la fila (m)', value: scientific(r.logMetres) }, { label: 'Tiempo (s)', value: scientific(r.logSeconds) }, { label: 'Longitud en unidades astronómicas', value: scientific(r.logAu) }, { label: 'Tiempo en años julianos', value: scientific(r.logYears) }];
      this.writingError = '';
    } catch (e) { this.writingError = (e as Error).message; }
  }
  challengeIndex = 0;
  readonly challenges = CHALLENGES;
  answers: Record<number, Challenge['answer']> = {};
  get challenge() { return this.challenges[this.challengeIndex]; }
  answer(choice: Challenge['answer']): void { this.answers[this.challengeIndex] = choice; }
  get challengeScore(): number { return this.challenges.filter((c, i) => this.answers[i] === c.answer).length; }
  modularBase = '7'; modularExponent = '1000'; modularDigits = 6;
  modularResult = ''; modularError = '';
  updateModular(): void { try { this.modularResult = lastDigits(this.modularBase, this.modularExponent, this.modularDigits); this.modularError = ''; } catch (e) { this.modularError = (e as Error).message; } }
  readonly treeExamples = TREE_EXAMPLES;
  treeExample = 0;
  sourceTree: LabelledTree = structuredClone(TREE_EXAMPLES[0].source);
  targetTree: LabelledTree = structuredClone(TREE_EXAMPLES[0].target);
  treeMap: number[] | null = null;
  treeEdited = false;
  readonly labelNames = ['Coral', 'Azul', 'Verde'];
  loadTreeExample(index: number): void {
    this.treeExample = Number(index); this.treeEdited = false;
    this.sourceTree = structuredClone(this.treeExamples[this.treeExample].source);
    this.targetTree = structuredClone(this.treeExamples[this.treeExample].target);
    this.updateTrees();
  }
  updateTrees(): void { this.treeMap = embedding(this.sourceTree, this.targetTree); }
  editTree(): void { this.treeEdited = true; this.updateTrees(); }
  addNode(tree: LabelledTree): void { if (tree.parents.length < 6) { tree.parents.push(0); tree.labels.push(1); this.editTree(); } }
  removeNode(tree: LabelledTree): void { if (tree.parents.length > 1) { tree.parents.pop(); tree.labels.pop(); this.editTree(); } }
  parentOptions(index: number): number[] { return Array.from({ length: index }, (_, i) => i); }
  treePoints(tree: LabelledTree): { x: number; y: number; parent: number; label: number }[] {
    const depths = [0];
    for (let i = 1; i < tree.parents.length; i++) depths.push(depths[tree.parents[i]] + 1);
    return tree.parents.map((parent, i) => {
      const siblings = depths.map((d, j) => d === depths[i] ? j : -1).filter(j => j >= 0);
      return { x: 240 * (siblings.indexOf(i) + 1) / (siblings.length + 1), y: 25 + depths[i] * 40, parent, label: tree.labels[i] };
    });
  }
  readonly smallSequence: LabelledTree[] = [ { parents: [-1], labels: [1] }, { parents: [-1, 0], labels: [2, 2] }, { parents: [-1], labels: [2] } ];
  sequenceRepeated = false;
  get sequenceValid(): boolean { return badSequence(this.sequenceRepeated ? [...this.smallSequence, this.smallSequence[2]] : this.smallSequence, 2); }
  readonly machines = MACHINES;
  machineIndex = 1;
  machineState = initialMachine();
  get machine() { return this.machines[this.machineIndex]; }
  get transitionRows() { return Object.entries(this.machine.transitions).flatMap(([state, transitions]) => transitions.map((transition, symbol) => ({ state, symbol, ...transition }))); }
  get tapeCells() { return Array.from({ length: 15 }, (_, i) => ({ position: this.machineState.head + i - 7, value: this.machineState.tape.has(this.machineState.head + i - 7) ? 1 : 0 })); }
  resetMachine(): void { this.machineState = initialMachine(); }
  step(): void { this.machineState = stepMachine(this.machine, this.machineState); }
  run(): void { for (let i = 0; i < 25; i++) this.step(); }
  resultText(result: NumberResult): string { return result.value === null ? 'Representación simbólica' : result.value.toString(); }
}