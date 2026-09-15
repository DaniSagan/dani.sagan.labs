import { montyRound } from './monty-hall';
describe('montyRound', () => {
  it('never reveals the prize or the chosen door and switching wins exactly when the initial choice loses', () => {
    let stay = 0, change = 0;
    for (let prize = 0; prize < 3; prize++) for (let choice = 0; choice < 3; choice++) {
      for (const random of [0, 0.999]) {
        const r = montyRound(prize, choice, () => random);
        expect(r.opened).not.toBe(prize); expect(r.opened).not.toBe(choice);
        expect(r.switchWins).toBe(!r.stayWins);
        expect(r.switched).not.toBe(choice); expect(r.switched).not.toBe(r.opened);
        stay += Number(r.stayWins); change += Number(r.switchWins);
      }
    }
    expect(stay).toBe(6); expect(change).toBe(12);
  });
});
