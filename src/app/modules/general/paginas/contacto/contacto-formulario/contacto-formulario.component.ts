import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
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
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { GeneralService } from '@comun/services/general.service';
import { cambiarVacioPorNulo } from '@comun/validaciones/campo-no-obligatorio.validator';
import { MultiplesEmailValidator } from '@comun/validaciones/multiples-email-validator';
import { CampoNoCeroValidator } from '@comun/validaciones/campo-cero.validator';
import { RegistroAutocompletarGenAsesor } from '@interfaces/comunes/autocompletar/general/gen-asesor.interface';
import { RegistroAutocompletarGenBanco } from '@interfaces/comunes/autocompletar/general/gen-banco.interface';
import { RegistroAutocompletarGenCiudad } from '@interfaces/comunes/autocompletar/general/gen-ciudad.interface';
import { RegistroAutocompletarGenCuentaBancoClase } from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { RegistroAutocompletarGenIdentificacion } from '@interfaces/comunes/autocompletar/general/gen-identificacion.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { RegistroAutocompletarGenPrecio } from '@interfaces/comunes/autocompletar/general/gen-precio.interface';
import { RegistroAutocompletarGenRegimen } from '@interfaces/comunes/autocompletar/general/gen-regimen.interface';
import { RegistroAutocompletarGenTipoPersona } from '@interfaces/comunes/autocompletar/general/gen-tipo-persona.interface';
import { Contacto } from '@interfaces/general/contacto';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { ContactoService } from '@modulos/general/servicios/contacto.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { provideNgxMask } from 'ngx-mask';
import {
  asyncScheduler,
  debounceTime,
  Subject,
  takeUntil,
  tap,
  throttleTime,
  zip,
} from 'rxjs';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';

