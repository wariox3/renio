import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-estados',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './base-estados.component.html',
  styleUrl: './base-estados.component.scss',
})
export class BaseEstadosComponent {
  @Input() documento: any
}
