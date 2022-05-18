import { FormulaBuilder } from "../formula-builder";
import { ExponentItem } from "../items/exponent-item";
import { SumItem } from "../items/sum-item";
import { CommandBase } from "./command-base";

export class CmdExponent extends CommandBase {
  override execute(equationBuilder: FormulaBuilder): void {
    let exponent = equationBuilder.pop()!;
    let base = equationBuilder.pop()!;
    equationBuilder.push(new ExponentItem(equationBuilder.numberDispenser, base, exponent));
  }
}
