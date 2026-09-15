import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bayes } from '../../shared/math/bayes';

@Component({
  selector: 'app-bayes-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './bayes-explorer.component.html', styleUrl: './bayes-explorer.component.css'
})
export class BayesExplorerComponent {
  prior = 1; sensitivity = 90; falsePositive = 5;
  get result(): ReturnType<typeof bayes> { return bayes(this.prior / 100, this.sensitivity / 100, this.falsePositive / 100); }
  get rows() {
    const r = this.result;
    return [
      { label: 'Defectuosa · alarma', probability: r.truePositive, color: '#75cfff' },
      { label: 'Correcta · alarma', probability: r.falseAlarm, color: '#ffb184' },
      { label: 'Defectuosa · sin alarma', probability: r.missed, color: '#c6a0ff' },
      { label: 'Correcta · sin alarma', probability: r.correctNegative, color: '#8edbb1' }
    ];
  }
  percent(p: number | null): string { return p === null ? 'No definida' : `${(100 * p).toFixed(2)} %`; }
  preset(prior: number, sensitivity: number, falsePositive: number): void {
    this.prior = prior; this.sensitivity = sensitivity; this.falsePositive = falsePositive;
  }
}
