import { FormulaBuilder } from "../formula-builder";
import { SubtractionItem } from "../items/subtraction-item";
import { CommandBase } from "./command-base";

export class CmdSubtraction extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let rhs = equationBuilder.pop()!;
    let lhs = equationBuilder.pop()!;
    equationBuilder.push(new SubtractionItem(equationBuilder.numberDispenser, lhs, rhs));
  }
}
