import { Component } from '@angular/core';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { ImplicitCurveGraphComponent } from "../../widgets/implicit-curve-graph/implicit-curve-graph.component";

@Component({
  selector: 'app-implicit-curve-graph-tool',
  standalone: true,
  imports: [WidgetsModule, ImplicitCurveGraphComponent],
  templateUrl: './implicit-curve-graph-tool.component.html',
  styleUrl: './implicit-curve-graph-tool.component.css'
})
export class ImplicitCurveGraphToolComponent {

}
