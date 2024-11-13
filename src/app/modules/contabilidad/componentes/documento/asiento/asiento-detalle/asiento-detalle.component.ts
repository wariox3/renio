import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-asiento-detalle',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    CardComponent,
    TranslateModule,
    NgbNavModule,
    NgbDropdownModule,
    BaseEstadosComponent
],
  templateUrl: './asiento-detalle.component.html',
})
export default class PagoDetalleComponent extends General {
  asiento: any = {
    contacto_id: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    fecha_vence: '',
    id: null,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null,
    detalles: [],
    impuestos: [],
  };
  arrEstados = {
    estado_aprobado: false,
    estado_anulado: false,
  };
  detalles: any[] = [];
  tabActive = 1
  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.asiento = respuesta.documento;
        this.detalles = this.asiento.detalles;
        this.changeDetectorRef.detectChanges();
      });
  }

  aprobar() {
    this.alertaService
    .confirmarSinReversa()
    .pipe(
      switchMap((respuesta) => {
        if (respuesta.isConfirmed) {
          return this.httpService.post('general/documento/aprobar/', {
            id: this.detalle,
          });
        }
        return EMPTY;
      }),
      switchMap((respuesta) =>
        respuesta ? this.facturaService.consultarDetalle(this.detalle) : EMPTY
      ),
      tap((respuestaConsultaDetalle: any) => {
        if (respuestaConsultaDetalle) {
          this.asiento = respuestaConsultaDetalle.documento;
          this.alertaService.mensajaExitoso(
            this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO')
          );
          this.changeDetectorRef.detectChanges();
        }
      })
    )
    .subscribe();
  }

  imprimir() {
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

  anular(){
    this.httpService
      .post('general/documento/anular/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Documento anulado');
      });
  }

  navegarEditar(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/editar`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  navegarNuevo() {
    this.navegarDocumentoNuevo()
  }

    // Obtener total de débitos
    getTotalDebito(): number {
      return this.detalles
        .filter((detalle) => detalle.naturaleza === 'D') // Filtrar naturaleza 'D'
        .reduce((total, detalle) => total + detalle.total, 0); // Acumular los valores de 'pago'
    }

    // Obtener total de créditos
    getTotalCredito(): number {
      return this.detalles
        .filter((detalle) => detalle.naturaleza === 'C') // Filtrar naturaleza 'C'
        .reduce((total, detalle) => total + detalle.total, 0); // Acumular los valores de 'pago'
    }
}
