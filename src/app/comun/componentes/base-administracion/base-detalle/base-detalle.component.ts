import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { Componetes } from '@comun/extra/imports/administradores';
import { Modelo } from '@comun/type/modelo.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class BaseDetalleComponent extends General implements OnInit {
  generarPDF = false;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  documentoEstados$: any = {};

  constructor() {
    super();
  }

  ngOnInit() {
    this.loadComponente();
  }

  async loadComponente() {
    this.activatedRoute.queryParams.subscribe((parametros) => {
      this.modelo = parametros.itemNombre!;
      if (parametros.submodelo) {
        this.modelo = parametros.submodelo;
        this.changeDetectorRef.detectChanges();
      }
    });

    let posicion: keyof typeof Componetes = this.modelo as Modelo;
    let componete = await (await Componetes[posicion]!.detalle()).default;
    let componeteCargado = this.componenteDinamico.createComponent(componete);
    componeteCargado.changeDetectorRef.detectChanges();
  }
}
