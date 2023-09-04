import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { CardComponent } from '../card/card.component';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  styleUrls: ['./base-detalle.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    CardComponent,
  ],
})
export class BaseDetalleComponent extends General {
  modelo: string;
  detalle: string;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  
  constructor() {
    super();
  }

}
