import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FEIGENBAUM_DELTA, FeigenbaumMap, superstableLevels } from '../../shared/math/feigenbaum';

@Component({
  selector: 'app-feigenbaum-convergence', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './feigenbaum-convergence.component.html', styleUrl: './feigenbaum-widgets.css'
})
export class FeigenbaumConvergenceComponent {
  readonly delta = FEIGENBAUM_DELTA;
  readonly logistic = superstableLevels('logistic');
  readonly sine = superstableLevels('sine');
  kind: FeigenbaumMap = 'logistic';
  level = 5;
  get rows() { return this.kind === 'logistic' ? this.logistic : this.sine; }
  get selected() { return this.rows[this.level]; }
  get error(): number { return Math.abs(this.selected.delta! - this.delta); }
  get prediction(): number {
    return this.selected.parameter + (this.selected.parameter - this.rows[this.level - 1].parameter) / (this.selected.delta! - 1);
  }
  path(kind: FeigenbaumMap): string {
    const rows = kind === 'logistic' ? this.logistic : this.sine;
    return rows.slice(2, this.level + 1).map((row, i) => `${i ? 'L' : 'M'}${65 + i * 110},${this.y(Math.abs(row.delta! - this.delta))}`).join(' ');
  }
  y(error: number): number { return 30 - Math.log10(Math.max(1e-8, error)) * 28; }
  absError(value: number | null): number { return Math.abs((value ?? 0) - this.delta); }
  exportCsv(): void {
    const csv = ['map,n,period,s_n,delta_n,alpha_n', ...(['logistic', 'sine'] as const).flatMap(kind =>
      (kind === 'logistic' ? this.logistic : this.sine).map(row => `${kind},${row.n},${row.period},${row.parameter},${row.delta ?? ''},${row.alpha ?? ''}`))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'feigenbaum-ciclos-superestables.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
