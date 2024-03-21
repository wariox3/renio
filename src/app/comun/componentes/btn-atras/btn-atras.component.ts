import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-btn-atras',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  template: `
    <div class="ayuda">
      <a
        [routerLink]="['../lista']"
        [queryParams]="{modulo, modelo, tipo}"
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
export class BtnAtrasComponent extends General {}
