import { PlotMarker, PlotSeries } from './learning-plot.component';
export interface MathLabControl {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
}
export interface MathLabResult {
    series: PlotSeries[];
    bounds: [number, number, number, number];
    rows: [string, string][];
    description: string;
    xLabel: string;
    yLabel: string;
    markers?: PlotMarker[];
    /** Optional interval diagram, with endpoints normalized to [0, 1]. */
    intervals?: [number, number][];
    intervalView?: {
        title: string;
        caption: string;
    };
}
/** Content and calculations belong to the caller; the shared view only renders them. */
export interface MathLabDefinition {
    title: string;
    prompt: string;
    expression: string;
    controls: MathLabControl[];
    equalAspectRatio?: boolean;
    barWidth?: number;
    note?: string;
    calculate: (values: number[]) => MathLabResult;
}
