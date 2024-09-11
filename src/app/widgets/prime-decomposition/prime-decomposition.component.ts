import { Component, Input, OnInit } from '@angular/core';
import { EqualsItem } from 'src/app/mathematics/formula/items/equals-item';
import { ExponentItem } from 'src/app/mathematics/formula/items/exponent-item';
import { FormulaItem } from 'src/app/mathematics/formula/items/formula-item';
import { IntegerItem } from 'src/app/mathematics/formula/items/integer-item';
import { MultiplicationItem } from 'src/app/mathematics/formula/items/multiplication-item';
import { getFactors } from 'src/app/mathematics/mathematics';

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

  public value: string;
  public formula: FormulaItem | null;
  public working: boolean = false;

  constructor() {
    this.value = "";
    this.formula = null;
  }

  ngOnInit(): void {
  }

  onButtonClick(value: string) {
    let valueInt = parseInt(this.value);
    let decomposition: Factor[] = getFactors(valueInt);
    this.formula = new EqualsItem(new IntegerItem(valueInt), this.getFormulaFromFactors(decomposition));
  }

  onInputTextChange(event: Event) {
    let valueInt = parseInt(this.value);
    this.getFactorsAsync(valueInt).then((decomposition: Factor[]) => {
      this.formula = new EqualsItem(new IntegerItem(valueInt), this.getFormulaFromFactors(decomposition));
    });
  }

  getFormulaFromFactors(factors: Factor[]): FormulaItem {
    return MultiplicationItem.multiProduct(factors.map(
      factor => {
        if(factor.exponent > 1) {
          return new ExponentItem(new IntegerItem(factor.base), new IntegerItem(factor.exponent));
        } else {
          return new IntegerItem(factor.base);
        }
      }
    ));
  }

  getFactorsAsync(value: number): Promise<Factor[]> {
    return new Promise<Factor[]>((resolve, reject) => {
      resolve(getFactors(value));
    });
  }
}
