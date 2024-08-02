import { Subdominio } from '@comun/clases/subdomino';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';

import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-btn-atras',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="ayuda">
      <a
        (click)="navegarAtras()"
        class="btn btn-sm btn-flex bg-body btn-color-gray-700 btn-active-icon-primary btn-text-primary"
      >
        <i class="bi bi-arrow-left fs-6 text-muted"
          ><span class="path1"></span><span class="path2"></span
        ></i>
        {{ 'FORMULARIOS.BOTONES.COMUNES.ATRAS' | translate }}
      </a>
    </div>
  `,
})
export class BtnAtrasComponent extends General {
  navegarAtras() {
    let tipo = window.location.pathname.split('/')[1];

    switch (tipo) {
      case 'administrador':
        this.activatedRoute.queryParams.subscribe((parametro) => {
          if(parametro.parametro  || parametro.submodelo){
            this.router.navigate([`/administrador/lista`], {
              queryParams: {
                modelo: parametro.modelo,
                parametro: parametro.parametro,
                submodelo: parametro.submodelo
              },
            });
          } else {
            this.router.navigate([`/administrador/lista`], {
              queryParams: {
                modelo: parametro.modelo
              },
            });
          }

        });
        break;
      case 'documento':
        this.activatedRoute.queryParams.subscribe((parametro) => {
          this.router.navigate([`/documento/lista`], {
            queryParams: {
              documento_clase: parametro.documento_clase,
            },
          });
        });
        break;

      default:
        break;
    }
  }
}
