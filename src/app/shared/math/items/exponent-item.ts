import { NumberDispenser } from "../number-dispenser";
import { FormulaItem } from "./formula-item";

export class ExponentItem extends FormulaItem {

  private _base: FormulaItem;
  private _exponent: FormulaItem;

  constructor(numberDispenser: NumberDispenser, base: FormulaItem, exponent: FormulaItem) {
    super(numberDispenser);
    this._base = base;
    this._exponent = exponent;
  }

  override toLatex(): string {
      return `{${this._base.toLatex()}}^{${this._exponent.toLatex()}}`;
  }
}
