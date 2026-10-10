import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PracticeProblem } from '../problem-catalog';
import { PROBLEM_BLOCKS, PROBLEMS } from '../problems.data';

@Component({
  selector: 'app-problems-intro', standalone: true, imports: [FormsModule, RouterLink],
  templateUrl: './problems-intro.component.html', styleUrl: './problems-intro.component.css'
})
export class ProblemsIntroComponent {
  readonly problems = PROBLEMS;
  readonly blocks = PROBLEM_BLOCKS;
  readonly topicCount = PROBLEM_BLOCKS.reduce((total, block) => total + block.topics.length, 0);
  query = '';
  category = '';
  level = '';
  get filtered(): PracticeProblem[] {
    const query = this.normalize(this.query);
    return this.problems.filter(problem => (!this.category || problem.category === this.category)
      && (!this.level || problem.level === this.level)
      && this.normalize(`${problem.title} ${problem.topic} ${problem.statement}`).includes(query));
  }

  clearFilters(): void { this.query = ''; this.category = ''; this.level = ''; }
  private normalize(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
  }
}
