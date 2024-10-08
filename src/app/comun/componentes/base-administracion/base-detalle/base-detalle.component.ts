import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { Componetes } from '@comun/extra/imports/administradores';
import { obtenerDocumentosEstado } from '@redux/selectors/documento.selectors';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    BtnAtrasComponent,
],
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
        this.changeDetectorRef.detectChanges()
       }
    });

    let posicion: keyof typeof Componetes = this.modelo;
    let componete = await (await Componetes[posicion].detalle()).default;
    let componeteCargado = this.componenteDinamico.createComponent(componete);
    componeteCargado.changeDetectorRef.detectChanges();
    this.store.select(obtenerDocumentosEstado).subscribe((estadosDocumento) => {
      this.documentoEstados$ = estadosDocumento;
      this.changeDetectorRef.detectChanges();
    });
  }
}
