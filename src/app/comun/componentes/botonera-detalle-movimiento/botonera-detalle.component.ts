import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';
import { BtnAtrasComponent } from '../btn-atras/btn-atras.component';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-botonera-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    BtnAtrasComponent,
  ],
  templateUrl: './botonera-detalle.component.html',
})
export class BotoneraDetalleComponent extends General {
  generarPDF = false;
  @Input() estados: any;

  constructor(private httpService: HttpService) {
    super();
  }

  aprobar() {
    this.httpService
      .post('general/documento/aprobar/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento aprobado');
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
    try {
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
   } finally {
    this.generarPDF = false;
  }


  }
}