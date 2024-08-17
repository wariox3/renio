import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AnimacionFadeInOutDirective } from '@comun/Directive/AnimacionFadeInOut.directive';
import { HttpService } from '@comun/services/http.service';
import {
  ProgramacionDetalleRegistro,
  TablaRegistroLista,
} from '@interfaces/humano/programacion';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import { CreditoService } from '@modulos/humano/servicios/creditoservice';
import { ProgramacionService } from '@modulos/humano/servicios/programacion';
import { ProgramacionDetalleService } from '@modulos/humano/servicios/programacion-detalle.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, finalize, forkJoin, tap, throttleTime } from 'rxjs';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';

@Component({
  selector: 'app-programacion-detalle',
  standalone: true,
  imports: [
    KeeniconComponent,
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    AnimacionFadeInOutDirective,
  ],
  templateUrl: './programacion-detalle.component.html',
  styleUrl: './programacion-detalle.component.scss',
})
export default class ProgramacionDetalleComponent
  extends General
  implements OnInit
{
  active: Number;

  programacion: any = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    fecha_hasta_periodo: '',
    nombre: '',
    cantidad: 0,
    dias: 0,
    neto: 0,
    descuento_pension: false,
    descuento_salud: false,
    descuento_fondo_solidaridad: false,
    descuento_adicional_permanente: false,
    descuento_adicional_programacion: false,
    descuento_credito: false,
    descuento_embargo: false,
    descuento_retencion_fuente: false,
    pago_auxilio_transporte: false,
    pago_horas: false,
    pago_incapacidad: false,
    pago_licencia: false,
    pago_vacacion: false,
  };

  arrEstados = {
    estado_aprobado: false,
    estado_anulado: false,
    estado_electronico: false,
    estado_electronico_enviado: false,
    estado_electronico_notificado: false,
  };

  arrParametrosConsulta: any;
  arrParametrosConsultaAdicional: any;
  arrProgramacionDetalle: TablaRegistroLista[] = [];
  arrProgramacionAdicional: any;
  formularioAdicionalProgramacion: FormGroup;
  formularioEditarDetalleProgramacion: FormGroup;
  arrConceptos: any[] = [];
  arrContratos: any[] = [];
  registroSeleccionado: number;
  registrosAEliminar: number[] = [];
  isCheckedSeleccionarTodos: boolean = false;
  cargandoContratos: boolean = false;
  generando: boolean = false;
  desgenerando: boolean = false;
  mostrarMasDetalles: boolean = false;

  // Nos permite manipular el dropdown desde el codigo
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor(
    private programacionService: ProgramacionService,
    private httpService: HttpService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private adicionalService: AdicionalService,
    private programacionDetalleService: ProgramacionDetalleService
  ) {
    super();
  }

  ngOnInit(): void {
    this.consultarDatos();
  }

  consultarDatos() {
    this.programacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.programacion = respuesta;
        this.inicializarParametrosConsulta();
        this.inicializarParametrosConsultaAdicional();
        forkJoin({
          programacionDetalles: this.httpService.post(
            'general/funcionalidad/lista/',
            this.arrParametrosConsulta
          ),
          programacionAdicionales: this.httpService.post(
            'general/funcionalidad/lista/',
            this.arrParametrosConsultaAdicional
          ),
        }).subscribe(
          ({ programacionDetalles, programacionAdicionales }: any) => {
            this.arrProgramacionDetalle = programacionDetalles.registros.map(
              (registro: TablaRegistroLista) => ({
                ...registro,
                selected: false,
              })
            );
            this.arrProgramacionAdicional = programacionAdicionales.registros;
            this.changeDetectorRef.detectChanges();
          }
        );
      });
  }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta = {
      filtros: [
        {
          operador: '',
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumProgramacionDetalle',
    };
  }

  inicializarParametrosConsultaProgramacionDetalle(id: number) {
    this.arrParametrosConsulta = {
      filtros: [
        {
          operador: '',
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
          valor2: '',
        },
        {
          operador: '',
          propiedad: 'id',
          valor1: id,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumProgramacionDetalle',
    };
  }

  inicializarParametrosConsultaAdicional() {
    this.arrParametrosConsultaAdicional = {
      filtros: [
        {
          operador: '',
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumAdicional',
    };
  }

  aprobar() {}

  actualizarDetalleProgramacion() {
    if (this.formularioEditarDetalleProgramacion.valid) {
      this.programacionDetalleService
        .actualizarDetalles(
          this.registroSeleccionado,
          this.formularioEditarDetalleProgramacion.value
        )
        .subscribe(() => {
          this.alertaService.mensajaExitoso('Se actualizó la información');
          this.modalService.dismissAll();
        });
    }
  }

  cargarContratos() {
    this.isCheckedSeleccionarTodos = false;
    this.cargandoContratos = true;
    this.programacionService
      .cargarContratos({
        id: this.programacion.id,
      })
      .pipe(
        finalize(() => {
          this.cargandoContratos = false;
          this.dropdown.close();
        })
      )
      .subscribe();
    this.consultarDatos();
  }

  generar() {
    this.generando = true;
    this.programacionService
      .generar({
        id: this.programacion.id,
      })
      .pipe(
        finalize(() => {
          this.generando = false;
          this.dropdown.close();
        })
      )
      .subscribe();
    this.consultarDatos();
  }

  desgenerar() {
    this.desgenerando = true;
    this.programacionService
      .desgenerar({
        id: this.programacion.id,
      })
      .pipe(
        finalize(() => {
          this.desgenerando = false;
          this.dropdown.close();
        })
      )
      .subscribe();
    this.consultarDatos();
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

  abrirModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.iniciarFormulario();
    this.changeDetectorRef.detectChanges();
  }

  abrirModalDeEditarRegistro(content: any, id: number) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.registroSeleccionado = id;
    this.iniciarFormularioEditarDetalles();
    this.inicializarParametrosConsultaProgramacionDetalle(id);
    this.consultarRegistroDetalleProgramacion();
    this.changeDetectorRef.detectChanges();
  }

  iniciarFormulario() {
    this.formularioAdicionalProgramacion = this.formBuilder.group({
      concepto: ['', Validators.compose([Validators.required])],
      contrato: ['', Validators.compose([Validators.required])],
      concepto_nombre: [''],
      contrato_nombre: [''],
      detalle: [null],
      horas: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      aplica_dia_laborado: [false],
      valor: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      programacion: [this.programacion.id],
    });
  }

  consultarRegistroDetalleProgramacion() {
    this.httpService
      .post<{
        registros: ProgramacionDetalleRegistro[];
        cantidad_registros: number;
      }>('general/funcionalidad/lista/', this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        if (respuesta.registros.length) {
          const { registros } = respuesta;
          const registro = registros[0];
          this.formularioEditarDetalleProgramacion.patchValue({
            programacion: this.programacion.id,
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
            descuento_adicional_permanente:
              registro.descuento_adicional_permanente,
            descuento_adicional_programacion:
              registro.descuento_adicional_programacion,
            descuento_credito: registro.descuento_credito,
            descuento_embargo: registro.descuento_embargo,
          });
        }
      });
  }

  iniciarFormularioEditarDetalles() {
    this.formularioEditarDetalleProgramacion = this.formBuilder.group({
      programacion: [0],
      diurna: [0],
      nocturna: [0],
      festiva_diurna: [0],
      festiva_nocturna: [0],
      extra_diurna: [0],
      extra_nocturna: [0],
      extra_festiva_diurna: [0],
      extra_festiva_nocturna: [0],
      recargo_nocturno: [0],
      recargo_festivo_diurno: [0],
      recargo_festivo_nocturno: [0],
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
      descuento_adicional_permanente: [false],
      descuento_adicional_programacion: [false],
      descuento_credito: [false],
      descuento_embargo: [false],
    });
  }

  consultarConceptos(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumConcepto',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrConceptos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  consultarContratos(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '',
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumContrato',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrContratos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicionalProgramacion?.markAsDirty();
    this.formularioAdicionalProgramacion?.markAsTouched();
    if (campo === 'concepto') {
      this.formularioAdicionalProgramacion
        .get(campo)
        ?.setValue(dato.concepto_id);
      this.formularioAdicionalProgramacion
        .get('concepto_nombre')
        ?.setValue(dato.concepto_nombre);
    }
    if (campo === 'contrato') {
      this.formularioAdicionalProgramacion
        .get(campo)
        ?.setValue(dato.contrato_id);
      this.formularioAdicionalProgramacion
        .get('contrato_nombre')
        ?.setValue(dato.contrato_contacto_nombre_corto);
    }
    if (campo === 'detalle') {
      if (this.formularioAdicionalProgramacion.get(campo)?.value === '') {
        this.formularioAdicionalProgramacion.get(campo)?.setValue(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal() {
    this.adicionalService
      .guardarAdicional(this.formularioAdicionalProgramacion.value)
      .subscribe();
    this.consultarDatos();
    this.modalService.dismissAll();
  }

  // detalles visuales
  mostrarTodosLosDetalles() {
    this.mostrarMasDetalles = !this.mostrarMasDetalles;
    this.changeDetectorRef.detectChanges();
  }

  // funcionalidades de eliminar registros
  agregarRegistrosEliminar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.registrosAEliminar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.registrosAEliminar.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.registrosAEliminar.push(id);
    }
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos = !this.isCheckedSeleccionarTodos;
    // Itera sobre todos los datos
    if (seleccionarTodos.checked) {
      this.arrProgramacionDetalle.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
        // Busca el índice del registro en el array de registros a eliminar
        const index = this.registrosAEliminar.indexOf(item.id);
        // Si el registro ya estaba en el array de registros a eliminar, lo elimina
        if (index === -1) {
          this.registrosAEliminar.push(item.id);
        } // Si el registro no estaba en el array de registros a eliminar, lo agrega
      });
    } else {
      this.arrProgramacionDetalle.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
      });

      this.registrosAEliminar = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  eliminarRegistros() {
    if (this.registrosAEliminar.length > 0) {
      this.registrosAEliminar.forEach((id) => {
        this.programacionDetalleService
          .eliminarRegistro(id, {})
          .subscribe(() => {
            this.isCheckedSeleccionarTodos = false;
            this.alertaService.mensajaExitoso('Registro eliminado');
          });
      });
      this.consultarDatos();
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar'
      );
    }

    this.registrosAEliminar = [];

    this.changeDetectorRef.detectChanges();
  }
}
