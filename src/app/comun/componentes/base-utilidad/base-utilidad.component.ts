import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { Componetes } from '@comun/extra/imports/utilidades';
import { obtenerDocumentosEstado } from '@redux/selectors/documento.selectors';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';

@Component({
  selector: 'app-comun-base-utilidad',
  standalone: true,
  template: `<div #dynamicComponentContainer></div>`,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    BtnAtrasComponent,
  ],
})
export class BaseUtilidadComponent extends General implements OnInit {
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
    this.modelo = localStorage.getItem('itemNombre')!;
    let posicion: keyof typeof Componetes = this.modelo;
    let componete = await (await Componetes[posicion].utilidad()).default;
    let componeteCargado = this.componenteDinamico.createComponent(componete);
    componeteCargado.changeDetectorRef.detectChanges();
    this.store.select(obtenerDocumentosEstado).subscribe((estadosDocumento) => {
      this.documentoEstados$ = estadosDocumento;
      this.changeDetectorRef.detectChanges();
    });
  }
}
