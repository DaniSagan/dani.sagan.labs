import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { decodeTwos, parseNumeral, signedEncodings } from './numeration.math';

@Component({
  selector: 'app-signed-integers',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signed-integers.component.html',
  styleUrls: ['../modular/modular-widgets.css', './numeration-widgets.css'],
})
export class SignedIntegersComponent {
  text = '-13';
  width = 8;
  error = '';
  value = -13n;
  encoding = signedEncodings(-13n, 8);
  readonly zero = 0n;
  update(): void {
    try {
      this.value = parseNumeral(this.text, 10);
      this.encoding = signedEncodings(this.value, this.width);
      this.error = '';
    } catch (error) {
      this.error = (error as Error).message;
    }
  }
  get bits(): string[] {
    return this.encoding.twos.split('');
  }
  flip(index: number): void {
    const bits = this.bits;
    bits[index] = bits[index] === '1' ? '0' : '1';
    this.text = decodeTwos(bits.join('')).toString();
    this.update();
  }
}
