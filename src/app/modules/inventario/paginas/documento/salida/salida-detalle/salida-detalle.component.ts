import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DocumentoOpcionesComponent } from '@comun/componentes/documento-opciones/documento-opciones.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { HttpService } from '@comun/services/http.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbNavModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-entrada-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    CardComponent,
    BtnAtrasComponent,
    BaseEstadosComponent,
    TituloAccionComponent,
    DocumentoOpcionesComponent
],
  templateUrl: './salida-detalle.component.html',
  styleUrls: ['./salida-detalle.component.scss']

})
export default class SalidaDetalleComponent extends General {
  active: Number;
  documento: any = {
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
    estado_aprobado: false,
    estado_anulado: false,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
    almacen: 0,
    almacen_nombre: ''
  };
  public total = signal(0);
  public totalCantidad = signal(0);
  public totalPrecio = signal(0);

  constructor(
    private _httpService: HttpService,
    private _facturaService: FacturaService,
  ) {
    super();
    this.consultardetalle();
  }

  itemDesaprobadoEvent() {
    this.consultardetalle();
  }

  consultardetalle() {
    this._facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.documento = respuesta.documento;
        respuesta.documento.detalles.map((item: any) => {
          const cantidad = item.cantidad;
          const precio = item.precio;
          this.totalCantidad.update((valor) => valor+parseInt(item.cantidad));
          this.totalPrecio.update((valor) => valor+parseInt(item.precio));

          this.total.update(() => this.totalCantidad()*this.totalPrecio());
          this.changeDetectorRef.detectChanges();
        });
      });
  }

  aprobar() {
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this._httpService.post('general/documento/aprobar/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        switchMap((respuesta) =>
          respuesta
            ? this._facturaService.consultarDetalle(this.detalle)
            : EMPTY,
        ),
        tap((respuestaConsultaDetalle: any) => {
          if (respuestaConsultaDetalle) {
            this.documento = respuestaConsultaDetalle.documento;
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO'),
            );
            this.changeDetectorRef.detectChanges();
          }
        }),
      )
      .subscribe();
  }

  anular() {
    this.alertaService
      .anularSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this._httpService.post('general/documento/anular/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        switchMap((respuesta) =>
          respuesta
            ? this._facturaService.consultarDetalle(this.detalle)
            : EMPTY,
        ),
        tap((respuesta: any) => {
          if (respuesta) {
            this.documento = respuesta.documento;
            this._reniciarCamposTotales();
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOANULADO'),
            );
            this.changeDetectorRef.detectChanges();
          }
        }),
      )
      .subscribe();
  }

  imprimir() {
    this._httpService.descargarArchivo('general/documento/imprimir/', {
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

  navegarEditar(id: number) {
    this.router.navigate([`inventario/documento/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`inventario/documento/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  private _reniciarCamposTotales() {
    this.totalCantidad.set(0);
    this.totalPrecio.set(0);
    this.total.set(0)
  }
}
