import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';


type ComponentImport = {
  [key: string]: Promise<{ default: any }>;
};

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-nuevo.component.html',
  styleUrls: ['./base-nuevo.component.scss'],
})
export class BaseNuevoComponent  extends General implements OnInit {

  modelo: string;
  greetcomp: any;
  formulario: string

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer: ViewContainerRef;

  constructor(private viewContainerRef: ViewContainerRef) {
    super();
  }

  ngOnInit(): void {
    this.modelo = this.activatedRoute.snapshot.queryParams['modelo'];
    this.formulario = this.activatedRoute.snapshot.queryParams['formulario'];
    this.loadComponente();
  }

  async loadComponente() {
    let posicion: keyof typeof this.componeteNuevos = `${this.modelo}-formulario${this.formulario}`;
    const componete  = await (await this.componeteNuevos[posicion]).default
    this.dynamicComponentContainer.createComponent(componete);
  }

  componeteNuevos: ComponentImport = {
    'Item-formularioItemNuevo': import('../../../modules/general/componentes/item/item-nuevo/item-nuevo.component'),
    'Factura-formularioFacturaNuevo': import('../../../modules/factura/componentes/factura-nuevo/factura-nuevo.component')
  };
}
