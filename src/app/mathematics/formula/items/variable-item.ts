import { FormulaItem } from "./formula-item";

export class VariableItem extends FormulaItem {

  private _value: string;

  constructor(value: string) {
    super();
    this._value = value;
  }

  override toLatex(): string {
      return `${this._value}`;
  }
}
