import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  standalone: true,
  imports: [RouterOutlet],
})
export class ContentComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
