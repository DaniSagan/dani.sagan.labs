import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CASES, Evidence, draw, normalize, posterior, information, score } from './detective.model';
interface RecordFile { truth: number; evidence: Evidence[]; choice: number; confidence: number; answer: number; closed: boolean; assisted: boolean; }
@Component({ selector: 'app-probability-detective', standalone: true, imports: [CommonModule, FormsModule, RouterLink], templateUrl: './probability-detective.component.html', styleUrls: ['./probability-detective.component.css'] })
export class ProbabilityDetectiveComponent {
  readonly cases = CASES;
  readonly chapters = ['Primeras sospechas', 'La frecuencia importa', 'Operación incertidumbre'];
  records: RecordFile[] = [];
  index = 0;
  started = false;
  help = false;
  resetPending = false;
  storageMessage = '';
  private readonly storageKey = 'danisagan-probability-detective-v1';
  constructor() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (this.valid(saved)) { this.records = saved.records; this.index = saved.index; this.started = true; }
        else this.storageMessage = 'La partida guardada no es compatible. Puedes iniciar una nueva.';
      }
    } catch { this.storageMessage = 'El guardado local no está disponible. Puedes jugar en esta sesión.'; }
  }
  private valid(saved: any): boolean {
    return saved && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < CASES.length && Array.isArray(saved.records) && saved.records.length === CASES.length && saved.records.every((r: any, i: number) =>
      r && Number.isInteger(r.truth) && r.truth >= 0 && r.truth < 3 && Number.isInteger(r.choice) && r.choice >= -1 && r.choice < 3 && Number.isInteger(r.answer) && r.answer >= -1 && r.answer < 3 && Number.isFinite(r.confidence) && r.confidence >= 34 && r.confidence <= 100 && typeof r.closed === 'boolean' && typeof r.assisted === 'boolean' && (!r.closed || (r.choice >= 0 && r.answer >= 0 && r.evidence.length >= 3)) && Array.isArray(r.evidence) && r.evidence.every((e: any) => Number.isInteger(e.experiment) && e.experiment >= 0 && e.experiment < 2 && Number.isInteger(e.outcome) && e.outcome >= 0 && e.outcome < 2) && r.evidence.reduce((s: number, e: Evidence) => s + CASES[i].experiments[e.experiment].cost, 0) <= 40) && saved.records.slice(0, saved.index).every((r: RecordFile) => r.closed);
  }
  get file() { return CASES[this.index]; }
  get chapter() { return this.chapters[Math.floor(this.index / 6)]; }
  get record() { return this.records[this.index]; }
  get budget() { return 40 - this.record.evidence.reduce((s, e) => s + this.file.experiments[e.experiment].cost, 0); }
  get belief() { return posterior(this.file, this.record.evidence); }
  get completed() { return this.records.filter(r => r.closed).length; }
  get total() { return this.records.reduce((s, r, i) => s + (r.closed ? this.points(i) : 0), 0); }
  get correct() { return this.records.filter(r => r.closed && r.choice === r.truth).length; }
  get canClose() { return !this.record.closed && this.record.choice >= 0 && this.record.answer >= 0 && this.record.evidence.length >= 3; }
  get counts() { return this.file.experiments.map((test, experiment) => test.outcomes.map((_, outcome) => this.record.evidence.filter(e => e.experiment === experiment && e.outcome === outcome).length)); }
  pct(value: number) { return (value * 100).toFixed(1); }
  prior(h: number) { return normalize(this.file.prior)[h]; }
  gain(test: number) { return information(this.file, this.record.evidence, test).toFixed(3); }
  points(i: number) { const r = this.records[i]; return score(r.choice, r.confidence, r.truth, 40 - r.evidence.reduce((s, e) => s + CASES[i].experiments[e.experiment].cost, 0), r.answer === CASES[i].correct); }
  start() {
    this.records = CASES.map(file => ({ truth: draw(normalize(file.prior), Math.random()), evidence: [], choice: -1, confidence: 60, answer: -1, closed: false, assisted: false }));
    this.index = 0; this.started = true; this.resetPending = false; this.save();
  }
  collect(experiment: number) {
    const test = this.file.experiments[experiment];
    if (this.record.closed || this.budget < test.cost) return;
    this.record.evidence.push({ experiment, outcome: draw(test.probabilities[this.record.truth], Math.random()) }); this.save();
  }
  choose(h: number) { if (!this.record.closed) { this.record.choice = h; this.save(); } }
  answer(a: number) { if (!this.record.closed) { this.record.answer = a; this.save(); } }
  reveal() { this.record.assisted = true; this.save(); }
  close() { if (this.canClose) { this.record.closed = true; this.save(); this.focus('.resolution'); } }
  navigate(i: number) { if (i >= 0 && i < CASES.length && (i === 0 || this.records[i - 1].closed)) { this.index = i; this.save(); this.focus('.case-heading'); } }
  private focus(selector: string) { if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(() => { const element = document.querySelector<HTMLElement>(`app-probability-detective ${selector}`); element?.focus({ preventScroll: true }); element?.scrollIntoView({ block: 'start' }); }); }
  save() { try { localStorage.setItem(this.storageKey, JSON.stringify({ records: this.records, index: this.index })); } catch { this.storageMessage = 'No se pudo guardar. Mantén esta pestaña abierta para conservar la partida.'; } }
}
