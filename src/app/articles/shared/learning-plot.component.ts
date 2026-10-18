import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface PlotSeries {
    label: string;
    points: [
        number,
        number
    ][];
    color?: string;
    kind?: 'line' | 'bars' | 'area' | 'scatter';
    dashed?: boolean;
}
export interface PlotMarker {
    x: number;
    y: number;
    label: string;
    color?: string;
    open?: boolean;
}
@Component({
    selector: 'app-learning-plot', standalone: true, imports: [CommonModule],
    template: `
    <figure>
      <svg viewBox="0 0 720 360" role="img" [attr.aria-label]="description">
        <title>{{ description }}</title>
        <defs><clipPath [id]="clipId"><rect x="64" y="24" width="624" height="284" /></clipPath></defs>
        @for (tick of xticks; track tick) {
          <line [attr.x1]="sx(tick)" y1="24" [attr.x2]="sx(tick)" y2="308" class="grid" />
          <text [attr.x]="sx(tick)" y="331" text-anchor="middle">{{ number(tick) }}</text>
        }
        @for (tick of yticks; track tick) {
          <line x1="64" [attr.y1]="sy(tick)" x2="688" [attr.y2]="sy(tick)" class="grid" />
          <text x="55" [attr.y]="sy(tick) + 4" text-anchor="end">{{ number(tick) }}</text>
        }
        <line x1="64" [attr.y1]="sy(clamp(0, ymin, ymax))" x2="688" [attr.y2]="sy(clamp(0, ymin, ymax))" class="axis" />
        <line [attr.x1]="sx(clamp(0, xmin, xmax))" y1="24" [attr.x2]="sx(clamp(0, xmin, xmax))" y2="308" class="axis" />
        <g [attr.clip-path]="'url(#' + clipId + ')'">
          @for (item of paths; track $index) {
            @if (item.series.kind === 'scatter') {
              @for (p of item.series.points; track $index) {<circle [attr.cx]="sx(p[0])" [attr.cy]="sy(p[1])" r="2.5" [attr.fill]="item.color"><title>{{ item.series.label }}: {{ number(p[0]) }}, {{ number(p[1]) }}</title></circle>}
            } @else if (item.series.kind === 'bars') {
              @for (p of item.series.points; track $index) {
                <rect [attr.x]="sx(p[0]) - barWidth / 2" [attr.y]="Math.min(sy(p[1]), sy(0))" [attr.width]="barWidth" [attr.height]="Math.abs(sy(p[1]) - sy(0))" [attr.fill]="item.color" opacity=".7"><title>{{ item.series.label }}: {{ p[0] }} → {{ number(p[1]) }}</title></rect>
              }
            } @else {
              <path [attr.d]="item.path" [attr.stroke]="item.color" [attr.fill]="item.series.kind === 'area' ? item.color : 'none'" [attr.fill-opacity]="item.series.kind === 'area' ? .22 : 0" [attr.stroke-dasharray]="item.series.dashed ? '6 5' : null" stroke-width="2.2" />
            }
          }
          @for (point of markers; track $index) {
            <circle [attr.cx]="sx(point.x)" [attr.cy]="sy(point.y)" r="5" [attr.fill]="point.open ? 'var(--bg2)' : point.color || '#e8c777'" [attr.stroke]="point.color || '#e8c777'" stroke-width="2"><title>{{ point.label }}: ({{ number(point.x) }}, {{ number(point.y) }})</title></circle>
          }
        </g>
        <text x="688" y="353" text-anchor="end">{{ xLabel }}</text><text x="64" y="15">{{ yLabel }}</text>
      </svg>
      <figcaption>{{ description }}</figcaption>
      <div class="legend">@if (showLegend) { @for (item of paths; track $index) { <span><i [style.background]="item.color"></i>{{ item.series.label }}</span> } }</div>
    </figure>`,
    styles: [`:host{display:block;min-width:0}figure{margin:1rem 0}svg{display:block;width:100%;height:auto;overflow:visible}text{fill:var(--ink-dim);font:11px monospace}.grid{stroke:#ffffff0b}.axis{stroke:#777580;stroke-width:1}figcaption{font-size:.85rem;color:var(--ink-dim);line-height:1.5}.legend{display:flex;flex-wrap:wrap;gap:.5rem 1rem;font:11px monospace;color:var(--ink);margin-top:.75rem}.legend span{display:flex;gap:6px;align-items:center}.legend i{width:15px;height:3px}`]
})
export class LearningPlotComponent implements OnChanges {
    private static nextId = 0;
    readonly clipId = `learning-clip-${LearningPlotComponent.nextId++}`;
    readonly Math = Math;
    @Input()
    description = '';
    @Input() showLegend = true;
    @Input()
    xLabel = 'x';
    @Input()
    yLabel = 'y';
    @Input()
    xmin = -5;
    @Input()
    xmax = 5;
    @Input()
    ymin = -5;
    @Input()
    ymax = 5;
    @Input()
    series: PlotSeries[] = [];
    @Input()
    markers: PlotMarker[] = [];
    @Input()
    barWidth = 14;
    paths: {
        series: PlotSeries;
        color: string;
        path: string;
    }[] = [];
    xticks: number[] = [];
    yticks: number[] = [];
    sx(x: number): number { return 64 + 624 * (x - this.xmin) / (this.xmax - this.xmin); }
    sy(y: number): number { return 308 - 284 * (y - this.ymin) / (this.ymax - this.ymin); }
    clamp(x: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, x)); }
    number(x: number): string { return Math.abs(x) < 1e-10 ? '0' : Number(x.toPrecision(4)).toString(); }
    ngOnChanges(): void {
        this.xticks = Array.from({ length: 5 }, (_, i) => this.xmin + i * (this.xmax - this.xmin) / 4);
        this.yticks = Array.from({ length: 5 }, (_, i) => this.ymin + i * (this.ymax - this.ymin) / 4);
        this.paths = this.series.map((series, index) => {
            let connected = false;
            let path = '';
            for (const [x, y] of series.points) {
                if (!Number.isFinite(x) || !Number.isFinite(y)) {
                    connected = false;
                    continue;
                }
                path += `${connected ? 'L' : 'M'}${this.sx(x).toFixed(2)},${this.sy(y).toFixed(2)} `;
                connected = true;
            }
            if (series.kind === 'area' && series.points.length) {
                const first = series.points[0], last = series.points[series.points.length - 1];
                path += `L${this.sx(last[0])},${this.sy(0)} L${this.sx(first[0])},${this.sy(0)} Z`;
            }
            return { series, path, color: series.color || ['#e8c777', '#4a9eff', '#a8e6a0', '#c5a1ea'][index % 4] };
        });
    }
}
