import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { TesseractViewerComponent } from './tesseract-viewer.component';

@Component({
  selector: 'app-tesseract-article', standalone: true,
  imports: [FormulaComponent, TesseractViewerComponent],
  templateUrl: './tesseract-article.component.html',
  styleUrls: ['../shared/geometry-article.css', './tesseract-article.component.css']
})
export class TesseractArticleComponent {
  static title = 'El teseracto: un cubo en cuatro dimensiones';
  static route = 'tesseract';
}
