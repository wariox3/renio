import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarContratoComponent } from '@comun/componentes/buscar-contrato/buscar-contrato.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { GeneralService } from '@comun/services/general.service';
import { validarRangoDeFechas } from '@comun/validaciones/rango-fechas.validator';
import { RegistroAutocompletarHumContrato } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
import {
  HumNovedadLista,
  RegistroAutocompletarHumNovedadTipo,
} from '@interfaces/comunes/autocompletar/humano/hum-novedad-tipo.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { NovedadService } from '@modulos/humano/servicios/novedad.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, Subject, takeUntil, tap, throttleTime } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { BuscarAvanzadoComponent } from '../../../../../../comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { NOVEDAD_FILTERS_LISTA_BUSCAR_AVANZADO } from '@modulos/humano/domain/mapeo/novedad.mapeo';

@Component({
  selector: 'app-novedad-formulario',
  standalone: true,
  templateUrl: './novedad-formulario.component.html',
  styleUrl: './novedad-formulario.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    BuscarContratoComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    NgSelectModule,
    BuscarAvanzadoComponent,
  ],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
        }),
      ),
      transition(':enter, :leave', [animate(600)]),
    ]),
  ],
})
export default class CreditoFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  private readonly _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService);
  private _destroy$ = new Subject<void>();
  private _rutas: Rutas | undefined;

  formularioAdicional: FormGroup;
  arrContratos: any[] = [];
  arrNovedadTipos: RegistroAutocompletarHumNovedadTipo[] = [];
  public novedadReferenciaLista = signal<HumNovedadLista[]>([]);
  public filtrosNovedadReferencia = signal({});
  public mostrarCampoNovedadReferencia = signal<boolean>(false);
  public campoLista = NOVEDAD_FILTERS_LISTA_BUSCAR_AVANZADO;

  constructor(
    private formBuilder: FormBuilder,
    private novedadService: NovedadService,
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener();
    this.consultarInformacion();
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }

    this._iniciarCamposReactivos();
  }

  private configurarModuloListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((modeloConfig) => {
        this._rutas = modeloConfig?.ajustes.rutas;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _iniciarCamposReactivos() {
    this._campoReactivoContrato();
    this._campoReactivoNovedadTipo();
  }

  private _campoReactivoContrato() {
    this.formularioAdicional.get('contrato')?.valueChanges.subscribe({
      next: () => {
        this._consultarNovedadesReferencia();
      },
    });
  }

  private _campoReactivoNovedadTipo() {
    this.formularioAdicional.get('novedad_tipo')?.valueChanges.subscribe({
      next: () => {
        this.formularioAdicional.get('novedad_referencia')?.setValue(null);
        this._consultarNovedadesReferencia();
      },
    });
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    this.formularioAdicional = this.formBuilder.group(
      {
        fecha_desde: [
          fechaActual.toISOString().substring(0, 10),
          Validators.compose([Validators.required]),
        ],
        fecha_hasta: [
          fechaActual.toISOString().substring(0, 10),
          Validators.compose([Validators.required]),
        ],
        contrato: ['', Validators.compose([Validators.required])],
        contrato_nombre: [''],
        contrato_identificacion: [''],
        novedad_tipo: ['', Validators.compose([Validators.required])],
        dias_dinero: [0],
        dias_disfrutados: [0],
        dias_disfrutados_reales: [0],
        fecha_desde_periodo: [null],
        fecha_hasta_periodo: [null],
        novedad_referencia: [null],
        detalle: [''],
      },
      {
        validator: [
          validarRangoDeFechas('fecha_desde', 'fecha_hasta'),
          validarRangoDeFechas('fecha_desde_periodo', 'fecha_hasta_periodo'),
        ],
      },
    );
  }

  consultarInformacion() {
    this._generalService
      .consultaApi<RegistroAutocompletarHumNovedadTipo[]>(
        'humano/novedad_tipo/seleccionar/',
        {
          limit: 100,
        },
      )
      .subscribe((respuesta) => {
        this.arrNovedadTipos = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  enviarFormulario() {
    if (this.formularioAdicional.valid) {
      if (this.detalle) {
        this.novedadService
          .actualizarDatoNovedad(this.detalle, this.formularioAdicional.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametros) => {
              this.router.navigate(
                [`${this._rutas?.detalle}/${respuesta.id}`],
                {
                  queryParams: {
                    ...parametros,
                  },
                },
              );
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.novedadService
          .guardarNovedad(this.formularioAdicional.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametros) => {
                this.router.navigate(
                  [`${this._rutas?.detalle}/${respuesta.id}`],
                  {
                    queryParams: {
                      ...parametros,
                    },
                  },
                );
              });
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioAdicional.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.novedadService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioAdicional.patchValue({
          fecha_inicio: respuesta.fecha_inicio,
          contrato: respuesta.contrato_id,
          contrato_nombre: respuesta.contrato_contacto_nombre_corto,
          contrato_identificacion:
            respuesta.contrato_contacto_numero_identificacion,
          novedad_tipo: respuesta.novedad_tipo_id,
          dias_dinero: respuesta.dias_dinero,
          dias_disfrutados: respuesta.dias_disfrutados,
          dias_disfrutados_reales: respuesta.dias_disfrutados_reales,
          fecha_desde_periodo: respuesta.fecha_desde_periodo,
          fecha_hasta_periodo: respuesta.fecha_hasta_periodo,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          novedad_referencia: respuesta.novedad_referencia_id,
          detalle: respuesta.detalle,
        });
        this.changeDetectorRef.detectChanges();
      });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioAdicional?.markAsDirty();
    this.formularioAdicional?.markAsTouched();
    if (campo === 'contrato') {
      this.formularioAdicional.get(campo)?.setValue(dato.id);
      this.formularioAdicional
        .get('contrato_nombre')
        ?.setValue(dato.contacto__nombre_corto);
      this.formularioAdicional
        .get('contrato_identificacion')
        ?.setValue(dato.contacto__numero_identificacion);
    }

    switch (campo) {
      case 'novedad_referencia':
        this._actualizarCampoNovedadReferencia(dato);
        break;
      default:
    }

    this.changeDetectorRef.detectChanges();
  }

  private _actualizarCampoNovedadReferencia(registro: HumNovedadLista) {
    this.formularioAdicional.get('novedad_referencia')?.setValue(registro.id);
  }

  novedadTipoSeleccionado($event: Event) {
    let valorPersonaTipo = $event.target as HTMLInputElement;

    if (parseInt(valorPersonaTipo.value) === 7) {
      // 7 es igual a vacaciones
      this.setValidators('dias_dinero', [
        Validators.required,
        Validators.min(0),
      ]);
      this.setValidators('dias_disfrutados', [
        Validators.required,
        Validators.min(0),
      ]);
      this.setValidators('dias_disfrutados_reales', [
        Validators.required,
        Validators.min(1),
      ]);
      this.setValidators('fecha_desde_periodo', [Validators.required]);
      this.setValidators('fecha_hasta_periodo', [Validators.required]);

      this.formularioAdicional.patchValue({
        dias_dinero: 1,
        dias_disfrutados: 1,
        dias_disfrutados_reales: 1,
      });
    } else {
      this.formularioAdicional.get('dias_dinero')?.clearValidators();
      this.formularioAdicional.get('dias_dinero')?.updateValueAndValidity();
      this.formularioAdicional.get('dias_disfrutados')?.clearValidators();
      this.formularioAdicional
        .get('dias_disfrutados')
        ?.updateValueAndValidity();
      this.formularioAdicional
        .get('dias_disfrutados_reales')
        ?.clearValidators();
      this.formularioAdicional
        .get('dias_disfrutados_reales')
        ?.updateValueAndValidity();
      this.formularioAdicional.get('fecha_desde_periodo')?.clearValidators();
      this.formularioAdicional
        .get('fecha_desde_periodo')
        ?.updateValueAndValidity();
      this.formularioAdicional.get('fecha_hasta_periodo')?.clearValidators();
      this.formularioAdicional
        .get('fecha_hasta_periodo')
        ?.updateValueAndValidity();

      this.formularioAdicional.patchValue({
        dias_dinero: 0,
        dias_disfrutados: 0,
        dias_disfrutados_reales: 0,
        fecha_desde_periodo: null,
        fecha_hasta_periodo: null,
      });

      this.changeDetectorRef.detectChanges();
    }
  }

  private setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioAdicional.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }

  private _consultarNovedadesReferencia() {
    const novedadTipo = this.formularioAdicional.get('novedad_tipo')?.value;
    const contratoId = this.formularioAdicional.get('contrato')?.value;

    if (novedadTipo == 1 && contratoId) {
      this._setFiltrosNovedadReferencia(contratoId, novedadTipo);
      this.mostrarCampoNovedadReferencia.set(true);
      this._getNovedadesReferenciaLista(
        this.filtrosNovedadReferencia(),
      ).subscribe({
        next: (response: any) => {
          this.novedadReferenciaLista.set(response);
        },
      });
    } else {
      this.mostrarCampoNovedadReferencia.set(false);
    }
  }

  private _getNovedadesReferenciaLista(filtros: any) {
    return this._generalService.consultaApi<HumNovedadLista>(
      'humano/novedad/seleccionar/',
      filtros,
    );
  }

  public recibirEventoNovedadReferencia(evento: Event) {
    const propiedad = evento.target as HTMLSelectElement;
    if (this._isHabilitadoConsultaNovedadReferencia()) {
      this._buscarNovedadReferenciaListaById(Number(propiedad.value));
    }
  }

  private _buscarNovedadReferenciaListaById(id: number) {
    let filtros = this.filtrosNovedadReferencia();

    if (id) {
      filtros = {
        ...filtros,
        id: id,
      };
    }

    this._getNovedadesReferenciaLista(filtros).subscribe({
      next: (response: any) => {
        this.novedadReferenciaLista.set(response);
      },
    });
  }

  private _isHabilitadoConsultaNovedadReferencia(): boolean {
    const novedadTipo = this.formularioAdicional.get('novedad_tipo')?.value;
    const contratoId = this.formularioAdicional.get('contrato')?.value;

    return novedadTipo == 1 && contratoId;
  }

  private _setFiltrosNovedadReferencia(
    contratoId: number,
    novedadTipoId: number,
  ) {
    this.filtrosNovedadReferencia.set({
      contrato_id: contratoId,
      novedad_tipo_id: novedadTipoId,
    });
  }
}
