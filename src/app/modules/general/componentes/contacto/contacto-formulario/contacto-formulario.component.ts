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
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { GeneralService } from '@comun/services/general.service';
import { MultiplesEmailValidator } from '@comun/validaciones/multiples-email-validator';
import {
  RegistroAutocompletarGenAsesor,
  RegistroAutocompletarGenCiudad,
  RegistroAutocompletarGenIdentificacion,
  RegistroAutocompletarGenPlazoPago,
  RegistroAutocompletarGenPrecio,
  RegistroAutocompletarGenRegimen,
  RegistroAutocompletarGenTipoPersona,
} from '@interfaces/comunes/autocompletar/autocompletar';
import { ContactoService } from '@modulos/general/servicios/contacto.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { ParametrosFiltros } from '@interfaces/comunes/filtros';

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
        })
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
    NgxMaskDirective,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
  providers: [provideNgxMask()],
})
export default class ContactDetalleComponent extends General implements OnInit {
  formularioContacto: FormGroup;
  arrCiudades: any[];
  arrIdentificacion: any[];
  arrTipoPersona: any[];
  arrRegimen: any[];
  arrAsesores: any[];
  arrPrecios: any[];
  arrPagos: any[];
  ciudadSeleccionada: string | null;
  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Input() esCliente = true;
  @Input() esProvedor = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild(NgbDropdown, { static: true })
  public ciudadDropdown: NgbDropdown;
  private readonly _generalService = inject(GeneralService);

  selectedDateIndex: number = -1;

  constructor(
    private formBuilder: FormBuilder,
    private contactoService: ContactoService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }
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
          this.arrCiudades[this.selectedDateIndex]
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
          this.arrCiudades[this.selectedDateIndex]
        );
      }
    }
    this.ciudadDropdown.open();
  }

  iniciarFormulario() {
    if (this.parametrosUrl?.dataPersonalizada !== undefined) {
      let dataPersonalizada = JSON.parse(this.parametrosUrl?.dataPersonalizada);
      if (dataPersonalizada) {
        this.esProvedor = dataPersonalizada?.proveedor === 'si';
        this.esCliente = dataPersonalizada?.cliente === 'si';
      }
    }

    this.formularioContacto = this.formBuilder.group(
      {
        numero_identificacion: [
          '',
          Validators.compose([
            Validators.required,
            Validators.maxLength(20),
            Validators.pattern(/^[0-9]+$/),
          ]),
        ],
        digito_verificacion: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(1)]),
        ],
        identificacion: ['', Validators.compose([Validators.required])],
        nombre_corto: [null, Validators.compose([Validators.maxLength(200)])],
        nombre1: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
          ]),
        ],
        nombre2: [
          null,
          Validators.compose([
            Validators.maxLength(50),
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
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
        tipo_persona: ['', Validators.compose([Validators.required])],
        regimen: ['', Validators.compose([Validators.required])],
        codigo_ciuu: [null, Validators.compose([Validators.maxLength(200)])],
        barrio: [null, Validators.compose([Validators.maxLength(200)])],
        precio: [null],
        plazo_pago: [1, Validators.compose([Validators.required])],
        plazo_pago_proveedor: [1],
        asesor: [null],
        cliente: [this.esCliente],
        proveedor: [this.esProvedor],
        empleado: [false],
      },
      {
        validator: [MultiplesEmailValidator.validarCorreos],
      }
    );
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
    if (valorPersonaTipo === 1) {
      //1 es igual a juridico
      this.setValidators('nombre1', [Validators.pattern(/^[a-zA-ZÑñ ]+$/)]);
      this.setValidators('apellido1', [Validators.pattern(/^[a-zA-ZÑñ ]+$/)]);
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
        });
      }
    } else {
      //2 es natural
      this.setValidators('nombre1', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
      ]);
      this.setValidators('apellido1', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZÑñ ]+$/),
      ]);
      this.setValidators('nombre_corto', [Validators.maxLength(200)]);
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
      if (
        this.activatedRoute.snapshot.queryParams['detalle'] &&
        this.ocultarBtnAtras === false
      ) {
        this.contactoService
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
              codigo_ciuu: respuesta.codigo_ciuu,
              barrio: respuesta.barrio,
              cliente: respuesta.cliente,
              proveedor: respuesta.proveedor,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.contactoService
          .guardarContacto(this.formularioContacto.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              if (this.ocultarBtnAtras) {
                this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
              } else {
                this.activatedRoute.queryParams.subscribe((parametro) => {
                  this.router.navigate([`/administrador/detalle`], {
                    queryParams: {
                      ...parametro,
                      detalle: respuesta.id,
                    },
                  });
                });
              }
            })
          )
          .subscribe();
      }
    } else {
      this.formularioContacto.markAllAsTouched();
    }
  }

  consultarCiudad(event: any) {
    let arrFiltros: ParametrosFiltros = {
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
      )
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.arrRegimen = respuesta[1].registros;
      this.arrTipoPersona = respuesta[2].registros;
      this.arrPrecios = respuesta[3].registros;
      this.arrAsesores = respuesta[4].registros;
      this.arrPagos = respuesta[5].registros;
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
          ?.setValue(`${dato.nombre} - ${dato.estado_nombre}`);
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
    if (campo === 'codigo_ciuu') {
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
    this.contactoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.ciudadSeleccionada = respuesta.ciudad_nombre;
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
          codigo_ciuu: respuesta.codigo_ciuu,
          precio: respuesta.precio_id,
          plazo_pago: respuesta.plazo_pago_id,
          plazo_pago_proveedor: parseInt(respuesta.plazo_pago_proveedor_id),
          asesor: respuesta.asesor_id,
          cliente: respuesta.cliente,
          proveedor: respuesta.proveedor,
          empleado: respuesta.empleado,
        });

        if (respuesta.tipo_persona_id === 1) {
          //1 es igual a juridico
          this.setValidators('nombre1', [Validators.pattern(/^[a-zA-ZÑñ ]+$/)]);
          this.setValidators('apellido1', [
            Validators.pattern(/^[a-zA-ZÑñ ]+$/),
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
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  calcularDigitoVerificacion() {
    let digito = this.devuelveDigitoVerificacionService.digitoVerificacion(
      this.formularioContacto.get('numero_identificacion')?.value
    );
    this.formularioContacto.patchValue({
      digito_verificacion: digito,
    });
  }

  limpiarCiudad(event: Event): void {
    const input = (event.target as HTMLInputElement).value;

    if (!input.trim()) {
      this.formularioContacto.controls['ciudad'].setValue(null);
      this.formularioContacto.controls['ciudad_nombre'].setValue(null);
    }
  }
}
