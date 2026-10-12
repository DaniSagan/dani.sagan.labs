import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPlotComponent } from './learning-plot.component';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { MathLabDefinition, MathLabControl, MathLabResult } from './math-lab.model';
@Component({ selector: 'app-math-lab', standalone: true, imports: [CommonModule, FormsModule, LearningPlotComponent, FormulaComponent], styleUrls: ['./learning-article.css'], templateUrl: './math-lab.component.html' })
export class MathLabComponent implements OnChanges {
    @Input({ required: true })
    definition!: MathLabDefinition;
    title = '';
    prompt = '';
    expression = '';
    controls: MathLabControl[] = [];
    result: MathLabResult = { series: [], bounds: [0, 1, 0, 1], rows: [], description: '', xLabel: 'x', yLabel: 'y' };
    ngOnChanges(): void { this.reset(); }
    reset(): void {
        this.title = this.definition.title;
        this.prompt = this.definition.prompt;
        this.expression = this.definition.expression;
        this.controls = this.definition.controls.map(c => ({ ...c }));
        this.update();
    }
    update(): void {
        this.controls.forEach((c, i) => {
            const value = Number(c.value);
            const bounded = Number.isFinite(value) ? Math.min(c.max, Math.max(c.min, value)) : this.definition.controls[i].value;
            c.value = c.step === 1 ? Math.round(bounded) : bounded;
        });
        this.result = this.definition.calculate(this.controls.map(c => c.value));
        if (this.definition.equalAspectRatio) {
            const [xmin, xmax, ymin, ymax] = this.result.bounds, cx = (xmin + xmax) / 2, cy = (ymin + ymax) / 2;
            const width = Math.max(xmax - xmin, (ymax - ymin) * 624 / 284), height = width * 284 / 624;
            this.result = { ...this.result, bounds: [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2] };
        }
    }
}
