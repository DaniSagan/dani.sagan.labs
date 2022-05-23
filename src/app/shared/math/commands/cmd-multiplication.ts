import { FormulaBuilder } from "../formula-builder";
import { MultiplicationItem } from "../items/multiplication-item";
import { CommandBase } from "./command-base";

export class CmdMultiplication extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let rhs = equationBuilder.pop()!;
    let lhs = equationBuilder.pop()!;
    equationBuilder.push(new MultiplicationItem(equationBuilder.numberDispenser, lhs, rhs));
  }
}
