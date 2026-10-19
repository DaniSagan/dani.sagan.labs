import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HydraGame, HydraPreset } from './hydra-engine';
@Component({
  selector: 'app-hydra-lab', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './hydra-lab.component.html',
  styleUrls: ['../../shared/learning-article.css', './hydra-lab.component.css'],
})
export class HydraLabComponent {
  readonly game = new HydraGame();
  preset: HydraPreset = 'fork';
  constructor(private readonly element: ElementRef<HTMLElement>) {}
  cut(id: number): void {
    if (!this.game.cut(id)) return;
    requestAnimationFrame(() => {
      const next = this.element.nativeElement.querySelector<HTMLButtonElement>('.hydra-head, #hydra-reset');
      // Keep keyboard focus in the battle when its former head disappears.
      const head = this.element.nativeElement.querySelector<HTMLButtonElement>('.hydra-head');
      (head ?? next)?.focus({ preventScroll: true });
    });
  }
  restart(): void { this.game.reset(this.preset); }
}
