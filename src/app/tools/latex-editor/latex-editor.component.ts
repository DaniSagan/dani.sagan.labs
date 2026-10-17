import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MathfieldElement, Selector, validateLatex } from 'mathlive';
import { FORMULA_KEYS, FormulaKey, KEY_GROUPS } from './latex-keyboard';
import { LatexSelectionMap } from './latex-selection-map';
import {
  COOKIE_PREFIX,
  deleteFormulaCookie,
  FormulaDocument,
  readFormulaCookies,
  saveFormulaCookie,
  validDocument,
} from './formula-storage';

// Set before Angular constructs the first custom element, including Pages base paths.
MathfieldElement.fontsDirectory = new URL(
  'assets/mathlive/fonts',
  document.baseURI,
).href;
MathfieldElement.soundsDirectory = null;

@Component({
  selector: 'app-latex-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './latex-editor.component.html',
  styleUrls: [
    './latex-editor.component.css',
    './latex-editor-responsive.css',
    './latex-editor-source.css',
  ],
})
export class LatexEditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('field') fieldRef!: ElementRef<MathfieldElement>;
  @ViewChild('code') codeRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('studio') studioRef!: ElementRef<HTMLElement>;
  @ViewChild('formulaStage') formulaStageRef!: ElementRef<HTMLElement>;
  visualSelectionBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  } | null = null;
  private highlightFrame?: number;
  private highlightObserver?: ResizeObserver;
  private syncSourceHighlight = false;
  private visualSelectionMatched = true;
  private readonly selectionMap = new LatexSelectionMap(
    () => this.latex,
    () => this.field,
  );
  readonly groups = KEY_GROUPS;
  readonly count = FORMULA_KEYS.length;
  group = 'Esenciales';
  search = '';
  page = 0;
  readonly pageSize = 12;
  docs = readFormulaCookies();
  doc: FormulaDocument =
    this.docs.find((d) =>
      document.cookie
        .split(';')
        .some((c) => c.trim() === `${COOKIE_PREFIX}active=${d.id}`),
    ) ||
    this.docs[0] ||
    this.makeDocument(
      'Mi primera fórmula',
      '\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}',
    );
  latex = this.doc.latex;
  selectionStart = 0;
  selectionEnd = 0;
  selectedLabel = 'Cursor';
  message = '';
  saveStatus = 'Preparado';
  error = '';
  panel: 'keyboard' | 'export' | 'library' | 'help' = 'keyboard';
  expanded = false;
  busy = false;
  private syncing = false;
  private timer?: ReturnType<typeof setTimeout>;
  private history: string[] = [this.latex];
  private historyIndex = 0;
  private listeners: (() => void)[] = [];
  constructor(private zone: NgZone) {}
  get field(): MathfieldElement {
    return this.fieldRef.nativeElement;
  }
  get filtered(): FormulaKey[] {
    const clean = (s: string) =>
      s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const q = clean(this.search).trim();
    return FORMULA_KEYS.filter((k) =>
      q
        ? clean(`${k.label} ${k.name} ${k.latex} ${k.group}`).includes(q)
        : k.group === this.group,
    );
  }
  get keys(): FormulaKey[] {
    return this.filtered.slice(
      this.page * this.pageSize,
      (this.page + 1) * this.pageSize,
    );
  }
  get pages(): number {
    return Math.max(1, Math.ceil(this.filtered.length / this.pageSize));
  }
  get selected(): string {
    return this.latex.slice(this.selectionStart, this.selectionEnd);
  }
  makeDocument(name: string, latex = ''): FormulaDocument {
    return {
      id: crypto.randomUUID(),
      name,
      latex,
      updated: new Date().toISOString(),
      fontSize: 32,
      foreground: '#e8e4d8',
      background: '#12121e',
      transparent: false,
      scale: 2,
    };
  }
  ngAfterViewInit(): void {
    // On touch devices MathLive opens its letters/numbers/symbols keyboard on focus.
    // Keep the native keyboard suppressed so it does not cover the math keyboard.
    this.field.mathVirtualKeyboardPolicy = 'auto';
    this.field.smartFence = true;
    this.field.setAttribute('inputmode', 'none');
    this.field.value = this.latex;
    const listen = (target: EventTarget, type: string, fn: () => void) => {
      target.addEventListener(type, fn);
      this.listeners.push(() => target.removeEventListener(type, fn));
    };
    listen(this.field, 'input', () =>
      this.zone.run(() => {
        if (!this.syncing) {
          this.latex = this.field.value;
          this.changed();
          this.fromVisual();
        }
      }),
    );
    listen(this.field, 'selection-change', () =>
      this.zone.run(() => {
        if (!this.syncing) this.fromVisual();
      }),
    );
    listen(document, 'fullscreenchange', () =>
      this.zone.run(() => {
        if (!document.fullscreenElement) this.expanded = false;
      }),
    );
    listen(window, 'pagehide', () => {
      this.persist();
    });
    listen(document, 'selectionchange', () => {
      if (
        !this.syncing &&
        document.activeElement === this.codeRef.nativeElement
      )
        this.zone.run(() => this.readCodeSelection());
    });
    listen(this.codeRef.nativeElement, 'selectionchange', () => {
      if (
        !this.syncing &&
        document.activeElement === this.codeRef.nativeElement
      )
        this.zone.run(() => this.readCodeSelection());
    });
    this.highlightObserver = new ResizeObserver(() =>
      this.refreshVisualSelection(),
    );
    this.highlightObserver.observe(this.field);
    this.highlightObserver.observe(this.formulaStageRef.nativeElement);
    this.validate();
  }
  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.persist();
    this.listeners.forEach((fn) => fn());
    this.highlightObserver?.disconnect();
    if (this.highlightFrame !== undefined)
      cancelAnimationFrame(this.highlightFrame);
  }
  fromVisual(): void {
    const [a, b] = this.field.selection.ranges[0];
    const value = this.selectionMap.normalize(this.field.getValue(a, b));
    const prefix = this.selectionMap.normalize(this.field.getValue(0, a));
    if (value) {
      const occurrences = this.selectionMap.sourceOccurrences(value),
        ranges = this.selectionMap.visualOccurrences(value);
      const ordinal = ranges.findIndex(
        (r) => r[0] >= Math.min(a, b) && r[1] <= Math.max(a, b),
      );
      if (occurrences.length === ranges.length && ordinal >= 0) {
        const node = occurrences[ordinal];
        this.setSourceSelection(node.start, node.end, node.label);
        return;
      }
      const candidates = this.selectionMap.nodes().filter(
        (n) => this.selectionMap.normalize(this.latex.slice(n.start, n.end)) === value,
      );
      const chosen = candidates.sort(
        (x, y) =>
          Math.abs(
            this.selectionMap.normalize(this.latex.slice(0, x.start)).length - prefix.length,
          ) -
          Math.abs(
            this.selectionMap.normalize(this.latex.slice(0, y.start)).length - prefix.length,
          ),
      )[0];
      if (chosen) {
        this.setSourceSelection(chosen.start, chosen.end, chosen.label);
        return;
      }
      // Arbitrary drags can span several source nodes.
      const normalized = this.selectionMap.normalize(this.latex);
      const index = normalized.indexOf(
        value,
        Math.max(0, prefix.length - value.length),
      );
      if (index >= 0) {
        const positions = this.selectionMap.sourcePositions();
        this.setSourceSelection(
          positions[index] ?? 0,
          (positions[index + value.length - 1] ?? 0) + 1,
          'Selección',
        );
        return;
      }
    }
    const positions = this.selectionMap.sourcePositions();
    const caret =
      a === 0
        ? 0
        : a === this.field.lastOffset
          ? this.latex.length
          : (positions[Math.max(0, prefix.length - 1)] ?? 0) + 1;
    this.setSourceSelection(caret, caret, 'Cursor');
  }
  private setSourceSelection(a: number, b: number, label: string): void {
    this.selectionStart = a;
    this.selectionEnd = b;
    this.selectedLabel = label;
    this.codeRef.nativeElement.setSelectionRange(a, b);
    this.visualSelectionMatched = true;
    this.refreshVisualSelection();
  }
  private readCodeSelection(): void {
    const code = this.codeRef.nativeElement;
    const changed =
      this.selectionStart !== code.selectionStart ||
      this.selectionEnd !== code.selectionEnd;
    this.selectionStart = code.selectionStart;
    this.selectionEnd = code.selectionEnd;
    this.selectedLabel = this.selected ? 'Selección LaTeX' : 'Cursor';
    if (changed) this.refreshVisualSelection(true);
  }
  refreshVisualSelection(syncSource = false): void {
    this.syncSourceHighlight ||= syncSource;
    if (this.highlightFrame !== undefined) return;
    this.zone.runOutsideAngular(() => {
      this.highlightFrame = requestAnimationFrame(() => {
        this.highlightFrame = undefined;
        const sync = this.syncSourceHighlight;
        this.syncSourceHighlight = false;
        this.zone.run(() => {
          if (sync && document.activeElement === this.codeRef.nativeElement)
            this.toVisual();
          if (
            !this.visualSelectionMatched ||
            this.selectionEnd <= this.selectionStart ||
            this.field.selectionIsCollapsed
          ) {
            this.visualSelectionBox = null;
            return;
          }
          const bounds: DOMRect[] = [];
          for (const [start, end] of this.field.selection.ranges)
            for (
              let i = Math.min(start, end) + 1;
              i <= Math.max(start, end);
              i++
            ) {
              const box = this.field.getElementInfo(i)?.bounds;
              if (box && box.width > 0 && box.height > 0) bounds.push(box);
            }
          if (!bounds.length) {
            this.visualSelectionBox = null;
            return;
          }
          const stage = this.formulaStageRef.nativeElement,
            rect = stage.getBoundingClientRect();
          const left = Math.min(...bounds.map((b) => b.left)),
            top = Math.min(...bounds.map((b) => b.top));
          const right = Math.max(...bounds.map((b) => b.right)),
            bottom = Math.max(...bounds.map((b) => b.bottom));
          this.visualSelectionBox = {
            left: left - rect.left + stage.scrollLeft - 4,
            top: top - rect.top + stage.scrollTop - 4,
            width: right - left + 8,
            height: bottom - top + 8,
          };
        });
      });
    });
  }
  fromCode(): void {
    if (this.syncing) return;
    this.readCodeSelection();
    this.toVisual();
  }
  private toVisual(): void {
    this.syncing = true;
    this.visualSelectionMatched = true;
    try {
      const target = this.selectionMap.normalize(this.selected);
      const n = this.field.lastOffset;
      if (!target) {
        const prefix = this.selectionMap.normalize(
          this.latex.slice(0, this.selectionStart),
        ).length;
        let best = 0,
          score = Infinity;
        for (let i = 0; i <= n; i++) {
          const d = Math.abs(
            this.selectionMap.normalize(this.field.getValue(0, i)).length - prefix,
          );
          if (d < score) {
            best = i;
            score = d;
          }
        }
        this.field.position = best;
      } else {
        const occurrences = this.selectionMap.sourceOccurrences(target),
          ranges = this.selectionMap.visualOccurrences(target);
        const ordinal = occurrences.findIndex(
          (node) =>
            node.start >= this.selectionStart && node.end <= this.selectionEnd,
        );
        const best =
          occurrences.length === ranges.length && ordinal >= 0
            ? ranges[ordinal]
            : undefined;
        if (best) this.field.selection = { ranges: [best] };
        else {
          this.visualSelectionMatched = false;
          this.message =
            'Selección de código conservada. Este fragmento no corresponde a un bloque visual completo.';
        }
      }
    } finally {
      this.syncing = false;
      this.refreshVisualSelection();
    }
  }
  editCode(value: string): void {
    this.latex = value;
    this.syncing = true;
    this.field.setValue(value, { silenceNotifications: true });
    this.syncing = false;
    this.changed();
    this.fromCode();
  }
  navigate(direction: 'parent' | 'child' | 'left' | 'right'): void {
    const current = this.selectionMap.navigate(
      this.selectionStart,
      this.selectionEnd,
      direction,
    );
    this.setSourceSelection(current.start, current.end, current.label);
    this.toVisual();
  }
  insert(key: FormulaKey): void {
    if (key.command) {
      if (document.activeElement === this.codeRef.nativeElement)
        this.fromCode();
      const before = this.field.value;
      this.command(key.command);
      if (this.field.value === before)
        this.message =
          'Sitúa el cursor dentro de una celda de matriz para modificar filas o columnas.';
      return;
    }
    if (document.activeElement === this.codeRef.nativeElement) {
      const code = this.codeRef.nativeElement,
        start = code.selectionStart,
        end = code.selectionEnd;
      let inserted = key.latex
        .replace(/#0/g, this.latex.slice(start, end))
        .replace(/#\?/g, '');
      if (/\\[A-Za-z]+$/.test(inserted)) inserted += ' ';
      if (
        /^[A-Za-z]/.test(inserted) &&
        /\\[A-Za-z]+$/.test(this.latex.slice(0, start))
      )
        inserted = ' ' + inserted;
      this.latex =
        this.latex.slice(0, start) + inserted + this.latex.slice(end);
      this.field.setValue(this.latex, { silenceNotifications: true });
      this.changed();
      const hole = inserted.indexOf('{}');
      const caret = start + (hole >= 0 ? hole + 1 : inserted.length);
      this.setSourceSelection(caret, caret, 'Cursor');
      this.toVisual();
      return;
    }
    if (this.error) {
      this.message = 'Corrige el LaTeX antes de insertar un operador visual.';
      return;
    }
    this.field.focus();
    this.field.insert(key.latex, {
      insertionMode: 'replaceSelection',
      selectionMode: 'placeholder',
    });
    // #0 templates wrap the selected expression; ordinary symbols replace the selection.
    this.latex = this.field.value;
    this.changed();
    this.fromVisual();
  }
  command(command: Selector): void {
    if (command === 'deleteBackward' && this.deleteSourceSelection()) return;
    this.field.executeCommand(command);
    this.latex = this.field.value;
    this.changed();
    this.fromVisual();
  }
  private deleteSourceSelection(): boolean {
    // Toolbar clicks can move focus, so retain the synchronized source range.
    let start = this.selectionStart;
    let end = this.selectionEnd;
    if (start === end) {
      const emptyOperator = this.emptyOperatorAt(start);
      if (!emptyOperator) return false;
      start = emptyOperator.start;
      end = emptyOperator.end;
    }
    this.latex = this.latex.slice(0, start) + this.latex.slice(end);
    this.field.setValue(this.latex, { silenceNotifications: true });
    this.codeRef.nativeElement.value = this.latex;
    this.changed();
    const emptyOperator = this.emptyOperatorAt(start);
    this.setSourceSelection(
      emptyOperator?.start ?? start,
      emptyOperator?.end ?? start,
      emptyOperator ? 'Operador vacío' : 'Cursor',
    );
    this.toVisual();
    return true;
  }
  private emptyOperatorAt(start: number) {
    return this.selectionMap.nodes()
      .filter((node) =>
        node.start <= start && node.end >= start &&
        /^\\(?:sqrt|[dtc]?frac)\b/.test(this.latex.slice(node.start, node.end)) &&
        node.children.length > 0 &&
        node.children.every((child) =>
          !this.latex.slice(child.start, child.end)
            .replace(/\\placeholder\{[^}]*\}/g, '').trim(),
        ),
      )
      .sort((a, b) => (a.end - a.start) - (b.end - b.start))[0];
  }
  changed(): void {
    if (this.history[this.historyIndex] !== this.latex) {
      this.history = this.history.slice(0, this.historyIndex + 1);
      this.history.push(this.latex);
      if (this.history.length > 100) this.history.shift();
      this.historyIndex = this.history.length - 1;
    }
    this.validate();
    this.scheduleSave();
  }
  undo(delta: number): void {
    const next = this.historyIndex + delta;
    if (next < 0 || next >= this.history.length) return;
    this.historyIndex = next;
    this.latex = this.history[next];
    this.field.setValue(this.latex, { silenceNotifications: true });
    this.validate();
    this.scheduleSave();
    this.fromVisual();
  }
  validate(): void {
    let depth = 0,
      incomplete = false;
    for (let i = 0; i < this.latex.length; i++) {
      if (this.latex[i] === '\\') {
        if (/^[{}\\]$/.test(this.latex[i + 1] || '')) i++;
        continue;
      }
      if (this.latex[i] === '{') depth++;
      if (this.latex[i] === '}' && --depth < 0) incomplete = true;
    }
    const errors = validateLatex(this.latex);
    this.error =
      depth || incomplete
        ? 'LaTeX incompleto: comprueba las llaves de los argumentos. Tu texto se conserva.'
        : errors.length
          ? `LaTeX incompleto o no reconocido: ${errors[0].code}. Tu texto se conserva.`
          : '';
  }
  scheduleSave(): void {
    this.saveStatus = 'Guardando…';
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.persist(), 450);
  }
  persist(): boolean {
    clearTimeout(this.timer);
    this.doc.latex = this.latex;
    this.doc.updated = new Date().toISOString();
    try {
      saveFormulaCookie(this.doc);
      this.docs = readFormulaCookies();
      this.saveStatus = 'Guardado en cookies';
      return true;
    } catch (e) {
      this.saveStatus = (e as Error).message;
      return false;
    }
  }
  private leaveDocument(): boolean {
    return (
      this.persist() ||
      confirm(
        'No se ha podido guardar esta fórmula en cookies. Descarga una copia JSON antes de continuar. ¿Cambiar de fórmula y descartar los cambios no guardados?',
      )
    );
  }
  open(id: string): void {
    if (!this.leaveDocument()) return;
    const doc = this.docs.find((x) => x.id === id);
    if (doc) this.load(doc);
  }
  private load(doc: FormulaDocument): void {
    this.doc = { ...doc };
    this.latex = doc.latex;
    this.field.setValue(this.latex, { silenceNotifications: true });
    this.history = [this.latex];
    this.historyIndex = 0;
    this.setSourceSelection(0, 0, 'Cursor');
    this.validate();
    this.persist();
  }
  newFormula(): void {
    if (this.leaveDocument())
      this.load(this.makeDocument(`Fórmula ${this.docs.length + 1}`));
  }
  remove(): void {
    if (
      !confirm(
        `¿Eliminar «${this.doc.name}» de las cookies? Los archivos descargados se conservarán.`,
      )
    )
      return;
    clearTimeout(this.timer);
    deleteFormulaCookie(this.doc.id);
    this.docs = readFormulaCookies();
    this.load(this.docs[0] || this.makeDocument('Nueva fórmula'));
  }
  chooseExample(latex: string): void {
    if (this.leaveDocument()) this.load(this.makeDocument('Ejemplo', latex));
  }
  async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.latex);
      this.message = 'LaTeX copiado al portapapeles.';
    } catch {
      this.codeRef.nativeElement.focus();
      this.codeRef.nativeElement.select();
      this.message =
        'Seleccionado: pulsa Ctrl+C o usa Copiar en tu dispositivo.';
    }
  }
  async fullscreen(): Promise<void> {
    if (this.expanded) {
      if (document.fullscreenElement) await document.exitFullscreen();
      this.expanded = false;
    } else {
      this.expanded = true;
      try {
        await this.studioRef.nativeElement.requestFullscreen();
      } catch {
        this.message = 'Modo ampliado activado. Usa «Salir» para volver.';
      }
    }
  }
  escape(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.expanded && !document.fullscreenElement)
      this.expanded = false;
    if (
      !event.defaultPrevented &&
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === 'z'
    ) {
      event.preventDefault();
      this.undo(event.shiftKey ? 1 : -1);
    }
  }
  download(blob: Blob, extension: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download =
      (this.doc.name.replace(/[^\p{L}\p{N}_-]/gu, '_') || 'formula') +
      '.' +
      extension;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async export(format: 'json' | 'svg' | 'png'): Promise<void> {
    this.persist();
    this.busy = true;
    try {
      if (format === 'json')
        this.download(
          new Blob(
            [
              JSON.stringify(
                { schema: 'danisagan-formula', version: 1, document: this.doc },
                null,
                2,
              ),
            ],
            { type: 'application/json' },
          ),
          'json',
        );
      else {
        if (this.error)
          throw new Error(
            'Corrige los errores LaTeX antes de exportar la imagen.',
          );
        const renderer = await import('./formula-export');
        this.download(
          format === 'png'
            ? await renderer.formulaPng(this.doc)
            : new Blob([renderer.formulaSvg(this.doc).svg], {
                type: 'image/svg+xml',
              }),
          format,
        );
      }
      this.message = `Archivo ${format.toUpperCase()} preparado.`;
    } catch (e) {
      this.message = (e as Error).message;
    } finally {
      this.busy = false;
    }
  }
  async importFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      if (file.size > 100000) throw new Error('El JSON es demasiado grande.');
      const data = JSON.parse(await file.text());
      if (
        data.schema !== 'danisagan-formula' ||
        data.version !== 1 ||
        !validDocument(data.document)
      )
        throw new Error('Formato JSON de fórmula no válido.');
      if (!this.leaveDocument()) return;
      this.load({
        ...data.document,
        id: crypto.randomUUID(),
        updated: new Date().toISOString(),
      });
      this.message = 'Fórmula importada.';
    } catch (e) {
      this.message = (e as Error).message;
    } finally {
      input.value = '';
    }
  }
  readonly examples = [
    { name: 'Euler', latex: 'e^{i\\pi}+1=0' },
    {
      name: 'Gauss',
      latex: '\\int_{-\\infty}^{\\infty}e^{-x^2}\\,\\mathrm{d}x=\\sqrt{\\pi}',
    },
    {
      name: 'Fourier',
      latex:
        '\\widehat{f}(\\xi)=\\int_{-\\infty}^{\\infty}f(x)e^{-2\\pi i x\\xi}\\,\\mathrm{d}x',
    },
    { name: 'Matriz', latex: 'A=\\begin{pmatrix}a&b\\\\c&d\\end{pmatrix}' },
    {
      name: 'Por partes',
      latex: 'f(x)=\\begin{cases}x^2&x\\ge0\\\\-x&x<0\\end{cases}',
    },
    { name: 'Navegación', latex: '\\frac{a+b}{c+d}+\\sqrt{x^2+y^2}' },
  ];
}
