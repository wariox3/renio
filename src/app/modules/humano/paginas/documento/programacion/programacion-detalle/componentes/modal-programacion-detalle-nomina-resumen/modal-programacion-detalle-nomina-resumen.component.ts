import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarHumConceptoAdicional } from '@interfaces/comunes/autocompletar/humano/hum-concepto-adicional.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { Pago } from '@modulos/humano/interfaces/pago.interface';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, map, switchMap, tap, throttleTime } from 'rxjs';

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
      .consultarDatosLista<{ cantidad_registros: number; registros: any[] }>({
        filtros: [
          {
            propiedad: 'programacion_detalle_id',
            valor1: this.programacionId,
          },
        ],
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenDocumento',
      })
      .pipe(
        switchMap((respuestaLista) => {
          this.pago = respuestaLista.registros[0];

          return this._generalService.consultarDatosLista<{
            cantidad_registros: number;
            registros: any[];
          }>({
            filtros: [
              {
                propiedad: 'documento_id',
                valor1: respuestaLista.registros[0].id,
              },
            ],
            desplazar: 0,
            ordenamientos: [],
            limite_conteo: 10000,
            modelo: 'GenDocumentoDetalle',
          });
        }),
        map((respuestaDetalle) => {
          let registros = respuestaDetalle.registros.map((registro) => ({
            ...registro,
            editarLinea: false,
          }));
          respuestaDetalle.registros = registros;
          return respuestaDetalle;
        }),
        tap((respuestaDetalle) => {
          this.cantidadRegistrosProgramacionDetalle.set(
            respuestaDetalle.cantidad_registros
          );
          this.pagoDetalles = respuestaDetalle.registros;
        })
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
      (pago: any, indexPago: number) => indexPago !== index
    );
  }

  editarNominaProgramacionDetalleResumen(index: number) {
    this.visualizarBtnGuardarNominaProgramacionDetalleResumen.update(
      (valor: any) => !valor
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
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumConcepto',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConceptoAdicional>(
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          //this.arrConceptos = respuesta.registros;
        })
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
