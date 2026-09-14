import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { UlamExplorerComponent } from '../../../widgets/ulam-explorer/ulam-explorer.component';

@Component({
  selector: 'app-ulam-spiral-article', standalone: true,
  imports: [CommonModule, FormsModule, FormulaComponent, UlamExplorerComponent],
  templateUrl: './ulam-spiral-article.component.html',
  styles: ['.diagonals { overflow-x: auto; } th, td { padding: .5rem .8rem; border-bottom: 1px solid #666; } input { display: block; width: 100%; margin: 1rem 0; }']
})
export class UlamSpiralArticleComponent {
  static title = 'La espiral de Ulam';
  static route = 'ulam-spiral';
  rings = 5;
  get rows(): { r: number; ne: number; nw: number; sw: number; se: number }[] {
    return Array.from({ length: this.rings }, (_, i) => {
      const r = i + 1;
      return { r, ne: 4 * r * r - 2 * r + 1, nw: 4 * r * r + 1, sw: 4 * r * r + 2 * r + 1, se: (2 * r + 1) ** 2 };
    });
  }
}
