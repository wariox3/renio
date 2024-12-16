import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { ComponentesExtras } from '@comun/extra/funcionalidades/documento-funcionalidad';

@Component({
  selector: 'app-modal-dinamico',
  standalone: true,
  templateUrl: './modal-dinamico.component.html',
  imports: [CommonModule, RouterModule, TranslateModule, BtnAtrasComponent],
})
export class ModalDinamicoComponent extends General implements OnInit {
  generarPDF = false;
  @Input() nombreComponente: string = ''
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
    // const componenteLoaded =
    //   ComponentesExtras[this.parametrosUrl.documento_clase][this.nombreComponente];

    // if (componenteLoaded) {
    //   let componete = await (await componenteLoaded.componente()).default;
    //   let componeteCargado = this.componenteDinamico.createComponent(componete);
    //   componeteCargado.changeDetectorRef.detectChanges();
    // }
  }
}
