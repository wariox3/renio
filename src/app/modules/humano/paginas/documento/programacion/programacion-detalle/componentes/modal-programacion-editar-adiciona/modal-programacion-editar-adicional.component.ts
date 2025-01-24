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
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';

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
  ],
  templateUrl: './modal-programacion-editar-adicional.component.html',
  styleUrl: './modal-programacion-editar-adicional.component.scss',
})
export class ModalProgramacionEditarAdicionalComponent {
  accion = signal<Extract<AplicacionAccion, 'nuevo' | 'detalle'>>;
  arrConceptosAdicional = signal<RegistroAutocompletarHumConceptoAdicional[]>(
    []
  );
  arrContratos: any[] = [];
  registroAdicionalSeleccionado: number;

  formularioAdicionalProgramacion: FormGroup;
  formularioEditarDetalleProgramacion: FormGroup;
  public busquedaContrato = new Subject<string>();
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  arrParametrosConsultaAdicionalEditar: ParametrosFiltros;

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

  constructor(){
    this._inicializarBusqueda();
  }

  abrirModalNuevo() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConceptoAdicional>({
        filtros: [
          {
            propiedad: 'adicional',
            valor1: true,
          },
        ],
        modelo: 'HumConcepto',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta) => {
        this.arrConceptosAdicional.set(respuesta.registros);
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

  private _inicializarBusqueda() {
    this.busquedaContrato
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((valor: string) => {
          return this.consultarContratosPorNombre(valor);
        })
      )
      .subscribe();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    if (!searchTerm) {
      this.reiniciarCamposBusqueda();
    }
    this.busquedaContrato.next(searchTerm);
  }

  reiniciarCamposBusqueda() {
    this.formularioAdicionalProgramacion.get('identificacion')?.setValue('');
    this.formularioAdicionalProgramacion.get('contrato_nombre')?.setValue('');
    this.formularioAdicionalProgramacion.get('contrato')?.setValue('');
  }

  validarCampoContrato() {
    this.formularioAdicionalProgramacion.get('contrato')?.markAsTouched();
  }

  consultarContratosPorNombre(valor: string) {
    let filtros: Filtros[] = [];

    if (!valor.length) {
      filtros = [
        {
          ...filtros,
          operador: 'icontains',
          propiedad: 'contacto__nombre_corto',
          valor1: `${valor}`,
        },
      ];
    } else if (isNaN(Number(valor))) {
      filtros = [
        {
          ...filtros,
          operador: 'icontains',
          propiedad: 'contacto__nombre_corto',
          valor1: `${valor}`,
        },
      ];
    } else {
      filtros = [
        {
          ...filtros,
          operador: 'icontains',
          propiedad: 'contacto__numero_identificacion',
          valor1: `${Number(valor)}`,
        },
      ];
    }

    let arrFiltros: ParametrosFiltros = {
      filtros,
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
      serializador: 'ListaAutocompletar',
    };

    return this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>(arrFiltros)
      .pipe(
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
        }),
        finalize(() => this.cargandoEmpleados$.next(false))
      );
  }

  consultarContratos(valor: string, propiedad: string) {
    this.cargandoEmpleados$.next(true);
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          operador: 'icontains',
          propiedad,
          valor1: valor,
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumContrato>(arrFiltros)
      .pipe(
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
        }),
        finalize(() => this.cargandoEmpleados$.next(false))
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicionalProgramacion?.markAsDirty();
    this.formularioAdicionalProgramacion?.markAsTouched();
    if (campo === 'concepto') {
      this.formularioAdicionalProgramacion.get(campo)?.setValue(dato);
    }
    if (campo === 'contrato') {
      this.formularioAdicionalProgramacion
        .get(campo)
        ?.setValue(dato.contrato_id);
      this.formularioAdicionalProgramacion
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);
      this.formularioAdicionalProgramacion
        .get('identificacion')
        ?.setValue(dato.contrato_contacto_numero_identificacion);
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
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConceptoAdicional>({
        filtros: [
          {
            propiedad: 'adicional',
            valor1: true,
          },
        ],
        modelo: 'HumConcepto',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta) => {
        this.arrConceptosAdicional.set(respuesta.registros);
      });
  }

  inicializarParametrosConsultaAdicionalDetalle(id: number) {
    this.arrParametrosConsultaAdicionalEditar = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.programacionId,
        },
        {
          propiedad: 'id',
          valor1: id,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumAdicional',
    };
  }

  actualizarDetalleAdicional() {
    if (this.formularioAdicionalProgramacion.valid) {
      this._adicionalService
        .actualizarDatosAdicional(
          this.registroAdicionalSeleccionado,
          this.formularioAdicionalProgramacion.value
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
      .consultarDatosLista<{
        registros: any[];
        cantidad_registros: number;
      }>(this.arrParametrosConsultaAdicionalEditar)
      .subscribe((respuesta) => {
        if (respuesta.registros.length) {
          const { registros } = respuesta;
          const registro = registros[0];
          this.formularioAdicionalProgramacion.patchValue({
            identificacion: registro.contrato_contacto_numero_identificacion,
            concepto: registro.concepto_id,
            contrato: registro.contrato_id,
            concepto_nombre: registro.concepto_nombre,
            contrato_nombre: registro.contrato_contacto_nombre_corto,
            detalle: registro.detalle,
            horas: registro.horas,
            aplica_dia_laborado: registro.aplica_dia_laborado,
            valor: registro.valor,
            programacion: registro.programacion_id,
            permanente: registro.permanente,
          });
        }
      });
  }
}