@Component({
  selector: 'app-contacto-formulario',
  standalone: true,
  templateUrl: './contacto-formulario.component.html',
  styleUrls: ['./contacto-formulario.component.scss'],
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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    SoloNumerosDirective,
    CardComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    InputValueCaseDirective,
  ],
  providers: [provideNgxMask()],
})
export default class ContactoFormularioComponent
  extends General
  implements OnInit, OnDestroy {
  formularioContacto: FormGroup;
  informacionContacto: any;
  arrCiudades: any[];
  arrIdentificacion: RegistroAutocompletarGenIdentificacion[];
  arrIdentificacionSignal = signal<RegistroAutocompletarGenIdentificacion[]>(
    [],
  );
  // Signal para controlar el estado de carga del botón autocompletar
  isAutocompleteLoading = signal<boolean>(false);
  arrTipoPersona: any[];
  arrBancos: any[];
  arrCuentasBancos: any[];
  arrRegimen: any[];
  arrAsesores: any[];
  arrPrecios: any[];
  arrPagos: any[];
  ciudadSeleccionada: any | null;
  filtroIdentificacionSignal = signal(1);
  identificacionIdApiDetalleSignal = signal(0);
  campoTipo = signal<'text' | 'number'>('number');

  filteredIdentificacionSignal = computed(() =>
    this.arrIdentificacionSignal().filter(
      (item) => item.tipo_persona === this.filtroIdentificacionSignal(),
    ),
  );

  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Input() esCliente = true;
  @Input() esProvedor = false;
  @Output() emitirGuardoRegistro: EventEmitter<Contacto> = new EventEmitter();
  @ViewChild(NgbDropdown, { static: true })
  public ciudadDropdown: NgbDropdown;
  @ViewChild('inputNombre1', { read: ElementRef })
  inputNombre1: ElementRef<HTMLInputElement>;
  @ViewChild('inputNombreCorto', { read: ElementRef })
  inputNombreCorto: ElementRef<HTMLInputElement>;
  private readonly _generalService = inject(GeneralService);
  private readonly _contactoService = inject(ContactoService);
  private readonly _configModuleService = inject(ConfigModuleService);
  private _destroy$ = new Subject<void>();
  private _rutas: Rutas | undefined;

  selectedDateIndex: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener();
    this.iniciarFormulario();
    this.consultarInformacion();
    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }
    this._iniciarSuscripcionesFormularioContacto();
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

  // ngAfterViewInit(): void {
  //   if (this.inputNombreCorto?.nativeElement.value === '') {
  //     this.inputNombreCorto?.nativeElement.focus();
  //   }
  // }

  private _iniciarSuscripcionesFormularioContacto() {
    this.formularioContacto
      .get('numero_identificacion')!
      .valueChanges.pipe(debounceTime(300))
      .subscribe((value) => {
        if (value !== null) {
          this._validarNumeroIdenficacionExistente();
        }
      });

    this.formularioContacto
      .get('identificacion')!
      .valueChanges.subscribe((value) => {
        this.actualizarValidacionNumeroIdentificacion(parseInt(value));
        this._validarNumeroIdenficacionExistente();
      });
  }

  private _validarNumeroIdenficacionExistente() {
    if (!this.detalle) {
      this._consultarIdentificacionEnServicio();
    } else {
      this._procesarValidacionNumeroIdentificacion();
    }
  }

  private _procesarValidacionNumeroIdentificacion() {
    if (!this._seHanModificadoDatosDeIdentificacion()) {
      // No hay errores si los datos no han cambiado
      this.formularioContacto.get('numero_identificacion')!.setErrors(null);
      return;
    }

    // Si los datos han cambiado, consulta al servicio
    this._consultarIdentificacionEnServicio();
  }

  private _seHanModificadoDatosDeIdentificacion() {
    if (!this.informacionContacto) {
      return false; // o true, dependiendo de tu lógica
    }

    const numeroIdentificacion = this.formularioContacto.get('numero_identificacion')?.value;
    const identificacion = this.formularioContacto.get('identificacion')?.value;

    const numeroIdentificacionCambio =
      this.informacionContacto.numero_identificacion !== numeroIdentificacion

    const identificacionIdCambio =
      parseInt(this.informacionContacto.identificacion_id) !== parseInt(identificacion);

    return numeroIdentificacionCambio || identificacionIdCambio;
  }

  private _consultarIdentificacionEnServicio() {
    const identificacionId = parseInt(
      this.formularioContacto.get('identificacion')?.value,
    );
    const numeroIdentificacion = this.formularioContacto.get(
      'numero_identificacion',
    )?.value;

    if (!identificacionId || !numeroIdentificacion) {
      return; // Salir si no hay valores para validar
    }

    this._contactoService
      .validarNumeroIdentificacion({
        identificacion_id: identificacionId,
        numero_identificacion: numeroIdentificacion,
      })
      .subscribe({
        next: (respuesta) => {
          this._actualizarErroresNumeroIdentificacion(respuesta.validacion);
        },
      });
  }

  private _actualizarErroresNumeroIdentificacion(esValido: boolean) {
    const errores: { numeroIdentificacionExistente: boolean } | null = esValido
      ? { numeroIdentificacionExistente: true }
      : null;

    this.formularioContacto.get('numero_identificacion')!.setErrors(errores);
    this.formularioContacto.get('numero_identificacion')!.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  trackByFn(index: number, item: any) {
    return index; // or unique identifier of your item
  }

  selectNext(event: any) {
    event.preventDefault();
    this.selectedDateIndex =
      (this.selectedDateIndex + 1) % this.arrCiudades.length;
    if (isNaN(this.selectedDateIndex)) {
      this.selectedDateIndex = -1;
    } else {
      if (this.arrCiudades[this.selectedDateIndex]) {
        this.modificarCampoFormulario(
          'ciudad',
          this.arrCiudades[this.selectedDateIndex],
        );
      }
    }
    this.ciudadDropdown.open();
  }

  selectPrevious(event: any) {
    event.preventDefault();
    this.selectedDateIndex =
      (this.selectedDateIndex - 1 + this.arrCiudades.length) %
      this.arrCiudades.length;
    if (isNaN(this.selectedDateIndex)) {
      this.selectedDateIndex = -1;
    } else {
      if (this.arrCiudades[this.selectedDateIndex]) {
        this.modificarCampoFormulario(
          'ciudad',
          this.arrCiudades[this.selectedDateIndex],
        );
      }
    }
    this.ciudadDropdown.open();
  }

  iniciarFormulario() {
    // if (this.parametrosUrl?.dataPersonalizada !== undefined) {
    //   let dataPersonalizada = JSON.parse(this.parametrosUrl?.dataPersonalizada);
    //   if (dataPersonalizada) {
    //     this.esProvedor = dataPersonalizada?.proveedor === 'si';
    //     this.esCliente = dataPersonalizada?.cliente === 'si';
    //   }
    // }

    this.formularioContacto = this.formBuilder.group(
      {
        numero_identificacion: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[0-9]+$/),
            CampoNoCeroValidator.validar,
          ]),
        ],
        digito_verificacion: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(1)]),
        ],
        identificacion: ['', Validators.compose([Validators.required])],
        nombre_corto: [
          null,
          Validators.compose([Validators.maxLength(200), Validators.required]),
        ],
        nombre1: [
          null,
          Validators.compose([
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            Validators.maxLength(50),
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
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
        correo: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(255)]),
        ],
        ciudad_nombre: [''],
        ciudad: ['', Validators.compose([Validators.required])],
        telefono: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        celular: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(50)]),
        ],
        tipo_persona: [1, Validators.compose([Validators.required])],
        regimen: [1, Validators.compose([Validators.required])],
        barrio: [null, Validators.compose([Validators.maxLength(200)])],
        precio: [null],
        plazo_pago: [1, Validators.compose([Validators.required])],
        plazo_pago_proveedor: [1],
        asesor: [null],
        cliente: [this.esCliente],
        proveedor: [this.esProvedor],
        banco_nombre: [''],
        banco: [''],
        empleado: [false],
        numero_cuenta: [
          '',
          [Validators.maxLength(20), cambiarVacioPorNulo.validar],
        ],
        cuenta_banco_clase: [''],
        correo_facturacion_electronica: [
          '',
          [Validators.maxLength(255), cambiarVacioPorNulo.validar],
        ],
      },
      {
        validator: [
          MultiplesEmailValidator.validarCorreos([
            'correo',
            'correo_facturacion_electronica',
          ]),
        ],
      },
    );

    this.formularioContacto
      .get('apellido2')
      ?.valueChanges.subscribe((valor) => {
        if (valor === '') {
          this.formularioContacto.get('apellido2')?.setValue(null);
        }
      });
  }

  get obtenerFormularioCampos() {
    return this.formularioContacto.controls;
  }

  actualizarNombreCorto() {
    let nombreCorto = '';
    const nombre1 = this.formularioContacto.get('nombre1')?.value;
    const nombre2 = this.formularioContacto.get('nombre2')?.value;
    const apellido1 = this.formularioContacto.get('apellido1')?.value;
    const apellido2 = this.formularioContacto.get('apellido2')?.value;

    nombreCorto = `${nombre1}`;
    if (nombre2 !== null) {
      nombreCorto += ` ${nombre2}`;
    }
    nombreCorto += ` ${apellido1}`;
    if (apellido2 !== null) {
      nombreCorto += ` ${apellido2}`;
    }

    this.formularioContacto
      .get('nombre_corto')
      ?.patchValue(nombreCorto, { emitEvent: false });
  }

  private setValidators(fieldName: string, validators: any[]) {
    const control = this.formularioContacto.get(fieldName);
    control?.clearValidators();
    control?.setValidators(validators);
    control?.updateValueAndValidity();
  }

  tipoPersonaSeleccionado($event: any) {
    let valorPersonaTipo = parseInt($event.target.value);
    this.filtroIdentificacionSignal.update(() => valorPersonaTipo);
    if (valorPersonaTipo === 1) {
      //1 es igual a juridico
      this.setValidators('nombre1', [
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this.setValidators('apellido1', [
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this.setValidators('nombre_corto', [
        Validators.required,
        Validators.maxLength(200),
      ]);
      if (this.accion === 'nuevo') {
        this.formularioContacto.patchValue({
          nombre1: null,
          nombre2: null,
          apellido1: null,
          apellido2: null,
          identificacion: this.filteredIdentificacionSignal()[0].id,
        });
      } else {
        this.formularioContacto.patchValue({
          identificacion: this.filteredIdentificacionSignal()[0].id,
        });
      }
    } else {
      //2 es natural
      this.setValidators('nombre1', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this.setValidators('apellido1', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
        Validators.maxLength(50),
      ]);
      this.setValidators('nombre_corto', [Validators.maxLength(200)]);
      if (this.accion === 'nuevo') {
        this.formularioContacto.patchValue({
          identificacion: this.filteredIdentificacionSignal()[0].id,
        });
      }
      if (this.accion === 'editar') {
        this.formularioContacto.patchValue({
          identificacion: this.identificacionIdApiDetalleSignal(),
        });
      }
    }
    this.formularioContacto.patchValue({
      tipo_persona: valorPersonaTipo,
    });
  }

  enviarFormulario() {
    if (this.formularioContacto.valid) {
      if (this.formularioContacto.get('tipo_persona')?.value == 2) {
        this.actualizarNombreCorto();
      }
      if (this.detalle && this.ocultarBtnAtras === false) {
        if (this.formularioContacto.get('tipo_persona')?.value == 1) {
          this.formularioContacto.patchValue({
            nombre1: null,
            nombre2: null,
            apellido1: null,
            apellido2: null,
          });
        }

        this._contactoService
          .actualizarDatosContacto(this.detalle, this.formularioContacto.value)
          .subscribe((respuesta) => {
            this.formularioContacto.patchValue({
              numero_identificacion: respuesta.numero_identificacion,
              identificacion: respuesta.identificacion_id,
              codigo: respuesta.codigo,
              nombre_corto: respuesta.nombre_corto,
              nombre1: respuesta.nombre1,
              nombre2: respuesta.nombre2,
              apellido1: respuesta.apellido1,
              apellido2: respuesta.apellido2,
              ciudad: respuesta.ciudad_id,
              ciudad_nombre: respuesta.ciudad_nombre,
              direccion: respuesta.direccion,
              telefono: respuesta.telefono,
              celular: respuesta.celular,
              correo: respuesta.correo,
              tipo_persona: respuesta.tipo_persona_id,
              regimen: respuesta.regimen_id,
              barrio: respuesta.barrio,
              cliente: respuesta.cliente,
              proveedor: respuesta.proveedor,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate(
                [`${this._rutas?.detalle}/${respuesta.id}`],
                {
                  queryParams: {
                    ...parametro,
                  },
                },
              );
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this._contactoService
          .guardarContacto(this.formularioContacto.value)
          .pipe(
            tap((respuesta) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              if (this.ocultarBtnAtras) {
                this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
              } else {
                this.activatedRoute.queryParams.subscribe((parametro) => {
                  this.router.navigate(
                    [`${this._rutas?.detalle}/${respuesta.id}`],
                    {
                      queryParams: {
                        ...parametro,
                      },
                    },
                  );
                });
              }
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioContacto.markAllAsTouched();
    }
  }

  consultarCiudad(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenCiudad>(
        'general/ciudad/seleccionar/',
        { nombre__icontains: `${event?.target.value}` },
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrCiudades = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<
        RegistroAutocompletarGenIdentificacion[]
      >('general/identificacion/seleccionar/'),
      this._generalService.consultaApi<RegistroAutocompletarGenRegimen[]>(
        'general/regimen/seleccionar/', {
        inactivo: 'False'
      }
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenTipoPersona[]>(
        'general/tipo_persona/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenPrecio[]>(
        'general/precio/seleccionar/',
        { venta: 'True' }
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenAsesor[]>(
        'general/asesor/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenPlazoPago[]>(
        'general/plazo_pago/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenBanco[]>(
        'general/banco/seleccionar/',
          { limit: 50 }
      ),
      this._generalService.consultaApi<
        RegistroAutocompletarGenCuentaBancoClase[]
      >('general/cuenta_banco_clase/seleccionar/'),
    ).subscribe((respuesta: any) => {

      this.arrIdentificacionSignal.set(respuesta[0]);
      this.arrIdentificacion = respuesta[0];
      this.arrRegimen = respuesta[1];
      this.arrTipoPersona = respuesta[2];
      this.arrPrecios = respuesta[3];
      this.arrAsesores = respuesta[4];
      this.arrPagos = respuesta[5];
      this.arrBancos = respuesta[6];
      this.arrCuentasBancos = respuesta[7];
      this.changeDetectorRef.detectChanges();
      this.formularioContacto.patchValue({
        identificacion: this.filteredIdentificacionSignal()[0].id,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioContacto?.markAsDirty();
    this.formularioContacto?.markAsTouched();
    if (campo === 'ciudad') {
      if (dato === null) {
        this.formularioContacto.get('ciudad_nombre')?.setValue(null);
        this.formularioContacto.get('ciudad')?.setValue(null);
        this.ciudadSeleccionada = null;
      } else {
        this.ciudadSeleccionada = dato.nombre;
        this.formularioContacto
          .get('ciudad_nombre')
          ?.setValue(`${dato.nombre} - ${dato.estado__nombre}`);
        this.formularioContacto.get('ciudad')?.setValue(dato.id);
      }
    }
    if (campo === 'ciudad_nombre') {
      this.formularioContacto.get('ciudad_nombre')?.setValue(dato);
    }
    if (campo === 'barrio') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
    }
    if (campo === 'nombre2') {
      if (this.formularioContacto.get(campo)?.value === '') {
        this.formularioContacto.get(campo)?.setValue(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this._contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.informacionContacto = respuesta;
        this.ciudadSeleccionada = respuesta.ciudad_nombre;

        this.cambiarTipoCampo(respuesta.identificacion_id);

        this.changeDetectorRef.detectChanges();

        this.formularioContacto.patchValue({
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
          direccion: respuesta.direccion,
          telefono: respuesta.telefono,
          celular: respuesta.celular,
          correo: respuesta.correo,
          tipo_persona: respuesta.tipo_persona_id,
          regimen: respuesta.regimen_id,
          barrio: respuesta.barrio,
          precio: respuesta.precio_id,
          plazo_pago: respuesta.plazo_pago_id,
          plazo_pago_proveedor: parseInt(respuesta.plazo_pago_proveedor_id),
          asesor: respuesta.asesor_id,
          cliente: respuesta.cliente,
          proveedor: respuesta.proveedor,
          empleado: respuesta.empleado,
          correo_facturacion_electronica:
            respuesta.correo_facturacion_electronica,
          cuenta_banco_clase: respuesta.cuenta_banco_clase_id,
          banco_nombre: respuesta.banco_nombre,
          banco: respuesta.banco_id,
          numero_cuenta: respuesta.numero_cuenta,
        });
        this.identificacionIdApiDetalleSignal.update(
          () => respuesta.identificacion_id,
        );
        this.filtroIdentificacionSignal.update(() => respuesta.tipo_persona_id);

        this.actualizarValidacionNumeroIdentificacion(parseInt(respuesta.identificacion_id));

        if (respuesta.tipo_persona_id === 1) {
          //1 es igual a juridico
          this.setValidators('nombre1', [
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            Validators.maxLength(50),
          ]);
          this.setValidators('apellido1', [
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
            Validators.maxLength(50),
          ]);
          this.setValidators('nombre_corto', [
            Validators.required,
            Validators.maxLength(200),
          ]);
          this.formularioContacto.patchValue({
            nombre1: null,
            nombre2: null,
            apellido1: null,
            apellido2: null,
          });
        } else {
          //2 natural
          setTimeout(() => {
            this.inputNombre1?.nativeElement.focus();
          }, 1);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  calcularDigitoVerificacion() {
    // No calcular dígito de verificación para pasaporte
    if (this.esPasaporte()) {
      this.formularioContacto.patchValue({
        digito_verificacion: 0,
      });
      return;
    }

    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContacto.get('numero_identificacion')?.value,
    );
    this.formularioContacto.patchValue({
      digito_verificacion: digito,
    });
  }

  private procesarNombre(nombreCompleto: string): string | string[] {
    const partes = nombreCompleto
      .split(' ')
      .filter((parte) => parte.trim() !== '');

    if (partes.length < 4) {
      return nombreCompleto;
    } else {
      return partes;
    }
  }

  autocompletar() {
    const numeroIdentificacion = this.formularioContacto.get(
      'numero_identificacion',
    )?.value;
    const tipoidentificacion =
      this.formularioContacto.get('identificacion')?.value;

    // Activar el estado de carga
    this.isAutocompleteLoading.set(true);

    this._contactoService
      .autocompletar({
        nit: numeroIdentificacion,
        identificacion_id: tipoidentificacion,
      })
      .subscribe({
        next: (respuesta) => {
          if (respuesta.encontrado) {
            if (this.formularioContacto.get('tipo_persona')?.value === 2) {
              this.formularioContacto.patchValue({
                nombre1: respuesta.nombre,
                correo: null,
                correo_facturacion_electronica: respuesta.correo,
              });
            } else {
              this.formularioContacto.patchValue({
                nombre_corto: respuesta.nombre,
                correo: respuesta.correo,
                correo_facturacion_electronica: respuesta.correo,
              });
            }
            this.changeDetectorRef.detectChanges();
          }
          // Desactivar el estado de carga cuando se completa la petición
          this.isAutocompleteLoading.set(false);
        },
        error: () => {
          // Desactivar el estado de carga en caso de error
          this.isAutocompleteLoading.set(false);
        }
      });
  }

  limpiarCiudad(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContacto.controls['ciudad'].setValue(null);
      this.formularioContacto.controls['ciudad_nombre'].setValue(null);
    }
  }

  actualizarValidacionNumeroIdentificacion(tipoIdentificacionId: number): void {
    const numeroIdentificacionControl = this.formularioContacto.get(
      'numero_identificacion',
    );
    const valorActual = numeroIdentificacionControl?.value;

    // Limpiar errores antes de cambiar validaciones
    numeroIdentificacionControl?.setErrors(null);

    if (tipoIdentificacionId === 7) {
      // Pasaporte: permite letras y números
      this.campoTipo.set('text')
      numeroIdentificacionControl?.setValidators([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
        CampoNoCeroValidator.validar
      ]);

      // Establecer dígito de verificación en 0 para pasaporte
      this.formularioContacto.patchValue({
        digito_verificacion: 0,
      }, { emitEvent: false });
    } else {
      // Otros tipos de identificación: solo números
      this.campoTipo.set('number')
      numeroIdentificacionControl?.setValidators([
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[0-9]+$/),
        CampoNoCeroValidator.validar
      ]);

      // Si el valor actual contiene letras, limpiarlo
      if (valorActual && /[a-zA-Z]/.test(valorActual)) {
        numeroIdentificacionControl?.setValue('', { emitEvent: false });
        numeroIdentificacionControl?.markAsUntouched();
        numeroIdentificacionControl?.markAsPristine();
      }

      // Recalcular dígito de verificación si hay un número válido
      if (valorActual && /^[0-9]+$/.test(valorActual)) {
        this.calcularDigitoVerificacion();
      }
    }

    // Actualizar validaciones sin disparar eventos de cambio
    numeroIdentificacionControl?.updateValueAndValidity();
    this.changeDetectorRef.detectChanges()
  }

  esPasaporte(): boolean {
    return (
      this.formularioContacto.get('identificacion')?.value === 7 ||
      this.formularioContacto.get('identificacion')?.value === '7'
    );
  }

  cambiarTipoCampo(tipoIdentificacionId: number) {
    if (tipoIdentificacionId === 7) {
      this.campoTipo.set('text');
    } else {
      this.campoTipo.set('number');
    }
  }
}
