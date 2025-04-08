import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImportarPersonalizadoComponent } from '@comun/componentes/importar-personalizado/importar-personalizado.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { validarPrecio } from '@comun/validaciones/validar-precio.validator';
import { RegistroAutocompletarHumConceptoAdicional } from '@interfaces/comunes/autocompletar/humano/hum-concepto-adicional.interface';
import { RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import {
  ProgramacionDetalleRegistro,
  TablaRegistroLista,
} from '@interfaces/humano/programacion';
import { ProgramacionRespuesta } from '@modulos/humano/interfaces/programacion.interface';
import { AdicionalService } from '@modulos/humano/servicios/adicional.service';
import { ProgramacionDetalleService } from '@modulos/humano/servicios/programacion-detalle.service';
import { ProgramacionService } from '@modulos/humano/servicios/programacion.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import {
  asyncScheduler,
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  Subject,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { TablaAdicionalesComponent } from './componentes/tabla-adicionales/tabla-adicionales.component';
import { TablaContratosService } from './componentes/tabla-contratos/services/tabla-contratos.service';
import { TablaContratosComponent } from './componentes/tabla-contratos/tabla-contratos.component';
import { TablaResumenComponent } from './componentes/tabla-resumen/tabla-resumen.component';
import { FiltrosDetalleProgramacionContratos } from './constantes';

@Component({
  selector: 'app-programacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    ImportarPersonalizadoComponent,
    NgSelectModule,
    BaseEstadosComponent,
    TituloAccionComponent,
    TablaResumenComponent,
    TablaContratosComponent,
    TablaAdicionalesComponent,
  ],
  templateUrl: './programacion-detalle.component.html',
  styleUrl: './programacion-detalle.component.scss',
})
export default class ProgramacionDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private _descargarArchivosService = inject(DescargarArchivosService);
  private _tablaContratosService = inject(TablaContratosService);

  active: Number;
  programacion: ProgramacionRespuesta = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    fecha_hasta_periodo: '',
    nombre: '',
    dias: 0,
    total: 0,
    descuento_pension: false,
    descuento_salud: false,
    descuento_fondo_solidaridad: false,
    adicional: false,
    descuento_credito: false,
    descuento_embargo: false,
    descuento_retencion_fuente: false,
    pago_auxilio_transporte: false,
    pago_horas: false,
    pago_incapacidad: false,
    pago_licencia: false,
    pago_vacacion: false,
    estado_generado: false,
    estado_aprobado: false,
    devengado: 0,
    deduccion: 0,
    contratos: 0,
    comentario: undefined,
    pago_tipo_id: 0,
    pago_tipo_nombre: '',
    grupo_id: 0,
    grupo_nombre: '',
    periodo_id: 0,
    periodo_nombre: '',
    pago_prima: false,
    pago_interes: false,
    pago_cesantia: false,
  };
  pago: any = {};
  pagoDetalles: any = [];
  arrParametrosConsulta: ParametrosFiltros;
  arrParametrosConsultaAdicionalEditar: ParametrosFiltros;
  arrParametrosConsultaDetalle: any;
  arrParametrosConsultaAdicional: ParametrosFiltros;
  arrProgramacionDetalle: TablaRegistroLista[] = [];
  arrProgramacionAdicional: any;
  formularioAdicionalProgramacion: FormGroup;
  formularioEditarDetalleProgramacion: FormGroup;
  arrConceptos: any[] = [];
  arrContratos: any[] = [];
  registroSeleccionado: number;
  registroAdicionalSeleccionado: number;
  registrosAEliminar: number[] = [];
  registrosAEliminarAdicionales: number[] = [];
  isCheckedSeleccionarTodos: boolean = false;
  isCheckedSeleccionarTodosAdicional: boolean = false;
  cargandoContratos: boolean = false;
  generando: boolean = false;
  desgenerando: boolean = false;
  notificando: boolean = false;
  arrConceptosAdicional: RegistroAutocompletarHumConceptoAdicional[] = [];
  ordenadoTabla: string = '';
  visualizarBtnGuardarNominaProgramacionDetalleResumen = signal(false);
  cantidadRegistrosProgramacionDetalle = 0;

  private _unsubscribe$ = new Subject<void>();
  private readonly _generalService = inject(GeneralService);

  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaContrato = new Subject<string>();

  // Nos permite manipular el dropdown desde el codigo
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;
  @ViewChild(TablaAdicionalesComponent)
  tablaAdicionalesComponent: TablaAdicionalesComponent;
  @ViewChild(TablaContratosComponent)
  tablaContratosComponent: TablaContratosComponent;

  constructor(
    private programacionService: ProgramacionService,
    private httpService: HttpService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private adicionalService: AdicionalService,
    private programacionDetalleService: ProgramacionDetalleService,
  ) {
    super();
    this._inicializarBusqueda();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
    this.consultarDatos();
  }

  private _inicializarBusqueda() {
    this.busquedaContrato
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((valor: string) => {
          return this.consultarContratosPorNombre(valor);
        }),
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

  consultarDatos() {
    this.reiniciarSelectoresEliminar();
    this.programacionService
      .consultarDetalle(this.detalle)
      .pipe(
        tap((respuesta: any) => {
          this.programacion = respuesta;
        }),
        switchMap(() =>
          this._tablaContratosService.consultarListaContratos(
            this.arrParametrosConsulta,
          ),
        ),
        map((respuesta: any) =>
          respuesta.registros.map((registro: TablaRegistroLista) => ({
            ...registro,
            selected: false,
          })),
        ),
        tap((registros: any) => {
          this.cantidadRegistrosProgramacionDetalle = registros.length;
          this.arrProgramacionDetalle = registros;
        }),
      )
      .subscribe(() => {
        this.changeDetectorRef.detectChanges();
      });

    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: FiltrosDetalleProgramacionContratos }),
    );
  }

  consultarAdicionalesTab() {
    this.tablaAdicionalesComponent.consultarDatos();
  }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.detalle,
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: ['contrato_id'],
      limite_conteo: 10000,
      modelo: 'HumProgramacionDetalle',
    };
    const filtroDetalleContratos = localStorage.getItem(
      `documento_programacion`,
    );
    if (filtroDetalleContratos !== null) {
      let filtroPermamente = JSON.parse(filtroDetalleContratos);
      this.arrParametrosConsulta.filtros = [
        ...this.arrParametrosConsulta.filtros,
        ...filtroPermamente,
      ];
    }

    this.changeDetectorRef.detectChanges();
  }

  inicializarParametrosConsultaProgramacionDetalle(id: number) {
    this.arrParametrosConsulta = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
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
      modelo: 'HumProgramacionDetalle',
    };
  }

  inicializarParametrosConsultaProgramacionDetalleEditar(id: number) {
    this.arrParametrosConsultaDetalle = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
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
      modelo: 'HumProgramacionDetalle',
    };
  }

  inicializarParametrosConsultaAdicionalDetalle(id: number) {
    this.arrParametrosConsultaAdicionalEditar = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
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

  inicializarParametrosConsultaAdicional() {
    this.arrParametrosConsultaAdicional = {
      filtros: [
        {
          propiedad: 'programacion_id',
          valor1: this.programacion.id,
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumAdicional',
    };
  }

  validarCampoContrato() {
    this.formularioAdicionalProgramacion.get('contrato')?.markAsTouched();
  }

  aprobar() {
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('humano/programacion/aprobar/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        switchMap((respuesta) =>
          respuesta
            ? this.programacionService.consultarDetalle(this.detalle)
            : EMPTY,
        ),
        tap((respuestaConsultaDetalle: any) => {
          if (respuestaConsultaDetalle) {
            this.programacion = respuestaConsultaDetalle;
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO'),
            );
            this.changeDetectorRef.detectChanges();
          }
        }),
      )
      .subscribe();
  }

  actualizarDetalleProgramacion() {
    if (this.formularioEditarDetalleProgramacion.valid) {
      this.programacionDetalleService
        .actualizarDetalles(
          this.registroSeleccionado,
          this.formularioEditarDetalleProgramacion.value,
        )
        .subscribe(() => {
          this.alertaService.mensajaExitoso('Se actualizó la información');
          this.modalService.dismissAll();
        });
    }
  }

  actualizarDetalleAdicional() {
    if (this.formularioAdicionalProgramacion.valid) {
      this.adicionalService
        .actualizarDatosAdicional(
          this.registroAdicionalSeleccionado,
          this.formularioAdicionalProgramacion.value,
        )
        .subscribe(() => {
          this.consultarAdicionalesTab();
          this.alertaService.mensajaExitoso('Se actualizó la información');
          this.modalService.dismissAll();
        });
    }
  }

  reiniciarSelectoresEliminar() {
    this.reiniciarSelectoresEliminarAdicional();
    this.reiniciarSelectoresEliminarDetalles();
    this.changeDetectorRef.detectChanges();
  }

  reiniciarSelectoresEliminarAdicional() {
    this.isCheckedSeleccionarTodosAdicional = false;
    this.registrosAEliminarAdicionales = [];
    this.isCheckedSeleccionarTodosAdicional = false;
  }

  reiniciarSelectoresEliminarDetalles() {
    this.isCheckedSeleccionarTodos = false;
    this.registrosAEliminar = [];
    this.isCheckedSeleccionarTodos = false;
  }

  cargarContratos() {
    this.reiniciarSelectoresEliminar();
    this.cargandoContratos = true;
    this.programacionService
      .cargarContratos({
        id: this.programacion.id,
      })
      .pipe(
        finalize(() => {
          this.cargandoContratos = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe(() => {
        this.consultarDatos();
        this.changeDetectorRef.detectChanges();
      });
  }

  generar() {
    this.reiniciarSelectoresEliminar();
    this.generando = true;
    this.programacionService
      .generar({
        id: this.programacion.id,
      })
      .pipe(
        finalize(() => {
          this.generando = false;
          this.tablaContratosComponent.consultarDatos();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe((respuesta) => {
        this.consultarDatos();
      });
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
          this.reiniciarSelectoresEliminar();
          this.dropdown.close();
          this.tablaContratosComponent.consultarDatos();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe(() => {
        this.consultarDatos();
      });
  }

  navegarEditar(id: number) {
    this.router.navigate([`humano/proceso/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`humano/proceso/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  desplegarModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  abrirModal(content: any) {
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
      .subscribe((respuesta: any) => {
        this.arrConceptosAdicional = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
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
    this.inicializarParametrosConsultaProgramacionDetalleEditar(id);
    this.consultarRegistroDetalleProgramacion();
    this.changeDetectorRef.detectChanges();
  }

  abrirModalDeEditarAdicional(content: any, id: number) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.registroAdicionalSeleccionado = id;
    this._consultarConceptosAdicionales();
    this.iniciarFormulario();
    this.inicializarParametrosConsultaAdicionalDetalle(id);
    this.consultarRegistroDetalleAdicional();
    this.changeDetectorRef.detectChanges();
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
      .subscribe((respuesta: any) => {
        this.arrConceptosAdicional = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  iniciarFormulario() {
    this.formularioAdicionalProgramacion = this.formBuilder.group({
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
      programacion: [this.programacion.id],
      permanente: [false],
    });
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
            adicional: registro.adicional,
            descuento_credito: registro.descuento_credito,
            descuento_embargo: registro.descuento_embargo,
            dias_transporte: registro.dias_transporte,
          });
        }
      });
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

  iniciarFormularioEditarDetalles() {
    this.formularioEditarDetalleProgramacion = this.formBuilder.group({
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
        arrFiltros,
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrConceptos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  consultarContratosPorNombre(valor: string) {
    let filtros: Filtros[] = [];

    if (!valor.length) {
      filtros = [
        {
          ...filtros,
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${valor}`,
        },
      ];
    } else if (isNaN(Number(valor))) {
      filtros = [
        {
          ...filtros,
          propiedad: 'contacto__nombre_corto__icontains',
          valor1: `${valor}`,
        },
      ];
    } else {
      filtros = [
        {
          ...filtros,
          propiedad: 'contacto__numero_identificacion__icontains',
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
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false)),
      );
  }

  consultarContratos(valor: string, propiedad: string) {
    this.cargandoEmpleados$.next(true);
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
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
          this.changeDetectorRef.detectChanges();
        }),
        finalize(() => this.cargandoEmpleados$.next(false)),
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
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal() {
    this.reiniciarSelectoresEliminar();
    if (this.formularioAdicionalProgramacion.valid) {
      this.adicionalService
        .guardarAdicional(this.formularioAdicionalProgramacion.value)
        .subscribe(() => {
          this.modalService.dismissAll();
          this.consultarAdicionalesTab();
        });
      this.changeDetectorRef.detectChanges();
    } else {
      // Marca todos los campos como tocados para activar las validaciones en la UI
      this.formularioAdicionalProgramacion.markAllAsTouched();
    }
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

  agregarRegistrosEliminarAdicional(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.registrosAEliminarAdicionales.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.registrosAEliminarAdicionales.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.registrosAEliminarAdicionales.push(id);
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

  toggleSelectAllAdicional(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodosAdicional =
      !this.isCheckedSeleccionarTodosAdicional;
    // Itera sobre todos los datos
    if (seleccionarTodos.checked) {
      this.arrProgramacionAdicional.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
        // Busca el índice del registro en el array de registros a eliminar
        const index = this.registrosAEliminarAdicionales.indexOf(item.id);
        // Si el registro ya estaba en el array de registros a eliminar, lo elimina
        if (index === -1) {
          this.registrosAEliminarAdicionales.push(item.id);
        } // Si el registro no estaba en el array de registros a eliminar, lo agrega
      });
    } else {
      this.arrProgramacionAdicional.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
      });

      this.registrosAEliminarAdicionales = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  eliminarRegistros() {
    if (this.registrosAEliminar.length > 0) {
      this.registrosAEliminar.forEach((id) => {
        this.programacionDetalleService
          .eliminarRegistro(id, {})
          .pipe(
            finalize(() => {
              this.isCheckedSeleccionarTodos = false;
            }),
          )
          .subscribe(() => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.consultarDatos();
          });
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }

    this.registrosAEliminar = [];

    this.changeDetectorRef.detectChanges();
  }

  eliminarRegistrosAdicional() {
    if (this.registrosAEliminarAdicionales.length > 0) {
      this.registrosAEliminarAdicionales.forEach((id) => {
        this.adicionalService
          .eliminarAdicional(id)
          .pipe(
            finalize(() => {
              this.isCheckedSeleccionarTodosAdicional = false;
            }),
          )
          .subscribe(() => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.consultarAdicionalesTab();
          });
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar',
      );
    }

    this.registrosAEliminarAdicionales = [];

    this.changeDetectorRef.detectChanges();
  }

  abrirModalDeNominaProgramacionDetalleResumen(content: any, id: number) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      //fullscreen: true
    });
    this.registroSeleccionado = id;
    // this.iniciarFormularioEditarDetalles();
    // this.inicializarParametrosConsultaProgramacionDetalle(id);
    this.consultarNominaProgramacionDetalleResumen();
    this.changeDetectorRef.detectChanges();
  }

  consultarNominaProgramacionDetalleResumen() {
    this._generalService
      .consultarDatosLista<{ cantidad_registros: number; registros: any[] }>({
        filtros: [
          {
            propiedad: 'programacion_detalle_id',
            valor1: this.registroSeleccionado,
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
            editarLinea: false, // Campo booleano inicializado como falso
          }));
          respuestaDetalle.registros = registros;
          return respuestaDetalle;
        }),
        tap((respuestaDetalle) => {
          this.cantidadRegistrosProgramacionDetalle =
            respuestaDetalle.cantidad_registros;
          this.pagoDetalles = respuestaDetalle.registros;
        }),
      )
      .subscribe();
  }

  imprimir() {
    this.httpService.descargarArchivo('humano/programacion/imprimir/', {
      id: this.detalle,
    });
  }

  descargarExcelDetalle() {
    const modelo = 'HumProgramacionDetalle';
    const params = {
      modelo,
      serializador: 'Excel',
      excel: true,
      filtros: [
        {
          propiedad: 'programacion_id',
          operador: 'exact',
          valor1: this.programacion.id,
        },
      ],
      limite: 10000,
    };
    const filtroDetalleContratos = localStorage.getItem(
      `documento_programacion`,
    );
    if (filtroDetalleContratos !== null) {
      let filtroPermamente = JSON.parse(filtroDetalleContratos);
      params.filtros = [
        ...this.arrParametrosConsulta.filtros,
        ...filtroPermamente,
      ];
    }

    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
    this.changeDetectorRef.detectChanges();
  }

  descargarExcelNomina() {
    const modelo = 'GenDocumento';
    const params = {
      modelo,
      serializador: 'NominaExcel',
      excel: true,
      filtros: [
        {
          propiedad: 'programacion_detalle__programacion_id',
          operador: 'exact',
          valor1: this.programacion.id,
        },
      ],
      limite: 10000,
    };

    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
    this.changeDetectorRef.detectChanges();
  }

  descargarExcelNominaDetalle() {
    const modelo = 'GenDocumentoDetalle';
    const params = {
      modelo,
      serializador: 'NominaExcel',
      excel: true,
      filtros: [
        {
          propiedad: 'documento__programacion_detalle__programacion_id',
          operador: 'exact',
          valor1: this.programacion.id,
        },
      ],
      limite: 10000,
    };

    this._descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
    this.changeDetectorRef.detectChanges();
  }

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }
    this.arrParametrosConsulta.ordenamientos[i] = this.ordenadoTabla;
    this.consultarDatos();
    this.changeDetectorRef.detectChanges();
  }

  notificar() {
    this.notificando = true;
    this.programacionDetalleService
      .notificar(this.detalle)
      .pipe(
        finalize(() => {
          this.notificando = false;
          this.dropdown.close();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe(() => {
        this.consultarDatos();
      });
  }

  editarNominaProgramacionDetalleResumen(index: number) {
    this.visualizarBtnGuardarNominaProgramacionDetalleResumen.update(
      (valor) => !valor,
    );
    let registros = this.pagoDetalles.map((pago: any, indexPago: number) => {
      if (indexPago === index) {
        pago.editarLinea = !pago.editarLinea;
      }
      return pago;
    });
    this.pagoDetalles = registros;
    this.changeDetectorRef.detectChanges();
  }

  agregarNuevaLineaNominaProgramacionDetalleResumen() {
    this.pagoDetalles.push({
      editarLinea: true,
    });
    this.changeDetectorRef.detectChanges();
  }

  retirarNominaProgramacionDetalleResumen(index: number) {
    this.pagoDetalles = this.pagoDetalles.filter(
      (pago: any, indexPago: number) => indexPago !== index,
    );
    this.changeDetectorRef.detectChanges();
  }

  agregarConcepto(concepto: any, index: number) {
    this.pagoDetalles[index] = {
      ...this.pagoDetalles[index],
      ...{
        concepto_nombre: concepto.concepto_nombre,
      },
    };
  }

  obtenerFiltrosContratos(data: any[]) {
    this.inicializarParametrosConsulta();
    if (data.length > 0) {
      this.arrParametrosConsulta.filtros = [
        ...this.arrParametrosConsulta.filtros,
        ...data,
      ];
    } else {
      this.inicializarParametrosConsulta();
    }
    this.changeDetectorRef.detectChanges();
    this.consultarDatos();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta.limite = data.desplazamiento;
    this.arrParametrosConsulta.desplazar = data.limite;
    this.changeDetectorRef.detectChanges();
    this.consultarDatos();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.desplazar = desplazamiento;
    this.consultarDatos();
  }

  confirmarDesaprobarDocumento() {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de desaprobar?',
        texto: '',
        textoBotonCofirmacion: 'Si, desaprobar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._desaprobarDocumento(this.detalle);
        }
      });
  }

  private _desaprobarDocumento(documentoId: number) {
    this.programacionService.desaprobar({ id: documentoId }).subscribe({
      next: () => {
        this.alertaService.mensajaExitoso('Documento desaprobado con exito!');
        this.consultarDatos();
      },
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    localStorage.removeItem('documento_programacion');
  }
}
