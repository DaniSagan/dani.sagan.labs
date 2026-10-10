import { Component, InjectionToken, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PracticeProblem } from '../problem-catalog';

export const PROBLEM_LIST = new InjectionToken<readonly PracticeProblem[]>('Problem navigation list');

@Component({
  selector: 'app-problem-navigation',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="adjacent" aria-label="Problemas consecutivos">
      @if (previous; as problem) { <a [routerLink]="['/problems', problem.id]">← {{ problem.title }}</a> }
      @if (next; as problem) { <a [routerLink]="['/problems', problem.id]">{{ problem.title }} →</a> }
    </nav>
  `,
  styles: `
    :host { display: block; }
    .adjacent { display: flex; flex-wrap: wrap; justify-content: space-between; gap: .8rem; margin: 1rem 0 2rem; font-size: .9rem; }
    a { max-width: 100%; }
  `,
})
export class ProblemNavigationComponent {
  @Input({ required: true }) currentId = '';
  private readonly problems = inject(PROBLEM_LIST);

  get previous(): PracticeProblem | undefined {
    const index = this.problems.findIndex(problem => problem.id === this.currentId);
    return index > 0 ? this.problems[index - 1] : undefined;
  }

  get next(): PracticeProblem | undefined {
    const index = this.problems.findIndex(problem => problem.id === this.currentId);
    return index >= 0 ? this.problems[index + 1] : undefined;
  }
}
