import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comun-skeleton-loading',
  templateUrl: './skeleton-loading.component.html',
  styleUrls: ['./skeleton-loading.component.scss'],
  standalone: true,
  imports: [
    NgStyle
  ]
})
export class SkeletonLoadingComponent  {
  @Input() width!: number; // Ancho del componente
  @Input() height!: number; // Alto del componente
  @Input() circulo: boolean = false; // Booleano para determinar si se debe aplicar el estilo de círculo
}
