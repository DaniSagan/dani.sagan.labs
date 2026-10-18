import { LinkedTextComponent, TextLink } from '../../shared/content/linked-text.component';
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPlotComponent } from './learning-plot.component';
import { EXPLORER_CONFIGS, ExplorerControl, ExplorerResult, explorerResult } from './deep-explorer-model';
@Component({ selector: 'app-deep-explorer', standalone: true, imports: [CommonModule, FormsModule, LearningPlotComponent, LinkedTextComponent], templateUrl: './deep-explorer.component.html', styleUrls: ['./deep-explorer.component.css'] })
export class DeepExplorerComponent implements OnChanges {
    @Input({ required: true })
    topic = '';
    controls: ExplorerControl[] = [];
    title = '';
    conceptLinks: readonly TextLink[] = [];
    seed = 1;
    result: ExplorerResult = { series: [], rows: [], explanation: '', xmin: 0, xmax: 1, ymin: 0, ymax: 1 };
    ngOnChanges(): void {
        const config = EXPLORER_CONFIGS[this.topic];
        if (!config) {
            throw new Error('Laboratorio desconocido: ' + this.topic);
        }
        this.title = config.title;
        this.conceptLinks = config.conceptLinks ?? [];
        this.controls = config.controls.map(control => ({ ...control }));
        this.seed = 1;
        this.update();
    }
    update(): void {
        this.result = explorerResult(this.topic, Number(this.controls[0].value), Number(this.controls[1].value), this.seed);
        if (['vector-spaces', 'gram-schmidt', 'pythagorean-distance', 'triangle-similarity', 'complex-arithmetic', 'euler-hamilton'].includes(this.topic)) {
            const r = this.result, cx = (r.xmin + r.xmax) / 2, cy = (r.ymin + r.ymax) / 2;
            const width = Math.max(r.xmax - r.xmin, (r.ymax - r.ymin) * 624 / 284), height = width * 284 / 624;
            r.xmin = cx - width / 2;
            r.xmax = cx + width / 2;
            r.ymin = cy - height / 2;
            r.ymax = cy + height / 2;
        }
    }
    reset(): void { this.ngOnChanges(); }
    rerun(): void { this.seed++; this.update(); }
    get stochastic(): boolean { return ['large-numbers-law', 'bootstrap'].includes(this.topic); }
    get legend(): boolean { return !['euler-hamilton', 'compact-perfect-disconnected'].includes(this.topic); }
}
