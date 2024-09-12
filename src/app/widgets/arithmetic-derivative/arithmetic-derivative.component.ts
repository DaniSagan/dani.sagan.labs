import { Component, Input, OnInit } from '@angular/core';
import { EqualsItem } from '../../mathematics/formula/items/equals-item';
import { FormulaItem } from '../../mathematics/formula/items/formula-item';
import { FunctionItem } from '../../mathematics/formula/items/function-item';
import { IntegerItem } from '../../mathematics/formula/items/integer-item';
import { Factor, getFactors, isPrime } from '../../mathematics/mathematics';

@Component({
  selector: 'app-arithmetic-derivative',
  templateUrl: './arithmetic-derivative.component.html',
  styleUrls: ['./arithmetic-derivative.component.css']
})
export class ArithmeticDerivativeComponent implements OnInit {

  public formula: FormulaItem | null;
  public value: string;

  constructor() {
    this.formula = null;
    this.value = "";
  }

  ngOnInit(): void {
  }

  onInputTextChange(event: Event) {
    let valueInt = parseInt(this.value);
    let res = this.getArithmeticDerivative(valueInt);
    this.formula = new EqualsItem(
      new FunctionItem('D', [new IntegerItem(valueInt)]),
      new IntegerItem(res)
    );
  }

  onButtonClick(value: string) {
    let valueInt = parseInt(value);
    let res = this.getArithmeticDerivative(valueInt);
    this.formula = new EqualsItem(
      new FunctionItem('D', [new IntegerItem(valueInt)]),
      new IntegerItem(res)
    );
  }

  getArithmeticDerivative(value: number) {
    if(value <= 1 ) return 0;
    else if(isPrime(value)) return 1;
    else {
      let factors: Factor[] = getFactors(value);
      let result: number = 0;
      for(let factor of factors) {
        result += value * factor.exponent / factor.base;
      }
      return result;
    }
  }
}
