import { FormulaItem } from "./formula-item";

export class ParenthesesItem extends FormulaItem {

  private _child: FormulaItem;

  constructor(value: FormulaItem) {
    super();
    this._child = value;
  }

  toLatex(): string {
    return `\\left(${this._child.toLatex()}\\right)`
  }
}
