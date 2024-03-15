import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { Componetes } from '@comun/extra/imports';
import { HttpService } from '@comun/services/http.service';
import { obtenerDocumentosEstado } from '@redux/selectors/documento.selectors';
import { BtnAtrasComponent } from "../btn-atras/btn-atras.component";

@Component({
    selector: 'app-comun-base-detalle',
    standalone: true,
    templateUrl: './base-detalle.component.html',
    imports: [CommonModule, RouterModule, TranslateModule, TranslationModule, BtnAtrasComponent]
})
export class BaseDetalleComponent extends General implements AfterViewInit {
  generarPDF = false;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  documentoEstados$: any = {};

  constructor(private httpService: HttpService) {
    super();
  }

  ngAfterViewInit() {
    this.loadComponente();
  }

  async loadComponente() {
    let posicion: keyof typeof Componetes = `${this.modelo}`;
    let componete = await (await Componetes[posicion].detalle).default;
    let componeteCargado = this.componenteDinamico.createComponent(componete);
    componeteCargado.changeDetectorRef.detectChanges();
    this.store.select(obtenerDocumentosEstado).subscribe((estadosDocumento) => {
      this.documentoEstados$ = estadosDocumento;
      this.changeDetectorRef.detectChanges();
    });
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
      .post('general/documento/emitir/', { documento_id: this.detalle })
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
