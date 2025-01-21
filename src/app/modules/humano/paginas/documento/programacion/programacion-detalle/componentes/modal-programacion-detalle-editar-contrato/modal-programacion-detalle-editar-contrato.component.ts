import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { AlertaService } from '@comun/services/alerta.service';
import { GeneralService } from '@comun/services/general.service';
import { ProgramacionDetalleRegistro } from '@interfaces/humano/programacion';
import { ProgramacionDetalleService } from '@modulos/humano/servicios/programacion-detalle.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-programacion-detalle-editar-contrato',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-programacion-detalle-editar-contrato.component.html',
})
export class ModalProgramacionDetalleEditarContratoComponent extends General {
  formularioEditarDetalleProgramacion: FormGroup;
  arrParametrosConsultaDetalle: any;

  private _modalService = inject(NgbModal);
  private _formBuilder = inject(FormBuilder);
  private _programacionDetalleService = inject(ProgramacionDetalleService);
  private _alertaService = inject(AlertaService);
  private _generalService = inject(GeneralService);

  @Input() programacionId: number;
  @Input() programacionDetalleId: number;
  @Output() emitirConsultarLista: EventEmitter<any> = new EventEmitter();

  abrirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.iniciarFormularioEditarDetalles();
    this.inicializarParametrosConsultaProgramacionDetalleEditar();
    this.consultarRegistroDetalleProgramacion();
  }

  iniciarFormularioEditarDetalles() {
    this.formularioEditarDetalleProgramacion = this._formBuilder.group({
      programacion: [0],
      diurna: [0, Validators.required],
      nocturna: [0, Validators.required],
      festiva_diurna: [0, Validators.required],
      festiva_nocturna: [0, Validators.required],
      extra_diurna: [0, Validators.required],
      extra_nocturna: [0, Validators.required],
      extra_festiva_diurna: [0, Validators.required],
      extra_festiva_nocturna: [0, Validators.required],
      recargo_nocturno: [0, Validators.required],
      recargo_festivo_diurno: [0, Validators.required],
      recargo_festivo_nocturno: [0, Validators.required],
      contrato: [0],
      contrato_contacto_id: [0],
      contrato_contacto_numero_identificacion: [''],
      contrato_contacto_nombre_corto: [''],
      pago_horas: [false],
      pago_auxilio_transporte: [false],
      pago_incapacidad: [false],
      pago_licencia: [false],
      pago_vacacion: [false],
      descuento_salud: [false],
      descuento_pension: [false],
      descuento_fondo_solidaridad: [false],
      descuento_retencion_fuente: [false],
      adicional: [false],
      descuento_credito: [false],
      descuento_embargo: [false],
      dias_transporte: [0, Validators.required],
    });
  }

  inicializarParametrosConsultaProgramacionDetalleEditar() {
    this.arrParametrosConsultaDetalle = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.detalle,
        },
        {
          propiedad: 'id',
          valor1: this.programacionDetalleId,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumProgramacionDetalle',
    };
  }

  actualizarDetalleProgramacion() {
    if (this.formularioEditarDetalleProgramacion.valid) {
      this._programacionDetalleService
        .actualizarDetalles(
          this.programacionDetalleId,
          this.formularioEditarDetalleProgramacion.value
        )
        .subscribe(() => {
          this._alertaService.mensajaExitoso('Se actualizó la información');
          this._modalService.dismissAll();
          this.emitirConsultarLista.emit();
        });
    }
  }

  consultarRegistroDetalleProgramacion() {
    this._generalService
      .consultarDatosLista<{
        registros: ProgramacionDetalleRegistro[];
        cantidad_registros: number;
      }>(this.arrParametrosConsultaDetalle)
      .subscribe((respuesta) => {
        if (respuesta.registros.length) {
          const { registros } = respuesta;
          const registro = registros?.[0];
          this.formularioEditarDetalleProgramacion.patchValue({
            programacion: this.programacionId,
            diurna: registro.diurna,
            nocturna: registro.nocturna,
            festiva_diurna: registro.festiva_diurna,
            festiva_nocturna: registro.festiva_nocturna,
            extra_diurna: registro.extra_diurna,
            extra_nocturna: registro.extra_nocturna,
            extra_festiva_diurna: registro.extra_festiva_diurna,
            extra_festiva_nocturna: registro.extra_festiva_nocturna,
            recargo_nocturno: registro.recargo_nocturno,
            recargo_festivo_diurno: registro.recargo_festivo_diurno,
            recargo_festivo_nocturno: registro.recargo_festivo_nocturno,
            contrato: registro.contrato_id,
            contrato_contacto_id: registro.contrato_contacto_id,
            contrato_contacto_numero_identificacion:
              registro.contrato_contacto_numero_identificacion,
            contrato_contacto_nombre_corto:
              registro.contrato_contacto_nombre_corto,
            pago_horas: registro.pago_horas,
            pago_auxilio_transporte: registro.pago_auxilio_transporte,
            pago_incapacidad: registro.pago_incapacidad,
            pago_licencia: registro.pago_licencia,
            pago_vacacion: registro.pago_vacacion,
            descuento_salud: registro.descuento_salud,
            descuento_pension: registro.descuento_pension,
            descuento_fondo_solidaridad: registro.descuento_fondo_solidaridad,
            descuento_retencion_fuente: registro.descuento_retencion_fuente,
            adicional: registro.adicional,
            descuento_credito: registro.descuento_credito,
            descuento_embargo: registro.descuento_embargo,
            dias_transporte: registro.dias_transporte,
          });
        }
      });
  }
}
