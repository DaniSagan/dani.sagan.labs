import { FormulaBuilder } from "../formula-builder";
import { FractionItem } from "../items/fraction-item";
import { CommandBase } from "./command-base";

export class CmdFraction extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let denominator = equationBuilder.pop()!;
    let numerator = equationBuilder.pop()!;
    equationBuilder.push(new FractionItem(equationBuilder.numberDispenser, numerator, denominator));
  }
}
