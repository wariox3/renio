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
import { Componentes } from '@comun/extra/imports/documentos';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './base-nuevo.component.html',
})
export class BaseNuevoComponent extends General implements AfterViewInit {
  generarPDF = false;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;

  constructor(private httpService: HttpService) {
    super();
  }

  ngAfterViewInit() {
    this.loadComponente();
  }

  async loadComponente() {
    this.componenteDinamico.clear();
    const componenteClase = Componentes[this.parametrosUrl?.documento_clase as any];
    if (componenteClase && componenteClase.formulario) {
      let componete = await (await componenteClase.formulario()).default;
      let componeteCargado = this.componenteDinamico.createComponent(componete);
      componeteCargado.changeDetectorRef.detectChanges();
    } else {
      console.error('El componente o su método formulario es indefinido');
    }
  }

  emitir() {
    this.httpService
      .post('general/documento/emitir/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento aprobado');
        window.location.reload();
      });
  }

  imprimir() {
    this.generarPDF = true;
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 1,
      documento_id: this.detalle,
    });
  }
}
