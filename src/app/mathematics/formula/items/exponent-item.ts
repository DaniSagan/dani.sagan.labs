import { FormulaItem } from "./formula-item";

export class ExponentItem extends FormulaItem {

  private _base: FormulaItem;
  private _exponent: FormulaItem;

  constructor(base: FormulaItem, exponent: FormulaItem) {
    super();
    this._base = base;
    this._exponent = exponent;
  }

  override toLatex(): string {
      return `{${this._base.toLatex()}}^{${this._exponent.toLatex()}}`;
  }
}
