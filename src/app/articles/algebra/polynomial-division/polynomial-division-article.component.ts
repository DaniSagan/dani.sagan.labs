import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { curve, dividePolynomial, evaluatePolynomial, polynomialText } from '../../shared/learning-math';
import { PlotSeries } from '../../shared/learning-plot.component';
@Component({ selector: 'app-polynomial-division-article', standalone: true, imports: LEARNING_IMPORTS, templateUrl: './polynomial-division-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class PolynomialDivisionArticleComponent {
    static title = 'División de polinomios y teorema del resto';
    static route = 'polynomial-division';
    choice = 0;
    divisorChoice = 0;
    root = 1;
    x = 1;
    readonly examples = [{ name: 'x³ − 2x + 2', coefficients: [2, -2, 0, 1] }, { name: 'x⁴ + 3x + 1', coefficients: [1, 3, 0, 0, 1] }, { name: 'x³ − 6x² + 11x − 6', coefficients: [-6, 11, -6, 1] }];
    result = dividePolynomial(this.examples[0].coefficients, [-1, 1]);
    series: PlotSeries[] = [];
    readonly text = polynomialText;
    get dividend(): number[] { return this.examples[this.choice].coefficients; }
    get divisor(): number[] { return this.divisorChoice === 0 ? [-this.root, 1] : [-1, 0, 1]; }
    get evaluated(): number { return evaluatePolynomial(this.dividend, this.x); }
    get rebuilt(): number { return evaluatePolynomial(this.divisor, this.x) * evaluatePolynomial(this.result.quotient, this.x) + evaluatePolynomial(this.result.remainder, this.x); }
    constructor() { this.update(); }
    update(): void { this.result = dividePolynomial(this.dividend, this.divisor); this.series = [curve('P(x)', x => evaluatePolynomial(this.dividend, x), -3, 3), curve('R(x)', x => evaluatePolynomial(this.result.remainder, x), -3, 3, '#4a9eff')]; }
}
