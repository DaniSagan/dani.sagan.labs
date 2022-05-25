import { FormulaItem } from "./formula-item";

export class FunctionItem extends FormulaItem {

  private _name: string;
  private _parameters: FormulaItem[];

  constructor(name: string, parameters: FormulaItem[]) {
    super();
    this._name = name;
    this._parameters = parameters;
  }

  override toLatex(): string {
      return `${this._name}\\left(${this._parameters.map(item => item.toLatex()).join(", ")}\\right)`;
  }
}
