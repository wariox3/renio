import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-comun-base-detalle',
    standalone: true,
    templateUrl: './base-detalle.component.html',
    styleUrls: ['./base-detalle.component.scss'],
    imports: [
        CommonModule,
    ]
})
export class BaseDetalleComponent {
  constructor(
  ) {}


}
