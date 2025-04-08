import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { GeneralService } from '@comun/services/general.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { MultiplesEmailValidator } from '@comun/validaciones/multiples-email-validator';
import { RegistroAutocompletarGenAsesor } from '@interfaces/comunes/autocompletar/general/gen-asesor.interface';
import { RegistroAutocompletarGenBanco } from '@interfaces/comunes/autocompletar/general/gen-banco.interface';
import { RegistroAutocompletarGenCiudad } from '@interfaces/comunes/autocompletar/general/gen-ciudad.interface';
import { RegistroAutocompletarGenCuentaBancoClase } from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { RegistroAutocompletarGenIdentificacion } from '@interfaces/comunes/autocompletar/general/gen-identificacion.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { RegistroAutocompletarGenPrecio } from '@interfaces/comunes/autocompletar/general/gen-precio.interface';
import { RegistroAutocompletarGenRegimen } from '@interfaces/comunes/autocompletar/general/gen-regimen.interface';
import { RegistroAutocompletarGenTipoPersona } from '@interfaces/comunes/autocompletar/general/gen-tipo-persona.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ContactoService } from '@modulos/general/servicios/contacto.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  asyncScheduler,
  BehaviorSubject,
  debounceTime,
  finalize,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throttleTime,
  zip,
} from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';

