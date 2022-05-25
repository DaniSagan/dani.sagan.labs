import { CmdFactory } from "./commands/cmd-factory";
import { CommandBase } from "./commands/command-base";
import { EqualsItem } from "./items/equals-item";
import { ExponentItem } from "./items/exponent-item";
import { FormulaItem } from "./items/formula-item";
import { FractionItem } from "./items/fraction-item";
import { FunctionItem } from "./items/function-item";
import { IntegerItem } from "./items/integer-item";
import { RootItem } from "./items/root-item";
import { SumItem } from "./items/sum-item";
import { VariableItem } from "./items/variable-item";
import { NumberDispenser } from "./number-dispenser";

export class FormulaBuilder {

  private _rootItem: RootItem | null;
  private _numberDispenser: NumberDispenser;
  private _stack: FormulaItem[];
  private _commandFactory: CmdFactory;

  constructor(commandFactory: CmdFactory) {
    this._rootItem = null;
    this._numberDispenser = new NumberDispenser();
    this._stack = [];
    this._commandFactory = commandFactory;
  }

  new(): FormulaBuilder {
    this._stack = [];
    return this;
  }

  int(value: number): FormulaBuilder {
    this._stack.push(new IntegerItem(this._numberDispenser, value));
    return this;
  }

  var(value: string): FormulaBuilder {
    this._stack.push(new VariableItem(this._numberDispenser, value));
    return this;
  }

  sum(lhs: (fb1: FormulaBuilder) => FormulaBuilder, rhs: (fb2: FormulaBuilder) => FormulaBuilder): FormulaBuilder {
    let lhsItem = lhs(this).pop()!;
    let rhsItem = rhs(this).pop()!;
    this._stack.push(new SumItem(this._numberDispenser, lhsItem, rhsItem));
    return this;
  }

  equals(lhs: (fb1: FormulaBuilder) => FormulaBuilder, rhs: (fb2: FormulaBuilder) => FormulaBuilder): FormulaBuilder {
    let lhsItem = lhs(this).pop()!;
    let rhsItem = rhs(this).pop()!;
    this._stack.push(new EqualsItem(this._numberDispenser, lhsItem, rhsItem));
    return this;
  }

  sqr(value: (fb1: FormulaBuilder) => FormulaBuilder): FormulaBuilder {
    let base = value(this).pop()!;
    this._stack.push(new ExponentItem(this._numberDispenser,
                     base,
                     new IntegerItem(this._numberDispenser, 2)));
    return this;
  }

  frac(numerator: (fb1: FormulaBuilder) => FormulaBuilder, denominator: (fb2: FormulaBuilder) => FormulaBuilder): FormulaBuilder {
    let n = numerator(this).pop()!;
    let d = denominator(this).pop()!;
    this._stack.push(new FractionItem(this._numberDispenser, n, d));
    return this;
  }

  // func(name: string, parameters: (fb: FormulaBuilder) => FormulaBuilder[]): FormulaBuilder {
  //   let pp: FormulaItem[];
  //   let x = parameters(this);
  //   for(let k = 0; k < x.length; k++)
  //   this._stack.push(new FunctionItem(this._numberDispenser, name, pp));
  //   return this;
  // }

  exec<T extends CommandBase>(type: (new () => T)): FormulaBuilder {
    let cmdInstance: CommandBase = new type();
    cmdInstance.execute(this);
    return this;
  }

  do(commandName: string): FormulaBuilder {
    let cmdInstance: CommandBase = this._commandFactory.create(commandName);
    cmdInstance.execute(this);
    return this;
  }

  build(): RootItem {
    return new RootItem(this._numberDispenser, this._stack[0]);
  }

  pop(): FormulaItem | undefined {
    return this._stack.pop();
  }

  push(item: FormulaItem) {
    this._stack.push(item);
  }

  get numberDispenser(): NumberDispenser {
    return this._numberDispenser;
  }

}
