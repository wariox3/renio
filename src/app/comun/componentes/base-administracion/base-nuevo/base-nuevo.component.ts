import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { Componetes } from '@comun/extra/imports/administradores';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './base-nuevo.component.html',
})
export class BaseNuevoComponent extends General implements AfterViewInit {
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;

  constructor() {
    super();
  }

  ngAfterViewInit() {
    this.loadComponente();
  }

  async loadComponente() {
    this.componenteDinamico.clear();
    this.modelo = this.parametrosUrl?.itemNombre!;
    if (this.parametrosUrl?.submodelo) {
      this.modelo = this.parametrosUrl?.submodelo;
    }
    let posicion: keyof typeof Componetes = this.modelo;
    let componete = await (await Componetes[posicion].formulario()).default;
    let componeteCargado = this.componenteDinamico.createComponent(componete);
    componeteCargado.changeDetectorRef.detectChanges();
  }

}
