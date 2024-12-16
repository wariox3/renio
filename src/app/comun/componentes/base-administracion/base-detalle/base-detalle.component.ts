import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { Componetes } from '@comun/extra/imports/administradores';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class BaseDetalleComponent extends General implements OnInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loadComponente();
  }

  async loadComponente() {
    this.modelo = this.parametrosUrl?.itemNombre!;
    if (this.parametrosUrl?.submodelo) {
      this.modelo = this.parametrosUrl?.submodelo;
    }
    let posicion: keyof typeof Componetes = this.modelo;
    let componente = await (await Componetes[posicion].detalle()).default;
    let componenteCargado = this.componenteDinamico.createComponent(componente);
    // Detecta los cambios manualmente en el componente cargado dinámicamente
    // para asegurarse de que Angular actualice la vista con los datos o la lógica del componente.
    componenteCargado.changeDetectorRef.detectChanges();
  }
}
