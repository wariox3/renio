import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { ComponentesExtras } from '@comun/extra/funcionalidades/documento-funcionalidad';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-modal-dinamico',
  standalone: true,
  templateUrl: './modal-dinamico.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class ModalDinamicoComponent extends General implements OnInit {
  private readonly _configModuleService = inject(ConfigModuleService);
  generarPDF = false;
  @Input() nombreComponente: string = '';
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  documentoEstados$: any = {};

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit() {
    this.loadComponente();
  }

  async loadComponente() {
    const documentoClase = this._configModuleService.key;
    const nombreComponente = this.nombreComponente;

    if (
      documentoClase &&
      nombreComponente &&
      ComponentesExtras[documentoClase]
    ) {
      const componenteLoaded =
        ComponentesExtras[documentoClase][nombreComponente];

      if (componenteLoaded) {
        const componente = await (await componenteLoaded.componente()).default;
        const componenteCargado =
          this.componenteDinamico.createComponent(componente);
        componenteCargado.changeDetectorRef.detectChanges();
      }
    } else {
      console.error('documento_clase o nombreComponente no son válidos.');
    }
  }
}
