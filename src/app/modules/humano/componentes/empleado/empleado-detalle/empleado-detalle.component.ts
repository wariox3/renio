import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empleado-detalle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>empleado-detalle works!</p>`,
  styleUrls: ['./empleado-detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoDetalleComponent { }
