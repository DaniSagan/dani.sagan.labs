import { Component, Input } from '@angular/core';
import { MathjaxModule } from "mathjax-angular";

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [MathjaxModule],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.css'
})
export class FormulaComponent {
  _expression: string = '';
  @Input() set expression(value: string)
  {
    this.codeExpression = '$$ ' + value + ' $$';
    this._expression = value;
  }
  get expression() {
    return this._expression;
  }

  codeExpression!: string;
}
