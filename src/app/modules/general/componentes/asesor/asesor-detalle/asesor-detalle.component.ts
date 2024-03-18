import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-asesor-detalle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<p>asesor-detalle works!</p>`,
  styleUrls: ['./asesor-detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsesorDetalleComponent { }
