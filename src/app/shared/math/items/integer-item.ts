import { NumberDispenser } from "../number-dispenser";
import { FormulaItem } from "./formula-item";

export class IntegerItem extends FormulaItem {

  private _value: number;

  constructor(numberDispenser: NumberDispenser, value: number) {
    super(numberDispenser);
    this._value = value;
  }

  override toLatex(): string {
      return `${this._value}`;
  }
}
