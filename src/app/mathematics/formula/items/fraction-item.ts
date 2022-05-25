import { FormulaItem } from "./formula-item";

export class FractionItem extends FormulaItem {

  private _numerator: FormulaItem;
  private _demoninator: FormulaItem;

  constructor(numerator: FormulaItem, denominator: FormulaItem) {
    super();
    this._numerator = numerator;
    this._demoninator = denominator;
  }

  override toLatex(): string {
      return `\\frac{${this._numerator.toLatex()}}{${this._demoninator.toLatex()}}`;
  }
}
