import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MathjaxModule } from "mathjax-angular";

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, MathjaxModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.css'
})
export class FormulaComponent implements OnInit {
  private _expression = '';
  private _displayMode: 'block' | 'inline' = 'block';

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

  private updateCodeExpression(): void {
    const math = this._expression.trim();
    this.codeExpression = this._displayMode === 'inline'
      ? '$ ' + math + ' $'
      : '$$ ' + math + ' $$';
  }

  private ensureMathJaxReady(): void {
    const mathJax = (window as any).MathJax;

    if (!mathJax || !mathJax.startup || !mathJax.startup.promise) {
      return;
    }

    mathJax.startup.promise.then(() => {
      this.updateCodeExpression();
    });
  }
}
