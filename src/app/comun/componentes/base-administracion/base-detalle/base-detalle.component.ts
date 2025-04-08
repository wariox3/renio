import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { Componentes } from '@comun/extra/imports/administradores';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Modelo } from '@comun/type/modelo.type';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class BaseDetalleComponent extends General implements OnInit {
  private readonly _configModuleService = inject(ConfigModuleService);
  private key: number | Modelo | null | undefined;
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
    // this.activatedRoute.queryParams.subscribe((parametros) => {
    this.key = this._configModuleService.key;
    // if (parametros.submodelo) {
    //   this.modelo = parametros.submodelo;
    //   this.changeDetectorRef.detectChanges();
    // }
    // });

    let posicion: keyof typeof Componentes = this.key as Modelo;
    let componete = await (await Componentes[posicion]!.detalle()).default;
    let componeteCargado = this.componenteDinamico.createComponent(componete);
    componeteCargado.changeDetectorRef.detectChanges();
  }
}
