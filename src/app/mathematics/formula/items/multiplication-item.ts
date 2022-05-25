import { FormulaItem } from "./formula-item";

export class MultiplicationItem extends FormulaItem {

  private _lhs: FormulaItem;
  private _rhs: FormulaItem;

  constructor(lhs: FormulaItem, rhs: FormulaItem) {
    super();
    this._lhs = lhs;
    this._rhs = rhs;
  }

  static multiProduct(items: FormulaItem[]): FormulaItem {
    if(items.length == 1) return items[0];
    return new MultiplicationItem(items[0], this.multiProduct(items.slice(1)));
  }

  override toLatex(): string {
      return `${this._lhs.toLatex()} \\cdot ${this._rhs.toLatex()}`;
  }
}
