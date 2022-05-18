import { FormulaBuilder } from "../formula-builder";
import { SumItem } from "../items/sum-item";
import { CommandBase } from "./command-base";

export class CmdSum extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let rhs = equationBuilder.pop()!;
    let lhs = equationBuilder.pop()!;
    equationBuilder.push(new SumItem(equationBuilder.numberDispenser, lhs, rhs));
  }
}
