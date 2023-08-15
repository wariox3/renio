import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { CardComponent } from '../card/card.component';
import { General } from '@comun/clases/general';
import { componeteDetalle } from '@comun/extra/imports';

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
export class BaseDetalleComponent extends General implements OnInit {
  modelo: string;
  detalle: string;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  
  constructor() {
    super();
  }

  ngOnInit(): void {
    this.modelo = this.activatedRoute.snapshot.queryParams['modelo'];
    this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
    this.loadComponente();
  }

  async loadComponente() {
    let posicion: keyof typeof componeteDetalle = `${this.modelo}-${this.modelo}Detalle`;
    let componete = await (await componeteDetalle[posicion]).default;
    let componeteCreado = this.componenteDinamico.createComponent(componete);
    let loadedComponentInstance: any = componeteCreado.instance;
    loadedComponentInstance.ngOnInit();
  }
}
