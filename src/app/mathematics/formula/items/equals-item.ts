import { FormulaItem } from "./formula-item";

export class EqualsItem extends FormulaItem {

  private _lhs: FormulaItem;
  private _rhs: FormulaItem;

  constructor(lhs: FormulaItem, rhs: FormulaItem) {
    super();
    this._lhs = lhs;
    this._rhs = rhs;
  }

  override toLatex(): string {
      return `${this._lhs.toLatex()} = ${this._rhs.toLatex()}`;
  }
}
