import { FormulaItem } from "./formula-item";

export class IntegerItem extends FormulaItem {

  private _value: number;

  constructor(value: number) {
    super();
    this._value = value;
  }

  override toLatex(): string {
      return `${this._value}`;
  }
}
