import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { digitBlocks, piDigitLimit, PiProgress, PiResult, piText, validateBlockSize, validateDigits } from './pi-engine';

@Component({
  selector: 'app-pi-decimal', standalone: true,
  templateUrl: './pi-decimal.component.html', styleUrls: ['./pi-decimal.component.css'],
  imports: [CommonModule, FormsModule, RouterLink],
})
export class PiDecimalComponent implements OnDestroy {
  n: number | null = 1000;
  blockSize: number | null = 10;
  readonly maximum = piDigitLimit();
  groupedDownload = true;
  calculating = false;
  error = '';
  formatError = '';
  notice = '';
  result: PiResult | null = null;
  progress: PiProgress | null = null;
  page = 0;
  blocks: { text: string; start: number }[] = [];
  private appliedBlockSize = 10;
  private worker?: Worker;
  private readonly downloadUrls = new Set<string>();
  get pageSize(): number { return this.appliedBlockSize ? Math.floor(1000 / this.appliedBlockSize) * this.appliedBlockSize : 1000; }
  get pages(): number { return Math.max(1, Math.ceil((this.result?.digits ?? 0) / this.pageSize)); }
  get firstDigit(): number { return this.result?.digits ? this.page * this.pageSize + 1 : 0; }
  get lastDigit(): number { return Math.min((this.page + 1) * this.pageSize, this.result?.digits ?? 0); }
  get stage(): string {
    if (!this.progress) return 'Preparando el cálculo';
    return this.progress.stage === 'series' ? 'Sumando la serie de Chudnovsky' : this.progress.stage === 'sqrt' ? 'Calculando la raíz con precisión entera' : 'Verificando las cifras con cotas inferior y superior';
  }
  onCalculate(): void {
    this.stop(false); this.result = null; this.blocks = []; this.error = ''; this.notice = ''; this.progress = null;
    try {
      validateDigits(this.n ?? NaN);
      validateBlockSize(this.blockSize ?? NaN);
      this.appliedBlockSize = this.blockSize!; this.formatError = '';
      if (typeof Worker === 'undefined') throw new Error('El cálculo necesita un navegador con Web Workers.');
      const worker = new Worker(new URL('./pi.worker', import.meta.url), { type: 'module' });
      this.worker = worker; this.calculating = true;
      worker.onmessage = ({ data }: MessageEvent<{ kind: string; progress?: PiProgress; result?: PiResult; message?: string }>) => {
        if (this.worker !== worker) return;
        if (data.kind === 'progress' && data.progress) this.progress = data.progress;
        if (data.kind === 'result' && data.result) {
          this.result = data.result; this.page = 0; this.renderPage();
        }
        if (data.kind === 'error') this.error = data.message ?? 'No se pudo completar el cálculo.';
        if (data.kind !== 'progress') this.stop(false);
      };
      worker.onerror = event => {
        if (this.worker !== worker) return;
        event.preventDefault(); this.error = 'No se pudo ejecutar el cálculo. Prueba con menos decimales.'; this.stop(false);
      };
      worker.postMessage({ digits: this.n });
    } catch (error) { this.stop(false); this.error = error instanceof Error ? error.message : String(error); }
  }
  example(digits: number): void { this.n = digits; this.onCalculate(); }
  applyBlocks(): void {
    try {
      validateBlockSize(this.blockSize ?? NaN);
      this.appliedBlockSize = this.blockSize!; this.formatError = ''; this.page = 0; this.renderPage();
    } catch (error) { this.formatError = error instanceof Error ? error.message : String(error); }
  }
  changePage(delta: number): void {
    this.page = Math.max(0, Math.min(this.pages - 1, this.page + delta)); this.renderPage();
  }
  private renderPage(): void {
    const start = this.page * this.pageSize;
    const decimals = this.result?.decimals.slice(start, start + this.pageSize) ?? '';
    this.blocks = digitBlocks(decimals, this.appliedBlockSize).map((text, i) => ({ text, start: start + i * (this.appliedBlockSize || this.pageSize) + 1 }));
  }
  download(): void {
    if (!this.result || this.formatError) return;
    try {
      const content = piText(this.result.decimals, this.appliedBlockSize, this.groupedDownload);
      const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
      this.downloadUrls.add(url);
      const link = document.createElement('a');
      link.href = url; link.download = `pi-${this.result.digits}-decimales.txt`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => { URL.revokeObjectURL(url); this.downloadUrls.delete(url); }, 1000);
    } catch { this.error = 'No se pudo descargar el fichero. Revisa los permisos de descarga del navegador.'; }
  }
  stop(showNotice = true): void {
    this.worker?.terminate(); this.worker = undefined;
    if (this.calculating && showNotice) this.notice = 'Cálculo detenido. Puedes iniciar uno nuevo.';
    this.calculating = false;
  }
  ngOnDestroy(): void {
    this.stop(false);
    for (const url of this.downloadUrls) URL.revokeObjectURL(url);
    this.downloadUrls.clear();
  }
}
