import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-lovelace-unbuilt-machine', standalone: true, imports: [RouterLink], templateUrl: './lovelace-unbuilt-machine.component.html', styleUrls: ['../../shared/learning-article.css', './lovelace-unbuilt-machine.component.css'] })
export class LovelaceUnbuiltMachineComponent {
  static readonly title = "Un programa antes de que existiera su máquina";
  static readonly route = 'lovelace-unbuilt-machine';
}
