import { NumberDispenser } from "../number-dispenser";
import { FormulaItem } from "./formula-item";

export class SubtractionItem extends FormulaItem {

  private _lhs: FormulaItem;
  private _rhs: FormulaItem;

  constructor(numberDispenser: NumberDispenser, lhs: FormulaItem, rhs: FormulaItem) {
    super(numberDispenser);
    this._lhs = lhs;
    this._rhs = rhs;
  }

  override toLatex(): string {
      return `${this._lhs.toLatex()} - ${this._rhs.toLatex()}`;
  }
}
