import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DetallesTotalesComponent } from '@comun/componentes/detalles-totales/detalles-totales.component';
import { DocumentoOpcionesComponent } from '@comun/componentes/documento-opciones/documento-opciones.component';
import { LogElectronicoComponent } from '@comun/componentes/log-electronico/log-electronico.component';
import { HttpService } from '@comun/services/http.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { KeysPipe } from '@pipe/keys.pipe';
import { EMPTY, switchMap, tap } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  templateUrl: './cuenta-cobro-detalle.component.html',
  styleUrls: ['./cuenta-cobro-detalle.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    CardComponent,
    BtnAtrasComponent,
    KeysPipe,
    LogElectronicoComponent,
    DocumentoOpcionesComponent,
    BaseEstadosComponent,
    DetallesTotalesComponent,
    TituloAccionComponent,
  ],
})
export default class CuentaCobroDetalleComponent extends General {
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
  };
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalBase: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  totalAfectado: number = 0;
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];
  arrMetodosPago: any[] = [];
  arrEventos: any[] = [];
  arrCorreos: any[] = [];
  arrValidaciones: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrImpuestosEliminado: number[] = [];
  @ViewChild('btnGuardar', { static: true }) btnGuardar: HTMLButtonElement;
  theme_value = localStorage.getItem('kt_theme_mode_value');

  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService,
    private modalService: NgbModal
  ) {
    super();
    this.consultardetalle();
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.documento = respuesta.documento;
        this.totalAfectado = respuesta.documento.afectado;
        this.totalImpuestos = respuesta.documento.impuesto_operado;
        this._reniciarCamposTotales();

        respuesta.documento.detalles.map((item: any) => {
          const cantidad = item.cantidad;
          const precio = item.precio;
          const porcentajeDescuento = item.descuento;
          const total = item.total;
          let subtotal = cantidad * precio;
          let descuento = (porcentajeDescuento * subtotal) / 100;
          let subtotalFinal = subtotal - descuento;

          let neto = item.neto || 0;

          this.totalCantidad += parseInt(item.cantidad);
          this.totalDescuento += descuento;
          this.subtotalGeneral += subtotalFinal;
          this.totalNetoGeneral += neto;
          this.totalGeneral += total;
          this.totalBase += item.base_impuesto;
          this.changeDetectorRef.detectChanges();
        });
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


  itemDesaprobadoEvent() {
    this.consultardetalle();
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
            this.documento = respuestaConsultaDetalle.documento;
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO')
            );
            this.changeDetectorRef.detectChanges();
          }
        })
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
        switchMap((respuesta) =>
          respuesta ? this.facturaService.consultarDetalle(this.detalle) : EMPTY
        ),
        tap((respuesta: any) => {
          if (respuesta) {
            this.documento = respuesta.documento;
            this._reniciarTotales();
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOANULADO')
            );
            this.changeDetectorRef.detectChanges();
          }
        })
      )
      .subscribe();
  }

  emitir() {
    this.httpService
      .post('general/documento/emitir/', { documento_id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento emitido');
        this.consultardetalle();
      });
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

  reNotifica() {
    this.httpService
      .post('general/documento/renotificar/', { documento_id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento re notificado');
        this.consultardetalle();
      });
  }

  verLog(content: any) {
    this.httpService
      .post('general/documento/electronico_log/', {
        documento_id: this.detalle,
      })
      .subscribe((respuesta: any) => {
        const { correos, eventos, validaciones } = respuesta.log;
        this.arrCorreos = correos.map((correo: any) => ({
          codigoCorreoPk: correo.codigoCorreoPk,
          enviado: correo.fecha,
          numeroDocumento: correo.numeroDocumento,
          fecha: correo.fecha,
          correo: correo.correo,
          correoCopia: correo.copia,
        }));
        this.arrEventos = eventos.map((evento: any) => ({
          codigoEventoPk: evento.codigoEventoPk,
          evento: evento.evento,
          correo: evento.correo,
          fecha: evento.fecha,
          ipEnvio: evento.ipEnvio,
          idmensaje: evento.idMensaje,
        }));
        this.arrValidaciones = validaciones;
      });

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.changeDetectorRef.detectChanges();
  }

  navegarEditar(id: number) {
    this.router.navigate([`venta/documento/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`venta/documento/nuevo`], {
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
