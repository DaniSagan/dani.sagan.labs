import { NumberDispenser } from "../number-dispenser";
import { FormulaItem } from "./formula-item";

export class RootItem extends FormulaItem {

  private _child: FormulaItem;

  constructor(numberDispenser: NumberDispenser, value: FormulaItem) {
    super(numberDispenser);
    this._child = value;
  }

  toLatex(): string {
    return `$ ${this._child.toLatex()} $`
  }
}
