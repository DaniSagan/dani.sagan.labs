import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Big from 'big.js';

@Component({
  selector: 'app-pi-decimal',
  templateUrl: './pi-decimal.component.html',
  styleUrls: ['./pi-decimal.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class PiDecimalComponent {
  n: number = 10;  // Número de decimales inicial
  piDecimals: string = '';
  decimalPartLength = 100;
  calculating = false;
  calculatingArctanMessage: string = '';
  calculatingTermMessage: string = '';

  // Función para calcular Pi con n decimales usando Big.js
  async calculatePi(n: number): Promise<string> {
    Big.DP = n + 10; // Añadimos extra precisión para evitar errores de redondeo

    let startTime = performance.now();
    // Usamos la fórmula de Machin para calcular Pi
    this.calculatingArctanMessage = 'Calculando arctan(1/5)';
    const arctan1_5 = await this.arctan(new Big(1).div(5), n + 10);
    this.calculatingArctanMessage = 'Calculando arctan(1/239)';
    const arctan1_239 = await this.arctan(new Big(1).div(239), n + 10);

    const pi = new Big(4).times(new Big(4).times(arctan1_5).minus(arctan1_239));

    let endTime = performance.now();

    this.calculatingArctanMessage = '';
    this.calculatingTermMessage = `Tiempo total: ${(endTime - startTime)/1000} s.`;

    // Convertimos el resultado a string y redondeamos a n decimales
    return pi.toFixed(n, Big.roundDown);
  }

  // Serie de arctangente: arctan(x) = x - x^3/3 + x^5/5 - x^7/7 + ...
  async arctan(x: Big, precision: number): Promise<Big> {
    let result = new Big(0);
    let xTerm = x;
    let x2 = x.times(x); // x^2
    let i = 1;
    let precisionValue = new Big(10).pow(-precision);

    while (xTerm.abs().gt(precisionValue)) {
      if(((i-1)/2) % 2 == 0) {
        result = result.plus(xTerm.div(i));
      } else {
        result = result.minus(xTerm.div(i));
      }
      i = i += 2;
      xTerm = xTerm.times(x2);
      this.calculatingTermMessage = `Término actual: ${xTerm.toExponential(6)}, meta de precisión: ${precisionValue.toString()}`;
      await this.sleep(0);
    }

    return result;
  }

  async onCalculate() {
    this.calculating = true;
    let result = await this.calculatePi(this.n);
    let decimals = result.substring(2, result.length);
    let decimalParts: string[] = [];
    for(let i: number = 0; i < this.n / this.decimalPartLength; i++) {
      decimalParts.push(decimals.substring(i * this.decimalPartLength, (i + 1) * this.decimalPartLength));
    }
    this.piDecimals = decimalParts.join(' ');
    this.calculating = false;
  }

  sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
