import { Subdominio } from '@comun/clases/subdomino';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Params, RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';

import { TranslateModule } from '@ngx-translate/core';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';

@Component({
  selector: 'app-comun-btn-atras',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="ayuda">
      <button
        type="button"
        (click)="navegarAtras()"
        class="btn btn-sm btn-flex bg-body btn-color-gray-700 btn-active-primary"
      >
        <i class="bi bi-arrow-left fs-6"
          ><span class="path1"></span><span class="path2"></span
        ></i>
        {{ 'FORMULARIOS.BOTONES.COMUNES.ATRAS' | translate }}
      </button>
    </div>
  `,
})
export class BtnAtrasComponent extends General implements OnInit {
  private _configModuleService = inject(ConfigModuleService);
  private _rutaLista: string | undefined;
  private _parametrosActuales: Params;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this._configModuleService.currentModelConfig$.subscribe((model) => {
      this._rutaLista = model?.ajustes.rutas.lista;
    });
    this.activatedRoute.queryParams.subscribe((parametros) => {
      this._parametrosActuales = parametros;
    });
  }

  navegarAtras() {
    this.router.navigate([`${this._rutaLista}`], {
      queryParams: this._parametrosActuales,
    });
    // let tipo = window.location.pathname.split('/')[1];
    // let parametrosParaRemover: string[] = ['detalle'];

    // this.activatedRoute.queryParams.subscribe((parametros) => {
    //   let parametrosActuales = { ...parametros };

      // Eliminar los parámetros especificados en `parametrosParaRemover`
      // parametrosParaRemover.forEach((param: any) => {
      //   if (parametrosActuales[param]) {
      //     delete parametrosActuales[param];
      //   }
      // });

      // switch (tipo) {
      //   case 'administrador':
      //     this.activatedRoute.queryParams.subscribe((parametro) => {
      //       if (parametro.parametro || parametro.submodelo) {
      //         this.router.navigate([`/administrador/lista`], {
      //           queryParams: { ...parametrosActuales },
      //         });
      //       } else {
      //         this.router.navigate([`/administrador/lista`], {
      //           queryParams: { ...parametrosActuales },
      //         });
      //       }
      //     });
      //     break;
      //   case 'documento':
      //     this.router.navigate([`/documento/lista`], {
      //       queryParams: { ...parametrosActuales },
      //     });
      //     break;
      // }
    // });
  }
}