@Component({
  selector: 'app-empleado-formulario',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    InputValueCaseDirective
  ],
  templateUrl: './empleado-formulario.component.html',
})
export default class EmpleadoFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioEmpleado: FormGroup;
  informacionEmpleado: any;
  ciudadSeleccionada: string | null;
  arrCiudades: RegistroAutocompletarGenCiudad[];
  arrBancos: RegistroAutocompletarGenBanco[];
  arrIdentificacion: RegistroAutocompletarGenIdentificacion[];
  arrTipoPersona: RegistroAutocompletarGenTipoPersona[];
  arrRegimen: RegistroAutocompletarGenRegimen[];
  arrAsesores: RegistroAutocompletarGenAsesor[];
  arrPrecios: RegistroAutocompletarGenPrecio[];
  arrPagos: RegistroAutocompletarGenPlazoPago[];
  guardando$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  arrCuentasBancos: RegistroAutocompletarGenCuentaBancoClase[];
  private readonly _configModuleService = inject(ConfigModuleService)
  private _destroy$ = new Subject<void>()
  private _rutas: Rutas | undefined;

  selectedDateIndex: number = -1;

  private readonly _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener()
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }

    this.formularioEmpleado
      .get('numero_identificacion')!
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        if (value != null) {
          this.validarNumeroIdenficacionExistente();
        }
      });

    this.formularioEmpleado
      .get('identificacion')!
      .valueChanges.subscribe((value) => {
        this.validarNumeroIdenficacionExistente();
      });
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
    this.formularioEmpleado = this.formBuilder.group(
      {
        numero_identificacion: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[0-9]+$/),
          ]),
        ],
        digito_verificacion: [0, Validators.compose([Validators.maxLength(1)])],
        identificacion: ['', Validators.compose([Validators.required])],
        nombre_corto: [null, Validators.compose([Validators.maxLength(200)])],
        nombre1: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          ]),
        ],
        nombre2: [
          null,
          Validators.compose([
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            cambiarVacioPorNulo.validar,
          ]),
        ],
        apellido1: [
          null,
          Validators.compose([
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          ]),
        ],
        apellido2: [
          null,
          Validators.compose([
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            cambiarVacioPorNulo.validar,
          ]),
        ],
        direccion: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        correo: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
        ciudad_nombre: [''],
        ciudad: ['', Validators.compose([Validators.required])],
        banco_nombre: [''],
        banco: ['', Validators.compose([Validators.required])],
        numero_cuenta: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(20)]),
        ],
        telefono: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        celular: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        tipo_persona: [2, Validators.compose([Validators.required])],
        regimen: [1, Validators.compose([Validators.required])],
        codigo_ciuu: [null, Validators.compose([Validators.maxLength(200)])],
        barrio: [
          null,
          Validators.compose([
            Validators.maxLength(200),
            cambiarVacioPorNulo.validar,
          ]),
        ],
        precio: [null],
        plazo_pago: [null],
        plazo_pago_proveedor: [null],
        asesor: [null],
        cliente: [false],
        proveedor: [false],
        empleado: [true],
        cuenta_banco_clase: ['', Validators.compose([Validators.required])],
      },
      {
        validator: [MultiplesEmailValidator.validarCorreos(['correo'])],
      }
    );
  }

  getErroresFormulario() {
    const errores: Record<string, any> = {};
    Object.keys(this.formularioEmpleado.controls).forEach((controlName) => {
      const control = this.formularioEmpleado.get(controlName);
      if (control?.errors) {
        errores[controlName] = control.errors;
      }
    });
    return errores;
  }

  enviarFormulario() {
    if (this.formularioEmpleado.valid) {
      this.guardando$.next(true);
      this.actualizarNombreCorto();
      if (this.detalle) {
        if (
          parseInt(this.informacionEmpleado.numero_identificacion) !==
          parseInt(
            this.formularioEmpleado.get('numero_identificacion')!.value
          ) ||
          parseInt(this.informacionEmpleado.identificacion_id) !==
          parseInt(this.formularioEmpleado.get('identificacion')!.value)
        ) {
          this.contactoService
            .validarNumeroIdentificacion({
              identificacion_id: parseInt(
                this.formularioEmpleado.get('identificacion')!.value
              ),
              numero_identificacion: this.formularioEmpleado.get(
                'numero_identificacion'
              )!.value,
            })
            .pipe(
              switchMap((respuestaValidacion) => {
                if (!respuestaValidacion.validacion) {
                  return this.contactoService.actualizarDatosContacto(
                    this.detalle,
                    this.formularioEmpleado.value
                  );
                } else {
                  this.alertaService.mensajeError(
                    'Error',
                    'El número de identificación ya existe en el sistema con este tipo de identificación'
                  );
                  return of(null);
                }
              }),
              tap((respuestaFormulario) => {
                if (respuestaFormulario !== null) {
                  this.alertaService.mensajaExitoso(
                    'Se actualizó la información'
                  );
                  this.activatedRoute.queryParams.subscribe((parametro) => {
                    this.router.navigate([`${this._rutas?.detalle}/${respuestaFormulario.id}`], {
                      queryParams: {
                        ...parametro,
                      },
                    });
                  });
                }
              }),
              finalize(() => this.guardando$.next(false))
            )
            .subscribe();
        } else {
          this.contactoService
            .actualizarDatosContacto(
              this.detalle,
              this.formularioEmpleado.value
            )
            .subscribe((respuestaFormulario) => {
              this.alertaService.mensajaExitoso('Se actualizó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`${this._rutas?.detalle}/${respuestaFormulario.id}`], {
                  queryParams: {
                    ...parametro,
                  },
                });
              });
            });
        }
      } else {
        this.contactoService
          .validarNumeroIdentificacion({
            identificacion_id: parseInt(
              this.formularioEmpleado.get('identificacion')!.value
            ),
            numero_identificacion: this.formularioEmpleado.get(
              'numero_identificacion'
            )!.value,
          })
          .pipe(
            switchMap((respuestaValidacion) => {
              if (!respuestaValidacion.validacion) {
                return this.contactoService.guardarContacto(
                  this.formularioEmpleado.value
                );
              } else {
                this.alertaService.mensajeError(
                  'Error',
                  'El número de identificación ya existe en el sistema con este tipo de identificación'
                );
                return of(null);
              }
            }),
            tap((respuestaFormulario) => {
              if (respuestaFormulario !== null) {
                this.alertaService.mensajaExitoso('Se guardó la información');
                this.activatedRoute.queryParams.subscribe((parametro) => {
                  this.router.navigate([`${this._rutas?.detalle}/${respuestaFormulario.id}`], {
                    queryParams: {
                      ...parametro,
                    },
                  });
                });
              }
            }),
            finalize(() => this.guardando$.next(false))
          )
          .subscribe();
      }
    } else {
      this.formularioEmpleado.markAllAsTouched();
    }
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioEmpleado.get('nombre1')?.value;
    const nombre2 = this.formularioEmpleado.get('nombre2')?.value;
    const apellido1 = this.formularioEmpleado.get('apellido1')?.value;
    const apellido2 = this.formularioEmpleado.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioEmpleado
      .get('nombre_corto')
      ?.patchValue(nombreCorto, { emitEvent: false });
  }

  get obtenerFormularioCampos() {
    return this.formularioEmpleado.controls;
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioEmpleado.get('numero_identificacion')?.value
    );
    this.formularioEmpleado.patchValue({
      digito_verificacion: digito,
    });
  }

  consultarCiudad(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenCiudad',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenCiudad>(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCiudades = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioEmpleado?.markAsDirty();
    this.formularioEmpleado?.markAsTouched();
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioEmpleado.get('ciudad_nombre')?.setValue(null);
        this.formularioEmpleado.get('ciudad')?.setValue(null);
        this.ciudadSeleccionada = null;
      } else {
        this.ciudadSeleccionada = dato.nombre;
        this.formularioEmpleado
          .get('ciudad_nombre')
          ?.setValue(`${dato.nombre} - ${dato.estado_nombre}`);
        this.formularioEmpleado.get('ciudad')?.setValue(dato.id);
      }
    }

    if (campo === 'ciudad_nombre') {
      this.formularioEmpleado.get('ciudad_nombre')?.setValue(dato);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    zip(
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenIdentificacion>(
        {
          modelo: 'GenIdentificacion',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenRegimen>(
        {
          modelo: 'GenRegimen',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenTipoPersona>(
        {
          modelo: 'GenTipoPersona',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenPrecio>(
        {
          modelo: 'GenPrecio',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenAsesor>(
        {
          modelo: 'GenAsesor',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenPlazoPago>(
        {
          modelo: 'GenPlazoPago',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenBanco>(
        {
          modelo: 'GenBanco',
          serializador: 'ListaAutocompletar',
        }
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenCuentaBancoClase>(
        {
          modelo: 'GenCuentaBancoClase',
          serializador: 'ListaAutocompletar',
        }
      )
    ).subscribe((respuesta) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrRegimen = respuesta[1].registros;
      this.arrTipoPersona = respuesta[2].registros;
      this.arrPrecios = respuesta[3].registros;
      this.arrAsesores = respuesta[4].registros;
      this.arrPagos = respuesta[5].registros;
      this.arrBancos = respuesta[6].registros;
      this.arrCuentasBancos = respuesta[7].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  private setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioEmpleado.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }

  consultardetalle() {
    this.contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.informacionEmpleado = respuesta;
        this.ciudadSeleccionada = respuesta.ciudad_nombre;
        this.formularioEmpleado.patchValue({
          numero_identificacion: respuesta.numero_identificacion,
          digito_verificacion: respuesta.digito_verificacion,
          identificacion: respuesta.identificacion_id,
          codigo: respuesta.codigo,
          nombre_corto: respuesta.nombre_corto,
          nombre1: respuesta.nombre1,
          nombre2: respuesta.nombre2,
          apellido1: respuesta.apellido1,
          apellido2: respuesta.apellido2,
          ciudad: respuesta.ciudad_id,
          ciudad_nombre: `${respuesta.ciudad_nombre}-${respuesta.departamento_nombre}`,
          banco_nombre: respuesta.banco_nombre,
          banco: respuesta.banco_id,
          numero_cuenta: respuesta.numero_cuenta,
          direccion: respuesta.direccion,
          telefono: respuesta.telefono,
          celular: respuesta.celular,
          correo: respuesta.correo,
          tipo_persona: respuesta.tipo_persona_id,
          regimen: respuesta.regimen_id,
          barrio: respuesta.barrio,
          codigo_ciuu: respuesta.codigo_ciuu,
          precio: respuesta.precio_id,
          plazo_pago: respuesta.plazo_pago_id,
          plazo_pago_proveedor: respuesta.plazo_pago_proveedor_id,
          asesor: respuesta.asesor_id,
          cliente: respuesta.cliente,
          proveedor: respuesta.proveedor,
          cuenta_banco_clase: respuesta.cuenta_banco_clase_id,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  validarNumeroIdenficacionExistente() {
    if (this.detalle) {
      if (
        parseInt(this.informacionEmpleado.numero_identificacion) !==
        parseInt(
          this.formularioEmpleado.get('numero_identificacion')!.value
        ) ||
        parseInt(this.informacionEmpleado.identificacion_id) !==
        parseInt(this.formularioEmpleado.get('identificacion')!.value)
      ) {
        this.contactoService
          .validarNumeroIdentificacion({
            identificacion_id: parseInt(
              this.formularioEmpleado.get('identificacion')!.value
            ),
            numero_identificacion: this.formularioEmpleado.get(
              'numero_identificacion'
            )!.value,
          })
          .subscribe((respuesta) => {
            if (respuesta.validacion) {
              this.formularioEmpleado
                .get('numero_identificacion')!
                .markAsTouched();
              this.formularioEmpleado
                .get('numero_identificacion')!
                .setErrors({ numeroIdentificacionExistente: true });
            } else {
              this.formularioEmpleado
                .get('numero_identificacion')!
                .setErrors(null);
            }
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.formularioEmpleado.get('numero_identificacion')!.setErrors(null);
      }
    } else {
      if (this.formularioEmpleado.get('numero_identificacion')!.value !== '') {
        this.contactoService
          .validarNumeroIdentificacion({
            identificacion_id: parseInt(
              this.formularioEmpleado.get('identificacion')!.value
            ),
            numero_identificacion: this.formularioEmpleado.get(
              'numero_identificacion'
            )!.value,
          })
          .subscribe((respuesta) => {
            if (respuesta.validacion) {
              this.formularioEmpleado
                .get('numero_identificacion')!
                .setErrors({ numeroIdentificacionExistente: true });
            } else {
              this.formularioEmpleado
                .get('numero_identificacion')!
                .setErrors(null);
            }
            this.changeDetectorRef.detectChanges();
          });
      }
    }
  }

  limpiarCiudad(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioEmpleado.controls['ciudad'].setValue(null);
      this.formularioEmpleado.controls['ciudad_nombre'].setValue(null);
    }
  }
}
