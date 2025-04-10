import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DetallesTotalesComponent } from '@comun/componentes/detalles-totales/detalles-totales.component';
import { OperacionesService } from '@comun/componentes/factura/services/operaciones.service';
import { LogElectronicoComponent } from '@comun/componentes/log-electronico/log-electronico.component';
import { HttpService } from '@comun/services/http.service';
import { DocumentoFacturaDetalleRespuesta } from '@interfaces/comunes/factura/factura.interface';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, switchMap, tap } from 'rxjs';
import { BtnAnularComponent } from '../../../../../../comun/componentes/btn-anular/btn-anular.component';
import { DocumentoOpcionesComponent } from '../../../../../../comun/componentes/documento-opciones/documento-opciones.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  templateUrl: './factura-detalle.component.html',
  styleUrls: ['./factura-detalle.component.scss'],
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
    DetallesTotalesComponent,
    BtnAnularComponent,
    TituloAccionComponent,
    LogElectronicoComponent,
    DocumentoOpcionesComponent,
  ],
})
export default class FacturaDetalleComponent extends General {
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
    estado_contabilizado: false,
  };
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalBase: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  totalDebitos: number = 0;
  totalCreditos: number = 0;
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  private _operacionesSerive = inject(OperacionesService);

  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService,
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.documento = respuesta.documento;
        this.totalImpuestos = respuesta.documento.impuesto_operado;
        this._reniciarCamposTotales();
        let totalDebitos = 0;

        respuesta.documento.detalles.map(
          (item: DocumentoFacturaDetalleRespuesta) => {
            const cantidad = item.cantidad;
            const precio = item.precio;
            const porcentajeDescuento = item.porcentaje_descuento;
            const total = item.total;
            let subtotal = cantidad * precio;
            let descuento = (porcentajeDescuento * subtotal) / 100;
            let subtotalFinal = subtotal - descuento;

            this.totalCantidad += item.cantidad;
            this.totalDescuento += descuento;
            this.subtotalGeneral += subtotalFinal;
            // this.totalNetoGeneral += neto;
            this.totalBase += item.base_impuesto;

            this.changeDetectorRef.detectChanges();
          },
        );

        this.totalGeneral = this._operacionesSerive.sumarTotal(
          respuesta.documento.detalles,
        );

        const { creditos, debitos } = this._operacionesSerive.sumarTotalCuenta(
          respuesta.documento.detalles,
        );

        this.totalDebitos = debitos;
        this.totalCreditos = creditos;
        this.subtotalGeneral = respuesta.documento.subtotal;

        this.changeDetectorRef.detectChanges();
      });
  }

  private _reniciarCamposTotales() {
    this.totalCantidad = 0;
    this.totalDescuento = 0;
    this.subtotalGeneral = 0;
    this.totalNetoGeneral = 0;
    this.totalGeneral = 0;
    this.totalBase = 0;
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
          respuesta
            ? this.facturaService.consultarDetalle(this.detalle)
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
            return this.httpService.post('general/documento/anular/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        tap((respuesta: any) => {
          if (respuesta) {
            this.consultardetalle();
            this._reniciarTotales();
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOANULADO'),
            );
          }
        }),
      )
      .subscribe();
  }

  imprimir() {
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      documento_id: this.detalle,
    });
  }

  navegarEditar(id: number) {
    this.router.navigate([`compra/documento/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`compra/documento/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  private _reniciarTotales() {
    this.totalCantidad = 0;
    this.subtotalGeneral = 0;
    this.totalDescuento = 0;
    this.totalImpuestos = 0;
    this.totalGeneral = 0;
    this.totalBase = 0;
    this.changeDetectorRef.detectChanges();
  }
}
