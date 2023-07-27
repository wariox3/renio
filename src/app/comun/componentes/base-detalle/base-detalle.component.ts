import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  styleUrls: ['./base-detalle.component.scss'],
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
})
export class BaseDetalleComponent {
  constructor() {}
}
