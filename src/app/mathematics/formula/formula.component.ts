import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormulaItem } from './items/formula-item';
import { MathjaxModule } from 'mathjax-angular';

@Component({
  selector: 'app-formula',
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.css'],
  standalone: true,
  imports: [MathjaxModule],
})
export class FormulaComponent implements OnInit, OnChanges {
  public content: string;

  private _formula: FormulaItem | null;

  @Input() set formula(value: FormulaItem | null) {
    this._formula = value;
    if (value !== null) {
      this.content = `$ ${value.toLatex()} $`;
    } else {
      this.content = '';
    }
  }

  constructor() {
    this.content = '';
    this._formula = null;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
  }
}
