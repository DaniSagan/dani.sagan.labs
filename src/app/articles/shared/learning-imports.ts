import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { LearningPlotComponent } from './learning-plot.component';
export const LEARNING_IMPORTS = [CommonModule, FormsModule, RouterLink, FormulaComponent, LearningPlotComponent];
