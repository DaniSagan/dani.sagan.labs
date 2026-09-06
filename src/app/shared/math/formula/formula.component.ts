import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MathjaxModule } from "mathjax-angular";

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, MathjaxModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.css'
})
export class FormulaComponent implements OnInit, OnDestroy {
  private _expression = '';
  private _displayMode: 'block' | 'inline' = 'block';
  private readinessTimer?: ReturnType<typeof setTimeout>;
  isMathJaxReady = false;

  @Input() showCode = false;

  @Input()
  set displayMode(value: 'block' | 'inline') {
    this._displayMode = value ?? 'block';
    this.updateCodeExpression();
  }
  get displayMode(): 'block' | 'inline' {
    return this._displayMode;
  }

  @Input()
  set expression(value: string) {
    this._expression = value ?? '';
    this.updateCodeExpression();
  }
  get expression(): string {
    return this._expression;
  }

  codeExpression!: string;

  ngOnInit(): void {
    this.updateCodeExpression();
    this.ensureMathJaxReady();
  }

  ngOnDestroy(): void {
    clearTimeout(this.readinessTimer);
  }

  private updateCodeExpression(): void {
    const math = this._expression.trim();
    this.codeExpression = this._displayMode === 'inline'
      ? '$ ' + math + ' $'
      : '$$ ' + math + ' $$';
  }

  private ensureMathJaxReady(): void {
    const mathJax = (window as any).MathJax;
    // The directive can leave its element empty when instantiated during startup.
    // Create it only once the loader exposes the ready typesetting API.
    this.isMathJaxReady = !!mathJax?.isReady && typeof mathJax.typesetPromise === 'function';
    if (!this.isMathJaxReady) {
      this.readinessTimer = setTimeout(() => this.ensureMathJaxReady(), 50);
    }
  }
}
