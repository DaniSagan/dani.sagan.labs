import { ContentConnectionsComponent } from '../../shared/content/content-connections/content-connections.component';
﻿import { Component, HostListener, OnDestroy } from '@angular/core';
import { Direction, Tile, moveBoard, spawnTile, canMove, validSave } from './game-2048.model';

@Component({selector: 'app-game-2048', standalone: true, imports: [ContentConnectionsComponent], templateUrl: './game-2048.component.html', styleUrls: ['./game-2048.component.css', './game-2048-board.css']})
export class Game2048Component implements OnDestroy {
  // content-connections:start
  readonly learningConnections = [{"route":"/articles/exponentials-logarithms","label":"Exponenciales y logaritmos: propiedades y ecuaciones","reason":"Relaciona cada fusión con las potencias de dos y el número de duplicaciones."},{"route":"/articles/finite-probability","label":"Probabilidad en espacios finitos: sucesos y regla de Laplace","reason":"Distingue las decisiones del jugador del azar al aparecer nuevas fichas."},{"route":"/articles/geometric-series","label":"Progresiones y series geométricas","reason":"Calcula sumas de valores que crecen por duplicación."}];
  // content-connections:end
  tiles: Tile[] = []; visual: Tile[] = []; score = 0; best = 0; moves = 0; gain = 0;
  won = false; continued = false; over = false; busy = false; resetPending = false; message = ''; storageMessage = '';
  previous: {tiles: Tile[]; score: number; moves: number; won: boolean; continued: boolean} | null = null;
  private timer?: ReturnType<typeof setTimeout>;
  private startPoint: {x: number; y: number} | null = null;
  private readonly key = 'danisagan-2048-v1';
  constructor() {
    try {
      const raw = localStorage.getItem(this.key);
      if (raw) { const s = JSON.parse(raw); if (validSave(s)) { this.tiles = s.tiles; this.score = s.score; this.best = Math.max(s.best, s.score); this.moves = s.moves; this.won = s.won; this.continued = s.continued; } }
    } catch { this.storageMessage = 'El guardado local no está disponible.'; }
    if (!this.tiles.length) this.newGame();
    this.visual = this.tiles; this.over = !canMove(this.tiles);
  }
  get highest() { return Math.max(2, ...this.tiles.map(t => t.value)); }
  get progress() { return Math.min(100, Math.log2(this.highest) / 11 * 100); }
  get blocked() { return this.over || (this.won && !this.continued) || this.resetPending; }
  get empty() { return 16 - this.tiles.length; }
  newGame() {
    if (this.timer) clearTimeout(this.timer);
    this.tiles = spawnTile(spawnTile([])); this.visual = this.tiles; this.score = 0; this.moves = 0; this.gain = 0;
    this.won = false; this.continued = false; this.over = false; this.busy = false; this.previous = null; this.resetPending = false;
    this.message = 'Nueva partida. Combina las fichas para llegar a 2048.'; this.save();
  }
  move(direction: Direction) {
    if (this.busy || this.blocked) return;
    const result = moveBoard(this.tiles, direction);
    if (!result.changed) { this.message = 'Las fichas no pueden moverse en esa dirección.'; return; }
    this.previous = {tiles: this.tiles.map(t => ({...t})), score: this.score, moves: this.moves, won: this.won, continued: this.continued};
    this.busy = true; this.gain = result.gain; this.visual = result.animation; this.score += result.gain; this.best = Math.max(this.best, this.score); this.moves++;
    this.tiles = spawnTile(result.tiles, Math.random, Math.max(...this.tiles.map(t => t.id)) + 1);
    this.won = this.won || this.tiles.some(t => t.value >= 2048); this.over = !canMove(this.tiles);
    this.message = this.won && !this.continued ? '¡Has conseguido 2048!' : this.over ? 'No quedan movimientos. Puedes deshacer el último.' : `Movimiento ${this.moves}. Puntuación ${this.score}${result.gain ? `. Has sumado ${result.gain} puntos.` : '.'}`;
    this.save();
    this.timer = setTimeout(() => { this.visual = this.tiles; this.busy = false; }, 160);
  }
  undo() {
    if (!this.previous || this.busy || this.resetPending) return;
    const p = this.previous; this.tiles = p.tiles; this.visual = this.tiles; this.score = p.score; this.moves = p.moves; this.won = p.won; this.continued = p.continued;
    this.previous = null; this.over = !canMove(this.tiles); this.gain = 0; this.message = 'Último movimiento deshecho.'; this.save();
  }
  continueGame() { this.continued = true; this.message = 'Sigue jugando: el siguiente objetivo es 4096.'; this.save(); }
  @HostListener('window:keydown', ['$event']) keydown(e: KeyboardEvent) {
    if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.repeat) return;
    const el = e.target as HTMLElement;
    if (el?.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
    const map: Record<string, Direction> = {ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right'};
    if (map[e.key]) { e.preventDefault(); this.move(map[e.key]); }
  }
  pointerDown(e: PointerEvent) { if ((e.target as HTMLElement).closest('button')) return; if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return; this.startPoint = {x: e.clientX, y: e.clientY}; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }
  pointerUp(e: PointerEvent) {
    if (!this.startPoint) return;
    const dx = e.clientX - this.startPoint.x, dy = e.clientY - this.startPoint.y; this.startPoint = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    this.move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
  }
  cancelPointer() { this.startPoint = null; }
  level(value: number) { return Math.min(12, Math.log2(value)); }
  save() { try { localStorage.setItem(this.key, JSON.stringify({tiles: this.tiles, score: this.score, best: this.best, moves: this.moves, won: this.won, continued: this.continued})); } catch { this.storageMessage = 'No se pudo guardar. Puedes seguir jugando en esta pestaña.'; } }
  ngOnDestroy() { if (this.timer) clearTimeout(this.timer); }
}
