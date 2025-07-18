import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { RegistroAutocompletarHumRiesgo } from '@interfaces/comunes/autocompletar/humano/hum-riesgo.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';

import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { RegistroAutocompletarGenCiudad } from '@interfaces/comunes/autocompletar/general/gen-ciudad.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarHumCargo } from '@interfaces/comunes/autocompletar/humano/hum-cargo.interface';
import { RegistroAutocompletarHumContratoTipo } from '@interfaces/comunes/autocompletar/humano/hum-contrato.interface';
import { RegistroAutocompletarHumEntidad } from '@interfaces/comunes/autocompletar/humano/hum-entidad.interface';
import { RegistroAutocompletarHumGrupo } from '@interfaces/comunes/autocompletar/humano/hum-grupo.interface';
import { RegistroAutocompletarHumPension } from '@interfaces/comunes/autocompletar/humano/hum-pension.interface';
import { RegistroAutocompletarHumSalud } from '@interfaces/comunes/autocompletar/humano/hum-salud.interface';
import { RegistroAutocompletarHumSubtipoCotizante } from '@interfaces/comunes/autocompletar/humano/hum-subtipo-cotizante.interface';
import { RegistroAutocompletarHumSucursal } from '@interfaces/comunes/autocompletar/humano/hum-sucursal.interface';
import { RegistroAutocompletarHumTiempo } from '@interfaces/comunes/autocompletar/humano/hum-tiempo.interface';
import { RegistroAutocompletarHumTipoCosto } from '@interfaces/comunes/autocompletar/humano/hum-tipo-costo.interface';
import { RegistroAutocompletarHumTipoCotizante } from '@interfaces/comunes/autocompletar/humano/hum-tipo-cotizante.interface';
import { FiltrosAplicados } from '@interfaces/comunes/componentes/filtros/filtros-aplicados.interface';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil, tap, zip } from 'rxjs';
import { BuscarEmpleadoComponent } from '../../../../../../comun/componentes/buscar-empleado/buscar-empleado.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-contrato-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    SoloNumerosDirective,
    NgSelectModule,
    BuscarEmpleadoComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SeleccionarGrupoComponent,
  ],
  templateUrl: './contrato-formulario.component.html',
  styleUrls: ['./contrato-formulario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioContrato: FormGroup;
  arrEmpleados: RegistroAutocompletarGenContacto[] = [];
  arrGrupo: RegistroAutocompletarHumGrupo[] = [];
  arrContratoTipo: RegistroAutocompletarHumContratoTipo[] = [];
  ciudades: RegistroAutocompletarGenCiudad[] = [];
  arrEntidadSalud: RegistroAutocompletarHumEntidad[] = [];
  arrEntidadPension: RegistroAutocompletarHumEntidad[] = [];
  arrEntidadCesantias: RegistroAutocompletarHumEntidad[] = [];
  arrEntidadCaja: RegistroAutocompletarHumEntidad[] = [];
  autocompletarRiesgo: RegistroAutocompletarHumRiesgo[] = [];
  autocompletarPension: RegistroAutocompletarHumPension[] = [];
  autocompletarSubtipoCotizante: RegistroAutocompletarHumSubtipoCotizante[] =
    [];
  autocompletarSalud: RegistroAutocompletarHumSalud[] = [];
  autocompletarSucursal: RegistroAutocompletarHumSucursal[] = [];
  autocompletarTipoCotizante: RegistroAutocompletarHumTipoCotizante[] = [];
  autocompletarCargo: RegistroAutocompletarHumCargo[] = [];
  autocompletarTiempo: RegistroAutocompletarHumTiempo[] = [];
  autocompletarTipoCosto: RegistroAutocompletarHumTipoCosto[] = [];
  camposBuscarAvanzado = [
    'id',
    'identificacion_abreviatura',
    'numero_identificacion',
    'nombre_corto',
  ];

  public campoListaContacto: CampoLista[] = [
    {
      propiedad: 'id',
      titulo: 'id',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'numero_identificacion',
      titulo: 'identificacion',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'nombre_corto',
      titulo: 'nombre_corto',
      campoTipo: 'IntegerField',
    },
  ];
  filtrosPermanentesEmpleado: FiltrosAplicados = {
    propiedad: 'empleado',
    valor1: true,
  };
  private readonly _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;


  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private contratoService: ContratoService,
    private contenedorService: ContenedorService,
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    } else {
      this.consultarSalario();
    }
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


  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;
    this.formularioContrato = this.formBuilder.group(
      {
        contacto: ['', Validators.compose([Validators.required])],
        contacto_nombre: [''],
        contacto_numero_identificacion: [''],
        fecha_desde: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        fecha_hasta: [
          fechaVencimientoInicial,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),
          ]),
        ],
        grupo: ['', Validators.compose([Validators.required])],
        contrato_tipo: ['', Validators.compose([Validators.required])],
        riesgo: ['', Validators.required],
        pension: [1, Validators.required],
        subtipo_cotizante: [1, Validators.required],
        salud: [1, Validators.required],
        sucursal: ['', Validators.compose([Validators.required])],
        tipo_cotizante: [1, Validators.required],
        cargo: [null, Validators.required],
        cargo_nombre: [''],
        salario: ['', [Validators.required]],
        auxilio_transporte: [true],
        salario_integral: [false],
        comentario: [
          '',
          [Validators.maxLength(300), cambiarVacioPorNulo.validar],
        ],
        ciudad_contrato: ['', Validators.required],
        ciudad_contrato_nombre: [''],
        ciudad_labora: ['', Validators.required],
        ciudad_labora_nombre: [''],
        entidad_salud: [null, Validators.required],
        entidad_caja: [null, Validators.required],
        entidad_pension: [null, Validators.required],
        entidad_cesantias: [null, Validators.required],
        tiempo: [1, Validators.required],
        tipo_costo: [1],
        grupo_contabilidad: [null],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  enviarFormulario() {
    if (this.formularioContrato.valid) {
      if (this.detalle) {
        this.contratoService
          .actualizarDatosContacto(this.detalle, this.formularioContrato.value)
          .subscribe((respuesta) => {
            this.formularioContrato.patchValue({
              empleado: respuesta.contacto_id,
              empleadoNombre: respuesta.contado_nombre_corto,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                queryParams: {
                  ...parametro,

                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.contratoService
          .guardarContrato(this.formularioContrato.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuesta.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioContrato.markAllAsTouched();
    }
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarHumGrupo[]>(
        'humano/grupo/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumContratoTipo[]>(
        'humano/contrato_tipo/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumRiesgo[]>(
        'humano/riesgo/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumPension[]>(
        'humano/pension/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumSubtipoCotizante[]>(
        'humano/subtipo_cotizante/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumSalud[]>(
        'humano/salud/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumSucursal[]>(
        'humano/sucursal/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumTipoCotizante[]>(
        'humano/tipo_cotizante/seleccionar/',
          {
            limit: 100
          }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumCargo[]>(
        'humano/cargo/seleccionar/',
        ),
      this._generalService.consultaApi<RegistroAutocompletarHumEntidad[]>(
        'humano/entidad/seleccionar/',
        {
          salud: 'True',
          limit: 100
        }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumEntidad[]>(
        'humano/entidad/seleccionar/',
        {
          pension: 'True',
          limit: 100
        }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumEntidad[]>(
        'humano/entidad/seleccionar/',
        {
          caja: 'True',
          limit: 100
        }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumEntidad[]>(
        'humano/entidad/seleccionar/',
        {
          cesantias: 'True',
          limit: 100
        }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumTiempo[]>(
        'humano/tiempo/seleccionar/',
        {
          limit: 100
        }
      ),
      this._generalService.consultaApi<RegistroAutocompletarHumTipoCosto[]>(
        'humano/tipo_costo/seleccionar/',
        {
          limit: 100
        }
      ),
    ).subscribe((respuesta) => {
      this.arrGrupo = respuesta[0];
      this.arrContratoTipo = respuesta[1];
      this.autocompletarRiesgo = respuesta?.[2];
      this.autocompletarPension = respuesta?.[3];
      this.autocompletarSubtipoCotizante = respuesta?.[4];
      this.autocompletarSalud = respuesta?.[5];
      this.autocompletarSucursal = respuesta?.[6];
      this.autocompletarTipoCotizante = respuesta?.[7];
      this.autocompletarCargo = respuesta?.[8];
      this.arrEntidadSalud = respuesta?.[9];
      this.arrEntidadPension = respuesta?.[10];
      this.arrEntidadCaja = respuesta?.[11];
      this.arrEntidadCesantias = respuesta?.[12];
      this.autocompletarTiempo = respuesta?.[13];
      this.autocompletarTipoCosto = respuesta?.[14];
      if (!this.detalle) {
        this._sugerirPrimerValor();
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  private _sugerirPrimerValor() {
    if (this.autocompletarTipoCotizante.length) {
      this.formularioContrato.get('tipo_cotizante')?.setValue(this.autocompletarTipoCotizante[0].id);
    }
  }

  consultarEmpleado(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto[]>(
        'general/contacto/seleccionar/',
        {
          nombre_corto__icontains: `${event?.target.value}`,
        }
      )
      .pipe(
        tap((respuesta) => {
          this.arrEmpleados = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this.formularioContrato.get(campo)?.setValue(dato.id);
      this.formularioContrato
        .get('contacto_nombre')
        ?.setValue(dato.nombre_corto);
    }
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  private _modificarFechasContratoIndefinido(fecha: string) {
    const contratoTipo = this.formularioContrato.get('contrato_tipo')?.value;
    if (contratoTipo == 1) {
      this.formularioContrato.patchValue({
        fecha_hasta: fecha,
        fecha_desde: fecha,
      });
    }
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContrato?.markAsDirty();
    this.formularioContrato?.markAsTouched();

    if (campo === 'fecha_desde') {
      const fecha = dato.target.value;
      if (fecha !== '') {
        this._modificarFechasContratoIndefinido(fecha);
      }
    }

    if (campo === 'contacto') {
      this.formularioContrato.get(campo)?.setValue(dato.id);
      this.formularioContrato
        .get('contacto_nombre')
        ?.setValue(dato.nombre_corto);
      this.formularioContrato
        .get('contacto_numero_identificacion')
        ?.setValue(dato.numero_identificacion);
    }

    if (campo === 'cargo') {
      this.formularioContrato.get(campo)?.setValue(dato.cargo_id);
      this.formularioContrato.get('cargo_nombre')?.setValue(dato.cargo_nombre);
    }

    if (campo === 'ciudad_contrato') {
      this.formularioContrato
        .get('ciudad_contrato')
        ?.setValue(parseInt(dato.id));
      this.formularioContrato
        .get('ciudad_contrato_nombre')
        ?.setValue(`${dato.nombre} - ${dato.estado__nombre}`);
    }

    if (campo === 'ciudad_labora') {
      this.formularioContrato.get('ciudad_labora')?.setValue(parseInt(dato.id));
      this.formularioContrato
        .get('ciudad_labora_nombre')
        ?.setValue(`${dato.nombre} - ${dato.estado__nombre}`);
    }

    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this.contratoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioContrato.patchValue({
          contacto: respuesta.contacto_id,
          contacto_nombre: respuesta.contacto_nombre_corto,
          contacto_numero_identificacion:
            respuesta.contacto_numero_identificacion,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
          grupo: respuesta.grupo_id,
          contrato_tipo: respuesta.contrato_tipo_id,
          riesgo: respuesta.riesgo_id,
          pension: respuesta.pension_id,
          subtipo_cotizante: respuesta.subtipo_cotizante_id,
          salud: respuesta.salud_id,
          sucursal: respuesta.sucursal_id,
          tipo_cotizante: respuesta.tipo_cotizante_id,
          cargo: respuesta.cargo_id,
          cargo_nombre: respuesta.cargo_nombre,
          salario: respuesta.salario,
          auxilio_transporte: respuesta.auxilio_transporte,
          salario_integral: respuesta.salario_integral,
          comentario: respuesta.comentario,
          ciudad_contrato: respuesta.ciudad_contrato_id,
          ciudad_contrato_nombre: `${respuesta.ciudad_contrato_nombre} - ${respuesta.estado_contrato_nombre}`,
          ciudad_labora: respuesta.ciudad_labora_id,
          ciudad_labora_nombre: `${respuesta.ciudad_labora_nombre} - ${respuesta.estado_labora_nombre}`,
          entidad_salud: respuesta.entidad_salud_id,
          entidad_caja: respuesta.entidad_caja_id,
          entidad_pension: respuesta.entidad_pension_id,
          entidad_cesantias: respuesta.entidad_cesantias_id,
          tiempo: respuesta.tiempo_id,
          tipo_costo: respuesta.tipo_costo_id,
          grupo_contabilidad: respuesta.grupo_contabilidad_id,
        });

        this._modificarFechasContratoIndefinido(respuesta.fecha_desde);

        this.changeDetectorRef.detectChanges();
      });
  }

  consultarSalario() {
    const bodyData = {
      campos: ['hum_salario_minimo'],
    };
    this.httpService
      .post<{
        configuracion: { hum_salario_minimo: number }[];
      }>('general/configuracion/consulta/', bodyData)
      .subscribe((respuesta) => {
        const salario = respuesta.configuracion[0].hum_salario_minimo;
        this.formularioContrato.patchValue({
          salario,
        });
      });
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const desde = formGroup.get(fechaDesde)?.value;
      const hasta = formGroup.get(fechaHasta)?.value;

      // Comprobar si las fechas son válidas y si "fecha_desde" es mayor que "fecha_hasta"
      if (desde && hasta && new Date(desde) > new Date(hasta)) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }

  cambioDeContratoTipo(event: Event) {
    const selector = event.target as HTMLSelectElement;

    if (selector.value === '1') {
      this.formularioContrato.patchValue({
        fecha_hasta: this.formularioContrato.get('fecha_desde')?.value,
      });
    }
  }

  limpiarCiudadLabora(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContrato.controls['ciudad_labora'].setValue(null);
      this.formularioContrato.controls['ciudad_labora_nombre'].setValue(null);
    }
  }

  limpiarCiudadContrato(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContrato.controls['ciudad_contrato'].setValue(null);
      this.formularioContrato.controls['ciudad_contrato_nombre'].setValue(null);
    }
  }

  consultarCiudad(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenCiudad[]>(
        'general/ciudad/seleccionar/',
        {
          nombre__icontains: `${event?.target.value}`,
        }
      )
      .pipe(
        tap((respuesta) => {
          this.ciudades = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  consultarCargo(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarHumCargo[]>(
        'humano/cargo/seleccionar/',
        { 
          nombre__icontains: `${event?.target.value}`,
        })
      .pipe(
        tap((respuesta) => {
          this.autocompletarCargo = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
    this.changeDetectorRef.detectChanges();
  }

  limpiarCargo(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContrato.controls['cargo'].setValue(null);
    }
  }

  // Método para manejar cambios en la selección
  seleccionarCargoAdcional(cargo: RegistroAutocompletarHumCargo) {
    this.formularioContrato.patchValue({
      cargo: cargo.id,
    });
    this.changeDetectorRef.detectChanges();
  }

  onSeleccionarGrupoChange(id: number) {
    this.formularioContrato.patchValue({
      grupo_contabilidad: id,
    });
  }
}
