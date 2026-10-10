import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';

@Component({
  selector: 'app-gaussian-elimination-article',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FormulaComponent],
  templateUrl: './gaussian-elimination-article.component.html',
  styleUrl: '../../shared/foundation-article.css'
})
export class GaussianEliminationArticleComponent {
  static title = "Eliminación de Gauss y teorema de Rouché–Capelli";
  static route = 'gaussian-elimination';
  static description = "Clasifica el sistema con parámetro mediante Gauss y compara los rangos de la matriz y de la ampliada.";

  parameter = 2;
  stage = 0;
  inconsistent = false;
  get rows(): number[][] {
    const a=Number(this.parameter),b=this.inconsistent?2:1;
    return this.stage===0?[[1,1,1,1],[1,a,1,b],[1,1,a,1]]:[[1,1,1,1],[0,a-1,0,b-1],[0,0,a-1,0]];
  }
  get classification(): string {
    if(Number(this.parameter)!==1) return 'Compatible determinado · ambos rangos = 3';
    return this.inconsistent?'Incompatible · rango A = 1, rango ampliado = 2':'Compatible indeterminado · ambos rangos = 1';
  }
  get solution(): string {
    if(Number(this.parameter)===1) return this.inconsistent?'La fila 0 = 1 impide cualquier solución.':'(x,y,z) = (1 − s − t, s, t), con s y t reales.';
    const y=(this.inconsistent?1:0)/(Number(this.parameter)-1);
    return '(x,y,z) = ('+(1-y).toFixed(3)+', '+y.toFixed(3)+', 0).';
  }
}
