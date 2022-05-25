import { FormulaBuilder } from "../formula-builder";
import { EqualsItem } from "../items/equals-item";
import { CommandBase } from "./command-base";

export class CmdFunction extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let rhs = equationBuilder.pop()!;
    let lhs = equationBuilder.pop()!;
    equationBuilder.push(new EqualsItem(equationBuilder.numberDispenser, lhs, rhs));
  }
}
