import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CmdEquals } from 'src/app/shared/math/commands/cmd-equals';
import { CmdExponent } from 'src/app/shared/math/commands/cmd-exponent';
import { CmdFactory } from 'src/app/shared/math/commands/cmd-factory';
import { CmdFraction } from 'src/app/shared/math/commands/cmd-fraction';
import { CmdParentheses } from 'src/app/shared/math/commands/cmd-parentheses';
import { CmdSquare } from 'src/app/shared/math/commands/cmd-square';
import { CmdSubtraction } from 'src/app/shared/math/commands/cmd-subtraction';
import { CmdSum } from 'src/app/shared/math/commands/cmd-sum';
import { FormulaBuilder } from 'src/app/shared/math/formula-builder';
import { FormulaItem } from 'src/app/shared/math/items/formula-item';

@Component({
  selector: 'app-test-article',
  templateUrl: './test-article.component.html',
  styleUrls: ['./test-article.component.css']
})
export class TestArticleComponent implements OnInit, AfterViewInit {

  content: string = "$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$"
  equations: Map<string, string> = new Map<string, string>();

  private canvas?: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D | null;
  private commandFactory: CmdFactory;
  private equationBuilder: FormulaBuilder;

  public formula1: FormulaItem;

  constructor() {
    this.commandFactory = new CmdFactory();
    this.commandFactory.register('+', CmdSum);
    this.commandFactory.register('-', CmdSubtraction);
    this.commandFactory.register('/', CmdFraction);
    this.commandFactory.register('^', CmdExponent);
    this.commandFactory.register('square', CmdSquare);
    this.commandFactory.register('()', CmdParentheses);
    this.commandFactory.register('=', CmdEquals);
    this.equationBuilder = new FormulaBuilder(this.commandFactory);
    this.formula1 = this.equationBuilder.new().int(2).int(3).do('+').build();
  }

  ngOnInit(): void {
    this.equations.set('test', this.equationBuilder.new().int(3).int(17).do('+').int(5).do('/').do('()').do('square').build().toLatex());
    this.equations.set('pythagoras', this.equationBuilder.new().sqr(b => b.var('a')).sqr(b => b.var('b')).do('+').sqr(b => b.var('c')).do('=').build().toLatex());
    this.equations.set('pythagoras2', this.equationBuilder.new()
      .equals(
        b => b.sum(
            b => b.sqr(b => b.var('a')),
            b => b.sqr(b => b.var('b'))
        ),
        b => b.sqr(b => b.var('c'))
      ).build().toLatex()
    );
    this.equations.set('testfrac', this.equationBuilder.new().frac(b => b.int(5), b => b.int(3)).build().toLatex());
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d");
    if(this.context != null) {
      this.draw(this.context);
    }
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(300, 150);
    context.stroke();
    context.closePath();
  }

}
