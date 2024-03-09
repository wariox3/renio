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
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { componeteNuevos, componeteNuevos2 } from '@comun/extra/imports';
import { HttpService } from '@comun/services/http.service';
import { obtenerConfiguracionVisualizarApp } from '@redux/selectors/configuracion.selectors';
import { obtenerDocumentosEstado } from '@redux/selectors/documento.selectors';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-nuevo.component.html',
  styleUrls: ['./base-nuevo.component.scss'],
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
    let posicion: keyof typeof componeteNuevos2 = `${this.modelo}`;
     let componete = await (await componeteNuevos2[posicion].formulario).default;
     let componeteCargado =
       this.componenteDinamico.createComponent(componete);
       componeteCargado.changeDetectorRef.detectChanges();
  }

  aprobar() {
    this.httpService
      .post('general/documento/aprobar/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento aprobado');
        window.location.reload();
      });
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
    this.httpService
      .descargarArchivo('general/documento/imprimir/', {
        filtros: [],
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: '',
        tipo: '',
        documento_tipo_id: 1,
        documento_id: this.detalle,
      })
      .subscribe((data) => {
        this.generarPDF = false;
        this.changeDetectorRef.detectChanges();
        const blob = new Blob([data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.activatedRoute.snapshot.queryParams['modelo']}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
