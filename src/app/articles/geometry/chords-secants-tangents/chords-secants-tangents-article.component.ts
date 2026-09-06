import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-chords-secants-tangents-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './chords-secants-tangents-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class ChordsSecantsTangentsArticleComponent {
  static title = 'Teoremas de cuerdas, secantes y tangentes';
  static route = 'chords-secants-tangents';
}
