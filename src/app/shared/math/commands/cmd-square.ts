import { FormulaBuilder } from "../formula-builder";
import { ExponentItem } from "../items/exponent-item";
import { IntegerItem } from "../items/integer-item";
import { CommandBase } from "./command-base";

export class CmdSquare extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let base = equationBuilder.pop()!;
    equationBuilder.push(
      new ExponentItem(equationBuilder.numberDispenser,
                       base,
                       new IntegerItem(equationBuilder.numberDispenser, 2)));
  }
}
