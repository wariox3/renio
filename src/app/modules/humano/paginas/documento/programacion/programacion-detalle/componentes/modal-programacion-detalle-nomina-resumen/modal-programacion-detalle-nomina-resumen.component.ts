import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarHumConceptoAdicional } from '@interfaces/comunes/autocompletar/humano/hum-concepto-adicional.interface';
import { Pago } from '@modulos/humano/interfaces/pago.interface';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { map, of, switchMap, tap } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-modal-programacion-detalle-nomina-resumen',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDropdownModule],
  templateUrl: './modal-programacion-detalle-nomina-resumen.component.html',
  styleUrl: './modal-programacion-detalle-nomina-resumen.component.scss',
})
export class ModalProgramacionDetalleNominaResumenComponent {
  pago: Pago = {
    id: 0,
    numero: undefined,
    fecha: '',
    fecha_vence: undefined,
    fecha_hasta: undefined,
    contacto_id: 0,
    contacto_numero_identificacion: '',
    contacto_nombre_corto: '',
    descuento: 0,
    base_impuesto: 0,
    subtotal: 0,
    afectado: 0,
    pendiente: 0,
    impuesto: 0,
    impuesto_retencion: 0,
    impuesto_operado: 0,
    total_bruto: 0,
    total: 0,
    devengado: 0,
    deduccion: 0,
    base_cotizacion: 0,
    base_prestacion: 0,
    salario: 0,
    estado_aprobado: false,
    documento_tipo_id: 0,
    metodo_pago_id: undefined,
    metodo_pago_nombre: '',
    estado_anulado: false,
    comentario: undefined,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
    estado_electronico_evento: false,
    soporte: undefined,
    orden_compra: undefined,
    plazo_pago_id: undefined,
    plazo_pago_nombre: '',
    documento_referencia_id: undefined,
    documento_referencia_numero: '',
    cue: undefined,
    referencia_cue: undefined,
    referencia_numero: undefined,
    referencia_prefijo: undefined,
    electronico_id: undefined,
    asesor: undefined,
    asesor_nombre_corto: undefined,
    sede: undefined,
    sede_nombre: undefined,
    programacion_detalle_id: undefined,
    contrato_id: undefined,
    cuenta_banco_id: undefined,
    cuenta_banco_nombre: '',
    comprobante_id: undefined,
    comprobante_nombre: '',
    grupo_contabilidad_id: undefined,
    grupo_contabilidad_nombre: '',
    detalles: [],
    pagos: [],
  };
  pagoDetalles: any = [];
  cantidadRegistrosProgramacionDetalle = signal(0);
  visualizarBtnGuardarNominaProgramacionDetalleResumen = signal(false);
  arrConceptos: RegistroAutocompletarHumConceptoAdicional[] = [];

  private _modalService = inject(NgbModal);
  private _generalService = inject(GeneralService);

  @Input() programacionId: number;
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  abrirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.consultarNominaProgramacionDetalleResumen();
  }

  consultarNominaProgramacionDetalleResumen() {
    this._generalService
      .consultaApi<RespuestaApi<any>>('general/documento/', {
        programacion_detalle_id: this.programacionId,
      })
      .pipe(
        switchMap((respuestaLista) => {
          if (!respuestaLista.results?.length) {
            return of(null);
          }
          
          this.pago = respuestaLista.results?.[0];

          return this._generalService.consultaApi<RespuestaApi<any>>(
            'general/documento_detalle/',
            {
              documento_id: this.pago.id,
            },
          );
        }),
        map((respuestaDetalle) => {
          let registros = respuestaDetalle?.results.map((registro) => ({
            ...registro,
            editarLinea: false,
          }));

          return {
            ...respuestaDetalle,
            results: registros,
          }
        }),
        tap((respuestaDetalle) => {
          this.cantidadRegistrosProgramacionDetalle.set(respuestaDetalle.count || 0);
          this.pagoDetalles = respuestaDetalle.results;
        }),
      )
      .subscribe();
  }

  agregarNuevaLineaNominaProgramacionDetalleResumen() {
    this.pagoDetalles.push({
      editarLinea: true,
    });
  }

  retirarNominaProgramacionDetalleResumen(index: number) {
    this.pagoDetalles = this.pagoDetalles.filter(
      (pago: any, indexPago: number) => indexPago !== index,
    );
  }

  editarNominaProgramacionDetalleResumen(index: number) {
    this.visualizarBtnGuardarNominaProgramacionDetalleResumen.update(
      (valor: any) => !valor,
    );
    let registros = this.pagoDetalles.map((pago: any, indexPago: number) => {
      if (indexPago === index) {
        pago.editarLinea = !pago.editarLinea;
      }
      return pago;
    });
    this.pagoDetalles = registros;
  }

  consultarConceptos(event: any) {
    let arrFiltros: ParametrosApi = {
      nombre__icontains: `${event?.target.value}`,
      limit: 1000,
    };

    this._generalService
      .consultaApi<RegistroAutocompletarHumConceptoAdicional[]>(
        'humano/concepto/seleccionar/',
        arrFiltros,
      )
      .pipe(
        tap((respuesta) => {
          //this.arrConceptos = respuesta.registros;
        }),
      )
      .subscribe();
  }

  agregarConcepto(concepto: any, index: number) {
    this.pagoDetalles[index] = {
      ...this.pagoDetalles[index],
      ...{
        concepto_nombre: concepto.concepto_nombre,
      },
    };
  }
}
