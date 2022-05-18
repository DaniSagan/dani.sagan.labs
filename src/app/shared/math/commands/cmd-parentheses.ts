import { FormulaBuilder } from "../formula-builder";
import { ParenthesesItem } from "../items/parentheses-item";
import { CommandBase } from "./command-base";

export class CmdParentheses extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let child = equationBuilder.pop()!;
    equationBuilder.push(new ParenthesesItem(equationBuilder.numberDispenser, child));
  }
}
