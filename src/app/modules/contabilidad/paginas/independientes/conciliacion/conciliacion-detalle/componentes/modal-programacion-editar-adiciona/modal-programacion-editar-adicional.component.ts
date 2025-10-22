import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
  TemplateRef,
  ViewChild,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { GeneralService } from '@comun/services/general.service';
import { AplicacionAccion } from '@comun/type/aplicaciones-acciones.type';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import { RegistroAutocompletarHumConceptoAdicional } from '@interfaces/comunes/autocompletar/humano/hum-concepto-adicional.interface';
import { RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ProgramacionAdicionalDetalle } from '@modulos/humano/interfaces/programacion-adicional.interface';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { BuscarContratoComponent } from '@comun/componentes/buscar-contrato/buscar-contrato.component';

@Component({
  selector: 'app-modal-programacion-editar-adicional',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    CommonModule,
    NgSelectModule,
    BuscarContratoComponent,
  ],
  templateUrl: './modal-programacion-editar-adicional.component.html',
  styleUrl: './modal-programacion-editar-adicional.component.scss',
})
export class ModalProgramacionEditarAdicionalComponent {
  accion = signal<Extract<AplicacionAccion, 'nuevo' | 'detalle'>>;
  arrConceptosAdicional = signal<RegistroAutocompletarHumConceptoAdicional[]>(
    [],
  );
  registroAdicionalSeleccionado: number;

  formularioAdicionalProgramacion: FormGroup;
  formularioEditarDetalleProgramacion: FormGroup;
  arrParametrosConsultaAdicionalEditar: ParametrosApi = {};

  @Input() programacionId: number;
  @Output() emitirConsultarLista: EventEmitter<any> = new EventEmitter();
  @ViewChild('contentModalAdicional') contentModalAdicional: TemplateRef<any>;
  @ViewChild('contentModalAdicionalEditar')
  contentModalAdicionalEditar: TemplateRef<any>;
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  private _modalService = inject(NgbModal);
  private _generalService = inject(GeneralService);
  private _formBuilder = inject(FormBuilder);
  private _adicionalService = inject(AdicionalService);
  private _alertaService = inject(AlertaService);

  constructor() {}

  abrirModalNuevo() {
    this._generalService
      .consultaApi<RegistroAutocompletarHumConceptoAdicional[]>(
        'humano/concepto/seleccionar/',
        {
          adicional: 'True',
        },
      )
      .subscribe((respuesta) => {
        this.arrConceptosAdicional.set(respuesta);
      });
    this.iniciarFormulario();
    this._modalService.open(this.contentModalAdicional, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  abrirModalEditar(id: number) {
    this._modalService.open(this.contentModalAdicionalEditar, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.registroAdicionalSeleccionado = id;
    this._consultarConceptosAdicionales();
    this.iniciarFormulario();
    this.inicializarParametrosConsultaAdicionalDetalle(id);
    this.consultarRegistroDetalleAdicional();
  }

  iniciarFormulario() {
    this.formularioAdicionalProgramacion = this._formBuilder.group({
      identificacion: ['', Validators.required],
      concepto: [null, Validators.compose([Validators.required])],
      contrato: ['', Validators.compose([Validators.required])],
      concepto_nombre: [''],
      contrato_nombre: ['', Validators.required],
      detalle: [null],
      horas: [0],
      aplica_dia_laborado: [false],
      valor: [
        0,
        Validators.compose([
          validarPrecio(),
          Validators.required,
          Validators.pattern(/^[0-9.]+$/),
        ]),
      ],
      programacion: [this.programacionId],
      permanente: [false],
    });
  }

  onContratoSeleccionado(contrato: RegistroAutocompletarHumContrato) {
    this.formularioAdicionalProgramacion.get('contrato')?.setValue(contrato.id);
    this.formularioAdicionalProgramacion
      .get('contrato_nombre')
      ?.setValue(contrato.contacto__nombre_corto);
    this.formularioAdicionalProgramacion
      .get('identificacion')
      ?.setValue(contrato.contacto__numero_identificacion);
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicionalProgramacion?.markAsDirty();
    this.formularioAdicionalProgramacion?.markAsTouched();
    if (campo === 'concepto') {
      this.formularioAdicionalProgramacion.get(campo)?.setValue(dato);
    }
    if (campo === 'detalle') {
      if (this.formularioAdicionalProgramacion.get(campo)?.value === '') {
        this.formularioAdicionalProgramacion.get(campo)?.setValue(null);
      }
    }
  }

  cerrarModal() {
    if (this.formularioAdicionalProgramacion.valid) {
      this._adicionalService
        .guardarAdicional(this.formularioAdicionalProgramacion.value)
        .subscribe(() => {
          this._modalService.dismissAll();
          this.emitirConsultarLista.emit();
        });
    } else {
      // Marca todos los campos como tocados para activar las validaciones en la UI
      this.formularioAdicionalProgramacion.markAllAsTouched();
    }
  }

  private _consultarConceptosAdicionales() {
    this._generalService
      .consultaApi<RegistroAutocompletarHumConceptoAdicional[]>(
        'humano/concepto/seleccionar/',
        {
          adicional: 'True',
        },
      )
      .subscribe((respuesta) => {
        this.arrConceptosAdicional.set(respuesta);
      });
  }

  inicializarParametrosConsultaAdicionalDetalle(id: number) {
    this.arrParametrosConsultaAdicionalEditar = {
      programacion_id: this.programacionId,
      id,
      limit: 100,
      // modelo: 'HumAdicional',
    };
  }

  actualizarDetalleAdicional() {
    if (this.formularioAdicionalProgramacion.valid) {
      this._adicionalService
        .actualizarDatosAdicional(
          this.registroAdicionalSeleccionado,
          this.formularioAdicionalProgramacion.value,
        )
        .subscribe(() => {
          this.emitirConsultarLista.emit();
          this._alertaService.mensajaExitoso('Se actualizó la información');
          this._modalService.dismissAll();
        });
    }
  }

  consultarRegistroDetalleAdicional() {
    this._generalService
      .consultaApi<
        RespuestaApi<ProgramacionAdicionalDetalle>
      >('humano/adicional/', this.arrParametrosConsultaAdicionalEditar)
      .subscribe((respuesta) => {
        if (respuesta.results.length) {
          const { results } = respuesta;
          const registro = results[0];
          this.formularioAdicionalProgramacion.patchValue({
            identificacion: registro.contrato__contacto__numero_identificacion,
            concepto: registro.concepto,
            contrato: registro.contrato,
            concepto_nombre: registro.concepto__nombre,
            contrato_nombre: registro.contrato__contacto__nombre_corto,
            detalle: registro.detalle,
            horas: registro.horas,
            aplica_dia_laborado: registro.aplica_dia_laborado,
            valor: registro.valor,
            programacion: registro.programacion,
            permanente: registro.permanente,
          });
        }
      });
  }
}
