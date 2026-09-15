import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { montyRound } from '../../shared/math/monty-hall';

@Component({
  selector: 'app-monty-hall', standalone: true, imports: [CommonModule],
  templateUrl: './monty-hall.component.html', styleUrl: './monty-hall.component.css'
})
export class MontyHallComponent implements OnDestroy {
  readonly doors = [0, 1, 2];
  prize = Math.floor(Math.random() * 3);
  round: ReturnType<typeof montyRound> | null = null;
  finalChoice: number | null = null;
  trials = 0; stayWins = 0; switchWins = 0; running = false;
  private timer?: ReturnType<typeof setTimeout>;
  choose(door: number): void { if (!this.round) this.round = montyRound(this.prize, door); }
  finish(change: boolean): void { if (this.round && this.finalChoice === null) this.finalChoice = change ? this.round.switched : this.round.choice; }
  resetGame(): void { this.prize = Math.floor(Math.random() * 3); this.round = null; this.finalChoice = null; }
  label(door: number): string {
    if (this.finalChoice !== null) return door === this.prize ? 'Premio' : 'Cabra';
    return this.round?.opened === door ? 'Cabra' : 'Cerrada';
  }
  run(): void {
    if (this.running) return;
    this.running = true;
    let remaining = 1000;
    const batch = (): void => {
      for (let i = 0; i < 25 && remaining > 0; i++, remaining--) {
        const round = montyRound(Math.floor(Math.random() * 3), Math.floor(Math.random() * 3));
        this.trials++; if (round.stayWins) this.stayWins++; if (round.switchWins) this.switchWins++;
      }
      if (remaining) this.timer = setTimeout(batch, 25); else { this.running = false; this.timer = undefined; }
    };
    this.timer = setTimeout(batch, 25);
  }
  stop(): void { if (this.timer !== undefined) clearTimeout(this.timer); this.timer = undefined; this.running = false; }
  resetStats(): void { this.stop(); this.trials = 0; this.stayWins = 0; this.switchWins = 0; }
  percent(wins: number): string { return this.trials ? (100 * wins / this.trials).toFixed(2) + ' %' : 'Sin ensayos'; }
  ngOnDestroy(): void { this.stop(); }
}
