import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-precio-detalle',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './precio-detalle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PrecioDetalleComponent { }
