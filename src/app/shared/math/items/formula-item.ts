import { NumberDispenser } from "../number-dispenser";

export class FormulaItem {

  private _id: number;

  constructor(numberDispenser: NumberDispenser) {
    this._id = numberDispenser.next();
  }

  toLatex() : string {
    return "";
  }

}
