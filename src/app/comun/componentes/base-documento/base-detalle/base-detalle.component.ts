import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { Componentes } from '@comun/extra/imports/documentos';

@Component({
  selector: 'app-comun-base-detalle',
  standalone: true,
  templateUrl: './base-detalle.component.html',
  imports: [CommonModule, RouterModule, TranslateModule],
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
    const componenteClase = Componentes[this.parametrosUrl?.documento_clase as any];
    if (componenteClase && componenteClase.detalle) {
      let componete = await (await componenteClase.detalle()).default;
      let componeteCargado = this.componenteDinamico.createComponent(componete);
      componeteCargado.changeDetectorRef.detectChanges();
    } else {
      console.error('El componente o su método detalle es indefinido');
    }
  }
}
