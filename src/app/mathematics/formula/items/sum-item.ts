import { FormulaItem } from "./formula-item";

export class SumItem extends FormulaItem {

  private _lhs: FormulaItem;
  private _rhs: FormulaItem;

  constructor(lhs: FormulaItem, rhs: FormulaItem) {
    super();
    this._lhs = lhs;
    this._rhs = rhs;
  }

  static multiSum(items: FormulaItem[]): FormulaItem {
    if(items.length == 1) return items[0];
    return new SumItem(items[0], this.multiSum(items.slice(1)));
  }

  override toLatex(): string {
      return `${this._lhs.toLatex()} + ${this._rhs.toLatex()}`;
  }
}
