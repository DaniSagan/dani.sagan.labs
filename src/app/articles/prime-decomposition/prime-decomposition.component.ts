import { Component, Input, OnInit } from '@angular/core';
import { CmdExponent } from 'src/app/shared/math/commands/cmd-exponent';
import { CmdFactory } from 'src/app/shared/math/commands/cmd-factory';
import { CmdMultiplication } from 'src/app/shared/math/commands/cmd-multiplication';
import { FormulaBuilder } from 'src/app/shared/math/formula-builder';
import { FormulaItem } from 'src/app/shared/math/items/formula-item';

interface Factor {
  base: number;
  exponent: number;
}

@Component({
  selector: 'app-prime-decomposition',
  templateUrl: './prime-decomposition.component.html',
  styleUrls: ['./prime-decomposition.component.css']
})
export class PrimeDecompositionComponent implements OnInit {

  // @Input() value: number;
  public value: string;
  public formula: FormulaItem | null;
  public working: boolean = false;

  private _formulaBuilder: FormulaBuilder;

  constructor() {
    // this.value = 0;
    this.value = "";
    this.formula = null;
    this._formulaBuilder = new FormulaBuilder(new CmdFactory());
  }

  ngOnInit(): void {
  }

  onButtonClick(value: string) {
    let decomposition: Factor[] = this.getFactors(parseInt(value));
    this.formula = this.getFormulaFromFactors(decomposition);
  }

  onInputTextChange(event: Event) {
    // let decomposition: Factor[] = this.getFactors(parseInt(this.value));
    // this.formula = this.getFormulaFromFactors(decomposition);
    this.working = true;
    this.getFactorsAsync(parseInt(this.value)).then((decomposition: Factor[]) => {
      this.formula = this.getFormulaFromFactors(decomposition);
      this.working = false;
    });

  }

  getFormulaFromFactors(factors: Factor[]) {
    this._formulaBuilder.new();
    if(factors[0].exponent > 1) {
      this._formulaBuilder.int(factors[0].base).int(factors[0].exponent).exec(CmdExponent);
    } else {
      this._formulaBuilder.int(factors[0].base);
    }
    for(const factor of factors.slice(1)) {
      if(factor.exponent > 1) {
        this._formulaBuilder.int(factor.base).int(factor.exponent).exec(CmdExponent).exec(CmdMultiplication);
      } else {
        this._formulaBuilder.int(factor.base).exec(CmdMultiplication);
      }
    }
    return this._formulaBuilder.build();
  }

  getFactorsAsync(value: number): Promise<Factor[]> {
    return new Promise<Factor[]>((resolve, reject) => {
      resolve(this.getFactors(value));
    });
  }

  getFactors(value: number): Factor[] {
    let result: Factor[] = [];
    let currentValue = value;
    if(value < 2) return [{base: value, exponent: 1}];
    let factor: number = 2;
    while(currentValue > 1) {
      if(currentValue % factor === 0) {
        let foundFactor = result.find(e => e.base === factor);
        if(foundFactor) {
          foundFactor.exponent++;
        } else {
          result.push({base: factor, exponent: 1});
        }
        currentValue /= factor;
      } else {
        factor++;
      }
    }
    return result;
  }

  isPrime(value: number): boolean {
    if(value < 2) return false;
    else if(value === 2) return true;
    else if(value % 2 === 0) return false;
    else {
      for(let n: number = 3; n < Math.sqrt(value); n += 2) {
        if(value % n === 0) return false;
      }
      return true;
    }
  }

}
