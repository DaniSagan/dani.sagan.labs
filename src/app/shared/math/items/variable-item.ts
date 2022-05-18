import { NumberDispenser } from "../number-dispenser";
import { FormulaItem } from "./formula-item";

export class VariableItem extends FormulaItem {

  private _value: string;

  constructor(numberDispenser: NumberDispenser, value: string) {
    super(numberDispenser);
    this._value = value;
  }

  override toLatex(): string {
      return `${this._value}`;
  }
}
