import { Component, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { DiagonalizationLabComponent } from '../../../widgets/diagonalization/diagonalization-lab.component';
import { SelfAssessmentComponent } from '../../../widgets/self-assessment/self-assessment.component';
import { DIAGONALIZATION_EXERCISES } from './diagonalization-exercises';

@Component({
  selector: 'app-diagonalization-article',
  standalone: true,
  imports: [
    RouterLink,
    FormulaComponent,
    DiagonalizationLabComponent,
    SelfAssessmentComponent,
  ],
  templateUrl: './diagonalization-article.component.html',
  styleUrl: './diagonalization-article.component.css',
})
export class DiagonalizationArticleComponent implements OnDestroy {
  static title = 'Diagonalización de matrices y valores propios';
  static route = 'matrix-diagonalization';
  static description =
    'Descubre las direcciones propias de una transformación, construye una base de autovectores y explora el teorema espectral, potencias y recurrencias con cálculo exacto.';
  readonly exercises = DIAGONALIZATION_EXERCISES;
  private readonly previousTitle: string;
  private readonly previousDescription: string | null;
  constructor(
    private title: Title,
    private meta: Meta,
  ) {
    this.previousTitle = title.getTitle();
    this.previousDescription =
      meta.getTag('name="description"')?.content ?? null;
    title.setTitle(`${DiagonalizationArticleComponent.title} · DaniSagan Labs`);
    meta.updateTag({
      name: 'description',
      content: DiagonalizationArticleComponent.description,
    });
  }
  ngOnDestroy() {
    this.title.setTitle(this.previousTitle);
    if (this.previousDescription === null)
      this.meta.removeTag('name="description"');
    else
      this.meta.updateTag({
        name: 'description',
        content: this.previousDescription,
      });
  }
}
